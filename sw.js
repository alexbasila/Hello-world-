// Minimaler SW – erfüllt die Install‑Kriterien
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (evt) => evt.waitUntil(self.clients.claim()));

// Optionaler, simpler Cache
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.open('hello-world-cache').then(async cache => {
      const hit = await cache.match(evt.request, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(evt.request).catch(() => null);
      if (res && res.ok && evt.request.method === 'GET') cache.put(evt.request, res.clone());
      return res || new Response('offline', { status: 503 });
    })
  );
});
