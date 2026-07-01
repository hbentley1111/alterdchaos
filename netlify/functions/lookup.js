/* netlify/functions/lookup.js
   Server-side property lookup for the Flip and Lot analyzers. Takes an address
   (or a listing URL it extracts the address from) and, based on ?type=:
     - flip (default) → RentCast AVM: subject attributes + sold comps
     - lot            → RentCast property record: lot size, zoning, county

   Why this runs on the server, not in the app:
     - The RentCast API key must stay secret. In a client-side app anyone could
       read it from the network tab; here it lives only in this function.
     - Listing sites (Zillow/Redfin/Realtor) block cross-origin browser calls,
       so the app can't fetch them directly anyway.

   Setup:
     1. Get a free key at https://app.rentcast.io/app/api (50 lookups/month, no card).
     2. In Netlify: Site configuration > Environment variables >
        add RENTCAST_API_KEY = your-key
     3. Deploy from Git or with `netlify deploy` (functions don't run on
        drag-and-drop deploys). The app calls this at /api/lookup.

   RentCast docs: https://developers.rentcast.io/reference/value-estimate */

const AVM_URL = "https://api.rentcast.io/v1/avm/value";
const PROPERTIES_URL = "https://api.rentcast.io/v1/properties";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const ok = (data) => ({ statusCode: 200, headers: CORS, body: JSON.stringify(data) });
const err = (statusCode, message) => ({ statusCode, headers: CORS, body: JSON.stringify({ error: message }) });

/* One RentCast GET with a hard timeout so a hung upstream fails fast. */
async function rcGet(url, key) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { headers: { "X-Api-Key": key, Accept: "application/json" }, signal: ctrl.signal });
    const data = await res.json();
    return { res, data };
  } finally {
    clearTimeout(timer);
  }
}

/* Pull a "Street, City, State, Zip" address out of raw user input. If it's not
   a URL we pass it straight through. URL parsing is best-effort — the returned
   address stays editable in the app, and RentCast echoes back the resolved
   address it actually matched. */
function toAddress(raw) {
  const input = (raw || "").trim();
  if (!input) return "";
  if (!/^https?:\/\//i.test(input)) return input; // already an address

  let path = "";
  try {
    path = new URL(input).pathname;
  } catch (_) {
    return input;
  }
  const segs = path.split("/").filter(Boolean);
  const deHyphen = (s) => {
    let d = s;
    try { d = decodeURIComponent(s); } catch (_) {} // tolerate stray % in pasted URLs
    return d.replace(/-/g, " ").trim();
  };

  // Realtor.com: /realestateandhomes-detail/5500-Grand-Lake-Dr_San-Antonio_TX_78244_M00000-00000
  if (/realtor\.com/i.test(input)) {
    const slug = segs[segs.length - 1] || "";
    const parts = slug.split("_").filter((p) => !/^M\d/i.test(p)); // drop the listing id
    if (parts.length >= 3) return parts.map(deHyphen).join(", ");
  }

  // Redfin: /TX/San-Antonio/5500-Grand-Lake-Dr-78244/home/12345
  if (/redfin\.com/i.test(input)) {
    const homeIdx = segs.indexOf("home");
    if (homeIdx >= 3) {
      const streetZip = deHyphen(segs[homeIdx - 1]); // "5500 Grand Lake Dr 78244"
      const city = deHyphen(segs[homeIdx - 2]);
      const state = segs[homeIdx - 3];
      const m = streetZip.match(/^(.*?)\s+(\d{5})$/);
      if (m) return `${m[1]}, ${city}, ${state}, ${m[2]}`;
      return `${streetZip}, ${city}, ${state}`;
    }
  }

  // Zillow: /homedetails/5500-Grand-Lake-Dr-San-Antonio-TX-78244/12345_zpid/
  //   the street/city boundary isn't recoverable from the slug, so de-hyphenate
  //   the whole thing and let RentCast's geocoder resolve it.
  const homedetails = segs.indexOf("homedetails");
  if (homedetails >= 0 && segs[homedetails + 1]) return deHyphen(segs[homedetails + 1]);

  // Generic fallback: the address-looking segment (has a number and hyphens).
  const candidate = segs
    .filter((s) => /\d/.test(s) && s.includes("-"))
    .sort((a, b) => b.length - a.length)[0];
  return candidate ? deHyphen(candidate) : input;
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };

  const key = process.env.RENTCAST_API_KEY;
  if (!key) return err(500, "Property lookup isn't configured yet — set RENTCAST_API_KEY in your Netlify environment variables.");

  const raw = event.queryStringParameters && event.queryStringParameters.q;
  const address = toAddress(raw);
  if (!address) return err(400, "Enter a property address or a listing URL.");

  const type = event.queryStringParameters && event.queryStringParameters.type === "lot" ? "lot" : "flip";

  // ---- Lot: pull the parcel record (lot size, zoning, county) ----
  if (type === "lot") {
    let res, data;
    try {
      ({ res, data } = await rcGet(`${PROPERTIES_URL}?address=${encodeURIComponent(address)}&limit=1`, key));
    } catch (_) {
      return err(502, "Couldn't reach the property data service. Try again in a moment.");
    }
    if (res.status === 429) return err(429, "Property lookups are rate-limited right now — wait a moment and try again.");
    if (res.status === 401) return err(502, "The RentCast API key was rejected — check RENTCAST_API_KEY in Netlify.");
    const rec = Array.isArray(data) ? data[0] : data && data.id ? data : null;
    if (res.status === 404 || !rec) {
      return err(404, `No parcel record for "${address}". Land records are spottier than homes — try the full Street, City, State, Zip, or enter the details manually.`);
    }
    if (!res.ok) return err(502, (data && data.message) || "Parcel lookup failed.");
    return ok({
      type: "lot",
      resolvedAddress: rec.formattedAddress || address,
      lotSize: rec.lotSize || null,
      zoning: rec.zoning || null,
      county: rec.county || null,
      propertyType: rec.propertyType || null,
      lastSalePrice: rec.lastSalePrice || null,
      lastSaleDate: rec.lastSaleDate || null,
    });
  }

  // ---- Flip (default): home valuation + sold comps ----
  let res, data;
  try {
    ({ res, data } = await rcGet(`${AVM_URL}?address=${encodeURIComponent(address)}&compCount=8`, key));
  } catch (_) {
    return err(502, "Couldn't reach the property data service. Try again in a moment.");
  }

  if (res.status === 429) return err(429, "Property lookups are rate-limited right now — wait a moment and try again.");

  if (res.status === 401) return err(502, "The RentCast API key was rejected — check RENTCAST_API_KEY in Netlify.");
  if (res.status === 404 || !data || (!data.subjectProperty && !data.comparables)) {
    return err(404, `No match for "${address}". Try typing the full address as Street, City, State, Zip.`);
  }
  if (!res.ok) return err(502, (data && data.message) || "Property lookup failed.");

  const s = data.subjectProperty || {};
  const comps = (data.comparables || [])
    .filter((c) => Number(c.price) > 0 && Number(c.squareFootage) > 0)
    .map((c) => ({
      label: c.formattedAddress || c.addressLine1 || "",
      price: Math.round(Number(c.price)),
      sqft: Math.round(Number(c.squareFootage)),
      dom: c.daysOnMarket != null ? Math.round(Number(c.daysOnMarket)) : "",
    }));

  return ok({
    resolvedAddress: s.formattedAddress || address,
    subject: {
      sqft: s.squareFootage || null,
      beds: s.bedrooms != null ? s.bedrooms : null,
      baths: s.bathrooms != null ? s.bathrooms : null,
      lotSize: s.lotSize || null,
      propertyType: s.propertyType || null,
      yearBuilt: s.yearBuilt || null,
      lastSalePrice: s.lastSalePrice || null,
      lastSaleDate: s.lastSaleDate || null,
    },
    arv: data.price || null,
    arvLow: data.priceRangeLow || null,
    arvHigh: data.priceRangeHigh || null,
    comps,
  });
};
