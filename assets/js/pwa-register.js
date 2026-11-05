/**
 * Enregistrement du service worker PWA CODE AXIS.
 */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js')
      .then(function (reg) { console.log('ServiceWorker CADC PWA enregistré :', reg.scope); })
      .catch(function (err) { console.log('Échec enregistrement ServiceWorker :', err); });
  });
})();
