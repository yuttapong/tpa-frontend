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
        redirect: 'dashboard',
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/Profile.vue'),
      },
      {
        path: 'quotations',
        name: 'quotations',
        component: () => import('../views/quotation/Quotations.vue'),
      },
      {
        path: 'bills',
        name: 'bills',
        component: () => import('../views/bill/Bills.vue'),
      },
      {
        path: 'workoders',
        name: 'workoders',
        component: () => import('../views/bill/Workorders.vue'),
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('../views/invoice/Invoices.vue'),
      },
      {
        path: 'certificates',
        name: 'certificates',
        component: () => import('../views/certificate/Certificates.vue'),
      },
      {
        path: '/data/products',
        name: 'data.products',
        component: () => import('../views/product/Products.vue'),
      },
      {
        path: '/data/stdinstruments',
        name: 'data.stdinstruments',
        component: () => import('../views/stdinstrument/StandardInstruments.vue'),
      },
      {
        path: '/data/staffs',
        name: 'data.staffs',
        component: () => import('../views/staff/Staffs.vue'),
      },
      {
        path: '/data/customers',
        name: 'data.customers',
        component: () => import('../views/customer/Customers.vue'),
      },
      {
        path: '/data/contacts',
        name: 'data.contacts',
        component: () => import('../views/contact/Contacts.vue'),
      },
      {
        path: '/data/company',
        name: 'data.company',
        component: () => import('../views/company/Company.vue'),
      },
      {
        path: '/data/positions',
        name: 'positions',
        component: () => import('../views/company/Positions.vue'),
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/About.vue'),
      },
      {
        path: 'setting/staff',
        name: 'setting.staff',
        component: () => import('../views/staff/Staffs.vue'),
      },
      {
        path: 'setting/permission',
        name: 'setting.permission',
        component: () => import('../views/role/Roles.vue'),
      },
      {
        path: 'setting/product',
        name: 'setting.product',
        component: () => import('../views/product/Products.vue'),
      },
      {
        path: 'setting/stdinstrument',
        name: 'setting.stdinstrument',
        component: () => import('../views/stdinstrument/StandardInstruments.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/error401',
    name: 'error401',
    component: () => import('../views/error/Error401.vue'),
  },
  {
    path: '/error403',
    name: 'error403',
    component: () => import('../views/error/Error403.vue'),
  },
  {
    path: '/error404',
    name: 'error404',
    component: () => import('../views/error/Error404.vue'),
  },
  {
    path: '/error500',
    name: 'error500',
    component: () => import('../views/error/Error500.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/error/Error404.vue'),
  },
]
export default createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes,
})
