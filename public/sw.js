const CACHE_NAME = 'rebyte-v3';
const APP_SHELL = [
  '/',
  '/tools',
  '/tools/binary-translator',
  '/tools/mp3-cutter',
  '/tools/audio-converter',
  '/tools/audio-visualizer',
  '/tools/mp3-metadata-editor',
  '/tools/audio-volume-booster',
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
  '/icons/binary.svg',
  '/icons/mp3-cutter.svg',
  '/icons/audio-converter.svg',
  '/icons/audio-visualizer.svg',
  '/icons/mp3-metadata.svg',
  '/icons/audio-volume.svg'
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

  const isAppShellAsset = APP_SHELL.includes(url.pathname) || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/_next/static/') || url.pathname.endsWith('.svg');

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && (isAppShellAsset || request.destination === 'image' || request.url.includes('/_next/') || request.mode === 'navigate')) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/');
          }

          return caches.match(request) || Response.error();
        });
    })
  );
});
