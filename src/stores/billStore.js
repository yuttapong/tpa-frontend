import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBillStore = defineStore('invoice', {
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
        if (item.code == row.code) {
          return row
        }
      })
      console.log(find)
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
      this.selectedItems.push(item)
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