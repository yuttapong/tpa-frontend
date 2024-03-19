import axios from 'axios'
import Cookies from 'js-cookie'

const token = Cookies.get('tpa')
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //'X-Powered-By': 'Yuttapong Napikun'
    //Authorization: token ? token : null
  },
})
export const api = http
