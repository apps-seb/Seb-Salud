const CACHE_NAME = 'seb-salud-cache-v5'; // <-- ¡Cambia la versión aquí!
const urlsToCache = [
    '/',
    'index.html', // O el nombre de tu archivo HTML principal
    'manifest.json',
    'icons/icon-192x192.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest'
    // Puedes añadir aquí otros recursos estáticos importantes que quieras que carguen rápido
];

// Evento de instalación: se dispara cuando el SW se instala por primera vez.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierta');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de activación: se dispara cuando un nuevo SW toma el control.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Si el nombre de la caché no es el actual, la borramos.
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento fetch: intercepta todas las peticiones de red.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en la caché, la devolvemos inmediatamente.
                if (response) {
                    return response;
                }
                // Si no está en la caché, vamos a la red a buscarla.
                return fetch(event.request);
            })
    );
});
