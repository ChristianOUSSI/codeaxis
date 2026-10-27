/**
 * CODE AXIS bibliothèque d'icônes
 * Remplace les émojis par des tracés SVG au trait, cohérents avec l'identité.
 * Usage: ico('rocket') renvoie une chaine <svg>…</svg> injectable.
 */
(function () {
  'use strict';

  var P = {
    star: '<path d="M12 3l2.2 6.1L20 11.3l-5.8 2.2L12 19.6l-2.2-6.1L4 11.3l5.8-2.2z"/>',
    bolt: '<path d="M13.5 2.5L5 13.2h5.1l-1 8.3 8.4-10.7h-5.1z"/>',
    arrow: '<path d="M4 12h14M13.5 6.5L19.5 12l-6 5.5"/>',
    arrowLeft: '<path d="M20 12H6M10.5 6.5L4.5 12l6 5.5"/>',
    arrowDown: '<path d="M12 4.5v14M6.5 13l5.5 6 5.5-6"/>',
    check: '<path d="M4.5 12.6l4.6 4.6L19.5 6.6"/>',
    checkCircle: '<circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.3l2.7 2.7 5-5.4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    rocket: '<path d="M13.6 3.4c3.3-1.1 6.9 2.5 5.9 5.9-.7 2.2-2.4 4.6-5.4 6.9l-3.4-3.4c2.3-3 4.7-4.7 6.9-5.4z"/><path d="M10.7 12.8l-3.6-.6-2.1 2.1 2.6.6M12.9 15.1l.6 3.6 2.1-2.1-.6-2.6"/><circle cx="15" cy="9.3" r="1.4"/>',
    wrench: '<path d="M14.5 6.5a3.9 3.9 0 105.2 5.2l-2.4-2.4 1.6-1.6 2.4 2.4A3.9 3.9 0 0014.5 6.5z"/><path d="M13.2 10.2L4.6 18.8a2 2 0 002.8 2.8l8.6-8.6"/>',
    clipboard: '<rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9.5 4.5V3h5v1.5M9 10h6M9 14h6M9 18h3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.1"/>',
    cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><rect x="10.4" y="10.4" width="3.2" height="3.2" rx=".6"/><path d="M10 7V4.4M14 7V4.4M10 19.6V17M14 19.6V17M7 10H4.4M7 14H4.4M19.6 10H17M19.6 14H17"/>',
    shield: '<path d="M12 3.2l7 2.6v5.4c0 4.3-2.9 7.8-7 9.6-4.1-1.8-7-5.3-7-9.6V5.8z"/><path d="M9 12l2.3 2.3L15.4 10"/>',
    bulb: '<path d="M9.4 17.4a6 6 0 115.2 0v1.7a1.4 1.4 0 01-1.4 1.4h-2.4a1.4 1.4 0 01-1.4-1.4z"/><path d="M9.8 17.4h4.4"/>',
    chart: '<path d="M4 20h16"/><path d="M6.5 20v-6M11 20V7M15.5 20v-9M20 20V4"/>',
    bars: '<path d="M4 20h16"/><rect x="6" y="11" width="3" height="6" rx=".6"/><rect x="11" y="6.5" width="3" height="10.5" rx=".6"/><rect x="16" y="9" width="3" height="8" rx=".6"/>',
    pill: '<rect x="4.2" y="10.2" width="15.6" height="7.6" rx="3.8" transform="rotate(-40 12 14)"/><path d="M9.4 10.6l4 4"/>',
    palette: '<path d="M12 3.6c4.9 0 8.8 3.5 8.8 7.7 0 2.6-2 4-4.2 4h-1.4c-1.2 0-2 .9-2 1.9 0 .5.2.9.4 1.3.2.4.3.7.3 1 0 .9-.8 1.5-1.9 1.5-4.9 0-8.9-4-8.9-8.9S7.1 3.6 12 3.6z"/><circle cx="8.4" cy="10.4" r="1.1"/><circle cx="12" cy="7.8" r="1.1"/><circle cx="15.6" cy="10" r="1.1"/>',
    cloud: '<path d="M7.4 18.5h9.8a3.9 3.9 0 00.5-7.8 6 6 0 00-11.5 1.4 3.2 3.2 0 001.2 6.4z"/>',
    receipt: '<path d="M6 3.5h12v17l-2.4-1.6-2.4 1.6-2.4-1.6-2.4 1.6z"/><path d="M9 8.4h6M9 12.4h6M9 16h3.5"/>',
    node: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.1"/>',
    truck: '<path d="M3.5 6.5h10v10h-10z"/><path d="M13.5 9.6h3.4l3.6 3.6v3.3h-7z"/><circle cx="7.4" cy="18.4" r="1.9"/><circle cx="16.6" cy="18.4" r="1.9"/>',
    link: '<path d="M10.4 13.6a3.6 3.6 0 005.1 0l2.9-2.9a3.6 3.6 0 10-5.1-5.1l-1.3 1.3"/><path d="M13.6 10.4a3.6 3.6 0 00-5.1 0l-2.9 2.9a3.6 3.6 0 005.1 5.1l1.3-1.3"/>',
    bell: '<path d="M8 17.4c0-1 .4-1.6 1.1-2.3.8-.9 1.1-1.9 1.1-3.6a2.8 2.8 0 015.6 0c0 1.7.3 2.7 1.1 3.6.7.7 1.1 1.3 1.1 2.3z"/><path d="M8.2 17.4h9.6M10.6 20.2h2.8"/>',
    lock: '<rect x="5.6" y="10.6" width="12.8" height="9.4" rx="2"/><path d="M8.6 10.6V8a3.4 3.4 0 016.8 0v2.6"/>',
    video: '<rect x="3.4" y="6.6" width="11.6" height="10.8" rx="2"/><path d="M15 11.2l5.6-3.2v8l-5.6-3.2z"/>',
    camera: '<path d="M4 8.6h3l1.4-2.2h6.8L16.6 8.6h3.4v10.2H4z"/><circle cx="12" cy="13.4" r="3.4"/>',
    mobile: '<rect x="7.4" y="3" width="9.2" height="18" rx="2"/><path d="M10.6 6.4h2.8M10.6 17.8h2.8"/>',
    phone: '<rect x="6.4" y="2.8" width="11.2" height="18.4" rx="2.2"/><path d="M10.4 5.4h3.2M12 18.4h.01"/>',
    antenna: '<circle cx="12" cy="12" r="2.4"/><path d="M7.8 7.8a6 6 0 000 8.4M16.2 16.2a6 6 0 000-8.4M5 5a9.9 9.9 0 000 14M19 19a9.9 9.9 0 000-14"/>',
    book: '<path d="M5 4.6h5.4c1.4 0 2.2.7 2.2 2v12.2c0-1-.7-1.6-2-1.6H5z"/><path d="M19 4.6h-5.4c-1.4 0-2.2.7-2.2 2v12.2c0-1 .7-1.6 2-1.6H19z"/>',
    pin: '<path d="M12 3.4c-3.5 0-6.2 2.6-6.2 6 0 4.4 6.2 11.2 6.2 11.2s6.2-6.8 6.2-11.2c0-3.4-2.7-6-6.2-6z"/><circle cx="12" cy="9.4" r="2.4"/>',
    laptop: '<rect x="4.4" y="5.4" width="15.2" height="10" rx="1.6"/><path d="M2.6 18.6h18.8"/>',
    card: '<rect x="3.4" y="6" width="17.2" height="12.4" rx="2.2"/><path d="M3.4 10.2h17.2M6.8 14.6h3.4"/>',
    heart: '<path d="M12 20s-7.6-4.6-7.6-9.6a4.2 4.2 0 017.6-2.6 4.2 4.2 0 017.6 2.6c0 5-7.6 9.6-7.6 9.6z"/>',
    pointer: '<path d="M8.4 4.6l9.4 8.2-4.4.8 2.2 4.4-2.2 1-2.2-4.4-2.8 3.4z"/>',
    container: '<path d="M4.6 9.6h14.8v6.8a2 2 0 01-2 2H6.6a2 2 0 01-2-2z"/><path d="M8.2 9.6V6.4M12 9.6V6.4M15.8 9.6V6.4M4.6 6.4h14.8"/>',
    database: '<ellipse cx="12" cy="6.4" rx="7.4" ry="3"/><path d="M4.6 6.4v11.2c0 1.7 3.3 3 7.4 3s7.4-1.3 7.4-3V6.4"/><path d="M4.6 12c0 1.7 3.3 3 7.4 3s7.4-1.3 7.4-3"/>',
    code: '<path d="M9 7.4L4.4 12 9 16.6M15 7.4L19.6 12 15 16.6"/>',
    bank: '<path d="M4 9.8L12 5l8 4.8M5.6 10.6v7.6M18.4 10.6v7.6M9.4 11.4v6.8M14.6 11.4v6.8M3.4 19.8h17.2"/>',
    hospital: '<rect x="5" y="4.6" width="14" height="16.4" rx="1.8"/><path d="M12 8.6v6M9 11.6h6"/><path d="M4 21h16"/>',
    building: '<path d="M4.6 20.6V6.4l7-3 7 3v14.2z"/><path d="M9 10.4h1.8M13.2 10.4H15M9 14h1.8M13.2 14H15M10.6 20.6v-3.2h2.8v3.2"/>',
    trophy: '<path d="M8 4.6h8v4.2a4 4 0 01-8 0z"/><path d="M8 6.2H5.4c0 2.6 1.2 4 3.2 4.4M16 6.2h2.6c0 2.6-1.2 4-3.2 4.4M12 12.8v3.6M8.6 20.4h6.8"/>',
    sprout: '<path d="M12 20.4v-7.2"/><path d="M12 13.2c0-3.4 2.4-5.8 5.8-5.8 0 3.4-2.4 5.8-5.8 5.8z"/><path d="M11.6 13.8C11.6 11 9.6 9 6.4 9c0 2.8 2 4.8 5.2 4.8z"/>',
    weather: '<circle cx="9.6" cy="9.6" r="3.2"/><path d="M9.6 4.2v1.4M9.6 13.6V15M4.2 9.6h1.4M13.6 9.6H15"/><path d="M11.4 18.6h6.2a2.8 2.8 0 000-5.6 4 4 0 00-7.4 1c-1 .5-1.6 1.5-1.6 2.6"/>',
    sparkles: '<path d="M9 4.6l1.5 4.1L14.6 10l-4.1 1.5L9 15.6 7.5 11.5 3.4 10l4.1-1.3z"/><path d="M16.6 13.4l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    atom: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(-60 12 12)"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3.6l1 2.5 2.7-.6 1 2.4 2.5 1-1.4 2.4 1.4 2.4-2.5 1-1 2.4-2.7-.6-1 2.5-1-2.5-2.7.6-1-2.4-2.5-1L5.7 12l-1.4-2.4 2.5-1 1-2.4 2.7.6z"/>',
    doc: '<path d="M6.4 3.6h7.2L18.6 8v12.4H6.4z"/><path d="M13.4 3.6V8h5M9.4 12.6h6M9.4 16.4h4"/>'
  };

  function ico(name, opts) {
    var body = P[name] || P.star;
    var o = opts || {};
    var size = o.size || 20;
    var cls = 'ico' + (o.cls ? ' ' + o.cls : '');
    var filled = (name === 'star' || name === 'bolt' || name === 'node' || name === 'heart' || name === 'pointer');
    var stroke = filled ? 'none' : 'currentColor';
    var fill = filled ? 'currentColor' : 'none';
    return '<svg class="' + cls + '" viewBox="0 0 24 24" width="' + size + '" height="' + size +
      '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (o.weight || 1.5) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  /* Substitution des émojis par les tracés SVG, y compris dans le contenu injecté après coup */
  var EMOJI = {
    '\u269B\uFE0F': 'atom', '\u269B': 'atom', '\uD83D\uDFE2': 'node', '\uD83D\uDCD8': 'book',
    '\u2601\uFE0F': 'cloud', '\u2601': 'cloud', '\uD83D\uDC33': 'container', '\uD83D\uDC0D': 'code',
    '\uD83E\uDD16': 'cpu', '\uD83D\uDD17': 'link', '\uD83D\uDC9A': 'heart', '\uD83D\uDC18': 'database',
    '\uD83D\uDEE1\uFE0F': 'shield', '\uD83D\uDEE1': 'shield', '\uD83D\uDCBB': 'laptop', '\uD83D\uDCF1': 'phone',
    '\uD83C\uDFA8': 'palette', '\uD83D\uDCC8': 'chart', '\uD83D\uDE80': 'rocket', '\uD83D\uDEE0\uFE0F': 'wrench',
    '\uD83D\uDEE0': 'wrench', '\uD83D\uDCCB': 'clipboard', '\uD83C\uDFAF': 'target', '\uD83D\uDCA1': 'bulb',
    '\uD83E\uDDFE': 'receipt', '\uD83D\uDCE6': 'container', '\uD83D\uDCE1': 'antenna', '\uD83D\uDD14': 'bell',
    '\uD83D\uDD10': 'lock', '\uD83D\uDCF9': 'video', '\uD83D\uDCF8': 'camera', '\uD83D\uDCF2': 'mobile',
    '\uD83D\uDCCD': 'pin', '\uD83D\uDCCA': 'bars', '\uD83D\uDCB3': 'card', '\uD83D\uDC46': 'pointer',
    '\uD83C\uDFE6': 'bank', '\uD83C\uDFE5': 'hospital', '\uD83C\uDFD7\uFE0F': 'building', '\uD83C\uDFD7': 'building',
    '\uD83C\uDFC6': 'trophy', '\uD83C\uDF31': 'sprout', '\uD83C\uDF24\uFE0F': 'weather', '\uD83C\uDF24': 'weather',
    '\u2728': 'sparkles', '\u2699\uFE0F': 'gear', '\u2699': 'gear', '\uD83D\uDC8A': 'pill', '\u2705': 'checkCircle',
    '\u2726': 'star', '\u2B50': 'star', '\u26A1': 'bolt', '\u2794': 'arrow', '\u2713': 'check',
    '\u2715': 'close', '\u2717': 'close', '\uD83D\uDCC4': 'doc', '\uD83D\uDDBC\uFE0F': 'doc', '\uD83D\uDDA5\uFE0F': 'laptop'
  };

  var SKIP = { TITLE: 1, STYLE: 1, SCRIPT: 1, NOSCRIPT: 1, TEXTAREA: 1, OPTION: 1, SELECT: 1 };
  var RX = /[\u2600-\u27BF\u2B50\uFE0F]|[\uD83C-\uDB7F][\uDC00-\uDFFF]/;

  function toHtml(txt) {
    var out = '';
    var changed = false;
    var i = 0;
    while (i < txt.length) {
      var code = txt.charCodeAt(i);
      var isHigh = code >= 0xD83C && code <= 0xDB7F;
      var chunk = isHigh ? txt.substr(i, 2) : txt.charAt(i);
      var key = EMOJI[chunk] || EMOJI[chunk + '\uFE0F'];
      if (key) {
        out += ico(key, { size: 15 });
        i += chunk.length;
        if (txt.charCodeAt(i) === 0xFE0F) i += 1;
        changed = true;
      } else {
        out += chunk;
        i += chunk.length;
      }
    }
    return changed ? out : null;
  }

  function sweep(root) {
    if (!root || !document.createTreeWalker) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var targets = [];
    var n;
    while ((n = walker.nextNode())) {
      var parent = n.parentNode;
      if (!parent || SKIP[parent.tagName]) continue;
      if (RX.test(n.nodeValue)) targets.push(n);
    }
    targets.forEach(function (node) {
      var html = toHtml(node.nodeValue);
      if (html === null) return;
      var tmp = document.createElement('template');
      tmp.innerHTML = html;
      node.parentNode.replaceChild(tmp.content, node);
    });
  }

  function boot() {
    sweep(document.body);
    var queued = [];
    var running = false;
    new MutationObserver(function (muts) {
      for (var k = 0; k < muts.length; k++) {
        var added = muts[k].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var nd = added[j];
          if (nd.nodeType === 1 && !SKIP[nd.tagName]) queued.push(nd);
          else if (nd.nodeType === 3 && nd.parentNode && !SKIP[nd.parentNode.tagName]) queued.push(nd.parentNode);
        }
      }
      if (!queued.length || running) return;
      running = true;
      requestAnimationFrame(function () {
        var batch = queued;
        queued = [];
        running = false;
        for (var b = 0; b < batch.length; b++) sweep(batch[b]);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.CADC_ICONS = P;
  window.ico = ico;
  window.icoSweep = sweep;
})();
