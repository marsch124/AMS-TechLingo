const CACHE_NAME = 'ams-techlingo-v1';
const APP_VERSION = '1.0';

/* Relative URLs so the same worker serves both local testing and GitHub Pages. */
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/db.js',
    './js/library.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-512-maskable.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-64.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }
                return Promise.resolve();
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) return response;
            return fetch(event.request).then((netResponse) => {
                if (netResponse && netResponse.status === 200 && netResponse.type === 'basic') {
                    const clone = netResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return netResponse;
            }).catch(() => caches.match('./index.html'));
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
