/**
 * Opération Youth Partnership : simulateur de commission (45 % sur 12 mois)
 * et formulaire de candidature envoyé sur WhatsApp et par mail, avec confirmation.
 */
(function () {
  'use strict';

  var RATE = 0.45;
  var MONTHS = 12;
  var WA_BASE = 'https://wa.me/237691223916?text=';
  var MAIL = 'contact@codeaxis.cm';

  function lang() { return (window.cadcLang && window.cadcLang()) || 'fr'; }

  function money(v) {
    var loc = lang() === 'en' ? 'en-GB' : 'fr-FR';
    return new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(Math.round(v)) + ' FCFA';
  }

  /* ---------------- Simulateur ---------------- */
  var range, amount, share, shareNote, client, month, months, total, rest;

  function fmtNum(v) {
    var loc = lang() === 'en' ? 'en-GB' : 'fr-FR';
    return new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(v);
  }

  function paintSim() {
    if (!range) return;
    var v = Math.min(200000, Math.max(1000, parseInt(amount.value, 10) || 15000));
    var part = v * RATE;
    share.textContent = money(part);
    shareNote.textContent = lang() === 'en'
      ? '45% of ' + fmtNum(v) + ' FCFA collected from the client'
      : '45 % de ' + fmtNum(v) + ' FCFA encaissés par le client';
    client.textContent = fmtNum(v) + ' FCFA / ' + (lang() === 'en' ? 'month' : 'mois');
    month.textContent = money(part);
    months.textContent = lang() === 'en' ? '12 months' : '12 mois';
    total.textContent = money(part * MONTHS);
    rest.textContent = money(v * MONTHS * (1 - RATE));
  }

  function initSim() {
    range = document.getElementById('simRange');
    amount = document.getElementById('simAmount');
    if (!range || !amount) return;
    share = document.getElementById('simShare');
    shareNote = document.getElementById('simShareNote');
    client = document.getElementById('simClient');
    month = document.getElementById('simMonth');
    months = document.getElementById('simMonths');
    total = document.getElementById('simTotal');
    rest = document.getElementById('simRest');

    range.addEventListener('input', function () {
      amount.value = range.value;
      paintSim();
    });
    amount.addEventListener('input', function () {
      var v = parseInt(amount.value, 10);
      if (!isNaN(v)) range.value = Math.min(200000, Math.max(1000, v));
      paintSim();
    });
    amount.addEventListener('blur', function () {
      var v = parseInt(amount.value, 10);
      if (isNaN(v)) v = 15000;
      v = Math.min(200000, Math.max(1000, v));
      amount.value = v;
      range.value = v;
      paintSim();
    });
    paintSim();
  }

  /* ---------------- Formulaire ---------------- */
  var COPY = {
    fr: {
      subject: 'Candidature Youth Partnership (CODE AXIS)',
      lines: { name: 'Nom', phone: 'WhatsApp', email: 'Email', birth: 'Naissance', city: 'Quartier', situation: 'Situation', why: 'Motivation' },
      tooOld: 'Le programme est réservé aux moins de 35 ans à la date d’inscription.',
      msg: function (v, t) {
        return t.subject + '\n\n'
          + t.lines.name + ': ' + v.name + '\n'
          + t.lines.phone + ': ' + v.phone + '\n'
          + (v.email ? t.lines.email + ': ' + v.email + '\n' : '')
          + t.lines.birth + ': ' + v.birth + '\n'
          + t.lines.city + ': ' + v.city + '\n'
          + t.lines.situation + ': ' + v.situation + '\n'
          + '\n' + t.lines.why + ':\n' + v.why;
      }
    },
    en: {
      subject: 'Youth Partnership application (CODE AXIS)',
      lines: { name: 'Name', phone: 'WhatsApp', email: 'Email', birth: 'Born', city: 'Area', situation: 'Situation', why: 'Motivation' },
      tooOld: 'The programme is open to applicants under 35 at the registration date.',
      msg: function (v, t) {
        return t.subject + '\n\n'
          + t.lines.name + ': ' + v.name + '\n'
          + t.lines.phone + ': ' + v.phone + '\n'
          + (v.email ? t.lines.email + ': ' + v.email + '\n' : '')
          + t.lines.birth + ': ' + v.birth + '\n'
          + t.lines.city + ': ' + v.city + '\n'
          + t.lines.situation + ': ' + v.situation + '\n'
          + '\n' + t.lines.why + ':\n' + v.why;
      }
    }
  };

  function ageFrom(iso) {
    var b = new Date(iso + 'T12:00:00');
    if (isNaN(b)) return NaN;
    var now = new Date();
    var age = now.getFullYear() - b.getFullYear();
    var m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
    return age;
  }

  function initForm() {
    var form = document.getElementById('ypForm');
    if (!form) return;
    var done = document.getElementById('ypDone');
    var doneWa = document.getElementById('ypDoneWa');
    var doneClose = document.getElementById('ypDoneClose');
    var birth = document.getElementById('ypBirth');

    var maxBirth = new Date();
    maxBirth.setFullYear(maxBirth.getFullYear() - 16);
    var minBirth = new Date();
    minBirth.setFullYear(minBirth.getFullYear() - 80);
    birth.min = minBirth.toISOString().slice(0, 10);
    birth.max = maxBirth.toISOString().slice(0, 10);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.company.value) return;
      if (!form.reportValidity()) return;

      var t = COPY[lang()];
      var age = ageFrom(birth.value);
      if (isNaN(age) || age >= 35) {
        birth.setCustomValidity(t.tooOld);
        form.reportValidity();
        return;
      }
      birth.setCustomValidity('');

      var d = new FormData(form);
      var v = {
        name: d.get('name'), phone: d.get('phone'), email: d.get('email') || '',
        birth: d.get('birth'), city: d.get('city'),
        situation: d.get('situation'), why: d.get('why')
      };
      var msg = t.msg(v, t);
      var waHref = WA_BASE + encodeURIComponent(msg);
      var mailHref = 'mailto:' + MAIL
        + '?subject=' + encodeURIComponent(t.subject + ' ' + v.name)
        + '&body=' + encodeURIComponent(msg);

      doneWa.href = waHref;
      window.open(waHref, '_blank', 'noopener');
      window.location.href = mailHref;

      done.classList.add('is-active');
      doneClose.focus();
    });

    birth.addEventListener('input', function () { birth.setCustomValidity(''); });

    doneClose.addEventListener('click', function () { done.classList.remove('is-active'); });
    done.addEventListener('click', function (e) { if (e.target === done) done.classList.remove('is-active'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') done.classList.remove('is-active'); });
  }

  document.documentElement.addEventListener('cadc:lang', paintSim);

  document.addEventListener('DOMContentLoaded', function () {
    initSim();
    initForm();
  });
})();
