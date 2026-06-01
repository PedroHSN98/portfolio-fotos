(async function () {
  const placeholders = document.querySelectorAll('[data-partial]');

  for (const el of placeholders) {
    const path = el.getAttribute('data-partial');
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      el.outerHTML = html;
    } catch (e) {
      console.error('Erro ao carregar partial:', path, e);
    }
  }

  const scripts = [
    'assets/js/book-animation.js',
    'assets/js/gallery.js',
    'assets/js/navigation.js',
    'assets/js/main.js',
  ];

  for (const src of scripts) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
})();
