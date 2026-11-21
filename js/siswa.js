/* PythaQuest — halaman siswa & tamu */
'use strict';
const Pages = {};
const Data = {
  async boot(force) {
    if (S.guest) return Data.guestBoot();
    if (!force && S.boot && Date.now() - S.boot.at < 15000) return S.boot.d;
    const d = await API.get('boot'); S.boot = { at: Date.now(), d }; return d;
  },
  guestBoot() {
    return { user: { id: 'tamu', nama: 'Tamu', kelas: 'Pratinjau', xp: 0, level: 1, xpDari: 0, xpKe: 500, poin: { didapat: 0, terpakai: 0, saldo: 0 } }, simulasi: [], lencana: [], penguasaanTP: {}, tiketMenunggu: 0, papanPreview: [],
      paket: [['F1', 'Formatif 1', 'TP 2–3 · Teorema & Kebalikan Pythagoras', 10, 40], ['F2', 'Formatif 2', 'TP 4–6 · Tripel, Segitiga Istimewa & Masalah Nyata', 10, 40], ['SUM', 'Sumatif', 'TP 2–6 · Evaluasi Komprehensif (HOTS)', 12, 60]].map((p, i) => ({ paket: p[0], judul: p[1], cakupan: p[2], jumlahSoal: p[3], durasi: p[4], kkm: 72, status: i === 0 ? 'terbuka' : 'terkunci', skorUtama: null, poin: null, percobaan: 0, bisaMulai: i === 0 })) };
  },
  invalidate() { S.boot = null; }
};
const heroSlides = () => [0, 1, 2].map(i => '<div class="slide">' + Art.hero(i) + '</div>').join('');
const HERO_CAP = [['Bukti Geometris', 'Luas persegi pada sisi miring'], ['Navigasi Kepri', 'Jarak lurus kapal feri'], ['Konstruksi', 'Kawat penopang jembatan']];
const head = (crumb, title, sub, right) => '<div class="page-head reveal"><div><div class="crumb">' + crumb + '</div><h1 class="h1">' + title + '</h1>' + (sub ? '<p class="muted">' + sub + '</p>' : '') + '</div>' + (right ? '<div class="head-r">' + right + '</div>' : '') + '</div>';
const CRUMB = 'SMP Maitreyawira Bintan Center <i>•</i> Matematika Fase D';
function guestBanner() { return S.guest ? '<div class="banner reveal">' + ic('eye') + '<div><b>Mode Tamu (Pratinjau).</b> Kamu bisa menjelajah materi dan simulasi, tetapi XP, lencana, skor, dan papan juara tidak dicatat. <a href="#login" class="lnk">Masuk sebagai siswa</a></div></div>' : ''; }
function guestGate(name) { return '<div class="card empty reveal">' + ic('lock', 'xl') + '<h3 class="h3">' + name + ' khusus siswa terdaftar</h3><p class="muted">Masuk dengan kelas, nama, dan PIN dari gurumu untuk memakai fitur ini.</p><a class="btn btn-primary" href="#login">Masuk ke Portal</a></div>'; }

/* ================= LOGIN ================= */
Pages.login = async function (root) {
  S.clear(); document.body.classList.add('is-login');
  root.innerHTML = '<div class="login-bg"><i class="shape s1"></i><i class="shape s2"></i><i class="shape s3"></i><i class="shape s4"></i></div><div class="login-card glow tilt reveal"><div class="login-logo">' + Art.logo(64) + '<span class="badge-dot">' + ic('triangle') + '</span></div><span class="pill info school">' + ic('book') + ' SMP Maitreyawira Bintan Center</span><h1 class="login-title">Pytha<span>Quest</span></h1><p class="muted center">Platform Pembelajaran & CBT Teorema Pythagoras Kelas VIII (Fase D)</p>' +
    '<div class="seg" id="lt"><button class="on" data-t="siswa">' + ic('user') + ' Siswa</button><button data-t="guru">' + ic('book') + ' Guru</button></div><form id="lf" autocomplete="off"><div id="lbody"></div><div id="lerr" class="form-err" role="alert"></div><button class="btn btn-primary btn-lg cta w100" id="lgo" type="submit">Masuk ke Portal Belajar ' + ic('arrow') + '</button></form>' +
    '<button class="btn btn-ghost guest w100" id="lguest"><span>' + ic('eye') + ' Coba Pratinjau (Mode Tamu)</span><small>Akses pratinjau materi & simulasi tanpa pencatatan nilai</small></button>' +
    '<div class="formula-strip"><span class="ico-b">' + ic('ruler') + '</span><div><b>Teorema Segitiga Siku-Siku</b><code>a² + b² = c²</code></div><svg viewBox="0 0 60 50" width="58"><path d="M6 44V6l48 38z" fill="none" stroke="#B5A7F2" stroke-width="3" stroke-linejoin="round"/><path d="M6 34h10v10" fill="none" stroke="#B5A7F2" stroke-width="2.5"/></svg></div><p class="tiny muted center">Kurikulum Merdeka • Fase D • Matematika • SMP Maitreyawira Bintan Center</p></div>';
  FX.scan(root);
  let tab = 'siswa', roster = [];
  const body = $('#lbody', root), err = $('#lerr', root);
  const pinBoxes = () => '<div class="between"><label><b>' + ic('lock') + ' Masukkan PIN (4 Digit)</b></label><span class="tiny muted">Format: Tanggal Lahir</span></div><div class="pin" id="pin">' + [0, 1, 2, 3].map(i => '<input type="password" inputmode="numeric" maxlength="1" autocomplete="off" aria-label="Digit PIN ' + (i + 1) + '">').join('') + '</div><p class="hint">' + ic('info') + ' PIN awal biasanya 2 digit tanggal + 2 digit bulan lahir (DDMM), kecuali guru mengubahnya.</p>';
  function drawSiswa() {
    const kls = [...new Set(roster.map(s => s.kelas))];
    body.innerHTML = '<label for="lk"><b>' + ic('users') + ' Pilih Kelas</b></label><select id="lk" class="inp">' + (kls.length ? kls.map(k => '<option>' + esc(k) + '</option>').join('') : '<option value="">' + (API.ready() ? 'Belum ada siswa terdaftar' : 'Server belum terhubung') + '</option>') + '</select><label for="ln"><b>' + ic('user') + ' Nama Siswa</b></label><select id="ln" class="inp"></select>' + pinBoxes();
    const fill = () => { $('#ln', body).innerHTML = roster.filter(s => s.kelas === $('#lk', body).value).map(s => '<option value="' + esc(s.id) + '">' + esc(s.nama) + '</option>').join(''); };
    $('#lk', body).onchange = fill; fill(); bindPin();
  }
  function drawGuru() { body.innerHTML = '<label for="lg"><b>' + ic('lock') + ' PIN Guru</b></label><input id="lg" type="password" class="inp" autocomplete="current-password" placeholder="Masukkan PIN guru" maxlength="40"><p class="hint">' + ic('info') + ' PIN guru dibuat saat setup di Apps Script. Ganti di menu Pengaturan setelah login pertama.</p>'; }
  function bindPin() {
    const ins = $$('#pin input', body);
    ins.forEach((i, k) => {
      i.addEventListener('input', () => { i.value = i.value.replace(/\D/g, '').slice(-1); if (i.value && ins[k + 1]) ins[k + 1].focus(); });
      i.addEventListener('keydown', e => { if (e.key === 'Backspace' && !i.value && ins[k - 1]) ins[k - 1].focus(); });
      i.addEventListener('paste', e => { const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 4); if (!t) return; e.preventDefault(); ins.forEach((x, j) => x.value = t[j] || ''); (ins[Math.min(t.length, 3)]).focus(); });
    });
  }
  $('#lt', root).onclick = e => { const b = e.target.closest('button'); if (!b) return; tab = b.dataset.t; $$('#lt button', root).forEach(x => x.classList.toggle('on', x === b)); err.textContent = ''; tab === 'siswa' ? drawSiswa() : drawGuru(); };
  drawSiswa();
  if (API.ready()) API.get('auth.roster').then(d => { roster = d.siswa; if (tab === 'siswa') drawSiswa(); }).catch(e => { err.textContent = errMsg(e); });
  $('#lguest', root).onclick = () => { S.role = 'tamu'; S.me = { nama: 'Tamu' }; location.hash = '#beranda'; };
  $('#lf', root).onsubmit = async ev => {
    ev.preventDefault(); err.textContent = ''; const btn = $('#lgo', root);
    try {
      busy(btn, true, 'Memeriksa…');
      let d;
      if (tab === 'siswa') {
        const pin = $$('#pin input', body).map(i => i.value).join(''), id = $('#ln', body).value;
        if (!id) throw new Error('Pilih kelas dan namamu dulu.'); if (pin.length < 4) throw new Error('Lengkapi 4 digit PIN.');
        d = await API.post('auth.login', { id, pin }, { quiet: true });
      } else { const pin = $('#lg', body).value; if (!pin) throw new Error('Masukkan PIN guru.'); d = await API.post('auth.guru', { pin }, { quiet: true }); }
      S.token = d.token; S.me = d.me; S.role = d.me.role; S.save(); Data.invalidate();
      location.hash = S.guru ? '#g-dashboard' : '#beranda';
    } catch (e) { err.textContent = errMsg(e); $('.login-card', root).classList.remove('shake'); void $('.login-card', root).offsetWidth; $('.login-card', root).classList.add('shake'); }
    finally { busy(btn, false); }
  };
};

/* ================= BERANDA ================= */
function paketCard(p, i) {
  const st = p.status, lock = st === 'terkunci' || st === 'nonaktif';
  let act = '';
  if (st === 'terbuka' || st === 'berlangsung') act = '<a class="btn btn-primary btn-sm cta" href="#cbt">' + (st === 'berlangsung' ? 'Lanjutkan' : 'Kerjakan Tes') + ' ' + ic('arrow') + '</a>';
  else if (st === 'tuntas' || st === 'remedial') act = '<div class="score-mini"><b>' + fmt(p.skorUtama) + '</b><small>/100</small></div><a class="lnk" href="#progres">Lihat Hasil</a>';
  else if (st === 'refleksi') act = '<a class="btn btn-warn btn-sm" href="#cbt">Isi Refleksi</a>';
  else act = '<span class="muted tiny">' + ic('lock') + ' Selesaikan paket sebelumnya</span>';
  return '<div class="paket glow tilt reveal ' + st + '"><div class="between"><span class="muted tiny">Paket ' + (i + 1) + '</span>' + statusPill(st) + '</div><h4>' + esc(p.judul) + '</h4><p class="muted tiny">' + esc(p.cakupan) + '</p><div class="between pk-foot">' + act + '</div></div>';
}
Pages.beranda = async function (view) {
  const d = await Data.boot(), u = d.user, g = S.guest;
  const nextPk = d.paket.find(p => ['terbuka', 'berlangsung', 'refleksi'].includes(p.status));
  const done = d.paket.filter(p => p.skorUtama != null).length;
  const tpDone = id => d.simulasi.includes(id) || (d.penguasaanTP[id] || 0) >= 72;
  view.innerHTML = guestBanner() +
    '<section class="hero glow reveal"><div class="hero-l"><span class="pill glass">' + ic('star') + ' Semester Genap • Tahun Ajaran 2026/2027</span><h1>Halo, ' + esc(u.nama.split(' ')[0]) + '! <span class="wave">👋</span></h1><p>' + (g ? 'Selamat datang di PythaQuest! Jelajahi materi dan simulasi interaktif Teorema Pythagoras tanpa login.' : nextPk ? 'Siap melanjutkan petualangan Teorema Pythagoras hari ini? ' + esc(nextPk.judul) + ' menunggumu! Uji intuisi ruang dan perkuat segitiga emasmu sekarang.' : 'Hebat! Semua asesmen sudah kamu selesaikan. Ulangi simulasi atau latihan untuk memperkuat pemahaman.') + '</p><div class="row gap wrap"><a class="btn btn-white btn-lg cta" href="#' + (nextPk && !g ? 'cbt' : 'materi') + '">Lanjut Belajar ' + ic('arrow') + '</a><button class="btn btn-glass btn-lg" id="intro">' + ic('play') + ' Lihat Pengantar Singkat</button></div></div>' +
    '<div class="hero-r"><div class="slides hero-slides" data-interval="4200">' + heroSlides() + '</div><div class="hero-cap" id="hcap"><i></i><span>' + HERO_CAP[0][0] + '</span><b>' + HERO_CAP[0][1] + '</b></div></div></section>' +
    (g ? '' : '<section class="stats">' +
      stat('XP', 'Total Pengalaman', u.xp, 'bolt', 'amber', '<span class="chip amber">Level ' + u.level + ' · ' + (u.xpKe - u.xp) + ' XP lagi</span>') +
      stat('L', 'Lencana Diperoleh', d.lencana.length, 'shield', 'purple', '<span class="muted tiny">dari ' + BADGE_DEF.length + ' lencana</span>', ' / ' + BADGE_DEF.length) +
      stat('P', 'Poin Reward', u.poin.saldo, 'gift', 'mint', '<span class="chip mint">' + (u.poin.saldo > 0 ? 'Siap Ditukarkan' : 'Kumpulkan dari skor utama') + '</span>', ' Poin') +
      stat('A', 'Asesmen Selesai', done, 'check', 'purple', '<span class="muted tiny">' + (done ? 'Skor utama tercatat' : 'Belum ada') + '</span>', ' / 3 Paket') + '</section>') +
    '<section class="card meta reveal"><div class="between"><h2 class="h2">' + ic('shieldcheck') + ' Informasi Kurikulum & Konteks Modul</h2><span class="pill info">Kurikulum Merdeka</span></div><div class="meta-grid">' + META.map(m => '<div class="meta-i glow">' + ic(m[2]) + '<div><small>' + m[0] + '</small><b>' + m[1] + '</b></div></div>').join('') + '</div></section>' +
    '<section class="g2"><div class="card acc-card reveal"><button class="acc-h" aria-expanded="true">' + '<span class="ico-b o">' + ic('target') + '</span><div><h3 class="h3">🎯 Tujuan Belajarmu (TP 2 – TP 6)</h3><small class="muted">' + TPS.length + ' Target Kemahiran dalam Bab Geometri ini</small></div>' + ic('chevron', 'chev') + '</button><div class="acc-b"><p class="cp tiny muted">' + CP_FASE_D + '</p>' + TPS.map(t => '<a class="tp-row ' + (tpDone(t.id) ? 'done' : '') + '" href="#materi" data-tp="' + t.id + '"><span class="tp-no">' + (tpDone(t.id) ? ic('check') : t.no) + '</span><div><b>TP ' + t.no + ': ' + t.judul + '</b><small>' + t.ringkas + '</small></div>' + (d.penguasaanTP[t.id] != null ? '<em>' + d.penguasaanTP[t.id] + '%</em>' : '') + '</a>').join('') + '</div></div>' +
    '<div class="card acc-card reveal"><button class="acc-h" aria-expanded="true"><span class="ico-b p">' + ic('sparkles') + '</span><div><h3 class="h3">🧠 Alur & Cara Belajar Kita</h3><small class="muted">Metode belajar mandiri terbuka & terbimbing</small></div>' + ic('chevron', 'chev') + '</button><div class="acc-b">' + CARA_BELAJAR.map((c, i) => '<div class="cara glow"><span class="ico-s">' + ic(c[0]) + '</span><div><b>' + (i + 1) + '. ' + c[1] + '</b><small>' + c[2] + '</small></div></div>').join('') + '</div></div></section>' +
    '<section class="g-main"><div class="card reveal"><div class="between"><div><h2 class="h2">Status Asesmen & Jalur Kelulusan</h2><small class="muted">Selesaikan seluruh tahapan untuk mengklaim Sertifikat Geometri</small></div><span class="pill ok">Fase Aktif</span></div><div class="g3 paket-row">' + d.paket.map(paketCard).join('') + '</div>' +
    '<div class="between mt"><b>Grafik Penguasaan Materi (TP 2 – TP 6)</b><small class="muted">' + (Object.keys(d.penguasaanTP).length ? 'Rata-rata: ' + fmt(Object.values(d.penguasaanTP).reduce((a, b) => a + b, 0) / Object.keys(d.penguasaanTP).length) + '%' : 'Muncul setelah asesmen pertama') + '</small></div><div id="gm" class="chart-box"></div></div>' +
    '<div class="stack"><div class="card reveal"><div class="between"><h2 class="h2">' + ic('chart') + ' Papan Juara</h2><a class="lnk" href="#papan">Semua</a></div><small class="muted">Skor tertinggi Teorema Pythagoras ' + esc(u.kelas) + '</small><div id="pj" class="pj">' + miniBoard(d.papanPreview, u.id) + '</div></div>' +
    '<a class="card click glow tilt lab-cta reveal" href="#simulasi"><span class="ico-b p">' + ic('flask') + '</span><div><b>Uji Teorema di Lab</b><small>Eksplorasi pembuktian luas kotak c²</small></div><span class="go">' + ic('arrow') + '</span></a></div></section>';
  const tpl = ['TP2', 'TP3', 'TP4', 'TP5', 'TP6'];
  lineChart($('#gm', view), { labels: tpl.map(t => t.replace('TP', 'TP ')), series: [{ name: 'Penguasaan', values: tpl.map(t => d.penguasaanTP[t] == null ? null : d.penguasaanTP[t]), color: '#5B3FD9' }], min: 0, max: 100, ticks: [0, 50, 72, 100], ref: 72, refLabel: 'KKM 72', unit: '%', h: 210 });
  $$('.acc-h', view).forEach(b => b.onclick = () => { const o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', !o); b.nextElementSibling.classList.toggle('closed', o); });
  $$('[data-tp]', view).forEach(a => a.addEventListener('click', () => { S.tp = a.dataset.tp; }));
  const caps = $('#hcap', view); let ci = 0; const hs = $('.hero-slides', view);
  if (hs) new MutationObserver(() => { const k = $$('.slide', hs).findIndex(s => s.classList.contains('on')); if (k >= 0 && k !== ci) { ci = k; caps.innerHTML = '<i></i><span>' + HERO_CAP[k][0] + '</span><b>' + HERO_CAP[k][1] + '</b>'; } }).observe(hs, { subtree: true, attributes: true, attributeFilter: ['class'] });
  $('#intro', view).onclick = introModal;
  function stat(k, label, n, icon, tone, foot, suf) { return '<div class="stat glow tilt reveal"><div><small>' + label + '</small><div class="num"><span data-count="' + n + '">0</span>' + (suf ? '<em>' + suf + '</em>' : k === 'XP' ? '<em> XP</em>' : '') + '</div>' + foot + '</div><span class="ico-b ' + tone + '">' + ic(icon) + '</span></div>'; }
};
function miniBoard(rows, me) {
  if (!rows || !rows.length) return '<p class="muted tiny pad">Papan juara muncul setelah ada siswa yang menuntaskan Formatif 1.</p>';
  return rows.map(r => '<div class="pj-row ' + (r.id === me ? 'me' : '') + '"><span class="rk r' + r.rank + '">' + (r.rank <= 3 ? ic('medal') : r.rank) + '</span><div class="av">' + inisial(r.nama) + '</div><div><b>' + esc(r.nama) + (r.id === me ? ' <em>Kamu</em>' : '') + '</b><small>' + r.lencana + ' lencana · ' + fmt(r.xp) + ' XP</small></div><strong>' + fmt(r.skor) + '</strong></div>').join('');
}
function introModal() {
  const items = [[Art.proof(3, 4, { s: 22 }), 'Persegi pada setiap sisi', 'Luas persegi pada sisi miring (c²) = luas persegi pada kedua sisi siku-siku: 9 + 16 = 25.'], [Art.proof(6, 8), 'Berlaku untuk semua ukuran', '36 + 64 = 100, jadi c = 10. Rumusnya sama untuk segitiga siku-siku mana pun.'], [Art.tri({ a: '12 m', b: '5 m', c: '13 m', la: 'Tiang', lb: 'Jarak', lc: 'Kawat' }, 360, 230).replace('class="tri"', 'class="tri big"'), 'Dipakai di kehidupan nyata', 'Menghitung tangga, kawat penopang, jembatan, hingga jarak kapal di perairan Kepulauan Riau.'], ['<div class="big-eq">a² + b² = c²</div>', 'Siap bertualang?', 'Jelajahi materi, coba simulasi, lalu uji dirimu di Ruang CBT. Kumpulkan XP dan lencana!']];
  const m = modal('<h3 class="h3">' + ic('play') + ' Pengantar Singkat Teorema Pythagoras</h3><div class="slides intro-slides" data-interval="4000">' + items.map(i => '<div class="slide intro"><div class="intro-art">' + i[0] + '</div><h4>' + i[1] + '</h4><p>' + i[2] + '</p></div>').join('') + '</div>', { cls: 'wide' });
}

/* ================= MATERI ================= */
function renderBlok(b, tp) {
  if (b.t === 'proof') { const A = b.a * b.a, B = b.b * b.b; return '<div class="card blok reveal"><div class="between"><h3 class="h3">' + ic('triangle') + ' ' + b.judul + '</h3><span class="pill ok">' + b.badge + '</span></div><p class="muted">' + b.teks + '</p><div class="proof-box">' + Art.proof(b.a, b.b) + '</div><div class="eq-bar">Hubungan Teorema: Luas c² = Luas a² + Luas b² → ' + (A + B) + ' = ' + A + ' + ' + B + ' ✔ (Terbukti Seimbang)</div></div>'; }
  if (b.t === 'rumus') return '<div class="g3 reveal">' + b.items.map(r => '<div class="rumus glow tilt"><small>' + r[0].toUpperCase() + '</small><code>' + r[1] + '</code><p>' + r[2] + '</p></div>').join('') + '</div>';
  if (b.t === 'catatan') return '<div class="note reveal">' + ic('warn') + '<div><b>' + b.judul + '</b><p>' + b.teks + '</p></div></div>';
  if (b.t === 'contoh') return '<div class="card blok reveal"><h3 class="h3">' + ic('edit') + ' ' + b.judul + '</h3><div class="soal-box">' + esc(b.soal) + '</div><div class="g2 steps-2">' + b.langkah.map((l, i) => '<div class="st glow ' + (i === 3 ? 'fin' : '') + '"><b>' + (i + 1) + '</b><div><strong>' + l[0] + '</strong><p>' + l[1] + '</p></div></div>').join('') + '</div></div>';
  if (b.t === 'uji') return '<div class="card blok reveal uji" data-b="' + b.benar + '"><h3 class="h3">' + ic('target') + ' Uji Cepat Konsep Mandiri</h3><p>' + b.q + '</p><div class="chips">' + b.opsi.map((o, i) => '<button class="chip-btn" data-i="' + i + '">' + o + '</button>').join('') + '</div><div class="qfb" data-bahas="' + esc(b.bahas) + '"></div></div>';
  if (b.t === 'kasus') { const poly = { siku: '14,76 100,76 14,10', lancip: '10,76 106,76 64,10', tumpul: '34,76 112,76 4,26' };
    return '<div class="card blok reveal"><h3 class="h3">' + b.judul + '</h3><p class="muted">' + b.teks + '</p><div class="g3">' + b.items.map(k => '<div class="kasus glow tilt"><svg viewBox="0 0 120 90"><polygon points="' + poly[k[3]] + '" fill="#EFEAFC" stroke="#5B3FD9" stroke-width="3" stroke-linejoin="round"/></svg><b>' + k[0] + '</b><code>' + k[1] + '</code><small>' + k[2] + '</small></div>').join('') + '</div></div>'; }
  if (b.t === 'tripel') return '<div class="card blok reveal"><h3 class="h3">' + b.judul + '</h3><div class="tripel-row">' + b.items.map(t => '<div class="tripel glow tilt" title="' + t[0] + '² + ' + t[1] + '² = ' + t[2] + '²"><b>(' + t.join(', ') + ')</b><small>' + t[0] * t[0] + ' + ' + t[1] * t[1] + ' = ' + t[2] * t[2] + '</small></div>').join('') + '</div></div>';
  if (b.t === 'istimewa') return '<div class="g2 reveal">' + b.items.map(i => '<div class="card blok glow">' + '<svg viewBox="0 0 160 110" class="mini-tri">' + (i.jenis === 45 ? '<polygon points="20,95 100,95 20,15" fill="#8C6DFF" fill-opacity=".18" stroke="#5B3FD9" stroke-width="3"/><text x="60" y="108" class="ts" text-anchor="middle">1</text><text x="10" y="58" class="ts" text-anchor="end">1</text><text x="66" y="48" class="ts">√2</text>' : '<polygon points="20,95 120,95 120,22" fill="#1FC98B" fill-opacity=".18" stroke="#0E9E69" stroke-width="3"/><text x="70" y="108" class="ts" text-anchor="middle">1</text><text x="128" y="62" class="ts">√3</text><text x="58" y="48" class="ts" text-anchor="end">2</text>') + '</svg><h3 class="h3">' + i.nama + '</h3><code class="rasio">' + i.rasio + '</code><p class="muted">' + i.ket + '</p></div>').join('') + '</div>';
  if (b.t === 'strategi') return '<div class="card blok reveal"><h3 class="h3">' + ic('sparkles') + ' ' + b.judul + '</h3><div class="g4">' + b.items.map((s, i) => '<div class="strat glow tilt"><b>' + (i + 1) + '</b><strong>' + s[0] + '</strong><p>' + s[1] + '</p></div>').join('') + '</div></div>';
  return '';
}
Pages.materi = async function (view) {
  const d = await Data.boot(); let tp = S.tp && MATERI[S.tp] ? S.tp : 'TP2';
  const tabs = Object.keys(MATERI);
  view.innerHTML = guestBanner() + head('Kurikulum Merdeka • Kelas VIII Fase D • Geometri & Pengukuran', 'Materi & Rangkuman Konsep Teorema Pythagoras', 'Pelajari materi esensial TP 2 sampai TP 6 secara terbuka, amati pembuktian geometris interaktif, dan kuasai rangkuman rumus sebelum melangkah ke asesmen Ruang CBT.', '<span class="pill ok">' + ic('lock') + ' Akses Bebas & Terbuka</span><button class="btn btn-ghost" onclick="window.print()">' + ic('download') + ' Cetak / Unduh PDF</button>') +
    '<div class="tabs scroll reveal" id="mt">' + tabs.map(t => '<button class="tab ' + (t === tp ? 'on' : '') + '" data-t="' + t + '">' + MATERI[t].tab + '</button>').join('') + '</div><div class="g-side"><div id="mb" class="stack"></div><aside class="stack"><div class="card reveal"><div class="between"><h4 class="h4">Target Pemahaman (TP)</h4><span class="chip">' + (S.guest ? '–' : TPS.filter(t => d.simulasi.includes(t.id) || (d.penguasaanTP[t.id] || 0) >= 72).length + '/5 Tuntas') + '</span></div><div id="tl" class="tl"></div></div>' +
    '<div class="card reveal"><h4 class="h4">' + ic('book') + ' Kartu Rumus Kunci</h4>' + KARTU_RUMUS.map((k, i) => '<div class="kr glow"><small>' + (i + 1) + '. ' + k[0] + '</small><pre>' + esc(k[1]) + '</pre>' + (k[2] ? '<em>' + k[2] + '</em>' : '') + '</div>').join('') + '</div>' +
    '<div class="card cta-card glow reveal">' + ic('sparkles') + '<h4>Siap Uji Pemahaman?</h4><p>Eksplorasi visual dinamis atau coba asesmen untuk klaim XP dan lencana baru!</p><a class="btn btn-white w100 cta" href="#cbt">Masuk ke Ruang CBT ' + ic('arrow') + '</a><a class="btn btn-glass w100" href="#simulasi">' + ic('flask') + ' Buka Simulasi Lab</a></div></aside></div>';
  function draw() {
    const m = MATERI[tp], no = +tp.slice(2);
    $('#mb', view).innerHTML = '<div class="card tujuan reveal"><span class="ico-b p">' + ic('compass') + '</span><div><small>TUJUAN PEMBELAJARAN (' + tp.replace('TP', 'TP ') + ') • FASE D GEOMETRI</small><p>' + m.tujuan + '</p></div></div>' + m.blok.map(b => renderBlok(b, tp)).join('');
    $('#tl', view).innerHTML = TPS.map(t => { const ok = d.simulasi.includes(t.id) || (d.penguasaanTP[t.id] || 0) >= 72; return '<button class="tl-i ' + (t.id === tp ? 'act' : ok ? 'ok' : '') + '" data-t="' + t.id + '">' + ic(ok ? 'check' : t.id === tp ? 'target' : 'book') + '<div><b>TP ' + t.no + ': ' + t.judul.split(' ').slice(0, 3).join(' ') + '</b><small>' + t.ringkas.slice(0, 48) + '…</small></div><em>' + (t.id === tp ? 'Aktif' : ok && !S.guest ? 'Dipahami' : '') + '</em></button>'; }).join('');
    $$('#mt .tab', view).forEach(x => x.classList.toggle('on', x.dataset.t === tp));
    FX.scan(view);
  }
  view.addEventListener('click', e => {
    const t = e.target.closest('[data-t]'); if (t && MATERI[t.dataset.t]) { tp = t.dataset.t; S.tp = tp; draw(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const c = e.target.closest('.uji .chip-btn'); if (c) {
      const box = c.closest('.uji'), ok = +c.dataset.i === +box.dataset.b, f = $('.qfb', box);
      c.classList.add(ok ? 'right' : 'wrong'); f.innerHTML = ok ? '<span class="pill ok">' + ic('check') + ' Benar!</span> ' + f.dataset.bahas : '<span class="pill warn">Belum tepat</span> Coba lagi.'; if (ok) FX.burst(e.clientX, e.clientY);
    }
  });
  draw();
};

/* ================= SIMULASI ================= */
Pages.simulasi = async function (view) {
  const d = await Data.boot(); const ids = Object.keys(SIM.MOD); let cur = ids.find(i => !d.simulasi.includes(i)) || 'TP2', st = null;
  view.innerHTML = guestBanner() + head('Fase D • Kelas VIII Matematika', 'Laboratorium Simulasi Interaktif', 'Eksplorasi visual konsep Pythagoras, uji kebalikan jenis segitiga, temukan tripel, dan selidiki segitiga istimewa dengan manipulasi dinamis.', '<span class="pill amber">' + ic('bolt') + ' +10 XP per Simulasi Tuntas</span><div class="ring-box">' + ring(S.guest ? 0 : d.simulasi.length / 4 * 100, 64, '#5B3FD9') + '<div><small>Kemajuan Lab Modul</small><b>Total Selesai: ' + (S.guest ? 0 : d.simulasi.length) + ' / 4 Modul</b></div></div>') +
    '<div class="g4 mods" id="mods"></div><div id="ws" class="reveal"></div><div class="card claim reveal" id="claim"></div>';
  function cards() {
    $('#mods', view).innerHTML = ids.map(id => { const m = SIM.MOD[id], done = d.simulasi.includes(id); return '<button class="card mod glow tilt click ' + (id === cur ? 'active' : '') + '" data-id="' + id + '"><div class="between"><span class="pill ' + (done ? 'ok' : id === cur ? 'info' : 'mute') + '">' + (done ? ic('check') + ' Selesai' : id === cur ? ic('play') + ' Sedang Aktif' : 'Belum Dicoba') + '</span><span class="xp">' + ic('bolt') + ' +10 XP</span></div><small>' + m.tag + '</small><h4>' + m.judul + '</h4></button>'; }).join('');
  }
  function mount() { const ws = $('#ws', view); st = SIM.mount(cur, ws); ws.addEventListener('simstate', upd); FX.scan(view); upd(); }
  function upd() {
    const ready = st && st.solved && st.touched >= 3, done = d.simulasi.includes(cur);
    $('#claim', view).innerHTML = '<div class="claim-t">' + ic(ready || done ? 'check' : 'info') + '<div><b>' + (done ? 'Simulasi ini sudah kamu selesaikan.' : ready ? 'Siap diklaim!' : 'Syarat klaim XP:') + '</b><small>' + (done ? 'XP diberikan satu kali per simulasi.' : (st && st.touched >= 3 ? '✔' : '○') + ' Geser kontrol minimal 3 kali &nbsp; ' + (st && st.solved ? '✔' : '○') + ' Jawab Uji Refleksi Cepat dengan benar') + '</small></div></div><button class="btn btn-ok btn-lg cta" id="claimb" ' + (ready || (S.guest && ready) ? '' : 'disabled') + '>' + ic('bolt') + ' ' + (S.guest ? 'Selesaikan Simulasi' : 'Selesaikan & Klaim +10 XP') + '</button>';
    $('#claimb', view).onclick = async e => {
      if (S.guest) { toast('Mode tamu: XP tidak dicatat. Masuk sebagai siswa untuk mengumpulkan XP.', 'warn', 4200); return; }
      const b = e.currentTarget; busy(b, true, 'Menyimpan…');
      try {
        const r = await API.post('sim.selesai', { sim: cur }); if (!d.simulasi.includes(cur)) d.simulasi.push(cur); Data.invalidate();
        if (r.xp) { toast('+' + r.xp + ' XP! Simulasi ' + cur.replace('TP', 'TP ') + ' selesai.'); FX.confetti(innerWidth / 2, innerHeight * .6, 110); }
        (r.lencanaBaru || []).forEach(id => { const bd = BADGE_DEF.find(x => x.id === id); if (bd) setTimeout(() => toast('🏅 Lencana baru: ' + bd.nama, 'ok', 4600), 700); });
        cards(); upd(); App.refreshTop();
      } catch (er) { toast(errMsg(er), 'err'); busy(b, false); }
    };
  }
  $('#mods', view).onclick = e => { const c = e.target.closest('.mod'); if (!c || c.dataset.id === cur) return; cur = c.dataset.id; cards(); mount(); $('#ws', view).scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  cards(); mount();
};

/* ================= PROGRES & LENCANA ================= */
Pages.progres = async function (view) {
  if (S.guest) { view.innerHTML = guestGate('Progres & Lencana'); return; }
  const [d, r] = await Promise.all([Data.boot(true), API.get('cbt.riwayat')]), u = d.user, got = {}; d.lencana.forEach(l => got[l.id] = l.tanggal);
  const pct = Math.round((u.xp - u.xpDari) / (u.xpKe - u.xpDari) * 1000) / 10;
  const kes = Object.keys(r.tren).sort(), warna = ['#5B3FD9', '#1FC98B', '#FF9F43'], tps = ['TP2', 'TP3', 'TP4', 'TP5', 'TP6'];
  view.innerHTML = head(CRUMB, 'Pusat Gamifikasi & Progres Siswa', 'Pantau capaian XP, koleksi lencana geometri, peringkat kelas, dan tukaran poin reward asesmen.', '<a class="btn btn-primary" href="#progres">' + ic('trophy') + ' Progres & Lencana</a><a class="btn btn-ghost" href="#papan">' + ic('chart') + ' Papan Juara & Tukar Poin</a>') +
    '<div class="card prof reveal glow"><div class="prof-id"><div class="av xl">' + inisial(u.nama) + '<em>Lv.' + u.level + '</em></div><div><h2 class="h2">' + esc(u.nama) + ' <span class="pill info">Kelas ' + esc(u.kelas) + '</span></h2><span class="pill ok">Siswa Aktif</span><div class="xpbar"><div class="between tiny"><span>Kemajuan Level ' + u.level + ' → ' + (u.level + 1) + '</span><b>' + fmt(u.xp) + ' / ' + fmt(u.xpKe) + ' XP (' + fmt(pct) + '%)</b></div><div class="bar"><i style="--w:' + pct + '%"></i></div><small class="muted">Capai ' + fmt(u.xpKe - u.xp) + ' XP lagi untuk naik level!</small></div></div></div><div class="g4 mini-stats">' +
    [['Total XP', fmt(u.xp), 'bolt'], ['Lencana', d.lencana.length + ' / ' + BADGE_DEF.length, 'shield'], ['Poin Reward', u.poin.saldo + ' Poin', 'gift'], ['Rata-rata Skor Utama', r.rataUtama == null ? '–' : fmt(r.rataUtama), 'target']].map(s => '<div class="ms glow"><small>' + s[0] + '</small><b>' + s[1] + '</b>' + ic(s[2]) + '</div>').join('') + '</div></div>' +
    '<div class="g-main2"><div class="card reveal"><h2 class="h2">Tren Penguasaan Materi & Percobaan CBT</h2><small class="muted">Persentase benar per Tujuan Pembelajaran (hanya percobaan yang refleksinya sudah diisi)</small><div id="tr" class="chart-box"></div><div class="legend">' + kes.map((k, i) => '<span><i style="background:' + warna[i % 3] + '"></i>Percobaan ' + k + (k === '1' ? ' (Resmi)' : '') + '</span>').join('') + '</div></div>' +
    '<div class="card policy glow reveal">' + '<span class="pill glass">' + ic('lock') + ' Kebijakan Asesmen Guru</span><h3>Aturan Skor Utama Terkunci</h3><p>Percobaan 1 otomatis dikunci sebagai <b>Nilai Resmi Rapor</b>. Percobaan 2 dan seterusnya berfungsi sebagai pengayaan mandiri tanpa mengubah nilai pokok.</p><div class="between pol-f"><div><small>Rata-rata Skor Utama</small><b>' + (r.rataUtama == null ? '–' : fmt(r.rataUtama)) + '</b></div>' + ic('shieldcheck', 'xl') + '</div></div></div>' +
    '<section class="reveal"><h2 class="h2">Koleksi Lencana Geometri PythaQuest</h2><small class="muted">Kartu berputar otomatis — arahkan kursor atau klik untuk detail. Dapatkan lencana lewat simulasi lab dan evaluasi CBT.</small><div class="badges">' + BADGE_DEF.map(b => { const ok = !!got[b.id]; return '<div class="flip auto badge-c ' + (ok ? 'got' : 'lock') + '" data-pop="' + b.id + '"><div class="flip-in"><div class="face front glow"><span class="bico" style="--c:' + b.warna + '">' + ic(ok ? b.ikon : 'lock') + '</span><b>' + b.nama + '</b><small>' + b.tp + '</small><span class="pill ' + (ok ? 'ok' : 'mute') + '">' + (ok ? 'Diperoleh' : 'Terkunci') + '</span></div><div class="face back glow"><b>Cara mendapatkan</b><p>' + b.syarat + '</p><small>' + (ok ? 'Diraih ' + tgl(got[b.id]) : 'Belum diraih') + '</small></div></div></div>'; }).join('') + '</div></section>' +
    '<div class="card reveal"><div class="between"><div><h2 class="h2">Riwayat Percobaan Asesmen CBT</h2><small class="muted">Rincian pengerjaan tes beserta status pembobotan poin reward</small></div></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Paket</th><th>Percobaan</th><th>Tanggal & Waktu</th><th>Durasi</th><th>Status</th><th>Skor</th><th>Penanda</th><th>Poin</th></tr></thead><tbody>' +
    (r.riwayat.length ? r.riwayat.map(h => '<tr><td><b>' + esc(h.judul) + '</b></td><td>Percobaan ' + h.ke + '</td><td>' + tgl(h.selesai, 1) + '</td><td>' + h.durasiMenit + ' mnt</td><td>' + (h.refleksi ? '<span class="pill ' + (h.tuntas ? 'ok' : 'warn') + '">' + (h.tuntas ? 'Tuntas' : 'Belum tuntas') + '</span>' : '<span class="pill warn">Isi refleksi</span>') + '</td><td><b class="sc">' + (h.skor == null ? '–' : fmt(h.skor)) + '</b>/100</td><td>' + (h.utama ? '<span class="pill info">Skor Utama</span>' : '<span class="muted">Latihan Mandiri</span>') + '</td><td>' + (h.refleksi ? (h.utama ? '+' + h.poin + ' Poin' : '0 Poin') : '–') + '</td></tr>').join('') : '<tr><td colspan="8" class="center muted pad">Belum ada percobaan. Mulai dari Ruang CBT!</td></tr>') + '</tbody></table></div></div>';
  lineChart($('#tr', view), { labels: tps.map(t => t.replace('TP', 'TP ')), series: kes.map((k, i) => ({ name: 'Percobaan ' + k, values: tps.map(t => r.tren[k][t] == null ? null : r.tren[k][t]), color: warna[i % 3], area: i === 0 })), min: 0, max: 100, ticks: [0, 50, 72, 100], ref: 72, refLabel: 'KKM 72', unit: '%', h: 240 });
  view.addEventListener('click', e => {
    const c = e.target.closest('.badge-c'); if (!c) return; const b = BADGE_DEF.find(x => x.id === c.dataset.pop), ok = !!got[b.id];
    modal('<div class="pop-badge"><span class="bico xl" style="--c:' + b.warna + '">' + ic(ok ? b.ikon : 'lock') + '</span><h3 class="h3">' + b.nama + '</h3><span class="pill ' + (ok ? 'ok' : 'mute') + '">' + (ok ? 'Diperoleh ' + tgl(got[b.id]) : 'Belum diperoleh') + '</span><p>' + b.syarat + '</p><small class="muted">Terkait ' + b.tp + '</small><a class="btn btn-primary" href="#' + (b.id === 'juara-f1' || b.id === 'arsitek-nyata' ? 'cbt' : 'simulasi') + '" onclick="document.querySelector(\'.modal-x\').click()">' + (ok ? 'Lanjutkan belajar' : 'Raih lencana ini') + ' ' + ic('arrow') + '</a></div>', { cls: 'sm' });
  });
};

/* ================= PAPAN JUARA ================= */
Pages.papan = async function (view) {
  let kelas = S.guest ? 'all' : (S.me.kelas || 'all'), paket = 'all', timer = 0;
  view.innerHTML = guestBanner() + head('SMP Maitreyawira Bintan Center <i>•</i> Matematika Fase D <i>•</i> <b class="acc">Gamifikasi & Apresiasi</b>', 'Papan Juara' + (S.siswa ? ' & Toko Tukar Poin' : ''), 'Peringkat kelas berdasarkan skor utama asesmen' + (S.siswa ? ' dan tukarkan PythaPoints dengan perlengkapan belajar.' : '.'), S.siswa ? '<div class="seg"><button class="on">' + ic('chart') + ' Papan Juara Kelas</button><a class="seg-a" href="#poin">' + ic('gift') + ' Toko Tukar Poin</a></div>' : '') +
    '<div class="card filter reveal"><div class="row gap wrap"><label class="tiny muted">Filter Peringkat:</label>' + (S.siswa ? '<span class="chip">Kelas ' + esc(kelas) + '</span>' : '') + '<select id="fp" class="inp sm"><option value="all">Semua Asesmen</option><option value="F1">Formatif 1</option><option value="F2">Formatif 2</option><option value="SUM">Sumatif</option></select></div><span class="pill ok sync">' + ic('refresh') + ' Sinkronisasi otomatis · setiap 30 detik</span></div><div id="pod" class="podium"></div><div class="card reveal" id="ptab"></div>';
  async function load(first) {
    try {
      let rows, at;
      if (S.guest) { if (!API.ready()) { rows = []; } else { const r = await API.get('papan.publik'); rows = r.rows; at = r.at; } }
      else { const r = await API.get('papan.get', { kelas, paket }); rows = r.rows; at = r.at; }
      draw(rows, at);
    } catch (e) { if (first) $('#pod', view).innerHTML = '<div class="card empty">' + esc(errMsg(e)) + '</div>'; }
  }
  function draw(rows, at) {
    const me = S.siswa ? S.me.id : null, top = rows.slice(0, 3), order = [top[1], top[0], top[2]].map((r, i) => r ? { r, pos: [2, 1, 3][i] } : null);
    $('#pod', view).innerHTML = rows.length ? order.map(o => o ? '<div class="pod p' + o.pos + ' glow tilt ' + (o.r.id === me ? 'me' : '') + '"><div class="pod-card"><span class="pill ' + (o.pos === 1 ? 'amber' : 'mute') + '">' + (o.r.id === me ? 'Profil Kamu (#' + o.pos + ')' : 'Peringkat ' + o.pos + (o.pos === 1 ? ' Tertinggi' : '')) + '</span><div class="av xl">' + inisial(o.r.nama) + '<em>' + o.pos + '</em></div><b>' + esc(o.r.nama) + '</b><small>' + esc(o.r.kelas) + '</small><div class="pod-s"><div><strong data-count="' + o.r.skor + '" data-dec="1">0</strong><small>Skor Utama</small></div>' + (o.r.xp != null ? '<div><strong>' + fmt(o.r.xp) + '</strong><small>Total XP</small></div>' : '') + '</div></div><div class="pod-base">' + o.pos + '<small>' + ['EMAS', 'PERAK', 'PERUNGGU'][o.pos - 1] + ' KELAS</small></div></div>' : '<div class="pod none"></div>').join('') : '<div class="card empty reveal">' + ic('trophy', 'xl') + '<h3 class="h3">Papan juara belum terisi</h3><p class="muted">Papan muncul sejak ada siswa yang menuntaskan Formatif 1 dan mengisi refleksi.</p></div>';
    $('#ptab', view).innerHTML = '<div class="between"><div><h2 class="h2">Tabel Lengkap Peringkat Siswa</h2><small class="muted">Data asesmen CBT murni percobaan pertama (Skor Utama resmi tanpa remedial). ' + (at ? 'Diperbarui ' + new Date(at).toLocaleTimeString('id-ID') : '') + '</small></div><button class="btn btn-ghost btn-sm" onclick="window.print()">' + ic('download') + ' Unduh Rekap PDF</button></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Peringkat</th><th>Nama Siswa</th><th>Kelas</th><th>Skor Utama</th>' + (S.guest ? '' : '<th>Total XP</th>') + '<th>Lencana</th><th>Status</th></tr></thead><tbody>' + (rows.length ? rows.map(r => '<tr class="' + (r.id === me ? 'me' : '') + '"><td><span class="rk r' + r.rank + '">' + r.rank + '</span>' + (r.id === me ? ' <span class="pill info">KAMU</span>' : '') + '</td><td><div class="av">' + inisial(r.nama) + '</div> <b>' + esc(r.nama) + '</b></td><td>' + esc(r.kelas) + '</td><td><b class="sc">' + fmt(r.skor) + '</b></td>' + (S.guest ? '' : '<td>' + fmt(r.xp) + ' XP</td>') + '<td>' + (r.lencana || 0) + ' 🏅</td><td>' + (r.status ? '<span class="pill ' + (r.status === 'remedial' ? 'warn' : 'ok') + '">' + { sangat_baik: 'Tuntas Sangat Baik', tuntas: 'Tuntas', remedial: 'Remedial' }[r.status] + '</span>' : '–') + '</td></tr>').join('') : '<tr><td colspan="7" class="center muted pad">Belum ada data.</td></tr>') + '</tbody></table></div><div class="note info">' + ic('shieldcheck') + '<div><b>Kebijakan Pemeringkatan & Transparansi PythaQuest</b><p>Papan juara diperbarui tiap 30 detik berdasarkan Skor Utama (Percobaan 1) resmi siswa di Ruang CBT. Nilai remedial/pengayaan tetap dicatat di portofolio nilai guru tanpa mengubah peringkat orisinal.</p></div></div>';
    FX.scan(view);
  }
  $('#fp', view).onchange = e => { paket = e.target.value; load(); };
  await load(true);
  timer = setInterval(() => { if (!view.isConnected) { clearInterval(timer); return; } if (Activity.due('papan', 30000, 90000)) load(); }, 5000);
};

/* ================= TUKAR POIN ================= */
const imgsOf = h => h.gambar && h.gambar.length ? h.gambar : Art.productSet(h.kategori);
const kodeQR = kode => { let s = 0; for (const c of kode) s = (s * 31 + c.charCodeAt(0)) >>> 0; let out = '', n = 21; const eye = (x, y) => '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="none" stroke="#1e1b39" stroke-width="1"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#1e1b39"/>'; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue; s = (s * 1664525 + 1013904223) >>> 0; if (s % 100 < 48) out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#1e1b39"/>'; } return '<svg viewBox="0 0 21 21" class="qr">' + eye(0, 0) + eye(14, 0) + eye(0, 14) + out + '</svg>'; };
Pages.poin = async function (view) {
  if (!S.siswa) { view.innerHTML = guestGate('Toko Tukar Poin'); return; }
  const [kat, me] = await Promise.all([API.get('poin.katalog'), API.get('poin.saya')]); let saldo = me.saldo;
  view.innerHTML = head('SMP Maitreyawira Bintan Center <i>•</i> Matematika Fase D <i>•</i> <b class="acc">Gamifikasi & Apresiasi</b>', 'Toko Tukar Poin (PythaPoints Store)', 'Tukarkan poin reward hasil skor utama dengan perlengkapan geometri berkualitas atau voucher kantin sehat Maitreya.', '<div class="seg"><a class="seg-a" href="#papan">' + ic('chart') + ' Papan Juara Kelas</a><button class="on">' + ic('gift') + ' Toko Tukar Poin</button></div>') +
    '<div class="g-main2"><div class="card wallet glow reveal"><span class="pill glass">' + ic('shield') + ' SALDO POIN REWARD SISWA</span><div class="w-big"><span class="coin">' + ic('star') + '</span><span data-count="' + saldo.saldo + '" id="sal">0</span><em>Poin Reward</em></div><p>Dihitung dari skor utama tiap paket asesmen. Poin yang sedang diajukan ikut mengurangi saldo sampai guru memvalidasi.</p><div class="g3 w-f"><div><small>Total Didapat</small><b>' + saldo.didapat + '</b></div><div><small>Sedang Diajukan/Disetujui</small><b>' + saldo.terpakai + '</b></div><div><small>Saldo Tersedia</small><b>' + saldo.saldo + '</b></div></div></div>' +
    '<div class="card reveal"><h4 class="h4">Tangga Konversi Skor CBT</h4><p class="muted tiny">Poin dihitung dari <b>skor utama</b> tiap paket.</p>' + TIER_POIN.map(t => '<div class="tier"><span>Skor ' + t[0] + '</span><b>' + (t[1] ? '+' + t[1] + ' Poin' : 'Belum dapat poin') + '</b></div>').join('') + '<div class="note info">' + ic('info') + '<div>' + me.konversi.map(k => PAKET_NAMA[k.paket] + ': ' + (k.skor == null ? 'belum' : k.skor + ' → +' + k.poin)).join(' · ') + '</div></div></div></div>' +
    '<section class="reveal"><div class="between"><h2 class="h2">Katalog Hadiah & Apresiasi</h2><small class="muted">Kartu berputar otomatis · arahkan kursor untuk menyala · klik untuk tampilan lengkap</small></div><div class="products" id="prod">' + kat.hadiah.map(h => '<div class="flip auto prod" data-pop="' + h.id + '"><div class="flip-in"><div class="face front glow"><div class="slides ph">' + imgsOf(h).map(s => '<img class="slide" src="' + s + '" alt="' + esc(h.nama) + '" loading="lazy">').join('') + '</div><div class="pbody"><b>' + esc(h.nama) + '</b><div class="between"><span class="chip amber">' + ic('star') + ' ' + h.biaya + ' Poin</span><small class="muted">Stok ' + h.stok + '</small></div></div></div><div class="face back glow"><span class="pill info">' + esc(h.kategori) + '</span><b>' + esc(h.nama) + '</b><p>' + esc(h.deskripsi) + '</p><div class="between"><span class="chip amber">' + h.biaya + ' Poin</span><button class="btn btn-primary btn-sm cta" data-redeem="' + h.id + '" ' + (h.stok < 1 || saldo.saldo < h.biaya ? 'disabled' : '') + '>' + (h.stok < 1 ? 'Stok habis' : saldo.saldo < h.biaya ? 'Poin kurang' : 'Tukarkan Hadiah') + '</button></div></div></div></div>').join('') + '</div></section>' +
    '<div class="card reveal"><h2 class="h2">Status Pengajuan Penukaran Terakhir</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kode</th><th>Tanggal</th><th>Barang</th><th>Biaya</th><th>Status</th><th>Catatan</th></tr></thead><tbody>' + (me.tiket.length ? me.tiket.map(t => '<tr><td><b>' + esc(t.kode) + '</b></td><td>' + tgl(t.diajukan, 1) + '</td><td>' + esc(t.hadiah) + '</td><td>' + t.biaya + ' Poin</td><td><span class="pill ' + ({ Menunggu: 'warn', Disetujui: 'ok', Ditolak: 'err' }[t.status]) + '">' + t.status + '</span></td><td>' + esc(t.catatan || '–') + '</td></tr>').join('') : '<tr><td colspan="6" class="center muted pad">Belum ada pengajuan.</td></tr>') + '</tbody></table></div></div>';
  const byId = {}; kat.hadiah.forEach(h => byId[h.id] = h);
  view.addEventListener('click', e => {
    const rb = e.target.closest('[data-redeem]'); if (rb) { e.stopPropagation(); redeem(byId[rb.dataset.redeem]); return; }
    const c = e.target.closest('.prod'); if (c) detail(byId[c.dataset.pop]);
  });
  function detail(h) {
    const m = modal('<div class="pdetail"><div class="slides big-s" data-interval="3200">' + imgsOf(h).map(s => '<img class="slide" src="' + s + '" alt="' + esc(h.nama) + '">').join('') + '</div><div><span class="pill info">' + esc(h.kategori) + '</span><h3 class="h3">' + esc(h.nama) + '</h3><p>' + esc(h.deskripsi) + '</p><div class="g3"><div class="ms"><small>Biaya</small><b>' + h.biaya + ' Poin</b></div><div class="ms"><small>Stok</small><b>' + h.stok + '</b></div><div class="ms"><small>Saldomu</small><b>' + saldo.saldo + '</b></div></div><button class="btn btn-primary btn-lg cta w100" id="pd-b" ' + (h.stok < 1 || saldo.saldo < h.biaya ? 'disabled' : '') + '>' + ic('gift') + ' ' + (h.stok < 1 ? 'Stok habis' : saldo.saldo < h.biaya ? 'Poin belum cukup' : 'Tukarkan Sekarang') + '</button></div></div>', { cls: 'wide' });
    $('#pd-b', m.root).onclick = () => { m.close(); redeem(h); };
  }
  function redeem(h) {
    const m = modal('<div class="between"><span class="ico-b p">' + ic('gift') + '</span><div><h3 class="h3">Konfirmasi Penukaran Poin Reward</h3><small class="muted">Kamu akan menukarkan poin reward asesmenmu untuk hadiah pilihan berikut:</small></div></div><div class="cf"><div class="between"><span class="pill info">' + esc(h.kategori) + '</span><small>Stok: ' + h.stok + ' tersedia</small></div><b>' + esc(h.nama) + '</b><div class="g2"><div class="ms"><small>Biaya Penukaran:</small><b class="neg">− ' + h.biaya + ' Poin Reward</b><small>Dari total saldo ' + saldo.saldo + ' poin</small></div><div class="ms"><small>Sisa Saldo Setelahnya:</small><b class="pos">' + (saldo.saldo - h.biaya) + ' Poin Reward</b><small>Saldo mencukupi ✓</small></div></div><p class="tiny">' + ic('info') + ' <b>Lokasi pengambilan:</b> Ruang Guru Matematika setelah divalidasi sistem.</p></div><div class="note warn">' + ic('warn') + '<div><b>Peringatan Kebijakan:</b> Penukaran yang diajukan masuk antrean validasi guru. Poin yang telah dipotong dapat dibatalkan jika status tiket ditolak.</div></div><div class="row end gap"><button class="btn btn-ghost" data-n>Batal</button><button class="btn btn-primary cta" data-y>Ya, Ajukan Penukaran Sekarang (' + h.biaya + ' Poin) ' + ic('arrow') + '</button></div>', { cls: 'md' });
    $('[data-n]', m.root).onclick = () => m.close();
    $('[data-y]', m.root).onclick = async e => {
      const b = e.currentTarget; busy(b, true, 'Mengirim…');
      try { const t = await API.post('poin.ajukan', { hadiahId: h.id }); m.close(); Data.invalidate(); ticket(t); } catch (er) { toast(errMsg(er), 'err'); busy(b, false); }
    };
  }
  function ticket(t) {
    const m = modal('<div class="ok-ring">' + ic('check') + '</div><div class="center"><span class="pill ok">PENGAJUAN BERHASIL DIPROSES</span><h3 class="h3">Pengajuan Penukaran Berhasil Terkirim!</h3><p class="muted">Tiket penukaran telah masuk ke antrean validasi guru pengawas di Dashboard Guru.</p></div><div class="tiket"><div class="between"><b class="tiny">' + ic('gift') + ' TIKET DIGITAL ANTREAN KLAIM</b><span class="pill warn">Menunggu Validasi</span></div><div class="tk-main"><div><small>KODE TIKET PENUKARAN</small><div class="kode">#' + esc(t.kode) + ' <button class="chip-btn" id="cp">Salin Kode</button></div><div class="tk-item"><b>' + esc(t.hadiah) + '</b></div></div><div class="qrbox">' + kodeQR(t.kode) + '<small>Tunjukkan kode ke guru</small></div></div><div class="g4 tk-f"><div><small>Pemohon</small><b>' + esc(S.me.nama) + '</b><small>Kelas ' + esc(S.me.kelas) + '</small></div><div><small>Waktu Pengajuan</small><b>' + tgl(t.diajukan, 1) + '</b></div><div><small>Biaya Penukaran</small><b class="neg">' + t.biaya + ' Poin Reward</b><small>Sisa: ' + t.sisaSaldo + ' Poin</small></div><div><small>Pengawas</small><b>Guru Matematika</b></div></div></div><div class="g3 flow"><div class="fl ok">' + ic('check') + '<div><b>1. Pengajuan Diajukan</b><small>Tercatat di database PythaQuest.</small></div></div><div class="fl warn">' + ic('clock') + '<div><b>2. Antrean Validasi Guru</b><small>Guru memverifikasi kuota item.</small></div></div><div class="fl">' + ic('gift') + '<div><b>3. Pengambilan Fisik</b><small>Ruang Guru Matematika.</small></div></div></div><div class="row end gap"><button class="btn btn-ghost" onclick="window.print()">' + ic('download') + ' Cetak Bukti Tiket</button><button class="btn btn-primary" data-d>' + ic('gift') + ' Selesai & Kembali ke Toko</button></div>', { cls: 'wide ticket-m' });
    $('#cp', m.root).onclick = () => { navigator.clipboard && navigator.clipboard.writeText(t.kode); toast('Kode disalin'); };
    $('[data-d]', m.root).onclick = () => { m.close(); App.go('poin', true); };
    FX.confetti(innerWidth / 2, innerHeight / 3, 120);
  }
};
