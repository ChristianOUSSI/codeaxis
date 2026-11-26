# CODE AXIS — site officiel

Site statique (HTML/CSS/JS vanilla) déployé sur Vercel, repo GitHub `ChristianOUSSI/codeaxis`, domaine public `codeaxis.vercel.app`. Le domaine `codeaxis.cm` n'est pas encore branché (DNS non configuré) ; l'email `contact@codeaxis.cm` reste le contact officiel.

## Stack

- Pas de framework : fichiers `.html` à la racine, un seul endpoint `api/contact.js` (Vercel Serverless, envoi via Resend).
- CSS principal : `assets/css/cadc-fusion.css` (+ `mobile-pages.css` pour les sous-pages, `evo-suite.css`, `home-evo-news.css`).
- JS principal : `assets/js/cadc-app.js` (home 3D), `theme.js` (sous-pages), `whatsapp-fab.js`, `i18n*.js`.
- Pas de PWA : `sw.js`, `manifest.json` et `pwa-*.js` ont été retirés ; `analytics.js` désenregistre l'ancien SW chez les visiteurs.

## Commandes

- `npm run build` — prébuild (`sitemap:dates`) puis minification des JS/CSS (**en place**, sources conservées en `*.src.*`).
- `npm run minify` — minifie `assets/js` et `assets/css`.
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

## Actualité (journal)

- Source unique : `assets/js/news-data.js` → `window.CADC_NEWS` (tableau `NEWS`, tri décroissant par date).
- Chaque article : `{ date: 'YYYY-MM-DD', tag, title, excerpt, image?, cta? {label, href}, body: [[sous-titre, paragraphe], …] }`.
  Tags autorisés : `Agence, Produit, Terrain, Technique, Partenariat` (filtres dans `news-page.js`).
- Consommateurs automatiques : `actualites.html` / `actualites-en.html` (cartes + modale + ancre `#date-slug`),
  bandeau « Dernières actualités » de la home (`cadc-app.js`, 6 premiers).
- **Traduction EN obligatoire** : ajouter chaque chaîne FR (titre, excerpt, sous-titres, paragraphes)
  dans `assets/js/i18n-en-pages.js` au format `FR|EN`. Le `MutationObserver` de `i18n.js`
  traduit le contenu injecté dynamiquement ; la `Map` est indexée par clé normalisée
  (apostrophes `’`/`'` et espaces ignorés) — ne pas dupliquer une clé existante.
