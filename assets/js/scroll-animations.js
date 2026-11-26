/* Animations d'entrée au scroll — Intersection Observer
   Fade-in + slide-up subtil pour les sections et cartes */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observer les sections principales
  document.querySelectorAll('.l-section').forEach(function (section) {
    section.classList.add('reveal-on-scroll');
    observer.observe(section);
  });

  // Observer les cartes de contenu
  document.querySelectorAll('.intro--options > a, .about--options > a, .hn-press-card, .contact--info').forEach(function (card) {
    card.classList.add('reveal-on-scroll');
    observer.observe(card);
  });
})();
