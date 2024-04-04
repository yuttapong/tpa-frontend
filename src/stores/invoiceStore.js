import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useInvoiceStore = defineStore('invoice', {
  state: () => {
    return {
      selectedItems: [],
    }
  },
  getters: {
    items(state) {
      return state.selectedItems
    },
    countItems(state) {
      return state.selectedItems.length
    },
  },
  actions: {
    hasSelectedItem(item) {
      let find = this.selectedItems.filter((row) => {
        if (row.item_code !== undefined && item.item_code == row.item_code) {
          return row
        }
      })
      return find.length > 0 ? true : false
    },

    addItem(item) {
      const exist = this.hasSelectedItem(item)
      console.log('exist', exist)
      if (item.discount === undefined) {
        item.discount = 0
      }
      if (item.price === undefined) {
        item.price = 0
      }
      if (!exist) {
        this.selectedItems.push(item)
      }
    },
    removeItem(item) {
      let index = this.selectedItems.indexOf(item)
      this.selectedItems.splice(index, 1)
    },
    updateItems(items) {
      this.selectedItems = items
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['selectedItems'] }],
  },
})
