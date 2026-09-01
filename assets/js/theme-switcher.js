/**
 * 🌓 Système de Changement de Thème Automatique selon l'heure
 * 
 * Thèmes:
 * - JOUR (6h-18h): Fond blanc, texte gris foncé
 * - SOIRÉE (18h-22h): Fond gris, texte blanc
 * - NUIT (22h-6h): Fond noir, texte blanc
 */

class ThemeSwitcher {
  constructor() {
    this.themes = {
      evening: {
        name: 'evening',
        startHour: 18,
        endHour: 22,
        colors: {
          background: 'linear-gradient(135deg, #3a3a3a 0%, #4a4a5a 50%, #2a2a4a 100%)',
          text: '#ffffff',
          accent: '#5a7cff',
          muted: '#999999',
          border: '#555555',
          card: '#454545',
          shadow: 'rgba(0, 0, 0, 0.3)'
        }
      },
      night: {
        name: 'night',
        startHour: 22,
        endHour: 6,
        colors: {
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #0f33ff 100%)',
          text: '#ffffff',
          accent: '#5a7cff',
          muted: '#666666',
          border: '#282828',
          card: '#1a1a1a',
          shadow: 'rgba(0, 0, 0, 0.5)'
        }
      }
    };

    this.currentTheme = null;
    this.init();
  }

  /**
   * Initialise le système de thème
   */
  init() {
    // Appliquer le thème initial
    this.applyCurrentTheme();

    // Vérifier le thème toutes les minutes
    setInterval(() => {
      this.applyCurrentTheme();
    }, 60000); // 60 secondes

    // Écouter les changements de classe body pour les transitions lisses
    this.setupTransitions();
  }

  /**
   * Détermine le thème actuel selon l'heure
   */
  getCurrentTheme() {
    const now = new Date();
    const hour = now.getHours();

    // Vérifier NUIT en premier (car il traverse minuit: 22h-6h)
    if (hour >= this.themes.night.startHour || hour < this.themes.night.endHour) {
      return this.themes.night;
    }
    // SOIRÉE (18h-22h)
    else if (hour >= this.themes.evening.startHour && hour < this.themes.evening.endHour) {
      return this.themes.evening;
    }
    // NUIT par défaut (6h-18h)
    else {
      return this.themes.night;
    }
  }

  /**
   * Applique le thème actuel
   */
  applyCurrentTheme() {
    const theme = this.getCurrentTheme();

    // Vérifier si le thème a changé
    if (this.currentTheme && this.currentTheme.name === theme.name) {
      return; // Pas de changement
    }

    this.currentTheme = theme;

    // Appliquer les variables CSS
    this.applyCSSVariables(theme);

    // Ajouter une classe au body pour les styles spécifiques
    this.updateBodyClass(theme);

    // Déclencher un événement personnalisé
    this.dispatchThemeChangeEvent(theme);

    // Log pour debug
    console.log(`🎨 Thème changé: ${theme.name} (${this.getTimeRange(theme)})`);
  }

  /**
   * Applique les variables CSS personnalisées
   */
  applyCSSVariables(theme) {
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
    
    // Mettre à jour la meta theme-color pour le navigateur mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor && theme.colors.background) {
      metaThemeColor.setAttribute('content', theme.colors.background);
    }

    // Variables additionnelles pour la transition
    root.style.setProperty('--theme-name', `'${theme.name}'`);
  }

  /**
   * Met à jour la classe du body
   */
  updateBodyClass(theme) {
    // Supprimer les anciennes classes de thème
    document.body.classList.remove('theme-day', 'theme-evening', 'theme-night');

    // Ajouter la nouvelle classe
    document.body.classList.add(`theme-${theme.name}`);

    // Ajouter une classe pour la transition
    document.body.classList.add('theme-transitioning');
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300);
  }

  /**
   * Configure les transitions lisses entre thèmes
   */
  setupTransitions() {
    // Ajouter un style pour les transitions
    if (!document.getElementById('theme-transitions')) {
      const style = document.createElement('style');
      style.id = 'theme-transitions';
      style.textContent = `
        body.theme-transitioning,
        body.theme-transitioning * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Déclenche un événement personnalisé pour le changement de thème
   */
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themeChanged', {
      detail: {
        theme: theme.name,
        colors: theme.colors,
        timestamp: new Date()
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Retourne l'intervalle horaire du thème
   */
  getTimeRange(theme) {
    if (theme.name === 'nuit') {
      return `22:00 - 06:00`;
    }
    return `${theme.startHour}:00 - ${theme.endHour}:00`;
  }

  /**
   * Obtient l'heure actuelle formatée
   */
  getCurrentTimeFormatted() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  /**
   * Force un thème spécifique (utile pour les tests)
   */
  forceTheme(themeName) {
    const theme = Object.values(this.themes).find(t => t.name === themeName);
    if (theme) {
      this.currentTheme = theme;
      this.applyCSSVariables(theme);
      this.updateBodyClass(theme);
      console.log(`🔧 Thème forcé: ${themeName}`);
    }
  }

  /**
   * Obtient les informations du thème actuel
   */
  getThemeInfo() {
    return {
      current: this.currentTheme.name,
      time: this.getCurrentTimeFormatted(),
      colors: this.currentTheme.colors
    };
  }
}

// Initialiser le ThemeSwitcher quand le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
  });
} else {
  window.themeSwitcher = new ThemeSwitcher();
}
