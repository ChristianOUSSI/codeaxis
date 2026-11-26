/**
 * Splash de marque CODE AXIS, non bloquant :
 * le vrai contenu est déjà en dessous, le voile s'efface seul (ou au clic),
 * une seule fois par session, et jamais pour les navigateurs sans JavaScript.
 */
(function () {
  'use strict';

  var KEY = 'cadc_splash_seen';
  var splash = document.getElementById('site-splash');
  var status = document.getElementById('splash-status');
  if (!splash) return;

  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  if (seen) return;

  splash.classList.add('is-on');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LABELS = {
    'Initialisation': { fr: 'Initialisation', en: 'Initialising' },
    'Chargement des actifs': { fr: 'Chargement des actifs', en: 'Loading assets' },
    'Calibrage': { fr: 'Calibrage', en: 'Calibrating' },
    'Prêt': { fr: 'Prêt', en: 'Ready' }
  };
  var steps = ['Initialisation', 'Chargement des actifs', 'Calibrage', 'Prêt'];
  var timers = [];

  function paint(label) {
    var l = LABELS[label] || { fr: label, en: label };
    return (window.cadcLang && window.cadcLang() === 'en') ? l.en : l.fr;
  }

  steps.forEach(function (label, i) {
    timers.push(setTimeout(function () {
      if (!status) return;
      status.style.opacity = '0';
      setTimeout(function () {
        status.textContent = paint(label);
        status.style.opacity = '1';
      }, 150);
    }, i * 620));
  });

  var dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    splash.classList.add('is-gone');
    setTimeout(function () { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 650);
  }

  timers.push(setTimeout(dismiss, reduced ? 700 : 2700));
  splash.addEventListener('click', dismiss);
})();
