// Service Worker pour C.A.D.C. PWA
const CACHE_NAME = 'cadc-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/cadc-fusion.css',
  './assets/js/cadc-app.js',
  './assets/img/logo.svg',
  './assets/img/introduction-visual.png',
  './assets/img/about-visual.png',
  './assets/img/about-history.jpg',
  './assets/img/about-philosophy.jpg',
  './assets/img/about-winners.jpg',
  './assets/img/neural-network.jpg',
  './assets/img/quantum-cloud.jpg',
  './assets/img/blockchain-vault.jpg',
  './assets/img/cyber-defense.jpg',
  './assets/img/data-nexus.jpg',
  './assets/img/ar-interface.jpg',
  './assets/img/iot-matrix.jpg',
  './strategie.html',
  './developpement.html',
  './design.html',
  './nos-clients.html',
  './nos-projets.html',
  './nos-contrats.html',
  './nos-realisations.html',
  './christian-oussi.html',
  './marc-laurent.html',
  './axel-dupont.html',
  './sarah-martin.html'
];

// Installation : mise en cache initiale
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes réseau (Stale-While-Revalidate & Cache-First)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // En arrière-plan, tenter de mettre à jour le cache
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Mode hors-ligne secours
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
