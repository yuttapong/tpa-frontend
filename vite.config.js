import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import dotenv from 'dotenv'
import dv from 'dotenv-expand'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
import Components from 'unplugin-vue-components/vite'

dv.expand(dotenv.config())
// https://vitejs.dev/config/

console.log('ENV', process.env.VITE_ENV)

const baseUrl =
  process.env.VITE_ENV === 'development' ? process.env.VITE_DEV_BASE_URL : process.env.VITE_BASE_URL
console.log('URL', baseUrl)

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    Components({
      resolvers: [BootstrapVueNextResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  base: baseUrl,
})
