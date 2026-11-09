/* Génère les pages anglaises statiques (foo-en.html) depuis les pages françaises
   et les dictionnaires i18n-en-core.js / i18n-en-pages.js. */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://codeaxis.cm/';
const PAGES = [
  'index.html', 'suite-evo.html', 'actualites.html', 'strategie.html',
  'developpement.html', 'design.html', 'youth-partnership.html',
  'confidentialite.html', 'nos-clients.html', 'nos-projets.html',
  'nos-contrats.html', 'nos-realisations.html', 'projet-agrismart.html',
  'projet-finsecure.html', 'projet-healthportal.html',
  'projet-smartlogistics.html', 'realisation-fintech.html',
  'realisation-logistique.html', 'realisation-marketplace.html',
  'christian-oussi.html', 'marc-laurent.html', 'sarah-martin.html',
  'axel-dupont.html', 'mentions-legales.html'
];
const PAGE_SET = new Set(PAGES);
const DICT_PAGES = new Set(['index.html', 'suite-evo.html', 'actualites.html']);
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);
const VOID = new Set(['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR']);
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];

function norm(s) {
  return String(s)
    .replace(/\u00a0/g, ' ')
    .replace(/[\u2019\u02BC\u2018]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarks(s) {
  return norm(s)
    .replace(/^[★✦✧⚡🚀📋🎯💡✅✨⚙]+\s*/u, '')
    .replace(/\s*[➔→]+\s*$/u, '')
    .trim();
}

function decodeEscapes(s) {
  return s.replace(/%7C/g, '|');
}

function loadDict(file) {
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf('`');
  const end = src.lastIndexOf('`');
  const raw = src.slice(start + 1, end);
  const map = new Map();
  raw.split('\n').forEach((line) => {
    const cut = line.indexOf('|');
    if (cut < 1) return;
    const fr = norm(decodeEscapes(line.slice(0, cut)));
    const en = decodeEscapes(line.slice(cut + 1)).trim();
    if (fr && en) map.set(fr, en);
  });
  return map;
}

const DICT = new Map();
[loadDict(path.join(ROOT, 'assets/js/i18n-en-core.js')),
 loadDict(path.join(ROOT, 'assets/js/i18n-en-pages.js'))].forEach((m) => {
  for (const [k, v] of m) DICT.set(k, v);
});

function lookup(fr) {
  const key = norm(fr);
  if (DICT.has(key)) return DICT.get(key);
  const bare = stripMarks(key);
  return DICT.has(bare) ? DICT.get(bare) : null;
}

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
  laquo: '«', raquo: '»', hellip: '…', mdash: '—', ndash: '–',
  rsquo: '\u2019', lsquo: '\u2018', ldquo: '\u201c', rdquo: '\u201d',
  eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', ocirc: 'ô',
  icirc: 'î', ucirc: 'û', ecirc: 'ê', aacute: 'á', uacute: 'ú',
  ograve: 'ò', ugrave: 'ù', times: '×', deg: '°'
};

function decodeEntities(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, e) => {
    if (e[0] === '#') {
      const hex = e[1] === 'x' || e[1] === 'X';
      const code = parseInt(e.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED[e] !== undefined ? NAMED[e] : m;
  });
}

function escText(s) {
  return String(s)
    .replace(/&(?!#x?[0-9a-fA-F]+;|[a-zA-Z]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(s) {
  return escText(s).replace(/"/g, '&quot;');
}

function enName(file) {
  return file === 'index.html' ? 'index-en.html' : file.replace(/\.html$/, '-en.html');
}

function enUrl(url) {
  if (url === ORIGIN) return ORIGIN + 'index-en.html';
  const m = url.match(/^https:\/\/codeaxis\.cm\/([^?#]+\.html)([?#].*)?$/);
  if (!m || !PAGE_SET.has(m[1])) return url;
  return ORIGIN + enName(m[1]) + (m[2] || '');
}

function enHref(value) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) return value;
  const cut = value.search(/[?#]/);
  const pathPart = cut < 0 ? value : value.slice(0, cut);
  const rest = cut < 0 ? '' : value.slice(cut);
  const m = pathPart.match(/^(.*?)([^/]*\.html)$/);
  if (!m || !PAGE_SET.has(m[2])) return value;
  return m[1] + enName(m[2]) + rest;
}

function translatePrefill(value) {
  return value.replace(/([?&](?:text|subject)=)([^&#"]*)/g, (whole, prefix, encoded) => {
    let decoded;
    try { decoded = decodeURIComponent(encoded); } catch (e) { return whole; }
    const tr = lookup(decoded);
    return tr === null ? whole : prefix + encodeURIComponent(tr);
  });
}

function translateJsonLd(tag) {
  const open = tag.match(/^<script([^>]*)>/i);
  const body = tag.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
  let data;
  try { data = JSON.parse(body); } catch (e) { return tag; }

  function walk(value, key) {
    if (typeof value === 'string') {
      if (key === 'inLanguage') return 'en';
      let next = value;
      if (/^https:\/\/codeaxis\.cm\/[^?#]+\.html/.test(next)) next = enUrl(next);
      if (!/^(?:https?:|mailto:|tel:)/.test(next) && !/^[a-z]{2}(-[A-Za-z]{2,})?$/.test(next)) {
        const tr = lookup(next);
        if (tr !== null) next = tr;
      }
      return next;
    }
    if (Array.isArray(value)) return value.map((v) => walk(v, key));
    if (value && typeof value === 'object') {
      for (const k of Object.keys(value)) {
        if (k === '@context' || k === '@type') continue;
        value[k] = walk(value[k], k);
      }
      return value;
    }
    return value;
  }

  return '<script' + open[1] + '>\n' + JSON.stringify(walk(data, ''), null, 2) + '\n</script>';
}

function translateAttribute(name, value) {
  if (!value) return value;
  const key = name.toLowerCase();
  if (key === 'lang') return 'en';
  if (ATTRS.includes(key)) {
    const tr = lookup(decodeEntities(value));
    return tr !== null ? tr : value;
  }
  if (key === 'href') return enHref(value);
  return value;
}

function processTag(tag, page) {
  const nameMatch = tag.match(/^<\s*\/?\s*([a-zA-Z0-9:-]+)/);
  if (!nameMatch) return { tag, closeName: null, openName: null };
  const name = nameMatch[1].toUpperCase();
  const closing = /^<\s*\//.test(tag);

  if (closing) return { tag, closeName: name, openName: null };

  const attrs = {};
  tag.replace(/([a-zA-Z_:][-\w:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g, (m, attr, q, dq, sq) => {
    attrs[attr.toLowerCase()] = dq !== undefined ? dq : sq;
    return m;
  });

  let out = tag.replace(/([a-zA-Z_:][-\w:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g, (m, attr, q, dq, sq) => {
    let value = dq !== undefined ? dq : sq;
    const key = attr.toLowerCase();

    if (key === 'content') {
      const isMeta = name === 'META';
      const kind = (attrs.name || attrs.property || attrs['http-equiv'] || '').toLowerCase();
      if (isMeta && (kind === 'description' || kind === 'og:title' ||
        kind === 'og:description' || kind === 'twitter:title' || kind === 'twitter:description')) {
        const tr = lookup(decodeEntities(value));
        if (tr !== null) value = tr;
      } else if (isMeta && (attrs.property || '').toLowerCase() === 'og:locale') {
        value = 'en_US';
      } else if (isMeta && (attrs.property || '').toLowerCase() === 'og:url') {
        value = enUrl(value);
      }
    } else if (key === 'href' && (name === 'LINK' || name === 'A')) {
      const rel = (attrs.rel || '').toLowerCase();
      if (name === 'LINK' && rel === 'canonical') value = enUrl(value);
      else value = translatePrefill(enHref(value));
    } else {
      value = translateAttribute(key, value);
    }
    return attr + '="' + escAttr(value) + '"';
  });

  if (name === 'HTML') {
    if (!/data-static-lang=/.test(out)) out = out.replace(/>$/, ' data-static-lang="en">');
    /* Pages dont le contenu est injecté par JS : le dictionnaire reste nécessaire au chargement */
    if (DICT_PAGES.has(page) && !/data-static-dict=/.test(out)) {
      out = out.replace(/>$/, ' data-static-dict="en">');
    }
  }

  return { tag: out, closeName: null, openName: name };
}

function processText(raw, stack) {
  if (!raw.trim()) return raw;
  if (stack.some((t) => SKIP.has(t))) return raw;
  const decoded = decodeEntities(raw);
  const key = norm(decoded);
  if (key.length < 2) return raw;
  const tr = lookup(key);
  if (tr === null) {
    if (key.length > 3 && /[a-zA-ZÀ-ÿ]/.test(key)) MISSES.push(key);
    return raw;
  }
  const lead = raw.match(/^\s*/)[0];
  const tail = raw.match(/\s*$/)[0];
  return lead + escText(tr) + tail;
}

const MISSES = [];

function buildPage(page) {
  const src = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const re = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<[^>]+>|[^<]+/gi;
  const stack = [];
  let output = '';
  let m;

  while ((m = re.exec(src)) !== null) {
    const token = m[0];

    if (token.startsWith('<!--')) {
      output += token;
      continue;
    }

    if (/^<(script|style)\b/i.test(token)) {
      if (/^<script[^>]*type\s*=\s*["']application\/ld\+json["']/i.test(token)) {
        output += translateJsonLd(token);
      } else {
        output += token;
      }
      continue;
    }

    if (token.startsWith('<')) {
      const res = processTag(token, page);
      output += res.tag;
      if (res.closeName) {
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i] === res.closeName) { stack.splice(i, 1); break; }
        }
      } else if (res.openName && !VOID.has(res.openName) && !/\/>\s*$/.test(token)) {
        stack.push(res.openName);
      }
      continue;
    }

    output += processText(token, stack);
  }

  fs.writeFileSync(path.join(ROOT, enName(page)), output, 'utf8');
  return output;
}

function insertAlternates(html, page) {
  const fr = page === 'index.html' ? ORIGIN : ORIGIN + page;
  const en = ORIGIN + enName(page);
  const block = '  <link rel="alternate" hreflang="fr" href="' + fr + '">\n' +
    '  <link rel="alternate" hreflang="en" href="' + en + '">\n' +
    '  <link rel="alternate" hreflang="x-default" href="' + fr + '">\n';
  if (/hreflang="en"/.test(html)) return html;
  if (html.includes('</head>')) return html.replace('</head>', block + '</head>');
  return html;
}

const report = [];
for (const page of PAGES) {
  const before = MISSES.length;
  let html = buildPage(page);
  html = insertAlternates(html, page);
  fs.writeFileSync(path.join(ROOT, enName(page)), html, 'utf8');
  const frHtml = fs.readFileSync(path.join(ROOT, page), 'utf8');
  fs.writeFileSync(path.join(ROOT, page), insertAlternates(frHtml, page), 'utf8');
  const misses = MISSES.slice(before);
  report.push(page + ' : ' + misses.length + ' chaînes sans traduction');
  misses.forEach((s) => report.push('  - ' + s));
}

fs.writeFileSync(path.join(ROOT, 'en-build-report.txt'), report.join('\n') + '\n', 'utf8');
console.log(report.join('\n'));
