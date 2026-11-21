/* PythaQuest — Laboratorium Simulasi TP 2–5. Tiap simulasi: kontrol, visual SVG langsung, langkah terstruktur,
   wawasan, dan uji refleksi cepat. Klaim XP aktif setelah ≥3 interaksi + uji refleksi benar. */
'use strict';
const SIM = (function () {
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const num = n => fmt(Math.round(n * 100) / 100);
  const isInt = n => Math.abs(n - Math.round(n)) < 1e-9;
  const slider = (id, label, min, max, val, step, col) => '<div class="sl"><div class="between"><label for="' + id + '"><i class="dot" style="background:' + col + '"></i>' + label + '</label><output class="val" id="o-' + id + '" style="color:' + col + '">' + val + '</output></div><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + (step || 1) + '" value="' + val + '" style="--c:' + col + '"><div class="between tiny muted"><span>Min: ' + min + '</span><span>Maks: ' + max + '</span></div></div>';
  const steps = arr => '<ol class="steps">' + arr.map((s, i) => '<li class="' + (i === arr.length - 1 ? 'last' : '') + '"><b>' + (i + 1) + '</b><div><strong>' + s[0] + '</strong><span>' + s[1] + '</span></div></li>').join('') + '</ol>';
  const insight = t => '<div class="insight">' + ic('sparkles') + '<div><strong>Wawasan</strong><p>' + t + '</p></div></div>';

  /* ---------- kerangka umum ---------- */
  function shell(host, cfg) {
    host.innerHTML = '<div class="sim-grid"><div class="card sim-left"><div class="sim-tabs">' + (cfg.tabs || '') + '</div><div class="sim-canvas" id="sc"></div><div id="sctrl" class="sim-ctrl">' + cfg.controls + '</div></div>' +
      '<div class="sim-right"><div id="sres"></div><div class="card"><h4 class="h4">Langkah Perhitungan Terstruktur</h4><div id="sstep"></div></div><div id="sins"></div>' +
      '<div class="card quick"><h4 class="h4">' + ic('message') + ' Uji Refleksi Cepat Lab</h4><p>' + cfg.quick.q + '</p><div class="chips" id="sq">' + cfg.quick.opsi.map((o, i) => '<button class="chip-btn" data-i="' + i + '">' + o + '</button>').join('') + '</div><div id="sqf" class="qfb"></div></div></div></div>';
    const st = { touched: 0, solved: false };
    $('#sq', host).addEventListener('click', e => {
      const b = e.target.closest('.chip-btn'); if (!b || st.solved) return;
      const ok = +b.dataset.i === cfg.quick.benar;
      b.classList.add(ok ? 'right' : 'wrong');
      $('#sqf', host).innerHTML = ok ? '<span class="pill ok">' + ic('check') + ' Benar!</span> ' + cfg.quick.bahas : '<span class="pill warn">Belum tepat</span> Coba lagi — ' + cfg.quick.petunjuk;
      if (ok) { st.solved = true; FX.burst(e.clientX, e.clientY); host.dispatchEvent(new CustomEvent('simstate', { bubbles: true })); }
    });
    host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) { st.touched++; host.dispatchEvent(new CustomEvent('simstate', { bubbles: true })); } });
    host.addEventListener('click', e => { if (e.target.closest('[data-touch]')) { st.touched++; host.dispatchEvent(new CustomEvent('simstate', { bubbles: true })); } });
    return st;
  }
  const put = (host, o) => { $('#sc', host).innerHTML = o.canvas; $('#sres', host).innerHTML = o.result; $('#sstep', host).innerHTML = o.steps; $('#sins', host).innerHTML = o.insight || ''; };
  const val = (host, id) => +$('#' + id, host).value;
  const out = (host, id, t) => { const o = $('#o-' + id, host); if (o) o.textContent = t; };

  /* ================= TP2 : hipotenusa & sisi tegak ================= */
  function tp2(host) {
    let mode = 'c';
    const ctrl = () => mode === 'c'
      ? slider('a', 'Sisi Alas (a)', 3, 15, 6, 1, '#3B82F6') + slider('b', 'Sisi Tegak (b)', 4, 20, 8, 1, '#5B3FD9')
      : slider('c', 'Sisi Miring (c)', 5, 25, 10, 1, '#FF9F43') + slider('a', 'Sisi Alas (a)', 3, 24, 6, 1, '#3B82F6');
    const st = shell(host, {
      tabs: '<button class="tab on" data-m="c">Cari Hipotenusa (c)</button><button class="tab" data-m="b">Cari Sisi Tegak (b)</button>', controls: ctrl(),
      quick: { q: 'Jika sisi alas digeser menjadi <b>9 cm</b> dan sisi tegak <b>12 cm</b>, berapakah panjang hipotenusa c?', opsi: ['15 cm', '16 cm', '18 cm'], benar: 0, bahas: '9² + 12² = 81 + 144 = 225 → c = 15 cm.', petunjuk: 'jumlahkan 9² dan 12² lalu tarik akar.' }
    });
    function draw() {
      let a, b, c;
      if (mode === 'c') { a = val(host, 'a'); b = val(host, 'b'); c = Math.sqrt(a * a + b * b); out(host, 'a', a + ' cm'); out(host, 'b', b + ' cm'); }
      else { c = val(host, 'c'); const am = Math.min(val(host, 'a'), c - 1); a = am; b = Math.sqrt(c * c - a * a); out(host, 'c', c + ' cm'); out(host, 'a', a + ' cm'); }
      const tri = isInt(a) && isInt(b) && isInt(c);
      put(host, {
        canvas: Art.proof(a, b),
        result: '<div class="verdict ok"><span class="pill ok">' + ic('check') + ' Uji Teorema Valid</span><h3>' + (mode === 'c' ? 'c = √(a² + b²) = ' : 'b = √(c² − a²) = ') + '<span class="big">' + num(mode === 'c' ? c : b) + ' cm</span></h3><p>' + num(a) + '² + ' + num(b) + '² = ' + num(a * a + b * b) + ' = ' + num(c) + '²</p></div>',
        steps: steps(mode === 'c' ? [['Identifikasi sisi diketahui', 'Sisi alas a = ' + num(a) + ' cm, sisi tegak b = ' + num(b) + ' cm.'], ['Kuadratkan masing-masing', 'a² = ' + num(a * a) + ' cm², b² = ' + num(b * b) + ' cm².'], ['Jumlahkan kuadrat sisi siku-siku', 'c² = ' + num(a * a) + ' + ' + num(b * b) + ' = ' + num(c * c) + '.'], ['Tarik akar kuadrat', 'c = √' + num(c * c) + ' = ' + num(c) + ' cm (panjang pasti positif).']]
          : [['Identifikasi sisi diketahui', 'Sisi miring c = ' + num(c) + ' cm, sisi alas a = ' + num(a) + ' cm.'], ['Kuadratkan masing-masing', 'c² = ' + num(c * c) + ', a² = ' + num(a * a) + '.'], ['KURANGKAN (bukan jumlahkan)', 'b² = c² − a² = ' + num(c * c) + ' − ' + num(a * a) + ' = ' + num(b * b) + '.'], ['Tarik akar kuadrat', 'b = √' + num(b * b) + ' = ' + num(b) + ' cm.']]),
        insight: insight(tri ? 'Kombinasi (' + [a, b, c].map(num).sort((x, y) => parseFloat(x) - parseFloat(y)).join(', ') + ') semuanya bilangan bulat — itu <b>tripel Pythagoras</b>!' : 'Hasilnya bukan bilangan bulat. Coba geser slider sampai ketiga sisi bulat (misalnya 6-8-10 atau 5-12-13).')
      });
    }
    host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) draw(); });
    host.addEventListener('click', e => {
      const t = e.target.closest('.tab'); if (!t) return; mode = t.dataset.m; $$('.tab', host).forEach(x => x.classList.toggle('on', x === t));
      $('#sctrl', host).innerHTML = ctrl(); st.touched++; draw(); host.dispatchEvent(new CustomEvent('simstate', { bubbles: true }));
    });
    draw(); return st;
  }

  /* ================= TP3 : kebalikan Pythagoras ================= */
  function tp3(host) {
    const PRE = [[6, 8, 10], [7, 9, 10], [5, 6, 10], [5, 12, 13]];
    const st = shell(host, {
      controls: slider('a', 'Sisi 1', 2, 20, 6, 1, '#3B82F6') + slider('b', 'Sisi 2', 2, 20, 8, 1, '#5B3FD9') + slider('c', 'Sisi 3', 2, 20, 10, 1, '#FF9F43') + '<div class="chips"><span class="muted tiny">Contoh cepat:</span>' + PRE.map(p => '<button class="chip-btn" data-touch data-pre="' + p.join(',') + '">' + p.join(', ') + '</button>').join('') + '</div>',
      quick: { q: 'Sebuah segitiga memiliki sisi <b>8, 15, dan 17</b>. Jenis segitiganya adalah…', opsi: ['Lancip', 'Siku-siku', 'Tumpul'], benar: 1, bahas: '8² + 15² = 64 + 225 = 289 = 17² → siku-siku.', petunjuk: 'bandingkan 17² dengan 8² + 15².' }
    });
    function draw() {
      const raw = ['a', 'b', 'c'].map(i => val(host, i)); raw.forEach((v, i) => out(host, 'abc'[i], v + ' cm'));
      const s = raw.slice().sort((x, y) => x - y), [p, q, r] = s, ok = p + q > r, sum = p * p + q * q, rr = r * r;
      const jenis = !ok ? 'tak' : sum === rr ? 'siku' : sum > rr ? 'lancip' : 'tumpul';
      let svg = '<svg viewBox="0 0 360 230" class="tri-sim"><rect width="360" height="230" fill="none"/>';
      if (ok) {
        const x = (q * q + r * r - p * p) / (2 * r), y = Math.sqrt(Math.max(0, q * q - x * x)), k = Math.min(300 / r, 170 / Math.max(y, 1)), ox = (360 - r * k) / 2, oy = 205;
        const A = [ox, oy], B = [ox + r * k, oy], C = [ox + x * k, oy - y * k], col = { siku: '#1FC98B', lancip: '#3B82F6', tumpul: '#FF9F43' }[jenis];
        svg += '<polygon points="' + A + ' ' + B + ' ' + C + '" fill="' + col + '" fill-opacity=".18" stroke="' + col + '" stroke-width="4" stroke-linejoin="round"/>';
        if (jenis === 'siku') { const u = [(B[0] - C[0]), (B[1] - C[1])], l = Math.hypot(...u); const d1 = [(A[0] - C[0]), (A[1] - C[1])], l1 = Math.hypot(...d1); const a1 = [C[0] + d1[0] / l1 * 14, C[1] + d1[1] / l1 * 14], b1 = [C[0] + u[0] / l * 14, C[1] + u[1] / l * 14], c1 = [a1[0] + b1[0] - C[0], a1[1] + b1[1] - C[1]]; svg += '<path d="M' + a1 + 'L' + c1 + 'L' + b1 + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>'; }
        svg += '<text x="' + ((A[0] + B[0]) / 2) + '" y="224" text-anchor="middle" class="tl">' + r + '</text><text x="' + ((A[0] + C[0]) / 2 - 12) + '" y="' + ((A[1] + C[1]) / 2) + '" text-anchor="end" class="tl">' + q + '</text><text x="' + ((B[0] + C[0]) / 2 + 12) + '" y="' + ((B[1] + C[1]) / 2) + '" class="tl">' + p + '</text>';
      } else svg += '<text x="180" y="110" text-anchor="middle" class="tl o">Tidak dapat</text><text x="180" y="138" text-anchor="middle" class="tl o">membentuk segitiga</text>';
      svg += '</svg>';
      const lab = { siku: ['SEGITIGA SIKU-SIKU', 'ok', 'c² = a² + b²'], lancip: ['SEGITIGA LANCIP', 'info', 'c² < a² + b²'], tumpul: ['SEGITIGA TUMPUL', 'warn', 'c² > a² + b²'], tak: ['BUKAN SEGITIGA', 'err', 'a + b ≤ c'] }[jenis];
      put(host, {
        canvas: svg,
        result: '<div class="verdict ' + lab[1] + '"><span class="pill ' + lab[1] + '">Kebalikan Teorema</span><h3>' + lab[0] + '</h3><p>' + (ok ? p + '² + ' + q + '² = ' + sum + ' &nbsp;|&nbsp; ' + r + '² = ' + rr + ' &nbsp;→&nbsp; ' + lab[2] : p + ' + ' + q + ' = ' + (p + q) + ' tidak lebih besar dari ' + r) + '</p></div>',
        steps: steps([['Urutkan sisi', 'Sisi terpanjang c = ' + r + '; dua lainnya ' + p + ' dan ' + q + '.'], ['Cek syarat segitiga', p + ' + ' + q + ' = ' + (p + q) + (ok ? ' > ' : ' ≤ ') + r + (ok ? ' ✔' : ' ✘')], ['Kuadratkan', 'a² + b² = ' + sum + '; c² = ' + rr + '.'], ['Bandingkan', ok ? (sum === rr ? 'Sama → siku-siku.' : sum > rr ? a_gt(sum, rr) : a_lt(sum, rr)) : 'Tidak diperiksa karena bukan segitiga.']]),
        insight: insight('Semakin besar c² dibanding a² + b², semakin <b>tumpul</b> sudut terbesarnya. Coba atur sisi ke <b>(' + '5, 12, 13)</b> untuk melihat siku-siku.')
      });
    }
    const a_gt = (s, r) => s + ' > ' + r + ' → a² + b² > c² → lancip.', a_lt = (s, r) => s + ' < ' + r + ' → a² + b² < c² → tumpul.';
    host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) draw(); });
    host.addEventListener('click', e => { const b = e.target.closest('[data-pre]'); if (!b) return; const v = b.dataset.pre.split(','); ['a', 'b', 'c'].forEach((id, i) => { $('#' + id, host).value = v[i]; }); draw(); });
    draw(); return st;
  }

  /* ================= TP4 : tripel Pythagoras ================= */
  function tp4(host) {
    const found = new Set();
    const st = shell(host, {
      controls: slider('m', 'Bilangan m', 2, 9, 2, 1, '#5B3FD9') + slider('n', 'Bilangan n (n < m)', 1, 8, 1, 1, '#1FC98B') + slider('k', 'Pengali (kelipatan k)', 1, 6, 1, 1, '#FF9F43') + '<div class="chips" id="coll"></div>',
      quick: { q: 'Manakah yang merupakan <b>kelipatan 4</b> dari tripel (3, 4, 5)?', opsi: ['(12, 16, 20)', '(12, 16, 21)', '(7, 8, 9)'], benar: 0, bahas: '4 × (3, 4, 5) = (12, 16, 20), dan 12² + 16² = 400 = 20².', petunjuk: 'kalikan ketiga bilangan dengan 4.' }
    });
    function draw() {
      let m = val(host, 'm'), n = val(host, 'n'); const k = val(host, 'k');
      if (n >= m) { n = m - 1; $('#n', host).value = n; }
      out(host, 'm', m); out(host, 'n', n); out(host, 'k', '×' + k);
      const a = (m * m - n * n) * k, b = 2 * m * n * k, c = (m * m + n * n) * k, g = gcd(gcd(a, b), c), prim = g === 1;
      found.add([a, b, c].sort((x, y) => x - y).join('-'));
      const lst = [a, b, c].sort((x, y) => x - y);
      put(host, {
        canvas: '<div class="tri-wrap">' + Art.tri({ a: String(lst[0]), b: String(lst[1]), c: String(lst[2]), la: '', lb: '', lc: '' }, 360, 230).replace('class="tri"', 'class="tri big"') + '</div>',
        result: '<div class="verdict ok"><span class="pill ok">' + ic('check') + ' Tripel Valid</span><h3>(' + lst.join(', ') + ')</h3><p>' + lst[0] + '² + ' + lst[1] + '² = ' + (lst[0] ** 2 + lst[1] ** 2) + ' = ' + lst[2] + '²</p></div>',
        steps: steps([['Pilih m dan n', 'm = ' + m + ', n = ' + n + ' (m > n > 0).'], ['Terapkan rumus Euclid', '(m² − n², 2mn, m² + n²) = (' + (m * m - n * n) + ', ' + 2 * m * n + ', ' + (m * m + n * n) + ').'], ['Kalikan dengan k = ' + k, '(' + lst.join(', ') + ')'], ['Verifikasi', lst[0] + '² + ' + lst[1] + '² = ' + (lst[0] ** 2 + lst[1] ** 2) + ' = ' + lst[2] + '².']]),
        insight: insight(prim ? 'Ini <b>tripel dasar</b> (FPB = 1) — tidak bisa disederhanakan.' : 'Ini <b>kelipatan ' + g + '×</b> dari tripel dasar (' + lst.map(x => x / g).join(', ') + ').')
      });
      $('#coll', host).innerHTML = '<span class="muted tiny">Koleksi tripelmu (' + found.size + '):</span>' + [...found].map(t => '<span class="chip">' + t.replace(/-/g, ', ') + '</span>').join('');
    }
    host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) draw(); });
    draw(); return st;
  }

  /* ================= TP5 : segitiga istimewa ================= */
  function tp5(host) {
    let mode = 45;
    const ctrl = () => slider('x', mode === 45 ? 'Sisi siku-siku (x)' : 'Sisi terpendek (x)', 1, 12, 5, 1, '#5B3FD9');
    const st = shell(host, {
      tabs: '<button class="tab on" data-m="45">45°–45°–90°</button><button class="tab" data-m="30">30°–60°–90°</button>', controls: ctrl(),
      quick: { q: 'Pada segitiga 30°–60°–90° sisi terpendeknya <b>6 cm</b>. Berapakah panjang hipotenusanya?', opsi: ['12 cm', '6√3 cm', '6√2 cm'], benar: 0, bahas: 'Hipotenusa = 2 × sisi terpendek = 12 cm.', petunjuk: 'rasio sisinya 1 : √3 : 2.' }
    });
    function draw() {
      const x = val(host, 'x'); out(host, 'x', x + ' cm');
      let svg, res, stp, ins;
      if (mode === 45) {
        const h = x * Math.SQRT2, k = Math.min(200 / x, 14), w = x * k;
        svg = '<svg viewBox="0 0 360 230" class="tri-sim"><polygon points="' + (180 - w / 2) + ',205 ' + (180 + w / 2) + ',205 ' + (180 - w / 2) + ',' + (205 - w) + '" fill="#8C6DFF" fill-opacity=".16" stroke="#5B3FD9" stroke-width="4" stroke-linejoin="round"/><path d="M' + (180 - w / 2) + ' 189h16v16" fill="none" stroke="#5B3FD9" stroke-width="2.5"/><text x="180" y="224" text-anchor="middle" class="tl b">' + x + '</text><text x="' + (180 - w / 2 - 10) + '" y="' + (205 - w / 2) + '" text-anchor="end" class="tl g">' + x + '</text><text x="' + (180 + 10) + '" y="' + (205 - w / 2 - 8) + '" class="tl o">' + x + '√2</text><text x="' + (180 - w / 2 + 26) + '" y="198" class="ts">45°</text><text x="' + (180 + w / 2 - 36) + '" y="198" class="ts">45°</text></svg>';
        res = '<div class="verdict ok"><span class="pill ok">Rasio 1 : 1 : √2</span><h3>Hipotenusa = ' + x + '√2 ≈ <span class="big">' + num(h) + ' cm</span></h3><p>Diagonal persegi bersisi ' + x + ' cm = ' + x + '√2 cm</p></div>';
        stp = steps([['Kenali segitiga', 'Siku-siku sama kaki → sudut lancipnya 45° dan 45°.'], ['Rasio sisi', 'sisi : sisi : hipotenusa = 1 : 1 : √2.'], ['Kalikan dengan ' + x, 'Hipotenusa = ' + x + ' × √2.'], ['Nilai pendekatan', x + '√2 ≈ ' + num(h) + ' cm.']]);
        ins = insight('Diagonal setiap persegi selalu <b>sisi × √2</b>. Ubin bersisi 40 cm memiliki diagonal 40√2 ≈ 56,6 cm.');
      } else {
        const k = Math.min(150 / x / 1.73, 13), s = x * k, hgt = s * Math.sqrt(3), ox = 90;
        svg = '<svg viewBox="0 0 360 230" class="tri-sim"><polygon points="' + ox + ',205 ' + (ox + s) + ',205 ' + (ox + s) + ',' + (205 - hgt) + '" fill="#1FC98B" fill-opacity=".16" stroke="#0E9E69" stroke-width="4" stroke-linejoin="round"/><path d="M' + (ox + s - 16) + ' 205v-16h16" fill="none" stroke="#0E9E69" stroke-width="2.5"/><text x="' + (ox + s / 2) + '" y="224" text-anchor="middle" class="tl b">' + x + '</text><text x="' + (ox + s + 10) + '" y="' + (205 - hgt / 2) + '" class="tl g">' + x + '√3</text><text x="' + (ox + s / 2 - 16) + '" y="' + (205 - hgt / 2 - 8) + '" text-anchor="end" class="tl o">' + 2 * x + '</text><text x="' + (ox + 26) + '" y="198" class="ts">60°</text><text x="' + (ox + s - 12) + '" y="' + (205 - hgt + 34) + '" text-anchor="end" class="ts">30°</text></svg>';
        res = '<div class="verdict ok"><span class="pill ok">Rasio 1 : √3 : 2</span><h3>Hipotenusa = ' + 2 * x + ' cm · Tinggi = ' + x + '√3 ≈ <span class="big">' + num(x * Math.sqrt(3)) + ' cm</span></h3><p>Sisi terpendek ' + x + ' cm berhadapan dengan sudut 30°</p></div>';
        stp = steps([['Kenali segitiga', 'Setengah segitiga sama sisi → sudut 30°, 60°, 90°.'], ['Rasio sisi', 'depan 30° : depan 60° : miring = 1 : √3 : 2.'], ['Sisi terpendek = ' + x, 'Miring = 2 × ' + x + ' = ' + 2 * x + ' cm.'], ['Sisi di depan 60°', x + '√3 ≈ ' + num(x * Math.sqrt(3)) + ' cm.']]);
        ins = insight('Tinggi segitiga sama sisi bersisi s adalah <b>½ s√3</b> — karena dibagi menjadi dua segitiga 30°–60°–90°.');
      }
      put(host, { canvas: svg, result: res, steps: stp, insight: ins });
    }
    host.addEventListener('input', e => { if (e.target.matches('input[type=range]')) draw(); });
    host.addEventListener('click', e => { const t = e.target.closest('.tab'); if (!t) return; mode = +t.dataset.m; $$('.tab', host).forEach(y => y.classList.toggle('on', y === t)); $('#sctrl', host).innerHTML = ctrl(); st.touched++; draw(); host.dispatchEvent(new CustomEvent('simstate', { bubbles: true })); });
    draw(); return st;
  }

  const MOD = {
    TP2: { judul: 'Hitung Hipotenusa & Sisi Tegak (c² = a² + b²)', tag: 'TP 2 · Modul Teorema', fn: tp2 },
    TP3: { judul: 'Uji Kebalikan Pythagoras (Siku-siku, Lancip, Tumpul)', tag: 'TP 3 · Modul Kebalikan', fn: tp3 },
    TP4: { judul: 'Eksplorasi Tripel Pythagoras & Kelipatan', tag: 'TP 4 · Eksplorasi Pola', fn: tp4 },
    TP5: { judul: 'Perbandingan Segitiga Istimewa (45°–45°–90° & 30°–60°–90°)', tag: 'TP 5 · Segitiga Khusus', fn: tp5 }
  };
  return { MOD, mount: (id, host) => MOD[id].fn(host) };
})();
window.SIM = SIM;
