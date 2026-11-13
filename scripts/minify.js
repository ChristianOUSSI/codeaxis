#!/usr/bin/env node
/**
 * scripts/minify.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Minification simple sans dépendance externe.
 * Réduit les commentaires multi-lignes, les espaces superflus et les lignes
 * vides dans les fichiers JS et CSS.
 *
 * Usage :  node scripts/minify.js              (tous les assets)
 *          node scripts/minify.js assets/js/cadc-app.js
 *
 * Les fichiers originaux sont conservés sous <name>.src.js / <name>.src.css.
 * Pour une vraie minification de production, utiliser esbuild (npm i -g esbuild)
 * puis : esbuild assets/js/*.js --bundle=false --minify --outdir=dist/js
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// JS à minifier (hors pwa-register.js / analytics.js déjà courts)
const JS_FILES = [
  'assets/js/cadc-app.js',
  'assets/js/whatsapp-fab.js',
  'assets/js/contact-form.js',
  'assets/js/theme.js',
  'assets/js/splash.js',
  'assets/js/pwa-install.js',
  'assets/js/evo-suite.js',
  'assets/js/news-data.js',
  'assets/js/stack-data.js',
];

const CSS_FILES = [
  'assets/css/cadc-fusion.css',
  'assets/css/home-evo-news.css',
  'assets/css/evo-suite.css',
];

function minifyJS(src) {
  return src
    // Supprimer commentaires multi-lignes /* ... */ (non-greedy)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Supprimer commentaires single-line //  (attention aux URLs)
    .replace(/(?<!['":/])\/\/(?!\/)[^\n]*/g, '')
    // Supprimer lignes vides multiples
    .replace(/\n{3,}/g, '\n\n')
    // Supprimer espaces en début/fin de ligne
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    .trim();
}

function minifyCSS(src) {
  return src
    // Supprimer commentaires /* ... */
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Supprimer lignes vides multiples
    .replace(/\n{3,}/g, '\n\n')
    // Supprimer espaces en début/fin de ligne
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    // Supprimer espace autour de : { } , ; (sauf dans les chaînes — approche simple)
    .replace(/[ \t]*([{};,>+~])[ \t]*/g, '$1')
    .replace(/[ \t]*:[ \t]*/g, ':')
    .trim();
}

const targets = process.argv.slice(2);
const jsTargets  = targets.length ? targets.filter((f) => f.endsWith('.js'))  : JS_FILES;
const cssTargets = targets.length ? targets.filter((f) => f.endsWith('.css')) : CSS_FILES;

let saved = 0;

function process_file(relPath, minFn) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) { console.warn('⚠  Fichier introuvable :', relPath); return; }

  const original = fs.readFileSync(full, 'utf8');
  const minified = minFn(original);
  const delta = original.length - minified.length;
  saved += delta;

  // Sauvegarde de la source
  const srcPath = full.replace(/\.(js|css)$/, '.src.$1');
  if (!fs.existsSync(srcPath)) fs.writeFileSync(srcPath, original, 'utf8');

  fs.writeFileSync(full, minified, 'utf8');
  const pct = ((delta / original.length) * 100).toFixed(1);
  console.log(`✓ ${relPath.padEnd(45)} ${(original.length / 1024).toFixed(1).padStart(6)} KB → ${(minified.length / 1024).toFixed(1).padStart(6)} KB  (−${pct}%)`);
}

jsTargets.forEach((f)  => process_file(f, minifyJS));
cssTargets.forEach((f) => process_file(f, minifyCSS));

console.log(`\n✓ Total économisé : ${(saved / 1024).toFixed(1)} KB`);
console.log('  Sources originales conservées sous *.src.js / *.src.css');
console.log('\n  Conseil prod : npm i -g esbuild && esbuild assets/js/*.js --minify --outdir=dist/js');
