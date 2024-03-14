import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '',
        name: 'default',
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
        path: 'quotations',
        name: 'quotations',
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'bills',
        name: 'bills',
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'invoices',
        name: 'invoices',
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
      },
      {
        path: 'setting/staff',
        name: 'setting.staff',
        component: () => import('../views/Error404.vue')
      },
      {
        path: 'setting/permission',
        name: 'setting.permission',
        component: () => import('../views/Error404.vue')
      },
      {
        path: 'setting/product',
        name: 'setting.product',
        component: () => import('../views/Error404.vue')
      },
      {
        path: 'setting/stdinstrument',
        name: 'setting.stdinstrument',
        component: () => import('../views/Error404.vue')
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
    path: '/error401',
    name: 'error401',
    component: () => import('../views/Error401.vue')
  },
  {
    path: '/error403',
    name: 'error403',
    component: () => import('../views/Error403.vue')
  },
  {
    path: '/error404',
    name: 'error404',
    component: () => import('../views/Error404.vue')
  },
  {
    path: '/error500',
    name: 'error500',
    component: () => import('../views/Error500.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/Error404.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
