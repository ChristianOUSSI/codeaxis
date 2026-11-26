/* Accessibilité avancée — audit WCAG et contrastes automatiques
   Améliore les contrastes pour respecter WCAG AA (4.5:1 pour texte normal) */
(function () {
  // Fonction pour calculer le contraste entre deux couleurs
  function getContrastRatio(color1, color2) {
    var lum1 = getLuminance(color1);
    var lum2 = getLuminance(color2);
    var lighter = Math.max(lum1, lum2);
    var darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function getLuminance(color) {
    var rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0;
    var r = parseInt(rgb[0]) / 255;
    var g = parseInt(rgb[1]) / 255;
    var b = parseInt(rgb[2]) / 255;
    var a = [r, g, b].map(function (c) {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  // Vérifier et ajuster les contrastes des textes
  function checkContrast() {
    var texts = document.querySelectorAll('p, span, a, h1, h2, h3, h4, h5, h6, li, td, th, label, button');
    texts.forEach(function (el) {
      var style = window.getComputedStyle(el);
      var color = style.color;
      var bgColor = style.backgroundColor;

      // Si fond transparent, utiliser le fond du parent
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        var parent = el.parentElement;
        while (parent && (parent.style.backgroundColor === 'rgba(0, 0, 0, 0)' || parent.style.backgroundColor === 'transparent')) {
          parent = parent.parentElement;
        }
        if (parent) {
          bgColor = window.getComputedStyle(parent).backgroundColor;
        }
      }

      // Si toujours transparent, utiliser le fond du body
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        bgColor = window.getComputedStyle(document.body).backgroundColor;
      }

      // Calculer le contraste
      var ratio = getContrastRatio(color, bgColor);

      // WCAG AA : 4.5:1 pour texte normal, 3:1 pour texte large
      var isLargeText = parseFloat(style.fontSize) >= 18 || (parseFloat(style.fontSize) >= 14 && parseInt(style.fontWeight) >= 700);
      var minRatio = isLargeText ? 3 : 4.5;

      // Si contraste insuffisant, ajuster la couleur
      if (ratio < minRatio) {
        // Essayer d'éclaircir ou assombrir la couleur
        var rgb = color.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          var r = parseInt(rgb[0]);
          var g = parseInt(rgb[1]);
          var b = parseInt(rgb[2]);

          // Déterminer si le fond est clair ou sombre
          var bgLum = getLuminance(bgColor);
          var isLightBg = bgLum > 0.5;

          // Ajuster la couleur pour améliorer le contraste
          if (isLightBg) {
            // Fond clair : assombrir le texte
            r = Math.max(0, r - 30);
            g = Math.max(0, g - 30);
            b = Math.max(0, b - 30);
          } else {
            // Fond sombre : éclaircir le texte
            r = Math.min(255, r + 40);
            g = Math.min(255, g + 40);
            b = Math.min(255, b + 40);
          }

          el.style.color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
          el.setAttribute('data-contrast-fixed', 'true');
        }
      }
    });
  }

  // Exécuter au chargement et après les changements de thème
  checkContrast();
  window.addEventListener('load', checkContrast);
  document.addEventListener('cadc:lang', checkContrast);
  document.addEventListener('themechange', checkContrast);
})();
