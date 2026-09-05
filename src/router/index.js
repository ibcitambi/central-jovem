import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import SorteioView from '../pages/SorteioView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Constantes' },
    },
    {
      path: '/sorteio',
      name: 'sorteio',
      component: SorteioView,
      meta: { title: 'Sorteador' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const domain = to.meta.title || 'Central Jovem'
  document.title = `IBCI | ${domain}`
})

export default router
