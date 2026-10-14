# Runut — Buat ngecek pola tulisan berbahasa Indonesia

Vue 3 (Composition API) · Vue Router · Tailwind CSS (npm) · Font Awesome

Web ini buat ngecek tulisan: pengulangan kata, kalimat kepanjangan,
kalimat yang mirip-mirip, bau-bau AI, kata nggak baku, sama gaya yang nggak konsisten.
Tempel teks, lihat yang ditandain, beresin satu-satu.

## Struktur standar: 5 halaman, 8 komponen

| Path | Halaman | File | Isi |
|---|---|---|---|
| `/` | Beranda | `LandingView.vue` | Hero, 6 hal yang dicek, langkah-langkah, tombol mulai |
| `/tentang` | Tentang | `AboutView.vue` | Cerita kenapa dibikin + prinsip + latar belakang |
| `/masuk` | Auth | `AuthView.vue` | Masuk + daftar dalam satu halaman (tab) |
| `/analisis` | Analisis | `AnalyzeView.vue` | Input teks + hasil analisis dalam satu halaman |
| `/riwayat` | Riwayat | `HistoryView.vue` | Cari, buka detail inline, lanjutkan, hapus |

URL lama tetap nyambung: `/daftar` → tab daftar di Auth,
`/hasil` → Analisis, `/dokumen/:id` → Riwayat, halaman tak dikenal → Beranda.

| Komponen | File | Dipakai |
|---|---|---|
| Header | `AppHeader.vue` | Navigasi + auth |
| Footer | `AppFooter.vue` | Tautan + kontak |
| Tombol | `BaseButton.vue` | Semua aksi |
| Kartu | `BaseCard.vue` | Semua panel |
| Input | `FormInput.vue` | Form auth |
| Judul seksi | `SectionHeading.vue` | Label bernomor tiap seksi |
| Nilai | `ScoreRing.vue` | Skor analisis |
| Saran | `SuggestionCard.vue` | Terima/tolak/ubah saran |

Logika sorotan teks, ringkasan kategori, dan baris riwayat diinline
di halamannya masing-masing supaya hitungannya pas 8 komponen.

## Cara jalanin

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Fitur interaktif

Form auth/analisis pakai validasi, modal konfirmasi simpen sama hapus,
sorotan teks yang bisa diklik, saran bisa diterima/ditolak/diubah sendiri,
terima semua sekaligus, nyaring saran per kategori, pencarian di riwayat,
salin hasil revisi, unduh .txt.

## Catatan

Nggak ada backend beneran. Data akun sama riwayat disimpen di browser
(localStorage), analisisnya jalan di `src/utils/analyzer.js`.
Jadi kalau ganti browser atau hapus data web, ilang semua. Maklum.

File use case ada di `usecase-runut.txt`.
