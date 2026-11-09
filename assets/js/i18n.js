/**
 * Bascule de langue FR / EN
 * Dictionnaire courant dans i18n-en-core.js (window.CADC_I18N), chargé avec la page.
 * Dictionnaire des pages dans i18n-en-pages.js (window.CADC_I18N_EXTRA), chargé à la demande
 * au premier passage en anglais : un visiteur qui reste en français ne le télécharge pas.
 * Le français d'origine est conservé en mémoire par noeud, donc revenir à FR restaure exactement le texte de départ.
 */
(function () {
  'use strict';

  var KEY = 'cadc_lang';
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };
  var textOriginals = new Map();
  var attrOriginals = new WeakMap();
  var linkOriginals = new WeakMap();
  var STATIC = document.documentElement.getAttribute('data-static-lang');
  var NEEDS_DICT = STATIC === 'en' && document.documentElement.hasAttribute('data-static-dict');
  var lang = STATIC === 'en' ? 'en' : read();

  var selfSrc = document.currentScript && document.currentScript.src;
  var EXTRA_SRC = selfSrc
    ? selfSrc.replace(/i18n\.js(\?.*)?$/, 'i18n-en-pages.js')
    : 'assets/js/i18n-en-pages.js';
  var extraCallbacks = [];
  var extraLoading = false;

  function loadExtra(done) {
    if (typeof window.CADC_I18N_EXTRA === 'string') { if (done) done(); return; }
    if (done) extraCallbacks.push(done);
    if (extraLoading) return;
    extraLoading = true;
    var s = document.createElement('script');
    s.src = EXTRA_SRC;
    s.onload = s.onerror = function () {
      dictionary = null;
      extraLoading = false;
      var waiters = extraCallbacks;
      extraCallbacks = [];
      for (var i = 0; i < waiters.length; i++) waiters[i]();
    };
    document.head.appendChild(s);
  }

  /* Le survol ou la tabulation vers EN lance le téléchargement avant le clic */
  function prefetchExtra() {
    if (STATIC === 'en' && !NEEDS_DICT) return;
    loadExtra(null);
  }

  function read() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'fr' || saved === 'en') return saved;
      var nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
      return nav === 'en' ? 'en' : 'fr';
    } catch (e) { return 'fr'; }
  }

  /* Les dictionnaires arrivent au format "Français|English", une paire par ligne.
     Un pipe appartenant au texte est échappé %7C, sinon il sert seul de séparateur. */
  var PIPE = /\|/;
  var dictionary = null;

  function decode(s) { return s.replace(/%7C/g, '|'); }

  function dict() {
    if (dictionary) return dictionary;
    dictionary = new Map();
    [window.CADC_I18N, window.CADC_I18N_EXTRA].forEach(function (raw) {
      if (typeof raw !== 'string') return;
      raw.split('\n').forEach(function (line) {
        var cut = line.search(PIPE);
        if (cut < 1) return;
        var fr = norm(decode(line.slice(0, cut)));
        var en = decode(line.slice(cut + 1)).trim();
        if (fr && en) dictionary.set(fr, en);
      });
    });
    return dictionary;
  }

  /* Apostrophes typographiques et droites interchangeables à la recherche,
     les clés du dictionnaire restent en apostrophe droite. */
  function norm(s) {
    return String(s)
      .replace(/\u00a0/g, ' ')
      .replace(/[\u2019\u02BC\u2018]/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Les émojis sont remplacés par des SVG au rendu : on nettoie les résidus de symboles */
  function strip(s) {
    return norm(s).replace(/^[★✦✧⚡🚀📋🎯💡✅✨⚙]+\s*/u, '').replace(/\s*[➔→]+\s*$/u, '').trim();
  }

  function lookup(fr) {
    var d = dict();
    var key = norm(fr);
    if (d.has(key)) return d.get(key);
    var bare = strip(key);
    return d.has(bare) ? d.get(bare) : null;
  }

  function translateText(node) {
    var raw = node.nodeValue;
    var key = norm(raw);
    if (!key || SKIP[node.parentNode && node.parentNode.tagName]) return;

    if (lang === 'en') {
      var en = lookup(key);
      if (en === null) en = lookup(raw);
      if (en === null) return;
      if (!textOriginals.has(node)) textOriginals.set(node, raw);
      /* on garde l'espacement d'origine autour du texte */
      var lead = raw.match(/^\s*/)[0];
      var tail = raw.match(/\s*$/)[0];
      if (raw !== lead + key + tail) { textOriginals.set(node, raw); }
      node.nodeValue = lead + en + tail;
    } else if (textOriginals.has(node)) {
      node.nodeValue = textOriginals.get(node);
      textOriginals.delete(node);
    }
  }

  function translateAttrs(el) {
    if (!el.setAttribute || SKIP[el.tagName]) return;
    var stored = attrOriginals.get(el);
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var val = el.getAttribute(a);
      if (lang === 'en') {
        var en = lookup(norm(val));
        if (en !== null && en !== val) {
          if (!stored) { stored = {}; attrOriginals.set(el, stored); }
          if (stored[a] === undefined) stored[a] = val;
          el.setAttribute(a, en);
        }
      } else if (stored && stored[a] !== undefined) {
        el.setAttribute(a, stored[a]);
        delete stored[a];
      }
    }

    if (el.tagName === 'A' && el.hasAttribute('href')) {
      var href = el.getAttribute('href');
      if (lang === 'en') {
        var next = translateQuery(enHref(href));
        if (next !== href) {
          if (!linkOriginals.has(el)) linkOriginals.set(el, href);
          el.setAttribute('href', next);
        }
      } else if (linkOriginals.has(el)) {
        el.setAttribute('href', linkOriginals.get(el));
        linkOriginals.delete(el);
      }
    }
  }

  /* Messages préremplis WhatsApp et objets de courriel */
  function translateQuery(href) {
    return href.replace(/([?&](?:text|subject)=)([^&#]*)/g, function (whole, prefix, encoded) {
      var decoded;
      try { decoded = decodeURIComponent(encoded); } catch (e) { return whole; }
      var en = lookup(decoded);
      return en === null ? whole : prefix + encodeURIComponent(en);
    });
  }

  function sweep(root) {
    if (!root || !document.createTreeWalker) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
    var n;
    while ((n = walker.nextNode())) {
      if (n.nodeType === 3) translateText(n);
      else if (n.nodeType === 1) translateAttrs(n);
    }
  }

  /* Liens internes vers la version anglaise quand elle existe */
  function enHref(href) {
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return href;
    var cut = href.search(/[?#]/);
    var path = cut < 0 ? href : href.slice(0, cut);
    var rest = cut < 0 ? '' : href.slice(cut);
    var m = path.match(/^(.*?)([^/]*)\.html$/i);
    if (!m || /-en$/i.test(m[2])) return href;
    return m[1] + (m[2] === 'index' ? 'index-en' : m[2] + '-en') + '.html' + rest;
  }

  /* Balises de partage et description : même traitement que le titre */
  var META_SELECTORS = [
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]'
  ];

  function translateMeta() {
    var d = dict();
    var t = document.title;
    if (lang === 'en') {
      var en = lookup(norm(t));
      if (en !== null && en !== t) { textOriginals.set('title', t); document.title = en; }
    } else if (textOriginals.has('title')) {
      document.title = textOriginals.get('title');
      textOriginals.delete('title');
    }

    META_SELECTORS.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      var cur = el.getAttribute('content') || '';
      if (lang === 'en') {
        var tr = lookup(norm(cur));
        if (tr !== null && tr !== cur) {
          if (!textOriginals.has(sel)) textOriginals.set(sel, cur);
          el.setAttribute('content', tr);
        }
      } else if (textOriginals.has(sel)) {
        el.setAttribute('content', textOriginals.get(sel));
        textOriginals.delete(sel);
      }
    });

    document.documentElement.setAttribute('lang', lang);
    var og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute('content', lang === 'en' ? 'en_US' : 'fr_CM');
  }

  /* Bouton segmenté FR / EN avec indicateur coulissant */
  function buildToggle(container) {
    var wrap = document.createElement('div');
    wrap.className = 'lang-toggle';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Langue / Language');
    wrap.innerHTML =
      '<span class="lang-toggle-thumb" aria-hidden="true"></span>' +
      '<button type="button" class="lang-opt" data-lang="fr" aria-pressed="true">FR</button>' +
      '<button type="button" class="lang-opt" data-lang="en" aria-pressed="false">EN</button>';
    container.appendChild(wrap);

    wrap.querySelectorAll('.lang-opt').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
    var enOpt = wrap.querySelector('[data-lang="en"]');
    enOpt.addEventListener('pointerenter', prefetchExtra);
    enOpt.addEventListener('focusin', prefetchExtra);
    return wrap;
  }

  function paintToggle() {
    document.querySelectorAll('.lang-toggle').forEach(function (w) {
      w.setAttribute('data-lang', lang);
      w.querySelectorAll('.lang-opt').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
      });
    });
  }

  function apply(announce) {
    sweep(document.body);
    translateMeta();
    paintToggle();
    if (announce) {
      document.documentElement.dispatchEvent(new CustomEvent('cadc:lang', { detail: { lang: lang } }));
    }
  }

  function setLang(next) {
    if (STATIC === 'en') {
      if (next !== 'en') {
        location.href = (location.pathname.split('/').pop() || 'index.html')
          .replace(/-en\.html$/, '.html') + location.search + location.hash;
      }
      return;
    }
    lang = next;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    if (next === 'en') {
      loadExtra(function () { apply(true); });
    } else {
      apply(true);
    }
  }

  function mount() {
    /* sur la home, le bouton prend place dans les actions de l'en-tête */
    var headerActions = document.querySelector('.header--actions');
    if (headerActions) buildToggle(headerActions);

    /* sur les pages autonomes, il accompagne la bascule de thème */
    var fab = document.getElementById('theme-fab');
    if (!headerActions && fab) {
      var holder = document.createElement('div');
      holder.className = 'lang-fab';
      document.body.appendChild(holder);
      buildToggle(holder);
    }

    document.documentElement.setAttribute('lang', lang);
    apply(false);
    if (lang === 'en' && (STATIC !== 'en' || NEEDS_DICT)) {
      /* Page anglaise statique : le dictionnaire rattrape le contenu injecté par JS */
      loadExtra(function () { apply(STATIC !== 'en'); });
    }

    /* contenu injecté après coup (cartes, modales, grilles) */
    var queued = [];
    var running = false;
    new MutationObserver(function (muts) {
      for (var k = 0; k < muts.length; k++) {
        var added = muts[k].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var nd = added[j];
          if (nd.nodeType === 1 && !SKIP[nd.tagName]) queued.push(nd);
          else if (nd.nodeType === 3 && nd.parentNode && !SKIP[nd.parentNode.tagName]) queued.push(nd.parentNode);
        }
      }
      if (!queued.length || running) return;
      running = true;
      requestAnimationFrame(function () {
        var batch = queued;
        queued = [];
        running = false;
        for (var b = 0; b < batch.length; b++) sweep(batch[b]);
        paintToggle();
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  window.cadcSetLang = setLang;
  window.cadcLang = function () { return lang; };
  window.cadcT = function (s) {
    if (lang !== 'en') return s;
    var en = lookup(s);
    return en === null ? s : en;
  };

  /* Visiteur déjà en anglais : le dictionnaire part tout de suite, sans attendre le DOM */
  if (lang === 'en') prefetchExtra();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
