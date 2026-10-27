/**
 * Thème persistant sur les sous-pages CODE AXIS
 * Lit le thème mémorisé par home (localStorage 'cadc_theme'), l'applique
 * et ajoute un bouton flottant nuit -> jour -> soirée.
 */
(function () {
  'use strict';

  var ORDER = ['night', 'day', 'evening'];
  var ICONS = {
    night: '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>',
    day: '<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>',
    evening: '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>'
  };
  var LABELS = { night: 'nuit', day: 'jour', evening: 'soirée' };

  function current() {
    var saved = 'night';
    try { saved = localStorage.getItem('cadc_theme') || 'night'; } catch (e) {}
    return ORDER.indexOf(saved) >= 0 ? saved : 'night';
  }

  function apply(name) {
    document.body.classList.remove('theme-night', 'theme-day', 'theme-evening');
    document.body.classList.add('theme-' + name);
    try { localStorage.setItem('cadc_theme', name); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', name === 'day' ? '#d9e1ea' : name === 'evening' ? '#1e1e28' : '#2e4257');
    }
    var fab = document.getElementById('theme-fab');
    if (fab) {
      fab.innerHTML = ICONS[name];
      fab.title = 'Thème ' + LABELS[name] + ', cliquer pour changer';
      fab.setAttribute('aria-label', 'Changer de thème, actuellement ' + LABELS[name]);
    }
  }

  function init() {
    var fab = document.createElement('button');
    fab.id = 'theme-fab';
    fab.className = 'theme-fab';
    fab.type = 'button';
    document.body.appendChild(fab);

    fab.addEventListener('click', function () {
      var now = ORDER.filter(function (t) { return document.body.classList.contains('theme-' + t); })[0] || 'night';
      apply(ORDER[(ORDER.indexOf(now) + 1) % ORDER.length]);
    });

    apply(current());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
