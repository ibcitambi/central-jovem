import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
