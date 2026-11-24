/* =========================================================
   Focus Signage — Ultra-Premium Dark UI JS
   Custom Cursor · Magnetic Tilt · Enhanced Particles
   Stagger Reveals · Lightbox · Scroll Effects · Typing
   ========================================================= */

(() => {
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  /* ─────────────────────────────────────────
   * CUSTOM CURSOR
   * ───────────────────────────────────────── */
  const cursorDot  = $('#cursor-dot');
  const cursorRing = $('#cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;

  if (cursorDot && cursorRing) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left  = mouseX + 'px';
      cursorDot.style.top   = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Scale ring on interactive elements
    const interactives = $$('a, button, [data-tilt]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform  = 'translate(-50%,-50%) scale(2)';
        cursorDot.style.background = 'var(--secondary)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
        cursorDot.style.background = 'var(--primary)';
      });
    });
  }

  /* ─────────────────────────────────────────
   * HEADER SCROLL CLASS
   * ───────────────────────────────────────── */
  const header = $('.header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─────────────────────────────────────────
   * MOBILE NAV TOGGLE
   * ───────────────────────────────────────── */
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');

  function closeNav() {
    navMenu?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  $$('#navMenu a').forEach(a => a.addEventListener('click', closeNav));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  document.addEventListener('click', e => {
    if (!navMenu || !navToggle) return;
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  /* ─────────────────────────────────────────
   * SMOOTH SCROLL
   * ───────────────────────────────────────── */
  document.addEventListener('click', e => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeNav();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', id);
  });

  /* ─────────────────────────────────────────
   * BACK TO TOP
   * ───────────────────────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.back-to-top');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '', '#top');
  });

  /* ─────────────────────────────────────────
   * SCROLL PROGRESS
   * ───────────────────────────────────────── */
  const progressBar = $('.scroll-progress span');
  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ─────────────────────────────────────────
   * SPLIT TEXT FOR SLOW WORD REVEAL
   * ───────────────────────────────────────── */
  const splitTargets = $$('.hero__lead, .hero__trust');
  splitTargets.forEach(el => {
    el.classList.remove('reveal');
    el.removeAttribute('data-reveal');
    
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    
    let wordIndex = 0;
    textNodes.forEach(node => {
      if (!node.nodeValue.trim()) return;
      const words = node.nodeValue.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      words.forEach(word => {
        if (!word.trim()) {
          fragment.appendChild(document.createTextNode(word));
          return;
        }
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.classList.add('reveal');
        span.setAttribute('data-reveal', '');
        span.setAttribute('data-delay', 'custom');
        span.style.transitionDelay = `${wordIndex * 0.15}s`;
        wordIndex++;
        fragment.appendChild(span);
      });
      node.parentNode.replaceChild(fragment, node);
    });
  });

  /* ─────────────────────────────────────────
   * REVEAL ON SCROLL (staggered)
   * ───────────────────────────────────────── */
  const revealEls = $$('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    for (const ent of entries) {
      if (ent.isIntersecting) {
        ent.target.classList.add('is-visible');
        io.unobserve(ent.target);
      }
    }
  }, { threshold: 0.1 });

  revealEls.forEach((el, i) => {
    // Auto-stagger siblings in the same parent grid/flex container
    const siblings = Array.from(el.parentElement?.children || []).filter(c => c.hasAttribute('data-reveal'));
    const sibIdx = siblings.indexOf(el);
    if (sibIdx > 0 && !el.hasAttribute('data-delay')) {
      el.style.transitionDelay = `${sibIdx * 0.09}s`;
    }
    io.observe(el);
  });

  /* ─────────────────────────────────────────
   * HERO PARALLAX (mouse move)
   * ───────────────────────────────────────── */
  const heroSection = $('#hero');
  const orbits = $$('.orbit');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onHeroMove(e) {
    if (!heroSection) return;
    const r = heroSection.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;

    orbits.forEach((o, i) => {
      const mul = (i + 1) * 5;
      o.style.transform = `translate3d(${dx * mul}px, ${dy * mul}px, 0)`;
    });
  }

  if (!prefersReduced) {
    heroSection?.addEventListener('mousemove', onHeroMove);
    heroSection?.addEventListener('mouseleave', () => {
      orbits.forEach(o => o.style.transform = '');
    });
  }

  /* ─────────────────────────────────────────
   * MAGNETIC TILT (3D card effect)
   * ───────────────────────────────────────── */
  if (!prefersReduced) {
    $$('[data-tilt]').forEach(card => {
      const TILT = 8; // max degrees
      const SCALE = 1.02;

      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5; // -0.5 to 0.5
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * TILT}deg) rotateY(${x * TILT}deg) scale(${SCALE}) translateZ(0)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.15s ease';
      });
    });
  }

  /* ─────────────────────────────────────────
   * TYPING EFFECT
   * ───────────────────────────────────────── */
  const typed = $('#typed');
  const phrase = 'WE MAKE BRANDS VISIBLE.';
  let charIdx = 0;

  function typeLoop() {
    if (!typed) return;
    typed.textContent = phrase.slice(0, charIdx);
    charIdx++;
    if (charIdx <= phrase.length) setTimeout(typeLoop, 150);
  }
  // Small delay so page is rendered first
  setTimeout(typeLoop, 400);

  /* ─────────────────────────────────────────
   * ANIMATED COUNTERS
   * ───────────────────────────────────────── */
  const counterEls = $$('[data-count]');

  function animateCount(el, to, duration = 1200) {
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(eased * to);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (!ent.isIntersecting) return;
      const el = ent.target;
      const to = Number(el.getAttribute('data-count') || '0');
      animateCount(el, to);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  /* ─────────────────────────────────────────
   * LIGHTBOX
   * ───────────────────────────────────────── */
  const lightbox     = $('#lightbox');
  const lightboxImg  = $('#lightboxImg');
  const lightboxClose= $('#lightboxClose');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-lightbox]');
    if (!a) return;
    e.preventDefault();
    const img = a.querySelector('img');
    openLightbox(a.href, img?.alt);
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ─────────────────────────────────────────
   * FOOTER YEAR
   * ───────────────────────────────────────── */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ─────────────────────────────────────────
   * THEME TOGGLE
   * ───────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme === 'dark' ? 'dark' : '');
      localStorage.setItem('focus_theme', newTheme);
      if (metaTheme) {
        metaTheme.setAttribute('content', newTheme === 'dark' ? '#07080f' : '#F2F5FC');
      }
    });
  }

  /* ─────────────────────────────────────────
   * ENHANCED CANVAS PARTICLES
   * ───────────────────────────────────────── */
  const canvas = $('#particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let w = 0, h = 0;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const N   = prefersReduced ? 0 : 130;
  const MAX_DIST = 140;
  const particles = [];

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width  = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeParticle() {
    const hue = Math.random();
    return {
      x:  rand(0, w),
      y:  rand(0, h),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      r:  rand(0.6, 2.0),
      a:  rand(0.2, 0.55),
      // 0 = orange, 1 = blue, 2 = purple
      type: hue < 0.5 ? 0 : hue < 0.8 ? 1 : 2,
    };
  }

  for (let i = 0; i < N; i++) particles.push(makeParticle());

  // Mouse repel
  let mx = -9999, my = -9999;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function colorFor(p) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      if (p.type === 0) return `rgba(241,90,36,${p.a})`;
      if (p.type === 1) return `rgba(79,142,247,${p.a})`;
      return `rgba(123,92,240,${p.a * 0.7})`;
    }
    if (p.type === 0) return `rgba(241,90,36,${p.a * 0.7})`;
    if (p.type === 1) return `rgba(36,60,143,${p.a * 0.6})`;
    return `rgba(27,78,140,${p.a * 0.5})`;
  }

  function step() {
    if (prefersReduced) return;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      // Mouse repel
      const mdx = p.x - mx;
      const mdy = p.y - my;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < 90 * 90) {
        const md = Math.sqrt(md2);
        const force = (90 - md) / 90 * 0.4;
        p.vx += (mdx / md) * force;
        p.vy += (mdy / md) * force;
      }

      // Velocity damping
      p.vx *= 0.995;
      p.vy *= 0.995;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = colorFor(p);
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 > MAX_DIST * MAX_DIST) continue;

        const t = 1 - (dist2 / (MAX_DIST * MAX_DIST));
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        let r, g, bl;
        if (a.type === 0 && b.type === 0) { r = 241; g = 90; bl = 36; }
        else if (a.type === 1 && b.type === 1) { 
          r = isDark ? 79 : 36; 
          g = isDark ? 142 : 60; 
          bl = isDark ? 247 : 143; 
        }
        else { 
          r = isDark ? 160 : 120; 
          g = isDark ? 116 : 80; 
          bl = isDark ? 141 : 120; 
        }

        ctx.strokeStyle = `rgba(${r},${g},${bl},${0.15 * t})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    requestAnimationFrame(step);
  }

  step();
})();