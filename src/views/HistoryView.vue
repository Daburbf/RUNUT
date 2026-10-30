<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import SectionHeading from '../components/SectionHeading.vue'
import BaseCard from '../components/BaseCard.vue'
import ScoreRing from '../components/ScoreRing.vue'
import { documents } from '../store/documents'
import { applySuggestions } from '../utils/analyzer'

// Halaman Riwayat: daftar dokumen beserta pratinjau dan pengelolaan
const docs = ref(documents.list())
const q = ref('')
const opened = ref(null)
const target = ref(null)
const notice = ref('')
const filtered = computed(() => docs.value.filter((d) => d.title.toLowerCase().includes(q.value.toLowerCase())))
const fmt = (t) => new Date(t).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

function say(msg) { notice.value = msg; clearTimeout(say.t); say.t = setTimeout(() => (notice.value = ''), 2600) }
function refresh() { docs.value = documents.list() }
function open(doc) {
  opened.value = opened.value?.id === doc.id ? null : doc
  if (opened.value) setTimeout(() => document.getElementById('detail-' + doc.id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
}
function resume(doc) {
  documents.setCurrent(doc)
  say('Dokumen dibuka kembali di halaman Analisis.')
}
function confirmRemove() { documents.remove(target.value.id); refresh(); if (opened.value?.id === target.value.id) opened.value = null; target.value = null; say('Dokumen telah dihapus.') }
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div class="grid gap-8 md:grid-cols-[5fr_7fr] md:items-end">
      <div>
        <SectionHeading>Riwayat</SectionHeading>
        <h1 class="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl md:text-6xl">Riwayat Pemeriksaan</h1>
      </div>
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm"></i>
        <input v-model="q" placeholder="CARI BERDASARKAN JUDUL…" class="h-12 w-full border-2 border-black bg-white pl-11 pr-3 text-sm font-bold uppercase tracking-wide placeholder:text-black/30 focus:border-[#FF3000] focus:outline-none" />
      </div>
    </div>

    <p v-if="notice" class="mt-6 flex items-center gap-3 border-2 border-black bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
      <span class="flex h-6 w-6 items-center justify-center bg-[#FF3000]"><i class="fa-solid fa-check text-xs"></i></span>{{ notice }}
    </p>

    <div v-if="filtered.length" class="mt-8 border-t-4 border-black">
      <div class="hidden grid-cols-[1fr_140px] gap-4 border-b-2 border-black py-2 font-mono text-[11px] uppercase tracking-widest text-black/50 sm:grid">
        <span>Dokumen</span><span class="text-right">Aksi</span>
      </div>
      <div class="flex flex-col gap-4 py-6">
        <div v-for="d in filtered" :key="d.id">
          <BaseCard class="swiss-snap group flex flex-col gap-4 p-5 hover:bg-black hover:text-white sm:flex-row sm:items-center">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-white text-black group-hover:border-white"><i class="fa-regular fa-file-lines text-lg"></i></div>
            <div class="min-w-0 flex-1">
              <h3 class="truncate font-black uppercase tracking-tight">{{ d.title }}</h3>
              <p class="mt-0.5 truncate text-sm opacity-60">{{ d.original_text.slice(0, 90) }}…</p>
              <p class="mt-1 font-mono text-[11px] uppercase tracking-widest opacity-60">{{ fmt(d.updated_at) }} · {{ d.result.issues.length }} temuan · skor {{ d.result.score }}</p>
            </div>
            <div class="flex gap-2">
              <button class="min-h-[44px] border-2 border-black bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white group-hover:border-white hover:!border-[#FF3000] hover:!bg-[#FF3000]" @click="open(d)"><i class="fa-solid fa-arrow-up-right-from-square mr-1.5"></i>{{ opened?.id === d.id ? 'Tutup' : 'Pratinjau' }}</button>
              <button class="flex min-h-[44px] min-w-[44px] items-center justify-center border-2 border-black px-3 py-2 text-sm group-hover:border-white hover:!border-[#FF3000] hover:!bg-[#FF3000] hover:!text-white" aria-label="Hapus" @click="target = d"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </BaseCard>

          <div v-if="opened?.id === d.id" :id="'detail-' + d.id" class="mt-4 grid scroll-mt-24 gap-4 md:grid-cols-2">
            <BaseCard class="p-6">
              <ScoreRing :score="d.result.score" />
              <p class="mt-4 text-sm leading-7 text-black/70">
                Ringkasan kondisi dokumen pada pemeriksaan terakhir.
                Pilih lanjutkan untuk meninjau kembali seluruh saran di halaman Analisis.
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <BaseButton size="sm" to="/analisis" @click="resume(d)">Lanjutkan <i class="fa-solid fa-arrow-right text-xs"></i></BaseButton>
                <BaseButton variant="secondary" size="sm" @click="opened = null">Tutup</BaseButton>
              </div>
            </BaseCard>
            <BaseCard>
              <div class="border-b-2 border-black bg-[#F2F2F2] px-6 py-3">
                <span class="font-mono text-xs font-bold uppercase tracking-widest text-[#FF3000]">Hasil Revisi Terakhir</span>
              </div>
              <p class="max-h-[320px] overflow-y-auto whitespace-pre-wrap p-6 text-[15px] leading-8">{{ applySuggestions(d.original_text, d.result.issues) }}</p>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-8 flex flex-col items-center border-4 border-black bg-[#F2F2F2] px-6 py-16 text-center">
      <span class="mb-6 flex h-20 w-20 items-center justify-center border-2 border-black bg-white"><i class="fa-regular fa-folder-open text-3xl"></i></span>
      <p class="font-black uppercase tracking-tight">{{ q ? 'Tidak ditemukan dokumen yang sesuai.' : 'Belum ada dokumen yang diperiksa.' }}</p>
      <p class="mb-6 mt-1 text-sm text-black/60">Dokumen yang disimpan setelah analisis akan tercatat di sini.</p>
      <BaseButton to="/analisis">Mulai Analisis</BaseButton>
    </div>

    <teleport to="body">
      <transition name="fade">
        <div v-if="target" class="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" @click.self="target = null">
          <div role="dialog" aria-modal="true" class="w-full max-w-md border-4 border-black bg-white p-6 sm:p-8">
            <div class="mb-4 flex items-start justify-between gap-4 border-b-2 border-black pb-4">
              <h2 class="text-lg font-black uppercase tracking-tight">Hapus dokumen?</h2>
              <button class="flex h-11 w-11 items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white" aria-label="Tutup" @click="target = null"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <p class="border-l-4 border-[#FF3000] bg-[#F2F2F2] p-4 text-sm">Dokumen “{{ target?.title }}” akan dihapus permanen dan tidak dapat dikembalikan.</p>
            <div class="mt-6 flex justify-end gap-2">
              <BaseButton variant="secondary" size="sm" @click="target = null">Batal</BaseButton>
              <BaseButton variant="accent" size="sm" @click="confirmRemove">Hapus</BaseButton>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </section>
</template>
