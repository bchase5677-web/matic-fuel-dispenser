const CACHE_NAME = 'matic-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Bypass cache for development URLs and non-GET requests
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('socket.io') ||
    event.request.url.includes('/@vite') ||
    event.request.url.includes('/@react-refresh') ||
    event.request.url.includes('node_modules') ||
    event.request.url.includes('.tsx') ||
    event.request.url.includes('.ts')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache);
                }
              });
            return response;
          }
        ).catch(() => {
           // Ignore errors from fetch in SW
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'Matic.Co', body: 'New notification!' };
  const options = {
    body: data.body,
    icon: '/icon.svg',
    badge: '/icon.svg'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
