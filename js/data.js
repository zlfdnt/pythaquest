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
  ['gift', 'Refleksi, XP & Apresiasi', 'Isi refleksi untuk melihat skor, kumpulkan XP, lencana, dan Poin Kelas untuk ditukar dengan apresiasi non-materi.']
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

/* ---------- Kartu rumus (materi interaktif ada di materi.js) ---------- */
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
