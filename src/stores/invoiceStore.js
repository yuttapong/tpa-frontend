import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { toast } from 'vue3-toastify'
import { useAppStore } from './appStore'

const appStore = useAppStore()
export const useInvoiceStore = defineStore('invoice', {
  state: () => {
    return {
      cartLoading: false,
      cartMsgError: '',
      cartMsgSuccess: '',
      form: {
        vat_percent: appStore.settings.vat,
        items: []
      },
      carts: [],
      invoice: {},
      items: [],
    }
  },
  getters: {
    countCart(state) {
      return state.carts.length
    },
    myCartItems(state) {
      return state.carts ? state.carts.filter((i) => i.staff_id == appStore.user?.id) : []
    },
    countMyCart(state) {
      return state.myCartItems.length || 0
    },
  },
  actions: {
    hasSelectedItem(item) {
      if (!this.carts) return false
      let find = this.carts.filter((row) => {
        if (item.item_id == row.item_id) {
          return row
        }
      })
      return find.length > 0 ? true : false
    },

    async addItem(item) {
      this.cartLoading = true
      const exist = this.hasSelectedItem(item)
      if (item.discount === undefined) {
        item.discount = 0
      }
      if (item.price === undefined) {
        item.price = 0
      }
      if (!exist) {
        const { data } = await api.post('v2/invoices/cart', item).catch((err) => {
          this.cartMsgError = err.response?.data.message
          this.cartLoading = false
          toast(this.cartMsgError, {
            autoclose: 5000,
            theme: 'auto',
            type: 'danger',
            dangerouslyHTMLString: true,
          })
        })
        if (data) {
          this.cartLoading = false
          this.cartMsgSuccess = data?.message
          this.carts.push(data.data)
        }
      } else {
        this.cartLoading = false
      }
    },
    async removeItem(item) {
      this.cartLoading = true
      const { data } = await api
        .delete('v2/invoices/cart', item.item_id)
        .catch(() => (this.cartLoading = false))
      if (data) {
        let index = this.carts.indexOf(item)
        this.carts.splice(index, 1)
      }
      this.cartLoading = false
    },
    async loadCart() {
      this.cartLoading = true
      const { data } = await api.get('v2/invoices/cart').catch(() => (this.cartLoading = false))
      console.log(data)
      this.carts = data
      this.cartLoading = false
    },
    async setCartItems(items) {
      this.carts = items
    },
    async saveCartItems() {
      this.cartLoading = true
      const { data } = await api
        .put('v2/invoices/cart', this.carts)
        .catch(() => (this.cartLoading = false))

      this.cartLoading = false
    },
    async resetCart() {
      this.cartLoading = true
      const { data } = await api
        .delete('v2/invoices/cart/empty', {
          data: {
            reset: 'yes',
          },
        })
        .catch(() => (this.cartLoading = false))
      if (data) {
        this.carts = []
      }
      this.cartLoading = false
    },

    async emptyCart() {
      let items = this.carts ? this.carts.map((i) => i.item_id) : []
      if (items.length === 0) return false

      this.cartLoading = true
      const { data } = await api
        .delete('v2/invoices/cart', {
          data: {
            items: items,
          },
        })
        .catch(() => (this.cartLoading = false))
      if (data) {
        this.carts = []
      }
      this.cartLoading = false
    },
    async removeCart(items) {
      this.cartLoading = true
      const { data } = await api
        .delete('v2/invoices/cart', {
          data: {
            items: items,
          },
        })
        .catch(() => (this.cartLoading = false))
      if (data) {
        this.loadCart()
      }
      return data
      this.cartLoading = false
    },
    setForm(data) {
      this.form = data
    },
    setInvoice(data) {
      this.invoice = data
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['form'] }],
  },
})
