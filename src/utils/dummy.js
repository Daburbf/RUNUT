// Data contoh (dummy) supaya halaman Riwayat langsung berisi saat pertama dibuka.
// Hasil analisis dihitung lewat mesin asli, jadi angkanya konsisten.
import { analyze } from './analyzer'

const build = (id, title, text, days, accepted = 0) => {
  const result = analyze(text)
  result.issues.slice(0, accepted).forEach((i) => (i.status = 'accepted'))
  return { id, title, original_text: text, result, updated_at: Date.now() - days * 864e5 }
}

export const DEMO_DOCS = [
  build('demo-1', 'Esai: Literasi Digital Mahasiswa', `Literasi digital sangat penting bagi pelajar di era sekarang. Sangat penting karena hampir semua aktivitas belajar sudah berpindah ke layar. Selain itu, literasi digital juga sangat penting untuk dunia kerja nanti. Banyak orang gak sadar kalau kemampuan ini terasa kaku banget waktu dipakai. Saya sering membaca artikel panjang setiap hari, dan aku merasa kebiasaan itu membuat cara berpikir jadi lebih runut, karena dengan membaca kita bisa memilah informasi, membangun argumen yang kuat, serta meyakinkan pembaca bahwa gagasan yang kita sampaikan memang layak dipertimbangkan secara serius oleh banyak pihak.`, 1, 3),
  build('demo-2', 'Laporan Praktikum Kimia Dasar', `Praktikum kali ini membahas titrasi asam basa dengan larutan natrium hidroksida. Hasil pengamatan menunjukkan bahwa volume titik ekuivalen berada di kisaran dua belas mililiter. Dengan demikian, konsentrasi larutan sampel dapat dihitung memakai rumus pengenceran. Praktikan cuma melakukan tiga kali pengulangan karena waktu di laboratorium terbatas, jadi hasilnya belum begitu meyakinkan. Pengulangan perlu ditambah agar simpulan yang diambil tidak terlalu jauh dari nilai sebenarnya.`, 3),
  build('demo-3', 'Paper: Pola Tulisan Mahasiswa', `Tulisan mahasiswa sering terjebak pada pola yang berulang. Pola berulang itu muncul karena kebiasaan menulis cepat tanpa membaca ulang. Kemiripan teks antar paragraf juga sering ditemukan pada laporan yang disusun mendekati tenggat. Selain itu, penggunaan kata yang itu itu saja membuat paragraf terasa datar. Penulis sebaiknya memeriksa ulang naskah, memecah kalimat yang terlalu panjang, dan mengganti kata yang terlalu sering muncul supaya tulisan terasa lebih hidup.`, 6, 2),
]
