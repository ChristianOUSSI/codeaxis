// Génère sitemap.xml : URLs FR + EN, hreflang et lastmod issus de git.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://codeaxis.cm/';

const PAGES = [
  ['index', 1.0],
  ['suite-evo', 0.8],
  ['actualites', 0.8],
  ['strategie', 0.7],
  ['developpement', 0.7],
  ['design', 0.7],
  ['youth-partnership', 0.7],
  ['confidentialite', 0.3],
  ['nos-clients', 0.7],
  ['nos-projets', 0.7],
  ['nos-contrats', 0.6],
  ['nos-realisations', 0.7],
  ['projet-agrismart', 0.5],
  ['projet-finsecure', 0.5],
  ['projet-healthportal', 0.5],
  ['projet-smartlogistics', 0.5],
  ['realisation-fintech', 0.5],
  ['realisation-logistique', 0.5],
  ['realisation-marketplace', 0.5],
  ['christian-oussi', 0.4],
  ['marc-laurent', 0.4],
  ['sarah-martin', 0.4],
  ['axel-dupont', 0.4],
  ['mentions-legales', 0.3]
];

function enName(slug) {
  return slug === 'index' ? 'index-en.html' : slug + '-en.html';
}

function lastmod(file) {
  let gitDate = '';
  try {
    gitDate = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch (e) {}
  let fileDate = '';
  try {
    fileDate = new Date(fs.statSync(path.join(ROOT, file)).mtime).toISOString().slice(0, 10);
  } catch (e) {}
  return gitDate > fileDate ? gitDate : fileDate;
}

const esc = (s) => s.replace(/&/g, '&amp;');

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
];

for (const [slug, priority] of PAGES) {
  const frFile = slug === 'index' ? 'index.html' : slug + '.html';
  const frLoc = slug === 'index' ? SITE : SITE + frFile;
  const enFile = enName(slug);
  const enLoc = SITE + enFile;
  for (const variant of [{ file: frFile, loc: frLoc }, { file: enFile, loc: enLoc }]) {
    if (!fs.existsSync(path.join(ROOT, variant.file))) throw new Error('Page absente : ' + variant.file);
    lines.push('  <url>');
    lines.push('    <loc>' + esc(variant.loc) + '</loc>');
    lines.push('    <lastmod>' + lastmod(variant.file) + '</lastmod>');
    lines.push('    <priority>' + priority.toFixed(1) + '</priority>');
    lines.push('    <xhtml:link rel="alternate" hreflang="fr" href="' + esc(frLoc) + '"/>');
    lines.push('    <xhtml:link rel="alternate" hreflang="en" href="' + esc(enLoc) + '"/>');
    lines.push('    <xhtml:link rel="alternate" hreflang="x-default" href="' + esc(frLoc) + '"/>');
    lines.push('  </url>');
  }
}

lines.push('</urlset>');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), lines.join('\n') + '\n', 'utf8');
console.log('sitemap.xml : ' + PAGES.length * 2 + ' URLs');
