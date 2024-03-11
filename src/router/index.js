import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/Main.vue'),
      children: [
        {
          path: '',
          redirect: 'dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/Profile.vue')
        },

        {
          path: 'home',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/About.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/401',
      name: 'error401',
      component: () => import('../views/Error401.vue')
    },
    {
      path: '/403',
      name: 'error403',
      component: () => import('../views/Error403.vue')
    },
    {
      path: '/404',
      name: 'error404',
      component: () => import('../views/Error404.vue')
    },
    {
      path: '/500',
      name: 'error500',
      component: () => import('../views/Error404.vue')
    }
  ]
})

export default router
