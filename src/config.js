export const baseUrl =
  import.meta.env.VITE_ENV == 'development'
    ? import.meta.env.VITE_DEV_API_URL
    : import.meta.env.VITE_API_URL
export const timezone = 'Asia/Bangkok'
