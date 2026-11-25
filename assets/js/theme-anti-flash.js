/* Theme anti-flash — externe pour respecter la CSP (script-src 'self').
   À charger juste après la balise <body> : document.body existe déjà,
   le thème est posé avant le premier paint. */
(function () {
  var t = localStorage.getItem('cadc_theme');
  if (!t) {
    var h = new Date().getHours();
    t = h >= 6 && h < 17 ? 'day' : h >= 17 && h < 21 ? 'evening' : 'night';
  }
  if (t === 'day' || t === 'evening' || t === 'night') {
    document.body.className = 'theme-' + t;
  }
})();
