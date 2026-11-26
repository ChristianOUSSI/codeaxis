/* Révélation échelonnée du contenu des sections — pilotée par
   cadc-app.js via l'événement « cadc:sectionchange ».
   Les sections .l-section sont toutes superposées en absolute : un
   IntersectionObserver les verrait toutes visibles en permanence.
   On anime donc les blocs internes quand leur section devient active. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sections = document.querySelectorAll('.l-section');
  if (!sections.length) return;

  var CARD_SEL =
    '.intro--options > a, .about--options > a, .hn-block, .hn-press, ' +
    '.hn-carousel, .hire-carousel-container, .contact--info, ' +
    '.contact--grid > *, .clients-marquee, .cta';

  function resetAll() {
    document.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
      el.classList.remove('is-visible');
      el.style.transitionDelay = '';
    });
  }

  function reveal(scope) {
    var cards = scope.querySelectorAll(CARD_SEL);
    if (!cards.length) return;
    cards.forEach(function (card, i) {
      card.classList.add('reveal-on-scroll');
      card.style.transitionDelay = Math.min(i * 80, 400) + 'ms';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cards.forEach(function (card) { card.classList.add('is-visible'); });
      });
    });
    setTimeout(function () {
      cards.forEach(function (card) { card.style.transitionDelay = ''; });
    }, 1100);
  }

  document.addEventListener('cadc:sectionchange', function (e) {
    resetAll();
    var idx = e.detail && typeof e.detail.index === 'number' ? e.detail.index : -1;
    var sec = (idx >= 0 && sections[idx]) || document.querySelector('.l-section.section--is-active');
    if (sec) reveal(sec);
  });

  // Première section déjà active dans le HTML : on révèle son contenu
  // après le début de la transition d'entrée.
  var first = document.querySelector('.l-section.section--is-active');
  if (first) {
    setTimeout(function () { reveal(first); }, 350);
  }
})();
