/* Mesure d'audience Vercel, sans cookie. Chargée uniquement sur le domaine public
   pour ne pas polluer les aperçus locaux ; l'option doit être activée dans Vercel. */
(function () {
  'use strict';
  var host = location.hostname;
  if (host !== 'codeaxis.vercel.app' && host !== 'codeaxis.cm' && host !== 'www.codeaxis.cm') return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  document.head.appendChild(s);
})();
