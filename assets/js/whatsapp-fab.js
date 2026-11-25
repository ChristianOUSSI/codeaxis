/**
 * Bouton WhatsApp flottant
 * Raccourci de contact permanent, en bas à droite, sur toutes les pages de contenu.
 * Le message prérempli et le libellé suivent la langue choisie.
 */
(function () {
  'use strict';

  var NUMBER = '237691223916';
  var TEXT = {
    fr: {
      msg: 'Bonjour CODE AXIS, je vous contacte depuis votre site.',
      label: 'Écrire à CODE AXIS sur WhatsApp'
    },
    en: {
      msg: 'Hello CODE AXIS, I am contacting you from your website.',
      label: 'Write to CODE AXIS on WhatsApp'
    }
  };

  function lang() {
    return (window.cadcLang && window.cadcLang()) === 'en' ? 'en' : 'fr';
  }

  function paint(link) {
    var t = TEXT[lang()];
    link.href = 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(t.msg);
    link.setAttribute('aria-label', t.label);
    link.title = t.label;
  }

  function init() {
    if (document.querySelector('.wa-fab')) return;

    var link = document.createElement('a');
    link.className = 'wa-fab';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = window.ico
      ? window.ico('whatsapp', { size: 26 })
      : '<svg class="ico" viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>';
    paint(link);
    document.body.appendChild(link);

    document.documentElement.addEventListener('cadc:lang', function () { paint(link); });

    /* Bannière PWA : si elle est visible, on relève le FAB en style
       inline. Fonctionne quelle que soit la version du CSS en cache —
       c'est ce qui le rend invisible en prod avec un vieux SW. */
    function syncBanner() {
      var banner = document.getElementById('pwa-install-banner');
      var open = banner && banner.classList.contains('pwa-install-banner--visible');
      link.style.bottom = open
        ? 'calc(92px + env(safe-area-inset-bottom, 0px))'
        : '';
    }
    syncBanner();
    var bannerWatcher = new MutationObserver(function () {
      var banner = document.getElementById('pwa-install-banner');
      if (banner) {
        bannerWatcher.disconnect();
        new MutationObserver(syncBanner).observe(banner, { attributes: true, attributeFilter: ['class'] });
        syncBanner();
      }
    });
    bannerWatcher.observe(document.body, { childList: true });

    /* Sur la home, le formulaire de contact est déjà à l'écran : le raccourci s'efface */
    var contact = document.querySelector('.contact');
    var section = contact && contact.closest('.l-section');
    if (section) {
      var sync = function () {
        link.classList.toggle('is-hidden', section.classList.contains('section--is-active'));
      };
      sync();
      new MutationObserver(sync).observe(section, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();