'use strict';

const Gallery = (() => {
  let photos = [];
  let filtered = [];
  let currentIndex = 0;
  let lightbox;
  let lightboxImg;
  let lightboxTitle;
  let lightboxCat;
  let lightboxCounter;
  let isLightboxOpen = false;

  async function init() {
    await loadPhotos();
    renderGrid();
    initFilters();
    initLightbox();
    initIntersectionObserver();
  }

  async function loadPhotos() {
    try {
      const res = await fetch('./data/gallery.json');
      const data = await res.json();
      photos = data.photos || [];
      filtered = [...photos];
    } catch {
      // Fallback demo data if JSON not loaded
      photos = getDemoPhotos();
      filtered = [...photos];
    }
  }

  function getDemoPhotos() {
    const categories = ['Portrait', 'Landscape', 'Wedding', 'Urban', 'Fashion', 'Nature'];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Foto ${i + 1}`,
      category: categories[i % categories.length],
      src: `assets/images/gallery/photo-${i + 1}.jpg`,
      placeholder: generatePlaceholderColor(i),
      width: 1200,
      height: i % 3 === 0 ? 1600 : 900,
    }));
  }

  function generatePlaceholderColor(index) {
    const palettes = [
      ['#2a1506', '#3d2010'],
      ['#0a1520', '#152030'],
      ['#151008', '#201810'],
      ['#0f1a10', '#182418'],
      ['#1a1020', '#281830'],
      ['#1a0a0a', '#2a1010'],
    ];
    return palettes[index % palettes.length];
  }

  function renderGrid() {
    const grid = document.getElementById('photo-grid');
    if (!grid) return;

    grid.innerHTML = '';

    filtered.forEach((photo, index) => {
      const card = createPhotoCard(photo, index);
      grid.appendChild(card);
    });
  }

  function createPhotoCard(photo, index) {
    const card = document.createElement('article');
    card.className = 'photo-card';
    card.dataset.category = photo.category.toLowerCase();
    card.dataset.id = photo.id;

    const [bg1, bg2] = photo.placeholder || ['#1a0e06', '#2a1a0a'];

    card.innerHTML = `
      <img
        src="${photo.src}"
        alt="${photo.title}"
        loading="lazy"
        onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg,${bg1},${bg2})'"
      />
      <div class="photo-card-overlay">
        <div class="photo-card-zoom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p class="photo-card-title">${photo.title}</p>
        <span class="photo-card-category">${photo.category}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      currentIndex = filtered.indexOf(photo);
      openLightbox(photo);
    });

    return card;
  }

  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        applyFilter(category);
      });
    });
  }

  function applyFilter(category) {
    const grid = document.getElementById('photo-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.photo-card');

    if (category === 'all') {
      filtered = [...photos];
      cards.forEach(card => {
        card.classList.remove('hidden-filter');
      });
    } else {
      filtered = photos.filter(p => p.category.toLowerCase() === category);
      cards.forEach(card => {
        const match = card.dataset.category === category;
        card.classList.toggle('hidden-filter', !match);
      });
    }
  }

  function initLightbox() {
    lightbox       = document.getElementById('lightbox');
    lightboxImg    = lightbox?.querySelector('.lightbox-img');
    lightboxTitle  = lightbox?.querySelector('.lightbox-title');
    lightboxCat    = lightbox?.querySelector('.lightbox-category');
    lightboxCounter = lightbox?.querySelector('.lightbox-counter');

    if (!lightbox) return;

    lightbox.querySelector('.lightbox-bg')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => navigate(-1));
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    // Touch/swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    lightbox.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    });
  }

  function openLightbox(photo) {
    if (!lightbox) return;
    isLightboxOpen = true;

    if (lightboxImg)   lightboxImg.src = photo.src;
    if (lightboxImg)   lightboxImg.alt = photo.title;
    if (lightboxTitle) lightboxTitle.textContent = photo.title;
    if (lightboxCat)   lightboxCat.textContent   = photo.category;
    updateCounter();

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    isLightboxOpen = false;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + filtered.length) % filtered.length;
    const photo = filtered[currentIndex];

    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.96)';

      setTimeout(() => {
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.title;
        lightboxImg.style.opacity = '';
        lightboxImg.style.transform = '';
      }, 200);
    }

    if (lightboxTitle) lightboxTitle.textContent = photo.title;
    if (lightboxCat)   lightboxCat.textContent   = photo.category;
    updateCounter();
  }

  function updateCounter() {
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${filtered.length}`;
    }
  }

  function initIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, (i % 6) * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.photo-card').forEach(card => observer.observe(card));
  }

  return { init };
})();
