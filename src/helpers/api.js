import axios from 'axios'
import Cookies from 'js-cookie'

const token = Cookies.get('tpa')
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //Authorization: token ? token : null,
  },
})
http.interceptors.request.use(
  (config) => {
    // config.headers['Authorization'] = `${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export const api = http
