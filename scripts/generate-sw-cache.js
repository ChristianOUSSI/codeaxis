#!/usr/bin/env node
/**
 * scripts/generate-sw-cache.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Génère automatiquement les deux listes d'assets dans sw.js :
 *   - HTML_PAGES  : tous les *.html à la racine du projet
 *   - STATIC_ASSETS : JS, CSS, images clés
 *
 * Usage :  node scripts/generate-sw-cache.js
 *
 * Le script lit sw.js, remplace le contenu entre les marqueurs BEGIN/END,
 * et met à jour le numéro de version du cache.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT   = path.resolve(__dirname, '..');
const SW_PATH = path.join(ROOT, 'sw.js');

// ── 1. Lister toutes les pages HTML à la racine ──────────────────────────────
const EXCLUDED_HTML = new Set(['home.html']); // pages de transition / alias

const htmlPages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !EXCLUDED_HTML.has(f))
  .sort()
  .map((f) => `./${f}`);

// ── 2. Lister les assets statiques (JS, CSS, images) ─────────────────────────
function scanDir(dir, exts, maxDepth = 3) {
  const results = [];
  function walk(current, depth) {
    if (depth > maxDepth) return;
    let entries;
    try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        walk(full, depth + 1);
      } else if (exts.includes(path.extname(e.name).toLowerCase())) {
        results.push('./' + path.relative(ROOT, full).replace(/\\/g, '/'));
      }
    }
  }
  walk(dir, 0);
  return results.sort();
}

// Ne prend que les images "connues" (pas toutes les webp du dossier evo qui sont beaucoup)
const STATIC_ASSETS = [
  ...scanDir(path.join(ROOT, 'assets/css'), ['.css']),
  ...scanDir(path.join(ROOT, 'assets/js'),  ['.js']),
  './manifest.json',
  // images essentielles (logo, hero, about, partenaires, 7 evo featured)
  './assets/img/favicon-64.png',
  './assets/img/logo-mark.webp',
  './assets/img/logo-cadc.webp',
  './assets/img/introduction-visual.webp',
  './assets/img/about-visual.webp',
  './assets/img/about-winners.webp',
  './assets/img/about-philosophy.webp',
  './assets/img/about-history.webp',
  './assets/img/partenaires/mboa-bio-237.webp',
  './assets/img/partenaires/frost-co-group.webp',
  './assets/img/evo/evo-gaz.webp',
  './assets/img/evo/evo-clinic.webp',
  './assets/img/evo/evo-shop.webp',
  './assets/img/evo/evo-log.webp',
  './assets/img/evo/evo-hotel.webp',
  './assets/img/evo/evo-market.webp',
  './assets/img/evo/evo-tontaine.webp',
].filter((v, i, a) => a.indexOf(v) === i).sort();

// ── 3. Lire sw.js, injecter les listes, bumper la version ────────────────────
let swContent = fs.readFileSync(SW_PATH, 'utf8');

// Bump de version : cadc-pwa-vN  →  cadc-pwa-v(N+1)
swContent = swContent.replace(
  /(const CACHE_NAME\s*=\s*'cadc-pwa-v)(\d+)(')/,
  (_, pre, num, post) => pre + (parseInt(num, 10) + 1) + post
);

// Remplacer la liste HTML_PAGES
const htmlList = htmlPages.map((p) => `  '${p}',`).join('\n');
swContent = swContent.replace(
  /(\/\/ HTML_PAGES:BEGIN\n)([\s\S]*?)(\/\/ HTML_PAGES:END)/,
  `// HTML_PAGES:BEGIN\n${htmlList}\n// HTML_PAGES:END`
);

// Remplacer la liste STATIC_ASSETS
const staticList = STATIC_ASSETS.map((p) => `  '${p}',`).join('\n');
swContent = swContent.replace(
  /(\/\/ STATIC_ASSETS:BEGIN\n)([\s\S]*?)(\/\/ STATIC_ASSETS:END)/,
  `// STATIC_ASSETS:BEGIN\n${staticList}\n// STATIC_ASSETS:END`
);

fs.writeFileSync(SW_PATH, swContent, 'utf8');

// Lire la version finale depuis le fichier modifié
const versionMatch = fs.readFileSync(SW_PATH, 'utf8').match(/cadc-pwa-v(\d+)/);
const finalVersion = versionMatch ? `v${versionMatch[1]}` : '?';
console.log(`✓ sw.js mis à jour — ${htmlPages.length} pages HTML, ${STATIC_ASSETS.length} assets statiques, cache ${finalVersion}`);
