// Service Worker pour CODE AXIS Digital Cameroon PWA
const CACHE_NAME = 'cadc-pwa-v11';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './offline.html',
  './404.html',
  './manifest.json',
  './assets/css/cadc-fusion.css',
  './assets/css/home-evo-news.css',
  './assets/css/evo-suite.css',
  './assets/js/cadc-app.js',
  './assets/js/evo-suite.js',
  './assets/js/evo-page.js',
  './assets/js/news-data.js',
  './assets/js/news-page.js',
  './assets/js/stack-data.js',
  './assets/js/developpement-page.js',
  './assets/js/contact-form.js',
  './assets/js/pwa-register.js',
  './assets/js/theme.js',
  './assets/js/icons.js',
  './assets/js/i18n-en-core.js',
  './assets/js/i18n-en-pages.js',
  './assets/js/i18n.js',
  './assets/img/logo-mark.png',
  './assets/img/logo-cadc.png',
  './assets/img/logo-192.png',
  './assets/img/logo-512.png',
  './assets/img/introduction-visual.png',
  './assets/img/about-visual.png',
  './assets/img/partenaires/mboa-bio-237.jpg',
  './assets/img/partenaires/frost-co-group.jpg',
  './suite-evo.html',
  './actualites.html',
  './nos-clients.html',
  './nos-projets.html',
  './nos-contrats.html',
  './nos-realisations.html',
  './projet-agrismart.html',
  './projet-finsecure.html',
  './projet-healthportal.html',
  './projet-smartlogistics.html',
  './realisation-fintech.html',
  './realisation-logistique.html',
  './realisation-marketplace.html',
  './christian-oussi.html',
  './marc-laurent.html',
  './sarah-martin.html',
  './axel-dupont.html',
  './strategie.html',
  './developpement.html',
  './design.html',
  './youth-partnership.html',
  './confidentialite.html',
  './assets/js/splash.js',
  './assets/js/partnership.js'
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

        return responseToCache;
      }).then((resp) => {
        // Page hors-ligne pour les navigations qui échouent au réseau
        return resp;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
      });
    })
  );
});
