// Dokumen & riwayat pemeriksaan. Tanpa login memakai ruang 'tamu',
// dengan login memakai ruang per akun. Keduanya tersimpan lokal.
import { auth } from './auth'
import { DEMO_DOCS } from '../utils/dummy'

const storage = (mode) => {
  try {
    const s = mode === 'session' ? sessionStorage : localStorage
    s.setItem('__t', '1'); s.removeItem('__t')
    return s
  } catch { return null }
}
const mem = new Map()
const fallback = (mode) => ({
  getItem: (k) => (mem.has(mode + k) ? mem.get(mode + k) : null),
  setItem: (k, v) => mem.set(mode + k, String(v)),
  removeItem: (k) => mem.delete(mode + k),
})
const ls = () => storage('local') ?? fallback('local')
const ss = () => storage('session') ?? fallback('session')

const key = () => `runut_docs_${auth.user?.id ?? 'tamu'}`
const all = () => { try { return JSON.parse(ls().getItem(key())) ?? [] } catch { return [] } }
const persist = (docs) => { try { ls().setItem(key(), JSON.stringify(docs)) } catch {} }

// Draf aktif (dokumen yang sedang dianalisis)
let current = null

// Isi data contoh sekali per ruang (tamu / akun) supaya Riwayat tidak kosong.
const seed = () => {
  const flag = 'runut_seed_' + key()
  if (ls().getItem(flag)) return
  try { ls().setItem(flag, '1') } catch {}
  if (!all().length) persist(DEMO_DOCS)
}

export const documents = {
  list: () => (seed(), all().sort((a, b) => b.updated_at - a.updated_at)),
  get: (id) => all().find((d) => d.id === id),
  setCurrent(doc) { current = doc; try { ss().setItem('runut_current', JSON.stringify(doc)) } catch {} },
  getCurrent() { try { return current ?? JSON.parse(ss().getItem('runut_current') || 'null') } catch { return current } },
  save(doc) {
    const docs = all().filter((d) => d.id !== doc.id)
    docs.push({ ...doc, updated_at: Date.now() }); persist(docs)
  },
  remove(id) { persist(all().filter((d) => d.id !== id)) },
}
