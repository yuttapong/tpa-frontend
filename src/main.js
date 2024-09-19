import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persist'
import VueSweetalert2 from 'vue-sweetalert2'

// Import our custom CSS
import '@/assets/scss/styles.scss'
import 'vue3-toastify/dist/index.css'
import 'vue3-easy-data-table/dist/style.css'
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'

// Import all of Bootstrap's JS
import 'bootstrap'
import '@popperjs/core'
import '@/assets/js/layout.js'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import VueAwesomePaginate from 'vue-awesome-paginate'
import 'vue-awesome-paginate/dist/style.css'
import { abilitiesPlugin } from '@casl/vue'
import { createMongoAbility } from '@casl/ability'
import Vue3Toasity from 'vue3-toastify'
import { createBootstrap } from 'bootstrap-vue-next'
import Spinner from './components/Spinner.vue'

const ability = createMongoAbility()

const pinia = createPinia()
pinia.use(piniaPersist)
pinia.use(({ store }) => {
  store.ability = markRaw(ability)
})

const app = createApp(App)

app.use(pinia)
app.use(abilitiesPlugin, ability)
app.use(router)
app.use(createBootstrap())
app.use(VueSweetalert2)
window.Swal = app.config.globalProperties.$swal
app.use(VueAwesomePaginate)
app.use(Vue3Toasity, {
  autoClose: 3000,
})
app.component('EasyDataTable', Vue3EasyDataTable)
app.mount('#app')

if (import.meta.env.DEV) {
  //console.log('ENV', import.meta.env)
}
