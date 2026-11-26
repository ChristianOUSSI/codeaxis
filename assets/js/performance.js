/* Performance avancée — préchargement des assets critiques
   Optimise le chargement des ressources essentielles */
(function () {
  // Précharger les polices critiques
  if ('fonts' in document) {
    // Georgia est déjà une police système, pas besoin de preload
  }

  // Les images critiques sont préchargées dans le <head> des pages (link rel=preload).
  // Ne pas les re-précharger ici : une seconde requête preload n'est jamais
  // consommée et déclenche des warnings console.

  // Lazy loading pour les images non critiques
  document.addEventListener('DOMContentLoaded', function () {
    var images = document.querySelectorAll('img[data-src]');
    var imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(function (img) {
      imageObserver.observe(img);
    });
  });
})();
