import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
const BASE_URL = 'https://test-appscal.tpacal.or.th/appcal002/'
// https://vitejs.dev/config/
console.log("process.env", process.env)
export default defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  base: process.env.MODE === 'development' ? "/" : BASE_URL,
})
