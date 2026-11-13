/**
 * PWA Install Prompt — CODE AXIS
 * Intercepte beforeinstallprompt, attend que le splash soit terminé,
 * puis affiche une petite bannière en bas de l'écran.
 * Respecte la langue choisie (fr/en) et mémorise si l'utilisateur refuse.
 */
(function () {
  'use strict';

  var DISMISSED_KEY = 'cadc_pwa_install_dismissed';
  var INSTALLED_KEY = 'cadc_pwa_installed';

  var LABELS = {
    fr: {
      title: 'Installer l\'application',
      body: 'Accédez à CODE AXIS rapidement depuis votre écran d\'accueil.',
      install: 'Installer',
      dismiss: 'Plus tard'
    },
    en: {
      title: 'Install the app',
      body: 'Access CODE AXIS quickly from your home screen.',
      install: 'Install',
      dismiss: 'Later'
    }
  };

  var deferredPrompt = null;
  var bannerEl = null;
  var showTimer = null;

  function lang() {
    return (window.cadcLang && window.cadcLang()) === 'en' ? 'en' : 'fr';
  }

  /* Crée le banner dans le DOM */
  function createBanner() {
    if (document.getElementById('pwa-install-banner')) return;

    bannerEl = document.createElement('div');
    bannerEl.id = 'pwa-install-banner';
    bannerEl.className = 'pwa-install-banner';
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-modal', 'false');
    bannerEl.setAttribute('aria-live', 'polite');
    renderBanner();
    document.body.appendChild(bannerEl);

    /* Réagit aux changements de langue */
    document.documentElement.addEventListener('cadc:lang', function () {
      if (bannerEl) renderBanner();
    });
  }

  function renderBanner() {
    if (!bannerEl) return;
    var t = LABELS[lang()];
    bannerEl.setAttribute('aria-label', t.title);
    bannerEl.innerHTML =
      '<div class="pwa-install-inner">' +
        '<img class="pwa-install-icon" src="assets/img/logo-mark.webp" alt="CODE AXIS" width="44" height="44">' +
        '<div class="pwa-install-text">' +
          '<strong class="pwa-install-title">' + t.title + '</strong>' +
          '<span class="pwa-install-body">' + t.body + '</span>' +
        '</div>' +
        '<div class="pwa-install-actions">' +
          '<button class="pwa-btn pwa-btn--dismiss" id="pwa-dismiss-btn" aria-label="' + t.dismiss + '">' + t.dismiss + '</button>' +
          '<button class="pwa-btn pwa-btn--install" id="pwa-install-btn" aria-label="' + t.install + '">' + t.install + '</button>' +
        '</div>' +
      '</div>';

    document.getElementById('pwa-install-btn').addEventListener('click', onInstall);
    document.getElementById('pwa-dismiss-btn').addEventListener('click', onDismiss);
  }

  function showBanner() {
    if (!bannerEl) return;
    /* Petit délai pour que le browser peinte d'abord la bannière (hors-écran),
       puis on applique la classe d'entrée */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bannerEl.classList.add('pwa-install-banner--visible');
      });
    });
  }

  function hideBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove('pwa-install-banner--visible');
  }

  function onDismiss() {
    try { localStorage.setItem(DISMISSED_KEY, Date.now().toString()); } catch (e) {}
    hideBanner();
  }

  /* On n'embête pas l'utilisateur s'il a déjà refusé dans les 7 derniers jours */
  function shouldShow() {
    try {
      if (localStorage.getItem(INSTALLED_KEY)) return false;
      var ts = parseInt(localStorage.getItem(DISMISSED_KEY), 10);
      if (ts && Date.now() - ts < 7 * 24 * 3600 * 1000) return false;
    } catch (e) {}
    return true;
  }

  /* Attend que le splash soit parti (classe removed) avant d'afficher */
  function waitForSplashThenShow() {
    var splash = document.getElementById('site-splash');
    if (splash) {
      /* Le splash se retire en ~2.5s — on attend 3.5s pour être sûr */
      showTimer = setTimeout(function () {
        createBanner();
        showBanner();
      }, 3500);
    } else {
      showTimer = setTimeout(function () {
        createBanner();
        showBanner();
      }, 2000);
    }
  }

  /* Écoute l'événement du navigateur */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;

    if (!shouldShow()) return;

    /* On attend que le DOM soit prêt */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForSplashThenShow);
    } else {
      waitForSplashThenShow();
    }
  });

  /* Toast de confirmation après installation */
  function showInstalledToast() {
    var TOAST_LABELS = {
      fr: '✓ Application installée',
      en: '✓ Application installed'
    };
    var toast = document.createElement('div');
    toast.id = 'pwa-installed-toast';
    toast.className = 'pwa-installed-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = TOAST_LABELS[lang()];
    document.body.appendChild(toast);

    /* Animation : entrée → pause → sortie */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('pwa-installed-toast--visible');
      });
    });

    setTimeout(function () {
      toast.classList.remove('pwa-installed-toast--visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3000);
  }

  /* Quand l'app est installée depuis une autre source (bandeau Chrome) */
  window.addEventListener('appinstalled', function () {
    try { localStorage.setItem(INSTALLED_KEY, '1'); } catch (e) {}
    hideBanner();
    if (showTimer) clearTimeout(showTimer);
    showInstalledToast();
  });

  /* Exposer pour que onInstall puisse aussi déclencher le toast */
  function onInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (result) {
      if (result.outcome === 'accepted') {
        try { localStorage.setItem(INSTALLED_KEY, '1'); } catch (e) {}
        showInstalledToast();
      } else {
        try { localStorage.setItem(DISMISSED_KEY, Date.now().toString()); } catch (e) {}
      }
      deferredPrompt = null;
      hideBanner();
    }).catch(function () {
      deferredPrompt = null;
      hideBanner();
    });
  }
})();
