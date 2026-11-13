/**
 * Formulaire de contact : envoi serveur quand il est configuré, repli mailto,
 * repli WhatsApp et copie de l'adresse dans la langue active.
 */
(function () {
  'use strict';

  var MAIL = 'contact@codeaxis.cm';
  var STR = {
    fr: {
      nom: 'Nom', email: 'Email', hello: 'Bonjour CODE AXIS, je suis', quote: 'Projet de',
      sending: 'Envoi en cours...',
      sent: 'Message envoyé. Nous revenons vers toi par e-mail.',
      fallback: 'Envoi direct indisponible, ton client mail s\'ouvre.',
      limit: 'Trop de demandes envoyées. Réessaie dans une heure.',
      copied: 'Adresse copiée'
    },
    en: {
      nom: 'Name', email: 'Email', hello: 'Hello CODE AXIS, I am', quote: 'Project from',
      sending: 'Sending...',
      sent: 'Message sent. We will get back to you by email.',
      fallback: 'Direct sending is unavailable, your mail app will open.',
      limit: 'Too many requests. Try again in an hour.',
      copied: 'Address copied'
    }
  };

  function copy() {
    return STR[(window.cadcLang && window.cadcLang()) || 'fr'];
  }

  function fields(form) {
    var d = new FormData(form);
    return {
      name: d.get('name'),
      email: d.get('email'),
      message: d.get('message'),
      company: d.get('company')
    };
  }

  function status(el, text, kind) {
    if (!el) return;
    el.textContent = text || '';
    el.className = 'contact-status' + (kind ? ' is-' + kind : '');
  }

  function mailto(t, v) {
    var body = t.nom + ': ' + encodeURIComponent(v.name || '') + '%0A' +
      t.email + ': ' + encodeURIComponent(v.email || '') + '%0A%0A' +
      encodeURIComponent(v.message || '');
    var subject = encodeURIComponent(t.quote + ' ' + (v.name || ''));
    window.location.href = 'mailto:' + MAIL + '?subject=' + subject + '&body=' + body;
  }

  function legacyCopy() {
    var input = document.createElement('textarea');
    input.value = MAIL;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    var done = false;
    try { done = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(input);
    return done;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('quick-contact-form');
    if (!form) return;

    var live = document.getElementById('contact-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var t = copy();
      var v = fields(form);
      status(live, t.sending, '');

      // Désactiver le bouton pendant l'envoi pour éviter les doubles soumissions
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); }

      // AbortController avec timeout de 12 secondes (connexion mobile lente)
      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timeoutId = controller
        ? setTimeout(function () { controller.abort(); }, 12000)
        : null;

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (v.name || '').trim(),
          email: (v.email || '').trim(),
          message: (v.message || '').trim(),
          company: v.company || ''
        }),
        signal: controller ? controller.signal : undefined
      })
        .then(function (r) {
          if (timeoutId) clearTimeout(timeoutId);
          return r.json().catch(function () { return {}; }).then(function (data) {
            return { code: r.status, data: data };
          });
        })
        .then(function (res) {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
          if (res.code === 200) {
            form.reset();
            status(live, t.sent, 'ok');
          } else if (res.code === 429) {
            status(live, t.limit, 'error');
          } else {
            status(live, t.fallback, '');
            mailto(t, v);
          }
        })
        .catch(function (err) {
          if (timeoutId) clearTimeout(timeoutId);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
          status(live, t.fallback, '');
          mailto(t, v);
        });
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

    var copyBtn = document.getElementById('copy-mail-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var t = copy();
        function done(ok) {
          status(live, ok ? t.copied : MAIL, ok ? 'ok' : '');
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(MAIL).then(function () { done(true); }, function () { done(legacyCopy()); });
        } else {
          done(legacyCopy());
        }
      });
    }

    /* Les liens directs de la section suivent la langue */
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
      if (mailDirect) mailDirect.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(MAIL_SUBJECT[lang]);
    }
    paint();
    document.documentElement.addEventListener('cadc:lang', paint);
  });
})();
