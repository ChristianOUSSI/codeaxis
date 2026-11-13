#!/usr/bin/env node
/**
 * scripts/add-theme-inline.js
 * Insère un script inline dans le <head> de toutes les pages HTML
 * pour appliquer le thème sauvegardé AVANT le premier rendu (évite le flash).
 *
 * Usage : node scripts/add-theme-inline.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Le script inline est volontairement minimaliste pour ne pas bloquer le rendu
const INLINE = `\n  <script>/* Theme anti-flash */(function(){var t=localStorage.getItem('cadc_theme');if(t==='day'||t==='evening'){document.documentElement.className=t;}})()</script>`;

// Chercher toutes les pages HTML à la racine
const files = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !f.startsWith('archive'));

let patched = 0;
files.forEach((f) => {
  const p = path.join(ROOT, f);
  let c = fs.readFileSync(p, 'utf8');

  // Ne pas ajouter deux fois
  if (c.includes('Theme anti-flash')) return;

  // Insérer juste avant la fermeture de </head>
  if (!c.includes('</head>')) return;
  c = c.replace('</head>', INLINE + '\n</head>');
  fs.writeFileSync(p, c, 'utf8');
  patched++;
  console.log('OK:', f);
});

console.log(`\n✓ ${patched} pages patchées.`);
