
const CACHE_NAME = 'jonathan-pwa-shell-v1';
const RUNTIME_CACHE = 'jonathan-pwa-runtime-v1';
const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './css/styles.css',
  './js/app.js',
  './js/storage.js',
  './js/utils.js',
  './js/charts.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(req).then(res => {
        const resClone = res.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(req, resClone));
        return res;
      }).catch(() => {
        return caches.match(req).then(cached => cached || caches.match('./offline.html'));
      })
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(res => {
        const resClone = res.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(req, resClone));
        return res;
      }).catch(() => cached);
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Visualizador de datos', body: 'Nuevos datos disponibles.' };
  const options = {
    body: data.body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-datos') {
    event.waitUntil(
      Promise.resolve() 
    );
  }
});