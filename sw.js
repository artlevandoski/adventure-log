// Adventure Sheet offline support. Change VERSION whenever you publish an update.
const VERSION = '8';
const CACHE = 'adventure-log-' + VERSION;
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-48.png", "fonts/pirata-one-latin-400-normal.woff2", "fonts/alegreya-latin-400-normal.woff2", "fonts/alegreya-latin-400-italic.woff2", "fonts/alegreya-latin-500-normal.woff2", "fonts/alegreya-latin-700-normal.woff2", "fonts/alegreya-sc-latin-500-normal.woff2", "fonts/alegreya-sc-latin-700-normal.woff2"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('adventure-log-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Serve from the cache straight away, then refresh the cache in the background.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(req, {ignoreSearch: true});
    const network = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
    return cached || network;
  }));
});
