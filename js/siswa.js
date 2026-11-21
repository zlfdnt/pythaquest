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

/* ================= BERANDA = LANDING PAGE ================= */
const medalIc = pos => ic('medal');
function podiumHTML(rows, me) {
  if (!rows.length) return '<div class="card empty reveal">' + ic('trophy', 'xl') + '<h3 class="h3">Podium masih kosong — jadilah juara pertama!</h3><p class="muted">Podium terisi otomatis begitu ada siswa yang menuntaskan Formatif 1 dan mengisi refleksi.</p><a class="btn btn-primary" href="#cbt">Mulai Formatif 1 ' + ic('arrow') + '</a></div>';
  const top = rows.slice(0, 3), order = [top[1], top[0], top[2]];
  return '<div class="podium">' + order.map((r, i) => { const pos = [2, 1, 3][i]; if (!r) return '<div class="pod none"></div>';
    return '<div class="pod p' + pos + ' glow tilt reveal ' + (r.id === me ? 'me' : '') + '"><div class="pod-card">' + (pos === 1 ? '<span class="crown">👑</span>' : '') + '<span class="pill ' + (pos === 1 ? 'amber' : 'mute') + '">' + (r.id === me ? 'Profil Kamu (#' + pos + ')' : 'Peringkat ' + pos) + '</span><div class="av xl">' + inisial(r.nama) + '<em>' + pos + '</em></div><b>' + esc(r.nama) + '</b><small>' + esc(r.kelas) + '</small><div class="pod-s"><div><strong data-count="' + r.skor + '" data-dec="1">0</strong><small>Skor Utama</small></div>' + (r.poin != null ? '<div><strong>' + r.poin + '</strong><small>Poin Kelas</small></div>' : '') + (r.xp != null ? '<div><strong>' + fmt(r.xp) + '</strong><small>XP</small></div>' : '') + '</div></div><div class="pod-base">' + pos + '<small>' + ['EMAS', 'PERAK', 'PERUNGGU'][pos - 1] + '</small></div></div>'; }).join('') + '</div>';
}
function klasemenHTML(kl) {
  if (!kl || !kl.length) return '<p class="muted pad center">Klasemen muncul setelah ada poin yang diraih.</p>';
  const mx = Math.max(1, ...kl.map(k => k.poin));
  return kl.map(k => '<div class="kl-r"><span class="rk r' + k.rank + '">' + k.rank + '</span><div class="kl-b"><div class="between"><b>Kelas ' + esc(k.kelas) + '</b><strong>' + k.poin + ' <small>poin</small></strong></div><div class="bar"><i style="--w:' + Math.max(4, k.poin / mx * 100) + '%"></i></div><small class="muted">' + k.siswa + ' siswa · ' + fmt(k.xp) + ' XP</small></div></div>').join('');
}
const KATA_HERO = ['tangga', 'kapal feri', 'jembatan', 'atap rumah', 'ubin keramik', 'layang-layang'];
Pages.beranda = async function (view) {
  const d = await Data.boot(), u = d.user, g = S.guest, prog = MAT_STORE.get();
  const matDone = tp => MAT[tp] ? MAT[tp].sec.filter(s => prog[tp] && prog[tp][s.id]).length : 0;
  const nextPk = d.paket.find(p => ['terbuka', 'berlangsung', 'refleksi'].includes(p.status)), done = d.paket.filter(p => p.skorUtama != null).length;
  const stat = (label, n, icon, tone, suf, sub) => '<div class="lst glow tilt reveal"><span class="ico-b ' + tone + '">' + ic(icon) + '</span><div><small>' + label + '</small><div class="num"><span data-count="' + n + '">0</span>' + (suf ? '<em>' + suf + '</em>' : '') + '</div><small class="muted">' + sub + '</small></div></div>';
  view.innerHTML = guestBanner() + (u.uji ? '<div class="banner reveal">' + ic('flask') + '<div><b>Akun uji coba.</b> Kamu bebas mencoba semua fitur seperti siswa — hasilmu <b>tidak ikut</b> papan juara, rekap, maupun penilaian.</div></div>' : '') +
    '<section class="lh glow reveal" id="lh"><div class="lh-bg"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i>' + ['a²', '√2', 'π', '45°', 'c²', '30°', '√3', '60°'].map((t, i) => '<span class="fm m' + (i + 1) + '">' + t + '</span>').join('') + '</div>' +
    '<div class="lh-l"><span class="pill glass">' + ic('sparkles') + ' ' + (g ? 'Mode Tamu · Pratinjau' : 'Halo, ' + esc(u.nama.split(' ')[0]) + '! 👋 Level ' + u.level) + '</span><h1>Taklukkan <span class="grad">Pythagoras</span> lewat <span class="typed" id="typed">tangga</span><i class="caret"></i></h1><p>Belajar dari dunia nyata Kepulauan Riau, bereksperimen di lab interaktif, lalu buktikan kemampuanmu di ruang CBT. Kumpulkan XP, lencana, dan <b>Poin Kelas</b> untuk ditukar dengan apresiasi istimewa.</p><div class="row gap wrap"><a class="btn btn-white btn-lg cta" href="#' + (nextPk && !g ? 'cbt' : 'materi') + '">' + (nextPk && !g ? 'Lanjut ke ' + esc(nextPk.judul) : 'Mulai Belajar') + ' ' + ic('arrow') + '</a><a class="btn btn-glass btn-lg" href="#simulasi">' + ic('flask') + ' Coba Simulasi</a><button class="btn btn-glass btn-lg" id="intro">' + ic('play') + ' Pengantar 30 Detik</button></div><div class="lh-m"><div><b data-count="5">0</b><small>Target Belajar</small></div><div><b data-count="32">0</b><small>Soal CBT</small></div><div><b id="m-s">–</b><small>Siswa Beraksi</small></div><div><b id="m-a">–</b><small>Asesmen Selesai</small></div></div></div>' +
    '<div class="lh-r"><div class="dev"><div class="dev-bar"><i></i><i></i><i></i><span>pythaquest.app</span></div><div class="slides hero-slides" data-interval="3800">' + heroSlides() + '</div><div class="hero-cap" id="hcap"><i></i><span>' + HERO_CAP[0][0] + '</span><b>' + HERO_CAP[0][1] + '</b></div></div><div class="fch c1">' + ic('bolt') + ' <b>' + (g ? '+10 XP' : fmt(u.xp) + ' XP') + '</b><small>' + (g ? 'tiap simulasi' : 'pengalamanmu') + '</small></div><div class="fch c2">' + ic('shield') + ' <b>' + (g ? '6 lencana' : d.lencana.length + ' lencana') + '</b><small>koleksi</small></div><div class="fch c3"><b>a² + b² = c²</b></div></div></section>' +
    (g ? '' : '<section class="lstats">' + stat('Total Pengalaman', u.xp, 'bolt', 'amber', ' XP', 'Level ' + u.level) + stat('Lencana', d.lencana.length, 'shield', 'purple', ' / ' + BADGE_DEF.length, 'koleksi geometri') + stat('Poin Kelas (saldo)', u.poin.saldo, 'gift', 'mint', ' poin', 'siap ditukar apresiasi') + stat('Asesmen Selesai', done, 'check', 'purple', ' / 3', 'skor utama tercatat') + '</section>') +
    '<div class="marq reveal" aria-hidden="true"><div class="marq-t">' + [1, 2].map(() => ['a² + b² = c²', 'TRIPEL 3-4-5', '45° · 45° · 90°', '30° · 60° · 90°', 'DUNIA NYATA KEPRI', 'CBT BERJENJANG', 'POIN KELAS', 'SIMULASI LAB'].map(t => '<span>' + t + '</span><i>✦</i>').join('')).join('') + '</div></div>' +
    '<section class="land-s"><div class="sec-h reveal"><small>APA YANG BISA KAMU LAKUKAN</small><h2>Satu petualangan, empat arena</h2></div><div class="bento">' +
    '<a class="bt b-materi glow tilt reveal" href="#materi"><div class="bt-t"><small>01 · BELAJAR</small><h3>Materi interaktif dari dunia nyata</h3><p>Tangga, kapal, jembatan, dan ubin menjelaskan teorema — lengkap dengan animasi, kalkulator, dan latihan berumpan balik.</p><span class="go">Mulai belajar ' + ic('arrow') + '</span></div><div class="bt-v">' + Art.real('tangga') + '</div></a>' +
    '<a class="bt b-sim glow tilt reveal" href="#simulasi"><small>02 · EKSPERIMEN</small><h3>Simulasi Lab</h3><svg viewBox="0 0 160 110" class="bt-svg"><polygon fill="rgba(255,255,255,.22)" stroke="#fff" stroke-width="3" stroke-linejoin="round"><animate attributeName="points" dur="4s" repeatCount="indefinite" values="20,92 100,92 20,32;20,92 130,92 20,18;20,92 70,92 20,52;20,92 100,92 20,32"/></polygon></svg><p>Geser, lihat rumus bekerja langsung. +10 XP tiap modul.</p></a>' +
    '<a class="bt b-video glow tilt reveal" href="#materi" data-tp="TP5"><small>NEW · VIDEO</small><h3>Segitiga Istimewa 45° & 30°–60°</h3><p>Diturunkan dari persegi & segitiga sama sisi, plus 2 video penjelas yang diputar di halaman.</p><span class="go">Tonton & pahami ' + ic('play') + '</span></a>' +
    '<a class="bt b-cbt glow tilt reveal" href="#cbt"><small>03 · UJI DIRI</small><h3>CBT Berjenjang</h3><div class="path-mini">' + ['F1', 'F2', 'SUM'].map((k, i) => '<span class="' + (d.paket[i] && d.paket[i].status) + '">' + PAKET_NAMA[k] + '</span>').join('<i>→</i>') + '</div><p>Skor percobaan pertama = nilai resmi. Refleksi dulu, lalu skor & lencana.</p></a>' +
    '<a class="bt b-poin glow tilt reveal" href="#poin"><small>04 · APRESIASI</small><h3>Poin Kelas</h3><div class="tier-mini"><span><b>5</b> skor 95+</span><span><b>4</b> skor 85–94</span><span><b>3</b> skor 72–84</span></div><p>Tukar dengan hak istimewa non-materi di Toko Apresiasi.</p></a></div></section>' +
    '<section class="land-s"><div class="sec-h reveal"><small>JELAJAHI</small><h2>5 Target Pembelajaran</h2><p class="muted">Klik untuk membuka materinya. Kemajuan belajarmu tercatat otomatis.</p></div><div class="tpx">' + TPS.map(t => { const c = matDone(t.id), n = MAT[t.id].sec.length, pm = d.penguasaanTP[t.id]; return '<a class="tpc glow tilt reveal" href="#materi" data-tp="' + t.id + '"><span class="tpc-n">TP ' + t.no + '</span><h4>' + t.judul + '</h4><p>' + t.ringkas + '</p><div class="bar"><i style="--w:' + c / n * 100 + '%"></i></div><div class="between tiny"><span class="muted">Materi ' + c + '/' + n + '</span>' + (pm != null ? '<b class="acc">Skor ' + pm + '%</b>' : '<span class="go-s">Mulai ' + ic('arrow') + '</span>') + '</div></a>'; }).join('') + '</div></section>' +
    '<section class="land-s" id="podsec"><div class="sec-h reveal"><small>PAPAN JUARA</small><h2>🏆 Podium Juara</h2><p class="muted">Peringkat dari skor utama (percobaan pertama) siswa — diperbarui otomatis. Akun uji coba tidak dihitung.</p>' + (g ? '' : '<div class="seg" id="pscope"><button class="on" data-sc="kelas">Kelas ' + esc(u.kelas) + '</button><button data-sc="all">Semua Kelas</button></div>') + '</div><div id="lpod"><div class="skel"><i></i></div></div><div class="g-main"><div class="card reveal"><div class="between"><h3 class="h3">' + ic('chart') + ' Peringkat berikutnya</h3><a class="lnk" href="#papan">Tabel lengkap</a></div><div id="lrank" class="pj"></div></div><div class="card reveal"><h3 class="h3">' + ic('users') + ' Klasemen Poin Kelas</h3><small class="muted">Jumlah Poin Kelas yang diraih seluruh siswa tiap kelas</small><div id="lkls" class="kls"></div></div></div></section>' +
    '<section class="land-s"><div class="sec-h reveal"><small>JALUR ASESMEN</small><h2>Tiga langkah menuju tuntas</h2></div><div class="path-row">' + d.paket.map((p, i) => '<div class="pth glow tilt reveal ' + p.status + '"><span class="pth-n">' + (i + 1) + '</span>' + statusPill(p.status) + '<h4>' + esc(p.judul) + '</h4><p class="muted tiny">' + esc(p.cakupan) + '</p><small class="muted">' + p.jumlahSoal + ' soal · ' + p.durasi + ' menit · KKM ' + p.kkm + '</small>' + (p.skorUtama != null ? '<div class="pth-s"><b>' + fmt(p.skorUtama) + '</b><small>skor utama · +' + p.poin + ' Poin Kelas</small></div>' : '') + '<a class="btn ' + (['terbuka', 'berlangsung', 'refleksi'].includes(p.status) && !g ? 'btn-primary cta' : 'btn-soft') + ' btn-sm w100" href="#cbt">' + (g ? 'Lihat / Coba Demo' : p.status === 'terkunci' ? ic('lock') + ' Terkunci' : p.status === 'berlangsung' ? 'Lanjutkan' : p.status === 'refleksi' ? 'Isi Refleksi' : p.skorUtama != null ? 'Latihan Ulang' : 'Mulai') + '</a></div>').join('<span class="pth-ln"></span>') + '</div></section>' +
    '<section class="apr glow reveal"><div class="apr-l"><small>APRESIASI NON-MATERI</small><h2>Poin Kelas → pengalaman istimewa</h2><p>Raih skor <b>95 ke atas</b> dan dapatkan <b>5 Poin Kelas</b>. Tukarkan poinmu dengan hak dan pengakuan yang berkesan: memilih tempat duduk, jadi asisten guru, surat apresiasi untuk orang tua, hingga sertifikat di Papan Kehormatan.</p><a class="btn btn-white btn-lg cta" href="#' + (g ? 'login' : 'poin') + '">' + (g ? 'Masuk untuk mengumpulkan poin' : 'Lihat Toko Apresiasi') + ' ' + ic('arrow') + '</a></div><div class="apr-r">' + [['kursi', 'Pilih Tempat Duduk'], ['asisten', 'Asisten Guru Sehari'], ['surat', 'Surat Apresiasi']].map((x, i) => '<div class="apr-c" style="--r:' + (i - 1) * 5 + 'deg"><img src="' + Art.product(x[0], i) + '" alt=""><b>' + x[1] + '</b></div>').join('') + '</div></section>' +
    '<section class="cta-band reveal"><h2>Siap jadi juara Pythagoras?</h2><p>Mulai dari satu bagian materi — kemajuanmu tersimpan otomatis.</p><div class="row gap wrap center-r"><a class="btn btn-white btn-lg cta" href="#materi">Buka Materi ' + ic('arrow') + '</a><a class="btn btn-glass btn-lg" href="#simulasi">' + ic('flask') + ' Simulasi Lab</a></div></section>';
  // interaksi
  const lh = $('#lh', view);
  lh.addEventListener('pointermove', e => { const r = lh.getBoundingClientRect(); lh.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); lh.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
  const ty = $('#typed', view); let wi = 0; const tm = setInterval(() => { if (!ty.isConnected) { clearInterval(tm); return; } ty.classList.add('out'); setTimeout(() => { wi = (wi + 1) % KATA_HERO.length; ty.textContent = KATA_HERO[wi]; ty.classList.remove('out'); }, 320); }, 2400);
  $$('[data-tp]', view).forEach(a => a.addEventListener('click', () => { S.tp = a.dataset.tp; }));
  const caps = $('#hcap', view); let ci = 0; const hs = $('.hero-slides', view);
  if (hs) new MutationObserver(() => { const k = $$('.slide', hs).findIndex(s => s.classList.contains('on')); if (k >= 0 && k !== ci) { ci = k; caps.innerHTML = '<i></i><span>' + HERO_CAP[k][0] + '</span><b>' + HERO_CAP[k][1] + '</b>'; } }).observe(hs, { subtree: true, attributes: true, attributeFilter: ['class'] });
  $('#intro', view).onclick = introModal;
  // podium dari data nyata
  let scope = g ? 'all' : 'kelas';
  async function loadPod(first) {
    try {
      let r;
      if (g) { if (!API.ready()) throw new Error('Server belum terhubung — podium tampil setelah GAS_URL diisi.'); r = await API.get('papan.publik'); }
      else r = await API.get('papan.get', { kelas: scope === 'all' ? 'all' : u.kelas, paket: 'all' });
      $('#lpod', view).innerHTML = podiumHTML(r.rows, g ? null : u.id); FX.scan($('#lpod', view));
      $('#lrank', view).innerHTML = r.rows.slice(3, 9).map(x => '<div class="pj-row ' + (x.id === u.id ? 'me' : '') + '"><span class="rk">' + x.rank + '</span><div class="av">' + inisial(x.nama) + '</div><div><b>' + esc(x.nama) + (x.id === u.id ? ' <em>Kamu</em>' : '') + '</b><small>' + esc(x.kelas) + ' · ' + x.lencana + ' lencana</small></div><strong>' + fmt(x.skor) + '</strong></div>').join('') || '<p class="muted tiny pad center">Peringkat 4 dan seterusnya akan tampil di sini.</p>';
      $('#lkls', view).innerHTML = klasemenHTML(r.klasemen);
      if (r.ringkas) { const sEl = $('#m-s', view), aEl = $('#m-a', view); [[sEl, r.ringkas.siswa], [aEl, r.ringkas.asesmen]].forEach(p => { if (p[0] && p[0].dataset.v !== String(p[1])) { p[0].dataset.v = p[1]; p[0].dataset.count = p[1]; delete p[0].dataset.done; FX.scan(p[0].parentNode); } }); }
    } catch (e) { if (first) $('#lpod', view).innerHTML = '<div class="card empty">' + ic('trophy', 'xl') + '<p class="muted">' + esc(errMsg(e)) + '</p></div>'; }
  }
  const sc = $('#pscope', view); if (sc) sc.onclick = e => { const b = e.target.closest('button'); if (!b) return; scope = b.dataset.sc; $$('button', sc).forEach(x => x.classList.toggle('on', x === b)); loadPod(true); };
  loadPod(true);
  const pt = setInterval(() => { if (!view.isConnected) { clearInterval(pt); return; } if (Activity.due('landpod', 30000, 90000)) loadPod(); }, 5000);
};
function introModal() {
  const items = [[Art.proof(3, 4, { s: 22 }), 'Persegi pada setiap sisi', 'Luas persegi pada sisi miring (c²) = luas persegi pada kedua sisi siku-siku: 9 + 16 = 25.'], [Art.real('kapal'), 'Dipakai di kehidupan nyata', 'Menghitung jarak kapal, tinggi tangga, hingga kabel jembatan di Kepulauan Riau.'], [Art.real('ubin'), 'Segitiga istimewa', 'Diagonal ubin = sisi × √2. Segitiga sama sisi dibelah menjadi 30°–60°–90°.'], ['<div class="big-eq">a² + b² = c²</div>', 'Siap bertualang?', 'Jelajahi materi, coba simulasi, lalu uji dirimu di Ruang CBT. Kumpulkan XP, lencana, dan Poin Kelas!']];
  modal('<h3 class="h3">' + ic('play') + ' Pengantar Singkat Teorema Pythagoras</h3><div class="slides intro-slides" data-interval="3800">' + items.map(i => '<div class="slide intro"><div class="intro-art">' + i[0] + '</div><h4>' + i[1] + '</h4><p>' + i[2] + '</p></div>').join('') + '</div>', { cls: 'wide' });
}

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
  view.innerHTML = head(CRUMB, 'Pusat Gamifikasi & Progres Siswa', 'Pantau capaian XP, koleksi lencana geometri, peringkat kelas, dan tukaran Poin Kelas.', '<a class="btn btn-primary" href="#progres">' + ic('trophy') + ' Progres & Lencana</a><a class="btn btn-ghost" href="#papan">' + ic('chart') + ' Papan Juara & Toko Apresiasi</a>') +
    '<div class="card prof reveal glow"><div class="prof-id"><div class="av xl">' + inisial(u.nama) + '<em>Lv.' + u.level + '</em></div><div><h2 class="h2">' + esc(u.nama) + ' <span class="pill info">Kelas ' + esc(u.kelas) + '</span></h2><span class="pill ok">Siswa Aktif</span><div class="xpbar"><div class="between tiny"><span>Kemajuan Level ' + u.level + ' → ' + (u.level + 1) + '</span><b>' + fmt(u.xp) + ' / ' + fmt(u.xpKe) + ' XP (' + fmt(pct) + '%)</b></div><div class="bar"><i style="--w:' + pct + '%"></i></div><small class="muted">Capai ' + fmt(u.xpKe - u.xp) + ' XP lagi untuk naik level!</small></div></div></div><div class="g4 mini-stats">' +
    [['Total XP', fmt(u.xp), 'bolt'], ['Lencana', d.lencana.length + ' / ' + BADGE_DEF.length, 'shield'], ['Poin Kelas (saldo)', u.poin.saldo + ' Poin', 'gift'], ['Rata-rata Skor Utama', r.rataUtama == null ? '–' : fmt(r.rataUtama), 'target']].map(s => '<div class="ms glow"><small>' + s[0] + '</small><b>' + s[1] + '</b>' + ic(s[2]) + '</div>').join('') + '</div></div>' +
    '<div class="g-main2"><div class="card reveal"><h2 class="h2">Tren Penguasaan Materi & Percobaan CBT</h2><small class="muted">Persentase benar per Tujuan Pembelajaran (hanya percobaan yang refleksinya sudah diisi)</small><div id="tr" class="chart-box"></div><div class="legend">' + kes.map((k, i) => '<span><i style="background:' + warna[i % 3] + '"></i>Percobaan ' + k + (k === '1' ? ' (Resmi)' : '') + '</span>').join('') + '</div></div>' +
    '<div class="card policy glow reveal">' + '<span class="pill glass">' + ic('lock') + ' Kebijakan Asesmen Guru</span><h3>Aturan Skor Utama Terkunci</h3><p>Percobaan 1 otomatis dikunci sebagai <b>Nilai Resmi Rapor</b>. Percobaan 2 dan seterusnya berfungsi sebagai pengayaan mandiri tanpa mengubah nilai pokok.</p><div class="between pol-f"><div><small>Rata-rata Skor Utama</small><b>' + (r.rataUtama == null ? '–' : fmt(r.rataUtama)) + '</b></div>' + ic('shieldcheck', 'xl') + '</div></div></div>' +
    '<section class="reveal"><h2 class="h2">Koleksi Lencana Geometri PythaQuest</h2><small class="muted">Kartu berputar otomatis — arahkan kursor atau klik untuk detail. Dapatkan lencana lewat simulasi lab dan evaluasi CBT.</small><div class="badges">' + BADGE_DEF.map(b => { const ok = !!got[b.id]; return '<div class="flip auto badge-c ' + (ok ? 'got' : 'lock') + '" data-pop="' + b.id + '"><div class="flip-in"><div class="face front glow"><span class="bico" style="--c:' + b.warna + '">' + ic(ok ? b.ikon : 'lock') + '</span><b>' + b.nama + '</b><small>' + b.tp + '</small><span class="pill ' + (ok ? 'ok' : 'mute') + '">' + (ok ? 'Diperoleh' : 'Terkunci') + '</span></div><div class="face back glow"><b>Cara mendapatkan</b><p>' + b.syarat + '</p><small>' + (ok ? 'Diraih ' + tgl(got[b.id]) : 'Belum diraih') + '</small></div></div></div>'; }).join('') + '</div></section>' +
    '<div class="card reveal"><div class="between"><div><h2 class="h2">Riwayat Percobaan Asesmen CBT</h2><small class="muted">Rincian pengerjaan tes beserta status pembobotan poin kelas</small></div></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Paket</th><th>Percobaan</th><th>Tanggal & Waktu</th><th>Durasi</th><th>Status</th><th>Skor</th><th>Penanda</th><th>Poin</th></tr></thead><tbody>' +
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
  view.innerHTML = guestBanner() + head('SMP Maitreyawira Bintan Center <i>•</i> Matematika Fase D <i>•</i> <b class="acc">Gamifikasi & Apresiasi</b>', 'Papan Juara' + (S.siswa ? ' & Toko Apresiasi' : ''), 'Peringkat kelas berdasarkan skor utama asesmen' + (S.siswa ? ' dan tukarkan Poin Kelas dengan apresiasi.' : '.'), S.siswa ? '<div class="seg"><button class="on">' + ic('chart') + ' Papan Juara Kelas</button><a class="seg-a" href="#poin">' + ic('gift') + ' Toko Apresiasi</a></div>' : '') +
    '<div class="card filter reveal"><div class="row gap wrap"><label class="tiny muted">Filter Peringkat:</label>' + (S.siswa ? '<span class="chip">Kelas ' + esc(kelas) + '</span>' : '') + '<select id="fp" class="inp sm"><option value="all">Semua Asesmen</option><option value="F1">Formatif 1</option><option value="F2">Formatif 2</option><option value="SUM">Sumatif</option></select></div><span class="pill ok sync">' + ic('refresh') + ' Sinkronisasi otomatis · setiap 30 detik</span></div><div id="pod"></div><div class="card reveal" id="ptab"></div>';
  async function load(first) {
    try {
      let rows, at;
      if (S.guest) { if (!API.ready()) { rows = []; } else { const r = await API.get('papan.publik'); rows = r.rows; at = r.at; } }
      else { const r = await API.get('papan.get', { kelas, paket }); rows = r.rows; at = r.at; }
      draw(rows, at);
    } catch (e) { if (first) $('#pod', view).innerHTML = '<div class="card empty">' + esc(errMsg(e)) + '</div>'; }
  }
  function draw(rows, at) {
    const me = S.siswa ? S.me.id : null;
    $('#pod', view).innerHTML = podiumHTML(rows, me);
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
  if (!S.siswa) { view.innerHTML = guestGate('Toko Apresiasi'); return; }
  const [kat, me] = await Promise.all([API.get('poin.katalog'), API.get('poin.saya')]); let saldo = me.saldo;
  view.innerHTML = head('SMP Maitreyawira Bintan Center <i>•</i> Matematika Fase D <i>•</i> <b class="acc">Gamifikasi & Apresiasi</b>', 'Toko Apresiasi · Tukar Poin Kelas', 'Tukarkan Poin Kelas hasil skor utama dengan apresiasi non-materi: hak istimewa, kesempatan, dan pengakuan yang berkesan.', '<div class="seg"><a class="seg-a" href="#papan">' + ic('chart') + ' Papan Juara Kelas</a><button class="on">' + ic('gift') + ' Toko Apresiasi</button></div>') +
    '<div class="g-main2"><div class="card wallet glow reveal"><span class="pill glass">' + ic('shield') + ' SALDO POIN KELAS</span><div class="w-big"><span class="coin">' + ic('star') + '</span><span data-count="' + saldo.saldo + '" id="sal">0</span><em>Poin Kelas</em></div><p>Dihitung dari skor utama tiap paket asesmen. Poin yang sedang diajukan ikut mengurangi saldo sampai guru memvalidasi.</p><div class="g3 w-f"><div><small>Total Didapat</small><b>' + saldo.didapat + '</b></div><div><small>Sedang Diajukan/Disetujui</small><b>' + saldo.terpakai + '</b></div><div><small>Saldo Tersedia</small><b>' + saldo.saldo + '</b></div></div></div>' +
    '<div class="card reveal"><h4 class="h4">Tangga Konversi Skor CBT</h4><p class="muted tiny">Poin dihitung dari <b>skor utama</b> tiap paket.</p>' + TIER_POIN.map(t => '<div class="tier"><span>Skor ' + t[0] + '</span><b>' + (t[1] ? '+' + t[1] + ' Poin' : 'Belum dapat poin') + '</b></div>').join('') + '<div class="note info">' + ic('info') + '<div>' + me.konversi.map(k => PAKET_NAMA[k.paket] + ': ' + (k.skor == null ? 'belum' : k.skor + ' → +' + k.poin)).join(' · ') + '</div></div></div></div>' +
    '<section class="reveal"><div class="between"><h2 class="h2">Katalog Apresiasi Non-Materi</h2><small class="muted">Kartu berputar otomatis · arahkan kursor untuk menyala · klik untuk tampilan lengkap</small></div><div class="products" id="prod">' + kat.hadiah.map(h => '<div class="flip auto prod" data-pop="' + h.id + '"><div class="flip-in"><div class="face front glow"><div class="slides ph">' + imgsOf(h).map(s => '<img class="slide" src="' + s + '" alt="' + esc(h.nama) + '" loading="lazy">').join('') + '</div><div class="pbody"><b>' + esc(h.nama) + '</b><div class="between"><span class="chip amber">' + ic('star') + ' ' + h.biaya + ' Poin</span><small class="muted">Kuota ' + h.stok + '</small></div></div></div><div class="face back glow"><span class="pill info">' + esc(h.kategori) + '</span><b>' + esc(h.nama) + '</b><p>' + esc(h.deskripsi) + '</p><div class="between"><span class="chip amber">' + h.biaya + ' Poin</span><button class="btn btn-primary btn-sm cta" data-redeem="' + h.id + '" ' + (h.stok < 1 || saldo.saldo < h.biaya ? 'disabled' : '') + '>' + (h.stok < 1 ? 'Kuota habis' : saldo.saldo < h.biaya ? 'Poin kurang' : 'Tukarkan Apresiasi') + '</button></div></div></div></div>').join('') + '</div></section>' +
    '<div class="card reveal"><h2 class="h2">Status Pengajuan Penukaran Terakhir</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kode</th><th>Tanggal</th><th>Barang</th><th>Biaya</th><th>Status</th><th>Catatan</th></tr></thead><tbody>' + (me.tiket.length ? me.tiket.map(t => '<tr><td><b>' + esc(t.kode) + '</b></td><td>' + tgl(t.diajukan, 1) + '</td><td>' + esc(t.hadiah) + '</td><td>' + t.biaya + ' Poin</td><td><span class="pill ' + ({ Menunggu: 'warn', Disetujui: 'ok', Ditolak: 'err' }[t.status]) + '">' + t.status + '</span></td><td>' + esc(t.catatan || '–') + '</td></tr>').join('') : '<tr><td colspan="6" class="center muted pad">Belum ada pengajuan.</td></tr>') + '</tbody></table></div></div>';
  const byId = {}; kat.hadiah.forEach(h => byId[h.id] = h);
  view.addEventListener('click', e => {
    const rb = e.target.closest('[data-redeem]'); if (rb) { e.stopPropagation(); redeem(byId[rb.dataset.redeem]); return; }
    const c = e.target.closest('.prod'); if (c) detail(byId[c.dataset.pop]);
  });
  function detail(h) {
    const m = modal('<div class="pdetail"><div class="slides big-s" data-interval="3200">' + imgsOf(h).map(s => '<img class="slide" src="' + s + '" alt="' + esc(h.nama) + '">').join('') + '</div><div><span class="pill info">' + esc(h.kategori) + '</span><h3 class="h3">' + esc(h.nama) + '</h3><p>' + esc(h.deskripsi) + '</p><div class="g3"><div class="ms"><small>Biaya</small><b>' + h.biaya + ' Poin</b></div><div class="ms"><small>Kuota</small><b>' + h.stok + '</b></div><div class="ms"><small>Saldomu</small><b>' + saldo.saldo + '</b></div></div><button class="btn btn-primary btn-lg cta w100" id="pd-b" ' + (h.stok < 1 || saldo.saldo < h.biaya ? 'disabled' : '') + '>' + ic('gift') + ' ' + (h.stok < 1 ? 'Kuota habis' : saldo.saldo < h.biaya ? 'Poin belum cukup' : 'Tukarkan Sekarang') + '</button></div></div>', { cls: 'wide' });
    $('#pd-b', m.root).onclick = () => { m.close(); redeem(h); };
  }
  function redeem(h) {
    const m = modal('<div class="between"><span class="ico-b p">' + ic('gift') + '</span><div><h3 class="h3">Konfirmasi Penukaran Poin Kelas</h3><small class="muted">Kamu akan menukarkan poin kelas asesmenmu untuk hadiah pilihan berikut:</small></div></div><div class="cf"><div class="between"><span class="pill info">' + esc(h.kategori) + '</span><small>Kuota: ' + h.stok + ' tersisa</small></div><b>' + esc(h.nama) + '</b><div class="g2"><div class="ms"><small>Biaya Penukaran:</small><b class="neg">− ' + h.biaya + ' Poin Kelas</b><small>Dari total saldo ' + saldo.saldo + ' poin</small></div><div class="ms"><small>Sisa Saldo Setelahnya:</small><b class="pos">' + (saldo.saldo - h.biaya) + ' Poin Kelas</b><small>Saldo mencukupi ✓</small></div></div><p class="tiny">' + ic('info') + ' <b>Realisasi:</b> guru menjadwalkan apresiasi ini di kelas setelah tiket divalidasi.</p></div><div class="note warn">' + ic('warn') + '<div><b>Peringatan Kebijakan:</b> Penukaran yang diajukan masuk antrean validasi guru. Poin kembali ke saldo jika tiket ditolak.</div></div><div class="row end gap"><button class="btn btn-ghost" data-n>Batal</button><button class="btn btn-primary cta" data-y>Ya, Ajukan Penukaran Sekarang (' + h.biaya + ' Poin) ' + ic('arrow') + '</button></div>', { cls: 'md' });
    $('[data-n]', m.root).onclick = () => m.close();
    $('[data-y]', m.root).onclick = async e => {
      const b = e.currentTarget; busy(b, true, 'Mengirim…');
      try { const t = await API.post('poin.ajukan', { hadiahId: h.id }); m.close(); Data.invalidate(); ticket(t); } catch (er) { toast(errMsg(er), 'err'); busy(b, false); }
    };
  }
  function ticket(t) {
    const m = modal('<div class="ok-ring">' + ic('check') + '</div><div class="center"><span class="pill ok">PENGAJUAN BERHASIL DIPROSES</span><h3 class="h3">Pengajuan Apresiasi Berhasil Terkirim!</h3><p class="muted">Tiket penukaran telah masuk ke antrean validasi guru pengawas di Dashboard Guru.</p></div><div class="tiket"><div class="between"><b class="tiny">' + ic('gift') + ' TIKET DIGITAL ANTREAN KLAIM</b><span class="pill warn">Menunggu Validasi</span></div><div class="tk-main"><div><small>KODE TIKET PENUKARAN</small><div class="kode">#' + esc(t.kode) + ' <button class="chip-btn" id="cp">Salin Kode</button></div><div class="tk-item"><b>' + esc(t.hadiah) + '</b></div></div><div class="qrbox">' + kodeQR(t.kode) + '<small>Tunjukkan kode ke guru</small></div></div><div class="g4 tk-f"><div><small>Pemohon</small><b>' + esc(S.me.nama) + '</b><small>Kelas ' + esc(S.me.kelas) + '</small></div><div><small>Waktu Pengajuan</small><b>' + tgl(t.diajukan, 1) + '</b></div><div><small>Biaya Penukaran</small><b class="neg">' + t.biaya + ' Poin Kelas</b><small>Sisa: ' + t.sisaSaldo + ' Poin</small></div><div><small>Pengawas</small><b>Guru Matematika</b></div></div></div><div class="g3 flow"><div class="fl ok">' + ic('check') + '<div><b>1. Pengajuan Diajukan</b><small>Tercatat di database PythaQuest.</small></div></div><div class="fl warn">' + ic('clock') + '<div><b>2. Antrean Validasi Guru</b><small>Guru memverifikasi kuota item.</small></div></div><div class="fl">' + ic('gift') + '<div><b>3. Realisasi di Kelas</b><small>Dijadwalkan guru Matematika.</small></div></div></div><div class="row end gap"><button class="btn btn-ghost" onclick="window.print()">' + ic('download') + ' Cetak Bukti Tiket</button><button class="btn btn-primary" data-d>' + ic('gift') + ' Selesai & Kembali ke Toko</button></div>', { cls: 'wide ticket-m' });
    $('#cp', m.root).onclick = () => { navigator.clipboard && navigator.clipboard.writeText(t.kode); toast('Kode disalin'); };
    $('[data-d]', m.root).onclick = () => { m.close(); App.go('poin', true); };
    FX.confetti(innerWidth / 2, innerHeight / 3, 120);
  }
};
