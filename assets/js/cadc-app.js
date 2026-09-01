/**
 * ===================================================================
 * C.A.D.C. - Agence Digitale Douala | Moteur Interactif Maître
 * Navigation 3D, 3D Hero Carousel, Technical Arsenal, Thèmes & Particules
 * ===================================================================
 */

(function () {
  'use strict';

  // Navigation State
  let currentSection = 0;
  const sections = document.querySelectorAll('.l-main-content .l-section');
  const sideNavItems = document.querySelectorAll('.side-nav > li');
  const outerNavItems = document.querySelectorAll('.outer-nav > li');
  const totalSections = sections.length;
  let isNavigating = false;
  const navigationCooldown = 650;

  const perspectiveContainer = document.querySelector('.perspective');
  const outerNav = document.querySelector('.outer-nav');
  const outerNavReturn = document.querySelector('.outer-nav--return');
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const metricsBtn = document.getElementById('metrics-btn');
  const metricsModal = document.getElementById('metrics-modal');
  const metricsModalClose = document.getElementById('metrics-modal-close');

  /* ===================================================================
     1. GESTIONNAIRE DE NAVIGATION ENTRE SECTIONS AVEC MÉMOIRE D'ÉTAT
     =================================================================== */
  function goToSection(targetIndex, skipCooldown) {
    if (targetIndex < 0 || targetIndex >= totalSections) return;
    if (targetIndex === currentSection && !isNavigating) return;

    isNavigating = true;
    currentSection = targetIndex;

    try {
      sessionStorage.setItem('cadc_last_section', targetIndex);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#section-' + targetIndex);
      }
    } catch(e) {}

    sections.forEach((sec, idx) => {
      sec.classList.remove('section--is-active');
      if (idx === currentSection) {
        sec.classList.add('section--is-active');
      }
    });

    sideNavItems.forEach((item, idx) => {
      if (idx === currentSection) item.classList.add('is-active');
      else item.classList.remove('is-active');
    });

    outerNavItems.forEach((item, idx) => {
      if (idx === currentSection) item.classList.add('is-active');
      else item.classList.remove('is-active');
    });

    // Mettre à jour les liens du header
    document.querySelectorAll('.header--nav-links a').forEach((link, idx) => {
      if (idx === currentSection) link.classList.add('active');
      else link.classList.remove('active');
    });

    setTimeout(() => {
      isNavigating = false;
    }, skipCooldown ? 50 : navigationCooldown);
  }

  // Exposed globally for header nav links and external callers
  window.goToSectionExternal = function(index) {
    goToSection(index);
  };
  window.cadcGoTo = function(index) {
    goToSection(index);
  };

  // Restauration automatique de la section précédente si retour arrière
  try {
    const hashMatch = window.location.hash.match(/#section-(\d+)/);
    const savedSec = hashMatch ? parseInt(hashMatch[1], 10) : parseInt(sessionStorage.getItem('cadc_last_section'), 10);
    if (!isNaN(savedSec) && savedSec >= 0 && savedSec < totalSections && savedSec !== 0) {
      setTimeout(() => { goToSection(savedSec, true); }, 30);
    }
  } catch(e) {}

  function nextSection() {
    if (currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    }
  }

  function prevSection() {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }

  // Événement Molette moderne avec normalisation de l'inertie
  let wheelAccumulator = 0;
  let wheelTimer = null;

  window.addEventListener(
    'wheel',
    function (e) {
      if (perspectiveContainer && perspectiveContainer.classList.contains('effect-rotate-left--animate')) return;
      if (metricsModal && metricsModal.classList.contains('is-active')) return;

      e.preventDefault();
      if (isNavigating) return;

      wheelAccumulator += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 200);

      const threshold = 35;
      if (wheelAccumulator > threshold) {
        wheelAccumulator = 0;
        nextSection();
      } else if (wheelAccumulator < -threshold) {
        wheelAccumulator = 0;
        prevSection();
      }
    },
    { passive: false }
  );

  // Événement Clavier (Flèches Haut / Bas / Espace)
  window.addEventListener('keydown', function (e) {
    if (perspectiveContainer && perspectiveContainer.classList.contains('effect-rotate-left--animate')) {
      if (e.key === 'Escape') close3DMenu();
      return;
    }
    if (metricsModal && metricsModal.classList.contains('is-active')) {
      if (e.key === 'Escape') closeMetricsModal();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      prevSection();
    }
  });

  // Gestes Tactiles Mobile — Seuil élevé pour éviter les changements accidentels
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;

  window.addEventListener(
    'touchstart',
    function (e) {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    function (e) {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      if (perspectiveContainer && perspectiveContainer.classList.contains('effect-rotate-left--animate')) return;
      if (metricsModal && metricsModal.classList.contains('is-active')) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;
      const elapsed = Date.now() - touchStartTime;

      // Seuil élevé (85px) + durée min 80ms pour éviter les glissements accidentels
      const swipeThreshold = 85;
      const minDuration = 80;

      if (
        Math.abs(deltaY) > swipeThreshold &&
        Math.abs(deltaY) > Math.abs(deltaX) * 1.5 &&
        elapsed > minDuration &&
        elapsed < 600
      ) {
        if (deltaY > 0) nextSection();
        else prevSection();
      }
    },
    { passive: true }
  );

  sideNavItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      goToSection(index);
    });
  });

  document.querySelectorAll('.header--nav-links a').forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goToSection(index);
    });
  });

  const homeCtaBtn = document.getElementById('cta-intro-btn');
  if (homeCtaBtn) {
    homeCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSection(4);
    });
  }

  /* ===================================================================
     2. NAVIGATION 3D PERSPECTIVE
     =================================================================== */
  function open3DMenu() {
    if (!perspectiveContainer) return;
    perspectiveContainer.classList.add('perspective--modalview');
    setTimeout(() => {
      perspectiveContainer.classList.add('effect-rotate-left--animate');
    }, 20);

    if (outerNav) outerNav.classList.add('is-vis');
    if (outerNavReturn) outerNavReturn.classList.add('is-vis');
  }

  function close3DMenu(callback) {
    if (!perspectiveContainer) return;
    perspectiveContainer.classList.remove('effect-rotate-left--animate');
    if (outerNav) outerNav.classList.remove('is-vis');
    if (outerNavReturn) outerNavReturn.classList.remove('is-vis');

    setTimeout(() => {
      perspectiveContainer.classList.remove('perspective--modalview');
      if (typeof callback === 'function') callback();
    }, 450);
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (perspectiveContainer.classList.contains('effect-rotate-left--animate')) {
        close3DMenu();
      } else {
        open3DMenu();
      }
    });
  }

  if (outerNavReturn) {
    outerNavReturn.addEventListener('click', () => {
      close3DMenu();
    });
  }

  outerNavItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      close3DMenu(() => {
        goToSection(index);
      });
    });
  });

  /* ===================================================================
     3. 3D HERO CAROUSEL (INNOVATION TECHNOLOGIES - COMPLÉMENTAIRE AUX PROJETS)
     =================================================================== */
  const portfolioData = [
    {
      id: 1,
      title: 'Neural Network AI',
      subtitle: 'Complément Projet AgriSmart AI',
      description: 'Vision par ordinateur & réseaux de neurones appliqués au diagnostic agricole et prévisions météo localisées au Cameroun.',
      image: 'assets/img/neural-network.jpg',
      tech: ['TensorFlow AI', 'Computer Vision', 'TFLite'],
      link: 'projet-agrismart.html',
      linkText: 'Découvrir AgriSmart AI ➔'
    },
    {
      id: 2,
      title: 'Quantum Cloud Engine',
      subtitle: 'Complément Fret Portuaire',
      description: 'Architecture microservices conteneurisée sur AWS traitant plus de 50 000 événements logistiques quotidiens au Port de Douala.',
      image: 'assets/img/quantum-cloud.jpg',
      tech: ['AWS Cloud', 'Docker ECS', 'FastAPI'],
      link: 'realisation-logistique.html',
      linkText: 'Voir Étude Logistique ➔'
    },
    {
      id: 3,
      title: 'Fintech Payment Vault',
      subtitle: 'Complément Flux de Paiement',
      description: 'Moteur de micro-transactions instantanées avec réconciliation automatique et notifications SMS/Push en temps réel.',
      image: 'assets/img/blockchain-vault.jpg',
      tech: ['Paiement MoMo/OM', 'Redis Cache', 'PostgreSQL'],
      link: 'realisation-fintech.html',
      linkText: 'Voir Étude Fintech ➔'
    },
    {
      id: 4,
      title: 'Biometric Cyber Defense',
      subtitle: 'Complément FinSecure Cameroun',
      description: 'Authentification biométrique ultra-sécurisée et modèle IA de détection de fraudes bancaires en moins de 200ms.',
      image: 'assets/img/cyber-defense.jpg',
      tech: ['Biométrie', 'AES-256', 'IA Anti-Fraude'],
      link: 'projet-finsecure.html',
      linkText: 'Découvrir FinSecure ➔'
    },
    {
      id: 5,
      title: 'Omnichannel Data Nexus',
      subtitle: 'Complément Marketplace Nationale',
      description: 'Plateforme e-commerce omnicanale multi-vendeurs connectée aux paiements mobiles camerounais avec 45 000+ livraisons.',
      image: 'assets/img/data-nexus.jpg',
      tech: ['Next.js 14', 'NestJS', 'API Mobile Money'],
      link: 'realisation-marketplace.html',
      linkText: 'Voir la Marketplace ➔'
    },
    {
      id: 6,
      title: 'AR & Telehealth Interface',
      subtitle: 'Complément HealthPortal CM',
      description: 'Solution de téléconsultation médicale avec visioconférence chiffrée E2E, prescriptions numériques et dossiers patients.',
      image: 'assets/img/ar-interface.jpg',
      tech: ['WebRTC', 'Vue.js 3', 'Normes HIPAA'],
      link: 'projet-healthportal.html',
      linkText: 'Découvrir HealthPortal ➔'
    },
    {
      id: 7,
      title: 'IoT Fleet Telemetry Matrix',
      subtitle: 'Complément SmartLogistics Douala',
      description: 'Tracking de flotte de transport routier et maritime en temps réel avec capteurs IoT, alertes automatiques et gestion carburant.',
      image: 'assets/img/iot-matrix.jpg',
      tech: ['IoT MQTT', 'GPS Realtime', 'Grafana'],
      link: 'projet-smartlogistics.html',
      linkText: 'Découvrir SmartLogistics ➔'
    }
  ];

  let carouselIndex = 0;
  const carousel = document.getElementById('carousel');
  const indicatorsContainer = document.getElementById('indicators');

  function init3DHeroCarousel() {
    if (!carousel || !indicatorsContainer) return;
    carousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    portfolioData.forEach((data, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      item.dataset.index = index;

      const techBadges = data.tech
        .map((t) => `<span class="tech-badge">${t}</span>`)
        .join('');

      item.innerHTML = `
        <div class="card">
          <div class="card-number">0${data.id}</div>
          <div class="card-image">
            <img src="${data.image}" alt="${data.title}" loading="lazy">
          </div>
          <div style="font-family: 'Oxanium', sans-serif; font-size: 10px; font-weight: 700; color: var(--neon-cyan); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px;">${data.subtitle}</div>
          <h3 class="card-title">${data.title}</h3>
          <p class="card-description">${data.description}</p>
          <div class="card-tech">${techBadges}</div>
          <a href="${data.link}" class="card-cta" style="display: block; text-align: center; text-decoration: none;">${data.linkText}</a>
        </div>
      `;

      item.addEventListener('click', () => {
        if (index !== carouselIndex) {
          carouselIndex = index;
          update3DHeroCarousel();
        }
      });

      carousel.appendChild(item);

      const indicator = document.createElement('div');
      indicator.className = 'indicator';
      if (index === 0) indicator.classList.add('active');
      indicator.dataset.index = index;
      indicator.addEventListener('click', () => {
        carouselIndex = index;
        update3DHeroCarousel();
      });
      indicatorsContainer.appendChild(indicator);
    });

    update3DHeroCarousel();
  }

  function update3DHeroCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const totalItems = items.length;
    if (totalItems === 0) return;

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;

    items.forEach((item, index) => {
      let offset = index - carouselIndex;
      if (offset > totalItems / 2) offset -= totalItems;
      else if (offset < -totalItems / 2) offset += totalItems;

      const absOffset = Math.abs(offset);
      const sign = offset < 0 ? -1 : 1;

      item.style.transition = 'all 0.75s cubic-bezier(0.25, 1, 0.5, 1)';

      let spacing1 = 340;
      let spacing2 = 520;
      let spacing3 = 680;

      if (isMobile) {
        spacing1 = 220;
        spacing2 = 340;
        spacing3 = 450;
      } else if (isTablet) {
        spacing1 = 280;
        spacing2 = 440;
        spacing3 = 560;
      }

      if (absOffset === 0) {
        item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
        item.style.opacity = '1';
        item.style.zIndex = '10';
        item.style.filter = 'drop-shadow(0 0 30px rgba(0, 210, 255, 0.35))';
      } else if (absOffset === 1) {
        const translateX = sign * spacing1;
        const rotation = isMobile ? 25 : 30;
        const scale = isMobile ? 0.85 : 0.82;
        item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-180px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        item.style.opacity = '0.75';
        item.style.zIndex = '5';
        item.style.filter = 'blur(0.5px)';
      } else if (absOffset === 2) {
        const translateX = sign * spacing2;
        const rotation = isMobile ? 35 : 40;
        const scale = isMobile ? 0.72 : 0.68;
        item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-320px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        item.style.opacity = '0.45';
        item.style.zIndex = '3';
        item.style.filter = 'blur(1.5px)';
      } else {
        const translateX = sign * spacing3;
        item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-450px) rotateY(${-sign * 45}deg) scale(0.55)`;
        item.style.opacity = '0.2';
        item.style.zIndex = '1';
        item.style.filter = 'blur(2px)';
      }
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === carouselIndex);
    });
  }

  function nextCarouselSlide() {
    carouselIndex = (carouselIndex + 1) % portfolioData.length;
    update3DHeroCarousel();
  }

  function prevCarouselSlide() {
    carouselIndex = (carouselIndex - 1 + portfolioData.length) % portfolioData.length;
    update3DHeroCarousel();
  }

  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  if (carouselNextBtn) carouselNextBtn.addEventListener('click', nextCarouselSlide);
  if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', prevCarouselSlide);

  // Auto rotation
  setInterval(() => {
    const carouselView = document.getElementById('heroViewCarousel');
    if (currentSection === 0 && carouselView && carouselView.style.display === 'block') {
      nextCarouselSlide();
    }
  }, 4800);

  // Toggle switch entre Vue Spatiale CADC et 3D Carousel dans le Hero
  const btnHeroSpatial = document.getElementById('btnHeroSpatial');
  const btnHeroCarousel = document.getElementById('btnHeroCarousel');
  const heroViewSpatial = document.getElementById('heroViewSpatial');
  const heroViewCarousel = document.getElementById('heroViewCarousel');

  if (btnHeroSpatial && btnHeroCarousel && heroViewSpatial && heroViewCarousel) {
    btnHeroSpatial.addEventListener('click', () => {
      btnHeroSpatial.classList.add('active');
      btnHeroCarousel.classList.remove('active');
      heroViewSpatial.style.display = 'flex';
      heroViewCarousel.style.display = 'none';
    });

    btnHeroCarousel.addEventListener('click', () => {
      btnHeroCarousel.classList.add('active');
      btnHeroSpatial.classList.remove('active');
      heroViewSpatial.style.display = 'none';
      heroViewCarousel.style.display = 'block';
      update3DHeroCarousel();
    });
  }

  /* ===================================================================
     4. TECHNICAL ARSENAL - GRILLE HEXAGONALE (NEX / PRISM FLUX)
     =================================================================== */
  const skillsData = [
    { name: 'React & Next.js', icon: '⚛️', level: 96, category: 'frontend' },
    { name: 'Node & NestJS', icon: '🟢', level: 94, category: 'backend' },
    { name: 'TypeScript', icon: '📘', level: 92, category: 'frontend' },
    { name: 'AWS & Cloud', icon: '☁️', level: 90, category: 'cloud' },
    { name: 'Docker / K8s', icon: '🐳', level: 88, category: 'cloud' },
    { name: 'Python & AI', icon: '🐍', level: 93, category: 'backend' },
    { name: 'GraphQL API', icon: '◈', level: 89, category: 'backend' },
    { name: 'TensorFlow AI', icon: '🤖', level: 84, category: 'emerging' },
    { name: 'Web3 & Solidity', icon: '🔗', level: 80, category: 'emerging' },
    { name: 'Vue & Nuxt', icon: '💚', level: 87, category: 'frontend' },
    { name: 'PostgreSQL DB', icon: '🐘', level: 95, category: 'backend' },
    { name: 'Cybersecurity', icon: '🛡️', level: 86, category: 'emerging' }
  ];

  function initTechnicalArsenal() {
    const skillsGrid = document.getElementById('skillsGrid');
    const categoryTabs = document.querySelectorAll('.category-tab');
    if (!skillsGrid) return;

    function displaySkills(category = 'all') {
      skillsGrid.innerHTML = '';
      const filtered = category === 'all'
        ? skillsData
        : skillsData.filter((s) => s.category === category);

      filtered.forEach((skill, index) => {
        const hex = document.createElement('div');
        hex.className = 'skill-hexagon';
        hex.style.animationDelay = `${index * 0.08}s`;

        hex.innerHTML = `
          <div class="hexagon-inner">
            <div class="hexagon-content">
              <div class="skill-icon-hex">${skill.icon}</div>
              <div class="skill-name-hex">${skill.name}</div>
              <div class="skill-level">
                <div class="skill-level-fill" style="width: ${skill.level}%"></div>
              </div>
              <div class="skill-percentage-hex">${skill.level}%</div>
            </div>
          </div>
        `;
        skillsGrid.appendChild(hex);
      });
    }

    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        displaySkills(tab.dataset.category);
      });
    });

    displaySkills('all');
  }

  // Toggle switch entre Notre Équipe et Technical Arsenal dans la Section 2
  const btnViewTeam = document.getElementById('btnViewTeam');
  const btnViewSkills = document.getElementById('btnViewSkills');
  const viewTeamContainer = document.getElementById('viewTeamContainer');
  const viewSkillsContainer = document.getElementById('viewSkillsContainer');

  if (btnViewTeam && btnViewSkills && viewTeamContainer && viewSkillsContainer) {
    btnViewTeam.addEventListener('click', () => {
      btnViewTeam.classList.add('active');
      btnViewSkills.classList.remove('active');
      viewTeamContainer.style.display = 'flex';
      viewSkillsContainer.style.display = 'none';
    });

    btnViewSkills.addEventListener('click', () => {
      btnViewSkills.classList.add('active');
      btnViewTeam.classList.remove('active');
      viewTeamContainer.style.display = 'none';
      viewSkillsContainer.style.display = 'block';
    });
  }

  /* ===================================================================
     5. SLIDER 3D DE L'ÉQUIPE (QUI SOMMES-NOUS)
     =================================================================== */
  const sliderItems = document.querySelectorAll('.work--lockup .slider--item');
  const prevBtn = document.querySelector('.slider--prev');
  const nextBtn = document.querySelector('.slider--next');
  let currentTeamIndex = 1;

  function updateTeamSlider(centerIdx) {
    if (!sliderItems || sliderItems.length === 0) return;
    const len = sliderItems.length;
    currentTeamIndex = (centerIdx + len) % len;

    const leftIdx = (currentTeamIndex - 1 + len) % len;
    const rightIdx = (currentTeamIndex + 1) % len;

    sliderItems.forEach((item, idx) => {
      item.classList.remove('slider--item-left', 'slider--item-center', 'slider--item-right');
      if (idx === currentTeamIndex) item.classList.add('slider--item-center');
      else if (idx === leftIdx) item.classList.add('slider--item-left');
      else if (idx === rightIdx) item.classList.add('slider--item-right');
    });
  }

  function nextTeamMember() {
    updateTeamSlider(currentTeamIndex + 1);
  }

  function prevTeamMember() {
    updateTeamSlider(currentTeamIndex - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevTeamMember);
  if (nextBtn) nextBtn.addEventListener('click', nextTeamMember);

  sliderItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (item.classList.contains('slider--item-left')) {
        e.preventDefault();
        prevTeamMember();
      } else if (item.classList.contains('slider--item-right')) {
        e.preventDefault();
        nextTeamMember();
      }
    });
  });

  /* ===================================================================
     6. THEME TOGGLE
     =================================================================== */
  function applyTheme(themeName) {
    if (themeName === 'evening') {
      document.body.classList.remove('theme-night');
      document.body.classList.add('theme-evening');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
          </svg>
        `;
      }
    } else {
      document.body.classList.remove('theme-evening');
      document.body.classList.add('theme-night');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
        `;
      }
    }
    try {
      localStorage.setItem('cadc_theme', themeName);
    } catch (e) {}
  }

  const savedTheme = localStorage.getItem('cadc_theme') || 'night';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isEvening = document.body.classList.contains('theme-evening');
      applyTheme(isEvening ? 'night' : 'evening');
    });
  }

  /* ===================================================================
     7. PERFORMANCE METRICS MODAL & COMPTEURS
     =================================================================== */
  function openMetricsModal() {
    if (!metricsModal) return;
    metricsModal.classList.add('is-active');
    animateMetricsCounters();
  }

  function closeMetricsModal() {
    if (!metricsModal) return;
    metricsModal.classList.remove('is-active');
  }

  if (metricsBtn) metricsBtn.addEventListener('click', openMetricsModal);
  if (metricsModalClose) metricsModalClose.addEventListener('click', closeMetricsModal);
  if (metricsModal) {
    metricsModal.addEventListener('click', (e) => {
      if (e.target === metricsModal) closeMetricsModal();
    });
  }

  function animateMetricsCounters() {
    const counterElements = document.querySelectorAll('.metric-value[data-target]');
    counterElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1400;
      const startTime = performance.now();

      function updateCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        if (isDecimal) {
          el.innerText = currentVal.toFixed(1) + (el.getAttribute('data-suffix') || '');
        } else {
          el.innerText = Math.floor(currentVal) + (el.getAttribute('data-suffix') || '');
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.innerText = (isDecimal ? target.toFixed(1) : target) + (el.getAttribute('data-suffix') || '');
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  /* ===================================================================
     8. PARTICULES CANVAS
     =================================================================== */
  function initParticleCanvas(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = options.count || 50;
    const connectionDist = options.distance || 110;
    const mouseRadius = options.mouseRadius || 140;

    function resize() {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw(color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    let mouse = { x: null, y: null };
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function render() {
      const parentSection = canvas.closest('.l-section');
      if (parentSection && !parentSection.classList.contains('section--is-active')) {
        requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isEvening = document.body.classList.contains('theme-evening');
      const pointColor = isEvening ? 'rgba(255, 159, 67, 0.7)' : 'rgba(0, 210, 255, 0.7)';
      const lineColor = isEvening ? '108, 92, 231' : '15, 51, 255';

      particles.forEach((p, idx) => {
        p.update();
        p.draw(pointColor);

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const alpha = 1 - dist / mouseRadius;
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha * 0.8})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.25;
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(render);
    }
    render();
  }

  /* ===================================================================
     8. CARROUSEL 3D SERVICES & DEVIS
     =================================================================== */
  const hireData = [
    {
      id: 1,
      icon: '💻',
      title: 'Développement Web',
      description: 'Sites vitrines futuristes, plateformes SaaS, portails e-commerce réactifs et performants.',
      tech: ['React / Next.js', 'Node.js', 'PostgreSQL'],
      waLink: 'https://wa.me/237691223916?text=Je%20veux%20un%20D%C3%A9veloppement%20Web',
      mailLink: 'mailto:CADC@gmail.com?subject=Devis%20Web'
    },
    {
      id: 2,
      icon: '📱',
      title: 'Applications Mobiles',
      description: 'Apps natives et hybrides Android / iOS à ergonomie irréprochable et UX premium.',
      tech: ['React Native', 'Flutter', 'Firebase'],
      waLink: 'https://wa.me/237691223916?text=Je%20veux%20une%20App%20Mobile',
      mailLink: 'mailto:CADC@gmail.com?subject=Devis%20Mobile'
    },
    {
      id: 3,
      icon: '🎨',
      title: 'Design UI / UX',
      description: 'Identités de marque, maquettes Figma haute fidélité, Design Systems et prototypes.',
      tech: ['Figma', 'Design System', 'Motion UI'],
      waLink: 'https://wa.me/237691223916?text=Je%20veux%20du%20Design%20UIUX',
      mailLink: 'mailto:CADC@gmail.com?subject=Devis%20Design'
    },
    {
      id: 4,
      icon: '☁️',
      title: 'Cloud & DevOps',
      description: 'Déploiement AWS/GCP, automatisation CI/CD, containers Docker et sécurité serveurs.',
      tech: ['AWS / GCP', 'Docker / K8s', 'CI/CD GitLab'],
      waLink: 'https://wa.me/237691223916?text=Je%20veux%20du%20Cloud%20DevOps',
      mailLink: 'mailto:CADC@gmail.com?subject=Devis%20Cloud'
    },
    {
      id: 5,
      icon: '🤖',
      title: 'IA & Automation',
      description: 'Agents intelligents, bots WhatsApp/Telegram, scraping et automatisation métier avancée.',
      tech: ['LLM / OpenAI', 'Make / n8n', 'Python AI'],
      waLink: 'https://wa.me/237691223916?text=Je%20veux%20de%20l%20IA',
      mailLink: 'mailto:CADC@gmail.com?subject=Devis%20IA'
    },
    {
      id: 6,
      icon: '📈',
      title: 'Growth & Marketing',
      description: 'Acquisition client ciblée, SEO technique, réseaux sociaux et entonnoir de conversion maximale.',
      tech: ['SEO / SEM', 'Analytics', 'Social Ads'],
      waLink: 'https://wa.me/237691223916?text=Je%20veux%20du%20Growth%20Marketing',
      mailLink: 'mailto:CADC@gmail.com?subject=Devis%20Growth'
    }
  ];

  let hireCarouselIndex = 0;
  let hireAutoplay = null;

  function initHireCarousel() {
    const hireCarousel = document.getElementById('hire-carousel');
    const hireIndicatorsEl = document.getElementById('hire-indicators');
    if (!hireCarousel || !hireIndicatorsEl) return;

    hireCarousel.innerHTML = '';
    hireIndicatorsEl.innerHTML = '';

    hireData.forEach((data, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      item.dataset.index = index;

      const techBadges = data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');

      item.innerHTML = `
        <div class="card hire-card-3d">
          <div class="card-number">0${data.id}</div>
          <div class="hire-icon-3d">${data.icon}</div>
          <h3 class="card-title">${data.title}</h3>
          <p class="card-description">${data.description}</p>
          <div class="card-tech">${techBadges}</div>
          <div class="hire-actions-3d">
            <a href="${data.waLink}" target="_blank" rel="noopener noreferrer" class="hire-btn whatsapp">
              📞 WhatsApp
            </a>
            <a href="${data.mailLink}" class="hire-btn email">
              ✉️ Email
            </a>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (index !== hireCarouselIndex) {
          hireCarouselIndex = index;
          updateHireCarousel();
        }
      });

      hireCarousel.appendChild(item);

      const dot = document.createElement('div');
      dot.className = 'indicator' + (index === 0 ? ' active' : '');
      dot.dataset.index = index;
      dot.addEventListener('click', () => {
        hireCarouselIndex = index;
        updateHireCarousel();
      });
      hireIndicatorsEl.appendChild(dot);
    });

    updateHireCarousel();
    startHireAutoplay();

    // Arrow buttons
    const prevBtn = document.getElementById('hire-prev');
    const nextBtn = document.getElementById('hire-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hireCarouselIndex = (hireCarouselIndex - 1 + hireData.length) % hireData.length;
        updateHireCarousel();
        resetHireAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hireCarouselIndex = (hireCarouselIndex + 1) % hireData.length;
        updateHireCarousel();
        resetHireAutoplay();
      });
    }

    // Touch swipe inside carousel (horizontal)
    let hTouchStartX = 0;
    let hTouchStartY = 0;
    const container = document.getElementById('hire-carousel-container');
    if (container) {
      container.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          hTouchStartX = e.touches[0].clientX;
          hTouchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      container.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const dx = hTouchStartX - e.changedTouches[0].clientX;
        const dy = hTouchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe inside carousel → change card, DON'T change section
          e.stopPropagation();
          if (dx > 0) {
            hireCarouselIndex = (hireCarouselIndex + 1) % hireData.length;
          } else {
            hireCarouselIndex = (hireCarouselIndex - 1 + hireData.length) % hireData.length;
          }
          updateHireCarousel();
          resetHireAutoplay();
        }
      }, { passive: true });
    }
  }

  function updateHireCarousel() {
    const items = document.querySelectorAll('#hire-carousel .carousel-item');
    const dots = document.querySelectorAll('#hire-indicators .indicator');
    const total = items.length;
    if (!total) return;

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;

    items.forEach((item, index) => {
      const offset = index - hireCarouselIndex;
      const absOffset = Math.abs(offset);

      item.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2', 'hidden');

      if (offset === 0) {
        item.classList.add('active');
        item.style.cssText = 'opacity:1; transform:translateX(0) translateZ(0) scale(1); z-index:5; pointer-events:auto;';
      } else if (offset === -1 || offset === total - 1) {
        item.classList.add('left-1');
        const tx = isMobile ? '-120px' : isTablet ? '-200px' : '-280px';
        item.style.cssText = `opacity:${isMobile ? '0' : '0.5'}; transform:translateX(${tx}) translateZ(-80px) scale(0.82) rotateY(20deg); z-index:3; pointer-events:${isMobile ? 'none' : 'auto'};`;
      } else if (offset === 1 || offset === -(total - 1)) {
        item.classList.add('right-1');
        const tx = isMobile ? '120px' : isTablet ? '200px' : '280px';
        item.style.cssText = `opacity:${isMobile ? '0' : '0.5'}; transform:translateX(${tx}) translateZ(-80px) scale(0.82) rotateY(-20deg); z-index:3; pointer-events:${isMobile ? 'none' : 'auto'};`;
      } else {
        item.classList.add('hidden');
        item.style.cssText = 'opacity:0; transform:scale(0.6); z-index:1; pointer-events:none;';
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === hireCarouselIndex);
    });
  }

  function startHireAutoplay() {
    hireAutoplay = setInterval(() => {
      if (currentSection === 4) { // Section Services
        hireCarouselIndex = (hireCarouselIndex + 1) % hireData.length;
        updateHireCarousel();
      }
    }, 4000);
  }

  function resetHireAutoplay() {
    clearInterval(hireAutoplay);
    startHireAutoplay();
  }

  // Initialisation Globale
  document.addEventListener('DOMContentLoaded', () => {
    init3DHeroCarousel();
    initHireCarousel();
    initTechnicalArsenal();
    initParticleCanvas('intro-particles', { count: 50, distance: 110 });
    initParticleCanvas('work-particles', { count: 45, distance: 100 });
    initParticleCanvas('about-particles', { count: 50, distance: 110 });
    initParticleCanvas('contact-particles', { count: 65, distance: 120 });
    initParticleCanvas('hire-particles', { count: 45, distance: 100 });
  });

  // Global helper
  window.cadcGoTo = goToSection;

  goToSection(0);
})();
