<template>
  <div>
    <div class="modal" ref="modalElement">
      <div class="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-toolbar">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button"
                    role="tab" aria-controls="home" aria-selected="true">
                    <i class="bi bi-person"></i>
                    ลูกค้า ({{ pagination.total }})
                  </button>
                </li>

                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button"
                    role="tab" aria-controls="contact" aria-selected="false">
                    <i class="bi bi-person-vcard"></i>
                    รายชื่อ ({{ contacts.length }})
                  </button>
                </li>
              </ul>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-2">
            <div class="tab-content" id="customer">
              <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <form @submit.prevent="searchCustomer()">
                  <div class="d-flex gap-2">
                    <div>
                      <button type="reset" class="btn btn-primary btn-sm ms-1">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                    <div class="">
                      <input type="search" v-model="formSearch.q" class="form-control form-control-sm"
                        placeholder="ชื่อบริษัท" autofocus @keyup.enter="searchCustomer()" />
                    </div>
                    <div class="">
                      <input type="search" v-model="formSearch.taxnumber" class="form-control form-control-sm"
                        placeholder="taxnumber" @keyup.enter="searchCustomer()" />
                    </div>

                    <div class="">
                      <button type="submit" class="btn btn-light btn-sm" :disabled="loading">
                        <i class="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                </form>

                <div class="spinner-border" role="status" v-if="loading">
                  <span class="visually-hidden">Loading...</span>
                </div>

                <ul class="list-unstyled my-2">
                  <li v-for="(item, index) in items" :key="index" :class="{ 'bg-info': item.id == selectedCustomers.id } + ' border bg-light mb-2 row'
                    ">
                    <div class="col-1">
                      <input class="form-check-input mt-3 ms-2" type="radio" v-model="selectedCustomers" :value="item"
                        @click="clickCustomer(item)" />
                    </div>

                    <div class="col-8 ms-4">
                      #{{ item.id }}
                      <i class="bi bi-person-fill"></i>
                      <span class="fw-bold">{{ item.companyname }}</span>
                      <div v-if="item.companynameen" class="mx-1 p-1">
                        <small class="text-danger"> {{ item.companynameen }}</small>
                        <small class="mx-2"> TaxID : {{ item.taxnumber }}</small>
                        <small class="mx-2" v-if="item.idcard"> IDCard : {{ item.idcard }}</small>
                      </div>
                    </div>
                    <div class="col-1">
                      <button class="btn btn-link btn-sm text-right" @click="editCustomer(item, index)">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                <form @submit.prevent="onSearchContact()">
                  <div class="d-flex gap-2">
                    <div>
                      <button type="reset" class="btn btn-primary btn-sm ms-1">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                    <div class="">
                      <input type="search" v-model="formSearchContact.q" class="form-control form-control-sm"
                        placeholder="ชื่อ" autofocus @keyup.enter="onSearchContact()" />
                    </div>

                    <div class="">
                      <button type="submit" class="btn btn-light btn-sm" :disabled="loadingContact">
                        <i class="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                </form>
                <ul class="list-unstyled my-2">
                  <li v-for="(item, index) in contacts" :key="index" :class="{ 'bg-info': item.id == selectedContacts.id } + ' border bg-light my-2 ps-2'
                    ">
                    <div class="float-start d-inline-block">
                      <input class="form-check-input" type="radio" v-model="selectedContacts" :value="item" />
                    </div>

                    <div class="d-inline-block ms-3">
                      {{ item.contactname }}
                      <div class="text-secondary">
                        <small class="mx-2" v-if="item.contacttel1"><i class="bi bi-phone"></i> {{ item.contacttel1
                        }}</small>
                        <small class="mx-2" v-if="item.contacttel2"><i class="bi bi-phone"></i> {{ item.contacttel2
                        }}</small>
                      </div>
                    </div>
                    <div class="float-end d-inline-block">
                      #{{ item.id }}
                      <button type="button" class="btn btn-link btn-sm">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer d-block">
            <!-- <span class="fw-bold bg-danger text-white p-1"> {{ selectedItems.length }}</span> -->

            <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
              :max-pages-shown="5" v-model="pagination.current_page" :on-click="onChangePage" class="" />
            <div class="float-end">
              <div class="input-group input-group-sm">
                <button type="button" class="btn btn-primary btn-sm" @click="select"
                  v-show="selectedCustomers.id || selectedContacts.contactid">
                  <i class="bi bi-check-circle"></i> เลือก
                </button>
                <button type="button" class="btn btn-danger btn-sm" @click="onClearAll">
                  <i class="bi bi-trash"></i> ไม่เลือก
                </button>
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                  <i class="bi bi-x"></i> ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'onSelect'])
const props = defineProps({
  visible: {
    type: Boolean,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  data: {
    type: Object,
    default: () => { },
  },
  title: {
    type: String,
    default: 'บริษัท',
  },
})

let modal = null
const appStore = useAppStore()
let modalElement = ref(null)
const items = ref([])
const contacts = ref([])
const selectedCustomers = ref([])
const selectedContacts = ref([])
const loading = ref(false)
const loadingContact = ref(false)
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const formSearch = ref({
  code: '',
  q: '',
})
const formSearchContact = ref({
  code: '',
  q: '',
})

const searchCustomer = async () => {
  pagination.value.current_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) { }
  emit('onSearch', formSearch.value)
}
const onChangePage = async (page) => {
  pagination.value.current_page = page
  try {
    loadData()
  } catch (error) { }
}
const loadData = async () => {
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/customers', {
    params: params,
  })
  if (data) {
    const p = {
      total: data?.total,
      current_page: data?.current_page,
      per_page: data?.per_page,
      page_count: data?.last_page,
    }
    pagination.value = p
    items.value = data.data
    loading.value = false
  }
}
const loadContactByCustomerId = async (customerId) => {
  if (customerId) {
    loadingContact.value = true
    let params = {
      ...formSearchContact.value,
    }
    const { data } = await api.get(`/v2/customers/${customerId}/contacts`, {
      params: params,
    })
    if (data) {
      contacts.value = data
    }
    loadingContact.value = false
  }
}

const onSearchContact = () => {
  loadContactByCustomerId(selectedCustomers.value.id)
}

const editCustomer = (row, index) => {
  console.log(row, index)
}
const onClearAll = (row, index) => {
  console.log('clear customer')
  selectedCustomers.value = []
  selectedContacts.value = []
  emit('clear', {
    customers: selectedCustomers.value,
    contacts: selectedContacts.value,
  })
  emit('onHide', selectedCustomers.value)
  modal.hide()
}
const onClearCustomer = (row, index) => {
  console.log('clear customer')
  selectedCustomers.value = []
  emit('clearCustomer', {
    customers: selectedCustomers.value,
  })
}
const onClearContact = (row, index) => {
  console.log('clear contact')
  selectedContacts.value = []
  emit('clearContact', {
    contacts: selectedContacts.value,
  })
}

const show = () => {
  searchCustomer()
  emit('onShow', selectedCustomers.value)
  modal.show()
}
const hide = () => {
  emit('onHide', selectedCustomers.value)
  modal.hide()
}

const select = () => {
  emit('onSelect', {
    customers: selectedCustomers.value,
    contacts: selectedContacts.value,
  })
  selectedCustomers.value = []
  selectedContacts.value = []
  modal.hide()
  emit('onHide')
}
const clickCustomer = (item) => {
  console.log('click', item)
  loadContactByCustomerId(item.id)
}
onMounted(() => {
  modal = new Modal(modalElement.value)

})
// watch(props.customer, (p) => {
//   if (p.customer) {
//     formSearch.value.customer_id = p.customer?.id
//     searchCustomer()
//   }
// })
defineExpose({ show, hide })
</script>
<style lang="scss" scoped>
td,
th {
  font-size: 13px;
}

input[type='radio'] {
  transform: scale(2);
  margin: 3px;
}
</style>
