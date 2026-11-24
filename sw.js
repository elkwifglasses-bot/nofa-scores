// nofa scores offline cache.
// The page itself always comes from the network first (bypassing the browser's HTTP cache), so a new version shows up
// on the next start; the cached copy is only used offline. Data files: network first as well. Icons etc.: cache, refreshed in the background.
const CACHE = 'nofa-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/favicon.svg', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const fresh = (req, key) => fetch(req.url || req, { cache: 'no-cache', credentials: 'same-origin' })
  .then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return r; });

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // The app page: network first, cached copy only when offline
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    e.respondWith(fresh(e.request, e.request).catch(() => caches.match(e.request).then((hit) => hit || caches.match('index.html'))));
    return;
  }
  if (url.pathname.includes('/data/')) {
    const key = url.origin + url.pathname; // ignore the cache-busting ?t=
    e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return r; })
      .catch(() => caches.match(key)));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
