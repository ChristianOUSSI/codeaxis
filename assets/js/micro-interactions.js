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

  /* Le state de chargement des formulaires est géré par contact-form.js
     (fetch /api/contact) — ne pas le dupliquer ici : écraser textContent
     casse le libellé et réactive le bouton pendant l'envoi. */
})();
