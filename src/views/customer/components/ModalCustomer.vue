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
                    Customer ({{ pagination.total }})
                  </button>
                </li>

                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button"
                    role="tab" aria-controls="contact" aria-selected="false">
                    <i class="bi bi-person-vcard"></i>
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-2">


            <div class="tab-content" id="customer">
              <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                <form @submit.prevent="onSearch()">
                  <div class="row g-2 mb-2">
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="search" v-model="formSearch.q" class="form-control form-control-sm"
                        placeholder="ชื่อบริษัท" autofocus @keyup.enter="onSearch()" />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="search" v-model="formSearch.taxnumber" class="form-control form-control-sm"
                        placeholder="taxnumber" @keyup.enter="onSearch()" />
                    </div>

                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" :disabled="loading" />
                      <button type="reset" class="btn btn-secondary btn-sm ms-1"><i class="bi bi-plus"></i></button>
                    </div>
                  </div>
                </form>
                <div class="spinner-border" role="status" v-if="loading">
                  <span class="visually-hidden">Loading...</span>
                </div>

                <ul class="list-unstyled">
                  <li v-for="(item, index) in items" :key="index" :class="{ 'bg-info': item.id == selectedCustomers.id } + ' border-bottom my-2 ps-2'
                    ">
                    <div class="float-start d-inline-block">
                      <input class="form-check-input" type="radio" v-model="selectedCustomers" :value="item"
                        @click="clickCustomer(item)" />
                    </div>

                    <div class="d-inline-block ms-4">
                      <i class="bi bi-person-fill"></i> {{ item.companyname }}
                      <div v-if="item.companynameen" class="mx-1 p-1">
                        <small class="text-danger"> {{ item.companynameen }}</small>
                        <small class="mx-2"> TaxID : {{ item.taxnumber }}</small>
                        <small class="mx-2" v-if="item.idcard"> IDCard : {{ item.idcard }}</small>
                      </div>
                    </div>
                    <div class="d-inline-block float-end">
                      <button class="btn btn-link btn-sm" @click="editCustomer(item, index)"><i
                          class="bi bi-pencil"></i></button>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                <ul class="list-unstyled">
                  <li v-for="(item, index) in contacts" :key="index" :class="{ 'bg-info': item.id == selectedContacts.id } + ' border-bottom my-2 ps-2'
                    ">
                    <div class="float-start d-inline-block">
                      <input class="form-check-input" type="radio" v-model="selectedContacts" :value="item" />
                    </div>

                    <div class="d-inline-block ms-4">
                      <i class="bi bi-person-vcard"></i> {{ item.contactname }}
                      <div v-if="item.contactname" class="mx-1 p-1">
                        <small class="text-danger"> {{ item.contactname }}</small>
                        <small class="mx-2"> tel1#{{ item.contacttel1 }}</small>
                        <small class="mx-2"> tel2#{{ item.contacttel2 }}</small>
                      </div>
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
            <button type="button" class="btn btn-primary" @click="select">
              <i class="bi bi-check-circle"></i> เลือก
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x"></i> ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
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
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const formSearch = ref({
  code: '',
  q: '',
})

const onSearch = async () => {
  pagination.value.current_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) { }
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
  const { data } = await api.get(`/v2/customers/${customerId}/contacts`)
  if (data) {
    contacts.value = data
  }
}

const editCustomer = (row, index) => {
  console.log(row, index);
}

const show = () => {
  emit('onShow', selectedCustomers.value)
  modal.show()
}
const hide = () => {
  emit('onHide', selectedCustomers.value)
  modal.hide()
}

const select = () => {
  emit('select', {
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
  loadData()
})
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
