/* Analytics avancés — événements personnalisés pour Vercel Analytics
   Track: clics WhatsApp, soumissions formulaire, navigation sections */
(function () {
  // Track clic WhatsApp
  document.addEventListener('click', function (e) {
    var waLink = e.target.closest('a[href*="wa.me"], .wa-fab');
    if (waLink) {
      if (window.va) {
        window.va('event', {
          name: 'whatsapp_click',
          data: {
            location: waLink.closest('.l-section')?.id || 'unknown',
            lang: window.cadcLang ? window.cadcLang() : 'fr'
          }
        });
      }
    }
  });

  // Track soumission formulaire
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.classList.contains('contact-form')) {
      if (window.va) {
        window.va('event', {
          name: 'contact_form_submit',
          data: {
            lang: window.cadcLang ? window.cadcLang() : 'fr'
          }
        });
      }
    }
  });

  // Track navigation sections (home)
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && window.va) {
          window.va('event', {
            name: 'section_view',
            data: {
              section: entry.target.id || 'unknown',
              lang: window.cadcLang ? window.cadcLang() : 'fr'
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.l-section').forEach(function (section) {
      observer.observe(section);
    });
  }
})();
