/**
 * ===================================================================
 * CODE AXIS - Agence web & mobile à Douala | Moteur interactif maître
 * Navigation 3D, carrousel produits evo, pile technique, thèmes & particules
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

  /* Index de section déclaré par data-section */
  function sectionOf(el) {
    const v = el.getAttribute && el.getAttribute('data-section');
    return v === null || v === undefined ? -1 : parseInt(v, 10);
  }

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
    } catch (e) {}

    sections.forEach((sec, idx) => {
      sec.classList.remove('section--is-active');
      if (idx === currentSection) {
        sec.classList.add('section--is-active');
      }
    });

    sideNavItems.forEach((item) => {
      const target = sectionOf(item);
      item.classList.toggle('is-active', target !== -1 && target === currentSection);
    });

    outerNavItems.forEach((item) => {
      const target = sectionOf(item);
      item.classList.toggle('is-active', target !== -1 && target === currentSection);
    });

    // Mettre à jour les liens du header
    document.querySelectorAll('.header--nav-links a').forEach((link) => {
      const target = sectionOf(link);
      link.classList.toggle('active', target !== -1 && target === currentSection);
    });

    setTimeout(() => {
      isNavigating = false;
    }, skipCooldown ? 50 : navigationCooldown);
  }

  // Restauration automatique de la section précédente si retour arrière
  try {
    const hashMatch = window.location.hash.match(/#section-(\d+)/);
    const savedSec = hashMatch ? parseInt(hashMatch[1], 10) : parseInt(sessionStorage.getItem('cadc_last_section'), 10);
    if (!isNaN(savedSec) && savedSec >= 0 && savedSec < totalSections && savedSec !== 0) {
      setTimeout(() => { goToSection(savedSec, true); }, 30);
    }
  } catch (e) {}

  /* Arbitrage du défilement imbriqué : un conteneur qui peut faire défiler son contenu
     (pile technique, rails, grilles) garde la main. On ne change de section
     qu'une fois ce conteneur arrivé à son bord dans le sens du geste. */
  function nestedScrollerTakes(el, dir) {
    let node = el && el.nodeType === 3 ? el.parentElement : el;
    while (node && node !== document.body && node !== document.documentElement) {
      let cs;
      try { cs = getComputedStyle(node); } catch (e) { return false; }
      const oy = cs.overflowY;
      if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight - node.clientHeight > 4) {
        return dir > 0
          ? node.scrollTop + node.clientHeight < node.scrollHeight - 2
          : node.scrollTop > 2;
      }
      node = node.parentElement;
    }
    return false;
  }

  function nextSection() {
    if (currentSection < totalSections - 1) goToSection(currentSection + 1);
  }

  function prevSection() {
    if (currentSection > 0) goToSection(currentSection - 1);
  }

  // Événement Molette moderne avec normalisation de l'inertie
  let wheelAccumulator = 0;
  let wheelTimer = null;

  window.addEventListener(
    'wheel',
    function (e) {
      if (perspectiveContainer && perspectiveContainer.classList.contains('effect-rotate-left--animate')) return;

      /* Molette sur la bande presse : elle défile à l'horizontale */
      const press = e.target && e.target.closest && e.target.closest('.hn-press-track');
      if (press) { press.scrollLeft += e.deltaY; return; }

      /* Molette sur une zone défilante : on laisse le navigateur la faire défiler */
      if (nestedScrollerTakes(e.target, e.deltaY > 0 ? 1 : -1)) return;

      e.preventDefault();
      if (isNavigating) return;

      wheelAccumulator += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 200);

      const threshold = 110;
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

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      e.preventDefault();
      nextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      prevSection();
    }
  });

  // Touch Swipe Intelligent & Anti-Sauts Intempestifs sur Mobile
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;
  let touchTarget = null;

  window.addEventListener(
    'touchstart',
    function (e) {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        touchTarget = e.target;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    function (e) {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      if (perspectiveContainer && perspectiveContainer.classList.contains('effect-rotate-left--animate')) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;
      const elapsed = Date.now() - touchStartTime;
      const absY = Math.abs(deltaY);
      const absX = Math.abs(deltaX);

      // Vérifier si le touch provient d'un carrousel interactif
      const isInsideHeroCarousel = touchTarget && touchTarget.closest('#heroViewCarousel, .carousel-container');
      const isInsideOrbital = touchTarget && touchTarget.closest('#orbitalStage');
      const isInsideHireCarousel = touchTarget && touchTarget.closest('#hireCarouselContainer, #hireCarousel');
      const isInsideSkills = touchTarget && touchTarget.closest('#viewSkillsContainer, .skills-container');
      const isInsidePress = touchTarget && touchTarget.closest('.hn-press-track');
      const isInsideMapOrAction = touchTarget && touchTarget.closest('iframe, a, button, input, select, textarea');

      // Seuil relevé : un frôlement ne déclenche plus de navigation
      const SWIPE_MIN = Math.max(56, window.innerWidth * 0.09);

      // 1. Swipe horizontal à l'intérieur du Carrousel Orbital Équipe
      if (isInsideOrbital && absX > SWIPE_MIN && absX > absY) {
        orbVelocity += (deltaX > 0 ? 1 : -1) * 2.2;
        return;
      }

      // 2. Swipe horizontal à l'intérieur du Carrousel 3D produits evo
      if (isInsideHeroCarousel && absX > SWIPE_MIN && absX > absY) {
        if (deltaX > 0) nextCarouselSlide();
        else prevCarouselSlide();
        return;
      }

      // 3. Swipe horizontal à l'intérieur du Carrousel 3D Services & Devis
      if (isInsideHireCarousel && absX > SWIPE_MIN && absX > absY) {
        if (deltaX > 0) nextHireSlide();
        else prevHireSlide();
        return;
      }

      // Si l'utilisateur clique ou interagit dans un composant, éviter de sauter de section
      if (isInsideMapOrAction && absY < 180) return;
      if ((isInsideHeroCarousel || isInsideOrbital || isInsideHireCarousel || isInsideSkills || isInsidePress) && absY < 180) return;

      // 5. Changement de section global : geste long, vertical et assumé
      if (absY > 150 && absY > 2.4 * absX && elapsed > 120 && elapsed < 900) {
        /* une zone défilante sous le doigt lit d'abord son contenu */
        if (nestedScrollerTakes(touchTarget, deltaY > 0 ? 1 : -1)) return;
        if (deltaY > 0) nextSection();
        else prevSection();
      }
    },
    { passive: true }
  );

  sideNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      const href = item.getAttribute('data-href');
      if (href) { window.location.href = href; return; }
      const target = sectionOf(item);
      if (target !== -1) goToSection(target);
    });
  });

  document.querySelectorAll('.header--nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = sectionOf(link);
      if (target === -1) return; // lien de page : navigation normale
      e.preventDefault();
      goToSection(target);
    });
  });

  /* Liens internes par data-goto (cartes du hero, à propos) */
  document.querySelectorAll('a[data-goto]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goToSection(parseInt(link.getAttribute('data-goto'), 10));
    });
  });

  const homeCtaBtn = document.getElementById('cta-intro-btn');
  if (homeCtaBtn) {
    homeCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSection(5);
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

  outerNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      const href = item.getAttribute('data-href');
      if (href) {
        close3DMenu(() => { window.location.href = href; });
        return;
      }
      const target = sectionOf(item);
      if (target === -1) return;
      close3DMenu(() => {
        goToSection(target);
      });
    });
  });

  /* ===================================================================
     3. CARROUSEL 3D PRODUITS EVO (section Suite evo)
     Fiches réelles de la suite, reprises depuis evo-suite.js
     =================================================================== */
  const FEATURED_EVO = ['evo-gaz', 'evo-clinic', 'evo-shop', 'evo-log', 'evo-hotel', 'evo-market', 'evo-tontaine'];

  const carouselProjects = (window.EvoSuite ? window.EvoSuite.projects : []).filter(function (p) {
    return FEATURED_EVO.indexOf(p.slug) !== -1;
  }).sort(function (a, b) {
    return FEATURED_EVO.indexOf(a.slug) - FEATURED_EVO.indexOf(b.slug);
  });

  const heroLink = window.CADC_ICONS ? ico('arrow', { size: 14 }) : '';

  let carouselIndex = 0;
  const carousel = document.getElementById('carousel');
  const indicatorsContainer = document.getElementById('indicators');

  function init3DHeroCarousel() {
    if (!carousel || !indicatorsContainer) return;
    carousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    carouselProjects.forEach((p, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      item.dataset.index = index;

      item.innerHTML = `
        <div class="card">
          <div class="card-number">0${index + 1}</div>
          <div class="card-image">
            <img src="assets/img/evo/${p.slug}.webp" alt="${p.slug}" loading="lazy" decoding="async">
          </div>
          <div class="card-kicker">${p.tag}</div>
          <h3 class="card-title">${p.slug}</h3>
          <p class="card-description">${p.desc}</p>
          <div class="card-tech"><span class="tech-badge">${p.state}</span></div>
          <a href="suite-evo.html#${p.slug}" class="card-cta">Découvrir ${heroLink}</a>
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
    const items = document.querySelectorAll('.hn-carousel .carousel-item');
    const indicators = document.querySelectorAll('#indicators .indicator');
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

      let spacing1 = 340, spacing2 = 520, spacing3 = 680;
      if (isMobile) { spacing1 = 220; spacing2 = 340; spacing3 = 450; }
      else if (isTablet) { spacing1 = 280; spacing2 = 440; spacing3 = 560; }

      if (absOffset === 0) {
        item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
        item.style.opacity = '1';
        item.style.zIndex = '10';
        item.style.filter = 'drop-shadow(0 0 30px var(--neon-glow-cyan))';
      } else if (absOffset === 1) {
        const rotation = isMobile ? 25 : 30;
        const scale = isMobile ? 0.85 : 0.82;
        item.style.transform = `translate(-50%, -50%) translateX(${sign * spacing1}px) translateZ(-180px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        item.style.opacity = '0.75';
        item.style.zIndex = '5';
        item.style.filter = 'blur(0.5px)';
      } else if (absOffset === 2) {
        const rotation = isMobile ? 35 : 40;
        const scale = isMobile ? 0.72 : 0.68;
        item.style.transform = `translate(-50%, -50%) translateX(${sign * spacing2}px) translateZ(-320px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        item.style.opacity = '0.45';
        item.style.zIndex = '3';
        item.style.filter = 'blur(1.5px)';
      } else {
        item.style.transform = `translate(-50%, -50%) translateX(${sign * spacing3}px) translateZ(-450px) rotateY(${-sign * 45}deg) scale(0.55)`;
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
    carouselIndex = (carouselIndex + 1) % carouselProjects.length;
    update3DHeroCarousel();
  }

  function prevCarouselSlide() {
    carouselIndex = (carouselIndex - 1 + carouselProjects.length) % carouselProjects.length;
    update3DHeroCarousel();
  }

  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  if (carouselNextBtn) carouselNextBtn.addEventListener('click', nextCarouselSlide);
  if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', prevCarouselSlide);

  /* Rotation douce quand la section Suite evo est à l'écran */
  const EVO_SECTION_INDEX = 3;
  setInterval(() => {
    if (currentSection === EVO_SECTION_INDEX) {
      const sec = sections[EVO_SECTION_INDEX];
      if (sec && sec.classList.contains('section--is-active')) nextCarouselSlide();
    }
  }, 4800);

  /* ===================================================================
     4. PILE TECHNIQUE - GRILLE HEXAGONALE (source : stack-data.js)
     =================================================================== */
  const skillsData = window.CADC_STACK || [];

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
              <div class="skill-icon-hex">${ico(skill.icon, { size: 26 })}</div>
              <div class="skill-name-hex">${skill.name}</div>
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

  /* ===================================================================
     4bis. ACTUALITÉ, BANDEAU PRESSE QUI DÉFILE SEUL (section 05)
     =================================================================== */
  var pressTimer = null;

  function renderNewsPeek() {
    const peek = document.getElementById('newsPeek');
    if (!peek || !window.CADC_NEWS) return;
    peek.innerHTML = '';

    CADC_NEWS.slice(0, 6).forEach((n) => {
      const art = document.createElement('a');
      art.className = 'hn-press-card';
      art.href = 'actualites.html#' + encodeURIComponent(window.cadcNewsHash(n));
      art.innerHTML = `
        <span class="hn-press-head"><span class="hn-press-tag">${n.tag}</span><time datetime="${n.date}">${cadcNewsDate(n.date)}</time></span>
        <h3 class="hn-press-title">${n.title}</h3>
        <p class="hn-press-excerpt">${n.excerpt}</p>
      `;
      peek.appendChild(art);
    });

    startPress(peek);
  }

  /* Défilement type kiosque : un cran toutes les 4,5 s, boucle douce,
     pause dès que la main ou le curseur entre dans la bande */
  function startPress(track) {
    if (pressTimer) clearInterval(pressTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let paused = false;
    ['pointerenter', 'focusin', 'touchstart'].forEach((ev) => track.addEventListener(ev, () => { paused = true; }, { passive: true }));
    ['pointerleave', 'focusout'].forEach((ev) => track.addEventListener(ev, () => { paused = false; }));

    pressTimer = setInterval(() => {
      if (paused || document.hidden) return;
      const card = track.querySelector('.hn-press-card');
      if (!card) return;
      const step = card.getBoundingClientRect().width + 14;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: 'smooth' });
    }, 4500);
  }

  /* ===================================================================
     3bis. ANNEAU ORBITAL DE L'ÉQUIPE
     =================================================================== */
  const teamData = [
    { name: 'Christian OUSSI', role: 'Directeur & Lead Fullstack', initials: 'CO', link: 'christian-oussi.html' },
    { name: 'YANN', role: 'Backend & Cloud Infrastructure', initials: 'Y', link: 'marc-laurent.html' },
    { name: 'PHILIPPE', role: 'Data, IA & Automatisation', initials: 'P', link: 'sarah-martin.html' },
    { name: 'FRANKY', role: 'Lead UI / UX Designer', initials: 'F', link: 'axel-dupont.html' }
  ];

  const orbitalRing = document.getElementById('orbitalRing');
  const orbitalStage = document.getElementById('orbitalStage');
  const orbitalParallax = document.getElementById('orbitalParallax');
  const orbitalTilt = document.getElementById('orbitalTilt');
  const viewOrbitalContainer = document.getElementById('viewOrbitalContainer');
  const orbReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const orbSpacingLevels = [0.74, 0.92, 1.08];
  let orbSpacingIndex = 1;
  let orbRotation = 0;
  let orbVelocity = 0;
  const ORB_DRIFT = orbReduceMotion ? 0 : 0.12;
  const ORB_FRICTION = 0.94;
  const ORB_MAX_VEL = 7;
  const ORB_DRAG_SENS = 0.32;
  const ORB_WHEEL_SENS = 0.05;

  function applyOrbitalRadius() {
    if (!orbitalRing) return;
    const base = parseFloat(getComputedStyle(orbitalRing).getPropertyValue('--orb-radius')) || 340;
    const r = base * orbSpacingLevels[orbSpacingIndex];
    orbitalRing.querySelectorAll('.orb-panel').forEach((p) => {
      p.style.setProperty('--tz', r + 'px');
    });
  }

  function initOrbitalRing() {
    if (!orbitalRing) return;
    orbitalRing.innerHTML = '';
    const count = teamData.length;
    teamData.forEach((member, i) => {
      const panel = document.createElement('a');
      panel.className = 'orb-panel';
      panel.href = member.link;
      const angle = (360 / count) * i;
      const tilt = Math.sin((i / count) * Math.PI * 2) * 8;
      panel.style.setProperty('--ry', angle + 'deg');
      panel.style.setProperty('--rz', tilt.toFixed(2) + 'deg');
      panel.innerHTML = `
        <span class="orb-face orb-face--member">
          <span class="orb-avatar">${member.initials}</span>
          <span class="orb-member-name">${member.name}</span>
          <span class="orb-member-role">${member.role}</span>
        </span>`;
      orbitalRing.appendChild(panel);
    });
    applyOrbitalRadius();
  }
  initOrbitalRing();

  let orbResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(orbResizeTimer);
    orbResizeTimer = setTimeout(applyOrbitalRadius, 200);
  });

  /* Espacement du ring (resserré / par défaut / large) */
  const orbSpacingBtns = document.querySelectorAll('.orb-spacing button');
  orbSpacingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      orbSpacingIndex = parseInt(btn.getAttribute('data-space'), 10) || 0;
      applyOrbitalRadius();
      orbSpacingBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
    });
  });

  /* Zoom du ring */
  const orbZoomSwitch = document.getElementById('orbZoomSwitch');
  if (orbZoomSwitch && orbitalTilt) {
    orbZoomSwitch.addEventListener('click', () => {
      const on = orbZoomSwitch.getAttribute('aria-checked') !== 'true';
      orbZoomSwitch.setAttribute('aria-checked', on ? 'true' : 'false');
      orbitalTilt.style.setProperty('--zoom', on ? '1.24' : '1');
    });
  }

  /* Glisser pour faire pivoter + inertie + parallax curseur */
  let orbDragging = false;
  let orbLastX = 0;
  let orbMoved = 0;
  let orbTargetX = 0, orbTargetY = 0, orbCurX = 0, orbCurY = 0;
  const ORB_RANGE_Y = 24;
  const ORB_RANGE_X = 14;
  const ORB_BIAS_X = 8;

  function orbVisible() {
    return !document.hidden &&
           !!viewOrbitalContainer && viewOrbitalContainer.classList.contains('is-active');
  }

  if (orbitalStage) {
    orbitalStage.addEventListener('pointerdown', (e) => {
      orbDragging = true;
      orbMoved = 0;
      orbLastX = e.clientX;
      orbVelocity = 0;
      orbitalStage.classList.add('orb-dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (orbDragging) {
        const dx = e.clientX - orbLastX;
        orbLastX = e.clientX;
        orbMoved += Math.abs(dx);
        const step = dx * ORB_DRAG_SENS;
        orbRotation += step;
        orbVelocity = Math.max(-ORB_MAX_VEL, Math.min(ORB_MAX_VEL, step));
      }
      if (!orbReduceMotion && orbitalParallax) {
        const mx = (e.clientX / window.innerWidth) - 0.5;
        const my = (e.clientY / window.innerHeight) - 0.5;
        orbTargetY = mx * ORB_RANGE_Y;
        orbTargetX = (-my * ORB_RANGE_X) + ORB_BIAS_X;
      }
    });
    const orbEndDrag = () => {
      if (!orbDragging) return;
      orbDragging = false;
      orbitalStage.classList.remove('orb-dragging');
    };
    window.addEventListener('pointerup', orbEndDrag);
    window.addEventListener('pointercancel', orbEndDrag);

    /* Un glisser-déposer ne doit pas déclencher le lien de la fiche membre */
    orbitalStage.addEventListener('click', (e) => {
      if (orbMoved > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    /* Molette horizontale / piste tactile */
    orbitalStage.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        orbVelocity = Math.max(-ORB_MAX_VEL, Math.min(ORB_MAX_VEL, orbVelocity + e.deltaX * ORB_WHEEL_SENS));
      }
    }, { passive: false });
  }

  /* Rotation automatique douce lorsque la vue est visible */
  setInterval(() => {
    if (orbVisible() && !orbDragging) {
      orbVelocity += 1.1;
    }
  }, 4800);

  /* Boucle d'animation unique : rotation + parallax */
  (function orbitalFrame() {
    if (orbVisible()) {
      if (!orbDragging) {
        orbRotation += ORB_DRIFT + orbVelocity;
        orbVelocity *= ORB_FRICTION;
        if (Math.abs(orbVelocity) < 0.0015) orbVelocity = 0;
      }
      if (orbitalRing) {
        orbitalRing.style.transform = 'rotateY(' + orbRotation.toFixed(3) + 'deg)';
      }
      if (!orbReduceMotion && orbitalParallax) {
        orbCurX += (orbTargetX - orbCurX) * 0.06;
        orbCurY += (orbTargetY - orbCurY) * 0.06;
        orbitalParallax.style.transform = 'rotateX(' + orbCurX.toFixed(2) + 'deg) rotateY(' + orbCurY.toFixed(2) + 'deg)';
      }
    }
    requestAnimationFrame(orbitalFrame);
  })();

  /* Toggle switch entre Notre Équipe et Pile technique dans la Section 2 */
  const btnViewOrbital = document.getElementById('btnViewOrbital');
  const btnViewSkills = document.getElementById('btnViewSkills');
  const viewSkillsContainer = document.getElementById('viewSkillsContainer');

  if (btnViewOrbital && btnViewSkills && viewSkillsContainer && viewOrbitalContainer) {
    const showOrbital = () => {
      viewOrbitalContainer.classList.add('is-active');
      viewSkillsContainer.style.display = 'none';
      btnViewOrbital.classList.add('active');
      btnViewSkills.classList.remove('active');
      applyOrbitalRadius();
    };

    btnViewOrbital.addEventListener('click', showOrbital);

    btnViewSkills.addEventListener('click', () => {
      viewOrbitalContainer.classList.remove('is-active');
      viewSkillsContainer.style.display = 'block';
      btnViewSkills.classList.add('active');
      btnViewOrbital.classList.remove('active');
    });
  }

  /* ===================================================================
     6. THEME TOGGLE
     =================================================================== */
  const THEME_ICONS = {
    night: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>`,
    day: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36l-1.06 1.06c-.39-.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
          </svg>`,
    evening: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
          </svg>`
  };
  const THEME_ORDER = ['night', 'day', 'evening'];
  const THEME_LABELS = {
    fr: { night: 'nuit', day: 'jour', evening: 'soirée' },
    en: { night: 'night', day: 'day', evening: 'evening' }
  };

  function applyTheme(themeName) {
    document.body.classList.remove('theme-night', 'theme-day', 'theme-evening');
    document.body.classList.add(`theme-${themeName}`);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = THEME_ICONS[themeName] || THEME_ICONS.night;
      const lang = (window.cadcLang && window.cadcLang()) || 'fr';
      const label = THEME_LABELS[lang][themeName];
      themeToggleBtn.title = lang === 'en'
        ? `${label} theme, click to change`
        : `Thème ${label}, cliquer pour changer`;
    }
    try {
      localStorage.setItem('cadc_theme', themeName);
    } catch (e) {}
  }

  const savedTheme = localStorage.getItem('cadc_theme') || 'night';
  applyTheme(THEME_ORDER.includes(savedTheme) ? savedTheme : 'night');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = THEME_ORDER.find((t) => document.body.classList.contains(`theme-${t}`)) || 'night';
      const next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
      applyTheme(next);
    });
    document.documentElement.addEventListener('cadc:lang', () => {
      const current = THEME_ORDER.find((t) => document.body.classList.contains(`theme-${t}`)) || 'night';
      applyTheme(current);
    });
  }

  /* ===================================================================
     7. PARTICULES CANVAS
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
      // Pause si la section est inactive OU si la page est en arrière-plan
      if (document.hidden ||
          (parentSection && !parentSection.classList.contains('section--is-active'))) {
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
     8. 3D SERVICES & DEVIS CAROUSEL (section Services)
     =================================================================== */
  const T = {
    fr: {
      wa: 'Bonjour CODE AXIS, je souhaite un devis pour',
      mail: 'Devis CODE AXIS :',
    },
    en: {
      wa: 'Hello CODE AXIS, I would like a quote for',
      mail: 'CODE AXIS quote:',
    }
  };

  const hireServicesData = [
    {
      id: 1,
      title: 'Développement Web',
      badge: 'Web & SaaS',
      icon: 'laptop',
      description: 'Sites vitrines, plateformes SaaS, boutiques en ligne et tableaux de bord, hébergés et maintenus par nos soins.',
      tech: ['React & Next.js', 'Node & NestJS', 'PostgreSQL'],
      waSubject: 'Développement Web',
      mailSubject: 'Développement Web'
    },
    {
      id: 2,
      title: 'Applications Mobiles',
      badge: 'Android & iOS',
      icon: 'mobile',
      description: 'Applications pensées pour les réseaux d’ici : mode hors-ligne, Orange Money, MTN MoMo, installations par APK quand le Play Store tarde.',
      tech: ['Flutter', 'React Native', 'Kotlin & Swift'],
      waSubject: 'une application mobile',
      mailSubject: 'Application mobile'
    },
    {
      id: 3,
      title: 'Design UI / UX',
      badge: 'Identité & maquettes',
      icon: 'palette',
      description: 'Identités visuelles, maquettes Figma et prototypes testés sur les téléphones réellement utilisés par vos clients.',
      tech: ['Figma', 'Design System', 'Motion', 'Audit UX'],
      waSubject: 'une prestation Design UI/UX',
      mailSubject: 'Design UI/UX'
    },
    {
      id: 4,
      title: 'Cloud & DevOps',
      badge: 'Serveurs & déploiements',
      icon: 'cloud',
      description: 'Mise en serveur, conteneurs, sauvegardes automatiques et pipelines de déploiement. Supervision des applications en production.',
      tech: ['AWS & Cloud', 'Docker / K8s', 'CI/CD', 'Terraform'],
      waSubject: 'une prestation Cloud & DevOps',
      mailSubject: 'Cloud & DevOps'
    },
    {
      id: 5,
      title: 'IA & Automatisation',
      badge: 'Assistants & bots',
      icon: 'bulb',
      description: 'Assistants conversationnels, bots WhatsApp et automatisations de tâches répétitives branchés sur vos outils existants.',
      tech: ['Python & IA', 'TensorFlow', 'WhatsApp API'],
      waSubject: 'une prestation IA et automatisation',
      mailSubject: 'IA & Automatisation'
    },
    {
      id: 6,
      title: 'Référencement & Acquisition',
      badge: 'Visibilité & mesure',
      icon: 'chart',
      description: 'Google Business Profile, SEO local à Douala, campagnes mesurées et tableaux de bord pour suivre ce qui fonctionne vraiment.',
      tech: ['SEO local', 'Google Ads', 'Analytics'],
      waSubject: 'une prestation référencement et acquisition',
      mailSubject: 'Référencement & Acquisition'
    }
  ];

  let hireCarouselIndex = 0;
  const hireCarousel = document.getElementById('hireCarousel');
  const hireIndicatorsContainer = document.getElementById('hireIndicators');
  const hirePrevBtn = document.getElementById('hirePrevBtn');
  const hireNextBtn = document.getElementById('hireNextBtn');

  function serviceHrefs(data) {
    const lang = (window.cadcLang && window.cadcLang()) || 'fr';
    const t = T[lang];
    const wa = 'https://wa.me/237691223916?text=' + encodeURIComponent(`${t.wa} ${data.waSubject}.`);
    const mail = 'mailto:contact@codeaxis.cm?subject=' + encodeURIComponent(`${t.mail} ${data.mailSubject}`);
    return { wa, mail };
  }

  function init3DHireCarousel() {
    if (!hireCarousel || !hireIndicatorsContainer) return;
    hireCarousel.innerHTML = '';
    hireIndicatorsContainer.innerHTML = '';

    hireServicesData.forEach((data, index) => {
      const item = document.createElement('div');
      item.className = 'hire-carousel-item';
      item.dataset.index = index;

      const techBadges = data.tech
        .map((t) => `<span class="hire-card-tech">${t}</span>`)
        .join('');
      const hrefs = serviceHrefs(data);

      item.innerHTML = `
        <div class="hire-card-3d">
          <div class="hire-card-number">0${data.id}</div>
          <div class="hire-card-icon">${ico(data.icon, { size: 34 })}</div>
          <span class="hire-card-badge">${data.badge}</span>
          <h3 class="hire-card-title">${data.title}</h3>
          <p class="hire-card-desc">${data.description}</p>
          <div class="hire-card-techs">${techBadges}</div>
          <div class="hire-card-actions">
            <a href="${hrefs.wa}" target="_blank" rel="noopener noreferrer" class="hire-btn-action whatsapp" data-hire-wa>
              WhatsApp
            </a>
            <a href="${hrefs.mail}" class="hire-btn-action email" data-hire-mail>
              Devis Email
            </a>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (index !== hireCarouselIndex) {
          hireCarouselIndex = index;
          update3DHireCarousel();
        }
      });

      hireCarousel.appendChild(item);

      const indicator = document.createElement('div');
      indicator.className = 'indicator';
      if (index === 0) indicator.classList.add('active');
      indicator.dataset.index = index;
      indicator.addEventListener('click', () => {
        hireCarouselIndex = index;
        update3DHireCarousel();
      });
      hireIndicatorsContainer.appendChild(indicator);
    });

    if (hirePrevBtn) {
      hirePrevBtn.addEventListener('click', () => {
        prevHireSlide();
      });
    }

    if (hireNextBtn) {
      hireNextBtn.addEventListener('click', () => {
        nextHireSlide();
      });
    }

    update3DHireCarousel();
  }

  /* Les liens WhatsApp et mail suivent la langue choisie */
  document.documentElement.addEventListener('cadc:lang', () => {
    document.querySelectorAll('.hire-carousel-item').forEach((item, i) => {
      const data = hireServicesData[i];
      const hrefs = serviceHrefs(data);
      const wa = item.querySelector('[data-hire-wa]');
      const mail = item.querySelector('[data-hire-mail]');
      if (wa) wa.setAttribute('href', hrefs.wa);
      if (mail) mail.setAttribute('href', hrefs.mail);
    });
  });

  function nextHireSlide() {
    hireCarouselIndex = (hireCarouselIndex + 1) % hireServicesData.length;
    update3DHireCarousel();
  }

  function prevHireSlide() {
    hireCarouselIndex = (hireCarouselIndex - 1 + hireServicesData.length) % hireServicesData.length;
    update3DHireCarousel();
  }

  function update3DHireCarousel() {
    const items = document.querySelectorAll('.hire-carousel-item');
    const indicators = document.querySelectorAll('#hireIndicators .indicator');
    const totalItems = items.length;
    if (totalItems === 0) return;

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;

    items.forEach((item, index) => {
      let offset = index - hireCarouselIndex;
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

    const counterEl = document.getElementById('hireCounterCurrent');
    if (counterEl) {
      counterEl.textContent = '0' + (hireCarouselIndex + 1);
    }

    indicators.forEach((ind, index) => {
      if (index === hireCarouselIndex) ind.classList.add('active');
      else ind.classList.remove('active');
    });
  }

  // Initialisation Globale
  document.addEventListener('DOMContentLoaded', () => {
    init3DHeroCarousel();
    init3DHireCarousel();
    initTechnicalArsenal();
    renderNewsPeek();
    initParticleCanvas('intro-particles', { count: 50, distance: 110 });
    initParticleCanvas('work-particles', { count: 45, distance: 100 });
    initParticleCanvas('about-particles', { count: 50, distance: 110 });
    initParticleCanvas('evo-particles', { count: 40, distance: 100 });
    initParticleCanvas('news-particles', { count: 40, distance: 100 });
    initParticleCanvas('contact-particles', { count: 65, distance: 120 });
    initParticleCanvas('hire-particles', { count: 45, distance: 100 });
  });

  window.addEventListener('resize', () => {
    applyOrbitalRadius();
    update3DHeroCarousel();
    update3DHireCarousel();
  });

  // Dates et aperçu d'actualité suivent la langue
  document.documentElement.addEventListener('cadc:lang', renderNewsPeek);

  // Global helper
  window.cadcGoTo = goToSection;

  goToSection(0);
})();
