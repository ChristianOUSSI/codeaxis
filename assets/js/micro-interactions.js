/* Micro-interactions — feedback visuel sur les éléments interactifs */
(function () {
  // Ripple effect sur les boutons
  document.addEventListener('click', function (e) {
    var target = e.target.closest('button, a.btn, .cta, .mode-btn, .indicator');
    if (!target) return;

    var rect = target.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x = e.clientX - rect.left - size / 2;
    var y = e.clientY - rect.top - size / 2;

    var ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    target.appendChild(ripple);

    setTimeout(function () {
      ripple.remove();
    }, 600);
  });

  // Loading state sur les formulaires
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.classList.contains('contact-form')) {
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';

        // Reset après 3s (fallback)
        setTimeout(function () {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer';
        }, 3000);
      }
    }
  });
})();
