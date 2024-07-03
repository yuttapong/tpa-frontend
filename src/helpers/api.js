import axios from 'axios'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'vue-router'
import router from '@/router'
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
// http.interceptors.response.use(undefined, (error) => {
//   // const router = useRouter()
//   console.log(error)
//   if (error) {
//     const appStore = new useAppStore()

//     switch (error.response.status) {
//       case 401:
//         console.log('ปปปปปปปปปปป')
//         appStore.logout()
//         router.replace('/login')
//         return error.response.data
//         break
//       case 403:
//       // default:
//       // return Promise.reject(error)
//     }
//   }
// })
export const api = http
