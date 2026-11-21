/* PythaQuest — FX: kursor "+" Precision Select + partikel nyata, glow/tilt, reveal, count-up,
   slideshow otomatis, flip card otomatis, konfeti, ripple tombol.
   Hormati prefers-reduced-motion, perangkat sentuh, dan sakelar Efek di Pengaturan. */
'use strict';
const FX = (function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const st = { on: true, calm: false, particles: [], rings: [], raf: 0, last: 0, mx: -99, my: -99, vx: 0, vy: 0, lx: null, ly: null, acc: 0, tilt: null, cur: null, cv: null, cx: null, dpr: 1, sprites: {} };
  const PAL = ['#8C6DFF', '#B5A7F2', '#63FAB7', '#FFB77A', '#FF7AC8', '#5B3FD9', '#44DF9F'];
  const CONF = ['#5B3FD9', '#1FC98B', '#FF9F43', '#EF4444', '#3B82F6', '#FF7AC8', '#FFD43B'];

  function sprite(col) {
    if (st.sprites[col]) return st.sprites[col];
    const c = document.createElement('canvas'); c.width = c.height = 48; const g = c.getContext('2d');
    const gr = g.createRadialGradient(24, 24, 0, 24, 24, 24);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(.18, col); gr.addColorStop(.5, col + '66'); gr.addColorStop(1, col + '00');
    g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
    return (st.sprites[col] = c);
  }
  function resize() {
    if (!st.cv) return;
    st.dpr = Math.min(2, window.devicePixelRatio || 1);
    st.cv.width = innerWidth * st.dpr; st.cv.height = innerHeight * st.dpr;
    st.cv.style.width = innerWidth + 'px'; st.cv.style.height = innerHeight + 'px';
    st.cx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
  }
  function spawn(x, y, kind, vx, vy) {
    if (st.particles.length > 260) st.particles.shift();
    const a = rnd(0, Math.PI * 2), sp = kind === 'burst' ? rnd(1.6, 5.2) : rnd(.15, .9);
    const ember = kind === 'trail' && Math.random() < .55;
    st.particles.push({
      x: x + rnd(-2, 2), y: y + rnd(-2, 2), vx: (kind === 'burst' ? Math.cos(a) * sp : Math.cos(a) * sp - vx * .06), vy: (kind === 'burst' ? Math.sin(a) * sp : Math.sin(a) * sp - vy * .06 - (ember ? .25 : 0)),
      life: 0, max: kind === 'burst' ? rnd(34, 64) : rnd(32, 78), size: kind === 'burst' ? rnd(.8, 2.1) : rnd(.6, 1.7), col: PAL[(Math.random() * PAL.length) | 0],
      tw: rnd(0, 6.28), g: ember ? -.012 : .028, ember: ember, kind: kind
    });
  }
  function confetti(x, y, n) {
    if (reduce || !st.cx) return;
    for (let i = 0; i < (n || 90); i++) {
      const a = rnd(-Math.PI * .95, -Math.PI * .05), sp = rnd(4, 11);
      st.particles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rnd(70, 130), size: rnd(4, 8), col: CONF[(Math.random() * CONF.length) | 0], rot: rnd(0, 6.28), vr: rnd(-.3, .3), g: .22, kind: 'conf', drag: .985 });
    }
    loop();
  }
  function burst(x, y) {
    if (reduce || st.calm) return;
    for (let i = 0; i < 18; i++) spawn(x, y, 'burst');
    st.rings.push({ x: x, y: y, r: 4, a: .55 });
    loop();
  }
  function frame(t) {
    const dt = Math.min(2.2, (t - (st.last || t)) / 16.67); st.last = t;
    const g = st.cx; g.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = st.rings.length - 1; i >= 0; i--) {
      const r = st.rings[i]; r.r += 2.4 * dt; r.a -= .028 * dt;
      if (r.a <= 0) { st.rings.splice(i, 1); continue; }
      g.globalAlpha = r.a; g.strokeStyle = '#8C6DFF'; g.lineWidth = 1.4; g.beginPath(); g.arc(r.x, r.y, r.r, 0, 6.283); g.stroke();
    }
    for (let i = st.particles.length - 1; i >= 0; i--) {
      const p = st.particles[i]; p.life += dt;
      if (p.life >= p.max) { st.particles.splice(i, 1); continue; }
      const k = 1 - p.life / p.max;
      if (p.kind === 'conf') {
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        g.save(); g.globalAlpha = Math.min(1, k * 1.6); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(1, Math.abs(Math.sin(p.life * .2)) + .2); g.fillStyle = p.col; g.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); g.restore();
        continue;
      }
      p.vx *= .965; p.vy = p.vy * .965 + p.g * dt;
      if (p.ember) p.vx += Math.sin(p.life * .18 + p.tw) * .02 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const tw = .65 + .35 * Math.sin(p.life * .45 + p.tw), s = p.size * (.5 + k * .9) * 7;
      g.globalAlpha = Math.pow(k, 1.15) * tw;
      g.drawImage(sprite(p.col), p.x - s / 2, p.y - s / 2, s, s);
      g.globalAlpha = Math.pow(k, 1.3); g.fillStyle = '#fff'; g.fillRect(p.x - .5, p.y - .5, 1.1, 1.1);
    }
    g.globalAlpha = 1;
    if (st.particles.length || st.rings.length) st.raf = requestAnimationFrame(frame); else { st.raf = 0; st.last = 0; }
  }
  function loop() { if (!st.raf && st.cx) st.raf = requestAnimationFrame(frame); }

  /* ---------- kursor + ---------- */
  function setupCursor() {
    st.cur = el('<div id="pq-cur" aria-hidden="true"><svg viewBox="-14 -14 28 28"><g class="halo"><path d="M0-10V-3.5M0 3.5V10M-10 0H-3.5M3.5 0H10"/></g><g class="core"><path d="M0-10V-3.5M0 3.5V10M-10 0H-3.5M3.5 0H10"/><circle r="1.35"/></g></svg></div>');
    document.body.appendChild(st.cur);
    st.cv = el('<canvas id="pq-fx" aria-hidden="true"></canvas>'); document.body.appendChild(st.cv);
    st.cx = st.cv.getContext('2d'); resize(); addEventListener('resize', resize);
    document.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      st.mx = e.clientX; st.my = e.clientY;
      st.cur.style.transform = 'translate(' + st.mx + 'px,' + st.my + 'px) translate(-50%,-50%)'; st.cur.classList.add('show');
      if (st.lx != null) {
        const dx = st.mx - st.lx, dy = st.my - st.ly, d = Math.hypot(dx, dy); st.vx = dx; st.vy = dy;
        if (!reduce && !st.calm && st.on) { st.acc += d; while (st.acc > 7) { st.acc -= 7; const f = rnd(0, 1); spawn(st.lx + dx * f, st.ly + dy * f, 'trail', dx, dy); } loop(); }
      }
      st.lx = st.mx; st.ly = st.my;
      const hot = e.target.closest && e.target.closest('a,button,[role=button],input,select,textarea,label,summary,.flip,.hoverable,.click,[data-pop]');
      st.cur.classList.toggle('hot', !!hot);
      const txt = e.target.closest && e.target.closest('input[type=text],input[type=password],input[type=number],textarea');
      st.cur.classList.toggle('txt', !!txt);
    }, { passive: true });
    document.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') return; st.cur.classList.add('down'); burst(e.clientX, e.clientY); });
    document.addEventListener('pointerup', () => st.cur.classList.remove('down'));
    document.addEventListener('pointerleave', () => st.cur.classList.remove('show'));
    document.documentElement.addEventListener('mouseleave', () => { st.cur.classList.remove('show'); st.lx = null; });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { st.particles.length = 0; st.rings.length = 0; } });
  }

  /* ---------- glow / tilt / ripple ---------- */
  function setupGlow() {
    let fr = 0, ev = null;
    document.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return; ev = e;
      if (fr) return;
      fr = requestAnimationFrame(() => {
        fr = 0; const t = ev.target.closest ? ev.target.closest('.glow,.tilt') : null;
        if (st.tilt && st.tilt !== t) { st.tilt.style.removeProperty('--rx'); st.tilt.style.removeProperty('--ry'); st.tilt.classList.remove('lit'); st.tilt = null; }
        if (!t) return;
        const r = t.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
        t.style.setProperty('--mx', x + 'px'); t.style.setProperty('--my', y + 'px'); t.classList.add('lit');
        if (t.classList.contains('tilt') && !reduce) { t.style.setProperty('--ry', ((x / r.width - .5) * 9).toFixed(2) + 'deg'); t.style.setProperty('--rx', ((.5 - y / r.height) * 9).toFixed(2) + 'deg'); }
        st.tilt = t;
      });
    }, { passive: true });
    document.addEventListener('pointerdown', e => {
      const b = e.target.closest && e.target.closest('.btn,.click');
      if (!b || reduce) return;
      const r = b.getBoundingClientRect(), sz = Math.max(r.width, r.height) * 2, s = document.createElement('span');
      s.className = 'ripple'; s.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;left:' + (e.clientX - r.left - sz / 2) + 'px;top:' + (e.clientY - r.top - sz / 2) + 'px';
      b.appendChild(s); setTimeout(() => s.remove(), 650);
    });
  }

  /* ---------- reveal & count-up ---------- */
  let io = null, ioCount = null;
  function countUp(n) {
    const to = parseFloat(n.dataset.count), dec = +(n.dataset.dec || 0), dur = 1100, t0 = performance.now(), suf = n.dataset.suf || '';
    if (reduce || isNaN(to)) { n.textContent = to.toLocaleString('id-ID', { maximumFractionDigits: dec }) + suf; return; }
    (function step(t) { const k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3); n.textContent = (to * e).toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function setupObservers() {
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    ioCount = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); ioCount.unobserve(e.target); } }), { threshold: .4 });
  }

  /* ---------- slideshow otomatis ---------- */
  function initSlides(root) {
    $$('.slides:not([data-init])', root).forEach(sl => {
      sl.dataset.init = 1;
      const slides = $$(':scope > .slide', sl); if (!slides.length) return;
      let i = 0, timer = 0, paused = false, vis = true;
      slides[0].classList.add('on');
      if (slides.length < 2) return;
      const dots = el('<div class="dots">' + slides.map((_, k) => '<button type="button" aria-label="Gambar ' + (k + 1) + '"></button>').join('') + '</div>'); sl.appendChild(dots);
      const ds = $$('button', dots);
      const go = k => { slides[i].classList.remove('on'); ds[i].classList.remove('on'); i = (k + slides.length) % slides.length; slides[i].classList.add('on'); ds[i].classList.add('on'); };
      ds[0].classList.add('on');
      ds.forEach((d, k) => d.onclick = ev => { ev.stopPropagation(); go(k); });
      const iv = +(sl.dataset.interval || 3800);
      if (!reduce) {
        setTimeout(() => { timer = setInterval(() => { if (!sl.isConnected) { clearInterval(timer); return; } if (!paused && vis && !document.hidden) go(i + 1); }, iv); }, rnd(0, iv * .8));
        sl.addEventListener('pointerenter', () => paused = true); sl.addEventListener('pointerleave', () => paused = false);
        new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(sl);
      }
      let sx = null; sl.addEventListener('pointerdown', e => { sx = e.clientX; });
      sl.addEventListener('pointerup', e => { if (sx != null && Math.abs(e.clientX - sx) > 40) go(i + (e.clientX < sx ? 1 : -1)); sx = null; });
    });
  }

  /* ---------- flip card otomatis ---------- */
  function flipLoop() {
    if (reduce) return;
    setInterval(() => {
      if (document.hidden) return;
      const c = $$('.flip.auto').filter(f => !f.classList.contains('hovered') && !f.classList.contains('flipped') && f.isConnected && (() => { const r = f.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })());
      if (!c.length) return;
      const pick = c[(Math.random() * c.length) | 0]; pick.classList.add('flipped');
      setTimeout(() => { if (!pick.classList.contains('hovered') && !pick.classList.contains('pinned')) pick.classList.remove('flipped'); }, rnd(2400, 3400));
    }, 3300);
  }
  function initFlips(root) {
    $$('.flip:not([data-init])', root).forEach(f => {
      f.dataset.init = 1; f.tabIndex = 0;
      f.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') f.classList.add('hovered'); });
      f.addEventListener('pointerleave', () => { f.classList.remove('hovered'); });
      f.addEventListener('focus', () => f.classList.add('hovered')); f.addEventListener('blur', () => f.classList.remove('hovered'));
    });
  }

  function scan(root) {
    root = root || document;
    $$('.reveal:not(.in)', root).forEach((n, i) => { if (!n.style.getPropertyValue('--d')) n.style.setProperty('--d', Math.min(i, 10) * 55 + 'ms'); reduce ? n.classList.add('in') : io.observe(n); });
    $$('[data-count]:not([data-done])', root).forEach(n => { n.dataset.done = 1; ioCount.observe(n); });
    initSlides(root); initFlips(root);
  }
  function apply() {
    const cursorOn = fine && st.on;
    document.body.classList.toggle('fx-cursor', cursorOn);
    if (st.cur) st.cur.style.display = cursorOn ? '' : 'none';
    if (st.cv) st.cv.style.display = st.on ? '' : 'none';
    document.body.classList.toggle('fx-off', !st.on);
  }
  return {
    init() {
      try { st.on = localStorage.getItem('pq_fx') !== 'off'; } catch (e) {}
      setupObservers(); setupGlow(); if (fine) setupCursor(); else { st.cv = el('<canvas id="pq-fx" aria-hidden="true"></canvas>'); document.body.appendChild(st.cv); st.cx = st.cv.getContext('2d'); resize(); addEventListener('resize', resize); }
      document.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && st.on) burst(e.clientX, e.clientY); });
      flipLoop(); apply(); scan(document);
    },
    scan, confetti, burst,
    get enabled() { return st.on; },
    setEnabled(v) { st.on = !!v; try { localStorage.setItem('pq_fx', v ? 'on' : 'off'); } catch (e) {} apply(); if (!v) { st.particles.length = 0; st.rings.length = 0; } },
    calm(v) { st.calm = !!v; document.body.classList.toggle('fx-calm', !!v); if (v) { st.particles = st.particles.filter(p => p.kind === 'conf'); } },
    reduce
  };
})();
window.FX = FX;
