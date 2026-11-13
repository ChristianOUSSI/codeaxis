/* Mesure d'audience Vercel, sans cookie. Chargée uniquement sur le domaine public
   pour ne pas polluer les aperçus locaux ; l'option doit être activée dans Vercel.
   CSP : le script est servi depuis /_vercel/ (same-origin, couvert par script-src 'self').
   Les beacons partent vers vitals.vercel-insights.com (couvert par connect-src dans vercel.json).
   Si tu ajoutes un autre outil analytics tiers, penser à mettre à jour connect-src. */
(function () {
  'use strict';
  var host = location.hostname;
  if (host !== 'codeaxis.vercel.app' && host !== 'codeaxis.cm' && host !== 'www.codeaxis.cm') return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  document.head.appendChild(s);
})();
