import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persist'
// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap's JS
import 'bootstrap'
import '@popperjs/core'
import '@/assets/js/layout.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import Quill from 'quill'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(router)
app.mount('#app')
// app.directive('click-outside', {
//   bind: function (el, binding, vnode) {
//     el.clickOutsideEvent = function (event) {
//       // here I check that click was outside the el and his children
//       if (!(el == event.target || el.contains(event.target))) {
//         // and if it did, call method provided in attribute value
//         vnode.context[binding.expression](event)
//       }
//     }
//     document.body.addEventListener('click', el.clickOutsideEvent)
//   },
//   unbind: function (el) {
//     document.body.removeEventListener('click', el.clickOutsideEvent)
//   },
// })

if (import.meta.env.DEV) {
  console.log('ENV', import.meta.env)
}
