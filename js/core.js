/* PythaQuest — core: util, ikon, API (fetch ke GAS), state sesi, toast, modal, grafik SVG */
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const fmt = n => (n == null ? '–' : Number(n).toLocaleString('id-ID', { maximumFractionDigits: 1 }));
const pad = n => String(n).padStart(2, '0');
const mmss = s => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600); return (h ? pad(h) + ':' : '00:') + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60); };
const tgl = (iso, withTime) => { if (!iso) return '–'; const d = new Date(iso); if (isNaN(d)) return '–'; const b = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']; return d.getDate() + ' ' + b[d.getMonth()] + ' ' + d.getFullYear() + (withTime ? ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : ''); };
const inisial = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();
const PAKET_NAMA = { F1: 'Formatif 1', F2: 'Formatif 2', SUM: 'Sumatif' };
const TP_NAMA = { TP2: 'TP 2 · Hipotenusa & Sisi Tegak', TP3: 'TP 3 · Kebalikan Pythagoras', TP4: 'TP 4 · Tripel Pythagoras', TP5: 'TP 5 · Segitiga Istimewa', TP6: 'TP 6 · Masalah Nyata' };

/* ---------- ikon (garis, gaya Lucide) ---------- */
const ICONS = {
  home: 'M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6', book: 'M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z',
  flask: 'M9 3h6M10 3v6L4.5 19a1.5 1.5 0 001.3 2h12.4a1.5 1.5 0 001.3-2L14 9V3M7.5 15h9', clipboard: 'M9 3h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3', chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  gift: 'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8S11 3 8.5 3a2.5 2.5 0 000 5M12 8s1-5 3.5-5a2.5 2.5 0 010 5',
  users: 'M16 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM22 20v-2a4 4 0 00-3-3.9M16 3.1a3.5 3.5 0 010 6.8',
  db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  settings: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4', logout: 'M9 21H5V3h4M16 17l5-5-5-5M21 12H9',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3', bell: 'M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4', bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', check: 'M5 12l5 5L20 7', lock: 'M6 11h12v10H6zM8 11V7a4 4 0 018 0v4', arrow: 'M5 12h14M13 6l6 6-6 6',
  play: 'M8 5v14l11-7z', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', sparkles: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 3v4M17 5h4',
  triangle: 'M4 4v16h16zM4 16h4v4', building: 'M4 21V5l8-2 8 2v16M9 21v-5h6v5M8 9h2M14 9h2M8 12h2M14 12h2', compass: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  download: 'M12 3v12M7 10l5 5 5-5M4 21h16', plus: 'M12 5v14M5 12h14', trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3', edit: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z', clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2', x: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 6h16M4 12h16M4 18h16', info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h0', warn: 'M12 3l10 18H2zM12 10v5M12 18h0', image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h0',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16', message: 'M4 5h16v11H9l-5 4z', shieldcheck: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
  chevron: 'M6 9l6 6 6-6', target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h0', refresh: 'M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5',
  medal: 'M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 14L7 21l5-3 5 3-1.2-7', search2: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3M8 11h6', user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  save: 'M5 3h12l3 3v15H5zM8 3v6h8V3M8 21v-7h8v7', ruler: 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2', mouse: 'M6 3l12 8-5 1-3 5z'
};
const ic = (n, cls) => '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (ICONS[n] || ICONS.info) + '"/></svg>';

/* ---------- state sesi ---------- */
const S = {
  role: null, token: null, me: null, boot: null, lockNav: null,
  save() { try { localStorage.setItem('pq_sess', JSON.stringify({ role: this.role, token: this.token, me: this.me, at: Date.now() })); } catch (e) {} },
  load() { try { const o = JSON.parse(localStorage.getItem('pq_sess') || 'null'); if (o && o.token && Date.now() - o.at < 11.5 * 3600e3) { this.role = o.role; this.token = o.token; this.me = o.me; return true; } } catch (e) {} return false; },
  clear() { this.role = this.token = this.me = this.boot = null; try { localStorage.removeItem('pq_sess'); } catch (e) {} },
  get guest() { return this.role === 'tamu'; }, get guru() { return this.role === 'guru'; }, get siswa() { return this.role === 'siswa'; }
};

/* ---------- API (fetch ke Google Apps Script, POST text/plain agar tanpa preflight) ---------- */
const API = {
  ready() { const u = (window.APP_CONFIG || {}).GAS_URL || ''; return /^https:\/\/script\.google\.com\/.+\/exec$/.test(u) && !/GANTI|XXXX/.test(u); },
  _inflight: {}, ms: [],
  async call(action, data, opt) {
    opt = opt || {};
    if (!this.ready()) throw Object.assign(new Error('Server belum dihubungkan. Isi GAS_URL di js/config.js (lihat PANDUAN-INSTALASI).'), { code: 'CONFIG' });
    const run = async () => {
      const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), opt.timeout || 30000);
      const t0 = performance.now();
      try {
        const res = await fetch(window.APP_CONFIG.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, token: S.token, data: data || {} }), signal: ctl.signal });
        const j = await res.json();
        this.ms.push({ action, total: Math.round(performance.now() - t0), server: j.ms }); if (this.ms.length > 60) this.ms.shift();
        if (!j.success) {
          if (j.code === 'SESI' && !opt.quiet) { S.clear(); toast('Sesi berakhir. Silakan masuk kembali.', 'warn'); location.hash = '#login'; }
          throw Object.assign(new Error(j.message || 'Terjadi kesalahan.'), { code: j.code, data: j });
        }
        return j;
      } catch (e) {
        if (e.name === 'AbortError') throw Object.assign(new Error('Koneksi lambat. Coba lagi.'), { code: 'NET' });
        if (e instanceof TypeError) throw Object.assign(new Error('Tidak dapat terhubung ke server. Periksa koneksi internet.'), { code: 'NET' });
        throw e;
      } finally { clearTimeout(to); }
    };
    if (opt.read) {        // dedupe baca yang identik & sedang berjalan
      const k = action + '|' + JSON.stringify(data || {});
      if (this._inflight[k]) return this._inflight[k];
      const p = run(); this._inflight[k] = p; p.then(() => delete this._inflight[k], () => delete this._inflight[k]); return p;
    }
    return run();
  },
  async get(action, data, opt) { const j = await this.call(action, data, Object.assign({ read: true }, opt || {})); return j.data; },
  async post(action, data, opt) { const j = await this.call(action, data, opt); return j.data; },
  perf() { console.table(this.ms); }
};
window.Perf = API;
const Activity = {   // polling adaptif: pelan saat tab tak aktif / pengguna diam
  at: Date.now(), last: {},
  init() { ['pointerdown', 'keydown', 'wheel', 'touchstart', 'focus'].forEach(ev => addEventListener(ev, () => { this.at = Date.now(); }, { passive: true })); },
  idle() { return Date.now() - this.at > 120000; },
  due(key, activeMs, idleMs) {
    if (document.visibilityState !== 'visible') return false;
    if (Date.now() - (this.last[key] || 0) < (this.idle() ? idleMs : activeMs) - 500) return false;
    this.last[key] = Date.now(); return true;
  }
};

/* ---------- toast & modal ---------- */
function toast(msg, type, ms) {
  let box = $('#toasts'); if (!box) { box = el('<div id="toasts" aria-live="polite"></div>'); document.body.appendChild(box); }
  const t = el('<div class="toast ' + (type || 'ok') + '">' + ic(type === 'err' ? 'warn' : type === 'warn' ? 'info' : 'check') + '<span>' + esc(msg) + '</span></div>');
  box.appendChild(t); requestAnimationFrame(() => t.classList.add('in'));
  setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300); }, ms || 3200);
}
function errMsg(e) { return (e && e.message) || 'Terjadi kesalahan.'; }

function modal(html, opt) {
  opt = opt || {};
  const back = el('<div class="modal-back" role="dialog" aria-modal="true"><div class="modal ' + (opt.cls || '') + '"><button class="modal-x" aria-label="Tutup">' + ic('x') + '</button><div class="modal-body">' + html + '</div></div></div>');
  document.body.appendChild(back);
  requestAnimationFrame(() => back.classList.add('in'));
  const api = {
    root: back, body: $('.modal-body', back),
    close() { if (api.closed) return; api.closed = true; back.classList.remove('in'); document.removeEventListener('keydown', onKey); setTimeout(() => back.remove(), 250); if (opt.onClose) opt.onClose(); }
  };
  const onKey = e => { if (e.key === 'Escape' && !opt.persist) api.close(); };
  document.addEventListener('keydown', onKey);
  $('.modal-x', back).onclick = () => api.close();
  if (!opt.persist) back.addEventListener('pointerdown', e => { if (e.target === back) api.close(); });
  if (window.FX) FX.scan(back);
  return api;
}
function confirmBox(title, text, okLabel, danger) {
  return new Promise(res => {
    const m = modal('<h3 class="h3">' + esc(title) + '</h3><p class="muted">' + text + '</p><div class="row end gap"><button class="btn btn-ghost" data-n>Batal</button><button class="btn ' + (danger ? 'btn-danger' : 'btn-primary') + '" data-y>' + esc(okLabel || 'Ya') + '</button></div>', { cls: 'sm', onClose: () => res(false) });
    $('[data-n]', m.root).onclick = () => m.close();
    $('[data-y]', m.root).onclick = () => { res(true); m.closed = true; m.root.classList.remove('in'); setTimeout(() => m.root.remove(), 250); };
  });
}
function busy(btn, on, label) {
  if (!btn) return;
  if (on) { btn.dataset.l = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spin"></span> ' + (label || 'Memproses…'); }
  else { btn.disabled = false; if (btn.dataset.l) btn.innerHTML = btn.dataset.l; }
}

/* ---------- grafik SVG ringan (area/garis halus, batang) dengan tooltip ---------- */
function smoothPath(pts) {
  if (pts.length < 2) return pts.length ? 'M' + pts[0][0] + ',' + pts[0][1] : '';
  let d = 'M' + pts[0][0] + ',' + pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 0.18;
    d += 'C' + (p1[0] + (p2[0] - p0[0]) * t) + ',' + (p1[1] + (p2[1] - p0[1]) * t) + ' ' + (p2[0] - (p3[0] - p1[0]) * t) + ',' + (p2[1] - (p3[1] - p1[1]) * t) + ' ' + p2[0] + ',' + p2[1];
  }
  return d;
}
let _cid = 0;
function lineChart(host, o) {
  const W = 640, H = o.h || 230, L = 38, R = 14, T = 16, B = 34, min = o.min == null ? 0 : o.min, max = o.max == null ? 100 : o.max, id = 'lc' + (++_cid);
  const n = o.labels.length, X = i => L + (n === 1 ? (W - L - R) / 2 : i * (W - L - R) / (n - 1)), Y = v => T + (1 - (v - min) / (max - min)) * (H - T - B);
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chart" role="img" aria-label="' + esc(o.title || 'grafik') + '"><defs>';
  o.series.forEach((sr, k) => { s += '<linearGradient id="' + id + 'g' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sr.color + '" stop-opacity=".30"/><stop offset="1" stop-color="' + sr.color + '" stop-opacity="0"/></linearGradient>'; });
  s += '</defs>';
  const ticks = o.ticks || [min, (min + max) / 2, max];
  ticks.forEach(t => { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(t) + '" y2="' + Y(t) + '" class="gl"/><text x="' + (L - 6) + '" y="' + (Y(t) + 4) + '" class="gt" text-anchor="end">' + t + '</text>'; });
  if (o.ref != null) s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(o.ref) + '" y2="' + Y(o.ref) + '" class="gref"/><text x="' + (W - R) + '" y="' + (Y(o.ref) - 4) + '" class="gt ref" text-anchor="end">' + esc(o.refLabel || o.ref) + '</text>';
  o.labels.forEach((lb, i) => { s += '<text x="' + X(i) + '" y="' + (H - 10) + '" class="gt" text-anchor="middle">' + esc(lb) + '</text>'; });
  o.series.forEach((sr, k) => {
    const pts = sr.values.map((v, i) => v == null ? null : [X(i), Y(v)]).filter(Boolean);
    if (!pts.length) return;
    const line = smoothPath(pts);
    if (sr.area !== false && pts.length > 1) s += '<path d="' + line + 'L' + pts[pts.length - 1][0] + ',' + Y(min) + 'L' + pts[0][0] + ',' + Y(min) + 'Z" fill="url(#' + id + 'g' + k + ')" class="garea"/>';
    s += '<path d="' + line + '" fill="none" stroke="' + sr.color + '" stroke-width="3" stroke-linecap="round" class="gline" pathLength="1"/>';
    sr.values.forEach((v, i) => { if (v != null) s += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="5" fill="#fff" stroke="' + sr.color + '" stroke-width="3" class="gdot" data-s="' + k + '" data-i="' + i + '"/>'; });
  });
  s += '</svg><div class="tip"></div>';
  host.innerHTML = s; host.classList.add('chart-host');
  const tip = $('.tip', host);
  host.addEventListener('pointermove', e => {
    const t = e.target.closest && e.target.closest('.gdot');
    if (!t) { tip.classList.remove('on'); return; }
    const sr = o.series[+t.dataset.s], i = +t.dataset.i, r = host.getBoundingClientRect(), c = t.getBoundingClientRect();
    tip.innerHTML = '<b>' + esc(o.labels[i]) + '</b><br>' + esc(sr.name || '') + ': ' + fmt(sr.values[i]) + (o.unit || '');
    tip.style.left = (c.left - r.left + c.width / 2) + 'px'; tip.style.top = (c.top - r.top - 8) + 'px'; tip.classList.add('on');
  });
  host.addEventListener('pointerleave', () => tip.classList.remove('on'));
}
function barChart(host, o) {
  const W = 520, H = o.h || 220, L = 30, B = 44, T = 22, n = o.labels.length, max = o.max || Math.max(1, ...o.values) * 1.15, bw = Math.min(64, (W - L) / n * .6);
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chart" role="img" aria-label="' + esc(o.title || 'grafik batang') + '">';
  [0, .5, 1].forEach(f => { const y = T + (1 - f) * (H - T - B); s += '<line x1="' + L + '" x2="' + (W - 6) + '" y1="' + y + '" y2="' + y + '" class="gl"/><text x="' + (L - 5) + '" y="' + (y + 4) + '" class="gt" text-anchor="end">' + Math.round(max * f) + '</text>'; });
  o.values.forEach((v, i) => {
    const cx = L + (i + .5) * (W - L - 6) / n, h = (v / max) * (H - T - B), y = H - B - h;
    s += '<rect x="' + (cx - bw / 2) + '" y="' + y + '" width="' + bw + '" height="' + Math.max(h, 0) + '" rx="10" fill="' + (o.colors[i] || '#5B3FD9') + '" class="gbar" style="--d:' + (i * 90) + 'ms"/>';
    s += '<text x="' + cx + '" y="' + (y - 6) + '" class="gt strong" text-anchor="middle">' + fmt(v) + '</text>';
    s += '<text x="' + cx + '" y="' + (H - 24) + '" class="gt" text-anchor="middle">' + esc(o.labels[i]) + '</text>';
    if (o.sub && o.sub[i]) s += '<text x="' + cx + '" y="' + (H - 10) + '" class="gt sub" text-anchor="middle">' + esc(o.sub[i]) + '</text>';
  });
  host.innerHTML = s + '</svg>';
}
function ring(pct, size, color) {
  const r = 44, c = 2 * Math.PI * r;
  return '<svg viewBox="0 0 100 100" width="' + (size || 96) + '" height="' + (size || 96) + '" class="ring"><circle cx="50" cy="50" r="' + r + '" class="ring-bg"/><circle cx="50" cy="50" r="' + r + '" class="ring-fg" style="stroke:' + (color || 'var(--ok)') + ';stroke-dasharray:' + c + ';stroke-dashoffset:' + (c * (1 - clamp(pct, 0, 100) / 100)) + '" transform="rotate(-90 50 50)"/><text x="50" y="56" text-anchor="middle" class="ring-t">' + Math.round(pct) + '%</text></svg>';
}
function statusPill(s) {
  const m = { tuntas: ['ok', 'Tuntas'], remedial: ['warn', 'Remedial'], terbuka: ['info', 'Terbuka'], terkunci: ['mute', 'Terkunci'], berlangsung: ['info', 'Berlangsung'], refleksi: ['warn', 'Isi refleksi'], nonaktif: ['mute', 'Nonaktif'] }[s] || ['mute', s];
  return '<span class="pill ' + m[0] + '">' + m[1] + '</span>';
}
function download(name, mime, b64OrText, isB64) {
  const blob = isB64 ? new Blob([Uint8Array.from(atob(b64OrText), c => c.charCodeAt(0))], { type: mime }) : new Blob([b64OrText], { type: mime });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function csv(rows) { return '\ufeff' + rows.map(r => r.map(c => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"').join(',')).join('\r\n'); }
