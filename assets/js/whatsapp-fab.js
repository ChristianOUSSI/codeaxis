(function () {
'use strict';

var NUMBER = '237691223916';

var MSG = {
fr: {
default: 'Bonjour CODE AXIS, je vous contacte depuis votre site.',
work:    'Bonjour CODE AXIS, je souhaite échanger sur vos services et votre pile technique.',
about:   'Bonjour CODE AXIS, j’ai découvert vos réalisations et j’aimerais en discuter.',
evo:     'Bonjour CODE AXIS, la Suite evo m’intéresse : pouvez-vous me présenter les produits ?',
news:    'Bonjour CODE AXIS, j’ai lu votre actualité et j’aimerais en parler.',
contact: 'Bonjour CODE AXIS, je souhaite un devis pour mon projet.',
hire:    'Bonjour CODE AXIS, je souhaite un devis pour mon projet.'
},
en: {
default: 'Hello CODE AXIS, I am contacting you from your website.',
work:    'Hello CODE AXIS, I would like to discuss your services and tech stack.',
about:   'Hello CODE AXIS, I discovered your work and would like to talk about it.',
evo:     'Hello CODE AXIS, the evo Suite interests me: could you present the products?',
news:    'Hello CODE AXIS, I read your news and would like to discuss it.',
contact: 'Hello CODE AXIS, I would like a quote for my project.',
hire:    'Hello CODE AXIS, I would like a quote for my project.'
}
};
var LABEL = {
fr: 'Écrire à CODE AXIS sur WhatsApp',
en: 'Write to CODE AXIS on WhatsApp'
};

var SECTION_KEY = {
'section-work': 'work',
'section-about': 'about',
'section-evo': 'evo',
'section-news': 'news',
'section-contact': 'contact',
'section-hire': 'hire'
};

function lang() {
return (window.cadcLang && window.cadcLang()) === 'en' ? 'en' : 'fr';
}

function paint(link) {
var t = lang();
var key = link.getAttribute('data-msg-key') || 'default';
link.href = 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(MSG[t][key] || MSG[t].default);
link.setAttribute('aria-label', LABEL[t]);
link.title = LABEL[t];
}

function init() {
if (document.querySelector('.wa-fab')) return;

var link = document.createElement('a');
link.className = 'wa-fab';
link.target = '_blank';
link.rel = 'noopener noreferrer';
link.innerHTML = window.ico
? window.ico('whatsapp', { size: 26 })
: '<svg class="ico" viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>';
paint(link);
document.body.appendChild(link);

document.documentElement.addEventListener('cadc:lang', function () { paint(link); });

var mainContent = document.getElementById('main-content');
if (mainContent) {
var syncMsg = function () {
var active = mainContent.querySelector('.l-section.section--is-active');
link.setAttribute('data-msg-key', (active && SECTION_KEY[active.id]) || 'default');
paint(link);
};
syncMsg();
new MutationObserver(syncMsg).observe(mainContent, { attributes: true, attributeFilter: ['class'], subtree: true });
}

var contact = document.querySelector('.contact');
var section = contact && contact.closest('.l-section');
if (section) {
var sync = function () {
link.classList.toggle('is-hidden', section.classList.contains('section--is-active'));
};
sync();
new MutationObserver(sync).observe(section, { attributes: true, attributeFilter: ['class'] });
}
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();