(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointers = window.matchMedia('(hover: hover) and (pointer: fine)');
  const revealTargets = document.querySelectorAll('.hero > div, .section-head, .card-visual');
  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveals.unobserve(entry.target);
        if (motion.matches || !entry.target.animate) return;
        entry.target.animate([
          { opacity: 0, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => reveals.observe(el));

    const links = [...document.querySelectorAll('.links a')];
    const setActive = id => links.forEach(link => {
      const active = link.hash === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const sections = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (visible.length) setActive(visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id);
    }, { rootMargin: '-10% 0px -35% 0px', threshold: [0, .15, .4] });
    document.querySelectorAll('main > section[id]').forEach(section => sections.observe(section));
    links.forEach(link => link.addEventListener('click', () => setActive(link.hash.slice(1))));
    setActive(location.hash === '#guides' ? 'guides' : 'about');
  }

  const cards = [...document.querySelectorAll('.card-visual')];
  cards.forEach(card => {
    let frame;
    const reset = () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.classList.remove('is-tilting');
    };
    card.addEventListener('pointermove', event => {
      if (motion.matches || !pointers.matches || event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', (-y * 4).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', (x * 4).toFixed(2) + 'deg');
        card.classList.add('is-tilting');
      });
    });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    card.addEventListener('blur', reset);
    motion.addEventListener('change', reset);
    pointers.addEventListener('change', reset);
  });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    revealTargets.forEach(el => el.getAnimations().forEach(animation => animation.finish()));
  });
})();
