/* PythaQuest — Art: ilustrasi SVG buatan kode (tanpa file gambar), diagram segitiga soal, bukti geometris */
'use strict';
const Art = (function () {
  const uri = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const PAL = [['#EEE9FF', '#C9BCFF', '#5B3FD9'], ['#E6FBF2', '#A4EDD0', '#12A06D'], ['#FFF2E3', '#FFCFA0', '#D9730D'], ['#E7F0FF', '#B7D0FF', '#2F6FE4']];
  function base(v, inner) {
    const p = PAL[v % PAL.length], id = 'b' + v + Math.floor(Math.random() * 1e5);
    const dots = Array.from({ length: 14 }, (_, i) => '<circle cx="' + (30 + (i * 97 + v * 41) % 590) + '" cy="' + (24 + (i * 61 + v * 29) % 390) + '" r="' + (2 + i % 3) + '" fill="' + p[2] + '" opacity=".18"/>').join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient><pattern id="' + id + 'g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="' + p[2] + '" stroke-opacity=".08"/></pattern></defs><rect width="640" height="440" fill="url(#' + id + ')"/><rect width="640" height="440" fill="url(#' + id + 'g)"/>' + dots + inner(p) + '</svg>';
  }
  const T = (x, y, s, t, c, w) => '<text x="' + x + '" y="' + y + '" font-family="Arial,Helvetica,sans-serif" font-weight="' + (w || 700) + '" font-size="' + s + '" fill="' + c + '" text-anchor="middle">' + t + '</text>';
  const scenes = {
    penggaris: (v, p) => {
      let ticks = ''; for (let i = 0; i <= 30; i++) ticks += '<line x1="' + (-170 + i * 11.3) + '" y1="-30" x2="' + (-170 + i * 11.3) + '" y2="' + (i % 5 ? -21 : -14) + '" stroke="' + p[2] + '" stroke-width="2"/>';
      return '<g transform="translate(320 250) rotate(' + (v === 0 ? -16 : v === 1 ? 12 : -4) + ')"><rect x="-180" y="-32" width="360" height="64" rx="12" fill="#fff" stroke="' + p[2] + '" stroke-width="3"/>' + ticks + '</g>' +
        '<g transform="translate(' + (v === 1 ? 380 : 150) + ' 120) rotate(' + (v === 2 ? 8 : 0) + ')"><path d="M0 0v150h150z" fill="#63FAB7" fill-opacity=".7" stroke="#0E9E69" stroke-width="4" stroke-linejoin="round"/><path d="M26 70v54h54z" fill="#fff" fill-opacity=".85" stroke="#0E9E69" stroke-width="2"/></g>' +
        '<g transform="translate(' + (v === 1 ? 150 : 430) + ' 150)"><path d="M-80 0a80 80 0 0 1 160 0z" fill="#fff" fill-opacity=".85" stroke="' + p[2] + '" stroke-width="3"/><path d="M0 0v-74M-52-56l5 4M52-56l-5 4" stroke="' + p[2] + '" stroke-width="2"/><circle r="4" fill="' + p[2] + '"/></g>';
    },
    buku: (v, p) => {
      const book = (x, y, c, r) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-110" y="-150" width="220" height="300" rx="14" fill="' + c + '"/><rect x="-110" y="-150" width="24" height="300" rx="10" fill="#000" fill-opacity=".18"/><rect x="-62" y="-104" width="150" height="86" rx="10" fill="#fff" fill-opacity=".92"/>' + T(13, -50, 26, 'a² + b² = c²', c, 800) + '<path d="M60 150v40l14-10 14 10v-40" fill="#FF9F43"/><rect x="-62" y="10" width="110" height="8" rx="4" fill="#fff" fill-opacity=".5"/><rect x="-62" y="30" width="80" height="8" rx="4" fill="#fff" fill-opacity=".5"/></g>';
      return v === 0 ? book(320, 235, '#5B3FD9', -4) : v === 1 ? book(250, 240, '#12A06D', -8) + book(400, 220, '#5B3FD9', 7) : book(320, 230, '#D9730D', 3) + '<circle cx="470" cy="110" r="38" fill="#fff" fill-opacity=".75"/>' + T(470, 122, 34, 'π', '#5B3FD9', 800);
    },
    pensil: (v, p) => {
      const pen = (x, y, r, c) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-150" y="-16" width="210" height="32" rx="6" fill="' + c + '"/><rect x="-150" y="-16" width="210" height="8" rx="4" fill="#fff" fill-opacity=".35"/><rect x="-170" y="-16" width="26" height="32" rx="6" fill="#FFB1C8"/><rect x="-146" y="-16" width="8" height="32" fill="#cfd4dc"/><path d="M60-16L128 0 60 16z" fill="#F3D9A8"/><path d="M110-6L128 0 110 6z" fill="#334"/></g>';
      return pen(320, 160 + v * 12, -18 + v * 14, '#5B3FD9') + pen(300, 250, 6 - v * 8, '#1FC98B') + pen(330, 330, 22 - v * 6, '#FF9F43') + (v === 1 ? '<rect x="470" y="70" width="14" height="110" rx="6" fill="#fff" stroke="' + p[2] + '" stroke-width="3" transform="rotate(14 470 70)"/>' : '');
    },
    plakat: (v, p) => v === 2
      ? '<path d="M240 90h160v70c0 52-36 84-80 84s-80-32-80-84z" fill="#FFC53D" stroke="#B7791F" stroke-width="5"/><path d="M240 110h-44c0 40 18 62 52 70M400 110h44c0 40-18 62-52 70" fill="none" stroke="#B7791F" stroke-width="9" stroke-linecap="round"/><rect x="296" y="244" width="48" height="52" fill="#E0A81E"/><rect x="250" y="296" width="140" height="34" rx="8" fill="#5B3FD9"/>' + T(320, 190, 62, '★', '#fff', 700) + T(320, 320, 18, 'JUARA', '#fff', 800)
      : '<g transform="translate(320 220) rotate(' + (v === 0 ? -3 : 4) + ')"><rect x="-190" y="-135" width="380" height="270" rx="12" fill="#C98A1E"/><rect x="-170" y="-115" width="340" height="230" rx="6" fill="#FFF8E6"/><path d="M-150 -95h300v190h-300z" fill="none" stroke="#C98A1E" stroke-width="3" stroke-dasharray="10 6"/><path d="M-30 20v-60h60z" fill="#5B3FD9" opacity=".9" transform="translate(0 -10)"/>' + T(0, -52, 34, 'JUARA GEOMETRI', '#5B3FD9', 800) + T(0, 60, 22, 'SMP Maitreyawira', '#8a6d1f', 700) + '<circle cx="-130" cy="95" r="14" fill="#FFC53D"/><circle cx="130" cy="95" r="14" fill="#FFC53D"/></g>',
    voucher: (v, p) => '<g transform="translate(320 220) rotate(' + (v === 0 ? -6 : v === 1 ? 5 : -2) + ')"><path d="M-200-110h400v80a26 26 0 0 0 0 52v80h-400v-80a26 26 0 0 0 0-52z" fill="#fff" stroke="' + p[2] + '" stroke-width="4"/><path d="M96-110v220" stroke="' + p[2] + '" stroke-width="3" stroke-dasharray="9 8"/>' + T(-52, -40, 26, 'VOUCHER', p[2], 800) + T(-52, 22, 54, 'Rp15.000', '#1e1b39', 800) + T(-52, 66, 18, 'Kantin Sehat Maitreya', '#6b6890', 600) + '<circle cx="148" cy="-12" r="34" fill="' + p[1] + '"/><path d="M134-30v18a8 8 0 0 0 16 0v-18M142-30v40M160-30v14c0 8 6 10 6 10v26" stroke="' + p[2] + '" stroke-width="5" fill="none" stroke-linecap="round"/></g>',
    lencana: (v, p) => '<g transform="translate(320 215)"><path d="M-64-40L-98 150l98-44 98 44-34-190z" fill="' + (v === 1 ? '#12A06D' : '#5B3FD9') + '"/><circle r="110" fill="#FFC53D" stroke="#B7791F" stroke-width="6"/><circle r="86" fill="none" stroke="#B7791F" stroke-width="3" stroke-dasharray="3 7"/><path d="M-38 34v-86h8L40 34z" fill="#5B3FD9" opacity="0"/><path d="M-44 40V-48l92 88z" fill="#fff" stroke="#5B3FD9" stroke-width="7" stroke-linejoin="round"/><path d="M-44 14h26v26h-26z" fill="none" stroke="#5B3FD9" stroke-width="5"/>' + T(0, 82, 17, 'MASTER OF PYTHAGORAS', '#7a5410', 800).replace('font-size="17"', 'font-size="12.5"') + '</g>'
  };
  function product(kind, v) { const f = scenes[kind] || scenes.penggaris; return uri(base(v || 0, p => f(v || 0, p))); }
  function productSet(kind) { return [0, 1, 2].map(v => product(kind, v)); }

  /* ---------- hero (SVG inline, 520x320) ---------- */
  function hero(i) {
    const wrap = inner => '<svg viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' + inner + '</svg>';
    if (i === 0) {
      return wrap('<defs><linearGradient id="h0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8E1FF"/><stop offset="1" stop-color="#B9A8FF"/></linearGradient></defs><rect width="520" height="320" fill="url(#h0)"/>' + proof(6, 8, { s: 12 }).replace('<svg ', '<svg x="130" y="0" width="330" height="320" ') + T(70, 70, 40, '√', '#5B3FD9', 800) + T(466, 292, 34, 'π', '#5B3FD9', 800));
    }
    if (i === 1) {
      return wrap('<defs><linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE3FF"/><stop offset=".62" stop-color="#E8F2FF"/><stop offset=".62" stop-color="#6EA8FF"/><stop offset="1" stop-color="#3B6FE0"/></linearGradient></defs><rect width="520" height="320" fill="url(#h1)"/><circle cx="430" cy="60" r="30" fill="#FFE08A"/><path d="M0 214q40-14 80 0t80 0 80 0 80 0 80 0 40 0v106H0z" fill="#fff" fill-opacity=".16"/><path d="M60 250L300 250 300 120z" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="9 7"/><path d="M270 244h24v-24" fill="none" stroke="#fff" stroke-width="3"/><g transform="translate(286 92)"><path d="M-30 22h60l-8 16h-44z" fill="#fff"/><rect x="-14" y="2" width="22" height="20" fill="#FF9F43"/><path d="M8 22V-8l22 30z" fill="#fff" fill-opacity=".9"/></g>' + T(180, 276, 20, '7 mil', '#fff', 800) + T(318, 190, 20, '24 mil', '#fff', 800) + T(150, 170, 20, '25 mil', '#fff', 800) + '<rect x="40" y="26" width="176" height="34" rx="17" fill="#fff" fill-opacity=".85"/>' + T(128, 49, 15, 'Tanjungpinang → Kepri', '#2F4EB5', 800));
    }
    return wrap('<defs><linearGradient id="h2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DFFBEF"/><stop offset="1" stop-color="#9EE9C6"/></linearGradient></defs><rect width="520" height="320" fill="url(#h2)"/><rect x="0" y="240" width="520" height="80" fill="#12A06D" fill-opacity=".25"/><rect x="40" y="226" width="440" height="16" rx="8" fill="#5B3FD9"/><rect x="146" y="60" width="14" height="168" fill="#3d2a99"/><path d="M153 62L330 228M153 62L56 228" stroke="#FF9F43" stroke-width="4"/><path d="M153 228h24v-24" fill="none" stroke="#3d2a99" stroke-width="3"/><circle cx="153" cy="62" r="9" fill="#FF9F43"/>' + T(124, 150, 20, '6 m', '#0b5e40', 800) + T(240, 262, 20, '8 m', '#0b5e40', 800) + T(264, 130, 20, '10 m', '#c25f00', 800) + '<rect x="320" y="26" width="164" height="34" rx="17" fill="#fff" fill-opacity=".85"/>' + T(402, 49, 15, 'Tripel 6 · 8 · 10', '#0b5e40', 800));
  }

  /* ---------- diagram segitiga siku-siku soal: {a (tegak), b (datar), c (miring), la, lb, lc} ---------- */
  function tri(sp, W, H) {
    W = W || 300; H = H || 190;
    const num = s => { const m = String(s || '').replace(',', '.').match(/[\d.]+/); return m ? parseFloat(m[0]) : null; };
    let a = num(sp.a), b = num(sp.b), c = num(sp.c);
    if (a == null && b != null && c != null && c > b) a = Math.sqrt(c * c - b * b);
    if (b == null && a != null && c != null && c > a) b = Math.sqrt(c * c - a * a);
    if (a == null || b == null) { a = 3; b = 4; }
    const m = 30, sc = Math.min((W - 2 * m - 30) / b, (H - 2 * m) / a), bw = b * sc, ah = a * sc, x0 = (W - bw) / 2 + 10, y0 = H - m, x1 = x0 + bw, y1 = y0 - ah;
    const L = (s, d) => d || s;
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="tri" role="img" aria-label="Sketsa segitiga siku-siku"><polygon points="' + x0 + ',' + y0 + ' ' + x1 + ',' + y0 + ' ' + x0 + ',' + y1 + '" fill="#EFEAFC" stroke="#5B3FD9" stroke-width="3" stroke-linejoin="round"/><path d="M' + x0 + ' ' + (y0 - 16) + 'h16v16" fill="none" stroke="#5B3FD9" stroke-width="2"/>' +
      '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '" stroke="#1FC98B" stroke-width="4"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '" stroke="#3B82F6" stroke-width="4"/><line x1="' + x0 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y0 + '" stroke="#FF9F43" stroke-width="4"/>' +
      '<text x="' + (x0 - 10) + '" y="' + ((y0 + y1) / 2 + 4) + '" text-anchor="end" class="tl g">' + esc(sp.a) + '</text><text x="' + ((x0 + x1) / 2) + '" y="' + (y0 + 20) + '" text-anchor="middle" class="tl b">' + esc(sp.b) + '</text><text x="' + ((x0 + x1) / 2 + 12) + '" y="' + ((y0 + y1) / 2 - 8) + '" class="tl o">' + esc(sp.c) + '</text>' +
      (sp.la ? '<text x="' + (x0 - 10) + '" y="' + ((y0 + y1) / 2 + 20) + '" text-anchor="end" class="ts">' + esc(sp.la) + '</text>' : '') + (sp.lb ? '<text x="' + ((x0 + x1) / 2) + '" y="' + (y0 + 34) + '" text-anchor="middle" class="ts">' + esc(sp.lb) + '</text>' : '') + (sp.lc ? '<text x="' + ((x0 + x1) / 2 + 12) + '" y="' + ((y0 + y1) / 2 + 8) + '" class="ts">' + esc(sp.lc) + '</text>' : '') + '</svg>';
  }

  /* ---------- bukti geometris: persegi pada tiap sisi segitiga siku-siku (a, b dalam cm) ---------- */
  function proof(a, b, opt) {
    opt = opt || {}; const c = Math.sqrt(a * a + b * b), s = opt.s || Math.min(12, 280 / (a + b), 100 / a, 260 / b), Cx = 270, Cy = 300;
    const B = [Cx + a * s, Cy], A = [Cx, Cy - b * s], n = [b * s, -a * s], f = x => Math.round(x * 100) / 100;
    const sq = [[B[0], B[1]], [A[0], A[1]], [A[0] + n[0], A[1] + n[1]], [B[0] + n[0], B[1] + n[1]]].map(p => f(p[0]) + ',' + f(p[1])).join(' ');
    const cx = (A[0] + B[0]) / 2 + n[0] / 2, cy = (A[1] + B[1]) / 2 + n[1] / 2;
    return '<svg viewBox="0 0 560 410" class="proof" role="img" aria-label="Bukti geometris luas persegi pada sisi segitiga siku-siku"><rect x="' + Cx + '" y="' + Cy + '" width="' + a * s + '" height="' + a * s + '" fill="#63FAB7" fill-opacity=".75" stroke="#0E9E69" stroke-width="2.5" class="sqA"/><rect x="' + (Cx - b * s) + '" y="' + (Cy - b * s) + '" width="' + b * s + '" height="' + b * s + '" fill="#FFB77A" fill-opacity=".85" stroke="#D9730D" stroke-width="2.5" class="sqB"/><polygon points="' + sq + '" fill="#8C6DFF" fill-opacity=".8" stroke="#4420C3" stroke-width="2.5" class="sqC"/><polygon points="' + Cx + ',' + Cy + ' ' + B.join(',') + ' ' + A.join(',') + '" fill="#fff" stroke="#1e1b39" stroke-width="3" stroke-linejoin="round"/><path d="M' + Cx + ' ' + (Cy - 14) + 'h14v14" fill="none" stroke="#1e1b39" stroke-width="2"/>' +
      '<text x="' + (Cx + a * s / 2) + '" y="' + (Cy + a * s / 2 + 6) + '" text-anchor="middle" class="pl">a² = ' + fmt(a * a) + '</text><text x="' + (Cx - b * s / 2) + '" y="' + (Cy - b * s / 2 + 6) + '" text-anchor="middle" class="pl">b² = ' + fmt(b * b) + '</text><text x="' + f(cx) + '" y="' + f(cy + 6) + '" text-anchor="middle" class="pl w">c² = ' + fmt(c * c) + '</text>' +
      '<text x="' + (Cx + a * s / 2) + '" y="' + (Cy - 8) + '" text-anchor="middle" class="ps">a = ' + fmt(a) + '</text><text x="' + (Cx - 8) + '" y="' + (Cy - b * s / 2) + '" text-anchor="end" class="ps">b = ' + fmt(b) + '</text></svg>';
  }
  function logo(size) {
    return '<svg viewBox="0 0 48 48" width="' + (size || 40) + '" height="' + (size || 40) + '" aria-hidden="true"><defs><linearGradient id="pqlg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8C6DFF"/><stop offset="1" stop-color="#1FC98B"/></linearGradient></defs><rect width="48" height="48" rx="13" fill="#fff"/><path d="M12 10v26h26z" fill="none" stroke="url(#pqlg)" stroke-width="5" stroke-linejoin="round"/><path d="M12 28h8v8" fill="none" stroke="#5B3FD9" stroke-width="3"/></svg>';
  }
  return { uri, product, productSet, hero, tri, proof, logo };
})();
window.Art = Art;
