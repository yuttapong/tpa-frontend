import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap's JS
import 'bootstrap'
import '@popperjs/core'
import '@/assets/js/layout.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import Quill from 'quill'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

if (import.meta.env.DEV) {
  console.log('ENV', import.meta.env)
}
