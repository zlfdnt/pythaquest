/* PythaQuest — data statis: kurikulum, materi & rangkuman TP 2–6, demo CBT (mode tamu), menu, lencana */
'use strict';
const META = [
  ['Mata Pelajaran', 'Matematika', 'book'], ['Materi Pokok', 'Teorema Pythagoras', 'triangle'], ['Kelas / Fase', 'VIII (Delapan) / Fase D', 'users'],
  ['Elemen', 'Geometri', 'compass'], ['Pendekatan', 'Pembelajaran Mendalam (Berkesadaran, Bermakna, Menggembirakan)', 'sparkles'], ['Kegiatan', '5 tahap + 3 kegiatan lanjutan', 'target']
];
const CP_FASE_D = 'Peserta didik dapat menjelaskan dan menggunakan Teorema Pythagoras, termasuk kebalikannya, untuk menyelesaikan masalah geometri dan masalah kontekstual.';
const TPS = [
  { id: 'TP2', no: 2, judul: 'Menghitung Panjang Hipotenusa & Sisi Tegak', ringkas: 'Menerapkan c² = a² + b² pada segitiga siku-siku untuk mencari sisi yang belum diketahui.', sim: true },
  { id: 'TP3', no: 3, judul: 'Menganalisis Kebalikan Teorema Pythagoras', ringkas: 'Menentukan jenis segitiga (lancip, siku-siku, tumpul) dari perbandingan kuadrat ketiga sisinya.', sim: true },
  { id: 'TP4', no: 4, judul: 'Mengidentifikasi Bilangan Tripel Pythagoras', ringkas: 'Menemukan pola bilangan bulat seperti 3-4-5, 5-12-13, 8-15-17 beserta kelipatannya.', sim: true },
  { id: 'TP5', no: 5, judul: 'Menghitung Rasio Sisi Segitiga Khusus', ringkas: 'Mengeksplorasi segitiga istimewa 45°–45°–90° dan 30°–60°–90°.', sim: true },
  { id: 'TP6', no: 6, judul: 'Memecahkan Masalah Kontekstual Dunia Nyata', ringkas: 'Navigasi maritim Kepulauan Riau, jembatan, tiang, dan kemiringan tangga keselamatan.', sim: false }
];
const CARA_BELAJAR = [
  ['compass', 'Eksplorasi Materi & Bukti Visual', 'Baca materi TP 2–6 secara bebas, lihat bukti geometris luas persegi, dan pakai kartu rumus kapan saja.'],
  ['flask', 'Praktik di Simulasi Lab Interaktif', 'Geser sisi segitiga, saksikan rumus bekerja langsung, lalu klaim +10 XP dan lencana tiap simulasi (TP 2–5).'],
  ['clipboard', 'Asesmen CBT Berjenjang', 'Kerjakan Formatif 1 → Formatif 2 → Sumatif. Skor percobaan pertama menjadi nilai resmi; percobaan ulang untuk latihan.'],
  ['gift', 'Refleksi, XP & Hadiah', 'Isi refleksi untuk melihat skor, kumpulkan XP, lencana, dan poin reward untuk ditukar di Toko Poin.']
];
const NAV_SISWA = [['beranda', 'Beranda', 'home'], ['materi', 'Materi & Rangkuman', 'book'], ['simulasi', 'Simulasi Lab', 'flask'], ['cbt', 'Ruang CBT', 'clipboard'], ['progres', 'Progres & Lencana', 'trophy'], ['papan', 'Papan Juara', 'chart'], ['poin', 'Tukar Poin', 'gift']];
const NAV_GURU = [['g-dashboard', 'Dashboard', 'home'], ['g-siswa', 'Siswa', 'users'], ['g-soal', 'Bank Soal', 'db'], ['g-sesi', 'Sesi CBT', 'clipboard'], ['g-hasil', 'Hasil & Rekap', 'chart'], ['g-refleksi', 'Refleksi', 'message'], ['g-poin', 'Penukaran Poin', 'gift'], ['g-pengaturan', 'Pengaturan', 'settings']];
const NAV_TAMU = NAV_SISWA.filter(n => ['beranda', 'materi', 'simulasi', 'cbt', 'papan'].includes(n[0]));
const BADGE_DEF = [
  { id: 'penakluk-rumus', nama: 'Penakluk Rumus', tp: 'TP 2', syarat: 'Selesaikan Simulasi TP 2 (hitung hipotenusa & sisi tegak).', ikon: 'compass', warna: '#FF9F43' },
  { id: 'detektif-siku', nama: 'Detektif Siku-siku', tp: 'TP 3', syarat: 'Selesaikan Simulasi TP 3 (uji kebalikan Pythagoras).', ikon: 'search', warna: '#1FC98B' },
  { id: 'pencari-tripel', nama: 'Pencari Tripel', tp: 'TP 4', syarat: 'Selesaikan Simulasi TP 4 (tripel & kelipatannya).', ikon: 'sparkles', warna: '#5B3FD9' },
  { id: 'master-sudut', nama: 'Master Sudut Istimewa', tp: 'TP 5', syarat: 'Selesaikan Simulasi TP 5 (45°–45°–90° & 30°–60°–90°).', ikon: 'triangle', warna: '#3B82F6' },
  { id: 'arsitek-nyata', nama: 'Arsitek Dunia Nyata', tp: 'TP 6', syarat: 'Tuntaskan Sumatif (skor utama ≥ KKM).', ikon: 'building', warna: '#EF4444' },
  { id: 'juara-f1', nama: 'Juara Formatif 1', tp: 'TP 2–3', syarat: 'Raih skor utama ≥ 85 pada Formatif 1.', ikon: 'trophy', warna: '#D9A400' }
];
const TIER_POIN = [['95 – 100', 5], ['85 – 94', 4], ['72 – 84', 3], ['< 72', 0]];

/* ---------- Materi & Rangkuman ---------- */
const MATERI = {
  TP2: {
    tab: 'TP 2: Hipotenusa & Sisi Tegak', tujuan: 'Peserta didik mampu menemukan hubungan sisi-sisi pada segitiga siku-siku dan menghitung panjang sisi miring (hipotenusa) serta sisi siku-siku menggunakan relasi c² = a² + b² secara teliti, logis, dan sistematis.',
    blok: [
      { t: 'proof', judul: 'Pembuktian Geometris Luas Persegi Sisi', badge: 'Model Luas Euclid', a: 6, b: 8, teks: 'Buat persegi pada setiap sisi segitiga siku-siku. Luas persegi pada sisi miring selalu sama dengan jumlah luas kedua persegi pada sisi siku-siku. Contoh: 36 + 64 = 100.' },
      { t: 'rumus', items: [['Mencari Hipotenusa', 'c = √(a² + b²)', 'Dipakai saat kedua sisi siku-siku (alas & tegak) sudah diketahui.'], ['Mencari Sisi Alas', 'a = √(c² − b²)', 'Kurangkan kuadrat sisi tegak dari kuadrat sisi miring.'], ['Mencari Sisi Tegak', 'b = √(c² − a²)', 'Kurangkan kuadrat sisi alas dari kuadrat sisi miring.']] },
      { t: 'catatan', judul: 'Catatan Kritis Geometri!', teks: 'Sisi miring (hipotenusa) SELALU berada tepat berhadapan dengan sudut 90° dan merupakan sisi terpanjang. Jika hasil hitunganmu lebih kecil dari sisi tegak, cek kembali urutan operasinya: mencari sisi miring → JUMLAHKAN kuadrat; mencari sisi siku-siku → KURANGKAN kuadrat.' },
      { t: 'contoh', judul: 'Contoh Soal Terbimbing & Alur Solusi', soal: 'Sebuah kapal layar ke arah barat sejauh 12 km, lalu berbelok tepat ke arah selatan sejauh 5 km. Hitunglah jarak terpendek kapal tersebut sekarang dari titik awal keberangkatan!', langkah: [['Identifikasi Stimulus Geometri', 'Barat dan Selatan saling tegak lurus (90°), sehingga terbentuk segitiga siku-siku dengan a = 12 km dan b = 5 km. Ditanyakan: hipotenusa c.'], ['Terapkan Rumus Pythagoras', 'Gunakan relasi dasar sisi miring: c² = a² + b²'], ['Substitusi & Hitung Kuadrat', 'c² = 12² + 5² → c² = 144 + 25 → c² = 169'], ['Akar Kuadrat & Kesimpulan', 'c = √169 = 13 km. Jarak terpendek kapal dari titik awal adalah 13 km.']] },
      { t: 'uji', q: 'Sebuah segitiga siku-siku memiliki panjang sisi siku-siku 9 cm dan 12 cm. Berapakah panjang hipotenusanya?', opsi: ['15 cm', '18 cm', '21 cm', '14 cm'], benar: 0, bahas: '9² + 12² = 81 + 144 = 225 → c = 15 cm. (Kelipatan 3 dari tripel 3-4-5.)' }
    ]
  },
  TP3: {
    tab: 'TP 3: Kebalikan Pythagoras', tujuan: 'Peserta didik mampu menentukan jenis segitiga (lancip, siku-siku, atau tumpul) berdasarkan perbandingan kuadrat sisi terpanjang dengan jumlah kuadrat dua sisi lainnya.',
    blok: [
      { t: 'kasus', judul: 'Tiga Kemungkinan Jenis Segitiga', teks: 'Misalkan c adalah sisi terpanjang. Bandingkan c² dengan a² + b².', items: [['Siku-siku', 'c² = a² + b²', 'Sudut terbesar tepat 90°', 'siku'], ['Lancip', 'c² < a² + b²', 'Semua sudut kurang dari 90°', 'lancip'], ['Tumpul', 'c² > a² + b²', 'Ada satu sudut lebih dari 90°', 'tumpul']] },
      { t: 'catatan', judul: 'Jangan Lupa Syarat Segitiga!', teks: 'Sebelum membandingkan kuadrat, pastikan ketiga sisi benar-benar dapat membentuk segitiga: jumlah dua sisi terpendek harus lebih besar dari sisi terpanjang (a + b > c).' },
      { t: 'contoh', judul: 'Contoh Soal Terbimbing', soal: 'Tentukan jenis segitiga dengan panjang sisi 7 cm, 9 cm, dan 10 cm.', langkah: [['Urutkan sisi', 'Sisi terpanjang c = 10; dua sisi lainnya a = 7 dan b = 9.'], ['Kuadratkan', 'c² = 100; a² + b² = 49 + 81 = 130.'], ['Bandingkan', '100 < 130 → c² < a² + b².'], ['Kesimpulan', 'Segitiga tersebut adalah segitiga lancip.']] },
      { t: 'uji', q: 'Segitiga dengan sisi 5 cm, 12 cm, dan 13 cm merupakan segitiga…', opsi: ['Lancip', 'Siku-siku', 'Tumpul', 'Sama sisi'], benar: 1, bahas: '5² + 12² = 25 + 144 = 169 = 13² → siku-siku.' }
    ]
  },
  TP4: {
    tab: 'TP 4: Tripel Pythagoras', tujuan: 'Peserta didik mampu mengidentifikasi tripel Pythagoras (tiga bilangan bulat positif yang memenuhi a² + b² = c²), kelipatannya, dan memakainya untuk menghitung dengan cepat.',
    blok: [
      { t: 'tripel', judul: 'Tripel Pythagoras Dasar', items: [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]] },
      { t: 'rumus', items: [['Kelipatan Tripel', '(ka, kb, kc)', 'Setiap kelipatan bulat positif dari sebuah tripel juga tripel. Contoh: 3×(3,4,5) = (9,12,15).'], ['Pembangkit Tripel (Euclid)', '(m² − n², 2mn, m² + n²)', 'Untuk bilangan bulat m > n > 0. Contoh m=2, n=1 → (3, 4, 5).'], ['Uji Tripel', 'a² + b² = c²', 'Kuadratkan, jumlahkan dua yang terkecil, dan bandingkan dengan yang terbesar.']] },
      { t: 'catatan', judul: 'Hati-hati: "Kelipatan" ≠ "Penambahan"', teks: 'Tripel tetap berlaku bila SETIAP sisi dikalikan bilangan yang sama. Menambah 1 pada setiap sisi (3,4,5 → 4,5,6) menghancurkan sifat siku-siku.' },
      { t: 'contoh', judul: 'Contoh Soal Terbimbing', soal: 'Sebuah segitiga siku-siku memiliki sisi tegak 15 cm dan 36 cm. Berapa panjang sisi miringnya?', langkah: [['Kenali pola', '15 = 3×5 dan 36 = 3×12 → kelipatan 3 dari tripel (5, 12, 13).'], ['Kalikan juga sisi miring', 'c = 3 × 13 = 39 cm.'], ['Verifikasi', '15² + 36² = 225 + 1296 = 1521 = 39².'], ['Kesimpulan', 'Sisi miring = 39 cm tanpa menghitung akar.']] },
      { t: 'uji', q: 'Tripel manakah yang merupakan kelipatan 2 dari (8, 15, 17)?', opsi: ['(16, 30, 34)', '(16, 30, 36)', '(10, 17, 19)', '(24, 45, 51)'], benar: 0, bahas: '2 × (8, 15, 17) = (16, 30, 34).' }
    ]
  },
  TP5: {
    tab: 'TP 5: Segitiga Istimewa', tujuan: 'Peserta didik mampu menghitung panjang sisi pada segitiga siku-siku istimewa 45°–45°–90° dan 30°–60°–90° menggunakan perbandingan sisi.',
    blok: [
      { t: 'istimewa', judul: 'Dua Segitiga Istimewa', items: [{ nama: '45°–45°–90°', rasio: '1 : 1 : √2', ket: 'Segitiga siku-siku sama kaki. Hipotenusa = sisi siku-siku × √2. Ditemukan pada diagonal persegi.', jenis: 45 }, { nama: '30°–60°–90°', rasio: '1 : √3 : 2', ket: 'Setengah segitiga sama sisi. Sisi di depan 30° = x, di depan 60° = x√3, hipotenusa = 2x.', jenis: 30 }] },
      { t: 'rumus', items: [['Diagonal Persegi', 'd = s√2', 'Diagonal persegi bersisi s membentuk dua segitiga 45°–45°–90°.'], ['Tinggi Segitiga Sama Sisi', 't = ½ s√3', 'Garis tinggi membagi segitiga sama sisi menjadi dua segitiga 30°–60°–90°.'], ['Sisi Miring 30°–60°–90°', 'c = 2 × sisi terpendek', 'Sisi terpendek selalu berhadapan dengan sudut 30°.']] },
      { t: 'contoh', judul: 'Contoh Soal Terbimbing', soal: 'Sebuah ubin persegi bersisi 10 cm. Berapa panjang diagonal ubin tersebut?', langkah: [['Kenali bentuk', 'Diagonal membagi persegi menjadi dua segitiga siku-siku sama kaki (45°–45°–90°).'], ['Rasio', 'Sisi siku-siku : hipotenusa = 1 : √2.'], ['Hitung', 'd = 10 × √2 = 10√2 cm.'], ['Kesimpulan', 'Panjang diagonal ≈ 14,14 cm.']] },
      { t: 'uji', q: 'Pada segitiga 30°–60°–90°, sisi terpendek 9 cm. Berapa panjang hipotenusanya?', opsi: ['9√3 cm', '18 cm', '9√2 cm', '27 cm'], benar: 1, bahas: 'Hipotenusa = 2 × sisi terpendek = 18 cm.' }
    ]
  },
  TP6: {
    tab: 'TP 6: Masalah Nyata', tujuan: 'Peserta didik mampu memodelkan situasi nyata (navigasi, konstruksi, tangga, kawat penopang) sebagai segitiga siku-siku lalu menyelesaikannya dengan Teorema Pythagoras dan menafsirkan hasilnya.',
    blok: [
      { t: 'strategi', judul: 'Strategi 4 Langkah Memecahkan Masalah Nyata', items: [['Gambar', 'Buat sketsa situasi dan beri label ukuran yang diketahui.'], ['Kenali segitiga siku-siku', 'Cari dua arah/benda yang saling tegak lurus (tiang–tanah, utara–timur).'], ['Pilih & hitung', 'Tentukan sisi yang dicari: sisi miring (jumlahkan) atau sisi siku-siku (kurangkan).'], ['Tafsirkan', 'Beri satuan, periksa kewajaran, dan jawab sesuai pertanyaan.']] },
      { t: 'catatan', judul: 'Waspadai Pertanyaan Bertingkat', teks: 'Banyak soal menanyakan hal setelah menghitung sisi: keliling, total jarak, waktu tempuh, atau selisih posisi. Selesaikan sisi segitiga dulu, baru jawab pertanyaan sebenarnya.' },
      { t: 'contoh', judul: 'Contoh 1 · Tangga Keselamatan', soal: 'Tangga 17 m bersandar pada dinding tegak dengan kaki tangga 8 m dari dinding. Berapa tinggi ujung atas tangga?', langkah: [['Gambar', 'Tangga = sisi miring (17), kaki = sisi alas (8), tinggi = sisi tegak.'], ['Pilih rumus', 'Mencari sisi siku-siku → kurangkan kuadrat: b = √(c² − a²).'], ['Hitung', 'b² = 289 − 64 = 225.'], ['Tafsirkan', 'b = 15 m. Ujung atas tangga setinggi 15 m.']] },
      { t: 'contoh', judul: 'Contoh 2 · Kawat Penopang Tiang', soal: 'Tiang antena 12 m ditopang kawat dari puncak ke tanah pada jarak 5 m dari dasar tiang. Jika dipasang 3 kawat sama panjang, berapa total kawat?', langkah: [['Gambar', 'Tiang tegak lurus tanah → segitiga siku-siku (12 dan 5).'], ['Hitung satu kawat', 'c² = 144 + 25 = 169 → c = 13 m.'], ['Pertanyaan bertingkat', 'Total = 3 × 13 m.'], ['Tafsirkan', 'Dibutuhkan 39 m kawat.']] },
      { t: 'uji', q: 'Tangga 17 m bersandar pada dinding. Kaki tangga 8 m dari dinding. Ujung atas tangga mencapai tinggi…', opsi: ['9 m', '15 m', '16 m', '25 m'], benar: 1, bahas: '17² − 8² = 289 − 64 = 225 → 15 m (tripel 8-15-17).' }
    ]
  }
};
const KARTU_RUMUS = [
  ['Hubungan Pythagoras Utama', 'c² = a² + b²', 'c adalah hipotenusa (sisi terpanjang)'], ['Uji Jenis Segitiga', 'c² = a²+b² → siku-siku\nc² > a²+b² → tumpul\nc² < a²+b² → lancip', ''],
  ['Tripel Standar', '(3,4,5) (5,12,13)\n(8,15,17) (7,24,25)', 'Kelipatan juga tripel'], ['Rasio Sudut Istimewa', '45°–45°–90° → 1 : 1 : √2\n30°–60°–90° → 1 : √3 : 2', '']
];

/* ---------- DEMO CBT (mode tamu) — kunci di sisi klien karena tidak mencatat apa pun ---------- */
const DEMO = {
  judul: 'Demo CBT · Contoh Soal', durasiDetik: 600,
  soal: [
    { id: 'D1', no: 1, tp: 'TP2', tipe: 'PG', bobot: 10, stimulus: 'Tangga 13 m disandarkan pada dinding. Kaki tangga berjarak 5 m dari dinding.', diagram: { a: '? m', b: '5 m', c: '13 m', la: 'Tinggi', lb: 'Jarak kaki', lc: 'Tangga' }, pertanyaan: 'Berapa tinggi ujung atas tangga?', opsi: ['8 m', '12 m', '14 m', '18 m'] },
    { id: 'D2', no: 2, tp: 'TP3', tipe: 'PGK', bobot: 10, stimulus: 'Pilih ukuran sisi yang dapat membentuk segitiga siku-siku.', pertanyaan: 'Pilih SEMUA yang benar.', opsi: ['9, 12, 15', '6, 8, 11', '10, 24, 26', '5, 6, 7'] },
    { id: 'D3', no: 3, tp: 'TP4', tipe: 'BS', bobot: 10, stimulus: 'Tripel Pythagoras dasar (3, 4, 5) diperbesar.', pertanyaan: 'Tentukan Benar atau Salah.', opsi: ['(6, 8, 10) adalah tripel Pythagoras.', '(4, 5, 6) adalah tripel Pythagoras.', '(30, 40, 50) adalah tripel Pythagoras.'] },
    { id: 'D4', no: 4, tp: 'TP5', tipe: 'COCOK', bobot: 10, stimulus: 'Gunakan perbandingan 1 : 1 : √2 dan 1 : √3 : 2.', pertanyaan: 'Pasangkan soal dengan jawabannya.', opsi: { kiri: ['Diagonal persegi sisi 7 cm', 'Hipotenusa 30°–60°–90° dengan sisi terpendek 7 cm', 'Sisi di hadapan 60° dengan sisi terpendek 7 cm'], kanan: ['7√2 cm', '14 cm', '7√3 cm'] } },
    { id: 'D5', no: 5, tp: 'TP6', tipe: 'PG', bobot: 10, stimulus: 'Kapal berlayar ke utara 24 mil laut lalu ke timur 7 mil laut.', diagram: { a: '24 mil', b: '7 mil', c: '? mil', la: 'Utara', lb: 'Timur', lc: 'Jarak lurus' }, pertanyaan: 'Berapa jarak lurus kapal dari titik awal?', opsi: ['17 mil laut', '25 mil laut', '31 mil laut', '35 mil laut'] }
  ],
  kunci: { D1: [1], D2: [0, 2], D3: [true, false, true], D4: [0, 1, 2], D5: [1] },
  bahas: {
    D1: 'a² = 13² − 5² = 169 − 25 = 144 → a = 12 m.', D2: '9²+12²=15² ✔, 10²+24²=26² ✔; 6²+8² = 100 ≠ 121; 5²+6² = 61 ≠ 49.',
    D3: '(6,8,10) dan (30,40,50) adalah kelipatan (3,4,5). (4,5,6): 16+25 = 41 ≠ 36 → bukan tripel.', D4: 'Diagonal = 7√2; hipotenusa = 2×7 = 14; sisi di hadapan 60° = 7√3.', D5: 'c = √(24² + 7²) = √625 = 25 mil laut.'
  }
};
