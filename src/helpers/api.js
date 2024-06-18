import axios from 'axios'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'vue-router'
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
http.interceptors.response.use(undefined, (error) => {
  const router = useRouter()
  const appStore = new useAppStore()
  switch (error.response.status) {
    case 401:
      appStore.logout()
      router('/login')
      break
    case 403:
    // your processing here
    default:
      return Promise.reject(error)
  }
})
export const api = http
