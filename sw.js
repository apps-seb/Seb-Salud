const CACHE_NAME = 'seb-salud-cache-v1';
// Agrega aquí los archivos principales de tu aplicación que quieres que funcionen offline.
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

// Evento de instalación: se ejecuta cuando el Service Worker se instala.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento fetch: se ejecuta cada vez que la app pide un recurso (una imagen, un script, etc.).
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en el caché, lo devolvemos desde ahí.
        if (response) {
          return response;
        }
        // Si no, lo pedimos a la red.
        return fetch(event.request);
      }
    )
  );
});
