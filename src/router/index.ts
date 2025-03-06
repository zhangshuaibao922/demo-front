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
        {
          path: '/task',
          name: 'task',
          component: () => import('../views/task.vue'),
        },
        {
          path: '/taskinfo',
          name: 'taskinfo',
          component: () => import('../views/taskinfo.vue'),
        },
        {
          path: '/taskresult',
          name: 'taskresult',
          component: () => import('../views/taskresult.vue'),
        },
      ]
    },


  ],
})

export default router
