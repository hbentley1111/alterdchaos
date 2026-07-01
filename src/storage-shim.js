/* storage-shim.js
   The app was first built inside Anthropic's artifact runtime, which provides a
   global `window.storage` (async key/value store). On the open web that API does
   not exist, so this shim recreates the same interface backed by localStorage.
   Data persists per browser/device. Swap this file for a real API client when
   you stand up a hosted backend — App.jsx never needs to change. */
(function () {
  if (typeof window === "undefined") return;
  if (window.storage) return; // real runtime storage already present

  const NS = "altardchaos::";
  const full = (key) => NS + key;

  window.storage = {
    async get(key) {
      const v = localStorage.getItem(full(key));
      if (v === null) return null;
      return { key, value: v, shared: false };
    },
    async set(key, value) {
      const v = String(value);
      localStorage.setItem(full(key), v);
      return { key, value: v, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(full(key));
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      const scan = NS + prefix;
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const sk = localStorage.key(i);
        if (sk && sk.startsWith(scan)) keys.push(sk.slice(NS.length));
      }
      return { keys, prefix, shared: false };
    },
  };
})();
