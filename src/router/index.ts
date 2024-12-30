import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login.vue'
import WelCome from '../views/welcome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => LoginView,
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => WelCome,
    },
  ],
})

export default router
