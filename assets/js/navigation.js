'use strict';

const Navigation = (() => {
  let navbar, hamburger, navLinks;
  let isMobileOpen = false;

  function init() {
    navbar    = document.querySelector('.navbar');
    hamburger = document.querySelector('.nav-hamburger');
    navLinks  = document.querySelector('.nav-links');

    if (!navbar) return;

    initScroll();
    initHamburger();
    initSmoothScroll();
    initActiveLinks();
  }

  function initScroll() {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function onScroll() {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
  }

  function initHamburger() {
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
      isMobileOpen = !isMobileOpen;
      hamburger.classList.toggle('open', isMobileOpen);
      navLinks.classList.toggle('open', isMobileOpen);
      document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (isMobileOpen && !navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    isMobileOpen = false;
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();

        const navH = navbar ? navbar.offsetHeight : 70;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a[href^="#"]');

    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          links.forEach(link => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('active', active);
          });
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(s => observer.observe(s));
  }

  return { init };
})();
