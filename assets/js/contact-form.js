/**
 * Formulaire rapide de la section Contact : envoi par mail ou WhatsApp,
 * messages construits dans la langue active.
 */
(function () {
  'use strict';

  var COPY = {
    fr: { nom: 'Nom', email: 'Email', hello: 'Bonjour CODE AXIS, je suis', quote: 'Projet de' },
    en: { nom: 'Name', email: 'Email', hello: 'Hello CODE AXIS, I am', quote: 'Project from' }
  };

  function copy() {
    return COPY[(window.cadcLang && window.cadcLang()) || 'fr'];
  }

  function fields(form) {
    var d = new FormData(form);
    return { name: d.get('name'), email: d.get('email'), message: d.get('message') };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('quick-contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = copy();
      var v = fields(form);
      var body = t.nom + ': ' + v.name + '%0A' + t.email + ': ' + v.email + '%0A%0A' +
        encodeURIComponent(v.message);
      window.location.href = 'mailto:contact@codeaxis.cm?subject=' +
        encodeURIComponent(t.quote + ' ' + v.name) + '&body=' + body;
    });

    var waBtn = document.getElementById('form-whatsapp-btn');
    if (waBtn) {
      waBtn.addEventListener('click', function () {
        var t = copy();
        var v = fields(form);
        if (!form.reportValidity()) return;
        var text = t.hello + ' ' + v.name + ' (' + v.email + '). ' + v.message;
        window.open('https://wa.me/237691223916?text=' + encodeURIComponent(text), '_blank', 'noopener');
      });
    }

    /* Le lien WhatsApp Direct de la section suit la langue */
    var direct = document.getElementById('wa-direct-link');
    var mailDirect = document.getElementById('mail-direct-link');
    var WA_TEXT = {
      fr: 'Bonjour CODE AXIS, je souhaite des informations sur vos services.',
      en: 'Hello CODE AXIS, I would like information about your services.'
    };
    var MAIL_SUBJECT = {
      fr: 'Demande de projet CODE AXIS',
      en: 'CODE AXIS project inquiry'
    };

    function paint() {
      var lang = (window.cadcLang && window.cadcLang()) || 'fr';
      if (direct) direct.href = 'https://wa.me/237691223916?text=' + encodeURIComponent(WA_TEXT[lang]);
      if (mailDirect) mailDirect.href = 'mailto:contact@codeaxis.cm?subject=' + encodeURIComponent(MAIL_SUBJECT[lang]);
    }
    paint();
    document.documentElement.addEventListener('cadc:lang', paint);
  });
})();
