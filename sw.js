// Minimaler, robuster SW für GitHub Pages
const CACHE = 'hello-world-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest'];

// sofort aktiv werden
self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))))
  self.clients.claim();
});

// sehr einfacher Cache-First Fallback
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(evt.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(evt.request, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
