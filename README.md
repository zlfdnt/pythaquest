# PythaQuest — Frontend (GitHub Pages)

Frontend statis (HTML/CSS/JS murni) untuk PythaQuest. Backend: Google Apps Script (REST API).

1. Edit `js/config.js` → isi `GAS_URL` dengan URL Web App Apps Script (berakhiran `/exec`).
2. Unggah **seluruh isi folder ini** ke root repository GitHub, lalu aktifkan GitHub Pages (Settings → Pages → Deploy from a branch → `main` / `(root)`).

Tidak ada rahasia di repo ini. Lihat `PANDUAN-INSTALASI.md` untuk langkah lengkap.

## Memperbarui (3 langkah)

1. Ekstrak zip baru; **jangan menimpa `js/config.js`** milikmu (atau isi ulang `GAS_URL`).
2. GitHub → **Add file → Upload files** → seret isi folder → **Commit changes**. (Terminal: `git add .` → `git commit -m "update"` → `git push`.)
3. Tunggu 1–2 menit → tekan **Ctrl+F5**.

Backend (Apps Script) diperbarui terpisah: tempel kode → **Deploy → Kelola deployment → Versi baru**. Lihat `PANDUAN-INSTALASI.md` Bagian D.
