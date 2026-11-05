/**
 * Page Actualité : filtres, liste, modale de lecture et retour en haut.
 * Les données vivent dans news-data.js, partagé avec l'aperçu de la home.
 */
(function () {
  'use strict';

  var NEWS = window.CADC_NEWS || [];
  var TAGS = ['Tous', 'Agence', 'Produit', 'Terrain', 'Technique', 'Partenariat'];
  var active = 'Tous';

  var list = document.getElementById('actList');
  var filters = document.getElementById('actFilters');
  var modal = document.getElementById('actModal');
  var modalTitle = document.getElementById('actModalTitle');
  var modalMeta = document.getElementById('actModalMeta');
  var modalText = document.getElementById('actModalText');
  var modalCtaWrap = document.getElementById('actModalCtaWrap');
  var modalCta = document.getElementById('actModalCta');
  var modalLogo = document.getElementById('actModalLogo');

  TAGS.forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'act-filter' + (t === active ? ' is-active' : '');
    b.textContent = t;
    b.addEventListener('click', function () {
      active = t;
      filters.querySelectorAll('.act-filter').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      render();
    });
    filters.appendChild(b);
  });

  function fmt(iso) {
    return window.cadcNewsDate ? cadcNewsDate(iso) : iso;
  }

  function render() {
    list.innerHTML = '';
    var items = NEWS.filter(function (n) { return active === 'Tous' || n.tag === active; });
    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'act-empty';
      empty.textContent = 'Aucune actualité dans cette catégorie pour le moment.';
      list.appendChild(empty);
      return;
    }
    items.forEach(function (n) {
      var card = document.createElement('article');
      card.className = 'act-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.innerHTML =
        '<div class="act-card-head"><span class="act-tag">' + n.tag + '</span><time class="act-date" datetime="' + n.date + '">' + fmt(n.date) + '</time></div>' +
        '<h2>' + n.title + '</h2>' +
        '<p>' + n.excerpt + '</p>' +
        '<span class="act-card-more">Lire' +
        '<svg class="ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h14M13.5 6.5L19.5 12l-6 5.5"/></svg></span>';

      function open() {
        modalTitle.textContent = n.title;
        modalMeta.innerHTML = '<span class="act-tag">' + n.tag + '</span><span>' + fmt(n.date) + '</span>';
        modalText.innerHTML = n.body.map(function (sec) {
          return '<h3>' + sec[0] + '</h3><p>' + sec[1] + '</p>';
        }).join('');
        if (modalLogo) {
          if (n.image) {
            modalLogo.src = n.image;
            modalLogo.alt = n.title;
            modalLogo.style.display = '';
          } else {
            modalLogo.removeAttribute('src');
            modalLogo.style.display = 'none';
          }
        }
        if (n.cta && modalCta) {
          modalCta.textContent = n.cta.label;
          modalCta.href = n.cta.href;
          modalCtaWrap.style.display = '';
        } else if (modalCtaWrap) {
          modalCtaWrap.style.display = 'none';
        }
        modal.classList.add('is-active');
        document.getElementById('actModalClose').focus();
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#' + encodeURIComponent(cadcNewsHash(n)));
        }
      }

      card.addEventListener('click', open);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
      list.appendChild(card);
    });
  }

  function close() { modal.classList.remove('is-active'); }
  document.getElementById('actModalClose').addEventListener('click', close);
  document.getElementById('actModalBack').addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  render();

  /* Ancre directe : actualites.html#2026-11-05-mboa-bio-237-rejoint-la-mais ouvre la fiche */
  function openFromHash() {
    var h = decodeURIComponent((window.location.hash || '').replace('#', ''));
    if (!/^\d{4}-\d{2}-\d{2}/.test(h)) return;
    var known = NEWS.some(function (n) { return cadcNewsHash(n) === h; });
    if (!known) return;
    var visible = NEWS.filter(function (n) { return active === 'Tous' || n.tag === active; });
    var idx = visible.findIndex(function (n) { return cadcNewsHash(n) === h; });
    if (idx < 0) {
      active = 'Tous';
      render();
      idx = NEWS.findIndex(function (n) { return cadcNewsHash(n) === h; });
    }
    var cards = list.querySelectorAll('.act-card');
    if (cards[idx]) cards[idx].click();
  }
  setTimeout(openFromHash, 80);
  window.addEventListener('hashchange', openFromHash);

  /* Les dates suivent la langue choisie */
  document.documentElement.addEventListener('cadc:lang', render);

  /* Bouton retour en haut */
  var btn = document.getElementById('toTopBtn');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      btn.classList.toggle('is-visible', window.scrollY > 420);
    });
  }, { passive: true });
  btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();
