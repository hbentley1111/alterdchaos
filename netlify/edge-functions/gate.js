/* netlify/edge-functions/gate.js
   REAL, server-enforced password protection — free, but runs only on
   Git/CLI deploys (not drag-and-drop). It gates every page behind a single
   shared password read from the SITE_PASSCODE environment variable.

   Setup:
     1. Deploy this site to Netlify from a Git repo (or `netlify deploy`).
     2. In Netlify: Site configuration > Environment variables > add
        SITE_PASSCODE = your-password
     3. Redeploy. Visitors now get a password screen before the app loads.
     Visit /logout to clear the session.

   This is a SHARED password (everyone uses the same one), not per-user
   accounts. If SITE_PASSCODE is unset the gate passes traffic through (off),
   so leaving this file in the repo is harmless until you opt in. */

const COOKIE = "ac_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getEnv(key) {
  try { if (typeof Netlify !== "undefined") return Netlify.env.get(key); } catch (_) {}
  try { if (typeof Deno !== "undefined") return Deno.env.get(key); } catch (_) {}
  return undefined;
}

async function sha256hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function page(body, status) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Altar'd Chaos</title>
<style>
  :root{--pitch:#0B0B0D;--panel:#141418;--line:#2A2A33;--bone:#ECECF0;--ash:#8C8C98;--ember:#FF5B23;--blood:#C81E1E;}
  *{box-sizing:border-box;}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--bone);
    background:radial-gradient(70% 80% at 50% -10%,rgba(255,91,35,.16),transparent 60%),var(--pitch);}
  .card{width:100%;max-width:380px;text-align:center;}
  .word{font-weight:900;letter-spacing:.04em;font-size:32px;line-height:1;}
  .word .b{background:linear-gradient(92deg,var(--ember),var(--blood));-webkit-background-clip:text;background-clip:text;color:transparent;}
  .tag{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--ash);margin:16px 0 26px;}
  form{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px;text-align:left;}
  label{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ash);display:block;margin-bottom:8px;}
  input{width:100%;font-size:15px;color:var(--bone);background:var(--pitch);border:1px solid var(--line);
    border-radius:8px;padding:11px 12px;}
  input:focus{outline:none;border-color:var(--ember);}
  button{width:100%;margin-top:14px;border:0;border-radius:8px;padding:12px;font-size:13px;letter-spacing:.08em;
    text-transform:uppercase;color:#fff;cursor:pointer;background:linear-gradient(96deg,var(--ember),var(--blood));}
  .err{color:var(--blood);font-size:12px;margin-top:10px;}
</style></head><body><div class="card">
  <div class="word">ALTAR'D <span class="b">CHAOS</span></div>
  <div class="tag">Order, forged from chaos</div>
  ${body}
</div></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

export default async (request, context) => {
  const url = new URL(request.url);

  if (url.pathname === "/logout") {
    context.cookies.delete(COOKIE);
    return new Response(null, { status: 302, headers: { Location: "/" } });
  }

  const pass = getEnv("SITE_PASSCODE");
  // Not configured → let the request through (do nothing). This makes the file
  // safe to leave in the repo: the gate only engages once you BOTH enable the
  // [[edge_functions]] block in netlify.toml AND set SITE_PASSCODE in Netlify.
  if (!pass) return context.next();

  const expected = await sha256hex(pass);
  if (context.cookies.get(COOKIE) === expected) {
    return context.next();
  }

  let showError = false;
  if (request.method === "POST") {
    const form = await request.formData();
    if (String(form.get("code") || "") === pass) {
      context.cookies.set({
        name: COOKIE, value: expected, path: "/",
        httpOnly: true, secure: true, sameSite: "Strict", maxAge: MAX_AGE,
      });
      return new Response(null, { status: 303, headers: { Location: url.pathname } });
    }
    showError = true;
  }

  return page(`<form method="POST" action="">
      <label>Access code</label>
      <input type="password" name="code" autofocus placeholder="Enter your code" />
      ${showError ? '<div class="err">Incorrect code — try again.</div>' : ""}
      <button type="submit">Enter the Workshop</button>
    </form>`, showError ? 401 : 200);
};

/* NOTE: no inline `export const config` on purpose. Netlify auto-discovers files
   in netlify/edge-functions/, and an inline config with path:"/*" would turn the
   gate on for every deploy — blacking out the site when SITE_PASSCODE is unset.
   Instead this gate is opt-in: enable the [[edge_functions]] block in netlify.toml
   (which sets path + excludedPath) and set SITE_PASSCODE. Until then it never runs. */
