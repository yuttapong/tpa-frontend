<template>
  <div class="pagetitle">
    <h1>บริษัท/ลูกค้า ({{ customerPagination.total }})</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item">ข้อมูล</li>
        <li class="breadcrumb-item active">ลูกค้า</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section profile">
    <spinner :visible="loading" />

    <div class="row" v-if="items">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <!-- Bordered Tabs -->
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-customer">
                  บริษัท ({{ customerPagination.total }})
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-category">
                  ประเภท
                </button>
              </li>
              <li class="nav-item">
                <button @click="loadCreditDay" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-creditday">
                  Credit Day
                </button>
              </li>
              <li class="nav-item">
                <button @click="loadCredits()" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-credit">
                  Credit
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit"></button>
              </li>

              <!-- <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-settings">
                  Settings
                </button>
              </li> -->
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active tab-customer" id="tab-customer">

                <CustomersTable v-model:items="items" @show="getCustomer" />
                <vue-awesome-paginate :total-items="customerPagination.total"
                  :items-per-page="customerPagination.per_page" :max-pages-shown="appStore.settings.page.maxPageShow"
                  v-model="customerPagination.current_page" :on-click="onChangePageCustomer" />

              </div>

              <div class="tab-pane fade pt-3 tab-category" id="tab-category">
                <CustomerTypesTable :items="customerTypes" />
              </div>
              <div class="tab-pane fade pt-3 tab-creditday" id="tab-creditday">
                <credit-day-table :items="creditDays" />
              </div>
              <div class="tab-pane fade pt-3 tab-credit" id="tab-credit">
                <credit-table :items="credits" />
              </div>


            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl modal-fullscreen-xl-down">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Detail</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="min-height: 350px" v-if="dataCustomer">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button"
                role="tab" aria-controls="home" aria-selected="true">
                รายละเอียด
              </button>
            </li>

            <li class="nav-item" role="presentation">
              <button @click="loadBills(dataCustomer.id)" class="nav-link" id="bill-tab" data-bs-toggle="tab"
                data-bs-target="#bills" type="button" role="tab" aria-controls="bills" aria-selected="false">
                Bills / ประวัติใช้บริการ
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button @click="loadCertificates(dataCustomer.id)" class="nav-link" id="contact-tab" data-bs-toggle="tab"
                data-bs-target="#certificates" type="button" role="tab" aria-controls="certificates"
                aria-selected="false">
                Certificates / ใบรับรอง
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button @click="loadContacts(dataCustomer.id)" class="nav-link" id="contact-tab" data-bs-toggle="tab"
                data-bs-target="#contacts" type="button" role="tab" aria-controls="contacts" aria-selected="false">
                Contacts
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#addresses" type="button"
                role="tab" aria-controls="addresss" aria-selected="false">
                ที่อยู่
              </button>
            </li>
          </ul>
          <div class="tab-content pt-3" id="myTabContent">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <CustomerDetail :data="dataCustomer" />
            </div>
            <div class="tab-pane fade" id="contacts" role="tabpanel" aria-labelledby="contact-tab">
              contact
            </div>
            <div class="tab-pane fade" id="bills" role="tabpanel" aria-labelledby="bill-tab">
              <CustomerBills :items="bills" />
            </div>
            <div class="tab-pane fade" id="certificates" role="tabpanel" aria-labelledby="certificate-tab">
              Cert
            </div>

            <div class="tab-pane fade" id="addresses" role="tabpanel" aria-labelledby="address-tab">
              Address
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <spinner :visible="loading" />
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x"></i>ปิด</button>
          <!-- <button type="button" class="btn btn-primary">Send message</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Modal } from 'bootstrap'
import CustomerDetail from '@/views/customer/components/CustomerDetail.vue'
import CustomerBills from './components/CustomerBills.vue'
import CustomersTable from './components/CustomersTable.vue'
import CustomerTypesTable from './components/CustomerTypesTable.vue'
import CreditDayTable from './components/CreditDayTable.vue'
import CreditTable from './components/CreditTable.vue'

import { useAppStore } from '@/stores/appStore'
const appStore = useAppStore()
const items = ref([])
const customerTypes = ref([])
const customerPagination = ref({
  total: 0,
  current_page: 1,
  last_page: 0,
  per_page: appStore.settings.page.perPage,
})
const totalCustomer = ref(0)
const loading = ref(true)
const modalRef = ref(null)
const modal = ref(null)
const dataCustomer = ref({})
const bills = ref({})
const certificates = ref({})
const creditDays = ref({})
const credits = ref({})

const loadData = async () => {
  const { data } = await api.get('/v2/customers', {
    params: {
      page_page: customerPagination.value.per_page,
      page: customerPagination.value.current_page,
    },
  })

  if (data) {
    totalCustomer.value = data.total
    const p = {
      total: data.total,
      current_page: data.current_page,
      per_page: data.per_page,
      last_page: data.last_page,
    }
    customerPagination.value = p
    items.value = data.data
    loading.value = false
    console.log('pagination ff', customerPagination.value)
  }
}
const onChangePageCustomer = (page) => {
  customerPagination.value.current_page = page
  loadData()
}
const loadCustomerTypes = async () => {
  const { data } = await api.get('/v2/customers/types')
  if (data) {
    customerTypes.value = data
    loading.value = false
  }
}
const loadContacts = async (id) => {
  const { data } = await api.get(`/v2/customers/${id}/contacts`)
  if (data) {
    contacts.value = data
    loading.value = false
  }
}
const loadBills = async (id) => {
  const { data } = await api.get(`/v2/customers/${id}/history/bills`)
  if (data) {
    bills.value = data.data
    loading.value = false
  }
}
const loadCertificates = async (id) => {
  const { data } = await api.get(`/v2/customers/${id}/history/certificates`)
  if (data) {
    certificates.value = data.data
    loading.value = false
  }
}
const loadCreditDay = async () => {
  const { data } = await api.get(`/v2/customers/creditdays`)
  if (data) {
    creditDays.value = data
    loading.value = false
  }
}
const loadCredits = async () => {
  const { data } = await api.get(`/v2/customers/credits`)
  if (data) {
    credits.value = data
    loading.value = false
  }
}
const getCustomer = async (item) => {
  console.log('show', item.id)
  modal.value.show()
  loading.value = true
  const { data } = await api.get('/v2/customers/' + item.id)
  if (data) {
    dataCustomer.value = data
    loading.value = false
  }
}

const onChangeCustomer = (page) => {
  console.log(page)
  console.log('page', page)
  customerPagination.value.current_page = page
  loadData()
}

onMounted(() => {
  loadData()
  loadCustomerTypes()
  loadCredits()
  loadCreditDay()
  modal.value = new Modal(modalRef.value)
})
</script>
<style lang="scss" scoped>
.qt-detail {
  .row {
    margin-bottom: 20px;
    font-size: 15px;
  }

  .card-title {
    color: #012970;
  }

  .label {
    font-weight: 600;
    color: rgba(1, 41, 112, 0.6);
  }
}
</style>
