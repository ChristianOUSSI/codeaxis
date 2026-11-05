/**
 * Page Suite evo : montage de la grille, retour en haut et relais de molette
 * vers la home.
 */
(function () {
  'use strict';

  EvoSuite.mount({
    grid: 'evoGrid', modal: 'evoModal', stage: 'evoStage', img: 'evoModalImg',
    name: 'evoModalName', desc: 'evoModalDesc', cta: 'evoModalCta', close: 'evoModalClose', back: 'evoModalBack',
    deepLink: true
  });

  var btn = document.getElementById('toTopBtn');
  var ticking = false;
  var lastScrollTime = Date.now();

  function onScroll() {
    lastScrollTime = Date.now();
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      btn.classList.toggle('is-visible', window.scrollY > 420);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Relais de continuité avec la home :
     en haut + molette vers le haut -> section Suite evo ; en bas + molette vers le bas -> Contact */
  var leaving = false;
  window.addEventListener('wheel', function (e) {
    if (leaving || Date.now() - lastScrollTime < 240) return;
    var atTop = window.scrollY <= 1;
    var atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    if (e.deltaY < -25 && atTop) { leaving = true; window.location.href = 'index.html#section-3'; }
    else if (e.deltaY > 25 && atBottom) { leaving = true; window.location.href = 'index.html#section-5'; }
  }, { passive: true });
})();
