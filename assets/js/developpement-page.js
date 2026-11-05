/**
 * Page Développement : rend la pile technique officielle (stack-data.js),
 * la même que les hexagones de la home.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var host = document.getElementById('devStack');
    if (!host || !window.CADC_STACK) return;

    host.innerHTML = '';
    window.CADC_STACK_CATEGORIES.forEach(function (cat) {
      var items = window.CADC_STACK.filter(function (s) { return s.category === cat.key; });
      if (!items.length) return;

      var group = document.createElement('div');
      group.className = 'stack-group';

      var label = document.createElement('h3');
      label.textContent = cat.label;
      group.appendChild(label);

      var pills = document.createElement('div');
      pills.className = 'stack-pills';
      items.forEach(function (s) {
        var pill = document.createElement('span');
        pill.className = 'stack-pill';
        pill.innerHTML = ico(s.icon, { size: 15 }) + '<span>' + s.name + '</span>';
        pills.appendChild(pill);
      });
      group.appendChild(pills);
      host.appendChild(group);
    });
  });
})();
