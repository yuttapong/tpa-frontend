import axios from 'axios'
import Cookies from 'js-cookie'
const token = Cookies.get('token')
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Authorization: token ? token : null,
  },
})
http.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    config.headers['Authorization'] = `${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export const api = http
