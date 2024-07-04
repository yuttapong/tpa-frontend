import axios from 'axios'
import { useAppStore } from '@/stores/appStore'
// import { useRouter } from 'vue-router'
import router from '@/router'
const appStore = new useAppStore()
// const router = useRouter()

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
    const token = `${appStore.token}`
    config.headers['Authorization'] = token
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
http.interceptors.response.use(
  (rs) => rs,
  (error) => {
    console.log(error)
    if (error) {
      switch (error.response.status) {
        case 401:
          console.log('401')
          appStore.logout()
          router.replace('/login')
          break
        case 403:
        default:
          return Promise.reject(error)
      }
    }
  },
)
export const api = http
