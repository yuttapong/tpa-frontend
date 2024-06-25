<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import {  MyFormatDate } from '@/helpers/myformat'
import { Modal } from 'bootstrap'

import InvoiceDetail from '@/views/invoice/components/InvoiceDetail.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

import { useInvoiceStore } from '@/stores/invoiceStore'
const row = ref({})
const items = ref([])
const appStore = useAppStore()
const invoiceStore = useInvoiceStore()
const pagination = ref({
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(true)
const modalView = ref(null)
const modalViewRef = ref(null)
const invoice = ref({})
const visibleModal = ref(false)
const route = useRoute()
const itemsSelected = ref([])
route.query.noom = 2
const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})

const headers = [
  { text: "Action", value: "action" },
  { text: 'ID', value: 'id' },
  { text: 'Total', value: 'totalnet' },
  { text: 'Code', value: 'code' },
  { text: 'วันที่', value: 'issue_date' },
  { text: 'ผู้ติดต่อ', value: 'contact_name' },
  { text: 'บริษัท/ลูกค้า', value: 'customer_name' },
  // { text: 'ส่วนลด Lab', value: 'discount_lab' },
  // { text: 'ส่วนลด Order.', value: 'discount_order' },
  // { text: 'ส่วนลด Cust.', value: 'discount_customer' },
  // { text: 'จำนวน', value: 'qty' },
  // { text: 'ราคา', value: 'price' },

  // { text: 'รวมเป็นเงิน', value: 'total' },
  // { text: 'หมายเหตุ', value: 'remark' },
]

const serverOptions = ref({
  page: pagination.value.current_page,
  rowsPerPage: appStore.settings.page.perPage,
})
const onChangePage = (data) => {
  console.log(data)
}
const loadData = async () => {
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/invoices', {
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
    items.value = data?.data || []
    loading.value = false
  }
}

const getInvoiceById = async (item) => {
  try {
    const { data } = await api.get('/v2/invoices/' + item.id)

    if (data) {
      invoice.value = data
      invoiceStore.setInvoice(data)
      loading.value = false
    }
  } catch (error) { }
}

const showDetail = (item) => {
  invoice.value = item
  invoiceStore.setInvoice(item)
  modalView.value.show()
  visibleModal.value = true
  getInvoiceById(item)
}

const onSearch = async () => {
  pagination.value.current_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) { }
}
const resetFormSearch = () => {
  formSearch.value.taxnumber = ''
  formSearch.value.q = ''
}
onSearch()
onMounted(() => {
  modalView.value = new Modal(modalViewRef.value)
  modalView.value.hide()
  invoiceStore.loadCart()
})
watch(
  serverOptions,
  (v) => {
    console.log(v)
    pagination.value.current_page = v.page
    pagination.value.per_page = v.rowsPerPage
    loadData()
  },
  { deep: false },
)
</script>
<template>
  <div>
    <div class="pagetitle">
      <h1>ใบแจ้งหนี้</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
          <li class="breadcrumb-item active">ใบแจ้งหนี้</li>
        </ol>
      </nav>
    </div>
    <!-- End Page Title -->

    <section class="section profile">
      <spinner :visible="loading" />

      <!-- <div class="row">
        <div class="col-xl-8">
          <div class="card">
            <div class="card-body pt-3"></div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card">
            <div class="card-body pt-3">
              <button type="button" class="btn bg-secondary text-white border position-relative">
                <i class="bi bi-cart"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ invoiceStore.countCart }}
                  <span class="visually-hidden">unread messages</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div> -->

      <div class="row" v-if="items">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-body pt-3">
              <!-- Bordered Tabs -->
              <ul class="nav nav-tabs nav-tabs-bordered">
                <li class="nav-item">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                    ใบแจ้งหนี้
                  </button>
                </li>

                <!-- <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-detail">Detail</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit">Edit</button>
                            </li>

                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab"
                                    data-bs-target="#qt-settings">Settings</button>
                            </li> -->
              </ul>
              <div class="tab-content pt-2">
                <div class="tab-pane fade show active qt-index" id="qt-index">
                  <form @submit.prevent="onSearch()">
                    <div class="row g-2">
                      <div class="col-6 col-md-4 col-lg-2">
                        <input type="search" v-model="formSearch.code" name="code" class="form-control form-control-sm"
                          placeholder="Code" @keyup.enter="search" />
                      </div>
                      <div class="col-6 col-md-4 col-lg-3">
                        <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                          class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                          @keyup.enter="search" />
                      </div>
                      <div class="col-6 col-md-4 col-lg-3">
                        <input type="search" v-model="formSearch.q" name="q" class="form-control form-control-sm"
                          placeholder="ลูกค้า/ผู้ติดต่อ" @keyup.enter="search" />
                      </div>
                      <div class="col-12 col-md-6 col-lg-4">
                        <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />
                        <input type="reset" class="btn btn-secondary btn-sm mx-2" value="Reset"
                          @click="resetFormSearch" />
                        <router-link class="btn btn-sm btn-success" :to="{ name: 'invoices.create' }">
                          <i class="bi bi-plus"></i> สร้างใบแจ้งหนี้
                        </router-link>
                      </div>
                    </div>
                  </form>

                  <!-- tables -->

                  <EasyDataTable @update-page-items="onChangePage" class="my-3" :headers="headers" :items="items"
                    alternating v-model:server-options="serverOptions" :server-items-length="4"
                    v-model:items-selected="itemsSelected" show-index border-cell buttons-pagination
                    :loading="invoiceStore.cartLoading" fixed-header>
                    >
                    <template #item-action="item">


                      <button type="button" class="btn btn-link btn-sm" @click="showDetail(item)"><i
                          class="bi bi-search"></i></button>
                      <!-- 
                      <router-link :to="{ name: 'bills.commitmentForm', params: { code: item.code } }"
                        title="จองคิวห้อง Lab">
                        <i class="bi bi-calendar mx-1" role="button"></i></router-link>
                      <router-link :to="{ name: 'bills.formEdit', params: { code: item.code } }">
                        <i class="bi bi-pencil mx-1" role="button"></i></router-link> -->
                    </template>
                  </EasyDataTable>



                  <!--  tables -->

                  <!-- End small tables -->
                </div>
              </div>
              <!-- End Bordered Tabs -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <MyModal v-model:visible="visibleModal" header="xxx"></MyModal> -->

    <div class="modal" ref="modalViewRef">
      <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Invoice</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <InvoiceDetail />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="modal" ref="modalAddRef">
      <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Invoice</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
// .qt-detail {
//   .row {
//     margin-bottom: 20px;
//     font-size: 15px;
//   }

//   .card-title {
//     color: #012970;
//   }

//   .label {
//     font-weight: 600;
//     color: rgba(1, 41, 112, 0.6);
//   }
// }
</style>
