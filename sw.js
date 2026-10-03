// Bump this on every change to index.html — the fetch handler is cache-first,
// so a stale cache would otherwise keep serving the old app forever.
const CACHE = 'noise-v7';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

// cache: 'reload' bypasses the browser's HTTP cache. GitHub Pages serves with
// max-age=600, so a plain addAll right after a deploy can store the *old*
// index.html under the new cache name, and the update silently never lands.
self.addEventListener('install', (e) => {
  const fresh = ASSETS.map((u) => new Request(u, { cache: 'reload' }));
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(fresh)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first: once installed the app never needs the network again.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true })
      .then((hit) => hit || fetch(e.request))
  );
});
