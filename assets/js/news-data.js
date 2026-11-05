/**
 * Journal d'actualité CODE AXIS, source unique partagée par la home (aperçu)
 * et la page actualites.html (lecture complète).
 */
(function () {
  'use strict';

  var NEWS = [
    {
      date: '2026-11-05', tag: 'Partenariat', title: 'MBOA BIO 237 rejoint la maison CODE AXIS',
      image: 'assets/img/partenaires/mboa-bio-237.jpg',
      excerpt: 'Nouveau partenariat avec MBOA BIO 237, marque de produits frais et biologiques de Douala : panier en ligne et paiement mobile money suivront.',
      body: [
        ['Le partenariat', 'MBOA BIO 237, épicerie de produits frais et biologiques à Douala, s’associe à CODE AXIS Digital Cameroon. Bananes, plantains, manioc, papayes et agrumes : la marque veut vendre son panier en ligne, payé par Orange Money ou MTN MoMo.'],
        ['Ce que nous faisons', 'La suite evo pose les bases de sa boutique digitale, entre evo-shop et evo-market, avec la livraison suivie. Les détails d’ouverture seront annoncés ici même.'],
        ['Et ensuite', 'Premiers rayons en ligne prévus après la phase de catalogage des produits.']
      ]
    },
    {
      date: '2026-11-05', tag: 'Partenariat', title: 'FROST & CO GROUP renouvelle son amitié avec CODE AXIS',
      image: 'assets/img/partenaires/frost-co-group.jpg',
      excerpt: 'FROST & CO GROUP prolonge son partenariat avec CODE AXIS et prépare le lancement prochain d’un site de location de voitures.',
      body: [
        ['Le renouvellement', 'FROST & CO GROUP renouvelle sa confiance et son amitié avec CODE AXIS Digital Cameroon. Collaborateurs de la première heure, nous poursuivons ensemble sur les sujets digitaux du groupe.'],
        ['Le projet en préparation', 'Un site de location de voitures est en préparation, appuyé sur l’expérience evo-auto et evo-cars : réservation en ligne, état de la flotte et facturation mobile money.'],
        ['Calendrier', 'Le lancement est prévu prochainement ; la fiche produit et l’annonce seront publiées dans la suite evo et ici même.']
      ]
    },
    {
      date: '2026-11-05', tag: 'Agence', title: 'La nouvelle version du site est en ligne',
      excerpt: 'Voile de marque non bloquant, section Suite evo avec carrousel 3D, bandeau Actualité qui défile seul et page Youth Partnership : la nouvelle version est en ligne.',
      body: [
        ['Ce qui change', 'Le site s’ouvre directement sur son contenu, avec un voile de marque qui s’efface tout seul au premier accès d’une session. La home accueille une section Suite evo avec le carrousel 3D des produits phares, et un bandeau Actualité qui défile comme un kiosque de presse.'],
        ['Côté candidature', "L’Opération Youth Partnership a sa page dédiée : le principe en trois lignes, un simulateur de revenus à 45 % sur douze mois, les conditions complètes et un formulaire qui part sur notre WhatsApp et notre boîte mail."]
      ]
    },
    {
      date: '2026-10-31', tag: 'Partenariat', title: 'Le Youth Partnership ouvre ses candidatures',
      excerpt: 'Tu apportes le client, tu gardes 45 % du montant encaissé chaque mois pendant douze mois : l’Opération Youth Partnership démarre le 10 novembre à Douala.',
      cta: { label: 'Candidater', href: 'youth-partnership.html' },
      body: [
        ['Le principe', "L’Opération Youth Partnership est un partenariat d’apport d’affaires signé avec CADC SARL, sans aucun frais à payer. Le participant présente un logiciel de la gamme EVO- à une entreprise de son quartier, de son église ou de sa famille. Quand le client souscrit, il perçoit 45 % du montant réellement encaissé chaque mois, pendant les douze mois du contrat, versés par mobile money."],
        ['Qui peut candidater', "Moins de 35 ans à la date d’inscription, résider au Cameroun de préférence à Douala, disposer d’une pièce d’identité et d’un compte mobile money à son nom. Aucun diplôme exigé, aucun investissement de départ. Formation et support fournis. Inscriptions ouvertes du 10 novembre au 10 janvier, engagement non renouvelable."],
        ['Simuler avant de signer', "La page du programme embarque un simulateur : on tape le montant que le client paiera chaque mois, on obtient sa part à 45 %, le total sur douze mois et la part reversée à CODE AXIS. Le modèle de contrat et le barème par produit sont communiqués sur demande."],
        ['Comment candidater', "Le formulaire prend trois minutes : nom, WhatsApp, date de naissance, quartier, situation et deux ou trois phrases de motivation. Rappel sous 72 heures pour signer le contrat et planifier la formation."]
      ]
    },
    {
      date: '2026-10-31', tag: 'Agence', title: 'Le site s’ouvre directement sur le contenu',
      excerpt: 'L’écran de lancement et son bouton « Entrer sur le site » ont disparu : le site démarre à l’adresse racine, sur le vrai contenu.',
      body: [
        ['Ce qui change', 'Le site est désormais servi sur la page racine, sans préchargeur ni écran intermédiaire. Les robots et les visiteurs arrivent sur le même contenu, au premier octet. La home reçoit aussi deux nouvelles sections, Suite evo et Actualité, avec un lien direct vers leurs pages dédiées.'],
        ['Côté référencement', 'Le titre de l’onglet n’annonce plus un chargement : il dit ce que fait l’agence et où. Les images de partage, le plan du site et une page 404 à nos couleurs accompagnent ce changement. Le domaine codeaxis.cm doit encore être branché sur l’hébergement pour que tout cela porte ses fruits.'],
        ['Ce qui reste', 'L’identité du hero est conservée à l’identique : espace CADC, astronaute en lévitation et sections historiques. Depuis, le carrousel 3D a rejoint la section Suite evo de la home.']
      ]
    },
    {
      date: '2026-10-29', tag: 'Produit', title: 'Le site passe en français et en anglais',
      excerpt: 'Un sélecteur de langue fait basculer tout le site entre le français et l’anglais, choix mémorisé d’une page à l’autre.',
      body: [
        ['Ce qui change', 'Un bouton segmenté FR / EN apparaît dans l’en-tête de la home et en haut de chaque page. Le choix est mémorisé et réappliqué sur toute la page suivante, y compris les cartes de services, les compétences et les fiches de la suite evo.'],
        ['Comment ça marche', 'Le site reste un seul jeu de pages : une table de correspondance traduit le texte affiché, sans dupliquer le contenu ni alourdir l’hébergement. Les titres d’onglet, descriptions et textes alternatifs suivent aussi.'],
        ['Limite assumée', 'La version anglaise est servie sur la même URL. Pour un référencement anglais ciblé, il faudra plus tard des pages dédiées avec hreflang. Les relectures de nos traductions sont les bienvenues.']
      ]
    },
    {
      date: '2026-10-27', tag: 'Agence', title: 'Le nouveau site CODE AXIS est en ligne',
      excerpt: 'Identité visuelle, palette encre et acier, mode hors connexion : le site de l’agence a été refait.',
      body: [
        ['Ce qui change', 'Le site adopte la marque CODE AXIS Digital Cameroon et sa palette d’encre navy. Le thème bascule entre nuit, jour et soirée en gardant votre choix d’une page à l’autre.'],
        ['Côté technique', 'Le site fonctionne comme une application installable : service worker, cache des ressources et page dédiée quand le réseau tombe. Les polices ne bloquent plus l’affichage et les icônes sont désormais des tracés SVG plutôt que des émojis.'],
        ['Et ensuite', 'Les fiches produits de la suite evo vont recevoir leur page de démonstration au fur et à mesure des mises en production.']
      ]
    },
    {
      date: '2026-10-25', tag: 'Produit', title: 'La suite evo passe à 22 produits',
      excerpt: 'evo-cars et evo-wear rejoignent le catalogue, aux côtés de evo-gaz, evo-clinic ou evo-tontaine.',
      body: [
        ['evo-cars', 'Gestion de parc automobile et de pièces détachées : fiches véhicules avec éclatés techniques, stock pièces, commandes croisées et suivi des livraisons.'],
        ['evo-wear', 'Boutique de vêtements : fiches modèles avec mensurations, tailles et coloris, stock par variantes, ventes au comptoir et livraison.'],
        ['Le catalogue', 'Chaque produit de la suite evo est conçu pour le terrain camerounais : paiement mobile money, usage en faible connexion et prise en main sans formation longue.']
      ]
    },
    {
      date: '2026-10-18', tag: 'Terrain', title: 'evo-gaz en production à Douala',
      excerpt: 'La plateforme de vente et de livraison de bouteilles de GPL est exploitée au quotidien par nos équipes.',
      body: [
        ['Le besoin', 'Commandes, tarification, tournée des livreurs et reçus : la distribution de gaz domestique se heurtait au papier et au téléphone.'],
        ['Ce que fait evo-gaz', 'Les clients commandent depuis leur téléphone, les agents reçoivent leur tournée, le paiement passe par mobile money et le reçu est délivré immédiatement. Les données de vente restent consultables même quand la connexion lâche.'],
        ['Prochaine étape', 'Ouverture de la facturation par abonnement pour les revendeurs et les restaurants.']
      ]
    },
    {
      date: '2026-10-05', tag: 'Technique', title: 'Une interface qui tient hors connexion',
      excerpt: 'Le service worker met en cache l’essentiel de l’interface et affiche une page lisible quand le réseau manque.',
      body: [
        ['Le choix', 'Plutôt que d’afficher une erreur de navigateur, l’application sert une version locale de l’interface et une page hors connexion à nos couleurs.'],
        ['Comment', 'Les fichiers critiques sont enregistrés au premier visite, puis resynchronisés en arrière-plan à chaque retour du réseau. Les images sont mises en cache à la volée.'],
        ['Pourquoi ici', 'À Douala comme en région, une coupure de connexion ne doit pas bloquer une prise de commande ou un relevé sur le terrain.']
      ]
    },
    {
      date: '2026-09-22', tag: 'Produit', title: 'evo-presence en phase de déploiement',
      excerpt: 'Le pointage des présences par empreinte ou code arrive chez nos premiers établissements pilotes.',
      body: [
        ['Le principe', 'Le salarié pointe à l’arrivée et au départ. Les heures, retards et absences sont calculés automatiquement, avec un export prêt pour la paie.'],
        ['En cours', 'Recette sur site, ajustement des règles de primes et formation des responsables de service.'],
        ['Disponible', 'La fiche produit est visible dans la suite evo ; l’accès démonstration se demande directement via WhatsApp.']
      ]
    },
    {
      date: '2026-09-10', tag: 'Agence', title: 'Nos équipes travaillent depuis Bonabéri',
      excerpt: 'L’agence est basée à Bonabéri, à Douala, pour être au plus près des entreprises de la zone industrielle.',
      body: [
        ['Pourquoi Bonabéri', 'Le quartier concentre dépôts, ateliers et sociétés de transport. Être sur place change le rythme des rendez-vous et des mises en service.'],
        ['Nous joindre', 'Le plus rapide reste WhatsApp, sinon par téléphone ou par mail depuis la page de contact. Les visites se font sur rendez-vous.'],
        ['Adresse exacte', 'Le point d’envoi des courses et la rue précise sont communiqués lors de la prise de rendez-vous.']
      ]
    }
  ];

  window.CADC_NEWS = NEWS;

  /* Ancre unique par article : date + début du titre sans accents */
  window.cadcNewsHash = function (n) {
    var slug = String(n.title).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 28);
    return n.date + '-' + slug;
  };

  window.cadcNewsDate = function (iso) {
    var d = new Date(iso + 'T00:00:00');
    var lang = (window.cadcLang && window.cadcLang() === 'en') ? 'en-GB' : 'fr-FR';
    return d.toLocaleDateString(lang, { day: '2-digit', month: 'long', year: 'numeric' });
  };
})();
