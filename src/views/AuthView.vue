<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormInput from '../components/FormInput.vue'
import BaseButton from '../components/BaseButton.vue'
import SectionHeading from '../components/SectionHeading.vue'
import logoUrl from '/images/logo.svg'
import { auth } from '../store/auth'

// Halaman autentikasi dengan dua mode: masuk dan pendaftaran
const route = useRoute()
const router = useRouter()
const mode = ref(route.query.mode === 'daftar' ? 'daftar' : 'masuk')
watch(() => route.query.mode, (v) => {
  mode.value = v === 'daftar' ? 'daftar' : 'masuk'
  err.value = {}
  ok.value = ''
})

const login = ref({ email: '', password: '' })
const reg = ref({ name: '', email: '', password: '', confirm: '' })
const err = ref({})
const ok = ref('')

function go() {
  router.push(route.query.redirect || '/analisis')
}

function submitLogin() {
  err.value = {}
  ok.value = ''
  if (!login.value.email || !login.value.password) {
    err.value = { general: 'Alamat email dan kata sandi wajib diisi.' }
    return
  }
  try {
    auth.login(login.value.email.trim(), login.value.password)
    ok.value = `Selamat datang kembali, ${auth.user.name}. Mengalihkan…`
    setTimeout(go, 500)
  } catch (e) { err.value = { general: e.message } }
}

function submitRegister() {
  err.value = {}
  ok.value = ''
  const f = reg.value
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Nama minimal 2 karakter.'
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Format alamat email tidak valid.'
  if (f.password.length < 8) e.password = 'Kata sandi minimal 8 karakter.'
  if (f.password !== f.confirm) e.confirm = 'Konfirmasi kata sandi tidak sama.'
  if (Object.keys(e).length) { err.value = e; return }
  try {
    auth.register({ name: f.name.trim(), email: f.email.trim(), password: f.password })
    auth.login(f.email.trim(), f.password)
    ok.value = 'Akun berhasil dibuat. Mengalihkan…'
    setTimeout(go, 500)
  } catch (ex) { err.value = { email: ex.message } }
}

function switchMode(m) {
  router.replace({ path: '/masuk', query: { ...route.query, mode: m } })
}
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
    <div class="grid border-4 border-black md:grid-cols-[7fr_5fr]">
      <div class="swiss-dots relative hidden flex-col justify-between bg-black p-8 text-white md:flex md:p-12">
        <div class="flex items-center gap-3">
          <img :src="logoUrl" alt="" class="h-10 w-10 border-2 border-white" />
          <span class="text-xl font-black uppercase tracking-tighter">Runut</span>
        </div>
        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-[#FF3000]">Manfaat Akun</p>
          <p class="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tighter">Periksa<br />tulisan<br />sebelum<br />dikumpulkan.</p>
          <p class="mt-6 max-w-xs text-sm leading-relaxed text-white/70">Analisis pola tulisan beserta riwayat pemeriksaan dalam satu tempat.</p>
        </div>
        <p class="font-mono text-[11px] uppercase tracking-widest text-white/50">RUNUT — 2026</p>
      </div>

      <div class="bg-white p-6 sm:p-8 md:p-12">
        <SectionHeading>Akun</SectionHeading>
        <div class="mb-8 mt-6 grid grid-cols-2 border-2 border-black" role="tablist" aria-label="Pilih masuk atau daftar">
          <button role="tab" :aria-selected="mode === 'masuk'" @click="switchMode('masuk')"
            :class="['min-h-[44px] text-xs font-bold uppercase tracking-widest', mode === 'masuk' ? 'bg-black text-white' : 'bg-white hover:bg-[#F2F2F2]']">Masuk</button>
          <button role="tab" :aria-selected="mode === 'daftar'" @click="switchMode('daftar')"
            :class="['min-h-[44px] border-l-2 border-black text-xs font-bold uppercase tracking-widest', mode === 'daftar' ? 'bg-black text-white' : 'bg-white hover:bg-[#F2F2F2]']">Daftar</button>
        </div>

        <div v-if="mode === 'masuk'">
          <h1 class="text-3xl font-black uppercase tracking-tighter">Masuk</h1>
          <p class="mb-8 mt-2 text-sm text-black/60">Masuk untuk melanjutkan pemeriksaan.</p>
          <form class="space-y-4" @submit.prevent="submitLogin">
            <FormInput v-model="login.email" label="Email" type="email" icon="fa-envelope" placeholder="nama@email.com" />
            <FormInput v-model="login.password" label="Kata Sandi" type="password" icon="fa-lock" placeholder="••••••••" />
            <p v-if="err.general" class="border-2 border-black bg-black px-3 py-2 text-sm font-bold uppercase tracking-wide text-white"><span class="text-[#FF3000]">■</span> {{ err.general }}</p>
            <p v-if="ok" class="border-2 border-black bg-[#F2F2F2] px-3 py-2 text-sm font-bold uppercase tracking-wide"><span class="text-[#FF3000]">■</span> {{ ok }}</p>
            <BaseButton type="submit" class="w-full">Masuk</BaseButton>
          </form>
          <p class="mt-6 border-t-2 border-black pt-6 text-center text-sm">Belum memiliki akun?
            <button class="font-bold uppercase tracking-wide underline decoration-[#FF3000] decoration-2 underline-offset-4 hover:text-[#FF3000]" @click="switchMode('daftar')">Daftar</button>
          </p>
        </div>

        <div v-else>
          <h1 class="text-3xl font-black uppercase tracking-tighter">Buat Akun</h1>
          <p class="mb-8 mt-2 text-sm text-black/60">Gratis dan selesai dalam waktu kurang dari satu menit.</p>
          <form class="space-y-4" @submit.prevent="submitRegister">
            <FormInput v-model="reg.name" label="Nama" icon="fa-user" :error="err.name" />
            <FormInput v-model="reg.email" label="Email" type="email" icon="fa-envelope" :error="err.email" />
            <FormInput v-model="reg.password" label="Kata Sandi" type="password" icon="fa-lock" :error="err.password" />
            <FormInput v-model="reg.confirm" label="Konfirmasi Kata Sandi" type="password" icon="fa-lock" :error="err.confirm" />
            <p v-if="ok" class="border-2 border-black bg-[#F2F2F2] px-3 py-2 text-sm font-bold uppercase tracking-wide"><span class="text-[#FF3000]">■</span> {{ ok }}</p>
            <BaseButton type="submit" class="w-full">Daftar</BaseButton>
          </form>
          <p class="mt-6 border-t-2 border-black pt-6 text-center text-sm">Sudah memiliki akun?
            <button class="font-bold uppercase tracking-wide underline decoration-[#FF3000] decoration-2 underline-offset-4 hover:text-[#FF3000]" @click="switchMode('masuk')">Masuk</button>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
