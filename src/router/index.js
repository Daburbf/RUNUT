import { createRouter, createWebHashHistory } from 'vue-router'
import { auth } from '../store/auth'

// Struktur standar: 5 halaman, semuanya terbuka tanpa login.
// Akun bersifat opsional (profil lokal per peramban).
const routes = [
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/tentang', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/masuk', name: 'auth', component: () => import('../views/AuthView.vue'), meta: { guest: true } },
  { path: '/analisis', name: 'analyze', component: () => import('../views/AnalyzeView.vue') },
  { path: '/riwayat', name: 'history', component: () => import('../views/HistoryView.vue') },
  // URL lama tetap nyambung ke halaman barunya
  { path: '/daftar', redirect: { path: '/masuk', query: { mode: 'daftar' } } },
  { path: '/hasil', redirect: '/analisis' },
  { path: '/dokumen/:id', redirect: '/riwayat' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  // Hash history: tidak butuh rewrite server, tidak 404 saat refresh/deep-link
  // di hosting statis mana pun (root maupun subpath). URL jadi /#/analisis dst.
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  if (to.meta.guest && auth.user) return { name: 'analyze' }
})

export default router
