/* Mesure d'audience Vercel, sans cookie. Chargée uniquement sur le domaine public
   pour ne pas polluer les aperçus locaux ; l'option doit être activée dans Vercel.
   CSP : le script est servi depuis /_vercel/ (same-origin, couvert par script-src 'self').
   Les beacons partent vers vitals.vercel-insights.com (couvert par connect-src dans vercel.json).
   On sonde d'abord : si Vercel Analytics n'est pas activé, le script 404 et on
   n'injecte rien — pas de resource error dans la console. */
(function () {
  'use strict';
  var host = location.hostname;
  if (host !== 'codeaxis.vercel.app' && host !== 'codeaxis.cm' && host !== 'www.codeaxis.cm') return;
  fetch('/_vercel/insights/script.js', { method: 'HEAD', credentials: 'omit' })
    .then(function (r) {
      if (!r.ok) return;
      var s = document.createElement('script');
      s.defer = true;
      s.src = '/_vercel/insights/script.js';
      document.head.appendChild(s);
    })
    .catch(function () {});
})();
