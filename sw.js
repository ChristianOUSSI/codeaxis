// Service Worker CODE AXIS — NETWORK-ONLY
// Plus aucun CacheStorage : chaque ressource vient du réseau, donc
// l'utilisateur voit TOUJOURS la dernière version déployée.
// Le SW ne sert qu'à l'installabilité PWA ; il nettoie les anciens caches.
const CACHE_NAME = 'cadc-pwa-v21';

// ─── Installation : activation immédiate ─────────────────────────────────────
self.addEventListener('install', () => self.skipWaiting());

// ─── Activation : purge de tous les caches hérités ───────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch : passthrough réseau pur, zéro interception ────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Pas de CacheStorage : le navigateur gère son propre cache HTTP
  // (vercel.json impose must-revalidate sur /assets/). respondWith
  // explicite pour garder l'installabilité PWA — passthrough pur.
  event.respondWith(fetch(event.request));
});
