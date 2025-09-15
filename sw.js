const CACHE_NAME = 'seb-salud-cache-v1';

// Lista de recursos básicos para que la app cargue offline.
const URLS_TO_CACHE = [
  './', // Representa el index.html
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Instala el Service Worker y guarda el "App Shell" en la caché.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta. Guardando recursos offline.');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Limpia cachés antiguas cuando se activa un nuevo Service Worker.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta las peticiones de red.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Estrategia: Cache-First. Busca en la caché primero.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Si está en caché, lo devuelve.
        if (cachedResponse) {
          return cachedResponse;
        }
        // Si no, lo busca en la red.
        return fetch(event.request);
      })
  );
});
