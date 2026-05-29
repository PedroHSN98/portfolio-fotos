'use strict';

const BookAnimation = (() => {
  let scene, wrapper, cover, openBtn, intro;
  let dustParticles = [];
  let isOpen = false;
  let autoOpenTimer = null;

  function init() {
    scene    = document.querySelector('.book-scene');
    wrapper  = document.querySelector('.book-wrapper');
    cover    = document.querySelector('.book-cover');
    openBtn  = document.querySelector('.btn-open-book');
    intro    = document.getElementById('intro');

    if (!scene) return;

    bindEvents();
    scheduleAutoOpen();
  }

  function bindEvents() {
    if (openBtn) {
      openBtn.addEventListener('click', openBook);
    }

    cover.addEventListener('click', openBook);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openBook();
    });
  }

  function scheduleAutoOpen() {
    autoOpenTimer = setTimeout(() => {
      if (!isOpen) pulseHint();
    }, 3000);
  }

  function pulseHint() {
    if (!openBtn || isOpen) return;
    openBtn.classList.add('pulse');
    setTimeout(() => openBtn && openBtn.classList.remove('pulse'), 2000);
  }

  function openBook() {
    if (isOpen) return;
    isOpen = true;

    clearTimeout(autoOpenTimer);

    // Add open state
    scene.classList.add('is-open');

    // Spawn dust particles
    spawnDust();

    // Transition to main site after animation completes
    const openDuration = getCSSVar('--book-open-duration');
    const delay = parseDuration(openDuration) + 400;

    setTimeout(() => {
      revealMainSite();
    }, delay);
  }

  function spawnDust() {
    const numParticles = 12;

    for (let i = 0; i < numParticles; i++) {
      setTimeout(() => {
        const dust = document.createElement('div');
        dust.className = 'book-dust';

        const x = (Math.random() - 0.5) * 200;
        const y = -(40 + Math.random() * 80);
        const size = 2 + Math.random() * 4;

        dust.style.cssText = `
          left: calc(50% + ${(Math.random() - 0.5) * 100}px);
          top: 50%;
          width: ${size}px;
          height: ${size}px;
          --dx: ${x}px;
          --dy: ${y}px;
        `;

        scene.appendChild(dust);
        dustParticles.push(dust);

        // Trigger animation
        requestAnimationFrame(() => {
          dust.style.animation = `dustFloat ${1 + Math.random()}s ease-out forwards`;
        });

        setTimeout(() => dust.remove(), 2000);
      }, i * 60);
    }
  }

  function revealMainSite() {
    // Fade out intro
    if (intro) {
      intro.classList.add('hidden');
    }

    // Reveal main site
    const mainSite = document.getElementById('main-site');
    if (mainSite) {
      mainSite.classList.add('visible');
    }

    // Re-enable scrolling
    document.body.style.overflow = '';

    // Remove intro from DOM after transition
    setTimeout(() => {
      if (intro) intro.remove();
    }, 1000);
  }

  // Helper: read a CSS custom property from :root
  function getCSSVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  // Helper: parse "1.4s" or "1400ms" → number (ms)
  function parseDuration(str) {
    if (!str) return 1400;
    if (str.endsWith('ms')) return parseFloat(str);
    if (str.endsWith('s'))  return parseFloat(str) * 1000;
    return 1400;
  }

  return { init };
})();
