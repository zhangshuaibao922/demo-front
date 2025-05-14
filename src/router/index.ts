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
      path: '/login',
      name: 'login',
      component: () => LoginView,
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/create.vue'),
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
          component: () => import('../views/dashboard.vue'),
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
        {
          path: '/taskresultone',
          name: 'taskresultone',
          component: () => import('../views/taskresultOne.vue'),
        },
        {
          path: '/taskone',
          name: 'taskone',
          component: () => import('../views/taskOne.vue'),
        },
        {
          path: '/taskoneresult',
          name: 'taskoneresult',
          component: () => import('../views/taskOneResult.vue'),
        },
        {
          path: '/score',
          name: 'score',
          component: () => import('../views/score.vue'),
        },
      ]
    },


  ],
})

export default router
