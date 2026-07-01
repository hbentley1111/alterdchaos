import React, { useState, useEffect, useMemo, useCallback } from "react";
import logoUrl from "./assets/altardchaos-logo.png";

/* ============================================================
   ALTAR'D CHAOS — Estimating Engine
   Order, forged from chaos.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

.ac-root *{box-sizing:border-box;}
.ac-root{
  --pitch:#0B0B0D; --panel:#141418; --panel2:#1B1B22; --raise:#23232B;
  --line:#2A2A33; --line2:#3A3A46;
  --ash:#8C8C98; --ash2:#62626C; --bone:#ECECF0;
  --ember:#FF5B23; --ember2:#FF8A4C; --blood:#C81E1E;
  --good:#46D08A; --warn:#FACC15;
  font-family:'Archivo',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  color:var(--bone); background:var(--pitch);
  min-height:100vh; -webkit-font-smoothing:antialiased;
}
.ac-num{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums;}
.ac-display{font-family:'Oswald',Impact,'Arial Narrow',sans-serif;}
.ac-anton{font-family:'Anton','Oswald',Impact,sans-serif;}

/* layout */
.ac-shell{display:flex;min-height:100vh;}
.ac-rail{width:212px;flex-shrink:0;background:var(--panel);border-right:1px solid var(--line);
  display:flex;flex-direction:column;position:sticky;top:0;height:100vh;}
.ac-content{flex:1;min-width:0;}
.ac-pad{padding:28px 34px;}

/* brand */
.ac-brand{padding:22px 18px 18px;border-bottom:1px solid var(--line);}
.ac-mark{display:flex;align-items:center;gap:11px;}
.ac-word{line-height:.82;}
.ac-word .l1{font-size:21px;letter-spacing:.06em;color:var(--bone);}
.ac-word .l2{font-size:21px;letter-spacing:.18em;
  background:linear-gradient(92deg,var(--ember),var(--blood));-webkit-background-clip:text;background-clip:text;color:transparent;}
.ac-tag{font-size:9.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--ash2);margin-top:9px;}

/* nav */
.ac-nav{padding:14px 12px;display:flex;flex-direction:column;gap:3px;}
.ac-navbtn{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:none;border:0;
  color:var(--ash);font:inherit;font-size:13px;letter-spacing:.02em;padding:10px 12px;border-radius:7px;cursor:pointer;
  transition:background .15s,color .15s;}
.ac-navbtn:hover{background:var(--panel2);color:var(--bone);}
.ac-navbtn.on{background:var(--panel2);color:var(--bone);box-shadow:inset 2px 0 0 var(--ember);}
.ac-navbtn svg{flex-shrink:0;opacity:.85;}
.ac-railfoot{margin-top:auto;padding:14px 18px;border-top:1px solid var(--line);font-size:10px;color:var(--ash2);letter-spacing:.04em;}

/* eyebrows + headings */
.ac-eyebrow{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:var(--ember);margin-bottom:8px;}
.ac-h1{font-size:34px;letter-spacing:.02em;text-transform:uppercase;line-height:.95;margin:0;}
.ac-h2{font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:var(--bone);margin:0;}
.ac-sub{color:var(--ash);font-size:13px;margin-top:6px;}

/* fracture divider */
.ac-fracture{height:14px;width:100%;display:block;margin:18px 0 26px;}

/* buttons */
.ac-btn{font:inherit;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;border-radius:8px;
  padding:11px 18px;cursor:pointer;border:1px solid var(--line2);background:var(--panel2);color:var(--bone);
  transition:.15s;display:inline-flex;align-items:center;gap:8px;}
.ac-btn:hover{border-color:var(--ash2);background:var(--raise);}
.ac-btn.primary{border:0;background:linear-gradient(96deg,var(--ember),var(--blood));color:#fff;
  box-shadow:0 6px 20px -8px rgba(255,91,35,.7);}
.ac-btn.primary:hover{filter:brightness(1.08);}
.ac-btn.ghost{background:none;border-color:var(--line);color:var(--ash);}
.ac-btn.ghost:hover{color:var(--bone);border-color:var(--line2);}
.ac-btn.sm{padding:7px 12px;font-size:11px;}
.ac-btn:disabled{opacity:.4;cursor:not-allowed;}
.ac-iconbtn{background:none;border:0;color:var(--ash2);cursor:pointer;padding:6px;border-radius:6px;line-height:0;transition:.15s;}
.ac-iconbtn:hover{color:var(--blood);background:var(--panel2);}

/* cards */
.ac-card{background:var(--panel);border:1px solid var(--line);border-radius:12px;}
.ac-grid{display:grid;gap:16px;}

/* inputs */
.ac-input,.ac-select,.ac-textarea{font:inherit;font-size:13px;color:var(--bone);background:var(--pitch);
  border:1px solid var(--line);border-radius:7px;padding:9px 11px;width:100%;transition:.15s;}
.ac-input:focus,.ac-select:focus,.ac-textarea:focus{outline:none;border-color:var(--ember);box-shadow:0 0 0 3px rgba(255,91,35,.15);}
.ac-input::placeholder{color:var(--ash2);}
.ac-label{display:block;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ash2);margin-bottom:7px;}
.ac-textarea{resize:vertical;min-height:76px;line-height:1.5;}

/* status pill */
.ac-pill{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 11px;border-radius:999px;
  border:1px solid var(--line2);display:inline-flex;align-items:center;gap:6px;}
.ac-dot{width:7px;height:7px;border-radius:50%;display:inline-block;}

/* estimate rows */
.ac-section{border:1px solid var(--line);border-radius:11px;background:var(--panel);margin-bottom:16px;overflow:hidden;}
.ac-sechead{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--panel2);border-bottom:1px solid var(--line);}
.ac-tablewrap{overflow-x:auto;}
.ac-row{display:grid;grid-template-columns:minmax(220px,1fr) 70px 78px 110px 64px 90px 110px 34px;
  gap:10px;align-items:center;padding:10px 16px;min-width:780px;}
.ac-row.head{padding-top:12px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.ac-row.head span{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash2);}
.ac-row+.ac-row{border-top:1px solid var(--line);}
.ac-row .ti{padding:7px 9px;font-size:12.5px;}
.ac-row .right{text-align:right;}
.ac-rowtot{font-size:13px;color:var(--bone);text-align:right;}

/* totals panel */
.ac-builder{display:grid;grid-template-columns:1fr 330px;gap:24px;align-items:start;}
.ac-totals{position:sticky;top:24px;}
.ac-line{display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;font-size:13px;color:var(--ash);}
.ac-line .v{color:var(--bone);}
.ac-line.major{border-top:1px solid var(--line);margin-top:6px;padding-top:14px;}
.ac-grand{display:flex;justify-content:space-between;align-items:baseline;margin-top:8px;padding-top:16px;border-top:1px solid var(--line2);}
.ac-grand .lbl{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ash);}
.ac-grand .amt{font-size:28px;background:linear-gradient(92deg,var(--ember),var(--ember2));-webkit-background-clip:text;background-clip:text;color:transparent;}

/* dashboard list */
.ac-jobcard{display:flex;align-items:center;gap:16px;padding:16px 18px;border:1px solid var(--line);border-radius:11px;
  background:var(--panel);cursor:pointer;transition:.15s;text-align:left;width:100%;}
.ac-jobcard:hover{border-color:var(--line2);background:var(--panel2);transform:translateY(-1px);}
.ac-stat{flex:1;min-width:0;}
.ac-statbig{display:flex;gap:22px;flex-wrap:wrap;}
.ac-statbox{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:18px 20px;flex:1;min-width:150px;}
.ac-statval{font-size:30px;letter-spacing:.01em;}
.ac-statlbl{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ash2);margin-top:4px;}

/* misc */
.ac-empty{text-align:center;padding:64px 20px;border:1px dashed var(--line2);border-radius:14px;}
.ac-note{font-size:11.5px;color:var(--ash2);line-height:1.55;}
.ac-divline{height:1px;background:var(--line);border:0;margin:22px 0;}
.ac-overlay{position:fixed;inset:0;background:rgba(5,5,7,.72);backdrop-filter:blur(3px);z-index:50;display:flex;
  align-items:flex-start;justify-content:center;padding:32px 18px;overflow:auto;}
.ac-modal{background:var(--panel);border:1px solid var(--line2);border-radius:14px;width:100%;max-width:680px;}
.ac-quote{background:#0E0E11;color:var(--bone);}
.ac-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--raise);
  border:1px solid var(--line2);color:var(--bone);padding:12px 20px;border-radius:10px;font-size:13px;z-index:80;
  box-shadow:0 12px 40px -12px rgba(0,0,0,.7);}

button:focus-visible,.ac-input:focus-visible,.ac-select:focus-visible{outline:2px solid var(--ember);outline-offset:2px;}

@keyframes ac-crack{from{stroke-dashoffset:240;}to{stroke-dashoffset:0;}}
.ac-crackpath{stroke-dasharray:240;animation:ac-crack 1.1s ease-out forwards;}

@media (max-width:900px){
  .ac-shell{flex-direction:column;}
  .ac-rail{width:100%;height:auto;position:static;flex-direction:column;}
  .ac-nav{flex-direction:row;overflow-x:auto;padding:8px;}
  .ac-navbtn{white-space:nowrap;}
  .ac-railfoot{display:none;}
  .ac-builder{grid-template-columns:1fr;}
  .ac-totals{position:static;}
  .ac-pad{padding:20px 18px;}
  .ac-h1{font-size:26px;}
}
@media (prefers-reduced-motion:reduce){.ac-crackpath{animation:none;stroke-dashoffset:0;}}

/* feasibility */
.ac-feas{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start;}
.ac-cta{display:flex;align-items:center;gap:18px;padding:18px 22px;border-radius:13px;cursor:pointer;width:100%;text-align:left;
  color:var(--bone);border:1px solid var(--line2);background:
   radial-gradient(120% 160% at 100% 0%, rgba(255,91,35,.16), transparent 55%),
   var(--panel);transition:.15s;}
.ac-cta:hover{border-color:var(--ember);transform:translateY(-1px);}
.ac-cta .ac-display{color:var(--ember);}
.ac-cta .badge{flex-shrink:0;width:46px;height:46px;border-radius:11px;display:grid;place-items:center;
  background:linear-gradient(135deg,var(--ember),var(--blood));color:#fff;}
.ac-crow{display:grid;grid-template-columns:minmax(120px,1.4fr) 110px 80px 92px 70px 34px;gap:10px;align-items:center;padding:9px 14px;min-width:560px;}
.ac-crow.head{border-bottom:1px solid var(--line);}
.ac-crow.head span{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash2);}
.ac-crow+.ac-crow{border-top:1px solid var(--line);}
.ac-chip{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ember);
  border:1px solid var(--line2);border-radius:999px;padding:4px 10px;}
.ac-readout{display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;font-size:13px;color:var(--ash);}
.ac-readout .v{color:var(--bone);}
@media (max-width:900px){.ac-feas{grid-template-columns:1fr;}}

/* dashboard cta grid */
.ac-ctagrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;}
@media (max-width:760px){.ac-ctagrid{grid-template-columns:1fr;}}

/* flip metrics */
.ac-metricrow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:6px;}
.ac-metric{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:13px 15px;}
.ac-metric .mlbl{font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--ash2);}
.ac-metric .mval{font-size:19px;margin-top:5px;letter-spacing:.01em;}
.ac-mao{border:1px solid var(--line2);border-radius:10px;padding:13px 15px;margin-top:14px;
  background:radial-gradient(130% 170% at 0% 0%, rgba(255,91,35,.13), transparent 60%),var(--panel2);}
.ac-gradepill{font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:5px 12px;border-radius:999px;
  border:1px solid var(--line2);display:inline-flex;align-items:center;gap:7px;}

/* landing / auth gate */
.ac-landing{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 20px;position:relative;overflow:hidden;
  background:
    radial-gradient(70% 80% at 50% -10%, rgba(255,91,35,.16), transparent 60%),
    radial-gradient(50% 50% at 85% 110%, rgba(200,30,30,.12), transparent 60%),
    var(--pitch);}
.ac-landinginner{width:100%;max-width:440px;text-align:center;position:relative;z-index:2;}
.ac-landingmark{display:flex;flex-direction:column;align-items:center;gap:18px;margin-bottom:8px;}
.ac-landingword .l1{font-size:40px;letter-spacing:.05em;color:var(--bone);line-height:.8;}
.ac-landingword .l2{font-size:40px;letter-spacing:.16em;line-height:.8;
  background:linear-gradient(92deg,var(--ember),var(--blood));-webkit-background-clip:text;background-clip:text;color:transparent;}
.ac-landingtag{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ash2);margin-top:18px;}
.ac-landingfeat{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:24px 0 30px;}
.ac-landingfeat span{font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);
  border:1px solid var(--line);border-radius:999px;padding:6px 13px;}
.ac-gatecard{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:24px;text-align:left;}
.ac-shake{animation:ac-shake .4s;}
@keyframes ac-shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-7px);}40%,80%{transform:translateX(7px);}}
.ac-landingfoot{margin-top:26px;font-size:10.5px;letter-spacing:.06em;color:var(--ash2);line-height:1.6;}
@media (max-width:560px){.ac-landingword .l1,.ac-landingword .l2{font-size:30px;}}
`;

/* ---------- helpers ---------- */
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number.isFinite(n) ? n : 0);
const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const STATUSES = {
  draft: { label: "Draft", color: "var(--ash)" },
  sent: { label: "Sent", color: "var(--warn)" },
  won: { label: "Won", color: "var(--good)" },
  lost: { label: "Lost", color: "var(--blood)" },
};

const UNITS = ["ea", "sq ft", "ln ft", "hr", "lump", "cu yd", "sheet", "gal", "day"];

const DEFAULT_SETTINGS = {
  companyName: "Altar'd Chaos",
  tagline: "Order, forged from chaos.",
  license: "",
  phone: "",
  email: "",
  laborRate: 65,
  markup: 0.3,
  overhead: 0.1,
  contingency: 0.05,
  taxRate: 0.0675,
  taxMode: "capital", // 'capital' (real-property improvement) | 'rmi' (repair/maint/install)
};

/* scope templates — scaffolding only; enter your own numbers */
const mkItem = (description, unit, rate) => ({
  id: uid(),
  description,
  qty: 0,
  unit,
  materialCost: 0,
  laborHours: 0,
  laborRate: rate,
});
const TEMPLATES = (rate) => ({
  remodel: {
    label: "Remodel / Renovation",
    sections: [
      { name: "Demolition & Disposal", items: ["Demo existing finishes", "Dumpster / haul-off"].map((d) => mkItem(d, "lump", rate)) },
      { name: "Framing & Structural", items: ["Wall framing changes", "Headers / beams"].map((d) => mkItem(d, "ea", rate)) },
      { name: "Plumbing", items: ["Rough-in", "Fixture set"].map((d) => mkItem(d, "ea", rate)) },
      { name: "Electrical", items: ["Rough-in", "Devices & fixtures", "Panel / circuits"].map((d) => mkItem(d, "ea", rate)) },
      { name: "Insulation & Drywall", items: ["Insulation", "Hang & finish drywall"].map((d) => mkItem(d, "sq ft", rate)) },
      { name: "Flooring", items: ["Flooring material", "Install"].map((d) => mkItem(d, "sq ft", rate)) },
      { name: "Cabinetry & Countertops", items: [mkItem("Cabinets", "ln ft", rate), mkItem("Countertops", "sq ft", rate), mkItem("Install", "lump", rate)] },
      { name: "Paint & Finishes", items: [mkItem("Paint", "sq ft", rate), mkItem("Trim & doors", "ea", rate)] },
      { name: "Final Cleanup", items: [mkItem("Cleanup", "lump", rate)] },
    ],
  },
  newconstruction: {
    label: "New Construction / Addition",
    sections: [
      { name: "Site Prep & Foundation", items: [mkItem("Excavation & grading", "lump", rate), mkItem("Footings & foundation", "sq ft", rate), mkItem("Slab", "sq ft", rate)] },
      { name: "Framing", items: ["Floor system", "Wall framing", "Roof framing / trusses"].map((d) => mkItem(d, "sq ft", rate)) },
      { name: "Roofing & Dry-In", items: [mkItem("Sheathing & wrap", "sq ft", rate), mkItem("Roofing", "sq ft", rate), mkItem("Windows & exterior doors", "ea", rate)] },
      { name: "Mechanical Rough-In", items: ["Plumbing", "Electrical", "HVAC"].map((d) => mkItem(d, "lump", rate)) },
      { name: "Insulation & Drywall", items: ["Insulation", "Drywall"].map((d) => mkItem(d, "sq ft", rate)) },
      { name: "Exterior Finishes", items: [mkItem("Siding", "sq ft", rate), mkItem("Soffit, fascia & gutters", "ln ft", rate)] },
      { name: "Interior Finishes", items: [mkItem("Flooring", "sq ft", rate), mkItem("Trim & doors", "lump", rate), mkItem("Paint", "sq ft", rate), mkItem("Cabinets & tops", "lump", rate)] },
      { name: "Final & Punch List", items: [mkItem("Fixtures & punch list", "lump", rate), mkItem("Cleanup", "lump", rate)] },
    ],
  },
  interior: {
    label: "Interior Design",
    sections: [
      { name: "Discovery & Design", items: [mkItem("Consultation", "hr", rate), mkItem("Concept & space plan", "lump", rate), mkItem("3D renderings", "ea", rate)] },
      { name: "Procurement", items: [mkItem("Furniture", "ea", rate), mkItem("Lighting & fixtures", "ea", rate), mkItem("Window treatments", "ea", rate), mkItem("Rugs & textiles", "ea", rate)] },
      { name: "Finishes & Materials", items: [mkItem("Paint / wallcovering", "sq ft", rate), mkItem("Hardware", "ea", rate)] },
      { name: "Install & Styling", items: [mkItem("Delivery & receiving", "lump", rate), mkItem("Installation labor", "hr", rate), mkItem("Styling & staging", "lump", rate)] },
    ],
  },
});

function newEstimate(settings) {
  return {
    id: uid(),
    name: "",
    status: "draft",
    projectType: "remodel",
    client: { name: "", address: "", email: "", phone: "" },
    notes: "",
    sections: [],
    markup: settings.markup,
    overhead: settings.overhead,
    contingency: settings.contingency,
    taxRate: settings.taxRate,
    taxMode: settings.taxMode,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/* ---------- storage ---------- */
const hasStore = typeof window !== "undefined" && window.storage;
const store = {
  async list() {
    if (!hasStore) return null;
    try {
      const res = await window.storage.list("estimate:", false);
      const keys = (res?.keys || []).map((k) => (typeof k === "string" ? k : k.key)).filter(Boolean);
      const out = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, false);
          if (r?.value) out.push(JSON.parse(r.value));
        } catch (_) {}
      }
      return out;
    } catch (_) {
      return [];
    }
  },
  async save(est) {
    if (!hasStore) return false;
    try {
      await window.storage.set("estimate:" + est.id, JSON.stringify(est), false);
      return true;
    } catch (_) {
      return false;
    }
  },
  async remove(id) {
    if (!hasStore) return;
    try {
      await window.storage.delete("estimate:" + id, false);
    } catch (_) {}
  },
  async getSettings() {
    if (!hasStore) return null;
    try {
      const r = await window.storage.get("settings", false);
      return r?.value ? JSON.parse(r.value) : null;
    } catch (_) {
      return null;
    }
  },
  async saveSettings(s) {
    if (!hasStore) return;
    try {
      await window.storage.set("settings", JSON.stringify(s), false);
    } catch (_) {}
  },
  async listFeas() {
    if (!hasStore) return null;
    try {
      const res = await window.storage.list("feas:", false);
      const keys = (res?.keys || []).map((k) => (typeof k === "string" ? k : k.key)).filter(Boolean);
      const out = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, false);
          if (r?.value) out.push(JSON.parse(r.value));
        } catch (_) {}
      }
      return out;
    } catch (_) {
      return [];
    }
  },
  async saveFeas(f) {
    if (!hasStore) return false;
    try {
      await window.storage.set("feas:" + f.id, JSON.stringify(f), false);
      return true;
    } catch (_) {
      return false;
    }
  },
  async removeFeas(id) {
    if (!hasStore) return;
    try {
      await window.storage.delete("feas:" + id, false);
    } catch (_) {}
  },
  async listFlips() {
    if (!hasStore) return null;
    try {
      const res = await window.storage.list("flip:", false);
      const keys = (res?.keys || []).map((k) => (typeof k === "string" ? k : k.key)).filter(Boolean);
      const out = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, false);
          if (r?.value) out.push(JSON.parse(r.value));
        } catch (_) {}
      }
      return out;
    } catch (_) {
      return [];
    }
  },
  async saveFlip(f) {
    if (!hasStore) return false;
    try {
      await window.storage.set("flip:" + f.id, JSON.stringify(f), false);
      return true;
    } catch (_) {
      return false;
    }
  },
  async removeFlip(id) {
    if (!hasStore) return;
    try {
      await window.storage.delete("flip:" + id, false);
    } catch (_) {}
  },
  async listLots() {
    if (!hasStore) return null;
    try {
      const res = await window.storage.list("lot:", false);
      const keys = (res?.keys || []).map((k) => (typeof k === "string" ? k : k.key)).filter(Boolean);
      const out = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, false);
          if (r?.value) out.push(JSON.parse(r.value));
        } catch (_) {}
      }
      return out;
    } catch (_) {
      return [];
    }
  },
  async saveLot(l) {
    if (!hasStore) return false;
    try {
      await window.storage.set("lot:" + l.id, JSON.stringify(l), false);
      return true;
    } catch (_) {
      return false;
    }
  },
  async removeLot(id) {
    if (!hasStore) return;
    try {
      await window.storage.delete("lot:" + id, false);
    } catch (_) {}
  },
};

/* ---------- calculations ---------- */
function compute(est) {
  let materials = 0,
    labor = 0;
  const sectionTotals = [];
  for (const sec of est.sections) {
    let sm = 0,
      sl = 0;
    for (const it of sec.items) {
      const q = num(it.qty);
      sm += q * num(it.materialCost);
      sl += num(it.laborHours) * num(it.laborRate);
    }
    sectionTotals.push(sm + sl);
    materials += sm;
    labor += sl;
  }
  const direct = materials + labor;
  const overhead = direct * num(est.overhead);
  const contingency = direct * num(est.contingency);
  const matTax = est.taxMode === "capital" ? materials * num(est.taxRate) : 0;
  const costBasis = direct + overhead + contingency + matTax;
  const markupAmt = costBasis * num(est.markup);
  const price = costBasis + markupAmt;
  const margin = price > 0 ? markupAmt / price : 0;
  const custTax = est.taxMode === "rmi" ? price * num(est.taxRate) : 0;
  const grand = price + custTax;
  return { materials, labor, direct, overhead, contingency, matTax, markupAmt, price, margin, custTax, grand, sectionTotals };
}

/* ---------- new-construction feasibility model ----------
   Seeded from current NC market data (mid-2026). Editable.
   Construction-only $/sqft by finish level, before land + soft costs. */
const FINISH_TIERS = [
  { key: "standard", label: "Standard / builder-grade", psf: 160 },
  { key: "midcustom", label: "Mid-grade custom", psf: 215 },
  { key: "custom", label: "High-end custom", psf: 300 },
  { key: "luxury", label: "Luxury", psf: 425 },
];
const REGIONS = [
  { key: "statewide", label: "NC statewide avg", mult: 1.0 },
  { key: "triangle", label: "Triangle (Raleigh/Durham)", mult: 1.13 },
  { key: "charlotte", label: "Charlotte metro", mult: 1.08 },
  { key: "piedmont", label: "Piedmont (Greensboro/W-S)", mult: 1.0 },
  { key: "mountains", label: "Mountains (Asheville)", mult: 1.08 },
  { key: "coastal", label: "Coastal (Wilmington/OBX)", mult: 1.1 },
  { key: "sandhills", label: "Sandhills (Fayetteville)", mult: 0.96 },
];
// statewide reference points, mid-2026 — shown as context, not comps
const NC_REFERENCE = { medianPrice: 388000, medianDom: 55, saleToList: 0.98, psfResale: 215 };

/* County presets — approximate, editable. buildMult scales construction $/sq ft;
   resalePsf / medianPrice / medianDom seed the resale + market reference.
   Derived from mid-2026 Redfin / NC Realtors metro data; verify against local comps. */
const COUNTIES = [
  { key: "statewide", label: "NC statewide (no county)", group: "—", buildMult: 1.0, resalePsf: 200, medianPrice: 385000, medianDom: 55 },

  { key: "wake", label: "Wake (Raleigh / Cary)", group: "Triangle", buildMult: 1.13, resalePsf: 225, medianPrice: 425000, medianDom: 34 },
  { key: "durham", label: "Durham", group: "Triangle", buildMult: 1.12, resalePsf: 225, medianPrice: 425000, medianDom: 31 },
  { key: "orange", label: "Orange (Chapel Hill)", group: "Triangle", buildMult: 1.15, resalePsf: 255, medianPrice: 520000, medianDom: 35 },
  { key: "johnston", label: "Johnston (Clayton / Smithfield)", group: "Triangle", buildMult: 1.06, resalePsf: 195, medianPrice: 385000, medianDom: 45 },
  { key: "chatham", label: "Chatham (Pittsboro)", group: "Triangle", buildMult: 1.1, resalePsf: 230, medianPrice: 500000, medianDom: 50 },

  { key: "mecklenburg", label: "Mecklenburg (Charlotte)", group: "Charlotte metro", buildMult: 1.08, resalePsf: 230, medianPrice: 435000, medianDom: 48 },
  { key: "union", label: "Union (Monroe / Waxhaw)", group: "Charlotte metro", buildMult: 1.06, resalePsf: 215, medianPrice: 460000, medianDom: 50 },
  { key: "cabarrus", label: "Cabarrus (Concord)", group: "Charlotte metro", buildMult: 1.05, resalePsf: 205, medianPrice: 390000, medianDom: 50 },
  { key: "iredell", label: "Iredell (Mooresville)", group: "Charlotte metro", buildMult: 1.04, resalePsf: 205, medianPrice: 410000, medianDom: 55 },
  { key: "gaston", label: "Gaston (Gastonia)", group: "Charlotte metro", buildMult: 1.0, resalePsf: 180, medianPrice: 330000, medianDom: 50 },

  { key: "guilford", label: "Guilford (Greensboro)", group: "Piedmont Triad", buildMult: 1.0, resalePsf: 152, medianPrice: 290000, medianDom: 45 },
  { key: "forsyth", label: "Forsyth (Winston-Salem)", group: "Piedmont Triad", buildMult: 1.0, resalePsf: 145, medianPrice: 275000, medianDom: 45 },
  { key: "alamance", label: "Alamance (Burlington)", group: "Piedmont Triad", buildMult: 1.0, resalePsf: 160, medianPrice: 315000, medianDom: 48 },
  { key: "davidson", label: "Davidson (Lexington)", group: "Piedmont Triad", buildMult: 0.98, resalePsf: 150, medianPrice: 285000, medianDom: 50 },
  { key: "catawba", label: "Catawba (Hickory)", group: "Piedmont Triad", buildMult: 0.98, resalePsf: 160, medianPrice: 305000, medianDom: 50 },

  { key: "buncombe", label: "Buncombe (Asheville)", group: "Mountains", buildMult: 1.1, resalePsf: 255, medianPrice: 470000, medianDom: 60 },
  { key: "henderson", label: "Henderson (Hendersonville)", group: "Mountains", buildMult: 1.07, resalePsf: 240, medianPrice: 450000, medianDom: 60 },

  { key: "newhanover", label: "New Hanover (Wilmington)", group: "Coastal", buildMult: 1.12, resalePsf: 250, medianPrice: 440000, medianDom: 60 },
  { key: "brunswick", label: "Brunswick (Leland / Southport)", group: "Coastal", buildMult: 1.12, resalePsf: 235, medianPrice: 410000, medianDom: 65 },
  { key: "pender", label: "Pender (Hampstead)", group: "Coastal", buildMult: 1.1, resalePsf: 230, medianPrice: 415000, medianDom: 65 },
  { key: "carteret", label: "Carteret (Morehead City)", group: "Coastal", buildMult: 1.1, resalePsf: 240, medianPrice: 430000, medianDom: 70 },
  { key: "onslow", label: "Onslow (Jacksonville)", group: "Coastal", buildMult: 0.98, resalePsf: 150, medianPrice: 255000, medianDom: 55 },

  { key: "cumberland", label: "Cumberland (Fayetteville)", group: "Sandhills / East", buildMult: 0.96, resalePsf: 127, medianPrice: 240000, medianDom: 54 },
  { key: "moore", label: "Moore (Pinehurst / S. Pines)", group: "Sandhills / East", buildMult: 1.05, resalePsf: 200, medianPrice: 430000, medianDom: 55 },
  { key: "harnett", label: "Harnett (Lillington)", group: "Sandhills / East", buildMult: 0.98, resalePsf: 150, medianPrice: 320000, medianDom: 50 },
  { key: "pitt", label: "Pitt (Greenville)", group: "Sandhills / East", buildMult: 0.97, resalePsf: 150, medianPrice: 270000, medianDom: 55 },
  { key: "wayne", label: "Wayne (Goldsboro)", group: "Sandhills / East", buildMult: 0.95, resalePsf: 135, medianPrice: 230000, medianDom: 55 },
];
const COUNTY_GROUPS = ["Triangle", "Charlotte metro", "Piedmont Triad", "Mountains", "Coastal", "Sandhills / East"];

function resolveLoc(f) {
  if (f.county) {
    const c = COUNTIES.find((x) => x.key === f.county);
    if (c) return c;
  }
  if (f.region) {
    const r = REGIONS.find((x) => x.key === f.region);
    if (r) return { buildMult: r.mult, label: r.label, resalePsf: NC_REFERENCE.psfResale, medianPrice: NC_REFERENCE.medianPrice, medianDom: NC_REFERENCE.medianDom };
  }
  return COUNTIES[0];
}

function newFeasibility() {
  return {
    id: uid(),
    name: "",
    sqft: 2000,
    tier: "standard",
    psf: 160,
    region: "statewide",
    county: "statewide",
    lotCost: 0,
    sitePrep: 0,
    softPct: 0.22,
    contingencyPct: 0.1,
    useFinancing: false,
    loanApr: 0.11,
    buildMonths: 9,
    resaleMode: "comps", // 'comps' | 'manual'
    resalePsf: 215,
    comps: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function computeComps(comps) {
  const valid = comps.filter((c) => num(c.price) > 0 && num(c.sqft) > 0);
  if (!valid.length) return { psf: 0, avgPrice: 0, medianDom: 0, count: 0 };
  const psfs = valid.map((c) => num(c.price) / num(c.sqft));
  const psf = psfs.reduce((a, b) => a + b, 0) / psfs.length;
  const avgPrice = valid.reduce((a, c) => a + num(c.price), 0) / valid.length;
  const doms = valid.map((c) => num(c.dom)).filter((d) => d > 0).sort((a, b) => a - b);
  const medianDom = doms.length ? doms[Math.floor(doms.length / 2)] : 0;
  return { psf, avgPrice, medianDom, count: valid.length };
}

function computeFeasibility(f) {
  const loc = resolveLoc(f);
  const sqft = num(f.sqft);
  const hard = sqft * num(f.psf) * loc.buildMult + num(f.sitePrep);
  const soft = hard * num(f.softPct);
  const contingency = hard * num(f.contingencyPct);
  const baseCost = hard + soft + contingency + num(f.lotCost);
  // interest-only carry on ~50% average outstanding balance over the build
  const financeBase = hard + soft;
  const carry = f.useFinancing ? financeBase * num(f.loanApr) * (num(f.buildMonths) / 12) * 0.5 : 0;
  const totalCost = baseCost + carry;
  const allInPsf = sqft > 0 ? totalCost / sqft : 0;

  const comps = computeComps(f.comps);
  const resalePsf = f.resaleMode === "comps" && comps.psf > 0 ? comps.psf : num(f.resalePsf);
  const resale = resalePsf * sqft;
  const profit = resale - totalCost;
  const margin = resale > 0 ? profit / resale : 0;
  const markupOnCost = totalCost > 0 ? profit / totalCost : 0;

  return { loc, hard, soft, contingency, carry, totalCost, allInPsf, comps, resalePsf, resale, profit, margin, markupOnCost };
}

/* ---------- fix-and-flip deal analyzer ----------
   Buy → rehab → resell. Rehab can be a quick $/sq ft pass or an itemized
   budget; ARV (after-repair value) comes from sold comps or a manual $/sq ft.
   All figures are editable ballparks, not an appraisal. */
const REHAB_TIERS = [
  { key: "cosmetic", label: "Cosmetic / light", psf: 25 },
  { key: "moderate", label: "Moderate", psf: 45 },
  { key: "heavy", label: "Heavy / full", psf: 75 },
  { key: "gut", label: "Down-to-studs / luxury", psf: 115 },
];
const REHAB_CATEGORIES = [
  "Kitchen", "Bathrooms", "Flooring", "Interior paint & drywall", "Roof",
  "HVAC", "Electrical", "Plumbing", "Windows & doors",
  "Exterior / curb appeal", "Landscaping", "Permits & fees", "Dumpster & cleanup",
];
const seedRehabItems = () => REHAB_CATEGORIES.map((c) => ({ id: uid(), label: c, cost: 0 }));

function newFlip() {
  return {
    id: uid(),
    name: "",
    address: "",
    county: "statewide",
    sqft: 1500,
    beds: 3,
    baths: 2,
    lotSize: 0,
    // acquisition
    purchasePrice: 0,
    buyClosingPct: 0.02,
    // rehab
    rehabMode: "itemized", // 'quick' | 'itemized'
    rehabTier: "moderate",
    rehabPsf: 45,
    rehabItems: seedRehabItems(),
    rehabContingencyPct: 0.1,
    // holding
    holdMonths: 5,
    monthlyTaxes: 0,
    monthlyInsurance: 0,
    monthlyUtilities: 0,
    monthlyOther: 0,
    // financing (hard money, loan-to-cost on purchase + rehab)
    useFinancing: true,
    loanPct: 0.85,
    loanApr: 0.11,
    loanPoints: 2,
    // resale
    arvMode: "comps", // 'comps' | 'manual'
    arvPsf: 200,
    comps: [],
    sellCommissionPct: 0.055,
    sellClosingPct: 0.01,
    stagingCost: 0,
    // 70% rule threshold
    ruleThreshold: 0.7,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function computeFlip(f) {
  const loc = resolveLoc(f);
  const sqft = num(f.sqft);

  // rehab
  const itemized = (f.rehabItems || []).reduce((s, it) => s + num(it.cost), 0);
  const rehabBase = f.rehabMode === "quick" ? sqft * num(f.rehabPsf) : itemized;
  const rehabContingency = rehabBase * num(f.rehabContingencyPct);
  const rehab = rehabBase + rehabContingency;
  const rehabPsfActual = sqft > 0 ? rehab / sqft : 0;

  // acquisition
  const purchase = num(f.purchasePrice);
  const buyClosing = purchase * num(f.buyClosingPct);

  // after-repair value from comps or manual
  const comps = computeComps(f.comps);
  const arvPsf = f.arvMode === "comps" && comps.psf > 0 ? comps.psf : num(f.arvPsf);
  const arv = arvPsf * sqft;

  // financing — hard money on (purchase + rehab); interest-only on full balance
  const loanBasis = purchase + rehab;
  const loanAmount = f.useFinancing ? loanBasis * num(f.loanPct) : 0;
  const points = loanAmount * (num(f.loanPoints) / 100);
  const interest = loanAmount * num(f.loanApr) * (num(f.holdMonths) / 12);
  const financing = points + interest;

  // holding
  const monthlyCarry = num(f.monthlyTaxes) + num(f.monthlyInsurance) + num(f.monthlyUtilities) + num(f.monthlyOther);
  const holding = monthlyCarry * num(f.holdMonths);

  // selling
  const commission = arv * num(f.sellCommissionPct);
  const sellClosing = arv * num(f.sellClosingPct);
  const selling = commission + sellClosing + num(f.stagingCost);

  // roll-up
  const totalCost = purchase + buyClosing + rehab + financing + holding + selling;
  const profit = arv - totalCost;
  const margin = arv > 0 ? profit / arv : 0; // profit as a share of resale
  const returnOnCost = totalCost > 0 ? profit / totalCost : 0;

  // cash in the deal (financed portion reduces cash needed) → cash-on-cash
  const cashInvested = Math.max(totalCost - loanAmount, 0);
  const cashOnCash = cashInvested > 0 ? profit / cashInvested : 0;
  const annualizedCoC = num(f.holdMonths) > 0 ? cashOnCash * (12 / num(f.holdMonths)) : 0;

  // 70% rule → max allowable offer
  const mao = num(f.ruleThreshold) * arv - rehab;
  const maoDelta = mao - purchase; // + = room under the rule, - = overpaying

  return {
    loc, sqft, rehabBase, rehabContingency, rehab, rehabPsfActual,
    purchase, buyClosing, comps, arvPsf, arv,
    loanAmount, points, interest, financing, monthlyCarry, holding,
    commission, sellClosing, selling,
    totalCost, profit, margin, returnOnCost,
    cashInvested, cashOnCash, annualizedCoC, mao, maoDelta,
  };
}

function flipGrade(c) {
  if (c.arv <= 0) return { label: "Add ARV", color: "var(--ash)" };
  if (c.profit < 0) return { label: "Loss", color: "var(--blood)" };
  if (c.margin < 0.08) return { label: "Thin", color: "var(--warn)" };
  if (c.margin < 0.15) return { label: "Workable", color: "var(--warn)" };
  return { label: "Strong", color: "var(--good)" };
}

/* ---------- lot / land deal analyzer ----------
   Buy a parcel, put site-development money in, then either resell the lot
   (land flip) or check whether the finished lot cost supports a spec build
   (lot-to-ARV ratio). Land loans default lower LTV / higher rate than a flip. */
const LOT_DEV_CATEGORIES = [
  "Survey & engineering", "Soil / perc test & environmental", "Clearing & grubbing",
  "Grading & earthwork", "Water / sewer tap or well & septic", "Driveway / road & culvert",
  "Erosion control", "Permits & impact fees", "Utilities (power / gas / telecom)",
];
const seedLotDev = () => LOT_DEV_CATEGORIES.map((c) => ({ id: uid(), label: c, cost: 0 }));

function newLot() {
  return {
    id: uid(),
    name: "",
    address: "",
    county: "statewide",
    lotSize: 0, // square feet
    zoning: "",
    // acquisition
    purchasePrice: 0,
    buyClosingPct: 0.02,
    // site development
    devItems: seedLotDev(),
    devContingencyPct: 0.1,
    // holding + financing (land loans: lower LTV, higher rate)
    holdMonths: 9,
    monthlyTaxes: 0,
    monthlyInsurance: 0,
    monthlyOther: 0,
    useFinancing: true,
    loanPct: 0.6,
    loanApr: 0.12,
    loanPoints: 2,
    // exit
    exitMode: "resell", // 'resell' | 'build'
    resaleMode: "comps", // 'comps' | 'manual'
    resalePerAcre: 0,
    comps: [],
    sellCommissionPct: 0.06,
    sellClosingPct: 0.01,
    arv: 0,
    targetRatio: 0.22,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function computeLotComps(comps) {
  const valid = (comps || []).filter((c) => num(c.price) > 0 && num(c.acres) > 0);
  if (!valid.length) return { perAcre: 0, avgPrice: 0, medianDom: 0, count: 0 };
  const pas = valid.map((c) => num(c.price) / num(c.acres));
  const perAcre = pas.reduce((a, b) => a + b, 0) / pas.length;
  const avgPrice = valid.reduce((a, c) => a + num(c.price), 0) / valid.length;
  const doms = valid.map((c) => num(c.dom)).filter((d) => d > 0).sort((a, b) => a - b);
  const medianDom = doms.length ? doms[Math.floor(doms.length / 2)] : 0;
  return { perAcre, avgPrice, medianDom, count: valid.length };
}

function computeLot(f) {
  const loc = resolveLoc(f);
  const acres = num(f.lotSize) / 43560;

  const devBase = (f.devItems || []).reduce((s, it) => s + num(it.cost), 0);
  const devContingency = devBase * num(f.devContingencyPct);
  const development = devBase + devContingency;
  const devPerAcre = acres > 0 ? development / acres : 0;

  const purchase = num(f.purchasePrice);
  const buyClosing = purchase * num(f.buyClosingPct);

  // land loan on purchase + development; interest-only across the hold
  const loanBasis = purchase + development;
  const loanAmount = f.useFinancing ? loanBasis * num(f.loanPct) : 0;
  const points = loanAmount * (num(f.loanPoints) / 100);
  const interest = loanAmount * num(f.loanApr) * (num(f.holdMonths) / 12);
  const financing = points + interest;

  const monthlyCarry = num(f.monthlyTaxes) + num(f.monthlyInsurance) + num(f.monthlyOther);
  const holding = monthlyCarry * num(f.holdMonths);

  // coefficient on purchase price, used to solve break-even / target offers.
  // total cost = purchase*(1 + buyClosing% + k) + development*(1+k) + holding [+ selling]
  const k = f.useFinancing ? num(f.loanPct) * (num(f.loanPoints) / 100 + num(f.loanApr) * (num(f.holdMonths) / 12)) : 0;
  const denom = 1 + num(f.buyClosingPct) + k;

  // resell exit
  const comps = computeLotComps(f.comps);
  const perAcre = f.resaleMode === "comps" && comps.perAcre > 0 ? comps.perAcre : num(f.resalePerAcre);
  const resale = perAcre * acres;
  const commission = resale * num(f.sellCommissionPct);
  const sellClosing = resale * num(f.sellClosingPct);
  const selling = commission + sellClosing;
  const totalCost = purchase + buyClosing + development + financing + holding + selling;
  const profit = resale - totalCost;
  const margin = resale > 0 ? profit / resale : 0;
  const returnOnCost = totalCost > 0 ? profit / totalCost : 0;
  const cashInvested = Math.max(totalCost - loanAmount, 0);
  const cashOnCash = cashInvested > 0 ? profit / cashInvested : 0;
  const annualizedCoC = num(f.holdMonths) > 0 ? cashOnCash * (12 / num(f.holdMonths)) : 0;
  const breakevenPurchase = denom > 0 ? (resale - development * (1 + k) - holding - selling) / denom : 0;

  // build exit
  const arv = num(f.arv);
  const finishedLotCost = purchase + buyClosing + development + financing + holding;
  const lotRatio = arv > 0 ? finishedLotCost / arv : 0;
  const maxPurchaseForTarget = denom > 0 ? (num(f.targetRatio) * arv - development * (1 + k) - holding) / denom : 0;

  return {
    loc, acres, devBase, devContingency, development, devPerAcre,
    purchase, buyClosing, loanAmount, points, interest, financing, monthlyCarry, holding,
    comps, perAcre, resale, commission, sellClosing, selling,
    totalCost, profit, margin, returnOnCost, cashInvested, cashOnCash, annualizedCoC, breakevenPurchase,
    arv, finishedLotCost, lotRatio, maxPurchaseForTarget,
  };
}

function lotGrade(f, c) {
  if (f.exitMode === "build") {
    if (c.arv <= 0) return { label: "Add ARV", color: "var(--ash)" };
    if (c.lotRatio <= num(f.targetRatio)) return { label: "On target", color: "var(--good)" };
    if (c.lotRatio <= num(f.targetRatio) + 0.05) return { label: "Close", color: "var(--warn)" };
    return { label: "Over", color: "var(--blood)" };
  }
  if (c.resale <= 0) return { label: "Add resale", color: "var(--ash)" };
  if (c.profit < 0) return { label: "Loss", color: "var(--blood)" };
  if (c.margin < 0.1) return { label: "Thin", color: "var(--warn)" };
  if (c.margin < 0.2) return { label: "Workable", color: "var(--warn)" };
  return { label: "Strong", color: "var(--good)" };
}

/* ---------- small components ---------- */
function LogoMark({ size = 34 }) {
  const compact = size < 48;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <g fill="none" stroke="#E3E8F2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M6.5 16.5 L20 8.5 L33.5 16.5 Z" strokeWidth="1.3" />
        <rect x="9" y="16.5" width="22" height="13.5" strokeWidth="1.3" />
        <path d="M4 30 L36 30" strokeWidth="0.9" opacity="0.85" />
        <rect x="17.5" y="23" width="5" height="7" strokeWidth="0.8" />
        <rect x="11" y="19" width="4" height="4" strokeWidth="0.7" />
        <rect x="25" y="19" width="4" height="4" strokeWidth="0.7" />
        <path d="M26.6 13.2 L26.6 10 L28.4 10 L28.4 14.4" strokeWidth="0.7" opacity="0.85" />
        {!compact && (
          <>
            <path d="M13 19 L13 23 M11 21 L15 21" strokeWidth="0.5" opacity="0.8" />
            <path d="M27 19 L27 23 M25 21 L29 21" strokeWidth="0.5" opacity="0.8" />
            <g strokeWidth="0.5" opacity="0.4">
              <path d="M8 8.5 L3 8.5" />
              <path d="M8 30 L3 30" />
              <path d="M3.6 8.5 L3.6 30" />
              <path d="M2.7 9.4 L4.5 7.6" />
              <path d="M2.7 29.1 L4.5 30.9" />
            </g>
          </>
        )}
        <g strokeWidth="0.5" opacity="0.45">
          <path d="M6.5 31 L6.5 35.4" />
          <path d="M33.5 31 L33.5 35.4" />
          <path d="M6.5 34.4 L33.5 34.4" />
          <path d="M5.6 35.3 L7.4 33.5" />
          <path d="M32.6 35.3 L34.4 33.5" />
        </g>
      </g>
    </svg>
  );
}

function Fracture() {
  return (
    <svg className="ac-fracture" viewBox="0 0 600 14" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 7 H190 L205 2 L225 12 L245 4 L262 7 H600" stroke="url(#acg)" strokeWidth="1.4" fill="none" opacity="0.7" />
      <defs>
        <linearGradient id="acg" x1="0" x2="600" y1="0" y2="0">
          <stop offset="0" stopColor="#2A2A33" />
          <stop offset="0.4" stopColor="#FF5B23" />
          <stop offset="0.6" stopColor="#FF5B23" />
          <stop offset="1" stopColor="#2A2A33" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const Icon = ({ d, size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const icons = {
  dash: <><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 8.6l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 12 4.6V4a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 19.4 8l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 21 12h.09a2 2 0 0 1 0 4z" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  back: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  calc: <><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="18" /><line x1="8" y1="18" x2="12" y2="18" /></>,
  arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  flip: <><path d="M3 10.5 L12 4 L21 10.5" /><path d="M5 9.5 V20 H19 V9.5" /><path d="M17 4 h3 v3" /><path d="M9.5 15 a2.5 2.5 0 0 1 5 0 a2.5 2.5 0 0 1 -5 0" /></>,
  money: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
  lot: <><path d="M3 20 L8 5 L16 5 L21 20 Z" /><path d="M3 20 L21 20" /><path d="M11.5 5 L13.5 20" strokeDasharray="2 2" /><path d="M13 11 v3 M11.5 12.5 h3" /></>,
};

/* ============================================================ */
function Estimator({ onSignOut }) {
  const [view, setView] = useState("dashboard");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [estimates, setEstimates] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showQuote, setShowQuote] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [currentFeas, setCurrentFeas] = useState(null);
  const [flips, setFlips] = useState([]);
  const [currentFlip, setCurrentFlip] = useState(null);
  const [lots, setLots] = useState([]);
  const [currentLot, setCurrentLot] = useState(null);

  const flash = useCallback((m) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    (async () => {
      const s = await store.getSettings();
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...s });
      const list = await store.list();
      if (list) setEstimates(list.sort((a, b) => b.updatedAt - a.updatedAt));
      const feas = await store.listFeas();
      if (feas) setScenarios(feas.sort((a, b) => b.updatedAt - a.updatedAt));
      const flipList = await store.listFlips();
      if (flipList) setFlips(flipList.sort((a, b) => b.updatedAt - a.updatedAt));
      const lotList = await store.listLots();
      if (lotList) setLots(lotList.sort((a, b) => b.updatedAt - a.updatedAt));
      setLoading(false);
    })();
  }, []);

  const startNew = () => {
    setCurrent(newEstimate(settings));
    setView("estimate");
  };
  const openEstimate = (e) => {
    setCurrent(JSON.parse(JSON.stringify(e)));
    setView("estimate");
  };
  const persist = useCallback(async (est) => {
    const stamped = { ...est, updatedAt: Date.now() };
    await store.save(stamped);
    setEstimates((prev) => {
      const without = prev.filter((p) => p.id !== stamped.id);
      return [stamped, ...without].sort((a, b) => b.updatedAt - a.updatedAt);
    });
    return stamped;
  }, []);
  const saveCurrent = async () => {
    if (!current.name.trim()) return flash("Name the project before saving");
    const saved = await persist(current);
    setCurrent(saved);
    flash(hasStore ? "Estimate saved" : "Saved (this session only)");
  };
  const deleteEstimate = async (id) => {
    await store.remove(id);
    setEstimates((prev) => prev.filter((p) => p.id !== id));
    if (current && current.id === id) {
      setCurrent(null);
      setView("dashboard");
    }
    flash("Estimate deleted");
  };
  const saveSettings = async (s) => {
    setSettings(s);
    await store.saveSettings(s);
    flash("Settings saved");
  };

  const startFeas = () => {
    setCurrentFeas(newFeasibility());
    setView("feasibility");
  };
  const openFeas = (f) => {
    setCurrentFeas(JSON.parse(JSON.stringify(f)));
    setView("feasibility");
  };
  const saveFeas = async (f) => {
    if (!f.name.trim()) {
      flash("Name the scenario before saving");
      return;
    }
    const stamped = { ...f, updatedAt: Date.now() };
    await store.saveFeas(stamped);
    setScenarios((prev) => [stamped, ...prev.filter((p) => p.id !== stamped.id)].sort((a, b) => b.updatedAt - a.updatedAt));
    setCurrentFeas(stamped);
    flash(hasStore ? "Scenario saved" : "Saved (this session only)");
  };
  const deleteFeas = async (id) => {
    await store.removeFeas(id);
    setScenarios((prev) => prev.filter((p) => p.id !== id));
    if (currentFeas && currentFeas.id === id) setCurrentFeas(null);
    flash("Scenario deleted");
  };
  const convertFeasToEstimate = (f) => {
    const est = newEstimate(settings);
    est.name = f.name ? `${f.name} (detailed)` : "New construction build";
    est.projectType = "newconstruction";
    const c = computeFeasibility(f);
    est.notes = `Feasibility basis: ${num(f.sqft).toLocaleString()} sq ft × ${fmt(num(f.psf))}/sq ft (${c.loc.label}). Ballpark all-in ${fmt(c.totalCost)}; lot ${fmt(num(f.lotCost))}.`;
    setCurrent(est);
    setView("estimate");
    flash("Started detailed estimate — load the scope template");
  };

  const startFlip = () => {
    setCurrentFlip(newFlip());
    setView("flip");
  };
  const openFlip = (f) => {
    setCurrentFlip(JSON.parse(JSON.stringify(f)));
    setView("flip");
  };
  const saveFlip = async (f) => {
    if (!f.name.trim()) {
      flash("Name the flip before saving");
      return;
    }
    const stamped = { ...f, updatedAt: Date.now() };
    await store.saveFlip(stamped);
    setFlips((prev) => [stamped, ...prev.filter((p) => p.id !== stamped.id)].sort((a, b) => b.updatedAt - a.updatedAt));
    setCurrentFlip(stamped);
    flash(hasStore ? "Flip saved" : "Saved (this session only)");
  };
  const deleteFlip = async (id) => {
    await store.removeFlip(id);
    setFlips((prev) => prev.filter((p) => p.id !== id));
    if (currentFlip && currentFlip.id === id) setCurrentFlip(null);
    flash("Flip deleted");
  };
  const convertFlipToEstimate = (f) => {
    const est = newEstimate(settings);
    est.name = f.name ? `${f.name} — rehab` : "Flip rehab";
    est.projectType = "remodel";
    est.client.address = f.address || "";
    const c = computeFlip(f);
    // seed the estimate with the rehab budget lines that have a cost
    const items = (f.rehabItems || [])
      .filter((it) => num(it.cost) > 0)
      .map((it) => ({ id: uid(), description: it.label, qty: 1, unit: "lump", materialCost: num(it.cost), laborHours: 0, laborRate: settings.laborRate }));
    if (items.length) est.sections = [{ id: uid(), name: "Rehab budget", items }];
    est.notes = `Flip basis: ARV ${fmt(c.arv)} (${fmt(c.arvPsf)}/sq ft), rehab ${fmt(c.rehab)}, projected profit ${fmt(c.profit)} at ${fmtPct(c.margin)} margin.`;
    setCurrent(est);
    setView("estimate");
    flash("Started rehab estimate from the flip");
  };

  const startLot = () => {
    setCurrentLot(newLot());
    setView("lot");
  };
  const openLot = (l) => {
    setCurrentLot(JSON.parse(JSON.stringify(l)));
    setView("lot");
  };
  const saveLot = async (l) => {
    if (!l.name.trim()) {
      flash("Name the lot before saving");
      return;
    }
    const stamped = { ...l, updatedAt: Date.now() };
    await store.saveLot(stamped);
    setLots((prev) => [stamped, ...prev.filter((p) => p.id !== stamped.id)].sort((a, b) => b.updatedAt - a.updatedAt));
    setCurrentLot(stamped);
    flash(hasStore ? "Lot saved" : "Saved (this session only)");
  };
  const deleteLot = async (id) => {
    await store.removeLot(id);
    setLots((prev) => prev.filter((p) => p.id !== id));
    if (currentLot && currentLot.id === id) setCurrentLot(null);
    flash("Lot deleted");
  };
  const convertLotToEstimate = (l) => {
    const est = newEstimate(settings);
    est.name = l.name ? `${l.name} — site work` : "Lot site development";
    est.projectType = "newconstruction";
    est.client.address = l.address || "";
    const c = computeLot(l);
    const items = (l.devItems || [])
      .filter((it) => num(it.cost) > 0)
      .map((it) => ({ id: uid(), description: it.label, qty: 1, unit: "lump", materialCost: num(it.cost), laborHours: 0, laborRate: settings.laborRate }));
    if (items.length) est.sections = [{ id: uid(), name: "Site development", items }];
    est.notes = `Lot basis: ${c.acres.toFixed(2)} acres, all-in site development ${fmt(c.development)}${l.exitMode === "build" ? `; finished lot cost ${fmt(c.finishedLotCost)} = ${fmtPct(c.lotRatio)} of ${fmt(c.arv)} ARV.` : `; resell ${fmt(c.resale)}, profit ${fmt(c.profit)}.`}`;
    setCurrent(est);
    setView("estimate");
    flash("Started site-work estimate from the lot");
  };

  return (
    <div className="ac-root">
      <style>{CSS}</style>
      <div className="ac-shell">
        <aside className="ac-rail">
          <div className="ac-brand">
            <img src={logoUrl} alt="Altar'd Chaos" style={{ width: "100%", height: "auto", display: "block" }} />
            <div className="ac-tag" style={{ marginTop: 10 }}>Order, forged from chaos</div>
          </div>
          <nav className="ac-nav">
            <button className={"ac-navbtn" + (view === "dashboard" ? " on" : "")} onClick={() => setView("dashboard")}>
              <Icon d={icons.dash} /> Dashboard
            </button>
            <button className={"ac-navbtn" + (view === "estimate" ? " on" : "")} onClick={startNew}>
              <Icon d={icons.doc} /> New Estimate
            </button>
            <button className={"ac-navbtn" + (view === "feasibility" ? " on" : "")} onClick={startFeas}>
              <Icon d={icons.calc} /> Feasibility
            </button>
            <button className={"ac-navbtn" + (view === "flip" ? " on" : "")} onClick={startFlip}>
              <Icon d={icons.flip} /> Flips
            </button>
            <button className={"ac-navbtn" + (view === "lot" ? " on" : "")} onClick={startLot}>
              <Icon d={icons.lot} /> Lots
            </button>
            <button className={"ac-navbtn" + (view === "settings" ? " on" : "")} onClick={() => setView("settings")}>
              <Icon d={icons.gear} /> Settings
            </button>
          </nav>
          <div className="ac-railfoot">
            <div>{hasStore ? "Saved to this device" : "Demo mode — data not persisted"}</div>
            {onSignOut && (
              <button className="ac-navbtn" style={{ marginTop: 8, fontSize: 12, padding: "8px 12px" }} onClick={onSignOut}>
                <Icon d={icons.lock} size={15} /> Sign out
              </button>
            )}
          </div>
        </aside>

        <main className="ac-content">
          {loading ? (
            <div className="ac-pad ac-sub">Loading the forge…</div>
          ) : view === "dashboard" ? (
            <Dashboard estimates={estimates} settings={settings} onOpen={openEstimate} onNew={startNew} onDelete={deleteEstimate} onFeasibility={startFeas} onFlip={startFlip} onLot={startLot} />
          ) : view === "settings" ? (
            <Settings settings={settings} onSave={saveSettings} />
          ) : view === "feasibility" ? (
            <Feasibility
              scenarios={scenarios}
              initial={currentFeas}
              onOpen={openFeas}
              onNew={startFeas}
              onSave={saveFeas}
              onDelete={deleteFeas}
              onConvert={convertFeasToEstimate}
            />
          ) : view === "flip" ? (
            <Flips
              flips={flips}
              initial={currentFlip}
              onOpen={openFlip}
              onNew={startFlip}
              onSave={saveFlip}
              onDelete={deleteFlip}
              onConvert={convertFlipToEstimate}
            />
          ) : view === "lot" ? (
            <Lots
              lots={lots}
              initial={currentLot}
              onOpen={openLot}
              onNew={startLot}
              onSave={saveLot}
              onDelete={deleteLot}
              onConvert={convertLotToEstimate}
            />
          ) : current ? (
            <Builder
              est={current}
              settings={settings}
              onChange={setCurrent}
              onSave={saveCurrent}
              onBack={() => setView("dashboard")}
              onQuote={() => {
                if (!current.name.trim()) return flash("Name the project first");
                setShowQuote(true);
              }}
            />
          ) : null}
        </main>
      </div>

      {showQuote && current && (
        <QuoteModal est={current} settings={settings} onClose={() => setShowQuote(false)} flash={flash} />
      )}
      {toast && <div className="ac-toast">{toast}</div>}
    </div>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({ estimates, settings, onOpen, onNew, onDelete, onFeasibility, onFlip, onLot }) {
  const active = estimates.filter((e) => e.status === "draft" || e.status === "sent");
  const totalQuoted = estimates.filter((e) => e.status !== "lost").reduce((s, e) => s + compute(e).grand, 0);
  const won = estimates.filter((e) => e.status === "won");
  const wonValue = won.reduce((s, e) => s + compute(e).grand, 0);

  return (
    <div className="ac-pad">
      <div className="ac-eyebrow">The Workbench</div>
      <h1 className="ac-h1 ac-display">Estimates</h1>
      <Fracture />

      <div className="ac-ctagrid" style={{ marginBottom: 24 }}>
        <button className="ac-cta" onClick={onFeasibility}>
          <span className="badge"><Icon d={icons.calc} size={22} /></span>
          <span style={{ flex: 1 }}>
            <span className="ac-display" style={{ fontSize: 16, letterSpacing: ".04em", textTransform: "uppercase", display: "block" }}>
              New-Build Feasibility
            </span>
            <span className="ac-sub" style={{ marginTop: 3, display: "block" }}>
              Square footage and lot cost → a ballpark all-in build cost, checked against comps and projected resale.
            </span>
          </span>
          <Icon d={icons.arrow} size={18} />
        </button>
        <button className="ac-cta" onClick={onFlip}>
          <span className="badge"><Icon d={icons.flip} size={22} /></span>
          <span style={{ flex: 1 }}>
            <span className="ac-display" style={{ fontSize: 16, letterSpacing: ".04em", textTransform: "uppercase", display: "block" }}>
              Flip Analyzer
            </span>
            <span className="ac-sub" style={{ marginTop: 3, display: "block" }}>
              Purchase, rehab, and holding costs vs. sold comps → projected profit, ROI, and a 70%-rule max offer.
            </span>
          </span>
          <Icon d={icons.arrow} size={18} />
        </button>
        <button className="ac-cta" onClick={onLot}>
          <span className="badge"><Icon d={icons.lot} size={22} /></span>
          <span style={{ flex: 1 }}>
            <span className="ac-display" style={{ fontSize: 16, letterSpacing: ".04em", textTransform: "uppercase", display: "block" }}>
              Lot Analyzer
            </span>
            <span className="ac-sub" style={{ marginTop: 3, display: "block" }}>
              Land purchase + site development → resell the lot for profit, or check the lot-to-value ratio for a spec build.
            </span>
          </span>
          <Icon d={icons.arrow} size={18} />
        </button>
      </div>

      <div className="ac-statbig" style={{ marginBottom: 28 }}>
        <div className="ac-statbox">
          <div className="ac-statval ac-num ac-display">{active.length}</div>
          <div className="ac-statlbl">Active jobs</div>
        </div>
        <div className="ac-statbox">
          <div className="ac-statval ac-num ac-display">{fmt(totalQuoted)}</div>
          <div className="ac-statlbl">Quoted (open + won)</div>
        </div>
        <div className="ac-statbox">
          <div className="ac-statval ac-num ac-display" style={{ color: "var(--good)" }}>{fmt(wonValue)}</div>
          <div className="ac-statlbl">{won.length} jobs won</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 className="ac-h2 ac-display">All Estimates</h2>
        <button className="ac-btn primary" onClick={onNew}>
          <Icon d={icons.plus} size={15} /> New Estimate
        </button>
      </div>

      {estimates.length === 0 ? (
        <div className="ac-empty">
          <div className="ac-display" style={{ fontSize: 19, letterSpacing: ".06em", textTransform: "uppercase" }}>Nothing forged yet</div>
          <p className="ac-sub" style={{ maxWidth: 360, margin: "10px auto 22px" }}>
            Start your first estimate. Pick a scope template for remodels, new construction, or interior design, then enter your numbers.
          </p>
          <button className="ac-btn primary" onClick={onNew}>
            <Icon d={icons.plus} size={15} /> Build First Estimate
          </button>
        </div>
      ) : (
        <div className="ac-grid">
          {estimates.map((e) => {
            const t = compute(e);
            const st = STATUSES[e.status] || STATUSES.draft;
            return (
              <div key={e.id} className="ac-jobcard" onClick={() => onOpen(e)} role="button" tabIndex={0}
                onKeyDown={(ev) => (ev.key === "Enter" ? onOpen(e) : null)}>
                <div className="ac-stat">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 5 }}>
                    <span className="ac-display" style={{ fontSize: 16, letterSpacing: ".04em", textTransform: "uppercase" }}>
                      {e.name || "Untitled estimate"}
                    </span>
                    <span className="ac-pill">
                      <span className="ac-dot" style={{ background: st.color }} /> {st.label}
                    </span>
                  </div>
                  <div className="ac-sub" style={{ marginTop: 0 }}>
                    {e.client.name || "No client"} · {TEMPLATES(0)[e.projectType]?.label || "Project"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="ac-num ac-display" style={{ fontSize: 20 }}>{fmt(t.grand)}</div>
                  <div className="ac-statlbl" style={{ marginTop: 2 }}>margin {fmtPct(t.margin)}</div>
                </div>
                <button className="ac-iconbtn" title="Delete" onClick={(ev) => { ev.stopPropagation(); onDelete(e.id); }}>
                  <Icon d={icons.trash} size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Builder ---------- */
function Builder({ est, settings, onChange, onSave, onBack, onQuote }) {
  const t = useMemo(() => compute(est), [est]);
  const set = (patch) => onChange({ ...est, ...patch });
  const setClient = (patch) => onChange({ ...est, client: { ...est.client, ...patch } });

  const addSection = () =>
    set({ sections: [...est.sections, { id: uid(), name: "New section", items: [mkItem("", "ea", settings.laborRate)] }] });

  const loadTemplate = () => {
    const tpl = TEMPLATES(settings.laborRate)[est.projectType];
    if (!tpl) return;
    const sections = tpl.sections.map((s) => ({
      id: uid(),
      name: s.name,
      items: s.items.map((it) => ({ ...it, id: uid() })),
    }));
    set({ sections });
  };

  const updateSection = (sid, patch) =>
    set({ sections: est.sections.map((s) => (s.id === sid ? { ...s, ...patch } : s)) });
  const removeSection = (sid) => set({ sections: est.sections.filter((s) => s.id !== sid) });
  const addItem = (sid) =>
    updateSection(sid, { items: [...est.sections.find((s) => s.id === sid).items, mkItem("", "ea", settings.laborRate)] });
  const updateItem = (sid, iid, patch) => {
    const sec = est.sections.find((s) => s.id === sid);
    updateSection(sid, { items: sec.items.map((it) => (it.id === iid ? { ...it, ...patch } : it)) });
  };
  const removeItem = (sid, iid) => {
    const sec = est.sections.find((s) => s.id === sid);
    updateSection(sid, { items: sec.items.filter((it) => it.id !== iid) });
  };

  return (
    <div className="ac-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
        <button className="ac-btn ghost sm" onClick={onBack}>
          <Icon d={icons.back} size={14} /> Dashboard
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="ac-btn ghost" onClick={onQuote}>View Quote</button>
          <button className="ac-btn primary" onClick={onSave}>Save Estimate</button>
        </div>
      </div>

      <div className="ac-builder">
        <div>
          {/* project header card */}
          <div className="ac-card ac-pad" style={{ padding: 22, marginBottom: 22 }}>
            <div className="ac-eyebrow">Project</div>
            <input
              className="ac-input ac-display"
              style={{ fontSize: 22, letterSpacing: ".02em", padding: "10px 12px", marginBottom: 18 }}
              placeholder="Project name (e.g., Henderson kitchen remodel)"
              value={est.name}
              onChange={(e) => set({ name: e.target.value })}
            />
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Project type</label>
                <select className="ac-select" value={est.projectType} onChange={(e) => set({ projectType: e.target.value })}>
                  <option value="remodel">Remodel / Renovation</option>
                  <option value="newconstruction">New Construction / Addition</option>
                  <option value="interior">Interior Design</option>
                </select>
              </div>
              <div>
                <label className="ac-label">Status</label>
                <select className="ac-select" value={est.status} onChange={(e) => set({ status: e.target.value })}>
                  {Object.entries(STATUSES).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ac-label">Client name</label>
                <input className="ac-input" value={est.client.name} onChange={(e) => setClient({ name: e.target.value })} placeholder="Client" />
              </div>
              <div>
                <label className="ac-label">Client phone</label>
                <input className="ac-input" value={est.client.phone} onChange={(e) => setClient({ phone: e.target.value })} placeholder="(000) 000-0000" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="ac-label">Project address</label>
                <input className="ac-input" value={est.client.address} onChange={(e) => setClient({ address: e.target.value })} placeholder="Job site address" />
              </div>
            </div>
          </div>

          {/* sections */}
          {est.sections.length === 0 ? (
            <div className="ac-empty">
              <p className="ac-sub" style={{ marginTop: 0, marginBottom: 18 }}>
                Load the {TEMPLATES(0)[est.projectType]?.label} scope template, or build sections from scratch.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="ac-btn primary" onClick={loadTemplate}>Load Scope Template</button>
                <button className="ac-btn" onClick={addSection}>Blank Section</button>
              </div>
            </div>
          ) : (
            <>
              {est.sections.map((sec, si) => (
                <div className="ac-section" key={sec.id}>
                  <div className="ac-sechead">
                    <input
                      className="ac-input ac-display"
                      style={{ background: "transparent", border: "1px solid transparent", fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", padding: "5px 8px" }}
                      value={sec.name}
                      onChange={(e) => updateSection(sec.id, { name: e.target.value })}
                    />
                    <span className="ac-num ac-sub" style={{ marginTop: 0, whiteSpace: "nowrap" }}>{fmt(t.sectionTotals[si])}</span>
                    <button className="ac-iconbtn" title="Remove section" onClick={() => removeSection(sec.id)}>
                      <Icon d={icons.trash} size={15} />
                    </button>
                  </div>
                  <div className="ac-tablewrap">
                    <div className="ac-row head">
                      <span>Description</span><span className="right">Qty</span><span>Unit</span>
                      <span className="right">Material $</span><span className="right">Hrs</span>
                      <span className="right">Rate</span><span className="right">Total</span><span />
                    </div>
                    {sec.items.map((it) => {
                      const rowTot = num(it.qty) * num(it.materialCost) + num(it.laborHours) * num(it.laborRate);
                      return (
                        <div className="ac-row" key={it.id}>
                          <input className="ac-input ti" placeholder="Line item" value={it.description} onChange={(e) => updateItem(sec.id, it.id, { description: e.target.value })} />
                          <input className="ac-input ti right ac-num" type="number" value={it.qty} onChange={(e) => updateItem(sec.id, it.id, { qty: e.target.value })} />
                          <select className="ac-select ti" value={it.unit} onChange={(e) => updateItem(sec.id, it.id, { unit: e.target.value })}>
                            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                          <input className="ac-input ti right ac-num" type="number" value={it.materialCost} onChange={(e) => updateItem(sec.id, it.id, { materialCost: e.target.value })} />
                          <input className="ac-input ti right ac-num" type="number" value={it.laborHours} onChange={(e) => updateItem(sec.id, it.id, { laborHours: e.target.value })} />
                          <input className="ac-input ti right ac-num" type="number" value={it.laborRate} onChange={(e) => updateItem(sec.id, it.id, { laborRate: e.target.value })} />
                          <div className="ac-rowtot ac-num">{fmt(rowTot)}</div>
                          <button className="ac-iconbtn" title="Remove" onClick={() => removeItem(sec.id, it.id)}>
                            <Icon d={icons.trash} size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    <button className="ac-btn ghost sm" onClick={() => addItem(sec.id)}>
                      <Icon d={icons.plus} size={13} /> Add line
                    </button>
                  </div>
                </div>
              ))}
              <button className="ac-btn" onClick={addSection} style={{ marginTop: 4 }}>
                <Icon d={icons.plus} size={14} /> Add Section
              </button>
            </>
          )}
        </div>

        {/* totals sidebar */}
        <div className="ac-totals">
          <div className="ac-card" style={{ padding: 20 }}>
            <div className="ac-eyebrow" style={{ marginBottom: 14 }}>The Numbers</div>
            <div className="ac-line"><span>Materials</span><span className="v ac-num">{fmt(t.materials)}</span></div>
            <div className="ac-line"><span>Labor</span><span className="v ac-num">{fmt(t.labor)}</span></div>
            <div className="ac-line major"><span>Direct cost</span><span className="v ac-num">{fmt(t.direct)}</span></div>

            <div style={{ marginTop: 14, marginBottom: 6 }} className="ac-eyebrow">Adjustments</div>
            <SliderLine label="Overhead" value={est.overhead} onChange={(v) => set({ overhead: v })} amount={t.overhead} />
            <SliderLine label="Contingency" value={est.contingency} onChange={(v) => set({ contingency: v })} amount={t.contingency} />
            <SliderLine label="Markup" value={est.markup} onChange={(v) => set({ markup: v })} amount={t.markupAmt} accent />

            <div className="ac-line" style={{ paddingTop: 4 }}>
              <span>Resulting margin</span>
              <span className="v ac-num" style={{ color: "var(--good)" }}>{fmtPct(t.margin)}</span>
            </div>

            <div style={{ marginTop: 14, marginBottom: 6 }} className="ac-eyebrow">Sales Tax</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <select className="ac-select" value={est.taxMode} onChange={(e) => set({ taxMode: e.target.value })} style={{ flex: 1 }}>
                <option value="capital">Capital improvement</option>
                <option value="rmi">Repair / install (RMI)</option>
              </select>
              <input className="ac-input ac-num right" type="number" step="0.0001" style={{ width: 78 }}
                value={(est.taxRate * 100).toFixed(2)} onChange={(e) => set({ taxRate: num(e.target.value) / 100 })} title="Tax rate %" />
            </div>
            {est.taxMode === "capital" ? (
              <div className="ac-line"><span>Material tax (you remit)</span><span className="v ac-num">{fmt(t.matTax)}</span></div>
            ) : (
              <div className="ac-line"><span>Tax billed to client</span><span className="v ac-num">{fmt(t.custTax)}</span></div>
            )}

            <div className="ac-grand">
              <span className="lbl">{est.taxMode === "rmi" ? "Total to client" : "Price to client"}</span>
              <span className="amt ac-num ac-display">{fmt(t.grand)}</span>
            </div>
            <p className="ac-note" style={{ marginTop: 14 }}>
              NC taxes capital improvements (materials taxed to you) differently from repair/install work (tax billed to the client). Confirm treatment with NCDOR or your CPA — this is a tool, not tax advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderLine({ label, value, onChange, amount, accent }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="ac-line" style={{ padding: "2px 0" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {label}
          <input className="ac-input ac-num right" type="number" step="1" style={{ width: 56, padding: "3px 6px", fontSize: 12 }}
            value={Math.round(value * 100)} onChange={(e) => onChange(num(e.target.value) / 100)} />
          <span style={{ color: "var(--ash2)", fontSize: 12 }}>%</span>
        </span>
        <span className="v ac-num" style={accent ? { color: "var(--ember2)" } : undefined}>{fmt(amount)}</span>
      </div>
      <input type="range" min="0" max="100" value={Math.round(value * 100)} onChange={(e) => onChange(num(e.target.value) / 100)}
        style={{ width: "100%", accentColor: accent ? "#FF5B23" : "#62626C", height: 3 }} />
    </div>
  );
}

/* ---------- Quote Modal ---------- */
function QuoteModal({ est, settings, onClose, flash }) {
  const t = compute(est);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const allocated = est.sections.map((s, i) => ({
    name: s.name,
    price: t.direct > 0 ? (t.sectionTotals[i] / t.direct) * t.price : 0,
  }));

  const copyText = () => {
    const lines = [
      `${settings.companyName} — Project Quote`,
      settings.license ? `NC License: ${settings.license}` : "",
      "",
      `Date: ${today}`,
      `Project: ${est.name}`,
      est.client.name ? `Client: ${est.client.name}` : "",
      est.client.address ? `Address: ${est.client.address}` : "",
      "",
      "SCOPE OF WORK",
      ...allocated.map((a) => `  ${a.name}: ${fmt(a.price)}`),
      "",
      est.taxMode === "rmi" ? `Subtotal: ${fmt(t.price)}` : "",
      est.taxMode === "rmi" ? `Sales tax: ${fmt(t.custTax)}` : "",
      `TOTAL INVESTMENT: ${fmt(t.grand)}`,
      est.notes ? `\nNotes: ${est.notes}` : "",
    ].filter((l) => l !== "");
    const text = lines.join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => flash("Quote copied")).catch(() => flash("Copy failed"));
  };

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-modal ac-quote" onClick={(e) => e.stopPropagation()}>
        <div className="ac-pad" style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <img src={logoUrl} alt={settings.companyName || "Altar'd Chaos"} style={{ height: 56, width: "auto", maxWidth: 260 }} />
              <div className="ac-tag">{settings.tagline}</div>
            </div>
            <button className="ac-iconbtn" onClick={onClose} title="Close" style={{ fontSize: 18 }}>✕</button>
          </div>

          <Fracture />

          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 8 }}>
            <div>
              <div className="ac-label">Prepared for</div>
              <div style={{ fontSize: 15 }}>{est.client.name || "—"}</div>
              <div className="ac-sub" style={{ marginTop: 2 }}>{est.client.address}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="ac-label">Date</div>
              <div className="ac-num">{today}</div>
              {settings.license && <div className="ac-sub" style={{ marginTop: 6 }}>NC Lic. {settings.license}</div>}
            </div>
          </div>

          <div className="ac-display" style={{ fontSize: 22, letterSpacing: ".02em", textTransform: "uppercase", margin: "14px 0 4px" }}>
            {est.name || "Project Quote"}
          </div>
          <div className="ac-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Scope of Work</div>
          {allocated.map((a, i) => (
            <div className="ac-line" key={i} style={{ borderTop: i ? "1px solid var(--line)" : "0", padding: "11px 0" }}>
              <span style={{ color: "var(--bone)" }}>{a.name}</span>
              <span className="v ac-num">{fmt(a.price)}</span>
            </div>
          ))}

          {est.taxMode === "rmi" && (
            <>
              <div className="ac-line major"><span>Subtotal</span><span className="v ac-num">{fmt(t.price)}</span></div>
              <div className="ac-line"><span>Sales tax ({fmtPct(est.taxRate)})</span><span className="v ac-num">{fmt(t.custTax)}</span></div>
            </>
          )}

          <div className="ac-grand">
            <span className="lbl">Total Investment</span>
            <span className="amt ac-num ac-display">{fmt(t.grand)}</span>
          </div>

          <div style={{ marginTop: 18 }}>
            <label className="ac-label">Notes & terms (shown on quote)</label>
            <textarea className="ac-textarea" value={est.notes} readOnly placeholder="Add notes from the estimate's Notes field." />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button className="ac-btn ghost" onClick={() => window.print()}>Print</button>
            <button className="ac-btn primary" onClick={copyText}>
              <Icon d={icons.copy} size={14} /> Copy Quote Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Settings ---------- */
function Settings({ settings, onSave }) {
  const [s, setS] = useState(settings);
  useEffect(() => setS(settings), [settings]);
  const f = (patch) => setS({ ...s, ...patch });

  return (
    <div className="ac-pad">
      <div className="ac-eyebrow">Configuration</div>
      <h1 className="ac-h1 ac-display">Settings</h1>
      <Fracture />

      <div className="ac-card ac-pad" style={{ padding: 24, maxWidth: 620, marginBottom: 20 }}>
        <h2 className="ac-h2 ac-display" style={{ marginBottom: 18 }}>Company</h2>
        <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="ac-label">Business name</label>
            <input className="ac-input" value={s.companyName} onChange={(e) => f({ companyName: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="ac-label">Tagline</label>
            <input className="ac-input" value={s.tagline} onChange={(e) => f({ tagline: e.target.value })} />
          </div>
          <div>
            <label className="ac-label">NC license #</label>
            <input className="ac-input" value={s.license} onChange={(e) => f({ license: e.target.value })} placeholder="e.g., 00000" />
          </div>
          <div>
            <label className="ac-label">Phone</label>
            <input className="ac-input" value={s.phone} onChange={(e) => f({ phone: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="ac-label">Email</label>
            <input className="ac-input" value={s.email} onChange={(e) => f({ email: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="ac-card ac-pad" style={{ padding: 24, maxWidth: 620 }}>
        <h2 className="ac-h2 ac-display" style={{ marginBottom: 6 }}>Estimating Defaults</h2>
        <p className="ac-note" style={{ marginBottom: 18 }}>Applied to every new estimate. You can still override them per job.</p>
        <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label className="ac-label">Default labor rate ($/hr)</label>
            <input className="ac-input ac-num" type="number" value={s.laborRate} onChange={(e) => f({ laborRate: num(e.target.value) })} />
          </div>
          <div>
            <label className="ac-label">Default markup (%)</label>
            <input className="ac-input ac-num" type="number" value={Math.round(s.markup * 100)} onChange={(e) => f({ markup: num(e.target.value) / 100 })} />
          </div>
          <div>
            <label className="ac-label">Overhead (%)</label>
            <input className="ac-input ac-num" type="number" value={Math.round(s.overhead * 100)} onChange={(e) => f({ overhead: num(e.target.value) / 100 })} />
          </div>
          <div>
            <label className="ac-label">Contingency (%)</label>
            <input className="ac-input ac-num" type="number" value={Math.round(s.contingency * 100)} onChange={(e) => f({ contingency: num(e.target.value) / 100 })} />
          </div>
          <div>
            <label className="ac-label">Sales tax rate (%)</label>
            <input className="ac-input ac-num" type="number" step="0.01" value={(s.taxRate * 100).toFixed(2)} onChange={(e) => f({ taxRate: num(e.target.value) / 100 })} />
          </div>
          <div>
            <label className="ac-label">Default tax treatment</label>
            <select className="ac-select" value={s.taxMode} onChange={(e) => f({ taxMode: e.target.value })}>
              <option value="capital">Capital improvement</option>
              <option value="rmi">Repair / install (RMI)</option>
            </select>
          </div>
        </div>
        <p className="ac-note" style={{ marginTop: 16 }}>
          Markup is added on top of cost; margin is the share of the final price that's profit. A 30% markup is roughly a 23% margin — the builder shows your true margin live so you can price with intent.
        </p>
        <div style={{ marginTop: 20 }}>
          <button className="ac-btn primary" onClick={() => onSave(s)}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Feasibility ---------- */
function Feasibility({ scenarios, initial, onOpen, onNew, onSave, onDelete, onConvert }) {
  const [f, setF] = useState(initial || newFeasibility());
  useEffect(() => {
    if (initial) setF(initial);
  }, [initial && initial.id]);

  const set = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const c = useMemo(() => computeFeasibility(f), [f]);

  const pickTier = (key) => {
    const tier = FINISH_TIERS.find((t) => t.key === key);
    set({ tier: key, psf: tier ? tier.psf : f.psf });
  };
  const pickCounty = (key) => {
    const co = COUNTIES.find((x) => x.key === key);
    set({ county: key, resalePsf: co ? co.resalePsf : f.resalePsf });
  };
  const addComp = () => set({ comps: [...f.comps, { id: uid(), label: "", price: "", sqft: "", dom: "" }] });
  const updateComp = (id, patch) => set({ comps: f.comps.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const removeComp = (id) => set({ comps: f.comps.filter((x) => x.id !== id) });

  const profitColor = c.profit >= 0 ? "var(--good)" : "var(--blood)";

  return (
    <div className="ac-pad">
      <div className="ac-eyebrow">Feasibility</div>
      <h1 className="ac-h1 ac-display">New-Build Pro Forma</h1>
      <Fracture />

      {scenarios.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
          {scenarios.map((sc) => {
            const cc = computeFeasibility(sc);
            return (
              <div key={sc.id} className="ac-card" style={{ padding: "12px 14px", minWidth: 190, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                onClick={() => onOpen(sc)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" ? onOpen(sc) : null)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ac-display" style={{ fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {sc.name || "Untitled"}
                  </div>
                  <div className="ac-num ac-sub" style={{ marginTop: 2 }}>{fmt(cc.totalCost)} · {cc.profit >= 0 ? "+" : ""}{fmt(cc.profit)}</div>
                </div>
                <button className="ac-iconbtn" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(sc.id); }}>
                  <Icon d={icons.trash} size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="ac-feas">
        <div>
          {/* basis */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Project Basis</div>
            <input className="ac-input ac-display" style={{ fontSize: 20, padding: "10px 12px", marginBottom: 16 }}
              placeholder="Scenario name (e.g., Maple St spec, 3/2 ranch)" value={f.name} onChange={(e) => set({ name: e.target.value })} />
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Heated square footage</label>
                <input className="ac-input ac-num" type="number" value={f.sqft} onChange={(e) => set({ sqft: e.target.value })} />
              </div>
              <div>
                <label className="ac-label">Finish level</label>
                <select className="ac-select" value={f.tier} onChange={(e) => pickTier(e.target.value)}>
                  {FINISH_TIERS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="ac-label">Build cost ($/sq ft)</label>
                <input className="ac-input ac-num" type="number" value={f.psf} onChange={(e) => set({ psf: e.target.value })} />
              </div>
              <div>
                <label className="ac-label">County</label>
                <select className="ac-select" value={f.county || "statewide"} onChange={(e) => pickCounty(e.target.value)}>
                  <option value="statewide">NC statewide (no county)</option>
                  {COUNTY_GROUPS.map((g) => (
                    <optgroup key={g} label={g}>
                      {COUNTIES.filter((co) => co.group === g).map((co) => (
                        <option key={co.key} value={co.key}>{co.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="ac-label">Lot / land cost</label>
                <input className="ac-input ac-num" type="number" value={f.lotCost} onChange={(e) => set({ lotCost: e.target.value })} />
              </div>
              <div>
                <label className="ac-label">Site prep / foundation extra</label>
                <input className="ac-input ac-num" type="number" value={f.sitePrep} onChange={(e) => set({ sitePrep: e.target.value })} placeholder="0" />
              </div>
            </div>
          </div>

          {/* assumptions */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Cost Assumptions</div>
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Soft costs (% of hard)</label>
                <input className="ac-input ac-num" type="number" value={Math.round(f.softPct * 100)} onChange={(e) => set({ softPct: num(e.target.value) / 100 })} />
              </div>
              <div>
                <label className="ac-label">Contingency (% of hard)</label>
                <input className="ac-input ac-num" type="number" value={Math.round(f.contingencyPct * 100)} onChange={(e) => set({ contingencyPct: num(e.target.value) / 100 })} />
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer", fontSize: 13, color: "var(--ash)" }}>
              <input type="checkbox" checked={f.useFinancing} onChange={(e) => set({ useFinancing: e.target.checked })} style={{ accentColor: "#FF5B23", width: 16, height: 16 }} />
              Include construction-loan interest carry
            </label>
            {f.useFinancing && (
              <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                <div>
                  <label className="ac-label">Loan APR (%)</label>
                  <input className="ac-input ac-num" type="number" step="0.1" value={(f.loanApr * 100).toFixed(1)} onChange={(e) => set({ loanApr: num(e.target.value) / 100 })} />
                </div>
                <div>
                  <label className="ac-label">Build duration (months)</label>
                  <input className="ac-input ac-num" type="number" value={f.buildMonths} onChange={(e) => set({ buildMonths: e.target.value })} />
                </div>
              </div>
            )}
            <p className="ac-note" style={{ marginTop: 14 }}>
              Soft costs cover design, engineering, permits, insurance and loan fees (NC typically 20–30%). Carry assumes interest-only on ~50% average outstanding balance over the build.
            </p>
          </div>

          {/* resale / comps */}
          <div className="ac-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div className="ac-eyebrow" style={{ marginBottom: 0 }}>Resale Value</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={"ac-btn sm" + (f.resaleMode === "comps" ? " primary" : " ghost")} onClick={() => set({ resaleMode: "comps" })}>From comps</button>
                <button className={"ac-btn sm" + (f.resaleMode === "manual" ? " primary" : " ghost")} onClick={() => set({ resaleMode: "manual" })}>Manual $/sq ft</button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <span className="ac-chip">{c.loc.label} · {fmt(c.loc.medianPrice)} median · {c.loc.medianDom} days · ~{fmt(c.loc.resalePsf)}/sq ft</span>
              <button className="ac-btn ghost sm" onClick={() => set({ resaleMode: "manual", resalePsf: c.loc.resalePsf })}>Use as starting point</button>
            </div>

            {f.resaleMode === "manual" ? (
              <div style={{ maxWidth: 220 }}>
                <label className="ac-label">Expected resale ($/sq ft)</label>
                <input className="ac-input ac-num" type="number" value={f.resalePsf} onChange={(e) => set({ resalePsf: e.target.value })} />
              </div>
            ) : (
              <>
                <div className="ac-note" style={{ marginBottom: 12 }}>
                  Enter recent sales near your lot (pull from your agent, MLS, or county records). The model averages their $/sq ft and median days on market.
                </div>
                <div className="ac-tablewrap" style={{ border: "1px solid var(--line)", borderRadius: 9 }}>
                  <div className="ac-crow head">
                    <span>Comp (address / label)</span><span>Sale price</span><span>Sq ft</span><span>$/sq ft</span><span>DOM</span><span />
                  </div>
                  {f.comps.length === 0 ? (
                    <div style={{ padding: 16, textAlign: "center" }} className="ac-sub">No comps yet — add a few recent nearby sales.</div>
                  ) : (
                    f.comps.map((cp) => {
                      const psf = num(cp.price) > 0 && num(cp.sqft) > 0 ? num(cp.price) / num(cp.sqft) : 0;
                      return (
                        <div className="ac-crow" key={cp.id}>
                          <input className="ac-input ti" placeholder="123 Maple St" value={cp.label} onChange={(e) => updateComp(cp.id, { label: e.target.value })} />
                          <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.price} onChange={(e) => updateComp(cp.id, { price: e.target.value })} />
                          <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.sqft} onChange={(e) => updateComp(cp.id, { sqft: e.target.value })} />
                          <span className="ac-num ac-sub" style={{ marginTop: 0 }}>{psf ? fmt(psf) : "—"}</span>
                          <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.dom} onChange={(e) => updateComp(cp.id, { dom: e.target.value })} />
                          <button className="ac-iconbtn" title="Remove" onClick={() => removeComp(cp.id)}><Icon d={icons.trash} size={14} /></button>
                        </div>
                      );
                    })
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                  <button className="ac-btn ghost sm" onClick={addComp}><Icon d={icons.plus} size={13} /> Add comp</button>
                  {c.comps.count > 0 && (
                    <span className="ac-num ac-sub" style={{ marginTop: 0 }}>
                      {c.comps.count} comps · avg {fmt(c.comps.psf)}/sq ft · median {c.comps.medianDom || "—"} days
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* readout */}
        <div className="ac-totals">
          <div className="ac-card" style={{ padding: 20 }}>
            <div className="ac-eyebrow" style={{ marginBottom: 12 }}>Ballpark</div>
            <div className="ac-readout"><span>Hard construction</span><span className="v ac-num">{fmt(c.hard)}</span></div>
            <div className="ac-readout"><span>Soft costs</span><span className="v ac-num">{fmt(c.soft)}</span></div>
            <div className="ac-readout"><span>Contingency</span><span className="v ac-num">{fmt(c.contingency)}</span></div>
            <div className="ac-readout"><span>Lot / land</span><span className="v ac-num">{fmt(num(f.lotCost))}</span></div>
            {f.useFinancing && <div className="ac-readout"><span>Loan carry</span><span className="v ac-num">{fmt(c.carry)}</span></div>}
            <div className="ac-grand" style={{ marginTop: 4 }}>
              <span className="lbl">All-in cost</span>
              <span className="amt ac-num ac-display">{fmt(c.totalCost)}</span>
            </div>
            <div className="ac-readout" style={{ paddingTop: 8 }}><span>Cost per sq ft</span><span className="v ac-num">{fmt(c.allInPsf)}</span></div>

            <hr className="ac-divline" style={{ margin: "16px 0" }} />

            <div className="ac-eyebrow" style={{ marginBottom: 10 }}>If You Sell</div>
            <div className="ac-readout"><span>Resale ({fmt(c.resalePsf)}/sq ft)</span><span className="v ac-num">{fmt(c.resale)}</span></div>
            <div className="ac-readout"><span>Median days on market</span><span className="v ac-num">{(f.resaleMode === "comps" && c.comps.medianDom) ? c.comps.medianDom : c.loc.medianDom} days</span></div>
            <div className="ac-grand">
              <span className="lbl">Projected profit</span>
              <span className="amt ac-num ac-display" style={{ background: "none", color: profitColor, WebkitTextFillColor: profitColor }}>{c.profit >= 0 ? "" : "-"}{fmt(Math.abs(c.profit))}</span>
            </div>
            <div className="ac-readout" style={{ paddingTop: 8 }}>
              <span>Margin on sale</span>
              <span className="v ac-num" style={{ color: profitColor }}>{fmtPct(c.margin)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 18 }}>
              <button className="ac-btn primary" onClick={() => onSave(f)}>Save Scenario</button>
              <button className="ac-btn" onClick={() => onConvert(f)}><Icon d={icons.doc} size={14} /> Build Detailed Estimate</button>
            </div>
            <p className="ac-note" style={{ marginTop: 14 }}>
              A feasibility screen, not a bid or appraisal. Figures are seeded from mid-2026 NC averages and your inputs — verify $/sq ft with your subs and resale with local comps. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Flip Analyzer ---------- */
function Flips({ flips, initial, onOpen, onNew, onSave, onDelete, onConvert }) {
  const [f, setF] = useState(initial || newFlip());
  useEffect(() => {
    if (initial) setF(initial);
  }, [initial && initial.id]);

  const set = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const c = useMemo(() => computeFlip(f), [f]);
  const grade = flipGrade(c);

  const [lookupInput, setLookupInput] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupMsg, setLookupMsg] = useState(null); // { kind: 'ok' | 'err', text }

  const runLookup = async () => {
    const q = lookupInput.trim();
    if (!q) {
      setLookupMsg({ kind: "err", text: "Enter a property address or listing URL." });
      return;
    }
    setLookupBusy(true);
    setLookupMsg(null);
    try {
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(q)}`, { headers: { Accept: "application/json" } });
      let data = null;
      try { data = await res.json(); } catch (_) {}
      // No JSON error body on a 404 usually means the function isn't deployed
      // (e.g. a drag-and-drop build) and the SPA fallback served index.html.
      if (res.status === 404 && (!data || !data.error)) {
        setLookupMsg({ kind: "err", text: "Lookup needs the backend deployed. Add your RentCast key and deploy via Git or the Netlify CLI (see README). You can still enter everything manually below." });
        return;
      }
      if (!res.ok || !data || data.error) {
        setLookupMsg({ kind: "err", text: (data && data.error) || "Lookup failed — enter the details manually below." });
        return;
      }
      const patch = {};
      if (data.subject) {
        if (data.subject.sqft) patch.sqft = data.subject.sqft;
        if (data.subject.beds != null) patch.beds = data.subject.beds;
        if (data.subject.baths != null) patch.baths = data.subject.baths;
        if (data.subject.lotSize) patch.lotSize = data.subject.lotSize;
      }
      if (data.resolvedAddress) patch.address = data.resolvedAddress;
      if (Array.isArray(data.comps) && data.comps.length) {
        patch.comps = data.comps.map((cp) => ({ id: uid(), label: cp.label || "", price: cp.price || "", sqft: cp.sqft || "", dom: cp.dom == null ? "" : cp.dom }));
        patch.arvMode = "comps";
      }
      const sqftForPsf = num(patch.sqft || f.sqft);
      if (data.arv && sqftForPsf > 0) patch.arvPsf = Math.round(data.arv / sqftForPsf);
      set(patch);
      const bits = [];
      if (Array.isArray(data.comps)) bits.push(`${data.comps.length} sold comps`);
      if (data.arv) bits.push(`est. value ~${fmt(data.arv)}`);
      setLookupMsg({ kind: "ok", text: `Pulled ${bits.join(" · ")} for ${data.resolvedAddress || q}. Review the comps and confirm the ARV reflects a renovated condition before trusting it.` });
    } catch (_) {
      setLookupMsg({ kind: "err", text: "Couldn't reach the lookup service. Check your connection, or enter the details manually below." });
    } finally {
      setLookupBusy(false);
    }
  };

  const pickCounty = (key) => {
    const co = COUNTIES.find((x) => x.key === key);
    set({ county: key, arvPsf: co ? co.resalePsf : f.arvPsf });
  };
  const pickTier = (key) => {
    const tier = REHAB_TIERS.find((t) => t.key === key);
    set({ rehabTier: key, rehabPsf: tier ? tier.psf : f.rehabPsf });
  };
  const updateRehab = (id, patch) => set({ rehabItems: f.rehabItems.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const addRehab = () => set({ rehabItems: [...f.rehabItems, { id: uid(), label: "", cost: "" }] });
  const removeRehab = (id) => set({ rehabItems: f.rehabItems.filter((x) => x.id !== id) });
  const addComp = () => set({ comps: [...f.comps, { id: uid(), label: "", price: "", sqft: "", dom: "" }] });
  const updateComp = (id, patch) => set({ comps: f.comps.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const removeComp = (id) => set({ comps: f.comps.filter((x) => x.id !== id) });

  const profitColor = c.profit >= 0 ? "var(--good)" : "var(--blood)";

  return (
    <div className="ac-pad">
      <div className="ac-eyebrow">Flip Analyzer</div>
      <h1 className="ac-h1 ac-display">Deal Analyzer</h1>
      <Fracture />

      {flips.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
          {flips.map((fl) => {
            const cc = computeFlip(fl);
            return (
              <div key={fl.id} className="ac-card" style={{ padding: "12px 14px", minWidth: 200, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                onClick={() => onOpen(fl)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" ? onOpen(fl) : null)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ac-display" style={{ fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fl.name || "Untitled"}
                  </div>
                  <div className="ac-num ac-sub" style={{ marginTop: 2, color: cc.profit >= 0 ? "var(--good)" : "var(--blood)" }}>
                    {cc.profit >= 0 ? "+" : "-"}{fmt(Math.abs(cc.profit))} · {fmtPct(cc.margin)}
                  </div>
                </div>
                <button className="ac-iconbtn" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(fl.id); }}>
                  <Icon d={icons.trash} size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="ac-feas">
        <div>
          {/* auto-fill from a listing */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Auto-Fill From Listing</div>
            <p className="ac-note" style={{ marginTop: 0, marginBottom: 12 }}>
              Paste a property address (Street, City, State, Zip) or a Zillow / Redfin / Realtor link. Pulls square footage, beds &amp; baths, and recent sold comps.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input className="ac-input" style={{ flex: 1, minWidth: 220 }}
                placeholder="118 Maple St, Charlotte, NC, 28202  —  or a listing URL"
                value={lookupInput} onChange={(e) => setLookupInput(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? runLookup() : null)} />
              <button className="ac-btn primary" onClick={runLookup} disabled={lookupBusy}>
                {lookupBusy ? "Pulling…" : "Pull Data"}
              </button>
            </div>
            {lookupMsg && (
              <div className="ac-note" style={{ marginTop: 10, color: lookupMsg.kind === "ok" ? "var(--good)" : "var(--warn)" }}>
                {lookupMsg.text}
              </div>
            )}
          </div>

          {/* property */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">The Property</div>
            <input className="ac-input ac-display" style={{ fontSize: 20, padding: "10px 12px", marginBottom: 16 }}
              placeholder="Deal name (e.g., 118 Maple St flip)" value={f.name} onChange={(e) => set({ name: e.target.value })} />
            <div style={{ marginBottom: 14 }}>
              <label className="ac-label">Property address</label>
              <input className="ac-input" value={f.address} onChange={(e) => set({ address: e.target.value })} placeholder="Street, city" />
            </div>
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Heated square footage</label>
                <input className="ac-input ac-num" type="number" value={f.sqft} onChange={(e) => set({ sqft: e.target.value })} />
              </div>
              <div>
                <label className="ac-label">Lot size (sq ft)</label>
                <input className="ac-input ac-num" type="number" value={f.lotSize} onChange={(e) => set({ lotSize: e.target.value })} placeholder="0" />
                {num(f.lotSize) > 0 && (
                  <div className="ac-note ac-num" style={{ marginTop: 5 }}>≈ {(num(f.lotSize) / 43560).toFixed(2)} acres</div>
                )}
              </div>
              <div>
                <label className="ac-label">Beds</label>
                <input className="ac-input ac-num" type="number" value={f.beds} onChange={(e) => set({ beds: e.target.value })} />
              </div>
              <div>
                <label className="ac-label">Baths</label>
                <input className="ac-input ac-num" type="number" step="0.5" value={f.baths} onChange={(e) => set({ baths: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="ac-label">County (seeds ARV $/sq ft)</label>
                <select className="ac-select" value={f.county || "statewide"} onChange={(e) => pickCounty(e.target.value)}>
                  <option value="statewide">NC statewide (no county)</option>
                  {COUNTY_GROUPS.map((g) => (
                    <optgroup key={g} label={g}>
                      {COUNTIES.filter((co) => co.group === g).map((co) => (
                        <option key={co.key} value={co.key}>{co.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* acquisition */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Acquisition</div>
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Purchase price</label>
                <input className="ac-input ac-num" type="number" value={f.purchasePrice} onChange={(e) => set({ purchasePrice: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="ac-label">Buy-side closing (% of price)</label>
                <input className="ac-input ac-num" type="number" step="0.1" value={(f.buyClosingPct * 100).toFixed(1)} onChange={(e) => set({ buyClosingPct: num(e.target.value) / 100 })} />
              </div>
            </div>
            <p className="ac-note" style={{ marginTop: 12 }}>Closing covers title, attorney, transfer, and inspection at purchase — usually 1.5–3% in NC.</p>
          </div>

          {/* rehab */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div className="ac-eyebrow" style={{ marginBottom: 0 }}>Rehab Budget</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={"ac-btn sm" + (f.rehabMode === "itemized" ? " primary" : " ghost")} onClick={() => set({ rehabMode: "itemized" })}>Itemized</button>
                <button className={"ac-btn sm" + (f.rehabMode === "quick" ? " primary" : " ghost")} onClick={() => set({ rehabMode: "quick" })}>Quick $/sq ft</button>
              </div>
            </div>

            {f.rehabMode === "quick" ? (
              <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label className="ac-label">Rehab level</label>
                  <select className="ac-select" value={f.rehabTier} onChange={(e) => pickTier(e.target.value)}>
                    {REHAB_TIERS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ac-label">Rehab cost ($/sq ft)</label>
                  <input className="ac-input ac-num" type="number" value={f.rehabPsf} onChange={(e) => set({ rehabPsf: e.target.value })} />
                </div>
              </div>
            ) : (
              <>
                <div className="ac-tablewrap" style={{ border: "1px solid var(--line)", borderRadius: 9 }}>
                  <div className="ac-crow head" style={{ gridTemplateColumns: "minmax(160px,1.6fr) 120px 34px" }}>
                    <span>Scope area</span><span>Cost</span><span />
                  </div>
                  {f.rehabItems.length === 0 ? (
                    <div style={{ padding: 16, textAlign: "center" }} className="ac-sub">No rehab lines — add scope areas or switch to Quick.</div>
                  ) : (
                    f.rehabItems.map((it) => (
                      <div className="ac-crow" key={it.id} style={{ gridTemplateColumns: "minmax(160px,1.6fr) 120px 34px" }}>
                        <input className="ac-input ti" placeholder="Scope area" value={it.label} onChange={(e) => updateRehab(it.id, { label: e.target.value })} />
                        <input className="ac-input ti ac-num" type="number" placeholder="0" value={it.cost} onChange={(e) => updateRehab(it.id, { cost: e.target.value })} />
                        <button className="ac-iconbtn" title="Remove" onClick={() => removeRehab(it.id)}><Icon d={icons.trash} size={14} /></button>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                  <button className="ac-btn ghost sm" onClick={addRehab}><Icon d={icons.plus} size={13} /> Add scope area</button>
                  <span className="ac-num ac-sub" style={{ marginTop: 0 }}>Line total {fmt(c.rehabBase)}</span>
                </div>
              </>
            )}

            <div style={{ maxWidth: 240, marginTop: 16 }}>
              <label className="ac-label">Rehab contingency (%)</label>
              <input className="ac-input ac-num" type="number" value={Math.round(f.rehabContingencyPct * 100)} onChange={(e) => set({ rehabContingencyPct: num(e.target.value) / 100 })} />
            </div>
            <p className="ac-note" style={{ marginTop: 12 }}>
              Rehab {fmt(c.rehab)} all-in · {fmt(c.rehabPsfActual)}/sq ft. Flips almost always find surprises — a 10–15% contingency is prudent.
            </p>
          </div>

          {/* holding + financing */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Holding &amp; Financing</div>
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Hold (months)</label>
                <input className="ac-input ac-num" type="number" value={f.holdMonths} onChange={(e) => set({ holdMonths: e.target.value })} />
              </div>
              <div>
                <label className="ac-label">Taxes /mo</label>
                <input className="ac-input ac-num" type="number" value={f.monthlyTaxes} onChange={(e) => set({ monthlyTaxes: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="ac-label">Insurance /mo</label>
                <input className="ac-input ac-num" type="number" value={f.monthlyInsurance} onChange={(e) => set({ monthlyInsurance: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="ac-label">Utilities /mo</label>
                <input className="ac-input ac-num" type="number" value={f.monthlyUtilities} onChange={(e) => set({ monthlyUtilities: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="ac-label">Other /mo</label>
                <input className="ac-input ac-num" type="number" value={f.monthlyOther} onChange={(e) => set({ monthlyOther: e.target.value })} placeholder="0" />
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer", fontSize: 13, color: "var(--ash)" }}>
              <input type="checkbox" checked={f.useFinancing} onChange={(e) => set({ useFinancing: e.target.checked })} style={{ accentColor: "#FF5B23", width: 16, height: 16 }} />
              Finance the deal (hard money / rehab loan)
            </label>
            {f.useFinancing && (
              <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
                <div>
                  <label className="ac-label">Loan-to-cost (%)</label>
                  <input className="ac-input ac-num" type="number" value={Math.round(f.loanPct * 100)} onChange={(e) => set({ loanPct: num(e.target.value) / 100 })} />
                </div>
                <div>
                  <label className="ac-label">Rate APR (%)</label>
                  <input className="ac-input ac-num" type="number" step="0.1" value={(f.loanApr * 100).toFixed(1)} onChange={(e) => set({ loanApr: num(e.target.value) / 100 })} />
                </div>
                <div>
                  <label className="ac-label">Points</label>
                  <input className="ac-input ac-num" type="number" step="0.5" value={f.loanPoints} onChange={(e) => set({ loanPoints: e.target.value })} />
                </div>
              </div>
            )}
            <p className="ac-note" style={{ marginTop: 14 }}>
              Loan is {fmtPct(f.loanPct)} of purchase + rehab ({fmt(c.loanAmount)}). Interest is charged interest-only on the full balance across the hold — conservative for a napkin pass.
            </p>
          </div>

          {/* resale / ARV comps */}
          <div className="ac-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div className="ac-eyebrow" style={{ marginBottom: 0 }}>After-Repair Value</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={"ac-btn sm" + (f.arvMode === "comps" ? " primary" : " ghost")} onClick={() => set({ arvMode: "comps" })}>From comps</button>
                <button className={"ac-btn sm" + (f.arvMode === "manual" ? " primary" : " ghost")} onClick={() => set({ arvMode: "manual" })}>Manual $/sq ft</button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <span className="ac-chip">{c.loc.label} · {fmt(c.loc.medianPrice)} median · {c.loc.medianDom} days · ~{fmt(c.loc.resalePsf)}/sq ft</span>
              <button className="ac-btn ghost sm" onClick={() => set({ arvMode: "manual", arvPsf: c.loc.resalePsf })}>Use as starting point</button>
            </div>

            {f.arvMode === "manual" ? (
              <div style={{ maxWidth: 220 }}>
                <label className="ac-label">After-repair value ($/sq ft)</label>
                <input className="ac-input ac-num" type="number" value={f.arvPsf} onChange={(e) => set({ arvPsf: e.target.value })} />
              </div>
            ) : (
              <>
                <div className="ac-note" style={{ marginBottom: 12 }}>
                  Enter recently sold, renovated homes near this property (from your agent, MLS, or county records). The model averages their $/sq ft and median days on market to set ARV.
                </div>
                <div className="ac-tablewrap" style={{ border: "1px solid var(--line)", borderRadius: 9 }}>
                  <div className="ac-crow head">
                    <span>Sold comp (address)</span><span>Sale price</span><span>Sq ft</span><span>$/sq ft</span><span>DOM</span><span />
                  </div>
                  {f.comps.length === 0 ? (
                    <div style={{ padding: 16, textAlign: "center" }} className="ac-sub">No comps yet — add a few recent renovated sales nearby.</div>
                  ) : (
                    f.comps.map((cp) => {
                      const psf = num(cp.price) > 0 && num(cp.sqft) > 0 ? num(cp.price) / num(cp.sqft) : 0;
                      return (
                        <div className="ac-crow" key={cp.id}>
                          <input className="ac-input ti" placeholder="123 Maple St" value={cp.label} onChange={(e) => updateComp(cp.id, { label: e.target.value })} />
                          <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.price} onChange={(e) => updateComp(cp.id, { price: e.target.value })} />
                          <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.sqft} onChange={(e) => updateComp(cp.id, { sqft: e.target.value })} />
                          <span className="ac-num ac-sub" style={{ marginTop: 0 }}>{psf ? fmt(psf) : "—"}</span>
                          <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.dom} onChange={(e) => updateComp(cp.id, { dom: e.target.value })} />
                          <button className="ac-iconbtn" title="Remove" onClick={() => removeComp(cp.id)}><Icon d={icons.trash} size={14} /></button>
                        </div>
                      );
                    })
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                  <button className="ac-btn ghost sm" onClick={addComp}><Icon d={icons.plus} size={13} /> Add comp</button>
                  {c.comps.count > 0 && (
                    <span className="ac-num ac-sub" style={{ marginTop: 0 }}>
                      {c.comps.count} comps · avg {fmt(c.comps.psf)}/sq ft · median {c.comps.medianDom || "—"} days
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 18 }}>
              <div>
                <label className="ac-label">Agent commission (%)</label>
                <input className="ac-input ac-num" type="number" step="0.1" value={(f.sellCommissionPct * 100).toFixed(1)} onChange={(e) => set({ sellCommissionPct: num(e.target.value) / 100 })} />
              </div>
              <div>
                <label className="ac-label">Sell closing (%)</label>
                <input className="ac-input ac-num" type="number" step="0.1" value={(f.sellClosingPct * 100).toFixed(1)} onChange={(e) => set({ sellClosingPct: num(e.target.value) / 100 })} />
              </div>
              <div>
                <label className="ac-label">Staging / misc</label>
                <input className="ac-input ac-num" type="number" value={f.stagingCost} onChange={(e) => set({ stagingCost: e.target.value })} placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        {/* readout */}
        <div className="ac-totals">
          <div className="ac-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div className="ac-eyebrow" style={{ marginBottom: 0 }}>The Deal</div>
              <span className="ac-gradepill" style={{ color: grade.color }}>
                <span className="ac-dot" style={{ background: grade.color }} /> {grade.label}
              </span>
            </div>

            <div className="ac-metricrow">
              <div className="ac-metric">
                <div className="mlbl">ARV</div>
                <div className="mval ac-num ac-display">{fmt(c.arv)}</div>
              </div>
              <div className="ac-metric">
                <div className="mlbl">All-in cost</div>
                <div className="mval ac-num ac-display">{fmt(c.totalCost)}</div>
              </div>
            </div>

            <div className="ac-grand" style={{ marginTop: 8 }}>
              <span className="lbl">Projected profit</span>
              <span className="amt ac-num ac-display" style={{ background: "none", color: profitColor, WebkitTextFillColor: profitColor }}>
                {c.profit >= 0 ? "" : "-"}{fmt(Math.abs(c.profit))}
              </span>
            </div>

            <div className="ac-metricrow" style={{ marginTop: 14 }}>
              <div className="ac-metric">
                <div className="mlbl">Margin on sale</div>
                <div className="mval ac-num" style={{ color: profitColor }}>{fmtPct(c.margin)}</div>
              </div>
              <div className="ac-metric">
                <div className="mlbl">{f.useFinancing ? "Cash-on-cash" : "Return on cost"}</div>
                <div className="mval ac-num" style={{ color: profitColor }}>{fmtPct(f.useFinancing ? c.cashOnCash : c.returnOnCost)}</div>
              </div>
            </div>
            {f.useFinancing && (
              <div className="ac-readout" style={{ paddingTop: 10 }}>
                <span>Annualized cash-on-cash</span>
                <span className="v ac-num" style={{ color: profitColor }}>{fmtPct(c.annualizedCoC)}</span>
              </div>
            )}

            <hr className="ac-divline" style={{ margin: "16px 0" }} />

            <div className="ac-eyebrow" style={{ marginBottom: 10 }}>Where It Goes</div>
            <div className="ac-readout"><span>Purchase</span><span className="v ac-num">{fmt(c.purchase)}</span></div>
            <div className="ac-readout"><span>Buy closing</span><span className="v ac-num">{fmt(c.buyClosing)}</span></div>
            <div className="ac-readout"><span>Rehab (incl. contingency)</span><span className="v ac-num">{fmt(c.rehab)}</span></div>
            {f.useFinancing && <div className="ac-readout"><span>Financing (pts + interest)</span><span className="v ac-num">{fmt(c.financing)}</span></div>}
            <div className="ac-readout"><span>Holding ({num(f.holdMonths)} mo)</span><span className="v ac-num">{fmt(c.holding)}</span></div>
            <div className="ac-readout"><span>Selling costs</span><span className="v ac-num">{fmt(c.selling)}</span></div>
            {f.useFinancing && <div className="ac-readout" style={{ paddingTop: 8 }}><span>Est. cash in deal</span><span className="v ac-num">{fmt(c.cashInvested)}</span></div>}

            <div className="ac-mao">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ash)" }}>
                  <input className="ac-input ac-num right" type="number" style={{ width: 52, padding: "3px 6px", fontSize: 12 }}
                    value={Math.round(f.ruleThreshold * 100)} onChange={(e) => set({ ruleThreshold: num(e.target.value) / 100 })} />
                  <span style={{ color: "var(--ash2)" }}>% rule — max offer</span>
                </span>
                <span className="ac-num ac-display" style={{ fontSize: 18 }}>{fmt(c.mao)}</span>
              </div>
              <div className="ac-readout" style={{ paddingTop: 8 }}>
                <span>{c.maoDelta >= 0 ? "Room under the rule" : "Over the rule by"}</span>
                <span className="v ac-num" style={{ color: c.maoDelta >= 0 ? "var(--good)" : "var(--blood)" }}>
                  {c.maoDelta >= 0 ? "" : "-"}{fmt(Math.abs(c.maoDelta))}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 18 }}>
              <button className="ac-btn primary" onClick={() => onSave(f)}>Save Deal</button>
              <button className="ac-btn" onClick={() => onConvert(f)}><Icon d={icons.doc} size={14} /> Build Rehab Estimate</button>
            </div>
            <p className="ac-note" style={{ marginTop: 14 }}>
              A screening tool, not an appraisal. ARV and $/sq ft are seeded from mid-2026 NC data and your comps — verify with local sold comps and your subs. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Lot Analyzer ---------- */
function Lots({ lots, initial, onOpen, onNew, onSave, onDelete, onConvert }) {
  const [f, setF] = useState(initial || newLot());
  useEffect(() => {
    if (initial) setF(initial);
  }, [initial && initial.id]);

  const set = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const c = useMemo(() => computeLot(f), [f]);
  const grade = lotGrade(f, c);
  const build = f.exitMode === "build";

  const [lookupInput, setLookupInput] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupMsg, setLookupMsg] = useState(null); // { kind: 'ok' | 'err', text }

  const matchCounty = (raw) => {
    if (!raw) return null;
    const base = String(raw).toLowerCase().replace(/\s+county$/, "").trim();
    const hit = COUNTIES.find((co) => co.key === base || co.key === base.replace(/\s+/g, ""));
    return hit ? hit.key : null;
  };

  const runLookup = async () => {
    const q = lookupInput.trim();
    if (!q) {
      setLookupMsg({ kind: "err", text: "Enter a parcel address or listing URL." });
      return;
    }
    setLookupBusy(true);
    setLookupMsg(null);
    try {
      const res = await fetch(`/api/lookup?type=lot&q=${encodeURIComponent(q)}`, { headers: { Accept: "application/json" } });
      let data = null;
      try { data = await res.json(); } catch (_) {}
      if (res.status === 404 && (!data || !data.error)) {
        setLookupMsg({ kind: "err", text: "Lookup needs the backend deployed. Add your RentCast key and deploy via Git or the Netlify CLI (see README). You can still enter everything manually below." });
        return;
      }
      if (!res.ok || !data || data.error) {
        setLookupMsg({ kind: "err", text: (data && data.error) || "Lookup failed — enter the parcel details manually below." });
        return;
      }
      const patch = {};
      if (data.lotSize) patch.lotSize = data.lotSize;
      if (data.zoning) patch.zoning = data.zoning;
      if (data.resolvedAddress) patch.address = data.resolvedAddress;
      const co = matchCounty(data.county);
      if (co) patch.county = co;
      set(patch);
      const bits = [];
      if (data.lotSize) bits.push(`${(num(data.lotSize) / 43560).toFixed(2)} acres`);
      if (data.zoning) bits.push(`zoning ${data.zoning}`);
      if (data.county) bits.push(data.county);
      setLookupMsg({ kind: "ok", text: `Pulled ${bits.join(" · ") || "the parcel record"} for ${data.resolvedAddress || q}. Lot comps still come from your own sold-land data below.` });
    } catch (_) {
      setLookupMsg({ kind: "err", text: "Couldn't reach the lookup service. Check your connection, or enter details manually below." });
    } finally {
      setLookupBusy(false);
    }
  };

  const pickCounty = (key) => set({ county: key });
  const updateDev = (id, patch) => set({ devItems: f.devItems.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const addDev = () => set({ devItems: [...f.devItems, { id: uid(), label: "", cost: "" }] });
  const removeDev = (id) => set({ devItems: f.devItems.filter((x) => x.id !== id) });
  const addComp = () => set({ comps: [...f.comps, { id: uid(), label: "", price: "", acres: "", dom: "" }] });
  const updateComp = (id, patch) => set({ comps: f.comps.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const removeComp = (id) => set({ comps: f.comps.filter((x) => x.id !== id) });

  const profitColor = c.profit >= 0 ? "var(--good)" : "var(--blood)";
  const ratioColor = c.lotRatio <= num(f.targetRatio) ? "var(--good)" : c.lotRatio <= num(f.targetRatio) + 0.05 ? "var(--warn)" : "var(--blood)";

  return (
    <div className="ac-pad">
      <div className="ac-eyebrow">Lot Analyzer</div>
      <h1 className="ac-h1 ac-display">Land Deal Analyzer</h1>
      <Fracture />

      {lots.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
          {lots.map((lt) => {
            const cc = computeLot(lt);
            const b = lt.exitMode === "build";
            return (
              <div key={lt.id} className="ac-card" style={{ padding: "12px 14px", minWidth: 200, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                onClick={() => onOpen(lt)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" ? onOpen(lt) : null)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ac-display" style={{ fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {lt.name || "Untitled"}
                  </div>
                  <div className="ac-num ac-sub" style={{ marginTop: 2, color: b ? (cc.lotRatio <= num(lt.targetRatio) ? "var(--good)" : "var(--warn)") : (cc.profit >= 0 ? "var(--good)" : "var(--blood)") }}>
                    {b ? `${fmtPct(cc.lotRatio)} of ARV` : `${cc.profit >= 0 ? "+" : "-"}${fmt(Math.abs(cc.profit))} · ${fmtPct(cc.margin)}`}
                  </div>
                </div>
                <button className="ac-iconbtn" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(lt.id); }}>
                  <Icon d={icons.trash} size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="ac-feas">
        <div>
          {/* auto-fill from a listing */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Auto-Fill From Listing</div>
            <p className="ac-note" style={{ marginTop: 0, marginBottom: 12 }}>
              Paste a parcel address (Street, City, State, Zip) or a listing link. Pulls lot size, zoning, and county where a public record exists — land records are spottier than homes, so comps stay manual.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input className="ac-input" style={{ flex: 1, minWidth: 220 }}
                placeholder="Oak Ridge Rd, Charlotte, NC, 28213  —  or a listing URL"
                value={lookupInput} onChange={(e) => setLookupInput(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? runLookup() : null)} />
              <button className="ac-btn primary" onClick={runLookup} disabled={lookupBusy}>
                {lookupBusy ? "Pulling…" : "Pull Data"}
              </button>
            </div>
            {lookupMsg && (
              <div className="ac-note" style={{ marginTop: 10, color: lookupMsg.kind === "ok" ? "var(--good)" : "var(--warn)" }}>
                {lookupMsg.text}
              </div>
            )}
          </div>

          {/* the lot */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">The Lot</div>
            <input className="ac-input ac-display" style={{ fontSize: 20, padding: "10px 12px", marginBottom: 16 }}
              placeholder="Deal name (e.g., Oak Ridge Rd — 1.2 ac)" value={f.name} onChange={(e) => set({ name: e.target.value })} />
            <div style={{ marginBottom: 14 }}>
              <label className="ac-label">Parcel address / location</label>
              <input className="ac-input" value={f.address} onChange={(e) => set({ address: e.target.value })} placeholder="Street or parcel ID, city" />
            </div>
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Lot size (sq ft)</label>
                <input className="ac-input ac-num" type="number" value={f.lotSize} onChange={(e) => set({ lotSize: e.target.value })} placeholder="0" />
                {num(f.lotSize) > 0 && <div className="ac-note ac-num" style={{ marginTop: 5 }}>≈ {c.acres.toFixed(2)} acres</div>}
              </div>
              <div>
                <label className="ac-label">Zoning (optional)</label>
                <input className="ac-input" value={f.zoning} onChange={(e) => set({ zoning: e.target.value })} placeholder="e.g., R-40, RA" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="ac-label">County</label>
                <select className="ac-select" value={f.county || "statewide"} onChange={(e) => pickCounty(e.target.value)}>
                  <option value="statewide">NC statewide (no county)</option>
                  {COUNTY_GROUPS.map((g) => (
                    <optgroup key={g} label={g}>
                      {COUNTIES.filter((co) => co.group === g).map((co) => (
                        <option key={co.key} value={co.key}>{co.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* acquisition */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Acquisition</div>
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Purchase price</label>
                <input className="ac-input ac-num" type="number" value={f.purchasePrice} onChange={(e) => set({ purchasePrice: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="ac-label">Buy-side closing (% of price)</label>
                <input className="ac-input ac-num" type="number" step="0.1" value={(f.buyClosingPct * 100).toFixed(1)} onChange={(e) => set({ buyClosingPct: num(e.target.value) / 100 })} />
              </div>
            </div>
          </div>

          {/* site development */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Site Development</div>
            <div className="ac-tablewrap" style={{ border: "1px solid var(--line)", borderRadius: 9 }}>
              <div className="ac-crow head" style={{ gridTemplateColumns: "minmax(160px,1.6fr) 120px 34px" }}>
                <span>Work item</span><span>Cost</span><span />
              </div>
              {f.devItems.length === 0 ? (
                <div style={{ padding: 16, textAlign: "center" }} className="ac-sub">No development lines — add site-work items.</div>
              ) : (
                f.devItems.map((it) => (
                  <div className="ac-crow" key={it.id} style={{ gridTemplateColumns: "minmax(160px,1.6fr) 120px 34px" }}>
                    <input className="ac-input ti" placeholder="Work item" value={it.label} onChange={(e) => updateDev(it.id, { label: e.target.value })} />
                    <input className="ac-input ti ac-num" type="number" placeholder="0" value={it.cost} onChange={(e) => updateDev(it.id, { cost: e.target.value })} />
                    <button className="ac-iconbtn" title="Remove" onClick={() => removeDev(it.id)}><Icon d={icons.trash} size={14} /></button>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
              <button className="ac-btn ghost sm" onClick={addDev}><Icon d={icons.plus} size={13} /> Add work item</button>
              <span className="ac-num ac-sub" style={{ marginTop: 0 }}>Line total {fmt(c.devBase)}</span>
            </div>
            <div style={{ maxWidth: 240, marginTop: 16 }}>
              <label className="ac-label">Development contingency (%)</label>
              <input className="ac-input ac-num" type="number" value={Math.round(f.devContingencyPct * 100)} onChange={(e) => set({ devContingencyPct: num(e.target.value) / 100 })} />
            </div>
            <p className="ac-note" style={{ marginTop: 12 }}>
              Site development {fmt(c.development)} all-in{c.acres > 0 ? ` · ${fmt(c.devPerAcre)}/acre` : ""}. Perc/soil results and utility runs are where land surprises live — keep a real contingency.
            </p>
          </div>

          {/* holding + financing */}
          <div className="ac-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="ac-eyebrow">Holding &amp; Financing</div>
            <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div>
                <label className="ac-label">Hold (months)</label>
                <input className="ac-input ac-num" type="number" value={f.holdMonths} onChange={(e) => set({ holdMonths: e.target.value })} />
              </div>
              <div>
                <label className="ac-label">Taxes /mo</label>
                <input className="ac-input ac-num" type="number" value={f.monthlyTaxes} onChange={(e) => set({ monthlyTaxes: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="ac-label">Insurance /mo</label>
                <input className="ac-input ac-num" type="number" value={f.monthlyInsurance} onChange={(e) => set({ monthlyInsurance: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="ac-label">Other /mo</label>
                <input className="ac-input ac-num" type="number" value={f.monthlyOther} onChange={(e) => set({ monthlyOther: e.target.value })} placeholder="0" />
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer", fontSize: 13, color: "var(--ash)" }}>
              <input type="checkbox" checked={f.useFinancing} onChange={(e) => set({ useFinancing: e.target.checked })} style={{ accentColor: "#FF5B23", width: 16, height: 16 }} />
              Finance the deal (land / lot loan)
            </label>
            {f.useFinancing && (
              <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
                <div>
                  <label className="ac-label">Loan-to-cost (%)</label>
                  <input className="ac-input ac-num" type="number" value={Math.round(f.loanPct * 100)} onChange={(e) => set({ loanPct: num(e.target.value) / 100 })} />
                </div>
                <div>
                  <label className="ac-label">Rate APR (%)</label>
                  <input className="ac-input ac-num" type="number" step="0.1" value={(f.loanApr * 100).toFixed(1)} onChange={(e) => set({ loanApr: num(e.target.value) / 100 })} />
                </div>
                <div>
                  <label className="ac-label">Points</label>
                  <input className="ac-input ac-num" type="number" step="0.5" value={f.loanPoints} onChange={(e) => set({ loanPoints: e.target.value })} />
                </div>
              </div>
            )}
            <p className="ac-note" style={{ marginTop: 14 }}>
              Land loans usually run lower loan-to-cost and higher rates than a house — defaults reflect that. Loan is {fmtPct(f.loanPct)} of purchase + development ({fmt(c.loanAmount)}).
            </p>
          </div>

          {/* exit */}
          <div className="ac-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div className="ac-eyebrow" style={{ marginBottom: 0 }}>The Exit</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={"ac-btn sm" + (!build ? " primary" : " ghost")} onClick={() => set({ exitMode: "resell" })}>Resell lot</button>
                <button className={"ac-btn sm" + (build ? " primary" : " ghost")} onClick={() => set({ exitMode: "build" })}>Build spec</button>
              </div>
            </div>

            {build ? (
              <>
                <div className="ac-note" style={{ marginBottom: 14 }}>
                  Check whether the finished lot cost supports building. A common builder rule of thumb is a finished lot at or below ~20–25% of the completed home's value.
                </div>
                <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label className="ac-label">Expected home value (ARV)</label>
                    <input className="ac-input ac-num" type="number" value={f.arv} onChange={(e) => set({ arv: e.target.value })} placeholder="0" />
                  </div>
                  <div>
                    <label className="ac-label">Target lot-to-value (%)</label>
                    <input className="ac-input ac-num" type="number" value={Math.round(f.targetRatio * 100)} onChange={(e) => set({ targetRatio: num(e.target.value) / 100 })} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  <button className={"ac-btn sm" + (f.resaleMode === "comps" ? " primary" : " ghost")} onClick={() => set({ resaleMode: "comps" })}>From lot comps</button>
                  <button className={"ac-btn sm" + (f.resaleMode === "manual" ? " primary" : " ghost")} onClick={() => set({ resaleMode: "manual" })}>Manual $/acre</button>
                </div>

                {f.resaleMode === "manual" ? (
                  <div style={{ maxWidth: 220 }}>
                    <label className="ac-label">Resale value ($/acre)</label>
                    <input className="ac-input ac-num" type="number" value={f.resalePerAcre} onChange={(e) => set({ resalePerAcre: e.target.value })} />
                  </div>
                ) : (
                  <>
                    <div className="ac-note" style={{ marginBottom: 12 }}>
                      Enter recently sold comparable lots nearby. The model averages their price per acre and applies it to this parcel's acreage.
                    </div>
                    <div className="ac-tablewrap" style={{ border: "1px solid var(--line)", borderRadius: 9 }}>
                      <div className="ac-crow head" style={{ gridTemplateColumns: "minmax(120px,1.4fr) 110px 70px 82px 60px 34px" }}>
                        <span>Sold lot (address)</span><span>Sale price</span><span>Acres</span><span>$/acre</span><span>DOM</span><span />
                      </div>
                      {f.comps.length === 0 ? (
                        <div style={{ padding: 16, textAlign: "center" }} className="ac-sub">No lot comps yet — add a few recent nearby land sales.</div>
                      ) : (
                        f.comps.map((cp) => {
                          const pa = num(cp.price) > 0 && num(cp.acres) > 0 ? num(cp.price) / num(cp.acres) : 0;
                          return (
                            <div className="ac-crow" key={cp.id} style={{ gridTemplateColumns: "minmax(120px,1.4fr) 110px 70px 82px 60px 34px" }}>
                              <input className="ac-input ti" placeholder="Parcel / address" value={cp.label} onChange={(e) => updateComp(cp.id, { label: e.target.value })} />
                              <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.price} onChange={(e) => updateComp(cp.id, { price: e.target.value })} />
                              <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.acres} onChange={(e) => updateComp(cp.id, { acres: e.target.value })} />
                              <span className="ac-num ac-sub" style={{ marginTop: 0 }}>{pa ? fmt(pa) : "—"}</span>
                              <input className="ac-input ti ac-num" type="number" placeholder="0" value={cp.dom} onChange={(e) => updateComp(cp.id, { dom: e.target.value })} />
                              <button className="ac-iconbtn" title="Remove" onClick={() => removeComp(cp.id)}><Icon d={icons.trash} size={14} /></button>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                      <button className="ac-btn ghost sm" onClick={addComp}><Icon d={icons.plus} size={13} /> Add lot comp</button>
                      {c.comps.count > 0 && (
                        <span className="ac-num ac-sub" style={{ marginTop: 0 }}>
                          {c.comps.count} comps · avg {fmt(c.comps.perAcre)}/acre · median {c.comps.medianDom || "—"} days
                        </span>
                      )}
                    </div>
                  </>
                )}

                <div className="ac-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
                  <div>
                    <label className="ac-label">Selling commission (%)</label>
                    <input className="ac-input ac-num" type="number" step="0.1" value={(f.sellCommissionPct * 100).toFixed(1)} onChange={(e) => set({ sellCommissionPct: num(e.target.value) / 100 })} />
                  </div>
                  <div>
                    <label className="ac-label">Sell closing (%)</label>
                    <input className="ac-input ac-num" type="number" step="0.1" value={(f.sellClosingPct * 100).toFixed(1)} onChange={(e) => set({ sellClosingPct: num(e.target.value) / 100 })} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* readout */}
        <div className="ac-totals">
          <div className="ac-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div className="ac-eyebrow" style={{ marginBottom: 0 }}>{build ? "Build Viability" : "The Deal"}</div>
              <span className="ac-gradepill" style={{ color: grade.color }}>
                <span className="ac-dot" style={{ background: grade.color }} /> {grade.label}
              </span>
            </div>

            {build ? (
              <>
                <div className="ac-metricrow">
                  <div className="ac-metric">
                    <div className="mlbl">Finished lot cost</div>
                    <div className="mval ac-num ac-display">{fmt(c.finishedLotCost)}</div>
                  </div>
                  <div className="ac-metric">
                    <div className="mlbl">Home value (ARV)</div>
                    <div className="mval ac-num ac-display">{fmt(c.arv)}</div>
                  </div>
                </div>
                <div className="ac-grand" style={{ marginTop: 8 }}>
                  <span className="lbl">Lot-to-value</span>
                  <span className="amt ac-num ac-display" style={{ background: "none", color: ratioColor, WebkitTextFillColor: ratioColor }}>{fmtPct(c.lotRatio)}</span>
                </div>
                <div className="ac-readout" style={{ paddingTop: 10 }}>
                  <span>Target</span><span className="v ac-num">{fmtPct(num(f.targetRatio))}</span>
                </div>
                <div className="ac-mao">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--ash2)" }}>Max lot price to hit target</span>
                    <span className="ac-num ac-display" style={{ fontSize: 18 }}>{fmt(Math.max(c.maxPurchaseForTarget, 0))}</span>
                  </div>
                  <div className="ac-readout" style={{ paddingTop: 8 }}>
                    <span>{c.maxPurchaseForTarget - c.purchase >= 0 ? "Room under target" : "Over target by"}</span>
                    <span className="v ac-num" style={{ color: c.maxPurchaseForTarget - c.purchase >= 0 ? "var(--good)" : "var(--blood)" }}>
                      {c.maxPurchaseForTarget - c.purchase >= 0 ? "" : "-"}{fmt(Math.abs(c.maxPurchaseForTarget - c.purchase))}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="ac-metricrow">
                  <div className="ac-metric">
                    <div className="mlbl">Resale value</div>
                    <div className="mval ac-num ac-display">{fmt(c.resale)}</div>
                  </div>
                  <div className="ac-metric">
                    <div className="mlbl">All-in cost</div>
                    <div className="mval ac-num ac-display">{fmt(c.totalCost)}</div>
                  </div>
                </div>
                <div className="ac-grand" style={{ marginTop: 8 }}>
                  <span className="lbl">Projected profit</span>
                  <span className="amt ac-num ac-display" style={{ background: "none", color: profitColor, WebkitTextFillColor: profitColor }}>
                    {c.profit >= 0 ? "" : "-"}{fmt(Math.abs(c.profit))}
                  </span>
                </div>
                <div className="ac-metricrow" style={{ marginTop: 14 }}>
                  <div className="ac-metric">
                    <div className="mlbl">Margin on sale</div>
                    <div className="mval ac-num" style={{ color: profitColor }}>{fmtPct(c.margin)}</div>
                  </div>
                  <div className="ac-metric">
                    <div className="mlbl">{f.useFinancing ? "Cash-on-cash" : "Return on cost"}</div>
                    <div className="mval ac-num" style={{ color: profitColor }}>{fmtPct(f.useFinancing ? c.cashOnCash : c.returnOnCost)}</div>
                  </div>
                </div>
                {f.useFinancing && (
                  <div className="ac-readout" style={{ paddingTop: 10 }}>
                    <span>Annualized cash-on-cash</span>
                    <span className="v ac-num" style={{ color: profitColor }}>{fmtPct(c.annualizedCoC)}</span>
                  </div>
                )}
                <div className="ac-mao">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--ash2)" }}>Max lot price (break-even)</span>
                    <span className="ac-num ac-display" style={{ fontSize: 18 }}>{fmt(Math.max(c.breakevenPurchase, 0))}</span>
                  </div>
                  <div className="ac-readout" style={{ paddingTop: 8 }}>
                    <span>{c.breakevenPurchase - c.purchase >= 0 ? "Cushion vs. your offer" : "Above break-even by"}</span>
                    <span className="v ac-num" style={{ color: c.breakevenPurchase - c.purchase >= 0 ? "var(--good)" : "var(--blood)" }}>
                      {c.breakevenPurchase - c.purchase >= 0 ? "" : "-"}{fmt(Math.abs(c.breakevenPurchase - c.purchase))}
                    </span>
                  </div>
                </div>
              </>
            )}

            <hr className="ac-divline" style={{ margin: "16px 0" }} />

            <div className="ac-eyebrow" style={{ marginBottom: 10 }}>Where It Goes</div>
            <div className="ac-readout"><span>Purchase</span><span className="v ac-num">{fmt(c.purchase)}</span></div>
            <div className="ac-readout"><span>Buy closing</span><span className="v ac-num">{fmt(c.buyClosing)}</span></div>
            <div className="ac-readout"><span>Site development</span><span className="v ac-num">{fmt(c.development)}</span></div>
            {f.useFinancing && <div className="ac-readout"><span>Financing (pts + interest)</span><span className="v ac-num">{fmt(c.financing)}</span></div>}
            <div className="ac-readout"><span>Holding ({num(f.holdMonths)} mo)</span><span className="v ac-num">{fmt(c.holding)}</span></div>
            {!build && <div className="ac-readout"><span>Selling costs</span><span className="v ac-num">{fmt(c.selling)}</span></div>}
            {!build && f.useFinancing && <div className="ac-readout" style={{ paddingTop: 8 }}><span>Est. cash in deal</span><span className="v ac-num">{fmt(c.cashInvested)}</span></div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 18 }}>
              <button className="ac-btn primary" onClick={() => onSave(f)}>Save Deal</button>
              <button className="ac-btn" onClick={() => onConvert(f)}><Icon d={icons.doc} size={14} /> Build Site-Work Estimate</button>
            </div>
            <p className="ac-note" style={{ marginTop: 14 }}>
              A screening tool, not a survey or appraisal. Confirm buildability (soil/perc, utilities, setbacks, zoning) and land values with local sources before you commit. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Auth gate ----------
   NOTE: This is a client-side passcode gate — a deterrent that keeps casual
   visitors out and gives you a branded front door. It is NOT real security:
   the data lives in the browser and a determined person could bypass a
   JavaScript check. For true server-enforced protection use the included
   Netlify Edge Function (free, Git deploys) or Netlify's dashboard Password
   Protection (Pro plan). See README. */
const PASSCODE = (
  (typeof window !== "undefined" && typeof window.__AC_PASSCODE__ === "string"
    ? window.__AC_PASSCODE__
    : import.meta.env.VITE_APP_PASSCODE ?? "altardchaos")
).trim();
const PASSCODE_REQUIRED = PASSCODE.length > 0;
const UNLOCK_KEY = "altardchaos::unlocked";

function readUnlocked() {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch (_) {
    return false;
  }
}
function writeUnlocked(v) {
  try {
    if (v) localStorage.setItem(UNLOCK_KEY, "1");
    else localStorage.removeItem(UNLOCK_KEY);
  } catch (_) {}
}

function Landing({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (!PASSCODE_REQUIRED || code === PASSCODE) {
      writeUnlocked(true);
      onUnlock();
    } else {
      setError(true);
      setCode("");
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="ac-root">
      <style>{CSS}</style>
      <div className="ac-landing">
        <div className="ac-landinginner">
          <div className="ac-landingmark">
            <img src={logoUrl} alt="Altar'd Chaos" style={{ width: "100%", maxWidth: 400, height: "auto", display: "block", margin: "0 auto" }} />
          </div>
          <div className="ac-landingtag">Order, forged from chaos</div>

          <div className="ac-landingfeat">
            <span>Project Estimates</span>
            <span>New-Build Feasibility</span>
            <span>Client Quotes</span>
          </div>

          <div className={"ac-gatecard" + (error ? " ac-shake" : "")}>
            {PASSCODE_REQUIRED ? (
              <>
                <label className="ac-label">Access code</label>
                <input
                  className="ac-input ac-num"
                  type="password"
                  autoFocus
                  value={code}
                  placeholder="Enter your code"
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => (e.key === "Enter" ? submit() : null)}
                  style={error ? { borderColor: "var(--blood)" } : undefined}
                />
                {error && <div className="ac-note" style={{ color: "var(--blood)", marginTop: 8 }}>Incorrect code — try again.</div>}
                <button className="ac-btn primary" style={{ width: "100%", marginTop: 14, justifyContent: "center" }} onClick={submit}>
                  Enter the Workshop
                </button>
              </>
            ) : (
              <button className="ac-btn primary" style={{ width: "100%", justifyContent: "center" }} onClick={submit}>
                Enter the Workshop
              </button>
            )}
          </div>

          <div className="ac-landingfoot">
            Altar'd Chaos · NC General Contractor<br />
            Estimating &amp; feasibility workspace
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
export default function App() {
  const [unlocked, setUnlocked] = useState(() => !PASSCODE_REQUIRED || readUnlocked());

  if (!unlocked) {
    return <Landing onUnlock={() => setUnlocked(true)} />;
  }
  return (
    <Estimator
      onSignOut={() => {
        writeUnlocked(false);
        setUnlocked(false);
      }}
    />
  );
}
