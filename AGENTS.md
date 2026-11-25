# CODE AXIS — site officiel

Site statique (HTML/CSS/JS vanilla) déployé sur Vercel, repo GitHub `ChristianOUSSI/codeaxis`, domaine `codeaxis.cm` (+ `codeaxis.vercel.app`).

## Stack

- Pas de framework : fichiers `.html` à la racine, un seul endpoint `api/contact.js` (Vercel Serverless, envoi via Resend).
- CSS principal : `assets/css/cadc-fusion.css` (+ `mobile-pages.css` pour les sous-pages, `evo-suite.css`, `home-evo-news.css`).
- JS principal : `assets/js/cadc-app.js` (home 3D), `theme.js` (sous-pages), `whatsapp-fab.js`, `i18n*.js`, `pwa-*.js`.
- PWA : `sw.js` généré par `scripts/generate-sw-cache.js` (network-first HTML, stale-while-revalidate assets).

## Commandes

- `npm run build` — prébuild (`sw:gen` + `sitemap:dates`) puis minification des JS/CSS (**en place**, sources conservées en `*.src.*`).
- `npm run minify` — minifie `assets/js` et `assets/css` sans régénérer sw.js.
- `npm run sw:gen` — régénère les listes du service worker et bump `CACHE_NAME`.
- `npm run sitemap:dates` — met à jour les dates du sitemap.
- Servir en local : `python -m http.server 8642` (ou `npx serve`).

## Conventions

- Thème : `localStorage['cadc_theme']` = `night|day|evening`. Script anti-flash inline dans le `<head>` de chaque page — toute modif de thème doit rester synchronisée entre ce script, `cadc-app.js` et `theme.js`.
- Langue : `index-en.html` etc. ; toggle FR/EN via `i18n.js` / `i18n-en-*.js`.
- Pages sous-pages : styles inline dans chaque `<head>` ; `mobile-pages.css` est chargé **après** pour le responsive (ne pas dupliquer ses règles en inline).
- Images OG : `assets/img/og-*.jpg` 1200×630, une par page/projet, référencées en `og:image`/`twitter:image`.
- Ne pas committer de secrets ; variables Vercel : `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`.

## Vérification rapide

- `node --check` sur les JS modifiés.
- Le site étant statique, un `git push` sur `main` déclenche le déploiement Vercel automatiquement.
- Après un déploiement, penser au service worker : les utilisateurs peuvent voir l'ancienne version jusqu'à mise à jour du cache.

## Mobile — règles d'or (pattern établi)

- Chaque `.l-section` mobile (`.intro`, `.work`, `.about`, `.hire`, `.hn-block`)
  DOIT avoir `overflow-y:auto` + `justify-content:flex-start` puis
  `safe center` en fallback : jamais `center` seul avec overflow
  (le haut du contenu devient inaccessible — bug déjà corrigé 2×).
- `.hn-block` : les overrides mobile vont dans `home-evo-news.css`
  (chargé APRÈS `cadc-fusion.css` — cascade).
- Astronaute hero : `position:fixed` + `.l-section` transformé =
 Containing block = section plein écran, jamais rogné par `.intro`.
- Vérifier avec Chrome headless + iframe de mesure avant/après.
