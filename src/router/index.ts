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
      path: '/index',
      name: 'index',
      component: () => import('../views/index.vue'),
      children: [
        {
          path: '/user',
          name: 'user',
          component: () => import('../views/user/user.vue'),
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/home.vue'),
        },
        {
          path: '/expert',
          name: 'expert',
          component: () => import('../views/expert.vue'),
        },
      ]
    },


  ],
})

export default router
