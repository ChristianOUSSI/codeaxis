/* Performance avancée — préchargement des assets critiques
   Optimise le chargement des ressources essentielles */
(function () {
  // Précharger les polices critiques
  if ('fonts' in document) {
    // Georgia est déjà une police système, pas besoin de preload
  }

  // Précharger les images critiques (above the fold)
  function preloadImage(src, as = 'image') {
    var link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Précharger les images du hero sur la home
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    preloadImage('assets/img/introduction-visual.webp');
    preloadImage('assets/img/about-visual.webp');
    preloadImage('assets/img/about-winners.webp');
  }

  // Précharger les images des sous-pages
  if (window.location.pathname.includes('nos-projets')) {
    preloadImage('assets/img/projects-hero.webp');
  }

  if (window.location.pathname.includes('suite-evo')) {
    preloadImage('assets/img/evo-hero.webp');
  }

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
