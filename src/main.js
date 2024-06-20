import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persist'
// Import our custom CSS
import '@/assets/scss/styles.scss'

// Import all of Bootstrap's JS
import 'bootstrap'
import '@popperjs/core'
import '@/assets/js/layout.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import VueAwesomePaginate from 'vue-awesome-paginate'
import 'vue-awesome-paginate/dist/style.css'
import { abilitiesPlugin } from '@casl/vue'
import { createMongoAbility } from '@casl/ability'
import Vue3Toasity from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const ability = createMongoAbility()

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersist)

pinia.use(({ store }) => {
  store.ability = markRaw(ability)
})
app.use(abilitiesPlugin, ability)
app.use(pinia)
app.use(router)

app.use(VueAwesomePaginate)
app.use(Vue3Toasity, {
  autoClose: 3000,
})
app.component('EasyDataTable', Vue3EasyDataTable)
app.mount('#app')

if (import.meta.env.DEV) {
  console.log('ENV', import.meta.env)
}
