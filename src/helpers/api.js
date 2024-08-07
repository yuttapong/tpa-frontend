import axios from 'axios'
import { useAppStore } from '@/stores/appStore'
import router from '@/router'
import { useModalController, useModal } from 'bootstrap-vue-next'

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
    console.log('error', error)
    return Promise.reject(error)
  },
)
http.interceptors.response.use(
  // (rs) => rs,
  // (error) => {
  //   if (error) {
  //     switch (error.response.status) {
  //       case 401:
  //         console.log('401')
  //         appStore.logout()
  //         router.replace('/login')
  //         break
  //       case 403:
  //       default:
  //         return Promise.reject(error)
  //     }
  //   }
  // },
  (rs) => responseHandler(rs),
  (err) => responseErrorHandler(err),
)

function responseHandler(response) {
  const config = response?.config
  if (config.raw) {
    return response
  }
  if (response.status == 200 || response.status == 201 || response.status == 204) {
    const data = response?.data
    if (!data) {
      throw new HttpError('API Error. No data!')
    }
    return response
  }
  throw new HttpError('API Error! Invalid status code!')
}

function responseErrorHandler(response) {
  // const config = response?.config
  // console.log('confing', response)
  // if (config.raw) {
  //   return response
  // }
  return httpErrorHandler(response)
}
function httpErrorHandler(error) {
  const appStore = new useAppStore()
  if (error === null) throw new Error('Unrecoverable error!! Error is null!')
  if (axios.isAxiosError(error)) {
    //here we have a type guard check, error inside this if will be treated as AxiosError
    const response = error?.response
    const request = error?.request
    const config = error?.config //here we have access the config used to make the api call (we can make a retry using this conf)

    if (error.code === 'ERR_NETWORK') {
      console.log('connection problems..')
    } else if (error.code === 'ERR_CANCELED') {
      console.log('connection canceled..')
    }
    if (response) {
      //The request was made and the server responded with a status code that falls out of the range of 2xx the http status code mentioned above
      const statusCode = response?.status
      if (statusCode === 404) {
        console.log('The requested resource does not exist or has been deleted')
      } else if (statusCode === 401) {
        console.log('Please login to access this resource')
        router.replace('/login')
        appStore.logout()
      } else if (statusCode === 403) {
        router.push('/erro403')
      } else if (statusCode === 422) {
        const { confirm } = useModalController()
        const modal = useModal()
        modal.show?.({ props: { title: `Promise resolved to ${response}`, variant: 'info' } })
        console.log('Please check input is valid')
      } else if (statusCode === 500) {
        //router.push('/error500')
      }
      return response
    } else if (request) {
      //The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
    }
  }
  console.log(error.message)
}

export const api = http
