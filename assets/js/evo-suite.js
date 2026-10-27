/**
 * Suite evo, catalogue des produits CODE AXIS Digital Cameroon
 * Utilisé par home.html (section 04) et suite-evo.html.
 */
(function () {
  'use strict';

  var PROJECTS = [
    { slug: 'evo-gaz', tag: 'Distribution de GPL', anim: 'flicker', state: 'En production', desc: 'Plateforme de vente et de livraison de bouteilles de gaz : commandes, tarification en temps réel, suivi des livreurs et reçus digitaux. Conçue pour fonctionner avec des agents sur le terrain et des paiements mobile money.' },
    { slug: 'evo-agent', tag: 'Agent IA autonome', anim: 'scan', state: 'Déploiement', desc: 'Un assistant intelligent qui exécute des tâches métier de bout en bout : compréhension de la demande, appels aux outils, restitution. Il s’intègre à nos produits pour automatiser le support et les opérations quotidiennes.' },
    { slug: 'evo-voice', tag: 'Dictée & commande vocale', anim: 'wave', state: 'Déploiement', desc: 'Saisie vocale multilingue pour les métiers de terrain : dicter une note, un relevé ou une commande, obtenir une transcription structurée. Pensé pour les mains occupées et les écrans petits.' },
    { slug: 'evo-carnet', tag: 'Carnet numérique', anim: 'rise', state: 'Déploiement', desc: 'Le carnet de notes nouvelle génération : entrées horodatées, pièces jointes, recherche instantanée et synchronisation hors-ligne. Idéal pour les techniciens, commerciaux et équipes d’intervention.' },
    { slug: 'evo-hotel', tag: 'Réservation hôtelière', anim: 'orbit', state: 'Déploiement', desc: 'Gestion complète d’un établissement : chambres, calendrier de réservation, tarifs par saison, check-in rapide et facturation. Le tout avec confirmation par SMS et WhatsApp.' },
    { slug: 'evo-log', tag: 'Logistique & colis', anim: 'orbit', state: 'Déploiement', desc: 'Suivi de colis de l’entrepôt à la livraison : affectation des tournées, preuve de livraison photographique, positionnement et retard alerté. Tableau de bord temps réel pour les exploitants.' },
    { slug: 'evo-tontaine', tag: 'Tontines & épargne', anim: 'stack', state: 'Déploiement', desc: 'Digitalisation des tontines : cotisations planifiées, tour de paiement transparent, historique infalsifiable et rappels automatiques. Chaque membre voit exactement où en est le cycle.' },
    { slug: 'evo-clinic', tag: 'Dossiers patients', anim: 'pulse', state: 'Déploiement', desc: 'Gestion de clinique et de cabinet médical : dossier patient, consultations, ordonnances, laboratoire et facturation mutuelle. Accès rapide par recherche nominale, données chiffrées.' },
    { slug: 'evo-immo', tag: 'Annonces immobilières', anim: 'rise', state: 'Déploiement', desc: 'Portail immobilier avec visites planifiées, dossiers de candidature, baux et quittances. Les agences publient, les clients signent, la comptabilité locative suit automatiquement.' },
    { slug: 'evo-school', tag: 'Frais scolaires & reçus', anim: 'scan', state: 'Déploiement', desc: 'Encaissement des frais de scolarité, reçus digitaux, relances automatiques et situation de compte par élève. Les parents paient par mobile money, la direction voit la trésorerie en direct.' },
    { slug: 'evo-shop', tag: 'Point de vente', anim: 'pulse', state: 'Déploiement', desc: 'Caisse complète pour commerces et dépôts : catalogue, stock multi-dépôts, tickets de caisse, crédits clients et clôture de journée. Fonctionne hors-ligne et resynchronise au retour du réseau.' },
    { slug: 'evo-market', tag: 'Marketplace', anim: 'orbit', state: 'Déploiement', desc: 'Place de marché multi-vendeurs avec paiements mobiles, gestion des commandes et logistique intégrée. Chaque vendeur dispose de sa boutique, de son catalogue et de ses statistiques.' },
    { slug: 'evo-crm', tag: 'Portefeuille clients', anim: 'blink', state: 'Déploiement', desc: 'CRM orienté portefeuille : contacts, opportunités, devis, encaissements et relances. L’équipe commerciale suit son pipeline, la direction suit sa marge.' },
    { slug: 'evo-docs', tag: 'Gestion documentaire', anim: 'stack', state: 'Déploiement', desc: 'Coffre-fort documentaire collaboratif : versions, validations, signatures et permissions fines. Retrouver la bonne version d’un contrat prend quelques secondes.' },
    { slug: 'evo-presence', tag: 'Pointage des présences', anim: 'blink', state: 'Déploiement', desc: 'Pointage biométrique ou par code avec calcul automatique des heures, retards, absences et primes. Export de paie prêt pour la comptabilité.' },
    { slug: 'evo-call', tag: 'Centre d’appels', anim: 'wave', state: 'Déploiement', desc: 'Console d’appels pour support et télévente : files d’attente, distribution des appels, fiches d’appel, enregistrements et indicateurs de service.' },
    { slug: 'evo-auto', tag: 'Vente automobile', anim: 'orbit', state: 'Déploiement', desc: 'Gestion de parc automobile : fiches véhicules, photos, prix, réservations, dossiers de financement et historique de maintenance pour les revendeurs et garages.' },
    { slug: 'evo-import', tag: 'Fret & import', anim: 'rise', state: 'Déploiement', desc: 'Suivi des conteneurs de la Chine à Douala : étapes du transit, dédouanement, frais par conteneur et livraison finale. Le client visualise l’avancement réel de sa marchandise.' },
    { slug: 'evo-bijou', tag: 'Bijouterie', anim: 'pulse', state: 'Déploiement', desc: 'Catalogue de bijouterie-joaillerie avec cotation à la gramme, suivi du stock or et pierres, certifications et réparations. Vitrine élégante, gestion rigoureuse.' },
    { slug: 'evo-moto', tag: 'Motos & atelier', anim: 'orbit', state: 'Déploiement', desc: 'Vente de deux-roues et atelier : carnets d’entretien, ordres de réparation, pièces détachées et facturation. Conçu pour les parcs de motos-taxis et les concessionnaires.' },
    { slug: 'evo-cars', tag: 'Voitures & pièces', anim: 'orbit', state: 'Déploiement', desc: 'Vente automobile et pièces détachées : fiches véhicules avec éclatés techniques, stock pièces, commandes croisées et suivi des livraisons. Un catalogue unique pour les garages et les revendeurs.' },
    { slug: 'evo-wear', tag: 'Prêt-à-porter', anim: 'scan', state: 'Déploiement', desc: 'Gestion de boutique de vêtements : fiches modèles avec mensurations, tailles et coloris, stock par variantes, ventes comptoir et livraison. Les cabines d’essayage deviennent une simple recherche.' }
  ];

  function mountEvoSuite(opts) {
    var grid = document.getElementById(opts.grid);
    var modal = document.getElementById(opts.modal);
    if (!grid || !modal) return null;

    var stage = document.getElementById(opts.stage);
    var img = document.getElementById(opts.img);
    var name = document.getElementById(opts.name);
    var desc = document.getElementById(opts.desc);
    var cta = document.getElementById(opts.cta);

    PROJECTS.forEach(function (p) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'evo-card';
      card.innerHTML =
        '<span class="evo-card-media">' +
        '<img src="assets/img/evo/' + p.slug + '.jpg" alt="' + p.slug + ', ' + p.tag + '" loading="lazy">' +
        '</span>' +
        '<span class="evo-card-body">' +
        '<span class="evo-card-top">' +
        '<span class="evo-card-name">' + p.slug + '</span>' +
        '<span class="evo-card-badge">' + p.state + '</span>' +
        '</span>' +
        '<span class="evo-card-tag">' + p.tag + '</span>' +
        '</span>';
      card.addEventListener('click', function () { open(p); });
      grid.appendChild(card);
    });

    function open(p) {
      stage.className = 'evo-stage';
      img.src = 'assets/img/evo/' + p.slug + '.jpg';
      img.alt = p.slug;
      name.textContent = p.slug;
      desc.textContent = p.desc;
      cta.href = 'deploiement.html?p=' + p.slug;
      void stage.offsetWidth;
      stage.classList.add('evo-anim-' + p.anim);
      modal.classList.add('is-active');
    }

    function close() { modal.classList.remove('is-active'); }

    document.getElementById(opts.close).addEventListener('click', close);
    if (document.getElementById(opts.back)) {
      document.getElementById(opts.back).addEventListener('click', close);
    }
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    return { open: open, close: close };
  }

  window.EvoSuite = { projects: PROJECTS, mount: mountEvoSuite };
})();
