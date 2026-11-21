/* PythaQuest — Materi & Rangkuman interaktif (TP 2–6)
   Tiap TP = alur pelajaran: dunia nyata → pemahaman bertahap → widget interaktif → contoh terbimbing →
   salah kaprah → latihan berumpan balik → rangkuman. TP 5 memuat dua video YouTube yang diputar di dalam halaman. */
'use strict';
const MAT_STORE = {
  key() { return 'pq_mat_' + ((S.me && S.me.id) || 'tamu'); },
  get() { try { return JSON.parse(localStorage.getItem(this.key()) || '{}'); } catch (e) { return {}; } },
  set(o) { try { localStorage.setItem(this.key(), JSON.stringify(o)); } catch (e) {} }
};
const n2 = x => fmt(Math.round(x * 100) / 100);
const R2 = Math.SQRT2, R3 = Math.sqrt(3);
const VIDEOS = [
  { id: 'xC2AZ1obRsg', judul: 'Segitiga Istimewa (Part 4) — Teorema Pythagoras Kelas 8', oleh: 'MISS YANA', ket: 'Membahas dua segitiga istimewa (45°–45°–90° dan 30°–60°–90°) lengkap dengan contoh soal. Berbahasa Indonesia.', url: 'https://www.youtube.com/watch?v=xC2AZ1obRsg' },
  { id: 'Yctz__1Itps', judul: 'Special Triangle with Angles 30, 60, 90 and Angles 45, 45, 90', oleh: 'RR Success Channel', ket: 'Penjelasan rasio sisi kedua segitiga istimewa untuk siswa kelas 8 SMP. Judul berbahasa Inggris — bila narasinya kurang jelas, andalkan Video 1 dan penjelasan di halaman ini.', url: 'https://www.youtube.com/watch?v=Yctz__1Itps' }
];

/* ---------- helper UI widget ---------- */
const msl = (id, label, min, max, val, step, col, unit) => `<div class="sl"><div class="between"><label for="${id}"><i class="dot" style="background:${col}"></i>${label}</label><output class="val" id="o-${id}" style="color:${col}">${val}${unit || ''}</output></div><input type="range" id="${id}" min="${min}" max="${max}" step="${step || 1}" value="${val}" style="--c:${col}"><div class="between tiny muted"><span>${min}${unit || ''}</span><span>${max}${unit || ''}</span></div></div>`;
const rv = (h, id) => +$('#' + id, h).value;
const outv = (h, id, t) => { const o = $('#o-' + id, h); if (o) o.textContent = t; };
const gcdI = (a, b) => b ? gcdI(b, a % b) : a;
function exact(num, den, root) {   // (num/den)·√root  → teks
  const g = gcdI(Math.round(num * 1000), Math.round(den * 1000)) / 1000 || 1; let p = Math.round(num / g * 1000) / 1000, q = Math.round(den / g * 1000) / 1000;
  const r = root === 1 ? '' : '√' + root; if (root === 1) return q === 1 ? fmt(p) : fmt(p) + '/' + fmt(q);
  const c = p === 1 ? '' : fmt(p); return q === 1 ? c + r : c + r + '/' + fmt(q);
}

/* ======================= WIDGET ======================= */
const WID = {};
WID['w-45'] = function (host) {
  host.innerHTML = `<div class="wg"><div class="wg-l"><svg id="v" viewBox="0 0 360 280" class="wsvg"></svg><div class="row gap wrap"><button class="btn btn-primary btn-sm" id="cut">✂ Potong diagonal</button><span class="muted tiny">Ubin populer:</span><button class="chip-btn" data-s="30">30 cm</button><button class="chip-btn" data-s="40">40 cm</button><button class="chip-btn" data-s="60">60 cm</button></div></div><div class="wg-r">${msl('s', 'Sisi persegi / ubin (s)', 5, 60, 40, 1, '#0E9E69', ' cm')}<div id="out"></div></div></div>`;
  let cut = false;
  function draw() {
    const s = rv(host, 's'); outv(host, 's', s + ' cm'); const f = .6 + .4 * (s - 5) / 55, z = 150 * f, x0 = 180 - z / 2, y0 = 120 - z / 2 + 6, g = cut ? 12 : 0;
    const TL = [x0, y0], TR = [x0 + z, y0], BL = [x0, y0 + z], BR = [x0 + z, y0 + z], P = a => a.join(',');
    const d = s * R2;
    $('#v', host).innerHTML = `<g style="transform:translate(${g}px,${g}px);transition:transform .6s"><polygon points="${P(BL)} ${P(BR)} ${P(TR)}" fill="#8C6DFF" fill-opacity=".3" stroke="#5B3FD9" stroke-width="4" stroke-linejoin="round"/><path d="M${BR[0] - 16} ${BR[1]}v-16h16" fill="none" stroke="#5B3FD9" stroke-width="2.5"/><text x="${x0 + z / 2}" y="${BL[1] + 24}" class="tl g" text-anchor="middle">${s}</text><text x="${BL[0] + z * .52 + 14}" y="${TR[1] + z * .5 + 6}" class="tl o" text-anchor="start" transform="rotate(-45 ${BL[0] + z / 2} ${y0 + z / 2})">${s}√2</text><text x="${BR[0] - 44}" y="${BR[1] - 12}" class="ts">45°</text></g>` +
      `<g style="transform:translate(${-g}px,${-g}px);transition:transform .6s"><polygon points="${P(BL)} ${P(TL)} ${P(TR)}" fill="#1FC98B" fill-opacity=".3" stroke="#0E9E69" stroke-width="4" stroke-linejoin="round"/><path d="M${TL[0]} ${TL[1] + 16}h16v-16" transform="translate(0 0)" fill="none" stroke="#0E9E69" stroke-width="2.5"/><text x="${TL[0] - 12}" y="${y0 + z / 2}" class="tl g" text-anchor="end">${s}</text><text x="${TL[0] + 18}" y="${TL[1] + 40}" class="ts">45°</text></g><text x="180" y="270" text-anchor="middle" class="ts">${cut ? 'Dua segitiga siku-siku sama kaki — masing-masing 45°–45°–90°' : 'Persegi bersisi s'}</text>`;
    $('#out', host).innerHTML = `<div class="verdict ok"><span class="pill ok">Rasio 1 : 1 : √2</span><h3>Diagonal = ${s}√2 ≈ <span class="big">${n2(d)} cm</span></h3><p>Sisi miring ≈ ${n2(R2)} × sisi siku-siku</p></div>` +
      `<ol class="steps"><li><b>1</b><div><strong>Pythagoras</strong><span>c² = ${s}² + ${s}² = ${s * s} + ${s * s} = ${2 * s * s}</span></div></li><li><b>2</b><div><strong>Sederhanakan</strong><span>c² = 2 × ${s}² → c = ${s}√2</span></div></li><li class="last"><b>3</b><div><strong>Nilai pendekatan</strong><span>${s} × 1,414 ≈ ${n2(d)} cm</span></div></li></ol>`;
  }
  host.addEventListener('input', e => { if (e.target.id === 's') draw(); });
  host.addEventListener('click', e => { if (e.target.closest('#cut')) { cut = !cut; e.target.closest('#cut').textContent = cut ? '↩ Satukan kembali' : '✂ Potong diagonal'; draw(); } const c = e.target.closest('[data-s]'); if (c) { $('#s', host).value = c.dataset.s; draw(); } });
  draw();
};
WID['w-30'] = function (host) {
  host.innerHTML = `<div class="wg"><div class="wg-l"><svg id="v" viewBox="0 0 360 280" class="wsvg"></svg><div class="row gap wrap"><button class="btn btn-primary btn-sm" id="cut">✂ Belah lewat garis tinggi</button></div></div><div class="wg-r">${msl('x', 'Sisi terpendek (x) — setengah sisi segitiga sama sisi', 2, 20, 6, 1, '#1FC98B', ' cm')}<div id="out"></div></div></div>`;
  let cut = false;
  function draw() {
    const x = rv(host, 'x'); outv(host, 'x', x + ' cm'); const f = .65 + .35 * (x - 2) / 18, W = 240 * f, H = W * R3 / 2, g = cut ? 14 : 0, y = 236, A = [180 - W / 2, y], B = [180 + W / 2, y], C = [180, y - H], M = [180, y], P = a => a.join(',');
    $('#v', host).innerHTML = `<g style="transform:translate(${-g}px,0);transition:transform .6s"><polygon points="${P(A)} ${P(M)} ${P(C)}" fill="#1FC98B" fill-opacity=".28" stroke="#0E9E69" stroke-width="4" stroke-linejoin="round"/><text x="${(A[0] + M[0]) / 2}" y="${y + 22}" class="tl b" text-anchor="middle">${x}</text><text x="${A[0] + 26}" y="${y - 8}" class="ts">60°</text><text x="${C[0] - 8}" y="${C[1] + 44}" class="ts" text-anchor="end">30°</text><text x="${(A[0] + C[0]) / 2 - 12}" y="${(A[1] + C[1]) / 2}" class="tl o" text-anchor="end">${2 * x}</text></g>` +
      `<g style="transform:translate(${g}px,0);transition:transform .6s"><polygon points="${P(M)} ${P(B)} ${P(C)}" fill="#8C6DFF" fill-opacity=".28" stroke="#5B3FD9" stroke-width="4" stroke-linejoin="round"/><path d="M${M[0]} ${M[1] - 14}h14v14" transform="scale(1)" fill="none" stroke="#5B3FD9" stroke-width="2.5" ${'transform="translate(0 0)"'}/><text x="${(M[0] + B[0]) / 2}" y="${y + 22}" class="tl b" text-anchor="middle">${x}</text><text x="${B[0] - 40}" y="${y - 8}" class="ts">60°</text><text x="${C[0] + 8}" y="${C[1] + 44}" class="ts">30°</text><text x="${(B[0] + C[0]) / 2 + 12}" y="${(B[1] + C[1]) / 2}" class="tl o" text-anchor="start">${2 * x}</text></g><text x="${C[0] + g + 12}" y="${(y + C[1]) / 2 + 8}" class="tl g" text-anchor="start" ${cut ? '' : 'opacity="1"'}>${x}√3</text><line x1="${C[0]}" y1="${C[1]}" x2="${M[0]}" y2="${M[1]}" stroke="#FF9F43" stroke-width="3" stroke-dasharray="8 6" style="opacity:${cut ? 0 : 1};transition:opacity .4s"/>`;
    $('#out', host).innerHTML = `<div class="verdict ok"><span class="pill ok">Rasio 1 : √3 : 2</span><h3>Tinggi = ${x}√3 ≈ <span class="big">${n2(x * R3)} cm</span></h3><p>Sisi segitiga sama sisi = 2 × ${x} = ${2 * x} cm</p></div><ol class="steps"><li><b>1</b><div><strong>Setengah alas</strong><span>Garis tinggi membagi alas ${2 * x} cm menjadi ${x} cm + ${x} cm</span></div></li><li><b>2</b><div><strong>Pythagoras</strong><span>t² = (${2 * x})² − ${x}² = ${4 * x * x} − ${x * x} = ${3 * x * x}</span></div></li><li class="last"><b>3</b><div><strong>Hasil</strong><span>t = ${x}√3 ≈ ${n2(x * R3)} cm</span></div></li></ol>`;
  }
  host.addEventListener('input', e => { if (e.target.id === 'x') draw(); });
  host.addEventListener('click', e => { const b = e.target.closest('#cut'); if (b) { cut = !cut; b.textContent = cut ? '↩ Satukan kembali' : '✂ Belah lewat garis tinggi'; draw(); } });
  draw();
};
WID['k-istimewa'] = function (host) {
  const OPT = { 45: [['leg', 'Sisi siku-siku'], ['hyp', 'Sisi miring']], 30: [['s', 'Sisi terpendek (depan 30°)'], ['m', 'Sisi depan 60°'], ['h', 'Sisi miring']] };
  host.innerHTML = `<div class="kalk"><div class="form"><div class="g3"><label>Jenis segitiga<select id="kj" class="inp"><option value="45">45° – 45° – 90°</option><option value="30">30° – 60° – 90°</option></select></label><label>Sisi yang diketahui<select id="kk" class="inp"></select></label><label>Panjangnya (cm)<input id="kv" type="number" min="1" max="200" step="1" value="10" class="inp"></label></div></div><div id="out"></div></div>`;
  const fill = () => { $('#kk', host).innerHTML = OPT[$('#kj', host).value].map(o => `<option value="${o[0]}">${o[1]}</option>`).join(''); };
  function calc() {
    const j = $('#kj', host).value, k = $('#kk', host).value, v = Math.max(.1, +$('#kv', host).value || 1); let rows = [], note = '';
    if (j === '45') {
      if (k === 'leg') { rows = [['Sisi siku-siku 1', exact(v, 1, 1), v], ['Sisi siku-siku 2', exact(v, 1, 1), v], ['Sisi miring', exact(v, 1, 2), v * R2]]; note = `Diketahui sisi siku-siku → <b>kalikan √2</b> untuk sisi miring.`; }
      else { rows = [['Sisi siku-siku 1', exact(v, 2, 2), v / R2], ['Sisi siku-siku 2', exact(v, 2, 2), v / R2], ['Sisi miring', exact(v, 1, 1), v]]; note = `Diketahui sisi miring → <b>bagi √2</b>: ${v}/√2 = ${v}√2/2 (rasionalisasi).`; }
    } else {
      if (k === 's') { rows = [['Terpendek (depan 30°)', exact(v, 1, 1), v], ['Depan 60°', exact(v, 1, 3), v * R3], ['Sisi miring', exact(2 * v, 1, 1), 2 * v]]; note = `Terpendek = x → depan 60° = x√3, miring = 2x.`; }
      else if (k === 'm') { rows = [['Terpendek (depan 30°)', exact(v, 3, 3), v / R3], ['Depan 60°', exact(v, 1, 1), v], ['Sisi miring', exact(2 * v, 3, 3), 2 * v / R3]]; note = `Depan 60° = x√3 → x = ${v}/√3 = ${v}√3/3.`; }
      else { rows = [['Terpendek (depan 30°)', exact(v, 2, 1), v / 2], ['Depan 60°', exact(v, 2, 3), v * R3 / 2], ['Sisi miring', exact(v, 1, 1), v]]; note = `Miring = 2x → terpendek = miring ÷ 2, depan 60° = (miring ÷ 2)√3.`; }
    }
    const mx = Math.max(...rows.map(r => r[2]));
    $('#out', host).innerHTML = `<div class="kres">${rows.map((r, i) => `<div class="kr-r ${i === rows.length - 1 && r[0] === 'Sisi miring' ? 'hyp' : ''}"><span>${r[0]}</span><div class="kbar"><i style="width:${Math.max(8, r[2] / mx * 100)}%"></i></div><b>${r[1]}</b><small>≈ ${n2(r[2])} cm</small></div>`).join('')}</div><div class="insight">${ic('sparkles')}<div><strong>Cara hitungnya</strong><p>${note}</p></div></div>`;
  }
  host.addEventListener('change', e => { if (e.target.id === 'kj') fill(); calc(); }); host.addEventListener('input', e => { if (e.target.id === 'kv') calc(); });
  fill(); calc();
};
WID['w-gunting'] = function (host) {
  host.innerHTML = `<div class="wg"><div class="wg-l"><svg id="v" viewBox="0 0 360 260" class="wsvg"></svg></div><div class="wg-r">${msl('t', 'Bukaan gunting (sudut antar dua sisi)', 40, 140, 60, 1, '#5B3FD9', '°')}<div class="note info">${ic('info')}<div>Dua sisi tetap: <b>a = 6</b> dan <b>b = 8</b>. Hanya sudut di antaranya yang berubah — lihat apa yang terjadi pada sisi ketiga (c).</div></div><div id="out"></div></div></div>`;
  function draw() {
    const t = rv(host, 't'); outv(host, 't', t + '°'); const r = t * Math.PI / 180, a = 6, b = 8, c2 = a * a + b * b - 2 * a * b * Math.cos(r), c = Math.sqrt(c2), k = 22, P = [70, 230], A = [P[0] + a * k, P[1]], B = [P[0] + b * k * Math.cos(r), P[1] - b * k * Math.sin(r)];
    const jenis = Math.abs(t - 90) < .5 ? 'siku' : t < 90 ? 'lancip' : 'tumpul', col = { siku: '#1FC98B', lancip: '#3B82F6', tumpul: '#FF9F43' }[jenis];
    $('#v', host).innerHTML = `<polygon points="${P} ${A} ${B}" fill="${col}" fill-opacity=".16"/><line x1="${P[0]}" y1="${P[1]}" x2="${A[0]}" y2="${A[1]}" stroke="#3B82F6" stroke-width="6" stroke-linecap="round"/><line x1="${P[0]}" y1="${P[1]}" x2="${B[0]}" y2="${B[1]}" stroke="#5B3FD9" stroke-width="6" stroke-linecap="round"/><line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 0"/><circle cx="${P[0]}" cy="${P[1]}" r="8" fill="#fff" stroke="#1e1b39" stroke-width="3"/><text x="${(P[0] + A[0]) / 2}" y="${P[1] + 24}" class="tl b" text-anchor="middle">a = 6</text><text x="${(P[0] + B[0]) / 2 - 12}" y="${(P[1] + B[1]) / 2}" class="tl" text-anchor="end" fill="#5B3FD9">b = 8</text><text x="${(A[0] + B[0]) / 2 + 12}" y="${(A[1] + B[1]) / 2}" class="tl" fill="${col}">c</text><path d="M${P[0] + 34} ${P[1]}A34 34 0 0 0 ${P[0] + 34 * Math.cos(r)} ${P[1] - 34 * Math.sin(r)}" fill="none" stroke="#1e1b39" stroke-width="2.5"/><text x="${P[0] + 44}" y="${P[1] - 12}" class="ts">${t}°</text>`;
    $('#out', host).innerHTML = `<div class="verdict ${jenis === 'siku' ? 'ok' : jenis === 'lancip' ? 'info' : 'warn'}"><span class="pill ${jenis === 'siku' ? 'ok' : jenis === 'lancip' ? 'info' : 'warn'}">${jenis === 'siku' ? 'SIKU-SIKU' : jenis === 'lancip' ? 'LANCIP' : 'TUMPUL'}</span><h3>c² ≈ ${n2(c2)}</h3><p>a² + b² = 36 + 64 = <b>100</b> &nbsp;→&nbsp; c² ${Math.abs(c2 - 100) < 1 ? '≈' : c2 < 100 ? '<' : '>'} a² + b²</p><p class="muted tiny">Makin lebar bukaan, makin panjang c. Tepat 90° → c² = a² + b² (Pythagoras).</p></div>`;
  }
  host.addEventListener('input', e => { if (e.target.id === 't') draw(); }); draw();
};
WID['w-tangga'] = function (host) {
  host.innerHTML = `<div class="wg"><div class="wg-l"><svg id="v" viewBox="0 0 360 280" class="wsvg"></svg></div><div class="wg-r">${msl('L', 'Panjang tangga', 3, 9, 5, .5, '#FF9F43', ' m')}${msl('b', 'Jarak kaki tangga dari dinding', .5, 4, 1.25, .05, '#3B82F6', ' m')}<div id="out"></div></div></div>`;
  function draw() {
    const L = rv(host, 'L'); let b = rv(host, 'b'); if (b >= L - .2) { b = L - .2; $('#b', host).value = b; } outv(host, 'L', L + ' m'); outv(host, 'b', n2(b) + ' m');
    const h = Math.sqrt(L * L - b * b), ang = Math.acos(b / L) * 180 / Math.PI, S = 200 / L, wx = 70, gy = 244, foot = [wx + b * S, gy], top = [wx, gy - h * S], ok = ang >= 70 && ang <= 80;
    $('#v', host).innerHTML = `<rect x="20" y="30" width="50" height="214" rx="6" fill="#DAD3FA"/><rect x="0" y="244" width="360" height="36" fill="#8FD8B4"/><line x1="${foot[0]}" y1="${foot[1]}" x2="${top[0]}" y2="${top[1]}" stroke="#FF9F43" stroke-width="9" stroke-linecap="round"/>` + [.2, .4, .6, .8].map(k => `<line x1="${foot[0] + (top[0] - foot[0]) * k - 8}" y1="${foot[1] + (top[1] - foot[1]) * k + 5}" x2="${foot[0] + (top[0] - foot[0]) * k + 8}" y2="${foot[1] + (top[1] - foot[1]) * k - 5}" stroke="#D9730D" stroke-width="4"/>`).join('') + `<line x1="${wx}" y1="${gy + 8}" x2="${foot[0]}" y2="${gy + 8}" stroke="#3B82F6" stroke-width="4"/><path d="M${wx} ${gy - 14}h14v14" fill="none" stroke="#1e1b39" stroke-width="2.5"/><text x="${wx - 8}" y="${(gy + top[1]) / 2}" class="tl g" text-anchor="end">${n2(h)} m</text><text x="${(wx + foot[0]) / 2}" y="${gy + 28}" class="tl b" text-anchor="middle">${n2(b)} m</text><text x="${foot[0] + 8}" y="${foot[1] - 10}" class="ts">${n2(ang)}°</text><text x="${(foot[0] + top[0]) / 2 + 14}" y="${(foot[1] + top[1]) / 2 - 6}" class="tl o" text-anchor="start">${L} m</text>`;
    $('#out', host).innerHTML = `<div class="verdict ${ok ? 'ok' : 'warn'}"><span class="pill ${ok ? 'ok' : 'warn'}">${ok ? 'Kemiringan umumnya aman' : 'Kemiringan kurang ideal'}</span><h3>Tinggi jangkauan = <span class="big">${n2(h)} m</span></h3><p>h = √(${L}² − ${n2(b)}²) = √${n2(L * L - b * b)}</p></div><div class="insight">${ic('info')}<div><strong>Pedoman umum keselamatan</strong><p>Tangga sandar biasanya dipasang membentuk sudut ± 75° (kaki ±¼ tinggi dari dinding). Kamu bisa menghitung sudutnya dari rasio sisi. Praktik nyata selalu dengan arahan guru/petugas.</p></div></div>`;
  }
  host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) draw(); }); draw();
};
WID['w-kapal'] = function (host) {
  host.innerHTML = `<div class="wg"><div class="wg-l"><svg id="v" viewBox="0 0 360 280" class="wsvg"></svg></div><div class="wg-r">${msl('n', 'Berlayar ke utara', 2, 30, 18, 1, '#5B3FD9', ' km')}${msl('e', 'Lalu berlayar ke timur', 2, 30, 24, 1, '#3B82F6', ' km')}${msl('v', 'Kecepatan kapal SAR', 10, 60, 30, 5, '#FF9F43', ' km/jam')}<div id="out"></div></div></div>`;
  function draw() {
    const N = rv(host, 'n'), E = rv(host, 'e'), V = rv(host, 'v'); outv(host, 'n', N + ' km'); outv(host, 'e', E + ' km'); outv(host, 'v', V + ' km/jam');
    const d = Math.sqrt(N * N + E * E), S = Math.min(270 / E, 200 / N), O = [40, 240], P1 = [O[0], O[1] - N * S], P2 = [O[0] + E * S, O[1] - N * S], t = d / V * 60;
    $('#v', host).innerHTML = `<defs><pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#B7D0FF" stroke-opacity=".5"/></pattern></defs><rect width="360" height="280" rx="14" fill="#E8F2FF"/><rect width="360" height="280" rx="14" fill="url(#gr)"/><polyline points="${O} ${P1} ${P2}" fill="none" stroke="#5B3FD9" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><line x1="${O[0]}" y1="${O[1]}" x2="${P2[0]}" y2="${P2[1]}" stroke="#EF4444" stroke-width="4" stroke-dasharray="10 7"/><path d="M${P1[0]} ${P1[1] + 16}h16v-16" fill="none" stroke="#1e1b39" stroke-width="2.5"/><circle cx="${O[0]}" cy="${O[1]}" r="8" fill="#1FC98B" stroke="#fff" stroke-width="3"/><circle cx="${P2[0]}" cy="${P2[1]}" r="9" fill="#EF4444" stroke="#fff" stroke-width="3"/><text x="${O[0] + 12}" y="${O[1] + 20}" class="ts">pelabuhan</text><text x="${P2[0]}" y="${P2[1] - 14}" class="ts" text-anchor="middle">kapal mati mesin</text><text x="${O[0] - 6}" y="${(O[1] + P1[1]) / 2}" class="tl b" text-anchor="end">${N}</text><text x="${(P1[0] + P2[0]) / 2}" y="${P1[1] - 8}" class="tl b" text-anchor="middle">${E}</text><text x="${(O[0] + P2[0]) / 2 + 10}" y="${(O[1] + P2[1]) / 2 + 22}" class="tl" fill="#EF4444">${n2(d)}</text>`;
    $('#out', host).innerHTML = `<div class="verdict ok"><span class="pill ok">Jalur SAR lurus</span><h3>Jarak lurus = <span class="big">${n2(d)} km</span></h3><p>√(${N}² + ${E}²) = √${N * N + E * E}</p></div><ol class="steps"><li><b>1</b><div><strong>Waktu tempuh SAR</strong><span>${n2(d)} km ÷ ${V} km/jam = ${n2(d / V)} jam ≈ <b>${Math.round(t)} menit</b></span></div></li><li class="last"><b>2</b><div><strong>Hemat dibanding jalur siku</strong><span>${N + E} km − ${n2(d)} km = ${n2(N + E - d)} km (${Math.round((N + E - d) / (N + E) * 100)}% lebih pendek)</span></div></li></ol>`;
  }
  host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) draw(); }); draw();
};
WID['w-jembatan'] = function (host) {
  host.innerHTML = `<div class="wg"><div class="wg-l"><svg id="v" viewBox="0 0 360 280" class="wsvg"></svg></div><div class="wg-r">${msl('h', 'Tinggi tiang (h)', 6, 24, 12, 1, '#5B3FD9', ' m')}${msl('b', 'Jarak kabel terjauh dari tiang', 4, 24, 15, 1, '#3B82F6', ' m')}${msl('k', 'Jumlah kabel tiap sisi', 1, 6, 3, 1, '#FF9F43', '')}<div id="out"></div></div></div>`;
  function draw() {
    const h = rv(host, 'h'), b = rv(host, 'b'), n = rv(host, 'k'); outv(host, 'h', h + ' m'); outv(host, 'b', b + ' m'); outv(host, 'k', n);
    const S = Math.min(150 / b, 190 / h), cx = 180, gy = 236; let tot = 0, ln = '';
    let svg = `<rect width="360" height="280" rx="14" fill="#EAF2FF"/><rect y="244" width="360" height="36" fill="#6EA8FF"/><rect x="${cx - 160}" y="${gy}" width="320" height="12" rx="5" fill="#5B3FD9"/><rect x="${cx - 7}" y="${gy - h * S}" width="14" height="${h * S}" fill="#3d2a99"/>`;
    for (let i = 1; i <= n; i++) { const d = b * i / n, c = Math.sqrt(h * h + d * d); tot += 2 * c; ln += `<li><b>${i}</b><div><strong>Kabel ${i}</strong><span>√(${h}² + ${n2(d)}²) = ${n2(c)} m</span></div></li>`; svg += `<line x1="${cx}" y1="${gy - h * S}" x2="${cx - d * S}" y2="${gy}" stroke="#FF9F43" stroke-width="3"/><line x1="${cx}" y1="${gy - h * S}" x2="${cx + d * S}" y2="${gy}" stroke="#FF9F43" stroke-width="3"/>`; }
    svg += `<circle cx="${cx}" cy="${gy - h * S}" r="8" fill="#FF9F43"/><text x="${cx + 14}" y="${gy - h * S / 2}" class="tl g" text-anchor="start">${h} m</text><text x="${cx + b * S / 2}" y="${gy + 28}" class="tl b" text-anchor="middle">${b} m</text>`;
    $('#v', host).innerHTML = svg;
    $('#out', host).innerHTML = `<div class="verdict ok"><span class="pill ok">Total kabel kedua sisi</span><h3><span class="big">${n2(tot)} m</span></h3><p>Tiap kabel = sisi miring segitiga siku-siku berbeda</p></div><ol class="steps">${ln}</ol>`;
  }
  host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) draw(); }); draw();
};
WID['studio'] = function (host) {
  host.innerHTML = `<div class="tabs"><button class="tab on" data-w="w-tangga">🪜 Tangga</button><button class="tab" data-w="w-kapal">🚢 Kapal & SAR</button><button class="tab" data-w="w-jembatan">🌉 Jembatan kabel</button></div><div class="studio-b"></div>`;
  const box = $('.studio-b', host); const show = w => { box.innerHTML = ''; WID[w](box); };
  host.addEventListener('click', e => { const t = e.target.closest('.tab'); if (!t) return; $$('.tab', host).forEach(x => x.classList.toggle('on', x === t)); show(t.dataset.w); });
  show('w-tangga');
};
['TP2', 'TP3', 'TP4'].forEach(tp => { WID['sim-' + tp] = host => SIM.mount(tp, host); });

/* ======================= ISI MATERI ======================= */
const MAT = {
  TP2: {
    tab: 'TP 2 · Hipotenusa & Sisi Tegak', icon: 'triangle', tujuan: 'Menemukan hubungan sisi-sisi segitiga siku-siku dan menghitung panjang sisi miring maupun sisi siku-siku dengan c² = a² + b².',
    sec: [
      { id: 'hook', t: 'hook', judul: 'Mulai dari dunia nyata', judulIsi: 'Tangga Pak Rudi', img: 'tangga', teks: 'Pak Rudi, tukang bangunan di Tanjungpinang, harus memasang lampu di dinding setinggi <b>4 m</b>. Tangga yang ia bawa panjangnya <b>5 m</b>. Dinding berdiri tegak lurus tanah, sehingga tangga, dinding, dan tanah membentuk <b>segitiga siku-siku</b>.', tanya: 'Berapa jauh kaki tangga harus diletakkan dari dinding agar ujung tangga tepat sampai di lampu?', jawab: '<b>3 m.</b> Sebab 3² + 4² = 9 + 16 = 25 = 5². Inilah tripel 3-4-5 yang dipakai tukang sejak lama. Hari ini kamu akan paham <i>mengapa</i> bisa begitu.' },
      { id: 'konsep', t: 'steps', judul: 'Memahami teorema langkah demi langkah', steps: [
        { h: 'Kenali segitiga siku-siku & nama sisinya', v: () => Art.tri({ a: 'tegak (b)', b: 'alas (a)', c: 'miring (c)', la: '', lb: '', lc: '' }, 300, 190), t: 'Segitiga siku-siku punya satu sudut <b>90°</b>. Sisi yang <b>berhadapan dengan sudut 90°</b> disebut <b>sisi miring (hipotenusa) = c</b> dan selalu yang <b>terpanjang</b>. Dua sisi pembentuk sudut siku-siku adalah <b>alas (a)</b> dan <b>tegak (b)</b>. Posisi gambar boleh diputar — sisi miring tetap yang berhadapan dengan sudut siku-siku.' },
        { h: 'Bangun persegi pada tiap sisi', v: () => Art.proof(3, 4, { s: 22 }), t: 'Bayangkan membuat persegi pada setiap sisi. Luas persegi = sisi × sisi. Untuk sisi 3, 4, dan 5: luasnya <b>9</b>, <b>16</b>, dan <b>25</b>. Perhatikan: <b>9 + 16 = 25</b>. Persegi pada sisi miring sama luasnya dengan gabungan dua persegi lainnya!' },
        { h: 'Itulah Teorema Pythagoras', v: () => '<div class="big-eq">a² + b² = c²</div><p class="muted center">berlaku untuk <b>setiap</b> segitiga siku-siku, berapa pun ukurannya</p>', t: 'Jumlah <b>luas persegi pada kedua sisi siku-siku</b> sama dengan <b>luas persegi pada sisi miring</b>. Karena luas persegi = sisi², maka <b>a² + b² = c²</b>. Coba pada ukuran lain (6, 8, 10): 36 + 64 = 100 ✔.' },
        { h: 'Dua jenis pertanyaan, dua cara', v: () => '<div class="g2 duo"><div class="duo-c amber"><small>MENCARI SISI MIRING</small><code>c = √(a² + b²)</code><b>JUMLAHKAN</b> kuadrat, lalu akar</div><div class="duo-c blue"><small>MENCARI SISI SIKU-SIKU</small><code>a = √(c² − b²)</code><b>KURANGKAN</b> kuadrat, lalu akar</div></div>', t: 'Tanya dirimu: <i>“Sisi apa yang dicari?”</i> Jika <b>sisi miring</b> → jumlahkan. Jika <b>salah satu sisi siku-siku</b> → kurangkan (sisi miring dikurangi sisi lain, selalu yang terbesar di depan).' },
        { h: 'Selalu cek kewajaran', v: () => '<div class="check-box">✔ sisi miring <b>lebih panjang</b> dari kedua sisi lain<br>✔ satuan sudah benar (cm, m, km)<br>✔ akar sudah ditarik</div>', t: 'Tiga pemeriksaan cepat sebelum menjawab. Jika sisi miring hasil hitunganmu lebih pendek dari sisi lain, hampir pasti kamu menjumlahkan padahal harus mengurangkan.' }
      ] },
      { id: 'coba', t: 'widget', judul: 'Coba sendiri: geser sisi segitiga', w: 'sim-TP2', cap: 'Geser slider dan lihat luas persegi berubah. Cari kombinasi yang membuat ketiga sisi bilangan bulat!' },
      { id: 'tangga', t: 'widget', judul: 'Kembali ke tangga Pak Rudi', w: 'w-tangga', cap: 'Ubah panjang tangga dan jarak kaki. Berapa tinggi yang bisa dijangkau? Coba panjang 5 m dan jarak 3 m.' },
      { id: 'contoh', t: 'contoh', judul: 'Contoh terbimbing', items: [
        { j: 'Kapal nelayan di perairan Kepri', soal: 'Perahu berlayar ke barat 12 km, lalu berbelok ke selatan 5 km. Berapa jarak terpendek perahu dari titik awal?', img: Art.tri({ a: '5 km', b: '12 km', c: '? km', la: 'Selatan', lb: 'Barat', lc: 'Jarak' }, 280, 180), langkah: [['Gambar & identifikasi', 'Barat dan selatan saling tegak lurus → segitiga siku-siku dengan a = 12 dan b = 5. Ditanya <b>sisi miring</b>.'], ['Pilih cara', 'Sisi miring → <b>jumlahkan</b>: c² = a² + b².'], ['Hitung', 'c² = 12² + 5² = 144 + 25 = 169'], ['Akar & satuan', 'c = √169 = <b>13 km</b>. Masuk akal: 13 &gt; 12 dan 13 &gt; 5.']] },
        { j: 'Layang-layang', soal: 'Benang layang-layang 25 m terentang lurus. Layang-layang berada pada ketinggian 24 m. Berapa jarak mendatar anak yang memegang benang dari titik tepat di bawah layang-layang?', langkah: [['Gambar & identifikasi', 'Tanah ⟂ tinggi → segitiga siku-siku. Benang = sisi miring (25), tinggi = 24. Ditanya <b>sisi siku-siku</b>.'], ['Pilih cara', 'Sisi siku-siku → <b>kurangkan</b>: b² = c² − a².'], ['Hitung', 'b² = 25² − 24² = 625 − 576 = 49'], ['Akar & satuan', 'b = √49 = <b>7 m</b>. Wajar: 7 &lt; 25.']] }
      ] },
      { id: 'salah', t: 'salah', judul: 'Salah kaprah yang sering terjadi', items: [
        { x: 'c = a + b → 3 + 4 = 7', y: 'c² = a² + b² → c² = 25 → c = 5', why: 'Yang dijumlahkan adalah <b>kuadratnya</b>, bukan panjangnya. Jalan terpendek (5) lebih pendek dari jalan memutar (3 + 4 = 7).' },
        { x: 'c² = 25 → jawabannya 25', y: 'c = √25 = 5', why: 'Setelah menjumlahkan kuadrat, <b>tarik akar</b> dulu. 25 adalah luas persegi, bukan panjang sisi.' },
        { x: 'Mencari sisi siku-siku, tetapi tetap menjumlahkan', y: 'b² = c² − a² (kurangkan)', why: 'Sisi miring sudah “mengandung” kedua sisi lain. Cek: hasil harus <b>lebih kecil</b> dari sisi miring.' },
        { x: 'Sisi miring = sisi yang tampak miring di gambar', y: 'Sisi miring = sisi di depan sudut 90°', why: 'Jika gambar diputar, sisi “miring” bisa tampak mendatar. Selalu cari sudut siku-sikunya dulu.' }
      ] },
      { id: 'latihan', t: 'latihan', judul: 'Latihan berumpan balik', items: [
        { t: 'num', q: 'Sisi siku-siku segitiga 6 cm dan 8 cm. Panjang sisi miring? (cm)', a: 10, h: 'Jumlahkan kuadrat: 36 + 64, lalu akar.', e: '6² + 8² = 100 → c = 10 cm.' },
        { t: 'num', q: 'Tangga 13 m bersandar pada dinding, kaki tangga 5 m dari dinding. Tinggi ujung tangga? (m)', a: 12, h: 'Yang dicari sisi siku-siku → kurangkan: 169 − 25.', e: '13² − 5² = 144 → 12 m (tripel 5-12-13).' },
        { t: 'num', q: 'Benang layang-layang 25 m, tinggi 24 m. Jarak mendatar? (m)', a: 7, h: 'Sisi miring = 25.', e: '25² − 24² = 49 → 7 m.' },
        { t: 'pg', q: 'Pada soal “sisi siku-siku 9 cm dan 12 cm, cari sisi miring”, langkah yang benar adalah…', o: ['9 + 12 = 21', '√(9² + 12²) = 15', '√(12² − 9²) ≈ 7,9', '9² + 12² = 225 (jawab 225)'], b: 1, h: 'Mencari sisi miring: jumlahkan kuadrat, lalu akar.', e: '81 + 144 = 225 → √225 = 15 cm.' }
      ] },
      { id: 'rangkum', t: 'rangkum', judul: 'Rangkuman 1 menit', poin: ['Sisi miring (c) berhadapan dengan sudut 90° dan paling panjang.', 'a² + b² = c² — luas persegi sisi miring = jumlah luas dua persegi lainnya.', 'Cari sisi miring → <b>jumlahkan</b> kuadrat; cari sisi siku-siku → <b>kurangkan</b>.', 'Selalu tarik akar, cek kewajaran, dan tulis satuan.'], ingat: 'Tukang dan pelaut memakainya setiap hari: tangga, atap, jarak kapal.' }
    ]
  },
  TP3: {
    tab: 'TP 3 · Kebalikan Pythagoras', icon: 'search', tujuan: 'Menentukan jenis segitiga (siku-siku, lancip, tumpul) dari ukuran ketiga sisinya.',
    sec: [
      { id: 'hook', t: 'hook', judul: 'Mulai dari dunia nyata', judulIsi: 'Apakah pojok kusen benar-benar siku-siku?', img: 'tali', teks: 'Tukang kayu membuat kusen pintu tetapi tidak membawa busur derajat. Ia mengukur <b>30 cm</b> pada satu sisi, <b>40 cm</b> pada sisi lain dari pojok, lalu mengukur jarak kedua titik itu (diagonal).', tanya: 'Jika diagonalnya tepat 50 cm, apa kesimpulannya? Bagaimana bila 48 cm atau 53 cm?', jawab: '<b>50 cm → pojok tepat siku-siku</b> (30² + 40² = 50²). <b>Kurang dari 50</b> → sudutnya lancip (&lt; 90°), <b>lebih dari 50</b> → tumpul (&gt; 90°). Teorema Pythagoras bisa <b>dibalik</b> untuk menguji sudut!' },
      { id: 'konsep', t: 'steps', judul: 'Teorema dibalik: tiga kemungkinan', steps: [
        { h: 'Teorema & kebalikannya', v: () => '<div class="big-eq sm">siku-siku ⇔ a² + b² = c²</div>', t: 'Dulu: “Jika segitiga siku-siku maka a² + b² = c²”. Sekarang dibalik: “Jika sisi-sisinya memenuhi a² + b² = c² maka segitiganya <b>siku-siku</b>”. Dengan c = sisi <b>terpanjang</b>.' },
        { h: 'Analogi gunting', v: () => '<div class="gun">✂</div>', t: 'Dua sisi (a dan b) seperti bilah gunting. Makin <b>lebar bukaannya</b>, makin <b>panjang jarak antar ujung</b> (c). Tepat 90° → c² = a² + b². Terlalu sempit → c lebih pendek (lancip). Terlalu lebar → c lebih panjang (tumpul). Coba langsung di widget di bawah!' },
        { h: 'Bandingkan c² dengan a² + b²', v: () => '<div class="g3 duo3"><div class="duo-c mint"><small>SIKU-SIKU</small><code>c² = a² + b²</code></div><div class="duo-c blue"><small>LANCIP</small><code>c² &lt; a² + b²</code></div><div class="duo-c amber"><small>TUMPUL</small><code>c² &gt; a² + b²</code></div></div>', t: '<b>Sama</b> → siku-siku. <b>c² lebih kecil</b> → semua sudut lancip (&lt; 90°). <b>c² lebih besar</b> → satu sudut tumpul (&gt; 90°). Ingat: tumpul = “c² Terlalu besar”.' },
        { h: 'Prosedur 3 langkah', v: () => '<div class="check-box">1️⃣ <b>URUTKAN</b> sisi, ambil yang terpanjang sebagai c<br>2️⃣ <b>KUADRATKAN</b> ketiganya<br>3️⃣ <b>BANDINGKAN</b> c² dengan a² + b²</div>', t: 'Jangan langsung menjumlahkan sembarang dua sisi! Pastikan c adalah sisi <b>terpanjang</b>. Sebelum itu cek juga syarat segitiga: <b>jumlah dua sisi terpendek harus lebih besar dari sisi terpanjang</b> (a + b &gt; c).' }
      ] },
      { id: 'gunting', t: 'widget', judul: 'Coba sendiri: bukaan gunting', w: 'w-gunting', cap: 'Geser sudut dari 40° hingga 140°. Pada sudut berapa c² tepat 100?' },
      { id: 'coba', t: 'widget', judul: 'Uji ukuran sisi apa pun', w: 'sim-TP3', cap: 'Atur tiga sisi atau pilih contoh cepat. Perhatikan warna dan gambar segitiganya.' },
      { id: 'contoh', t: 'contoh', judul: 'Contoh terbimbing', items: [
        { j: 'Petak kebun', soal: 'Petak kebun segitiga bersisi 7 m, 9 m, 10 m. Jenis segitiganya?', langkah: [['Urutkan', 'c = 10 (terpanjang); a = 7, b = 9. Cek: 7 + 9 = 16 &gt; 10 ✔ bisa jadi segitiga.'], ['Kuadratkan', 'c² = 100; a² + b² = 49 + 81 = 130'], ['Bandingkan', '100 &lt; 130 → c² &lt; a² + b²'], ['Kesimpulan', 'Segitiga <b>lancip</b>.']] },
        { j: 'Rangka atap', soal: 'Rangka atap dibuat dari kayu 5 m, 6 m, dan 10 m. Jenis segitiganya?', langkah: [['Urutkan & cek syarat', 'c = 10; 5 + 6 = 11 &gt; 10 ✔'], ['Kuadratkan', 'c² = 100; a² + b² = 25 + 36 = 61'], ['Bandingkan', '100 &gt; 61 → c² &gt; a² + b²'], ['Kesimpulan', 'Segitiga <b>tumpul</b> — atapnya sangat “landai” di puncak.']] }
      ] },
      { id: 'salah', t: 'salah', judul: 'Salah kaprah yang sering terjadi', items: [
        { x: 'Memakai sisi mana saja sebagai c', y: 'c = sisi terpanjang', why: 'Jika c bukan yang terpanjang, perbandingan tidak bermakna. Urutkan dulu.' },
        { x: 'c² &gt; a² + b² berarti lancip', y: 'c² &gt; a² + b² berarti <b>tumpul</b>', why: 'Ingat gunting: bukaan terlalu lebar → ujung makin jauh → c² makin besar → tumpul.' },
        { x: 'Sisi 3, 4, 8 membentuk segitiga', y: 'Tidak bisa: 3 + 4 = 7 &lt; 8', why: 'Syarat segitiga: dua sisi terpendek jika dijumlahkan harus lebih besar dari sisi terpanjang.' }
      ] },
      { id: 'latihan', t: 'latihan', judul: 'Latihan berumpan balik', items: [
        { t: 'pg', q: 'Sisi 8, 15, 17 membentuk segitiga…', o: ['Lancip', 'Siku-siku', 'Tumpul', 'Tidak dapat dibentuk'], b: 1, h: 'Kuadratkan: 64 + 225 vs 289.', e: '64 + 225 = 289 = 17² → siku-siku.' },
        { t: 'pg', q: 'Sisi 6, 7, 8 membentuk segitiga…', o: ['Lancip', 'Siku-siku', 'Tumpul', 'Tidak dapat dibentuk'], b: 0, h: '36 + 49 vs 64.', e: '85 &gt; 64 → c² &lt; a² + b² → lancip.' },
        { t: 'pg', q: 'Sisi 5, 7, 9 membentuk segitiga…', o: ['Lancip', 'Siku-siku', 'Tumpul', 'Tidak dapat dibentuk'], b: 2, h: '25 + 49 vs 81.', e: '74 &lt; 81 → c² &gt; a² + b² → tumpul.' },
        { t: 'num', q: 'Sisi 9, 12, dan x membentuk segitiga siku-siku dengan x sisi terpanjang. Nilai x?', a: 15, h: 'Jumlahkan 81 + 144, lalu akar.', e: '225 → x = 15.' }
      ] },
      { id: 'rangkum', t: 'rangkum', judul: 'Rangkuman 1 menit', poin: ['Urutkan → kuadratkan → bandingkan.', 'c² = a² + b² → <b>siku-siku</b>; c² &lt; a² + b² → <b>lancip</b>; c² &gt; a² + b² → <b>tumpul</b>.', 'Cek dulu: a + b &gt; c agar benar-benar segitiga.'], ingat: 'Tukang memakainya untuk menguji pojok bangunan tanpa busur derajat.' }
    ]
  },
  TP4: {
    tab: 'TP 4 · Tripel Pythagoras', icon: 'sparkles', tujuan: 'Mengenali tripel Pythagoras, kelipatannya, dan memakainya untuk menghitung cepat tanpa akar.',
    sec: [
      { id: 'hook', t: 'hook', judul: 'Mulai dari dunia nyata', judulIsi: 'Tali 12 simpul tukang', img: 'tali', teks: 'Banyak tukang tradisional membuat sudut siku-siku dengan <b>tali berukuran 12 ruas</b> yang disimpul sama jarak. Mereka menegangkan tali menjadi segitiga dengan sisi <b>3, 4, dan 5 ruas</b>.', tanya: 'Mengapa cukup memakai 3-4-5? Apakah ada ukuran bulat lain yang “ajaib” seperti itu?', jawab: 'Karena 3² + 4² = 5², kebalikan Pythagoras menjamin sudutnya <b>90°</b>. Ukuran bulat seperti ini disebut <b>tripel Pythagoras</b> — dan jumlahnya tak terhingga!' },
      { id: 'konsep', t: 'steps', judul: 'Mengenal keluarga tripel', steps: [
        { h: 'Apa itu tripel?', v: () => '<div class="tripel-row">' + [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]].map(t => `<div class="tripel"><b>(${t.join(', ')})</b><small>${t[0] * t[0]} + ${t[1] * t[1]} = ${t[2] * t[2]}</small></div>`).join('') + '</div>', t: 'Tripel Pythagoras = <b>tiga bilangan bulat positif</b> (a, b, c) dengan a² + b² = c². Enam tripel dasar di atas sebaiknya kamu <b>hafal</b> — mereka sering muncul di soal.' },
        { h: 'Kelipatan tripel tetap tripel', v: () => '<div class="check-box">(3, 4, 5) × 2 = (6, 8, 10)<br>(3, 4, 5) × 3 = (9, 12, 15)<br>(5, 12, 13) × 4 = (20, 48, 52)</div>', t: 'Kalikan <b>semua</b> sisi dengan bilangan yang sama k. Alasannya: (ka)² + (kb)² = k²(a² + b²) = k²c² = (kc)². Segitiganya hanya “diperbesar” (sebangun).' },
        { h: 'Kenali keluarganya dengan cepat', v: () => '<div class="check-box">Keluarga <b>3-4-5</b>: 6-8-10 · 9-12-15 · 12-16-20 · 15-20-25 · 30-40-50<br>Keluarga <b>5-12-13</b>: 10-24-26 · 15-36-39<br>Keluarga <b>8-15-17</b>: 16-30-34 · 24-45-51</div>', t: 'Jika dua sisi segitiga siku-siku <b>kelipatan</b> dari tripel dasar, sisi ketiga langsung ketemu <b>tanpa menghitung akar</b>. Contoh: sisi 15 dan 36 = 3 × (5, 12) → sisi miring 3 × 13 = 39.' },
        { h: 'Membuat tripel sendiri (rumus Euclid)', v: () => '<div class="big-eq sm">(m² − n², 2mn, m² + n²)</div><p class="muted center">m &gt; n &gt; 0 bilangan bulat</p>', t: 'Pilih m = 2, n = 1 → (4 − 1, 4, 4 + 1) = <b>(3, 4, 5)</b>. m = 3, n = 2 → <b>(5, 12, 13)</b>. m = 4, n = 3 → <b>(7, 24, 25)</b>. Coba sendiri di widget di bawah!' }
      ] },
      { id: 'coba', t: 'widget', judul: 'Pabrik tripel: ciptakan & koleksi', w: 'sim-TP4', cap: 'Ubah m, n, dan pengali k. Perhatikan tanda “tripel dasar” vs “kelipatan”.' },
      { id: 'contoh', t: 'contoh', judul: 'Contoh terbimbing', items: [
        { j: 'Papan reklame', soal: 'Segitiga siku-siku bersisi tegak 15 cm dan 36 cm. Sisi miringnya?', langkah: [['Kenali pola', '15 = 3 × 5 dan 36 = 3 × 12 → kelipatan 3 dari (5, 12, 13).'], ['Kalikan sisi ketiga', 'c = 3 × 13 = <b>39</b>'], ['Verifikasi', '15² + 36² = 225 + 1296 = 1521 = 39² ✔'], ['Kesimpulan', 'Sisi miring 39 cm — tanpa mencari akar.']] },
        { j: 'Tangga 26 m', soal: 'Tangga 26 m bersandar pada dinding setinggi 24 m. Berapa jarak kaki tangga dari dinding?', langkah: [['Kenali pola', '24 dan 26 → 2 × (12, 13) → keluarga 5-12-13 (kelipatan 2).'], ['Tebak sisi ketiga', '2 × 5 = 10'], ['Verifikasi', '10² + 24² = 100 + 576 = 676 = 26² ✔'], ['Kesimpulan', 'Kaki tangga <b>10 m</b> dari dinding.']] }
      ] },
      { id: 'salah', t: 'salah', judul: 'Salah kaprah yang sering terjadi', items: [
        { x: '(3,4,5) → tambah 1 → (4,5,6) pasti tripel', y: 'Tripel baru lewat <b>perkalian</b>, bukan penjumlahan', why: '4² + 5² = 41 ≠ 36. Menambah angka merusak kesamaan.' },
        { x: '(9, 12, 16) adalah tripel', y: '(9, 12, <b>15</b>) tripel', why: '81 + 144 = 225 = 15², bukan 16² = 256. Selalu verifikasi!' },
        { x: 'Tripel harus selalu berurutan 3,4,5', y: 'Tripel tak harus berurutan', why: '5-12-13, 8-15-17, 20-21-29 semuanya tripel.' }
      ] },
      { id: 'latihan', t: 'latihan', judul: 'Latihan berumpan balik', items: [
        { t: 'num', q: 'Sisi tegak 9 dan 12 → sisi miring? (kenali keluarga 3-4-5)', a: 15, h: '9 = 3×3, 12 = 3×4.', e: '3 × 5 = 15.' },
        { t: 'num', q: 'Sisi miring 41, satu sisi tegak 9 → sisi tegak lain?', a: 40, h: 'Tripel dasar (9, 40, 41).', e: '41² − 9² = 1600 → 40.' },
        { t: 'pg', q: 'Manakah yang BUKAN tripel Pythagoras?', o: ['(6, 8, 10)', '(7, 24, 25)', '(10, 24, 26)', '(8, 15, 16)'], b: 3, h: 'Periksa 8² + 15² vs 16².', e: '64 + 225 = 289 = 17², bukan 16².' },
        { t: 'pg', q: 'Dengan m = 3 dan n = 2, rumus Euclid menghasilkan…', o: ['(5, 12, 13)', '(3, 4, 5)', '(7, 24, 25)', '(9, 12, 15)'], b: 0, h: '(m² − n², 2mn, m² + n²).', e: '(9 − 4, 12, 9 + 4) = (5, 12, 13).' }
      ] },
      { id: 'rangkum', t: 'rangkum', judul: 'Rangkuman 1 menit', poin: ['Tripel = tiga bilangan bulat dengan a² + b² = c².', 'Hafalkan: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, 9-40-41.', 'Kelipatan tripel tetap tripel (kalikan SEMUA sisi).', 'Rumus Euclid: (m² − n², 2mn, m² + n²).'], ingat: 'Mengenali keluarga tripel = menjawab dalam hitungan detik.' }
    ]
  },
  TP5: {
    tab: 'TP 5 · Segitiga Istimewa', icon: 'target', tujuan: 'Menghitung panjang sisi segitiga siku-siku istimewa 45°–45°–90° dan 30°–60°–90° memakai perbandingan sisi, serta memahami dari mana perbandingan itu berasal.',
    sec: [
      { id: 'hook', t: 'hook', judul: 'Mulai dari dunia nyata', judulIsi: 'Ubin, atap, dan tangga lipat', img: 'ubin', teks: 'Tukang memotong ubin persegi <b>40 cm</b> menjadi dua segitiga lewat diagonalnya. Pemasang atap membelah papan nama segitiga sama sisi. Tangga lipat membentuk sudut <b>60°</b> dengan lantai. Dua bentuk ini <b>sangat sering</b> muncul — dan sisinya <b>selalu berpola tetap</b>, sehingga bisa dihitung tanpa mengulang Pythagoras dari awal.', tanya: 'Perkirakan: berapa panjang diagonal ubin 40 cm? Lebih dekat ke 50, 56, atau 80 cm?', jawab: 'Sekitar <b>56,6 cm</b> (40 × 1,414). Sebentar lagi kamu akan <b>membuktikannya sendiri</b>, bukan sekadar menghafal.' },
      { id: 'p45', t: 'steps', judul: 'Bagian A · 45°–45°–90°: dari persegi menjadi dua segitiga', steps: [
        { h: 'Mulai dari persegi', v: () => '<svg viewBox="0 0 220 200" class="wsvg sm"><rect x="40" y="25" width="140" height="140" rx="6" fill="#DAD3FA" stroke="#5B3FD9" stroke-width="4"/><text x="110" y="188" class="tl g" text-anchor="middle">s</text><text x="26" y="100" class="tl g" text-anchor="end">s</text></svg>', t: 'Persegi bersisi <b>s</b>: keempat sisinya sama panjang dan keempat sudutnya <b>90°</b>.' },
        { h: 'Potong diagonalnya', v: () => '<svg viewBox="0 0 220 200" class="wsvg sm"><polygon points="40,165 180,165 180,25" fill="#8C6DFF" fill-opacity=".3" stroke="#5B3FD9" stroke-width="4" transform="translate(6 6)"/><polygon points="40,165 40,25 180,25" fill="#1FC98B" fill-opacity=".3" stroke="#0E9E69" stroke-width="4" transform="translate(-6 -6)"/><text x="62" y="62" class="ts">45°</text><text x="152" y="150" class="ts">45°</text></svg>', t: 'Diagonal membagi sudut 90° menjadi <b>45° + 45°</b>. Hasilnya <b>dua segitiga siku-siku sama kaki</b> — masing-masing bersudut <b>45°, 45°, 90°</b>. Kedua sisi siku-sikunya sama panjang (= s).' },
        { h: 'Hitung diagonal dengan Pythagoras', v: () => '<div class="check-box">c² = s² + s²<br>c² = 2s²<br><b>c = s√2</b></div>', t: 'Sisi miring segitiga ini adalah diagonal persegi. Karena kedua sisi siku-siku sama (s): c² = s² + s² = <b>2s²</b>, jadi <b>c = s√2</b>.' },
        { h: 'Perbandingan tetap: 1 : 1 : √2', v: () => '<div class="big-eq">1 : 1 : √2</div><p class="muted center">√2 ≈ 1,414</p>', t: 'Siku-siku : siku-siku : miring = <b>1 : 1 : √2</b>. Artinya sisi miring ≈ <b>1,41 kali</b> sisi siku-siku. Ubin 40 cm → 40 × 1,414 ≈ <b>56,6 cm</b>. Terbukti!' },
        { h: 'Dua arah pemakaian', v: () => '<div class="g2 duo"><div class="duo-c mint"><small>DIKETAHUI SISI SIKU-SIKU</small><code>miring = sisi × √2</code></div><div class="duo-c amber"><small>DIKETAHUI SISI MIRING</small><code>sisi = miring ÷ √2</code></div></div>', t: 'Dari miring ke siku-siku: <b>bagi √2</b> lalu rasionalkan: miring ÷ √2 = miring × √2 / 2. Contoh miring 10 cm → sisi = 10√2/2 = <b>5√2 ≈ 7,07 cm</b>.' }
      ] },
      { id: 'w45', t: 'widget', judul: 'Coba sendiri · Potong ubin jadi dua segitiga', w: 'w-45', cap: 'Klik “Potong diagonal”, lalu ubah ukuran sisi. Perhatikan: diagonal selalu ≈ 1,41 × sisi.' },
      { id: 'p30', t: 'steps', judul: 'Bagian B · 30°–60°–90°: dari segitiga sama sisi', steps: [
        { h: 'Mulai dari segitiga sama sisi', v: () => '<svg viewBox="0 0 240 200" class="wsvg sm"><polygon points="30,170 210,170 120,14" fill="#DAD3FA" stroke="#5B3FD9" stroke-width="4" stroke-linejoin="round"/><text x="120" y="192" class="tl b" text-anchor="middle">2x</text><text x="40" y="100" class="ts">60°</text></svg>', t: 'Segitiga sama sisi bersisi <b>2x</b>: ketiga sisi sama dan ketiga sudutnya <b>60°</b>.' },
        { h: 'Tarik garis tinggi', v: () => '<svg viewBox="0 0 240 200" class="wsvg sm"><polygon points="30,170 120,170 120,14" fill="#1FC98B" fill-opacity=".28" stroke="#0E9E69" stroke-width="4" stroke-linejoin="round" transform="translate(-6 0)"/><polygon points="120,170 210,170 120,14" fill="#8C6DFF" fill-opacity=".28" stroke="#5B3FD9" stroke-width="4" stroke-linejoin="round" transform="translate(6 0)"/><text x="75" y="192" class="tl b" text-anchor="middle">x</text><text x="165" y="192" class="tl b" text-anchor="middle">x</text></svg>', t: 'Garis tinggi dari puncak ke tengah alas membelah segitiga menjadi <b>dua segitiga siku-siku yang sama</b>. Alas 2x terbagi dua menjadi <b>x</b> dan <b>x</b>.' },
        { h: 'Baca sudut & sisinya', v: () => '<div class="check-box">Sudut puncak 60° → terbelah <b>30° + 30°</b><br>Sudut alas tetap <b>60°</b><br>Sudut di tengah alas = <b>90°</b></div>', t: 'Setiap hasil belahan punya sudut <b>30°, 60°, 90°</b>. Sisi terpendek = <b>x</b> (berhadapan dengan 30°) dan sisi miring = <b>2x</b> (sisi segitiga sama sisi semula).' },
        { h: 'Hitung tinggi dengan Pythagoras', v: () => '<div class="check-box">t² = (2x)² − x²<br>t² = 4x² − x² = 3x²<br><b>t = x√3</b></div>', t: 'Tinggi adalah sisi siku-siku, jadi <b>kurangkan</b>: t² = (2x)² − x² = 3x². Maka <b>t = x√3</b> — sisi yang berhadapan dengan sudut <b>60°</b>.' },
        { h: 'Perbandingan tetap: 1 : √3 : 2', v: () => '<div class="big-eq">1 : √3 : 2</div><p class="muted center">30° → 1 &nbsp;·&nbsp; 60° → √3 ≈ 1,73 &nbsp;·&nbsp; 90° → 2</p>', t: '<b>Cara mengingat:</b> sudut kecil–sedang–besar (30°–60°–90°) ↔ sisi pendek–sedang–panjang (1–√3–2). Karena 1 &lt; 1,73 &lt; 2, urutan ukurannya <b>selalu cocok</b> dengan urutan sudutnya.' }
      ] },
      { id: 'w30', t: 'widget', judul: 'Coba sendiri · Belah segitiga sama sisi', w: 'w-30', cap: 'Klik “Belah” dan geser x. Amati: tinggi selalu x√3 dan miring selalu 2x.' },
      { id: 'kalk', t: 'widget', judul: 'Kartu Cepat Pilih: kalkulator sisi istimewa', w: 'k-istimewa', cap: 'Pilih jenis segitiga dan sisi yang diketahui — lihat ketiga sisi (bentuk akar & desimal) serta cara menghitungnya. Cocokkan dengan hitunganmu sendiri!' },
      { id: 'video', t: 'video', judul: 'Tonton & pahami: dua video penjelas', panduan: [
        ['Apa perbandingan sisi segitiga 45°–45°–90°?', '1 : 1 : √2 — sisi miring = sisi siku-siku × √2.'],
        ['Pada segitiga 30°–60°–90°, sisi terpendek berhadapan dengan sudut berapa?', 'Sudut 30°. Sisi miring = 2 × sisi terpendek, sisi di depan 60° = sisi terpendek × √3.'],
        ['Sisi siku-siku segitiga 45° adalah 7 cm. Berapa sisi miringnya?', '7√2 cm ≈ 9,9 cm.']
      ] },
      { id: 'contoh', t: 'contoh', judul: 'Contoh terbimbing', items: [
        { j: 'Tiang bendera & kabel 45°', soal: 'Tiang bendera tegak 6 m. Kabel penahan dari puncak tiang ke tanah membentuk sudut 45° dengan tanah. Berapa panjang kabel dan jarak titik ikat dari pangkal tiang?', langkah: [['Kenali segitiga', 'Tiang ⟂ tanah, sudut kabel 45° → sudut ketiga juga 45° → segitiga <b>45°–45°–90°</b>.'], ['Rasio 1 : 1 : √2', 'Tiang (6) = jarak titik ikat (sisi siku-siku sama) → jarak = <b>6 m</b>.'], ['Sisi miring', 'Kabel = 6 × √2 = <b>6√2 m</b>'], ['Nilai pendekatan', '6 × 1,414 ≈ <b>8,49 m</b>.']] },
        { j: 'Tangga 8 m membentuk 60°', soal: 'Tangga 8 m bersandar membentuk sudut 60° dengan tanah. Berapa jarak kaki dari dinding dan tinggi ujung tangga?', langkah: [['Kenali segitiga', 'Sudut di tanah 60°, dinding ⟂ tanah → sudut di puncak 30° → segitiga <b>30°–60°–90°</b>.'], ['Petakan sisi', 'Tangga = sisi miring (2x) = 8 → x = 4. Jarak kaki berhadapan dengan 30° → <b>4 m</b>.'], ['Sisi di depan 60°', 'Tinggi = x√3 = <b>4√3 m</b>'], ['Nilai pendekatan', '4 × 1,732 ≈ <b>6,93 m</b>.']] },
        { j: 'Papan nama segitiga sama sisi', soal: 'Papan nama berbentuk segitiga sama sisi bersisi 12 cm. Berapa tinggi dan luasnya?', langkah: [['Belah jadi 30°–60°–90°', 'Sisi miring = 12 = 2x → x = 6 (setengah alas).'], ['Tinggi', 't = x√3 = <b>6√3 cm</b> ≈ 10,39 cm'], ['Luas', '½ × alas × tinggi = ½ × 12 × 6√3'], ['Hasil', 'Luas = <b>36√3 cm²</b> ≈ 62,35 cm².']] }
      ] },
      { id: 'salah', t: 'salah', judul: 'Salah kaprah yang sering terjadi', items: [
        { x: 'Sisi di depan 60° = 2x', y: 'Depan 60° = x√3; yang 2x adalah sisi miring', why: '2 &gt; √3 (≈1,73). Sisi terpanjang selalu sisi miring (di depan 90°).' },
        { x: 'Sisi terpendek berhadapan dengan 60°', y: 'Terpendek berhadapan dengan sudut terkecil: 30°', why: 'Sisi terpendek selalu berhadapan dengan sudut terkecil.' },
        { x: 'Pada 45°–45°–90°, miring = 2 × sisi', y: 'miring = sisi × √2 (≈ 1,41×)', why: 'Faktor 2 hanya untuk 30°–60°–90° (miring = 2 × terpendek).' },
        { x: 'Memakai 1 : √3 : 2 untuk segitiga 45°', y: 'Cek sudutnya dulu: 45° → 1 : 1 : √2', why: 'Dua pola ini jangan dicampur. Sudut menentukan pola.' },
        { x: '10 ÷ √2 dibiarkan begitu saja', y: '10/√2 = 10√2/2 = 5√2', why: 'Bentuk akar sebaiknya <b>dirasionalkan</b> (penyebut tanpa akar).' }
      ] },
      { id: 'latihan', t: 'latihan', judul: 'Latihan berumpan balik', items: [
        { t: 'num', q: 'Ubin persegi sisi 10 cm. Panjang diagonalnya (desimal, 2 angka di belakang koma)? (cm)', a: 14.14, tol: .06, h: '10√2 ≈ 10 × 1,414', e: '10√2 ≈ 14,14 cm.' },
        { t: 'num', q: 'Segitiga 30°–60°–90° dengan sisi terpendek 7 cm. Sisi miringnya? (cm)', a: 14, h: 'Miring = 2 × terpendek.', e: '2 × 7 = 14 cm.' },
        { t: 'num', q: 'Segitiga 30°–60°–90° dengan sisi miring 20 cm. Sisi terpendeknya? (cm)', a: 10, h: 'Terpendek = miring ÷ 2.', e: '20 ÷ 2 = 10 cm.' },
        { t: 'num', q: 'Segitiga sama sisi bersisi 8 cm. Tingginya (desimal)? (cm)', a: 6.93, tol: .06, h: 'Tinggi = ½ × sisi × √3.', e: '4√3 ≈ 6,93 cm.' },
        { t: 'pg', q: 'Segitiga siku-siku sama kaki dengan sisi miring 12√2 cm. Panjang sisi siku-sikunya?', o: ['12 cm', '12√2 cm', '24 cm', '6√2 cm'], b: 0, h: 'Sisi = miring ÷ √2.', e: '12√2 ÷ √2 = 12 cm.' },
        { t: 'pg', q: 'Pada segitiga 30°–60°–90° dengan sisi terpendek 5, sisi di hadapan 60° adalah…', o: ['5√2', '5√3', '10', '10√3'], b: 1, h: 'Depan 60° = x√3.', e: 'x = 5 → 5√3.' }
      ] },
      { id: 'rangkum', t: 'rangkum', judul: 'Rangkuman 1 menit', poin: ['<b>45°–45°–90°</b> (diagonal persegi): sisi : sisi : miring = <b>1 : 1 : √2</b>.', '<b>30°–60°–90°</b> (setengah segitiga sama sisi): <b>1 : √3 : 2</b> — terpendek di depan 30°, miring = 2 × terpendek.', 'Keduanya berasal dari Pythagoras — kamu bisa membuktikannya kapan saja.', 'Cek sudut dulu, baru pilih pola.'], ingat: 'Kecil–sedang–besar: 30°–60°–90° ↔ 1–√3–2.' }
    ]
  },
  TP6: {
    tab: 'TP 6 · Masalah Nyata', icon: 'building', tujuan: 'Memodelkan situasi nyata (navigasi, konstruksi, tangga, kabel penopang) sebagai segitiga siku-siku, menyelesaikannya, dan menafsirkan hasilnya.',
    sec: [
      { id: 'hook', t: 'hook', judul: 'Mulai dari dunia nyata', judulIsi: 'Laut, jembatan, dan atap di Kepulauan Riau', img: 'kapal', teks: 'Kapal feri antar pulau, jembatan bertiang kabel seperti di kawasan Barelang, hingga atap rumah panggung — semuanya menyimpan <b>segitiga siku-siku tersembunyi</b>. Kemampuan memodelkan masalah nyata menjadi segitiga adalah inti Teorema Pythagoras.', tanya: 'Sebuah kapal berlayar 18 km ke selatan, lalu 24 km ke barat, lalu mesinnya mati. Kapal SAR 30 km/jam menyusul <b>lurus</b>. Berapa lama sampai?', jawab: 'Jarak lurus = √(18² + 24²) = <b>30 km</b> → <b>1 jam (60 menit)</b>. Jebakannya: jangan memakai 18 + 24 = 42 km!' },
      { id: 'konsep', t: 'steps', judul: 'Strategi G-I-S-H memecahkan masalah nyata', steps: [
        { h: 'G — Gambar', v: () => Art.real('kapal'), t: 'Buat sketsa situasinya dan beri label ukuran yang diketahui, lengkap dengan <b>satuan</b>. Soal cerita menjadi mudah begitu gambarnya jelas.' },
        { h: 'I — Identifikasi sudut siku-siku', v: () => '<div class="check-box">utara ⟂ timur<br>tiang ⟂ tanah<br>dinding ⟂ lantai<br>sisi persegi panjang saling ⟂</div>', t: 'Cari dua arah atau benda yang saling <b>tegak lurus</b>. Di situlah segitiga siku-siku bersembunyi. Tentukan mana <b>sisi miring</b> (berhadapan dengan sudut 90°).' },
        { h: 'S — Selesaikan', v: () => '<div class="g2 duo"><div class="duo-c amber"><small>CARI SISI MIRING</small><code>jumlahkan kuadrat</code></div><div class="duo-c blue"><small>CARI SISI SIKU-SIKU</small><code>kurangkan kuadrat</code></div></div>', t: 'Pilih alat: Pythagoras, <b>tripel</b> (lebih cepat), atau <b>segitiga istimewa</b> bila ada sudut 30°/45°/60°.' },
        { h: 'H — Hasil & tafsir', v: () => '<div class="check-box">✔ jawab pertanyaan yang SEBENARNYA ditanya<br>✔ tulis satuan<br>✔ cek kewajaran<br>✔ pertanyaan bertingkat? lanjutkan hitung</div>', t: 'Banyak soal bertanya <b>setelah</b> sisi ketemu: total jarak, keliling, waktu, atau selisih. Selesaikan segitiga dulu, lalu jawab pertanyaan akhirnya.' }
      ] },
      { id: 'studio', t: 'widget', judul: 'Studio dunia nyata: tangga, kapal, jembatan', w: 'studio', cap: 'Pilih salah satu situasi. Ubah angkanya, amati bagaimana segitiga dan jawabannya ikut berubah.' },
      { id: 'contoh', t: 'contoh', judul: 'Contoh bertingkat', items: [
        { j: 'Kapal SAR di Kepri', soal: 'Kapal A berlayar 18 km ke selatan lalu 24 km ke barat dan berhenti. Kapal SAR B berangkat dari pelabuhan yang sama dan berlayar lurus ke posisi A dengan kecepatan 30 km/jam. Berapa menit waktu tempuhnya?', img: Art.tri({ a: '18 km', b: '24 km', c: '? km', la: 'Selatan', lb: 'Barat', lc: 'Lintasan SAR' }, 280, 180), langkah: [['Gambar & identifikasi', 'Selatan ⟂ barat → segitiga siku-siku (18 dan 24). Lintasan SAR = sisi miring.'], ['Selesaikan', 'c = √(18² + 24²) = √900 = <b>30 km</b> (keluarga 3-4-5 × 6)'], ['Pertanyaan bertingkat', 'Waktu = 30 km ÷ 30 km/jam = 1 jam'], ['Hasil & tafsir', '<b>60 menit</b>. (Bukan 84 menit — itu jika menempuh 42 km lewat jalur siku.)']] },
        { j: 'Kawat penopang tiang antena', soal: 'Tiang antena 12 m ditopang kawat dari puncak ke tanah pada jarak 5 m dari dasar tiang. Jika dipasang 3 kawat sama panjang, berapa total kawat yang dibutuhkan?', langkah: [['Gambar & identifikasi', 'Tiang ⟂ tanah → segitiga siku-siku (12 dan 5). Kawat = sisi miring.'], ['Selesaikan', 'c = √(144 + 25) = 13 m (tripel 5-12-13)'], ['Pertanyaan bertingkat', 'Total = 3 × 13 m'], ['Hasil & tafsir', 'Dibutuhkan <b>39 m</b> kawat.']] },
        { j: 'Tangga merosot', soal: 'Tangga 13 m bersandar pada dinding dengan kaki 5 m dari dinding. Ujung atas merosot turun 7 m. Berapa meter kaki tangga bergeser menjauhi dinding?', langkah: [['Posisi awal', 'Tinggi = √(13² − 5²) = 12 m'], ['Posisi baru', 'Tinggi 12 − 7 = 5 m → jarak kaki = √(13² − 5²) = 12 m'], ['Pertanyaan bertingkat', 'Pergeseran = 12 − 5'], ['Hasil & tafsir', 'Kaki bergeser <b>7 m</b> menjauhi dinding.']] }
      ] },
      { id: 'salah', t: 'salah', judul: 'Salah kaprah yang sering terjadi', items: [
        { x: 'Jarak terpendek = 18 + 24 = 42 km', y: 'Jarak terpendek = sisi miring = 30 km', why: 'Menjumlahkan dua sisi siku-siku memberi jarak <b>jalan memutar</b>, bukan jarak lurus.' },
        { x: 'Berhenti di c = 13 padahal ditanya total 3 kawat', y: 'Lanjutkan: 3 × 13 = 39 m', why: 'Baca pertanyaan terakhir dengan teliti — itu yang dijawab.' },
        { x: 'Mencampur satuan (cm dan m)', y: 'Samakan satuan sebelum menghitung', why: '1 m = 100 cm. Hasil kuadrat akan salah ribuan kali bila satuan tercampur.' },
        { x: 'Tidak menggambar sketsa', y: 'Gambar dulu, beri label', why: 'Tanpa gambar, sering salah memilih sisi miring.' }
      ] },
      { id: 'latihan', t: 'latihan', judul: 'Latihan berumpan balik', items: [
        { t: 'num', q: 'Perahu berlayar 15 km ke timur dan 8 km ke utara. Jarak lurus ke titik awal? (km)', a: 17, h: 'Tripel 8-15-17.', e: '√(225 + 64) = 17 km.' },
        { t: 'num', q: 'Kapal SAR 30 km/jam menempuh jarak lurus 24 km. Waktu tempuh? (menit)', a: 48, h: 'Waktu = jarak ÷ kecepatan, lalu × 60.', e: '24 ÷ 30 = 0,8 jam = 48 menit.' },
        { t: 'num', q: 'Tangga 6 m, kaki tangga 1,5 m dari dinding. Tinggi ujung tangga (desimal)? (m)', a: 5.81, tol: .05, h: '√(36 − 2,25) = √33,75', e: '√33,75 ≈ 5,81 m.' },
        { t: 'num', q: 'Kawat penopang dari puncak tiang 12 m ke tanah 9 m dari dasar tiang. Panjang kawat? (m)', a: 15, h: 'Keluarga 3-4-5 × 3.', e: '√(144 + 81) = 15 m.' },
        { t: 'pg', q: 'Mana yang BUKAN pasangan yang saling tegak lurus?', o: ['Utara dan timur', 'Tiang bendera dan tanah datar', 'Tali layang-layang dan tanah', 'Dinding dan lantai'], b: 2, h: 'Benang layang-layang membentuk sudut sembarang dengan tanah.', e: 'Benang layang-layang miring — itulah sisi miringnya.' }
      ] },
      { id: 'misi', t: 'misi', judul: 'Misi lapangan: ukur dunia nyata', intro: 'Bawa hasilmu ke kelas! Kerjakan dengan alat ukur sederhana (meteran/penggaris panjang/tali) dan catat angkanya.', items: [
        'Ukur 30 cm di satu tepi pojok papan tulis/meja dan 40 cm di tepi lainnya. Ukur jarak kedua titik: apakah tepat 50 cm? Apa artinya bagi pojok itu?',
        'Ukur lebar dan tinggi sebuah pintu atau jendela, hitung diagonalnya dengan Pythagoras, lalu ukur diagonal sebenarnya. Berapa selisihnya?',
        'Temukan satu benda/bangunan di sekitarmu yang memuat segitiga siku-siku (atap, tangga, penyangga rak). Gambar dan hitung salah satu sisinya.'
      ] },
      { id: 'rangkum', t: 'rangkum', judul: 'Rangkuman 1 menit', poin: ['G-I-S-H: Gambar → Identifikasi siku-siku → Selesaikan → Hasil & tafsir.', 'Jarak lurus = sisi miring; jalan memutar = jumlah dua sisi siku-siku.', 'Baca pertanyaan akhir: total, waktu, keliling, atau selisih.', 'Samakan satuan, cek kewajaran.'], ingat: 'Segitiga siku-siku ada di tangga, kapal, jembatan, dan atap di sekitarmu.' }
    ]
  }
};

/* ======================= RENDER ======================= */
function ytFacade(v, i) {
  return `<div class="yt-card glow"><div class="yt-w" data-id="${v.id}" data-judul="${esc(v.judul)}"><button class="yt-play" type="button" aria-label="Putar video: ${esc(v.judul)}"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy"><span class="yt-btn">${ic('play')}</span><span class="yt-badge">Video ${i + 1}</span></button></div><div class="yt-i"><b>${esc(v.judul)}</b><small>${esc(v.oleh)}</small><p>${esc(v.ket)}</p><a class="lnk tiny" href="${v.url}" target="_blank" rel="noopener noreferrer">Tidak bisa diputar di sini? Buka di YouTube ↗</a></div></div>`;
}
const SEC_ICON = { hook: 'compass', steps: 'sparkles', widget: 'flask', video: 'play', contoh: 'edit', salah: 'warn', latihan: 'target', rangkum: 'check', misi: 'building' };
function secBody(sec, tp) {
  if (sec.t === 'hook') return `<div class="hook"><div class="hook-img">${Art.real(sec.img)}</div><div><h4 class="h3">${sec.judulIsi}</h4><p>${sec.teks}</p><div class="pem"><b>${ic('target')} Pertanyaan pemantik</b><p>${sec.tanya}</p><details><summary>Tebak dulu, lalu klik untuk melihat jawaban</summary><div class="pem-a">${sec.jawab}</div></details></div></div></div>`;
  if (sec.t === 'steps') return `<div class="stepper" data-sid="${sec.id}"><div class="st-nav"></div><div class="st-card"><div class="st-vis"></div><div class="st-txt"></div></div><div class="row between"><button class="btn btn-ghost btn-sm" data-st="prev">${ic('arrow', 'flip-x')} Sebelumnya</button><span class="muted tiny st-cnt"></span><button class="btn btn-primary btn-sm" data-st="next">Lanjut ${ic('arrow')}</button></div></div>`;
  if (sec.t === 'widget') return `<p class="muted">${sec.cap}</p><div class="wmount" data-w="${sec.w}"></div>`;
  if (sec.t === 'video') return `<p class="muted">Pilih salah satu atau tonton keduanya — video diputar <b>langsung di halaman ini</b>, kamu tidak perlu pindah ke YouTube. Video 1 berbahasa Indonesia; Video 2 berjudul Inggris.</p><div class="g2">${VIDEOS.map(ytFacade).join('')}</div><div class="pem"><b>${ic('target')} Panduan menonton — jawab sambil menonton</b>${sec.panduan.map((p, i) => `<details><summary>${i + 1}. ${p[0]}</summary><div class="pem-a">${p[1]}</div></details>`).join('')}</div><p class="tiny muted">Video milik kanal MISS YANA dan RR Success Channel, ditampilkan melalui pemutar resmi YouTube. Penjelasan di halaman ini tetap berlaku sebagai pegangan utama.</p>`;
  if (sec.t === 'contoh') return `<div class="tabs sm">${sec.items.map((it, i) => `<button class="tab ${i ? '' : 'on'}" data-ci="${i}">${esc(it.j)}</button>`).join('')}</div><div class="contoh" data-sid="${sec.id}"></div>`;
  if (sec.t === 'salah') return `<p class="muted">Klik kartu untuk membuka cara yang benar dan alasannya.</p><div class="g2">${sec.items.map((it, i) => `<button class="salah" data-i="${i}"><span class="s-x"><em>✘ Sering terjadi</em>${it.x}</span><span class="s-y"><em>✔ Yang benar</em>${it.y}<small>${it.why}</small></span></button>`).join('')}</div>`;
  if (sec.t === 'latihan') return `<div class="lat" data-sid="${sec.id}">${sec.items.map((it, i) => `<div class="lt" data-i="${i}"><div class="lt-q"><b>${i + 1}.</b> ${it.q}</div>${it.t === 'pg' ? `<div class="chips">${it.o.map((o, k) => `<button class="chip-btn" data-k="${k}">${o}</button>`).join('')}</div>` : `<div class="row gap"><input type="text" inputmode="decimal" class="inp sm lt-in" placeholder="Jawabanmu" autocomplete="off"><button class="btn btn-primary btn-sm" data-chk>Periksa</button></div>`}<div class="lt-f"></div></div>`).join('')}<div class="lat-s tiny muted"></div></div>`;
  if (sec.t === 'rangkum') return `<ul class="rk-l">${sec.poin.map(p => `<li>${ic('check')}<span>${p}</span></li>`).join('')}</ul><div class="mnemo">${ic('sparkles')}<div><b>Ingat selalu</b><p>${sec.ingat}</p></div></div>`;
  if (sec.t === 'misi') return `<p class="muted">${sec.intro}</p><div class="misi" data-sid="${sec.id}">${sec.items.map((m, i) => `<label class="mi"><input type="checkbox" data-mi="${i}"><i></i><span>${m}</span></label>`).join('')}</div>`;
  return '';
}

Pages.materi = async function (view) {
  const d = await Data.boot(); const tps = Object.keys(MAT); let tp = S.tp && MAT[S.tp] ? S.tp : 'TP2';
  const prog = () => MAT_STORE.get(), isDone = (t, id) => !!(prog()[t] && prog()[t][id]), cnt = t => MAT[t].sec.filter(s => isDone(t, s.id)).length;
  view.innerHTML = guestBanner() + head('Kurikulum Merdeka • Kelas VIII Fase D • Geometri', 'Materi & Rangkuman Interaktif', 'Belajar Teorema Pythagoras lewat dunia nyata Kepulauan Riau: cerita, animasi, percobaan, video, dan latihan berumpan balik. Tandai “Aku paham” di tiap bagian untuk melacak kemajuanmu.', '<span class="pill ok">' + ic('lock') + ' Akses Bebas & Terbuka</span><button class="btn btn-ghost" onclick="window.print()">' + ic('download') + ' Cetak / PDF</button>') +
    '<div class="tabs scroll reveal" id="mt"></div><div class="g-side"><div id="mb" class="stack lessons"></div><aside class="stack sticky-a"><div class="card reveal" id="mp"></div><div class="card reveal"><h4 class="h4">' + ic('book') + ' Kartu Rumus Kunci</h4>' + KARTU_RUMUS.map((k, i) => '<div class="kr glow"><small>' + (i + 1) + '. ' + k[0] + '</small><pre>' + esc(k[1]) + '</pre>' + (k[2] ? '<em>' + k[2] + '</em>' : '') + '</div>').join('') + '</div><div class="card cta-card glow reveal">' + ic('sparkles') + '<h4>Siap Uji Pemahaman?</h4><p>Klaim XP lewat Simulasi Lab, lalu uji dirimu di Ruang CBT.</p><a class="btn btn-white w100 cta" href="#cbt">Masuk ke Ruang CBT ' + ic('arrow') + '</a><a class="btn btn-glass w100" href="#simulasi">' + ic('flask') + ' Simulasi Lab</a></div></aside></div>';
  function tabs() { $('#mt', view).innerHTML = tps.map(t => { const c = cnt(t), n = MAT[t].sec.length; return `<button class="tab ${t === tp ? 'on' : ''}" data-t="${t}">${MAT[t].tab} <span class="tcount ${c === n ? 'full' : ''}">${c}/${n}</span></button>`; }).join(''); }
  function side() {
    const c = cnt(tp), n = MAT[tp].sec.length;
    $('#mp', view).innerHTML = `<div class="between"><h4 class="h4">${ic('target')} Peta Belajar ${tp.replace('TP', 'TP ')}</h4><span class="chip ${c === n ? 'mint' : ''}">${c}/${n}</span></div><div class="bar"><i style="--w:${c / n * 100}%"></i></div><div class="tl">${MAT[tp].sec.map((s, i) => `<button class="tl-i ${isDone(tp, s.id) ? 'ok' : ''}" data-go="${s.id}">${ic(isDone(tp, s.id) ? 'check' : SEC_ICON[s.t])}<div><b>${i + 1}. ${s.judul.replace(/^[^·]*· /, '')}</b></div></button>`).join('')}</div>`;
  }
  function stepper(box, sec) {
    let i = 0; const st = sec.steps;
    const paint = () => { const s = st[i]; $('.st-nav', box).innerHTML = st.map((x, k) => `<button class="${k === i ? 'on' : k < i ? 'done' : ''}" data-k="${k}" aria-label="Langkah ${k + 1}">${k + 1}</button>`).join(''); $('.st-vis', box).innerHTML = s.v(); $('.st-txt', box).innerHTML = `<h4 class="h3">${i + 1}. ${s.h}</h4><p>${s.t}</p>`; $('.st-cnt', box).textContent = `Langkah ${i + 1} dari ${st.length}`; $('[data-st=prev]', box).disabled = i === 0; $('[data-st=next]', box).disabled = i === st.length - 1; $('.st-card', box).classList.remove('swap'); void $('.st-card', box).offsetWidth; $('.st-card', box).classList.add('swap'); };
    box.addEventListener('click', e => { const b = e.target.closest('[data-st]'), n = e.target.closest('.st-nav button'); if (b) { i = clamp(i + (b.dataset.st === 'next' ? 1 : -1), 0, st.length - 1); paint(); } else if (n) { i = +n.dataset.k; paint(); } });
    paint();
  }
  function contoh(box, sec) {
    const body = $('.contoh', box); let ci = 0, sh = 1;
    const paint = () => { const it = sec.items[ci]; body.innerHTML = `<div class="soal-box">${it.soal}</div>${it.img ? `<div class="diag">${it.img}</div>` : ''}<div class="cx">${it.langkah.map((l, k) => `<div class="st ${k === 3 ? 'fin' : ''} ${k < sh ? 'show' : 'hid'}"><b>${k + 1}</b><div><strong>${l[0]}</strong><p>${l[1]}</p></div></div>`).join('')}</div><div class="row gap"><button class="btn btn-primary btn-sm" data-nx ${sh >= 4 ? 'hidden' : ''}>Tunjukkan langkah berikutnya ${ic('arrow')}</button><button class="btn btn-ghost btn-sm" data-rs ${sh < 4 ? 'hidden' : ''}>${ic('refresh')} Ulangi</button></div>`; };
    box.addEventListener('click', e => { const t = e.target.closest('[data-ci]'); if (t) { ci = +t.dataset.ci; sh = 1; $$('[data-ci]', box).forEach(x => x.classList.toggle('on', x === t)); paint(); } else if (e.target.closest('[data-nx]')) { sh++; paint(); } else if (e.target.closest('[data-rs]')) { sh = 1; paint(); } });
    paint();
  }
  function latihan(box, sec, onDone) {
    const st = sec.items.map(() => ({ tries: 0, done: false, ok: false })); const sum = () => { const n = st.filter(x => x.done).length, ok = st.filter(x => x.ok).length; $('.lat-s', box).textContent = `Terjawab ${n}/${st.length} · benar ${ok}`; if (n === st.length) onDone(ok); };
    const fin = (i, ok) => { const t = $(`.lt[data-i="${i}"]`, box), it = sec.items[i]; st[i].done = true; st[i].ok = ok; t.classList.add(ok ? 'right' : 'rev'); $('.lt-f', t).innerHTML = (ok ? `<span class="pill ok">${ic('check')} Benar!</span> ` : `<span class="pill warn">Pembahasan</span> `) + it.e; $$('button,input', t).forEach(x => x.disabled = true); sum(); };
    const wrong = i => { const it = sec.items[i], t = $(`.lt[data-i="${i}"]`, box); st[i].tries++; if (st[i].tries >= 2) { fin(i, false); return; } $('.lt-f', t).innerHTML = `<span class="pill err">Belum tepat</span> Petunjuk: ${it.h}`; t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); };
    box.addEventListener('click', e => {
      const t = e.target.closest('.lt'); if (!t || st[+t.dataset.i].done) return; const i = +t.dataset.i, it = sec.items[i], ch = e.target.closest('.chip-btn');
      if (ch) { if (+ch.dataset.k === it.b) { ch.classList.add('right'); FX.burst(e.clientX, e.clientY); fin(i, true); } else { ch.classList.add('wrong'); ch.disabled = true; wrong(i); } }
      else if (e.target.closest('[data-chk]')) check(t, i, it);
    });
    box.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('lt-in')) { const t = e.target.closest('.lt'); check(t, +t.dataset.i, sec.items[+t.dataset.i]); } });
    function check(t, i, it) { const v = parseFloat(String($('.lt-in', t).value).replace(',', '.')); if (isNaN(v)) { $('.lt-f', t).innerHTML = '<span class="pill warn">Isi angka dulu</span>'; return; } const tol = it.tol != null ? it.tol : Math.max(.01, Math.abs(it.a) * .005); if (Math.abs(v - it.a) <= tol) { FX.burst(innerWidth / 2, innerHeight / 2); fin(i, true); } else wrong(i); }
    sum();
  }
  function draw() {
    const m = MAT[tp]; S.tp = tp; tabs(); side();
    $('#mb', view).innerHTML = `<div class="card tujuan reveal"><span class="ico-b p">${ic(m.icon)}</span><div><small>TUJUAN PEMBELAJARAN · ${tp.replace('TP', 'TP ')} · FASE D GEOMETRI</small><p>${m.tujuan}</p></div></div>` +
      m.sec.map((s, i) => `<section class="card lesson reveal ${isDone(tp, s.id) ? 'done' : ''}" id="sec-${s.id}" data-sid="${s.id}"><div class="les-h"><span class="les-n">${i + 1}</span><div><small>${s.t === 'hook' ? 'DUNIA NYATA' : s.t === 'steps' ? 'PAHAMI' : s.t === 'widget' ? 'COBA SENDIRI' : s.t === 'video' ? 'VIDEO' : s.t === 'contoh' ? 'CONTOH' : s.t === 'salah' ? 'WASPADA' : s.t === 'latihan' ? 'LATIHAN' : s.t === 'misi' ? 'MISI' : 'RANGKUM'}</small><h3 class="h3">${s.judul}</h3></div></div>${secBody(s, tp)}<div class="les-f"><button class="btn ${isDone(tp, s.id) ? 'btn-ok' : 'btn-soft'} btn-sm" data-done="${s.id}">${ic('check')} ${isDone(tp, s.id) ? 'Sudah paham' : 'Aku paham bagian ini'}</button></div></section>`).join('') +
      `<div class="card next-c glow reveal"><div><b>${cnt(tp) === m.sec.length ? '🎉 Semua bagian ' + tp.replace('TP', 'TP ') + ' selesai!' : 'Lanjutkan perjalananmu'}</b><p class="muted">${tp !== 'TP6' ? 'Berikutnya: ' + MAT[tps[tps.indexOf(tp) + 1]].tab : 'Saatnya menguji diri di Ruang CBT.'}</p></div><button class="btn btn-primary" data-nexttp>${tp !== 'TP6' ? 'Ke ' + tps[tps.indexOf(tp) + 1].replace('TP', 'TP ') : 'Ke Ruang CBT'} ${ic('arrow')}</button></div>`;
    m.sec.forEach(s => {
      const box = $('#sec-' + s.id, view); if (!box) return;
      if (s.t === 'steps') stepper($('.stepper', box), s);
      if (s.t === 'widget') { const h = $('.wmount', box); WID[s.w](h); }
      if (s.t === 'contoh') contoh(box, s);
      if (s.t === 'latihan') latihan(box, s, ok => { markDone(s.id, true); toast(`Latihan selesai: ${ok} benar dari ${s.items.length}.`, ok === s.items.length ? 'ok' : 'warn', 3200); });
      if (s.t === 'misi') { const p = prog(); const key = 'misi_' + tp; $$('[data-mi]', box).forEach(c => { c.checked = !!(p[key] && p[key][c.dataset.mi]); }); }
    });
    FX.scan(view);
  }
  function markDone(id, on) { const p = prog(); p[tp] = p[tp] || {}; if (on) p[tp][id] = 1; else delete p[tp][id]; MAT_STORE.set(p); tabs(); side(); const b = $(`[data-done="${id}"]`, view), sec = $('#sec-' + id, view); if (b) { b.className = 'btn ' + (on ? 'btn-ok' : 'btn-soft') + ' btn-sm'; b.innerHTML = ic('check') + (on ? ' Sudah paham' : ' Aku paham bagian ini'); } if (sec) sec.classList.toggle('done', on); }
  view.addEventListener('click', e => {
    const t = e.target.closest('#mt [data-t]'); if (t) { tp = t.dataset.t; draw(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const dn = e.target.closest('[data-done]'); if (dn) { const id = dn.dataset.done; const was = isDone(tp, id); markDone(id, !was); if (!was) FX.burst(e.clientX, e.clientY); return; }
    const g = e.target.closest('[data-go]'); if (g) { const x = $('#sec-' + g.dataset.go, view); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (e.target.closest('[data-nexttp]')) { if (tp === 'TP6') { App.go('cbt'); return; } tp = tps[tps.indexOf(tp) + 1]; draw(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const sa = e.target.closest('.salah'); if (sa) { sa.classList.toggle('open'); return; }
    const yt = e.target.closest('.yt-play'); if (yt) { const w = yt.closest('.yt-w'); w.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${w.dataset.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${w.dataset.judul}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`; return; }
  });
  view.addEventListener('change', e => { const c = e.target.closest('[data-mi]'); if (!c) return; const p = prog(), key = 'misi_' + tp; p[key] = p[key] || {}; c.checked ? p[key][c.dataset.mi] = 1 : delete p[key][c.dataset.mi]; MAT_STORE.set(p); if ($$('[data-mi]', view).every(x => x.checked)) { markDone('misi', true); toast('Misi lapangan selesai — hebat! 🎉'); } });
  draw();
};
