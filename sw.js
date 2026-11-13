// Service Worker pour CODE AXIS Digital Cameroon PWA
const CACHE_NAME = 'cadc-pwa-v18';

// Assets statiques (JS, CSS, images) : stale-while-revalidate
const STATIC_ASSETS = [
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
  './assets/js/pwa-install.js',
  './assets/js/theme.js',
  './assets/js/icons.js',
  './assets/js/i18n-en-core.js',
  './assets/js/i18n-en-pages.js',
  './assets/js/i18n.js',
  './assets/js/whatsapp-fab.js',
  './assets/js/analytics.js',
  './assets/js/splash.js',
  './assets/js/partnership.js',
  './assets/img/favicon-64.png',
  './assets/img/logo-mark.webp',
  './assets/img/logo-cadc.webp',
  './assets/img/introduction-visual.webp',
  './assets/img/about-visual.webp',
  './assets/img/about-winners.webp',
  './assets/img/about-philosophy.webp',
  './assets/img/about-history.webp',
  './assets/img/partenaires/mboa-bio-237.webp',
  './assets/img/partenaires/frost-co-group.webp',
  './assets/img/evo/evo-gaz.webp',
  './assets/img/evo/evo-clinic.webp',
  './assets/img/evo/evo-shop.webp',
  './assets/img/evo/evo-log.webp',
  './assets/img/evo/evo-hotel.webp',
  './assets/img/evo/evo-market.webp',
  './assets/img/evo/evo-tontaine.webp',
];

// Pages HTML : network-first avec fallback cache
const HTML_PAGES = [
  './',
  './index.html',
  './index-en.html',
  './offline.html',
  './404.html',
  './suite-evo.html',
  './suite-evo-en.html',
  './actualites.html',
  './actualites-en.html',
  './nos-clients.html',
  './nos-clients-en.html',
  './nos-projets.html',
  './nos-projets-en.html',
  './nos-contrats.html',
  './nos-contrats-en.html',
  './nos-realisations.html',
  './nos-realisations-en.html',
  './projet-agrismart.html',
  './projet-agrismart-en.html',
  './projet-finsecure.html',
  './projet-finsecure-en.html',
  './projet-healthportal.html',
  './projet-healthportal-en.html',
  './projet-smartlogistics.html',
  './projet-smartlogistics-en.html',
  './realisation-fintech.html',
  './realisation-fintech-en.html',
  './realisation-logistique.html',
  './realisation-logistique-en.html',
  './realisation-marketplace.html',
  './realisation-marketplace-en.html',
  './christian-oussi.html',
  './christian-oussi-en.html',
  './marc-laurent.html',
  './marc-laurent-en.html',
  './sarah-martin.html',
  './sarah-martin-en.html',
  './axel-dupont.html',
  './axel-dupont-en.html',
  './strategie.html',
  './strategie-en.html',
  './developpement.html',
  './developpement-en.html',
  './design.html',
  './design-en.html',
  './youth-partnership.html',
  './youth-partnership-en.html',
  './confidentialite.html',
  './confidentialite-en.html',
  './mentions-legales.html',
  './mentions-legales-en.html',
];

const ALL_ASSETS = [...HTML_PAGES, ...STATIC_ASSETS];

// ─── Installation : mise en cache initiale ────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll échoue si une URL est absente — on cache individuellement pour robustesse
      return Promise.allSettled(
        ALL_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Cache skip:', url, err.message);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ─── Activation : nettoyage des anciens caches ───────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Interception des requêtes ────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ne pas intercepter les appels API, les scripts Vercel ni les ressources cross-origin
  if (url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/_vercel/') ||
      url.origin !== self.location.origin) return;

  const isNavigation = event.request.mode === 'navigate';
  const isHtml = isNavigation ||
    event.request.headers.get('accept')?.includes('text/html');

  if (isHtml) {
    // ── Stratégie NETWORK-FIRST pour les pages HTML ──────────────────────────
    // On essaie toujours le réseau. Si ça échoue, on sert le cache.
    // Si le cache est vide aussi, on renvoie offline.html.
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match(event.request).then(
            (cached) => cached || caches.match('./offline.html')
          )
        )
    );
  } else {
    // ── Stratégie STALE-WHILE-REVALIDATE pour JS, CSS, images ───────────────
    // On répond immédiatement depuis le cache (si disponible),
    // et on actualise le cache en arrière-plan.
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 &&
                networkResponse.type === 'basic') {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          })
          .catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
