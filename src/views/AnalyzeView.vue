<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import SectionHeading from '../components/SectionHeading.vue'
import BaseCard from '../components/BaseCard.vue'
import ScoreRing from '../components/ScoreRing.vue'
import SuggestionCard from '../components/SuggestionCard.vue'
import { analyze, applySuggestions, CATEGORIES } from '../utils/analyzer'
import { documents } from '../store/documents'
import { downloadText, downloadBlob } from '../utils/download'

// Halaman Analisis: formulir masukan dan hasil dalam satu halaman
const SAMPLE = `Menulis adalah hal yang sangat penting bagi pelajar. Menulis membantu kita berpikir dengan runtut. Selain itu, menulis juga sangat penting untuk karier. Selain itu, banyak orang gak sadar kalau tulisan mereka terasa kaku banget. Saya sering menulis setiap hari, dan aku merasa kemampuan menulis sangat penting untuk masa depan, karena dengan menulis kita bisa menyampaikan gagasan, membangun argumen yang kuat, serta meyakinkan pembaca bahwa ide yang kita sampaikan memang layak untuk dipertimbangkan secara serius oleh banyak pihak.`

const title = ref('')
const text = ref('')
const loading = ref(false)
const error = ref('')
const notice = ref('')
const filter = ref(null)
const selected = ref(null)
const confirmSave = ref(false)
const MAX = 5000

const doc = ref(documents.getCurrent() || null)
if (doc.value) {
  title.value = doc.value.title === 'Dokumen tanpa judul' ? '' : doc.value.title
  text.value = doc.value.original_text
}

const words = computed(() => (text.value.trim() ? text.value.trim().split(/\s+/).length : 0))
const revised = computed(() => (doc.value ? applySuggestions(doc.value.original_text, doc.value.result.issues) : ''))
const pending = computed(() => doc.value?.result.issues.filter((i) => i.status === 'pending' && (!filter.value || i.type === filter.value)) ?? [])
const decided = computed(() => doc.value?.result.issues.filter((i) => i.status !== 'pending').length ?? 0)

const parts = computed(() => {
  if (!doc.value) return []
  const out = []
  let pos = 0
  const t = doc.value.original_text
  doc.value.result.issues.filter((i) => i.status === 'pending').forEach((i) => {
    if (i.start > pos) out.push({ t: t.slice(pos, i.start) })
    out.push({ t: t.slice(i.start, i.end), issue: i })
    pos = i.end
  })
  out.push({ t: t.slice(pos) })
  return out
})

function say(msg) { notice.value = msg; clearTimeout(say.t); say.t = setTimeout(() => (notice.value = ''), 2600) }
function persist() { documents.setCurrent(doc.value) }

function run() {
  error.value = ''
  if (words.value < 20) return (error.value = 'Teks terlalu pendek. Minimal 20 kata.')
  if (words.value > MAX) return (error.value = `Teks terlalu panjang. Maksimal ${MAX} kata.`)
  loading.value = true
  setTimeout(() => {
    const result = analyze(text.value)
    doc.value = { id: 'd' + Date.now(), title: title.value.trim() || 'Dokumen tanpa judul', original_text: text.value, result }
    documents.setCurrent(doc.value)
    filter.value = null
    selected.value = null
    loading.value = false
    say('Analisis selesai. Hasil ditampilkan di bawah.')
    setTimeout(() => document.getElementById('hasil-analisis')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, 900)
}

async function onFile(e) {
  const f = e.target.files[0]; if (!f) return
  const lower = f.name.toLowerCase()
  if (lower.endsWith('.pdf')) {
    error.value = ''
    say('Mengekstrak teks dari PDF…')
    try {
      const { extractTextFromPdf } = await import('../utils/pdf')
      const r = await extractTextFromPdf(f)
      if (r.text.split(/\s+/).filter(Boolean).length < 20) return (error.value = 'Teks dalam PDF terlalu pendek. Minimal 20 kata.')
      text.value = r.text; title.value ||= f.name.replace(/\.pdf$/i, '')
      say(`Teks dari ${r.pages} halaman PDF berhasil dimuat.`)
    } catch { error.value = 'PDF tidak dapat dibaca. Coba berkas lain atau salin teksnya manual.' }
    return
  }
  if (!lower.endsWith('.txt')) return (error.value = 'Format berkas harus .txt atau .pdf.')
  f.text().then((t) => { text.value = t; title.value ||= f.name.replace(/\.txt$/i, '') })
}

function accept(id, draft) {
  const i = doc.value.result.issues.find((x) => x.id === id)
  i.suggestion = draft; i.status = 'accepted'; persist(); say('Saran diterapkan.')
}
function reject(id) { doc.value.result.issues.find((x) => x.id === id).status = 'rejected'; persist() }
function acceptAll() { pending.value.forEach((i) => (i.status = 'accepted')); persist(); say('Seluruh saran diterapkan.') }
function pick(id) {
  selected.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
function askSave() {
  if (!doc.value) return
  confirmSave.value ? doSave() : (confirmSave.value = true)
}
function doSave() { documents.save(doc.value); persist(); confirmSave.value = false; say('Dokumen tersimpan di riwayat.') }
async function download(which, format) {
  const safe = (doc.value.title || 'dokumen').replace('�', '-').slice(0, 60) || 'dokumen'
  if (format === 'pdf') {
    const { buildResultPdf } = await import('../utils/report')
    const r = doc.value.result
    const stats = r.words_count + ' kata · ' + r.sentences_count + ' kalimat · ' + r.issues.length + ' temuan · Skor ' + r.score + '/100'
      + (r.metrics ? ' · Kemiripan ' + r.metrics.similarity_pct + '% · Indikasi AI ' + r.metrics.ai_pct + '% (' + r.metrics.ai_level + ')' : '')
    const summary = r.summary.map((s) => {
      const label = (CATEGORIES[s.type] && CATEGORIES[s.type].label) || s.type
      const val = s.pct !== null && s.pct !== undefined ? s.pct + '%' : s.count + ' temuan'
      return '- ' + label + ': ' + val
    }).join('\n')
    const blob = buildResultPdf({
      title: doc.value.title,
      dateStr: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
      stats: stats,
      issuesSummary: summary,
      revised: revised.value || '(belum ada revisi yang diterapkan)',
    })
    downloadBlob(safe + '-' + which + '.pdf', blob); say('Berkas PDF berhasil diunduh.')
    return
  }
  const t = which === 'asli' ? doc.value.original_text : revised.value
  downloadText(safe + '-' + which + '.txt', t); say('Berkas berhasil diunduh.')
}
async function copy() {
  try { await navigator.clipboard.writeText(revised.value); say('Hasil revisi berhasil disalin.') }
  catch { say('Penyalinan gagal. Silakan salin secara manual.') }
}
function resetAll() {
  doc.value = null
  title.value = ''
  text.value = ''
  filter.value = null
  selected.value = null
}
</script>

<template>
  <div>
    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="grid gap-8 md:grid-cols-[5fr_7fr]">
        <div>
          <SectionHeading>Analisis Baru</SectionHeading>
          <h1 class="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-6xl">Periksa tulisan Anda</h1>
          <p class="mt-4 text-black/70">Salin dan tempel teks atau unggah berkas .txt dan .pdf. Hasil analisis akan tampil di halaman yang sama.</p>
          <div class="swiss-dots mt-8 border-2 border-black bg-[#F2F2F2] p-6">
            <p class="font-mono text-xs uppercase tracking-widest text-[#FF3000]">Ketentuan</p>
            <ul class="mt-3 space-y-2 text-sm font-bold uppercase tracking-wide">
              <li class="flex gap-2"><span class="text-[#FF3000]">■</span> Minimal 20 kata</li>
              <li class="flex gap-2"><span class="text-[#FF3000]">■</span> Maksimal 5.000 kata</li>
              <li class="flex gap-2"><span class="text-[#FF3000]">■</span> Unggahan .txt dan .pdf</li>
            </ul>
          </div>
        </div>

        <BaseCard class="flex flex-col">
          <div class="border-b-2 border-black p-4 sm:p-6">
            <input v-model="title" placeholder="JUDUL DOKUMEN" class="w-full bg-transparent text-xl font-black uppercase tracking-tight placeholder:text-black/30 focus:outline-none" />
          </div>
          <textarea v-model="text" rows="14" placeholder="Tulis atau tempel teks di sini…"
            class="w-full flex-1 resize-y bg-transparent p-4 text-[15px] leading-7 focus:outline-none sm:p-6"></textarea>
          <div class="flex flex-col gap-3 border-t-2 border-black p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div class="flex flex-wrap items-center gap-2">
              <label class="swiss-snap-fast min-h-[44px] cursor-pointer border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white">
                <i class="fa-solid fa-file-arrow-up mr-1.5"></i>Unggah .txt/.pdf<input type="file" accept=".txt,.pdf" class="hidden" @change="onFile" />
              </label>
              <button class="swiss-snap-fast min-h-[44px] border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white" @click="text = SAMPLE; title ||= 'Contoh esai'"><i class="fa-solid fa-flask mr-1.5"></i>Contoh</button>
              <button v-if="text" class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-widest text-black/60 hover:text-[#FF3000]" @click="text = ''">Bersihkan</button>
            </div>
            <div class="flex items-center gap-4">
              <span :class="['font-mono text-xs font-bold', words > MAX ? 'bg-[#FF3000] px-2 py-1 text-white' : '']">{{ words }} / {{ MAX }} kata</span>
              <BaseButton :disabled="loading" @click="run">
                <i :class="['fa-solid', loading ? 'fa-circle-notch fa-spin' : 'fa-wand-magic-sparkles']"></i>
                {{ loading ? 'Menganalisis…' : 'Analisis' }}
              </BaseButton>
            </div>
          </div>
          <p v-if="error" class="border-t-2 border-black bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white sm:px-6"><i class="fa-solid fa-circle-exclamation mr-2 text-[#FF3000]"></i>{{ error }}</p>
        </BaseCard>
      </div>
    </section>

    <section v-if="doc" id="hasil-analisis" class="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6">
      <div class="border-t-4 border-black pt-10">
        <SectionHeading>Hasil Analisis</SectionHeading>
        <div class="mb-8 mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 class="max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">{{ doc.title }}</h2>
            <p class="mt-3 font-mono text-xs uppercase tracking-widest text-black/60">{{ doc.result.words_count }} kata · {{ doc.result.sentences_count }} kalimat · {{ doc.result.issues.length }} temuan</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <BaseButton variant="secondary" size="sm" @click="resetAll"><i class="fa-solid fa-arrow-left"></i>Teks Baru</BaseButton>
            <BaseButton variant="secondary" size="sm" @click="askSave"><i class="fa-regular fa-floppy-disk"></i>Simpan</BaseButton>
            <BaseButton variant="accent" size="sm" @click="download('revisi', 'txt')"><i class="fa-solid fa-download"></i>Unduh .txt</BaseButton>
            <BaseButton variant="accent" size="sm" @click="download('revisi', 'pdf')"><i class="fa-solid fa-file-pdf"></i>Unduh .pdf</BaseButton>
          </div>
        </div>

        <p v-if="notice" class="mb-6 flex items-center gap-3 border-2 border-black bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
          <span class="flex h-6 w-6 items-center justify-center bg-[#FF3000]"><i class="fa-solid fa-check text-xs"></i></span>{{ notice }}
        </p>

        <div class="grid gap-6 lg:grid-cols-[7fr_5fr]">
          <div class="flex flex-col gap-6">
            <BaseCard class="p-6 sm:p-8">
              <ScoreRing :score="doc.result.score" />
              <div v-if="doc.result.metrics" class="mt-6 grid gap-3 sm:grid-cols-2">
                <div class="border-2 border-black p-4">
                  <p class="font-mono text-xs uppercase tracking-widest text-[#FF3000]"><i class="fa-solid fa-clone mr-1.5"></i>Kemiripan Teks</p>
                  <p class="mt-2 text-4xl font-black tracking-tighter">{{ doc.result.metrics.similarity_pct }}<span class="text-lg">%</span></p>
                  <p class="mt-1 text-xs text-black/60">{{ doc.result.metrics.similarity_pairs }} pasangan kalimat serupa</p>
                </div>
                <div class="border-2 border-black p-4">
                  <p class="font-mono text-xs uppercase tracking-widest text-[#FF3000]"><i class="fa-solid fa-robot mr-1.5"></i>Indikasi AI</p>
                  <p class="mt-2 text-4xl font-black tracking-tighter">{{ doc.result.metrics.ai_pct }}<span class="text-lg">%</span></p>
                  <p class="mt-1 inline-block bg-black px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white">{{ doc.result.metrics.ai_level }}</p>
                  <p class="mt-2 text-xs text-black/60">{{ doc.result.metrics.ai_signals.join(' · ') }}</p>
                </div>
              </div>
              <div class="mt-6 border-t-2 border-black pt-6">
                <div class="border-2 border-black">
                  <button v-for="s in doc.result.summary" :key="s.type" @click="filter = filter === s.type ? null : s.type"
                    :aria-pressed="filter === s.type"
                    :class="['swiss-snap-fast flex w-full min-h-[44px] items-center gap-4 border-b-2 border-black px-4 py-3 text-left last:border-b-0', filter === s.type ? 'bg-black text-white' : 'bg-white hover:bg-[#F2F2F2]']">
                    <span class="font-mono text-xs font-medium text-[#FF3000]">{{ CATEGORIES[s.type].num }}</span>
                    <i :class="['fa-solid w-4 text-sm', CATEGORIES[s.type].icon]"></i>
                    <span class="flex-1 text-xs font-bold uppercase tracking-wide">{{ CATEGORIES[s.type].label }}</span>
                    <span v-if="s.pct !== null && s.pct !== undefined" class="bg-[#FF3000] px-2 py-1 font-mono text-sm font-black tabular-nums text-white">{{ s.pct }}%</span>
                    <span v-else class="font-mono text-2xl font-black tabular-nums">{{ s.count }}</span>
                  </button>
                </div>
              </div>
            </BaseCard>

            <BaseCard class="p-6 sm:p-8">
              <p class="mb-4 font-mono text-xs uppercase tracking-widest text-[#FF3000]">Teks Dengan Sorotan</p>
              <div class="whitespace-pre-wrap text-[15px] leading-8 text-black">
                <template v-for="(p, idx) in parts" :key="idx">
                  <mark v-if="p.issue" :id="p.issue.id" @click="pick(p.issue.id)" class="swiss-mark"
                    :style="selected === p.issue.id
                      ? { background: '#000000', color: '#FFFFFF', boxShadow: 'none' }
                      : { background: 'transparent', boxShadow: 'inset 0 -3px 0 #FF3000' }">{{ p.t }}</mark>
                  <span v-else>{{ p.t }}</span>
                </template>
              </div>
            </BaseCard>

            <div class="grid gap-6 md:grid-cols-2">
              <BaseCard>
                <div class="flex items-center justify-between border-b-2 border-black px-6 py-3">
                  <span class="font-mono text-xs font-bold tracking-widest text-[#FF3000]">SEBELUM</span>
                  <span class="flex gap-2"><button class="font-mono text-xs font-bold uppercase hover:text-[#FF3000]" @click="download('asli', 'txt')"><i class="fa-solid fa-download mr-1"></i>.txt</button><button class="font-mono text-xs font-bold uppercase hover:text-[#FF3000]" @click="download('asli', 'pdf')"><i class="fa-solid fa-file-pdf mr-1"></i>.pdf</button></span>
                </div>
                <p class="whitespace-pre-wrap p-6 text-[15px] leading-8 text-black/70">{{ doc.original_text }}</p>
              </BaseCard>
              <BaseCard class="!border-[#FF3000]">
                <div class="flex items-center justify-between border-b-2 border-[#FF3000] bg-[#FF3000] px-6 py-3 font-mono text-xs font-bold tracking-widest text-white">
                  <span>SESUDAH</span>
                  <button class="uppercase hover:underline" @click="copy"><i class="fa-regular fa-copy mr-1"></i>Salin</button>
                </div>
                <p class="whitespace-pre-wrap p-6 text-[15px] font-medium leading-8">{{ revised }}</p>
              </BaseCard>
            </div>
            <p class="font-mono text-xs uppercase tracking-widest text-black/60"><span class="bg-black px-2 py-1 text-white">{{ decided }} saran telah diproses</span></p>
          </div>

          <aside class="lg:sticky lg:top-24 lg:self-start">
            <BaseCard>
              <div class="flex items-center justify-between border-b-2 border-black px-4 py-3">
                <h3 class="font-black uppercase tracking-tight">Daftar Saran</h3>
                <button v-if="pending.length" class="font-mono text-xs font-bold uppercase tracking-widest text-[#FF3000] hover:underline" @click="acceptAll">Terima Semua</button>
              </div>
              <div class="max-h-[70vh] space-y-3 overflow-y-auto p-4">
                <SuggestionCard v-for="i in pending" :id="i.id" :key="i.id" :issue="i" :selected="selected === i.id" @pick="selected = $event" @accept="accept" @reject="reject" />
                <div v-if="!pending.length" class="border-2 border-black bg-[#F2F2F2] py-10 text-center text-sm font-bold uppercase tracking-wide">
                  <i class="fa-regular fa-circle-check mb-2 block text-2xl"></i>Semua saran telah diproses.
                </div>
              </div>
            </BaseCard>
          </aside>
        </div>
      </div>
    </section>

    <teleport to="body">
      <transition name="fade">
        <div v-if="confirmSave" class="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" @click.self="confirmSave = false">
          <div role="dialog" aria-modal="true" class="w-full max-w-md border-4 border-black bg-white p-6 sm:p-8">
            <div class="mb-4 flex items-start justify-between gap-4 border-b-2 border-black pb-4">
              <h2 class="text-lg font-black uppercase tracking-tight">Simpan ke riwayat?</h2>
              <button class="flex h-11 w-11 items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white" aria-label="Tutup" @click="confirmSave = false"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <p class="border-l-4 border-[#FF3000] bg-[#F2F2F2] p-4 text-sm">Dokumen “{{ doc?.title }}” akan ditambahkan ke riwayat pemeriksaan.</p>
            <div class="mt-6 flex justify-end gap-2">
              <BaseButton variant="secondary" size="sm" @click="confirmSave = false">Batal</BaseButton>
              <BaseButton variant="accent" size="sm" @click="doSave">Simpan</BaseButton>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
