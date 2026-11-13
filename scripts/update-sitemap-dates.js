#!/usr/bin/env node
/**
 * scripts/update-sitemap-dates.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Met à jour les dates <lastmod> dans sitemap.xml en fonction de la date réelle
 * de modification de chaque fichier HTML correspondant.
 * Les pages sans fichier HTML (entrées externes) gardent leur date existante.
 *
 * Usage : node scripts/update-sitemap-dates.js
 *         (ou automatiquement via npm run prebuild)
 * ─────────────────────────────────────────────────────────────────────────────
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');

let xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// Pour chaque <loc>…</loc> dans le sitemap, on calcule la date de modif du fichier
xml = xml.replace(
  /(<loc>https:\/\/codeaxis\.cm\/([^<]*)<\/loc>\s*\n\s*<lastmod>)[^<]*/g,
  (match, prefix, urlPath) => {
    // Convertir l'URL en chemin de fichier local
    let filePath = urlPath === '' || urlPath === '/'
      ? 'index.html'
      : urlPath;

    const full = path.join(ROOT, filePath);
    if (fs.existsSync(full)) {
      const mtime = fs.statSync(full).mtime;
      const dateStr = mtime.toISOString().slice(0, 10);
      return prefix + dateStr;
    }
    // Fichier non trouvé → date du jour
    return prefix + today;
  }
);

fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
console.log('✓ sitemap.xml mis à jour avec les dates réelles de modification');
