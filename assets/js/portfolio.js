(() => {
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#portfolio-navigation');
  const closeMenu = () => {
    menu?.setAttribute('aria-expanded', 'false');
    navigation?.classList.remove('is-open');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });

  const search = document.querySelector('#publication-search');
  const year = document.querySelector('#publication-year');
  const publications = [...document.querySelectorAll('[data-publication]')];
  const count = document.querySelector('[data-publication-count]');
  const empty = document.querySelector('[data-publication-empty]');
  const filter = () => {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    publications.forEach(publication => {
      const matches = words.every(word => publication.dataset.search.toLocaleLowerCase().includes(word))
        && (year.value === 'all' || publication.dataset.year === year.value);
      publication.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = count.dataset.template.replace('{visible}', visible).replace('{total}', publications.length);
    empty.hidden = visible !== 0;
  };
  if (search && year) {
    document.querySelector('[data-publication-controls]').hidden = false;
    search.addEventListener('input', filter);
    year.addEventListener('change', filter);
    filter();
  }

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('#portfolio-navigation a[href^="#"]')];
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    navLinks.forEach(link => {
      const section = document.getElementById(link.hash.slice(1));
      if (section) activeObserver.observe(section);
    });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            reveal.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.section-heading, .research-card, .supervision-card, .note-card').forEach(element => {
        element.classList.add('reveal-ready');
        reveal.observe(element);
      });
    }
  }
})();
