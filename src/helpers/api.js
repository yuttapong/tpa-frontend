import axios from 'axios'
import Cookies from 'js-cookie'
import { useAppStore } from '@/stores/appStore'
const appStore = new useAppStore()

const http = axios.create({
  baseURL:
    import.meta.env.VITE_ENV == 'development'
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
})
http.interceptors.request.use(
  (config) => {
    const appStore = new useAppStore()
    const token = `${appStore.token}`
    config.headers['Authorization'] = token
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export const api = http
