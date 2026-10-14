<script setup>
import BaseButton from '../components/BaseButton.vue'
import SectionHeading from '../components/SectionHeading.vue'
import BaseCard from '../components/BaseCard.vue'
</script>

<template>
  <div>
    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <SectionHeading>Tentang</SectionHeading>
      <h1 class="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
        Kenapa ada Runut?
      </h1>
      <div class="mt-8 grid gap-8 md:grid-cols-[7fr_5fr]">
        <div class="space-y-5 text-[15px] leading-8 text-black/80">
          <p>
            Runut adalah alat bantu untuk memeriksa pola tulisan berbahasa Indonesia.
            Cukup tempel teks, sistem akan menandai bagian yang perlu perhatian beserta saran perbaikannya.
          </p>
          <p>
            Hal yang diperiksa bersifat praktis. Pengulangan kata, kalimat yang terlalu panjang,
            kalimat yang saling mirip, frasa generik yang sering muncul pada teks generatif,
            kata tidak baku, serta gaya bahasa yang tidak konsisten.
          </p>
          <p>
            Semua keputusan tetap di tangan pengguna. Setiap saran dapat diterima, ditolak,
            atau disesuaikan secara manual. Tidak ada perubahan otomatis tanpa persetujuan.
          </p>
          <BaseCard class="border-l-4 !border-l-[#FF3000] p-5">
            <p class="text-sm leading-7">
              Catatan: data akun dan riwayat tersimpan di peramban masing masing (localStorage).
              Tidak ada server dan tidak ada data yang dikirim ke pihak lain.
              Jika berganti peramban atau menghapus data situs, riwayat ikut terhapus.
            </p>
          </BaseCard>
        </div>
        <div class="flex flex-col gap-4">
          <div class="border-4 border-black bg-black p-8 text-white">
            <p class="font-mono text-xs uppercase tracking-widest text-[#FF3000]">Prinsip</p>
            <ul class="mt-4 space-y-4">
              <li class="flex gap-3">
                <span class="font-mono font-black text-[#FF3000]">01</span>
                <p class="text-sm leading-6"><b class="uppercase">Anda yang memutuskan.</b><br /><span class="text-white/60">Saran hanya rekomendasi. Terima, tolak, atau sesuaikan sendiri.</span></p>
              </li>
              <li class="flex gap-3">
                <span class="font-mono font-black text-[#FF3000]">02</span>
                <p class="text-sm leading-6"><b class="uppercase">Hanya menandai pola.</b><br /><span class="text-white/60">Yang ditandai adalah pola yang terlihat pada teks, bukan penilaian atas penulis.</span></p>
              </li>
              <li class="flex gap-3">
                <span class="font-mono font-black text-[#FF3000]">03</span>
                <p class="text-sm leading-6"><b class="uppercase">Responsif.</b><br /><span class="text-white/60">Tampilan menyesuaikan layar ponsel, tablet, dan laptop.</span></p>
              </li>
            </ul>
          </div>
          <div class="swiss-dots border-2 border-black bg-[#F2F2F2] p-6">
            <p class="font-mono text-xs uppercase tracking-widest">Mulai dari sini</p>
            <p class="mt-2 font-black uppercase tracking-tight">Periksa tulisan sebelum dikumpulkan</p>
            <p class="mt-1 text-sm text-black/60">Tempel teks, tinjau sarannya, lalu simpan hasilnya.</p>
            <BaseButton to="/analisis" class="mt-4">Mulai analisis</BaseButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Latar belakang Runut -->
    <section class="border-t-4 border-black bg-[#F2F2F2]">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <SectionHeading>Latar belakang</SectionHeading>
        <div class="mt-6 grid gap-8 md:grid-cols-[5fr_7fr] md:items-end">
          <h2 class="text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">Alasan web ini dibuat</h2>
          <p class="text-black/70 md:pb-1">Masalah yang sering terjadi di perkuliahan dan cara Runut membantu.</p>
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <BaseCard class="p-6 sm:p-8">
            <p class="font-mono text-xs uppercase tracking-widest text-[#FF3000]">01 / Kondisi saat ini</p>
            <div class="mt-4 space-y-4 text-[15px] leading-8 text-black/80">
              <p>
                Penggunaan AI generatif semakin umum untuk menyusun laporan, esai, dan paper.
                Prosesnya cepat, tetapi di lingkungan perkuliahan hal ini menimbulkan persoalan baru.
              </p>
              <p>
                Dosen kini memeriksa indikasi penggunaan AI sebelum menilai isi tulisan.
                Jika sebuah naskah dinilai mirip hasil AI, nilainya dapat turun atau penulis diminta merevisi total.
              </p>
            </div>
          </BaseCard>
          <BaseCard class="p-6 sm:p-8">
            <p class="font-mono text-xs uppercase tracking-widest text-[#FF3000]">02 / Peran Runut</p>
            <div class="mt-4 space-y-4 text-[15px] leading-8 text-black/80">
              <p>
                Runut membantu penulis memeriksa naskahnya sendiri sebelum dikumpulkan.
                Bagian yang terdengar kaku, generik, atau menyerupai pola teks AI ditandai lebih awal
                agar dapat diperbaiki dengan bahasa sendiri.
              </p>
              <p>
                Tujuannya sederhana. Gagasan tetap berasal dari penulis, Runut membantu merapikan polanya
                sehingga naskah siap dikumpulkan dengan tenang.
              </p>
            </div>
          </BaseCard>
        </div>
        <div class="mt-4 flex flex-col gap-3 sm:flex-row">
          <BaseButton to="/analisis">Periksa tulisan sekarang</BaseButton>
          <BaseButton to="/" variant="secondary">Kembali ke beranda</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
