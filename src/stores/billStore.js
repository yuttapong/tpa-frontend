import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBillStore = defineStore('bill', {
  state: () => {
    return {
      formMode: 'add',
      formAdd: {
        id: 0,
        bill_code: '',
        document_date: '',
        items: [],
        company_id: '',
        address_name: '',
        address_detail: '',
        cert_address_name: '',
        cert_address_detail: '',
        agent_id: '',
        agent_name: '',
        status: '',
        bill_status: '',
        service_status_id: 0,
        vat_percent: 7,
        vat: 0,
      },
      formEdit: {},
      workorder: {},
      items: [],
    }
  },
  getters: {
    formItems(state) {
      return state.items
    },
    countFormItems(state) {
      return state.items ? state.formItems.length : 0
    },
  },
  actions: {
    hasSelectedItem(item) {
      if (this.formItems.length === 0) return false
      let find = this.items.filter((row) => {
        if (item.code == row.code) {
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
      this.items.push(item)
    },

    removeItem(item) {
      let index = this.items.indexOf(item)
      this.items.splice(index, 1)
    },
    setItems(items) {
      this.items = items
    },
    setForm(data) {
      this.form = data
    },
    setWorkOrder(data) {
      this.workorder = data
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: [] }],
  },
})
