const CACHE_NAME = 'soulcount-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
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
      return cache.addAll(ASSETS_TO_CACHE);
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

  // CRITICAL: Do not cache or intercept index.tsx or any local .tsx files.
  // These require server-side transpilation which the Service Worker might bypass or break if cached.
  if (url.pathname.endsWith('.tsx')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Strategy: Network first for navigation to ensure the latest index.html (and its import map)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
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

        // Cache libraries and standard assets, but never TSX
        if ((isSameOrigin || isTrusted) && !url.pathname.endsWith('.tsx')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }

        return networkResponse;
      });
    })
  );
});