/* PythaQuest — shell aplikasi: router berbasis hash, sidebar, bilah atas, pencarian, notifikasi */
'use strict';
const App = (function () {
  let cur = '', shellOn = false, ignore = false;
  const root = () => $('#app');
  const allowed = () => S.guru ? NAV_GURU : S.guest ? NAV_TAMU : NAV_SISWA;
  const home = () => S.guru ? 'g-dashboard' : 'beranda';
  const INDEX = [].concat(
    TPS.map(t => ({ t: 'Materi TP ' + t.no + ': ' + t.judul, k: 'materi rumus ' + t.ringkas, go: 'materi', tp: t.id })),
    Object.keys(SIM.MOD).map(id => ({ t: 'Simulasi ' + SIM.MOD[id].judul, k: 'simulasi lab ' + id, go: 'simulasi' })),
    [{ t: 'Kartu rumus kunci c² = a² + b²', k: 'rumus pythagoras hipotenusa', go: 'materi' }, { t: 'Tripel Pythagoras 3-4-5, 5-12-13', k: 'tripel kelipatan', go: 'materi', tp: 'TP4' }, { t: 'Segitiga istimewa 45° 30° 60°', k: 'rasio sudut istimewa', go: 'materi', tp: 'TP5' }, { t: 'Video segitiga istimewa 45° 30° 60°', k: 'video youtube istimewa diagonal ubin', go: 'materi', tp: 'TP5' }, { t: 'Toko Apresiasi (Tukar Poin Kelas)', k: 'poin kelas apresiasi tukar hadiah', go: 'poin' }, { t: 'Ruang CBT', k: 'ujian asesmen formatif sumatif', go: 'cbt' }, { t: 'Papan Juara', k: 'peringkat ranking', go: 'papan' }]
  );

  function sidebar() {
    const nav = allowed(), b = S.boot && S.boot.d, aktif = b ? b.paket.filter(p => ['terbuka', 'berlangsung', 'refleksi'].includes(p.status)).length : 0;
    return '<div class="side-brand">' + Art.logo(38) + '<div><b>PythaQuest</b><small>SMP Maitreyawira</small></div></div><nav class="nav" aria-label="Menu utama">' + nav.map(n => '<a href="#' + n[0] + '" data-n="' + n[0] + '" class="' + (n[0] === cur ? 'on' : '') + '">' + ic(n[2]) + '<span>' + n[1] + '</span>' + (n[0] === 'cbt' && aktif && S.siswa ? '<em class="bdg">' + aktif + '</em>' : '') + '</a>').join('') + '</nav>' + (S.guest ? '<div class="side-note">' + ic('eye') + '<span>Mode Tamu — tanpa pencatatan</span></div>' : '') + '<div class="side-user"><div class="av">' + inisial(S.me.nama) + '</div><div><b>' + esc(S.me.nama) + '</b><small>' + (S.guru ? 'Guru Pengawas' : S.guest ? 'Pratinjau' : 'Kelas ' + esc(S.me.kelas || '')) + '</small></div><button id="lo" aria-label="Keluar" title="Keluar">' + ic('logout') + '</button></div>';
  }
  function top() {
    const b = S.boot && S.boot.d, u = b && b.user;
    return '<button class="menu-b" id="mb" aria-label="Menu">' + ic('menu') + '</button><div class="search" id="sr">' + ic('search') + '<input id="si" placeholder="Cari materi, rumus, simulasi…" autocomplete="off" aria-label="Cari"><div class="sres" id="sres"></div></div><div class="top-r">' +
      (S.siswa ? '<div class="xp-pill"><span>' + ic('bolt') + '<b id="txp">' + fmt(u ? u.xp : 0) + '</b> XP</span><i></i><span>' + ic('shield') + '<b id="tlc">' + (b ? b.lencana.length : 0) + '</b> Lencana</span></div>' : '') +
      '<button class="ic-b ' + (FX.enabled ? '' : 'off') + '" id="fxb" title="Efek kursor & partikel" aria-pressed="' + FX.enabled + '">' + ic('sparkles') + '</button><div class="bellw"><button class="ic-b" id="bl" aria-label="Notifikasi">' + ic('bell') + (S.siswa && b && (b.tiketMenunggu || b.paket.some(p => p.status === 'refleksi')) ? '<i class="dot-r"></i>' : '') + '</button><div class="pop" id="bpop"></div></div><div class="av top-av">' + inisial(S.me.nama) + '</div></div>';
  }
  function mountShell() {
    document.body.classList.remove('is-login');
    root().innerHTML = '<div class="canvas"><div class="frame"><aside class="side" id="side"></aside><div class="main"><header class="top" id="top"></header><main id="view" class="view" tabindex="-1"></main></div></div></div><div class="side-ov" id="sov"></div>';
    shellOn = true; paintChrome();
    $('#sov').onclick = () => document.body.classList.remove('side-open');
  }
  function paintChrome() {
    $('#side').innerHTML = sidebar(); $('#top').innerHTML = top(); wire();
  }
  function wire() {
    $('#lo').onclick = async () => { if (S.lockNav) return; if (!S.guest && !await confirmBox('Keluar dari PythaQuest?', 'Kamu harus memasukkan PIN lagi untuk masuk kembali.', 'Keluar')) return; S.clear(); shellOn = false; location.hash = '#login'; };
    $('#mb').onclick = () => document.body.classList.toggle('side-open');
    $('#fxb').onclick = e => { FX.setEnabled(!FX.enabled); e.currentTarget.classList.toggle('off', !FX.enabled); e.currentTarget.setAttribute('aria-pressed', FX.enabled); toast(FX.enabled ? 'Efek kursor & partikel aktif ✨' : 'Efek dimatikan — kursor bawaan kembali.', 'ok', 2200); };
    const si = $('#si'), sres = $('#sres');
    si.oninput = () => { const q = si.value.trim().toLowerCase(); if (q.length < 2) { sres.classList.remove('on'); return; } const r = INDEX.filter(x => (x.t + ' ' + x.k).toLowerCase().includes(q)).slice(0, 6); sres.innerHTML = r.length ? r.map((x, i) => '<button data-i="' + INDEX.indexOf(x) + '">' + ic('search') + x.t + '</button>').join('') : '<p class="muted tiny pad">Tidak ditemukan.</p>'; sres.classList.add('on'); };
    sres.onclick = e => { const b = e.target.closest('button'); if (!b) return; const x = INDEX[+b.dataset.i]; if (x.tp) S.tp = x.tp; sres.classList.remove('on'); si.value = ''; go(x.go); };
    document.addEventListener('pointerdown', e => { if (!e.target.closest('#sr')) sres.classList.remove('on'); if (!e.target.closest('.bellw')) $('#bpop') && $('#bpop').classList.remove('on'); });
    $('#bl').onclick = () => {
      const b = S.boot && S.boot.d, bp = $('#bpop'), L = [];
      if (S.guest) L.push(['eye', 'Kamu di Mode Tamu', 'Masuk sebagai siswa untuk mencatat XP, lencana, dan skor.', 'login']);
      else if (S.guru) L.push(['gift', 'Validasi penukaran poin', 'Cek tiket yang menunggu di menu Penukaran Poin.', 'g-poin'], ['users', 'Pantau peserta live', 'Lihat siswa yang sedang mengerjakan di Dashboard.', 'g-dashboard']);
      else if (b) { b.paket.filter(p => p.status === 'refleksi').forEach(p => L.push(['message', 'Refleksi menunggu: ' + p.judul, 'Isi refleksi untuk melihat skor.', 'cbt'])); const n = b.paket.find(p => p.status === 'terbuka' || p.status === 'berlangsung'); if (n) L.push(['clipboard', n.judul + ' ' + (n.status === 'berlangsung' ? 'sedang berjalan' : 'siap dikerjakan'), n.cakupan, 'cbt']); if (b.tiketMenunggu) L.push(['gift', b.tiketMenunggu + ' tiket menunggu validasi guru', 'Pantau di Toko Tukar Poin.', 'poin']); }
      bp.innerHTML = '<b class="pop-t">Notifikasi</b>' + (L.length ? L.map(l => '<a href="#' + l[3] + '">' + ic(l[0]) + '<div><b>' + esc(l[1]) + '</b><small>' + esc(l[2]) + '</small></div></a>').join('') : '<p class="muted tiny pad">Tidak ada notifikasi baru.</p>'); bp.classList.toggle('on');
    };
  }
  async function render(name, force) {
    cur = name; $$('#side .nav a').forEach(a => a.classList.toggle('on', a.dataset.n === name));
    document.body.classList.remove('side-open');
    const old = $('#view'), v = document.createElement('main'); v.id = 'view'; v.className = 'view'; v.tabIndex = -1; old.replaceWith(v);
    v.innerHTML = '<div class="skel"><i></i><i></i><i></i></div>';
    const fn = Pages[name];
    try {
      if (S.siswa && !S.boot) { try { await Data.boot(); paintChrome(); } catch (e) {} }
      await fn(v); FX.scan(v);
      document.title = 'PythaQuest · ' + ((allowed().find(n => n[0] === name) || [0, 'Beranda'])[1]);
    } catch (e) {
      if (e && e.code === 'SESI') return;
      v.innerHTML = '<div class="card empty">' + ic('warn', 'xl') + '<h3 class="h3">Gagal memuat halaman</h3><p class="muted">' + esc(errMsg(e)) + '</p><button class="btn btn-primary" id="rt">Coba lagi</button></div>'; $('#rt', v).onclick = () => render(name, true); console.error(e);
    }
    if (!force) scrollTo({ top: 0 });
  }
  async function route() {
    if (ignore) { ignore = false; return; }
    let name = location.hash.replace('#', '').split('?')[0] || '';
    if (S.lockNav && name !== cur && cur) { if (!confirm(S.lockNav)) { ignore = true; location.hash = '#' + cur; return; } S.lockNav = null; FX.calm(false); }
    if (!S.role && !S.load()) name = 'login';
    if (name === 'login') { shellOn = false; cur = 'login'; return Pages.login(root()); }
    if (!name || !Pages[name] || !allowed().some(n => n[0] === name)) {
      if (Pages[name] && (S.guest) && ['progres', 'poin'].includes(name)) { /* gate ditampilkan halaman */ } else { location.replace('#' + home()); return; }
    }
    if (!shellOn) mountShell(); else paintChrome();
    return render(name);
  }
  function go(name, force) { if (location.hash === '#' + name) return render(name, force); location.hash = '#' + name; }
  async function refreshTop() { try { await Data.boot(true); paintChrome(); } catch (e) {} }
  function init() {
    FX.init(); Activity.init();
    addEventListener('hashchange', route); route();
    addEventListener('online', () => toast('Kembali online', 'ok', 1800)); addEventListener('offline', () => toast('Kamu sedang offline', 'warn', 3000));
  }
  return { init, go, route, refreshTop };
})();
window.App = App;
document.addEventListener('DOMContentLoaded', App.init);
