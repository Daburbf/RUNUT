<script setup>
import BaseButton from '../components/BaseButton.vue'
import SectionHeading from '../components/SectionHeading.vue'
import BaseCard from '../components/BaseCard.vue'
import { CATEGORIES } from '../utils/analyzer'
const desc = {
  repetition: 'Pengulangan kata yang tidak disadari akan ditandai sekaligus diberi alternatifnya.',
  sentence: 'Kalimat yang terlalu panjang disarankan untuk dipecah agar mudah dibaca.',
  similarity: 'Pasangan kalimat dengan isi serupa terdeteksi lengkap dengan persentasenya.',
  ai: 'Memeriksa apakah naskah terdengar seperti tulisan generatif atau tulisan manusia.',
  formality: 'Kata tidak baku disarankan ke bentuk yang sesuai untuk tulisan formal.',
  consistency: 'Peralihan kata ganti yang tidak konsisten akan diingatkan.',
}
const steps = [
  { n: '01', t: 'Tempel tulisan', d: 'Salin dan tempel teks atau unggah berkas .txt. Tersedia teks contoh untuk mencoba fitur.' },
  { n: '02', t: 'Tinjau sorotan', d: 'Bagian yang berulang, kaku, atau generik diberi garis bawah. Pilih sorotan untuk melihat sarannya.' },
  { n: '03', t: 'Proses satu per satu', d: 'Setiap saran dapat diterima, ditolak, atau disesuaikan secara manual.' },
]
const keys = Object.keys(CATEGORIES)
</script>

<template>
  <div>
    <!-- 01 / HERO -->
    <section class="border-b-4 border-black">
      <div class="mx-auto grid max-w-6xl md:grid-cols-[8fr_4fr]">
        <div class="px-4 py-14 sm:px-6 md:py-24">
          <SectionHeading>01 / Sistem — Analisis Pola Tulisan</SectionHeading>
          <h1 class="mt-6 text-[2.75rem] font-black uppercase leading-[0.9] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Tulisan Anda,<br />lebih <span class="bg-[#FF3000] px-2 text-white">runut</span>.
          </h1>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-black/70">
            Untuk tugas, esai, dan laporan berbahasa Indonesia.
            Tempel naskah dan lihat bagian mana saja yang perlu diperbaiki.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <BaseButton to="/analisis" size="lg">Mulai Sekarang <i class="fa-solid fa-arrow-right text-xs"></i></BaseButton>
            <BaseButton to="/tentang" variant="secondary" size="lg">Tentang Runut</BaseButton>
          </div>
          <div class="mt-10 flex flex-wrap gap-6 border-t-2 border-black pt-6">
            <p class="font-mono text-xs uppercase tracking-widest"><span class="text-2xl font-black">6</span><br />Aspek Pemeriksaan</p>
            <p class="font-mono text-xs uppercase tracking-widest"><span class="text-2xl font-black">5K</span><br />Batas Kata</p>
            <p class="font-mono text-xs uppercase tracking-widest"><span class="text-2xl font-black">ID</span><br />Bahasa Indonesia</p>
          </div>
        </div>
        <div class="relative min-h-[260px] overflow-hidden border-t-4 border-black bg-[#F2F2F2] sm:min-h-[380px] md:min-h-[480px] md:border-l-4 md:border-t-0 md:flex" aria-hidden="true">
          <img src="/images/yunani.png" alt="" class="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>

    <!-- 02 / KATEGORI -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeading>02 / Aspek Pemeriksaan — Enam Hal</SectionHeading>
      <div class="mt-6 grid gap-8 md:grid-cols-[5fr_7fr] md:items-end">
        <h2 class="text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">Bukan Sekadar Typo. Melainkan Kebiasaan.</h2>
        <p class="text-black/70 md:pb-1">Fokus pada kebiasaan kecil yang membuat tulisan terasa monoton dan sering luput disadari saat menulis.</p>
      </div>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BaseCard v-for="(k, i) in keys" :key="k" class="swiss-snap group flex min-h-[280px] cursor-default flex-col justify-between p-8 hover:bg-[#FF3000] hover:text-white">
          <div class="flex items-start justify-between">
            <span class="font-mono text-sm font-medium text-[#FF3000] group-hover:text-white">{{ CATEGORIES[k].num || `0${i + 1}` }}</span>
            <i class="fa-solid fa-arrow-right -rotate-45 text-xl transition-transform duration-200 group-hover:rotate-0"></i>
          </div>
          <div>
            <div class="mb-4 flex h-12 w-12 items-center justify-center border-2 border-black group-hover:border-white">
              <i :class="['fa-solid text-lg', CATEGORIES[k].icon]"></i>
            </div>
            <h3 class="text-lg font-black uppercase tracking-tight">{{ CATEGORIES[k].label }}</h3>
            <p class="mt-2 text-sm leading-relaxed opacity-70">{{ desc[k] }}</p>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- 03 / CARA KERJA -->
    <section class="border-y-4 border-black bg-[#F2F2F2]">
      <div class="swiss-diagonal mx-auto grid max-w-6xl md:grid-cols-[5fr_7fr]">
        <div class="border-b-4 border-black p-8 md:border-b-0 md:border-r-4 md:p-12">
          <SectionHeading>03 / Cara Kerja</SectionHeading>
          <h2 class="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-5xl">Tiga Langkah Sederhana.</h2>
        </div>
        <div>
          <div v-for="s in steps" :key="s.n" class="swiss-snap group flex gap-6 border-b-4 border-black bg-white p-8 last:border-b-0 hover:bg-black hover:text-white md:p-10">
            <p class="font-mono text-4xl font-black text-[#FF3000]">{{ s.n }}</p>
            <div>
              <h3 class="text-xl font-black uppercase tracking-tight">{{ s.t }}</h3>
              <p class="mt-2 text-sm opacity-70">{{ s.d }}</p>
            </div>
            <i class="fa-solid fa-plus ml-auto self-start text-xl transition-transform duration-200 group-hover:rotate-90 group-hover:text-[#FF3000]"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- 04 / CTA -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div class="border-4 border-black bg-black p-8 text-white md:p-16">
        <SectionHeading>04 / Mulai</SectionHeading>
        <h2 class="mt-6 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-tighter sm:text-4xl md:text-7xl">Periksa Naskah Anda Sekarang.</h2>
        <p class="mt-4 max-w-xl text-white/60">Tanpa login. Langsung tempel teks dan lihat hasilnya.</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <BaseButton to="/analisis" variant="accent" size="lg">Mulai Menulis</BaseButton>
          <BaseButton to="/riwayat" variant="ghost" size="lg" class="!border-white !text-white hover:!bg-white hover:!text-black">Lihat Riwayat</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
