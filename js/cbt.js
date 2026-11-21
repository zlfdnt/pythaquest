/* PythaQuest — Ruang CBT: daftar paket berjenjang, ruang ujian split-screen, auto-save, deteksi keamanan sesi,
   refleksi wajib → skor & lencana → pembahasan adaptif. Mode tamu memakai soal demo lokal (tanpa pencatatan). */
'use strict';
const CBT = (function () {
  const TIPE_INFO = { PG: 'Pilihan Ganda · pilih satu jawaban', PGK: 'Pilihan Ganda Kompleks · boleh lebih dari satu', BS: 'Benar / Salah · tentukan tiap pernyataan', COCOK: 'Mencocokkan · pilih pasangan untuk tiap butir' };
  const JENIS_LOG = { pindah_tab: 'pindah tab/jendela', keluar_layar: 'keluar dari jendela ujian', salin_teks: 'menyalin teks', klik_kanan: 'klik kanan', printscreen: 'tombol PrintScreen' };
  const answered = (q, v) => v != null && (q.tipe === 'PG' ? true : Array.isArray(v) && (q.tipe === 'PGK' ? v.length > 0 : v.some(x => x !== null && x !== undefined)));

  /* ---------- penilai lokal (hanya mode tamu) ---------- */
  function gradeDemo(ans) {
    let got = 0, max = 0; const tp = {};
    const items = DEMO.soal.map((q, i) => {
      const k = DEMO.kunci[q.id], v = ans[q.id]; let f = 0, full = false;
      if (v != null) {
        if (q.tipe === 'PG') { full = v === k[0]; f = full ? 1 : 0; }
        else if (q.tipe === 'PGK') { const hit = v.filter(x => k.includes(x)).length, bad = v.length - hit; f = Math.max(0, (hit - bad) / k.length); full = hit === k.length && !bad; }
        else { const b = k.filter((x, j) => v[j] === x).length; f = b / k.length; full = b === k.length; }
      }
      got += f * q.bobot; max += q.bobot; tp[q.tp] = tp[q.tp] || { g: 0, m: 0 }; tp[q.tp].g += f * q.bobot; tp[q.tp].m += q.bobot;
      return Object.assign({}, q, { jawabanSiswa: v == null ? null : v, kunciTampil: k, benar: full, sebagian: !full && f > 0, pembahasan: DEMO.bahas[q.id] });
    });
    const tpPersen = {}; Object.keys(tp).forEach(k => tpPersen[k] = Math.round(tp[k].g / tp[k].m * 100));
    const skor = Math.round(got / max * 100);
    return { demo: true, judul: DEMO.judul, ke: 1, skor, kkm: 72, tuntas: skor >= 72, utama: false, xp: 0, poin: 0, lencanaBaru: [], tpPersen, items, durasiMenit: 1 };
  }

  /* ---------- pelacak ruang ujian ---------- */
  function room(view, cfg) {
    return new Promise(resolve => {
      const q = cfg.soal, N = q.length; let idx = Math.min(cfg.posisi || 0, N - 1), fs = 1, viol = 0, dirty = false, saveT = 0, lastSave = 'ok', closed = false;
      let ans = cfg.jawaban || {}, ragu = new Set(cfg.ragu || []), deadline = Date.now() + cfg.sisaDetik * 1000, warned = {};
      const lk = 'pq_att_' + cfg.attemptId;
      if (!cfg.demo) { try { const l = JSON.parse(localStorage.getItem(lk) || 'null'); if (l && l.a) { Object.keys(l.a).forEach(k => { if (l.a[k] != null) ans[k] = l.a[k]; }); (l.r || []).forEach(x => ragu.add(x)); } } catch (e) {} }
      FX.calm(true); S.lockNav = cfg.demo ? null : 'Ujian sedang berlangsung. Waktu tetap berjalan jika kamu keluar. Tetap keluar?';
      view.innerHTML = '<div class="room fs1" id="room"><div class="card room-head"><div class="rh-t"><span class="ico-b p">' + ic('clipboard') + '</span><div><div class="row gap tiny"><span class="pill info">' + (cfg.demo ? 'DEMO' : 'CBT RESMI') + '</span><span class="muted">• Modul Geometri Kelas VIII</span></div><h2 class="h3">' + esc(cfg.judul) + '</h2></div></div><div class="rh-r"><span class="pill ok" id="sv">' + ic('save') + ' <span>Tersimpan otomatis</span></span><div class="fsz" role="group" aria-label="Ukuran huruf"><button data-f="-1">A-</button><b>A</b><button data-f="1">A+</button></div><div class="timer" id="tm">' + ic('clock') + '<div><small>Sisa Waktu</small><b id="tmv">--:--:--</b></div></div><div class="who"><div class="av">' + inisial(S.me.nama) + '</div><div><b>' + esc(S.me.nama) + '</b><small>' + (S.me.kelas ? 'Kelas ' + esc(S.me.kelas) : 'Mode Tamu') + '</small></div></div></div></div><div class="warnbar" id="wb" hidden></div>' +
        '<div class="room-grid"><section class="card stim" id="stim"></section><section class="card ques" id="ques"></section><aside class="card pal" id="pal"></aside></div><div class="card room-bar"><button class="btn btn-soft" id="prev">' + ic('arrow', 'flip-x') + ' Soal Sebelumnya</button><label class="ragu"><input type="checkbox" id="rg"> ' + ic('info') + ' Ragu-ragu</label><div class="row gap"><button class="btn btn-primary" id="next">Soal Berikutnya ' + ic('arrow') + '</button><button class="btn btn-ok" id="fin">' + ic('check') + ' Selesai & Kumpulkan</button></div></div></div>';
      const $r = s => $(s, view);

      function drawStim(cur) {
        $r('#stim').innerHTML = '<div class="between"><span class="lbl">' + ic('book') + ' WACANA STIMULUS KONTEKSTUAL</span><span class="chip">' + esc(cur.tp.replace('TP', 'TP ')) + '</span></div><div class="stim-t">' + String(cur.stimulus || '').split(/\n+/).map(p => '<p>' + esc(p) + '</p>').join('') + '</div>' + (cur.diagram ? '<div class="diag"><small>' + ic('compass') + ' Sketsa Penampang Geometris</small>' + Art.tri(cur.diagram, 320, 200) + '</div>' : '') + (cur.gambar ? '<img class="soal-img" src="' + esc(cur.gambar) + '" alt="Gambar soal ' + cur.no + '" loading="lazy">' : '');
      }
      function drawQ() {
        const cur = q[idx], v = ans[cur.id];
        drawStim(cur);
        let body = '';
        if (cur.tipe === 'PG') body = cur.opsi.map((o, i) => '<button class="opt ' + (v === i ? 'sel' : '') + '" data-i="' + i + '" role="radio" aria-checked="' + (v === i) + '"><b>' + String.fromCharCode(65 + i) + '</b><span>' + esc(o) + '</span></button>').join('');
        else if (cur.tipe === 'PGK') body = cur.opsi.map((o, i) => '<button class="opt chk ' + ((v || []).includes(i) ? 'sel' : '') + '" data-i="' + i + '" role="checkbox" aria-checked="' + ((v || []).includes(i)) + '"><b>' + ic('check') + '</b><span><em>Pernyataan ' + String.fromCharCode(65 + i) + '</em>' + esc(o) + '</span></button>').join('');
        else if (cur.tipe === 'BS') body = cur.opsi.map((o, i) => '<div class="bs"><p><em>' + (i + 1) + '.</em> ' + esc(o) + '</p><div class="seg2"><button data-i="' + i + '" data-v="1" class="' + ((v || [])[i] === true ? 'sel t' : '') + '">Benar</button><button data-i="' + i + '" data-v="0" class="' + ((v || [])[i] === false ? 'sel f' : '') + '">Salah</button></div></div>').join('');
        else body = cur.opsi.kiri.map((o, i) => '<div class="bs"><p><em>' + (i + 1) + '.</em> ' + esc(o) + '</p><select class="inp" data-i="' + i + '"><option value="">— pilih pasangan —</option>' + cur.opsi.kanan.map((r, j) => '<option value="' + j + '" ' + ((v || [])[i] === j ? 'selected' : '') + '>' + esc(r) + '</option>').join('') + '</select></div>').join('');
        const cnt = cur.tipe === 'PGK' ? (v || []).length : 0;
        $r('#ques').innerHTML = '<div class="between"><h3 class="qno">Soal No. ' + cur.no + '</h3><div class="row gap"><span class="chip">' + cur.tipe + '</span><span class="chip amber">Bobot: ' + cur.bobot + ' Poin</span></div></div><p class="qtext">' + esc(cur.pertanyaan) + '</p><small class="muted tipe">' + TIPE_INFO[cur.tipe] + '</small><div class="opts" role="' + (cur.tipe === 'PG' ? 'radiogroup' : 'group') + '">' + body + '</div>' + (cur.tipe === 'PGK' ? '<div class="qfoot"><small>Kode: ' + (cfg.demo ? 'DEMO' : 'CB-' + cfg.attemptId.slice(-4).toUpperCase()) + '</small><b>' + cnt + ' Pilihan Terpilih</b></div>' : '');
        $r('#rg').checked = ragu.has(cur.id);
        $r('#prev').disabled = idx === 0; $r('#next').disabled = idx === N - 1;
        drawPal(); FX.scan(view);
      }
      function stats() { let a = 0, r = 0; q.forEach(x => { if (ragu.has(x.id)) r++; else if (answered(x, ans[x.id])) a++; }); return { a, r, b: N - a - r }; }
      function drawPal() {
        const s = stats();
        $r('#pal').innerHTML = '<div class="between"><h4 class="h4">' + ic('clipboard') + ' Daftar Soal</h4><span class="chip">' + N + ' Butir</span></div><div class="pal-s"><div><b class="g">' + s.a + '</b><small>Selesai</small></div><div><b class="a">' + s.r + '</b><small>Ragu</small></div><div><b>' + s.b + '</b><small>Belum</small></div></div><div class="grid-n">' + q.map((x, i) => '<button class="n ' + (ragu.has(x.id) ? 'r' : answered(x, ans[x.id]) ? 'a' : '') + (i === idx ? ' cur' : '') + '" data-n="' + i + '" aria-label="Soal ' + (i + 1) + '">' + (i + 1) + '</button>').join('') + '</div><div class="legend col"><span><i class="g"></i>Sudah Dijawab (' + s.a + ')</span><span><i class="a"></i>Ragu-ragu (' + s.r + ')</span><span><i class="b"></i>Belum Dijawab (' + s.b + ')</span><span><i class="c"></i>Sedang Aktif</span></div><div class="hint">' + ic('mouse') + ' Gunakan tombol panah ← / → pada papan ketik untuk berpindah soal.</div>';
      }
      /* ---- penyimpanan ---- */
      function setSv(state) {
        lastSave = state; const e = $r('#sv'); if (!e) return;
        e.className = 'pill ' + (state === 'ok' ? 'ok' : state === 'sav' ? 'info' : 'warn');
        e.querySelector('span').textContent = state === 'ok' ? (cfg.demo ? 'Mode demo' : 'Tersimpan otomatis') : state === 'sav' ? 'Menyimpan…' : 'Offline — tersimpan di perangkat';
      }
      function local() { if (cfg.demo) return; try { localStorage.setItem(lk, JSON.stringify({ a: ans, r: [...ragu], p: idx, t: Date.now() })); } catch (e) {} }
      async function save() {
        clearTimeout(saveT); if (cfg.demo || closed) return; local(); setSv('sav');
        try {
          const r = await API.post('cbt.save', { attemptId: cfg.attemptId, jawaban: ans, ragu: [...ragu], posisi: idx }, { quiet: true });
          dirty = false; setSv('ok');
          if (r && typeof r.sisaDetik === 'number') { const nd = Date.now() + r.sisaDetik * 1000; if (Math.abs(nd - deadline) > 2500) deadline = nd; }
        } catch (e) { setSv('off'); if (e.code === 'SESI') { toast('Sesi berakhir. Jawabanmu aman di perangkat; masuk lagi untuk melanjutkan.', 'err', 6000); } }
      }
      const touch = () => { dirty = true; local(); setSv('sav'); clearTimeout(saveT); saveT = setTimeout(save, 2200); };
      const iv = setInterval(() => { if (dirty || lastSave === 'off') save(); }, 15000);

      /* ---- timer ---- */
      const tk = setInterval(() => {
        const s = Math.max(0, Math.round((deadline - Date.now()) / 1000)); $r('#tmv').textContent = mmss(s);
        $r('#tm').classList.toggle('low', s <= 300);
        [[300, '5 menit'], [60, '1 menit']].forEach(w => { if (s <= w[0] && s > 0 && !warned[w[0]]) { warned[w[0]] = 1; toast('Sisa waktu ' + w[1] + '!', 'warn', 4500); } });
        if (s <= 0 && !closed) { clearInterval(tk); finish(true); }
      }, 500);

      /* ---- keamanan sesi (deteksi & pencatatan, bukan pencegahan mutlak) ---- */
      const lastLog = {};
      function flag(jenis) {
        if (closed || (lastLog[jenis] && Date.now() - lastLog[jenis] < 3000)) return; lastLog[jenis] = Date.now(); viol++;
        const wb = $r('#wb'); wb.hidden = false; wb.innerHTML = ic('warn') + ' Aktivitas <b>' + JENIS_LOG[jenis] + '</b> terdeteksi dan ' + (cfg.demo ? 'akan dicatat pada ujian resmi' : 'dicatat untuk guru') + '. Total peringatan: <b>' + viol + '</b>.';
        wb.classList.remove('pulse'); void wb.offsetWidth; wb.classList.add('pulse');
        if (!cfg.demo) API.post('cbt.log', { attemptId: cfg.attemptId, jenis }, { quiet: true }).catch(() => {});
      }
      const H = {
        vis: () => { if (document.hidden) flag('pindah_tab'); }, blur: () => { if (!document.hidden) flag('keluar_layar'); },
        copy: e => { e.preventDefault(); flag('salin_teks'); }, ctx: e => { e.preventDefault(); flag('klik_kanan'); },
        key: e => {
          if (e.key === 'PrintScreen') { flag('printscreen'); try { navigator.clipboard.writeText(' '); } catch (x) {} }
          if (e.target.closest && e.target.closest('select')) return;
          if (e.key === 'ArrowRight' && idx < N - 1) go(idx + 1); if (e.key === 'ArrowLeft' && idx > 0) go(idx - 1);
        },
        unload: e => { if (!cfg.demo && !closed) { e.preventDefault(); e.returnValue = ''; } }, online: () => { if (lastSave === 'off') save(); }
      };
      document.addEventListener('visibilitychange', H.vis); addEventListener('blur', H.blur); document.addEventListener('copy', H.copy); document.addEventListener('cut', H.copy);
      document.addEventListener('contextmenu', H.ctx); document.addEventListener('keydown', H.key); document.addEventListener('keyup', H.key); addEventListener('beforeunload', H.unload); addEventListener('online', H.online);
      function cleanup() { closed = true; clearInterval(iv); clearInterval(tk); clearTimeout(saveT); document.removeEventListener('visibilitychange', H.vis); removeEventListener('blur', H.blur); document.removeEventListener('copy', H.copy); document.removeEventListener('cut', H.copy); document.removeEventListener('contextmenu', H.ctx); document.removeEventListener('keydown', H.key); document.removeEventListener('keyup', H.key); removeEventListener('beforeunload', H.unload); removeEventListener('online', H.online); FX.calm(false); S.lockNav = null; }

      /* ---- interaksi ---- */
      function go(i) { idx = clamp(i, 0, N - 1); drawQ(); local(); scrollTo({ top: 0, behavior: 'smooth' }); }
      function setAns(v) { ans[q[idx].id] = v; touch(); }
      view.onclick = e => {
        const cur = q[idx], o = e.target.closest('.opt'), b = e.target.closest('.seg2 button'), n = e.target.closest('.grid-n .n'), f = e.target.closest('.fsz button');
        if (f) { fs = clamp(fs + +f.dataset.f, 0, 3); $r('#room').className = 'room fs' + (fs + 1); return; }
        if (n) return go(+n.dataset.n);
        if (o && cur.tipe === 'PG') { setAns(+o.dataset.i); $$('.opt', view).forEach(x => { x.classList.toggle('sel', x === o); x.setAttribute('aria-checked', x === o); }); drawPal(); }
        else if (o && cur.tipe === 'PGK') { const s = new Set(ans[cur.id] || []), i = +o.dataset.i; s.has(i) ? s.delete(i) : s.add(i); setAns([...s].sort()); o.classList.toggle('sel'); $('.qfoot b', view).textContent = s.size + ' Pilihan Terpilih'; drawPal(); }
        else if (b) { const a = (ans[cur.id] || cur.opsi.map(() => null)).slice(), i = +b.dataset.i; a[i] = b.dataset.v === '1'; setAns(a); $$('.seg2 button', b.closest('.bs')).forEach(x => x.className = ''); b.className = 'sel ' + (a[i] ? 't' : 'f'); drawPal(); }
      };
      view.onchange = e => { const s = e.target.closest('select.inp'); if (!s) return; const cur = q[idx], a = (ans[cur.id] || cur.opsi.kiri.map(() => null)).slice(); a[+s.dataset.i] = s.value === '' ? null : +s.value; setAns(a); drawPal(); };
      $r('#rg').onchange = e => { const id = q[idx].id; e.target.checked ? ragu.add(id) : ragu.delete(id); touch(); drawPal(); };
      $r('#prev').onclick = () => go(idx - 1); $r('#next').onclick = () => go(idx + 1);
      $r('#fin').onclick = async () => {
        const s = stats();
        const ok = await confirmBox('Kumpulkan jawaban?', 'Dijawab <b>' + s.a + '</b>, ragu-ragu <b>' + s.r + '</b>, belum dijawab <b>' + s.b + '</b> dari ' + N + ' soal.' + (s.b + s.r ? '<br><span class="warn-t">Masih ada soal yang belum final.</span>' : '') + '<br>Setelah dikumpulkan, jawaban tidak dapat diubah.', 'Ya, Kumpulkan');
        if (ok) finish(false);
      };
      async function finish(auto) {
        if (closed) return; const btn = $r('#fin'); busy(btn, true, 'Mengumpulkan…');
        try {
          const r = await cfg.onSubmit(ans, [...ragu]);
          cleanup(); try { localStorage.removeItem(lk); } catch (e) {} if (auto) toast('Waktu habis — jawaban otomatis dikumpulkan.', 'warn', 5000); resolve(r);
        } catch (e) { busy(btn, false); toast(errMsg(e) + ' Jawabanmu aman di perangkat — coba kumpulkan lagi.', 'err', 6000); if (auto && !closed) setTimeout(() => finish(true), 8000); }
      }
      drawQ(); setSv('ok');
    });
  }

  /* ---------- layar refleksi ---------- */
  function refleksi(view, cfg) {
    return new Promise(resolve => {
      let pem = 0;
      view.innerHTML = '<div class="refl card reveal glow"><span class="ico-b p xl">' + ic('message') + '</span><h2 class="h1">Refleksi Singkat Dulu, Ya!</h2><p class="muted">Jawabanmu <b>sudah terkumpul</b>. Isi refleksi berikut untuk membuka skor, lencana, dan pembahasan. Jawabanmu membantu gurumu memahami kesulitan belajar.</p><form id="rf"><label><b>1. Seberapa paham kamu pada materi paket ini?</b></label><div class="emo" id="emo">' + [['😵', 'Sangat bingung'], ['😕', 'Kurang paham'], ['🙂', 'Cukup paham'], ['😄', 'Paham'], ['🤩', 'Sangat paham']].map((e, i) => '<button type="button" data-v="' + (i + 1) + '" class="glow"><span>' + e[0] + '</span><small>' + e[1] + '</small></button>').join('') + '</div><label for="rk"><b>2. Bagian mana yang paling sulit bagimu?</b></label><textarea id="rk" class="inp" rows="3" maxlength="500" placeholder="Contoh: membedakan kapan menjumlahkan dan mengurangkan kuadrat"></textarea><label for="rs"><b>3. Strategi belajar apa yang akan kamu lakukan selanjutnya?</b></label><textarea id="rs" class="inp" rows="3" maxlength="500" placeholder="Contoh: mengulang simulasi TP 3 dan berlatih 5 soal tripel"></textarea><div id="re" class="form-err" role="alert"></div><button class="btn btn-primary btn-lg cta w100" type="submit">' + ic('eye') + ' Kirim Refleksi & Lihat Skorku</button></form></div>';
      FX.scan(view);
      $('#emo', view).onclick = e => { const b = e.target.closest('button'); if (!b) return; pem = +b.dataset.v; $$('#emo button', view).forEach(x => x.classList.toggle('on', x === b)); };
      $('#rf', view).onsubmit = async ev => {
        ev.preventDefault(); const er = $('#re', view), btn = $('button[type=submit]', view); er.textContent = '';
        const kes = $('#rk', view).value.trim(), str = $('#rs', view).value.trim();
        if (!pem) { er.textContent = 'Pilih tingkat pemahamanmu dulu.'; return; } if (kes.length < 3 || str.length < 3) { er.textContent = 'Isi kolom kesulitan dan strategi (minimal beberapa kata).'; return; }
        busy(btn, true, 'Mengirim…');
        try { resolve(await cfg.onSubmit({ pemahaman: pem, kesulitan: kes, strategi: str })); } catch (e) { er.textContent = errMsg(e); busy(btn, false); }
      };
    });
  }

  /* ---------- layar skor ---------- */
  function skor(view, h) {
    const col = h.tuntas ? 'var(--ok)' : 'var(--amber)';
    view.innerHTML = '<div class="score card reveal glow"><span class="pill ' + (h.tuntas ? 'ok' : 'warn') + '">' + (h.demo ? 'HASIL DEMO' : h.utama ? 'SKOR UTAMA RESMI' : 'LATIHAN MANDIRI') + ' · ' + esc(h.judul) + '</span><div class="ring-big">' + ring(h.skor, 190, col).replace('class="ring"', 'class="ring grow"') + '<div class="ring-n"><b data-count="' + h.skor + '">0</b><small>/ 100</small></div></div><h2 class="h1">' + (h.tuntas ? (h.skor >= 95 ? 'Luar biasa! 🌟' : 'Hebat, kamu tuntas! 🎉') : 'Belum tuntas — tetap semangat! 💪') + '</h2><p class="muted">KKM ' + h.kkm + ' · ' + (h.tuntas ? 'Kamu melampaui KKM.' : 'Pelajari pembahasan lalu coba latihan ulang untuk memperkuat pemahaman.') + (h.utama || h.demo ? '' : ' Nilai resmi tetap memakai percobaan pertama.') + '</p>' +
      (h.demo ? '<div class="note info">' + ic('info') + '<div>Ini hasil demo. XP, lencana, dan poin tidak dicatat di mode tamu.</div></div>' : '<div class="g3 rew"><div class="ms glow"><small>XP Didapat</small><b>+' + fmt(h.xp) + '</b>' + ic('bolt') + '</div><div class="ms glow"><small>Poin Kelas</small><b>' + (h.utama ? '+' + h.poin : '0') + '</b>' + ic('gift') + '</div><div class="ms glow"><small>Durasi</small><b>' + h.durasiMenit + ' mnt</b>' + ic('clock') + '</div></div>' + (h.lencanaBaru.length ? '<div class="newb">' + h.lencanaBaru.map(id => { const b = BADGE_DEF.find(x => x.id === id) || {}; return '<div class="nb glow">' + ic('medal') + '<div><small>Lencana baru!</small><b>' + esc(b.nama || id) + '</b></div></div>'; }).join('') + '</div>' : '') + (!h.utama ? '<div class="note info">' + ic('info') + '<div>Percobaan ke-' + h.ke + ' dicatat sebagai riwayat latihan. XP kecil tetap diberikan.</div></div>' : '')) +
      '<h4 class="h4 left">Penguasaan per Tujuan Pembelajaran</h4><div class="tpbars">' + Object.keys(h.tpPersen).sort().map(k => '<div class="tpb"><span>' + (TP_NAMA[k] || k) + '</span><div class="bar ' + (h.tpPersen[k] >= h.kkm ? '' : 'low') + '"><i style="--w:' + h.tpPersen[k] + '%"></i></div><b>' + h.tpPersen[k] + '%</b></div>').join('') + '</div><div class="row gap center wrap"><button class="btn btn-primary btn-lg cta" id="bp">' + ic('book') + ' Lihat Pembahasan Adaptif</button><a class="btn btn-ghost btn-lg" href="#cbt" id="bk">Kembali ke Ruang CBT</a></div></div>';
    FX.scan(view); if (h.tuntas) setTimeout(() => FX.confetti(innerWidth / 2, innerHeight * .35, h.skor >= 95 ? 160 : 110), 500);
    return new Promise(res => { $('#bp', view).onclick = () => res('bahas'); $('#bk', view).onclick = e => { e.preventDefault(); res('keluar'); }; });
  }

  /* ---------- pembahasan adaptif ---------- */
  function jawabanView(it) {
    const ks = it.kunciTampil, v = it.jawabanSiswa;
    if (it.tipe === 'PG' || it.tipe === 'PGK') return '<div class="rv-opts">' + it.opsi.map((o, i) => { const kunci = ks.includes(i), pilih = it.tipe === 'PG' ? v === i : (v || []).includes(i); return '<div class="rv-o ' + (kunci ? 'k' : '') + (pilih ? ' p' : '') + (pilih && !kunci ? ' bad' : '') + '"><b>' + String.fromCharCode(65 + i) + '</b><span>' + esc(o) + '</span><em>' + (kunci && pilih ? '✔ Jawabanmu benar' : kunci ? '✔ Kunci' : pilih ? '✘ Jawabanmu' : '') + '</em></div>'; }).join('') + '</div>';
    if (it.tipe === 'BS') return '<div class="rv-opts">' + it.opsi.map((o, i) => { const sv = (v || [])[i], ok = sv === ks[i]; return '<div class="rv-o ' + (ok ? 'k p' : 'bad p') + '"><b>' + (i + 1) + '</b><span>' + esc(o) + '</span><em>' + (sv == null ? 'Tidak dijawab' : 'Jawabanmu: ' + (sv ? 'Benar' : 'Salah')) + ' · Kunci: ' + (ks[i] ? 'Benar' : 'Salah') + '</em></div>'; }).join('') + '</div>';
    return '<div class="rv-opts">' + it.opsi.kiri.map((o, i) => { const sv = (v || [])[i], ok = sv === ks[i]; return '<div class="rv-o ' + (ok ? 'k p' : 'bad p') + '"><b>' + (i + 1) + '</b><span>' + esc(o) + '</span><em>Jawabanmu: ' + (sv == null ? '–' : esc(it.opsi.kanan[sv])) + ' · Kunci: ' + esc(it.opsi.kanan[ks[i]]) + '</em></div>'; }).join('') + '</div>';
  }
  function bahas(view, h) {
    const benar = h.items.filter(i => i.benar).length;
    view.innerHTML = '<div class="page-head reveal"><div><div class="crumb">Pembahasan adaptif · ' + esc(h.judul) + '</div><h1 class="h1">Pembahasan Soal</h1><p class="muted">' + benar + ' dari ' + h.items.length + ' soal benar penuh. Soal yang belum tepat dibuka otomatis lengkap dengan langkah dan tautan materi.</p></div><div class="head-r"><button class="btn btn-ghost" id="bb">' + ic('arrow', 'flip-x') + ' Kembali ke Skor</button><a class="btn btn-primary" href="#cbt" id="bk2">Ruang CBT</a></div></div><div class="stack">' +
      h.items.map(it => { const st = it.benar ? 'ok' : it.sebagian ? 'part' : 'bad', ttl = it.benar ? 'Tepat!' : it.sebagian ? 'Sebagian benar' : 'Belum tepat'; const tp = TPS.find(t => t.id === it.tp);
        return '<details class="card rv ' + st + ' reveal" ' + (it.benar ? '' : 'open') + '><summary><span class="rv-n">' + it.no + '</span><div><b>' + esc(it.pertanyaan) + '</b><small>' + (TP_NAMA[it.tp] || it.tp) + '</small></div><span class="pill ' + (it.benar ? 'ok' : it.sebagian ? 'warn' : 'err') + '">' + ttl + '</span></summary><div class="rv-b">' + (it.stimulus ? '<p class="muted stim-s">' + esc(it.stimulus) + '</p>' : '') + (it.diagram ? '<div class="diag">' + Art.tri(it.diagram, 280, 170) + '</div>' : '') + jawabanView(it) +
          (it.benar ? '<div class="note ok">' + ic('sparkles') + '<div><b>Penguatan konsep</b><p>' + esc(tp ? tp.ringkas : '') + ' Pertahankan! Coba tantang diri di Sumatif atau simulasi lab.</p></div></div>' : '') +
          '<div class="note ' + (it.benar ? 'info' : 'warn') + '">' + ic(it.benar ? 'info' : 'warn') + '<div><b>' + (it.benar ? 'Langkah penyelesaian' : 'Langkah penyelesaian yang benar') + '</b><p class="pre">' + esc(it.pembahasan) + '</p></div></div>' + (it.benar ? '' : '<a class="btn btn-soft btn-sm" href="#materi" data-tp="' + it.tp + '">' + ic('book') + ' Pelajari ulang ' + (TP_NAMA[it.tp] || it.tp) + '</a>') + '</div></details>'; }).join('') + '</div>';
    FX.scan(view);
    return new Promise(res => { $('#bb', view).onclick = () => res('skor'); $('#bk2', view).onclick = e => { e.preventDefault(); res('keluar'); }; view.addEventListener('click', e => { const a = e.target.closest('[data-tp]'); if (a) { S.tp = a.dataset.tp; S.skipLock = 1; } }); });
  }

  /* ---------- alur lengkap setelah ujian ---------- */
  async function afterSubmit(view, attemptId, judul) {
    const h = await refleksi(view, { onSubmit: d => API.post('cbt.refleksi', Object.assign({ attemptId }, d)) });
    Data.invalidate(); App.refreshTop(); return hasilLoop(view, h);
  }
  async function hasilLoop(view, h) {
    let mode = 'skor';
    while (true) {
      const r = mode === 'skor' ? await skor(view, h) : await bahas(view, h);
      if (r === 'keluar') return Pages.cbt(view);
      mode = r === 'bahas' ? 'bahas' : 'skor'; scrollTo({ top: 0 });
    }
  }
  async function mulai(view, paket) {
    const d = await API.post('cbt.start', { paket });
    if (d.kadaluarsa) { toast('Waktu pengerjaan sebelumnya habis — jawaban dikumpulkan otomatis.', 'warn', 5000); return afterSubmit(view, d.attemptId); }
    await room(view, { attemptId: d.attemptId, judul: d.judul + ' · ' + (d.ke > 1 ? 'Percobaan ' + d.ke : 'Percobaan 1 (Skor Utama)'), soal: d.soal, jawaban: d.jawaban, ragu: d.ragu, posisi: d.posisi, sisaDetik: d.sisaDetik, onSubmit: (j, r) => API.post('cbt.submit', { attemptId: d.attemptId, jawaban: j, ragu: r }) });
    return afterSubmit(view, d.attemptId);
  }
  async function mulaiDemo(view) {
    await room(view, { demo: true, attemptId: 'demo', judul: DEMO.judul, soal: DEMO.soal, jawaban: {}, ragu: [], posisi: 0, sisaDetik: DEMO.durasiDetik, onSubmit: async j => j }).then(async j => { await hasilLoop(view, gradeDemo(j)); });
  }
  return { mulai, mulaiDemo, afterSubmit, hasilLoop };
})();

/* ================= HALAMAN RUANG CBT ================= */
Pages.cbt = async function (view) {
  const d = await Data.boot(true), g = S.guest;
  const sub = { terbuka: 'Mulai Mengerjakan', berlangsung: 'Lanjutkan Ujian', refleksi: 'Isi Refleksi', tuntas: 'Latihan Ulang', remedial: 'Latihan Ulang' };
  view.innerHTML = guestBanner() + head(CRUMB, 'Ruang CBT Berjenjang', 'Kerjakan Formatif 1 → Formatif 2 → Sumatif. Skor percobaan pertama menjadi nilai resmi dan terkunci; percobaan berikutnya adalah latihan.', '<span class="pill info">' + ic('shield') + ' Sesi dipantau · tersimpan otomatis</span>') +
    '<div class="g3 cbt-list">' + d.paket.map((p, i) => { const lock = p.status === 'terkunci' || p.status === 'nonaktif', can = !g && !lock;
      return '<div class="card pk glow tilt reveal ' + p.status + '"><div class="between"><span class="ico-b ' + (lock ? 'mute' : 'p') + '">' + ic(lock ? 'lock' : 'clipboard') + '</span>' + statusPill(p.status) + '</div><small class="muted">Paket ' + (i + 1) + ' · ' + p.jumlahSoal + ' soal · ' + p.durasi + ' menit · KKM ' + p.kkm + '</small><h3 class="h3">' + esc(p.judul) + '</h3><p class="muted">' + esc(p.cakupan) + '</p>' + (p.skorUtama != null ? '<div class="between sk"><div><small>Skor Utama (resmi)</small><b>' + fmt(p.skorUtama) + '<em>/100</em></b></div><div><small>Poin</small><b>+' + p.poin + '</b></div><div><small>Percobaan</small><b>' + p.percobaan + '</b></div></div>' : '') + '<button class="btn ' + (can ? 'btn-primary cta' : 'btn-soft') + ' w100" data-p="' + p.paket + '" ' + (can ? '' : 'disabled') + '>' + (g ? ic('lock') + ' Khusus siswa terdaftar' : lock ? ic('lock') + ' ' + (p.status === 'nonaktif' ? 'Dinonaktifkan guru' : 'Selesaikan paket sebelumnya') : (sub[p.status] || 'Mulai') + ' ' + ic('arrow')) + '</button></div>'; }).join('') + '</div>' +
    (g ? '<div class="card demo-c glow reveal"><span class="ico-b o">' + ic('eye') + '</span><div><h3 class="h3">Coba Demo CBT (5 soal contoh)</h3><p class="muted">Rasakan tampilan Ruang CBT: split-screen, penanda ragu-ragu, timer, dan pembahasan — tanpa pencatatan nilai.</p></div><button class="btn btn-ok btn-lg cta" id="demo">' + ic('play') + ' Mulai Demo</button></div>' : '') +
    '<div class="card rules reveal"><h3 class="h3">' + ic('shieldcheck') + ' Aturan Pengerjaan CBT</h3><div class="g2"><ul><li>Skor <b>percobaan pertama</b> dikunci sebagai nilai resmi; percobaan berikutnya untuk latihan & grafik progres.</li><li>Jawaban tersimpan otomatis. Jika koneksi putus, jawaban aman di perangkatmu dan dikirim ulang saat tersambung.</li><li>Isi <b>refleksi</b> sebelum skor tampil.</li></ul><ul><li>Pindah tab/jendela, menyalin teks, klik kanan, dan tombol PrintScreen <b>terdeteksi dan dicatat</b> untuk guru.</li><li>Waktu berjalan di server. Jika habis, jawaban otomatis dikumpulkan.</li><li>Gunakan A-/A+ untuk mengatur ukuran huruf.</li></ul></div></div>';
  $('#demo', view) && ($('#demo', view).onclick = () => CBT.mulaiDemo(view));
  view.onclick = async e => {
    const b = e.target.closest('[data-p]'); if (!b || b.disabled) return; const p = d.paket.find(x => x.paket === b.dataset.p);
    if (p.status === 'refleksi') { try { busy(b, true); await CBT.afterSubmit(view, p.refleksiTertunda); } catch (er) { toast(errMsg(er), 'err'); busy(b, false); } return; }
    if (p.status !== 'berlangsung') {
      const ok = await confirmBox('Mulai ' + p.judul + '?', 'Durasi <b>' + p.durasi + ' menit</b> · ' + p.jumlahSoal + ' soal · KKM ' + p.kkm + '.<br>' + (p.percobaan ? 'Ini <b>percobaan latihan</b>; nilai resmi tetap percobaan pertama.' : 'Ini <b>percobaan pertama</b> dan menjadi <b>skor utama (resmi)</b>.') + '<br>Pastikan koneksi stabil dan jangan berpindah tab selama ujian.', 'Mulai Sekarang'); if (!ok) return;
    }
    try { busy(b, true, 'Menyiapkan soal…'); await CBT.mulai(view, p.paket); } catch (er) { toast(errMsg(er), 'err', 5000); busy(b, false); if (er.code === 'REFLEKSI') Pages.cbt(view); }
  };
};
