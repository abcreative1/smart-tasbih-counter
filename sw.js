const CACHE_NAME = 'soulcount-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://ga.jspm.io/npm:es-module-shims@1.10.1/dist/es-module-shims.js'
];

// Domains allowed for cross-origin caching (libraries)
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

  // Strategy: Network first for navigation, Cache first/SWR for assets
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

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, but update in background (Stale-while-revalidate)
        // Except for index.tsx which might be dynamic
        if (!url.pathname.endsWith('.tsx')) {
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
            }
          }).catch(() => {});
        }
        return cachedResponse;
      }

      // Not in cache, fetch and cache if it's a trusted library or internal asset
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;

        const isTrusted = TRUSTED_DOMAINS.some(domain => url.hostname.includes(domain));
        const isSameOrigin = url.origin === self.location.origin;

        if (isSameOrigin || isTrusted) {
          // Avoid caching large binary blobs or specific dynamic files if necessary
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }

        return networkResponse;
      });
    })
  );
});