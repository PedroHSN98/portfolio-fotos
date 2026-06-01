'use strict';

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const Cursor = (() => {
  let cursor, ring;
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  function init() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cursor = document.createElement('div');
    cursor.className = 'cursor';
    ring = document.createElement('div');
    ring.className = 'cursor-ring';

    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      ring.style.opacity   = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity   = '0';
    });

    // Hover interactions
    const hoverTargets = 'a, button, .photo-card, .filter-btn, .service-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add('hover');
        ring.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove('hover');
        ring.classList.remove('hover');
      }
    });

    animate();
  }

  function animate() {
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

    requestAnimationFrame(animate);
  }

  return { init };
})();

/* ============================================
   SCROLL REVEAL
   ============================================ */
const ScrollReveal = (() => {
  function init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
const Testimonials = (() => {
  let slider, dots;
  let current = 0;
  let total   = 0;
  let timer   = null;

  function init() {
    slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    total = slider.children.length;
    dots  = document.querySelectorAll('.testimonials-dots button');

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    startAuto();
  }

  function goTo(index) {
    current = index;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    timer = setInterval(() => {
      goTo((current + 1) % total);
    }, 5000);
  }

  return { init };
})();

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const CounterAnimation = (() => {
  function animateCount(el, target, duration = 1600) {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';

    function update(time) {
      const elapsed  = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * target);

      el.textContent = value.toLocaleString('pt-BR') + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const target = parseInt(entry.target.dataset.count, 10);
          animateCount(entry.target, target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ============================================
   CONTACT FORM
   ============================================ */
const ContactForm = (() => {
  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn     = form.querySelector('[type="submit"]');
      const success = document.getElementById('form-success');

      btn.disabled      = true;
      btn.textContent   = 'Enviando...';

      // Simulated delay (replace with real API call)
      await new Promise(r => setTimeout(r, 1200));

      form.style.display = 'none';
      if (success) success.classList.add('visible');
    });
  }

  return { init };
})();

/* ============================================
   NOISE OVERLAY
   ============================================ */
function initNoiseOverlay() {
  const noise = document.createElement('div');
  noise.className = 'noise-overlay';
  document.body.appendChild(noise);
}

/* ============================================
   BOOT
   ============================================ */
// Scripts are loaded dynamically by loader.js after DOMContentLoaded has already fired.
// Run init directly — the DOM is guaranteed to be ready at this point.
document.body.style.overflow = 'hidden';

BookAnimation.init();
Cursor.init();
ScrollReveal.init();
Navigation.init();
Gallery.init();
Testimonials.init();
CounterAnimation.init();
ContactForm.init();
initNoiseOverlay();
