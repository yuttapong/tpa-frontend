import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { AbilityBuilder } from '@casl/ability'

export const useAppStore = defineStore('app', () => {
  const accesstoken = useLocalStorage('accesstoken', '')
  const expiredAt = useLocalStorage('expiredAt', '')
  const user = useLocalStorage('user', {})
  const settingData = useLocalStorage('settingData', {
    lang: 'th_TH',
    timezone: 'Asia/Bangkok',
    page: {
      perPage: 10,
      maxPageShow: 5,
    },
    vat: 7,
  })

  const ability = ref()
  const permissions = computed(() => user.value?.permissions || [])
  const token = computed(() => accesstoken.value)
  const settings = computed(() => settingData.value)
  function initCasl() {
    const builder = new AbilityBuilder(ability.value)
    if (user.value.role.includes(['admin'])) {
      builder.can('read', 'Bill')
      builder.can('create', 'Bill')
      builder.can('update', 'Bill')
      builder.can('approve', 'Bill')
    }
    ability.value.update(builder.rules)
  }
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
    return (settingData.value = data)
  }
  function setPermissions(data) {
    return (permissions.value = data)
  }

  function login(token, user, permissions = []) {
    setExpired('')
    setToken(token)
    setUser(user)
  }
  function logout() {
    expiredAt.value = ''
    accesstoken.value = ''
    user.value = {}
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
    initCasl,
  }
})
