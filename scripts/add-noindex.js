#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const FILES = [
  'christian-oussi.html', 'christian-oussi-en.html',
  'marc-laurent.html',    'marc-laurent-en.html',
  'sarah-martin.html',    'sarah-martin-en.html',
  'axel-dupont.html',     'axel-dupont-en.html',
  'projet-agrismart.html',      'projet-agrismart-en.html',
  'projet-finsecure.html',      'projet-finsecure-en.html',
  'projet-healthportal.html',   'projet-healthportal-en.html',
  'projet-smartlogistics.html', 'projet-smartlogistics-en.html',
];

const TAG = '  <meta name="robots" content="noindex, nofollow">';

FILES.forEach((f) => {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { console.log('ABSENT:', f); return; }
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes('name="robots"')) { console.log('SKIP (déjà présent):', f); return; }
  // Insérer juste après la première balise <meta charset …>
  c = c.replace(/(<meta charset[^>]+>)/, '$1\n' + TAG);
  fs.writeFileSync(p, c, 'utf8');
  console.log('OK:', f);
});
