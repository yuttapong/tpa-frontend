import { defineStore } from 'pinia'

export const useInvoiceStore = defineStore('invoice', {
  state: () => {
    return {
      form:{},
      carts: [],
    }
  },
  getters: {
    items(state) {
      return state.carts
    },
    countItems(state) {
      return state.carts.length
    },
  },
  actions: {
    hasSelectedItem(item) {
      console.log("hassl", item);
      let find = this.carts.filter((row) => {
        if (item.item_code == row.item_code) {
          return row
        }
      })
      return find.length > 0 ? true : false
    },

    addItem(item) {
      const exist = this.hasSelectedItem(item)
      if (item.discount === undefined) {
        item.discount = 0
      }
      if (item.price === undefined) {
        item.price = 0
      }
      if (!exist) {
        this.carts.push(item)
      }
    },
    removeItem(item) {
      let index = this.carts.indexOf(item)
      this.carts.splice(index, 1)
    },
    updateItems(items) {
      this.carts = items
    },
    setForm(data) {
      this.form = data
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['form','carts'] }],
  },
})
