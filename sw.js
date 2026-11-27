// nofa scores offline cache.
// The page itself comes from the cache first, so the app paints at once (Android's start screen hands over sooner);
// a fresh copy is fetched in the background every time and is used from the next start. Data files: network first.
// Fonts (Google Fonts, other origin): cache first, refreshed in the background. Icons etc.: the same.
const CACHE = 'nofa-v6';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/favicon.svg', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const fresh = (req, key) => fetch(req.url || req, { cache: 'no-cache', credentials: 'same-origin' })
  .then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return r; });

// Cached copy at once if there is one, and refresh the cache in the background
const cacheFirst = (e, key) => caches.match(key).then((hit) => {
  const net = fetch(e.request).then((r) => { if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return r; });
  if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
  return net.catch(() => hit);
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== location.origin) {
    if (FONT_HOSTS.includes(url.hostname)) e.respondWith(cacheFirst(e, e.request));
    return;
  }
  // The app page: cached copy first (refreshed in the background for the next start); network when nothing is cached yet
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    const net = fresh(e.request, e.request);
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('./')).then((hit) => {
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net.catch(() => caches.match('index.html'));
    }));
    return;
  }
  if (url.pathname.includes('/data/')) {
    const key = url.origin + url.pathname; // ignore the cache-busting ?t=
    e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return r; })
      .catch(() => caches.match(key)));
    return;
  }
  e.respondWith(cacheFirst(e, e.request));
});
