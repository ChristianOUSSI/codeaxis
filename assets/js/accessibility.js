/* Accessibilité — navigation clavier, focus visible, ARIA */
(function () {
  // Focus visible pour la navigation clavier
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-nav');
  });

  // Skip link pour la navigation clavier (si pas déjà présent)
  if (!document.querySelector('.skip-link')) {
    var skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Aller au contenu';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // ARIA labels pour les boutons icône
  document.querySelectorAll('button[aria-label], a[aria-label]').forEach(function (el) {
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', el.textContent.trim() || 'Bouton');
    }
  });

  // Focus trap pour les modales
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var modal = document.querySelector('.modal.is-active, .evo-modal.is-active, #actModal.is-active');
      if (modal) {
        var closeBtn = modal.querySelector('.evo-modal-close, #actModalClose, [data-close]');
        if (closeBtn) closeBtn.click();
      }
    }
  });
})();
