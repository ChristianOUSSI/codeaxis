/**
 * SCRIPTS PERSONNALISÉS - C.A.D.C.
 * Gestion de la navigation clavier et persistance de session
 */

// Navigation au clavier (Flèches directionnelles + Entrée)
document.addEventListener('keydown', function(e) {
  // Ignorer si le focus est dans un champ de saisie
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  // Ignorer Entrée si le focus est déjà sur un élément interactif (lien/bouton)
  if (e.key === 'Enter' && (e.target.tagName === 'A' || e.target.tagName === 'BUTTON')) return;

  const sideNavItems = document.querySelectorAll('.side-nav li');
  let activeIndex = -1;

  // Trouver l'élément actif
  sideNavItems.forEach((item, index) => {
    if (item.classList.contains('is-active')) {
      activeIndex = index;
    }
  });

  if (activeIndex !== -1) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      // Aller à la section suivante
      if (activeIndex < sideNavItems.length - 1) {
        sideNavItems[activeIndex + 1].click();
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      // Aller à la section précédente
      if (activeIndex > 0) {
        sideNavItems[activeIndex - 1].click();
      }
    } else if (e.key === 'Enter') {
      // Validation avec Entrée
      const isMenuOpen = document.querySelector('.outer-nav').classList.contains('is-vis');
      if (isMenuOpen) {
        // Si le menu est ouvert, valider la sélection (fermer le menu et aller à la section)
        document.querySelectorAll('.outer-nav li')[activeIndex].click();
      } else {
        // Si on est sur la section Intro (index 0), activer le CTA principal "Ecrivez nous"
        if (activeIndex === 0) {
          const cta = document.querySelector('.intro .cta');
          if (cta) cta.click();
        }
      }
    }
  }
});

// Persistance de la section active (5 parties) au rafraîchissement
$(document).ready(function() {
  // Restaurer la section active si elle existe en mémoire
  var savedIndex = sessionStorage.getItem('activeSectionIndex');
  if (savedIndex && savedIndex !== '0') {
    // Petit délai pour assurer que le DOM est prêt
    setTimeout(function() {
      // Simule un clic pour activer la section et les animations associées
      $('.side-nav li').eq(savedIndex).click();
    }, 100);
  }

  // Observer les changements de section (Click, Scroll, Clavier) pour sauvegarder l'état
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === "class") {
        var $target = $(mutation.target);
        if ($target.hasClass('is-active')) {
          sessionStorage.setItem('activeSectionIndex', $target.index());
        }
      }
    });
  });

  // Appliquer l'observateur sur les 5 éléments de navigation
  $('.side-nav li').each(function() {
    observer.observe(this, { attributes: true });
  });
});

/* =========================================
   PROMOTION PWA (MOBILE)
   ========================================= */
(function() {
  // Détection basique mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // Vérifier si déjà en mode standalone (PWA installée)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (isMobile && !isStandalone) {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Empêcher Chrome d'afficher la bannière native immédiatement
      e.preventDefault();
      deferredPrompt = e;

      // Créer le bouton s'il n'existe pas déjà
      if (!document.querySelector('.pwa-install-float')) {
        const btn = document.createElement('button');
        btn.className = 'pwa-install-float';
        btn.innerHTML = '<span style="font-size:18px">📲</span> Installer l\'App';
        
        // Styles inline pour garantir l'affichage sans CSS externe
        Object.assign(btn.style, {
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '9999',
          padding: '12px 24px',
          background: 'var(--theme-accent, #5a7cff)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          fontWeight: '700',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontFamily: "'Montserrat', sans-serif",
          transition: 'transform 0.2s ease',
          animation: 'fadeInUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });

        // Effet hover
        btn.onmouseover = () => btn.style.transform = 'translateX(-50%) scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'translateX(-50%) scale(1)';

        btn.addEventListener('click', () => {
          // Cacher le bouton
          btn.style.display = 'none';
          // Afficher l'invite native
          deferredPrompt.prompt();
          // Gérer le résultat
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome !== 'accepted') {
              btn.style.display = 'flex'; // Réafficher si refusé
            }
            deferredPrompt = null;
          });
        });

        document.body.appendChild(btn);
      }
    });
  }
})();