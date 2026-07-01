# Altar'd Chaos — Estimating Engine

Project estimating + new-build feasibility for a North Carolina general contractor.
Built with React and Vite. No backend required — data is saved in the browser.

---

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
npm install      # install dependencies (one time)
npm run dev      # start the dev server at http://localhost:5173
npm run build    # produce the production build in dist/
npm run preview  # preview the production build locally
```

---

## Deploy to Netlify

Pick whichever path fits you. All three work.

### Option A — Drag and drop (fastest, no tools)
1. Run `npm install` then `npm run build`. This creates a `dist/` folder.
   (A pre-built `dist/` is already included in this package, so you can skip
   straight to step 2 if you don't want to build it yourself.)
2. Go to https://app.netlify.com/drop
3. Drag the **`dist`** folder onto the page.
4. Done — Netlify gives you a live URL. To update later, build again and
   re-drop the new `dist` folder, or use Option B/C for automatic updates.

### Option B — Connect a Git repo (recommended for ongoing updates)
1. Push this folder to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project** and pick the repo.
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. Every push to the repo now redeploys the site.

### Option C — Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --build --prod
```

---

## Property lookup (Flip Analyzer)

The Flip Analyzer has an **Auto-Fill From Listing** box: paste a property address
(or a Zillow / Redfin / Realtor link) and it fills in square footage, beds/baths,
and recent sold comps. This runs through a serverless function (`netlify/functions/lookup.js`)
that calls the [RentCast API](https://www.rentcast.io/api) — the app never holds the key.

**It only works on a Git or CLI deploy** (Option B or C above), not drag-and-drop —
serverless functions don't run in a dropped `dist/` folder. Without it, everything in
the analyzer still works; you just enter the property details by hand.

To turn it on:
1. Create a free RentCast account and generate an API key at
   [app.rentcast.io/app/api](https://app.rentcast.io/app/api). The free Developer
   plan includes 50 lookups/month with no credit card.
2. In Netlify: **Site configuration → Environment variables →** add
   `RENTCAST_API_KEY = your-key`. (Do **not** prefix it with `VITE_` — that would
   expose it to the browser. It must stay server-side.)
3. Deploy from Git or run `netlify deploy --build --prod`. The app calls the
   function at `/api/lookup`.

Notes: the returned value estimate is RentCast's AVM (a comp-based market value,
i.e. the *after-repair* value assuming the home is renovated to comp condition) —
always sanity-check it and the comps against your agent's local sold data. URL
parsing is best-effort; the resolved address is editable, and typing the full
`Street, City, State, Zip` gives the most reliable match. Each lookup uses one API
call, so you can run ~50/month on the free tier.

---

## Access & passwords

The app opens on a branded landing page with an **access code** gate.

### Changing the code (drag-and-drop, no rebuild)
Open **`config.js`** in the deployed folder and edit one line:
```js
window.__AC_PASSCODE__ = "your-new-code";
```
Set it to `""` to remove the code and just show an "Enter" button. Save, then
re-drop the folder on Netlify. The default code is `altardchaos` — change it.

> **Important — this is a deterrent, not real security.** It keeps casual
> visitors out and gives you a front door, but the app runs entirely in the
> browser, so a determined person could bypass a JavaScript check, and your
> saved data lives in the browser's localStorage. For genuine protection use
> one of the options below.

### Real, server-enforced protection
- **Netlify Pro — dashboard Password Protection (easiest):** one toggle, works
  with any deploy method including drag-and-drop. Site configuration > Access &
  security > Visitor access > Password Protection. (Paid plan.)
- **Netlify Edge Function (free, Git/CLI deploys only):** this project already
  includes `netlify/edge-functions/gate.js`. To enable it: deploy from a Git
  repo, uncomment the `[[edge_functions]]` block in `netlify.toml`, add a
  `SITE_PASSCODE` environment variable in Netlify, and redeploy. Visitors get a
  server-side password screen before anything loads; `/logout` clears it.

If you turn on a server-side option, you can set `config.js` to `""` so you're
not asked for two passwords.



The app stores estimates, feasibility scenarios, and settings in the browser's
`localStorage`. That means:

- Data persists on **the same browser/device** between visits.
- It does **not** sync across devices or team members, and clearing browser
  data wipes it.

When you're ready for multi-device, multi-user access (office + phone + crew),
that's the point to add a hosted backend. The whole storage layer lives in one
file — `src/storage-shim.js` — so you can swap `localStorage` for a real API
client without touching `src/App.jsx`. Back up important estimates in the
meantime by saving the quote text.

---

## Custom domain

In Netlify: **Domain settings → Add a custom domain** (e.g. `altardchaos.com`)
and follow the DNS instructions. Netlify provisions HTTPS automatically.

---

## A note on the numbers

The new-build cost and resale figures are seeded from mid-2026 North Carolina
market data and are **editable starting points, not bids or appraisals**. Verify
build costs with your subs and resale with local comps. The sales-tax handling
reflects NC's capital-improvement vs. repair/install distinction but is not tax
advice — confirm treatment with NCDOR or your CPA.

## Project layout
```
altard-chaos/
├─ index.html            # entry document
├─ netlify.toml          # Netlify build settings
├─ package.json          # scripts + dependencies
├─ vite.config.js        # Vite + React config
├─ dist/                 # production build (drag this to Netlify)
└─ src/
   ├─ App.jsx            # the entire application
   ├─ main.jsx           # React entry point
   └─ storage-shim.js    # localStorage-backed storage (swap for an API later)
```
