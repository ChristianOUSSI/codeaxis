/**
 * Pile technique CODE AXIS, source unique.
 * Alimente la grille hexagonale de la home et la page developpement.html.
 */
(function () {
  'use strict';

  window.CADC_STACK_CATEGORIES = [
    { key: 'frontend', label: 'Frontend & UI' },
    { key: 'backend', label: 'Backend & API' },
    { key: 'cloud', label: 'Cloud & DevOps' },
    { key: 'emerging', label: 'IA & Web3' }
  ];

  window.CADC_STACK = [
    { name: 'React & Next.js', icon: 'atom', category: 'frontend' },
    { name: 'TypeScript', icon: 'code', category: 'frontend' },
    { name: 'Vue & Nuxt', icon: 'node', category: 'frontend' },
    { name: 'Flutter', icon: 'mobile', category: 'frontend' },
    { name: 'React Native', icon: 'phone', category: 'frontend' },
    { name: 'Kotlin & Swift', icon: 'phone', category: 'frontend' },
    { name: 'Node & NestJS', icon: 'cpu', category: 'backend' },
    { name: 'Python & IA', icon: 'bulb', category: 'backend' },
    { name: 'Go', icon: 'gear', category: 'backend' },
    { name: 'GraphQL', icon: 'link', category: 'backend' },
    { name: 'PostgreSQL', icon: 'database', category: 'backend' },
    { name: 'MongoDB', icon: 'database', category: 'backend' },
    { name: 'Redis', icon: 'bolt', category: 'backend' },
    { name: 'AWS & Cloud', icon: 'cloud', category: 'cloud' },
    { name: 'Docker / K8s', icon: 'container', category: 'cloud' },
    { name: 'CI/CD', icon: 'gear', category: 'cloud' },
    { name: 'Nginx', icon: 'antenna', category: 'cloud' },
    { name: 'Terraform', icon: 'wrench', category: 'cloud' },
    { name: 'TensorFlow', icon: 'cpu', category: 'emerging' },
    { name: 'Web3 & Solidity', icon: 'node', category: 'emerging' },
    { name: 'Cybersécurité', icon: 'shield', category: 'emerging' },
    { name: 'WebRTC', icon: 'video', category: 'emerging' }
  ];
})();
