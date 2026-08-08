const CACHE_NAME = 'rebyte-v1';
const APP_SHELL = [
  '/',
  '/tools',
  '/about',
  '/privacy',
  '/terms',
  '/favicon.png',
  '/manifest.json',
  '/icons/json.svg',
  '/icons/color.svg',
  '/icons/timestamp.svg',
  '/icons/diff.svg',
  '/icons/pdf.svg',
  '/icons/image.svg',
  '/icons/rotate.svg',
  '/icons/text.svg',
  '/icons/word.svg',
  '/icons/lorem.svg',
  '/icons/ping.svg',
  '/icons/calculator.svg',
  '/icons/uuid.svg',
  '/icons/base64.svg',
  '/icons/sha.svg',
  '/icons/password.svg',
  '/icons/jwt.svg',
  '/icons/qr.svg',
  '/icons/barcode.svg',
  '/icons/markdown.svg',
  '/icons/uuid.svg',
  '/icons/word.svg',
  '/icons/rotate.svg',
  '/icons/image.svg',
  '/icons/json.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (request.url.includes('/_next/') || request.destination === 'image' || request.url.endsWith('.svg')) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match('/'));
    })
  );
});
