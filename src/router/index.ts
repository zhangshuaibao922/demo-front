import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/index.vue'),
      children: [
        {
          path: '/user',
          name: 'user',
          component: () => import('../views/user.vue'),
        },
        {
          path: '/page2',
          name: 'page2',
          component: () => import('../views/page2.vue'),
        },
      ]
    },


  ],
})

export default router
