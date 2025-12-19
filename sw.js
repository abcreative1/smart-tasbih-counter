const CACHE_NAME = 'soulcount-v5';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://ga.jspm.io/npm:es-module-shims@1.10.1/dist/es-module-shims.js'
];

const TRUSTED_DOMAINS = [
  'esm.sh',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn-icons-png.flaticon.com',
  'ga.jspm.io'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use {cache: 'reload'} to bypass local cache when pre-caching
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return fetch(new Request(url, { cache: 'reload' }))
            .then(res => cache.put(url, res))
            .catch(err => console.warn('Failed to pre-cache:', url, err));
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // CRITICAL: Absolutely never intercept .tsx files.
  // These require the environment's special transpiler.
  if (url.pathname.includes('.tsx')) {
    return; // Let the browser handle it via network
  }

  // Strategy: Network first for index.html/Navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;

        const isTrusted = TRUSTED_DOMAINS.some(domain => url.hostname.includes(domain));
        const isSameOrigin = url.origin === self.location.origin;

        // Never cache TSX files if they somehow got here
        if ((isSameOrigin || isTrusted) && !url.pathname.includes('.tsx')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }

        return networkResponse;
      });
    })
  );
});