import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  const permissions = useLocalStorage('permissions', [])
  const accesstoken = useLocalStorage('accesstoken', '')
  const expiredAt = useLocalStorage('expiredAt', '')
  const user = useLocalStorage('user', {})
  const settings = useLocalStorage('settings', {
    lang: 'th_TH',
    timezone: 'Asia/Bangkok',
    page: {
      perPage: 20,
      maxPageShow: 10,
    },
  })
  const token = computed(() => accesstoken.value)

  function isLoggedIn() {
    return !!accesstoken.value
  }
  function setExpired(data) {
    return (expiredAt.value = data)
  }
  function setUser(data) {
    return (user.value = data)
  }
  function setToken(data) {
    return (accesstoken.value = data)
  }
  function setSetting(data) {
    return (settings.value = data)
  }
  function setPermissions(data) {
    return (permissions.value = data)
  }
  function login(token, user, permissions = []) {
    setExpired('')
    setToken(token)
    setUser(user)
    setPermissions(permissions)
  }
  function logout() {
    expiredAt.value = ''
    accesstoken.value = ''
    user.value = {}
    setPermissions([])
  }

  return {
    accesstoken,
    user,
    token,
    isLoggedIn,
    setUser,
    setExpired,
    setToken,
    logout,
    login,
    settings,
    setSetting,
    setPermissions,
  }
})