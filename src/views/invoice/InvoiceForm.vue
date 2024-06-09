<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
import { Modal } from 'bootstrap'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useAppStore } from '@/stores/appStore'
import ProductMeta from "@/views/invoice/components/ProductMeta.vue"

const items = ref({})
const appStore = useAppStore()
const pagination = ref({
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(false)
const workorderLoading = ref(false)
const modalView = ref(null)
const modalViewRef = ref(null)
const modalProduct = ref(null)
const modalProductRef = ref(null)
const invoiceStore = useInvoiceStore()

const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})
const invoiceItems = computed(() => invoiceStore.items)
const formInvoice = ref({
  bill_code: '',
  document_date: '',
  items: [],
  agent_id: '',
  agent_name: '',
  status: '',
})

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
    items.value = data.data
    loading.value = false
  }
}

const formSearchProduct = ref({
  q: '',
  item_code: '',
  bill_code: '',
  alltype: 'yes',
})
const onChangePage = (page) => {
  pagination.value.current_page = page
  loadWorkOrders()
}

const loadWorkOrders = async () => {
  workorderLoading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearchProduct.value,
  }
  const { data } = await api.get('/v2/workorders', {
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
  workorderLoading.value = false
}
const getInvoiceById = async (id) => {
  try {
    const { data } = await api.get('/v2/invoices/' + id)
    if (data) {
      items.value = data
      loading.value = false
    }
  } catch (error) {}
}
const showDetail = (item) => {
  modalView.value.show()
  getInvoiceById(item.id)
}

const onSearch = async () => {
  pagination.value.curent_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) {}
}
const onSearchProduct = async () => {
  pagination.value.current_page = 1
  pagination.value.total = 0
  try {
    loadWorkOrders()
  } catch (error) {}
}
const resetFormSearch = () => {
  formSearch.value.taxnumber = ''
  formSearch.value.q = ''
}
const addItem = () => {
  modalProduct.value.show()
}
const clearItem = () => {
  invoiceStore.updateItems([])
}
const existCarts = (data) => {
  const find = invoiceStore.items.filter((item) => item.item_code == data.item_code)
  return Boolean(find.length)
}

const selectProduct = (item) => {
  let row = {
    product_name: item.product_name,
    product_id: item.product_id,
    product: item,
    id_no: item?.id_no,
    model: item?.model,
    serialnumber: item?.serialnumber,
    barcode_no: item?.barcode_no,
    manufaturer_name: item?.manufaturer_name,
    lab: item.lab,
    discount: 0,
    price: item.total,
    qty: 1,
  }
  invoiceStore.addItem(item)
}

const removeItem = (item, index) => {
  invoiceStore.removeItem(item)
}

const updateItems = () => {
  invoiceStore.updateItems(invoiceItems.value)
}

onMounted(() => {
  modalView.value = new Modal(modalViewRef.value)
  modalView.value.hide()
  modalProduct.value = new Modal(modalProductRef.value)
  modalProduct.value.hide()
  loadWorkOrders()
  if (invoiceStore.form) {
    formInvoice.value = invoiceStore.form
  }
})
onUpdated(() => {
  invoiceStore.updateItems(invoiceItems.value)
  invoiceStore.setForm(formInvoice.value)
})
</script>
<template>
  <div class="pagetitle">
    <h1>ใบแจ้งหนี้</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item"><router-link to="/invoices">ใบแจ้งหนี้</router-link></li>
        <li class="breadcrumb-item active">สร้างใบแจ้งหนี้</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section">
    <div class="row">
      <div class="col-12 col-md-9">
        <div class="card">
          <div class="card-body pt-3">
            <spinner :visible="loading" />

            <form @submit.prevent="onSearch()">
              <div class="row g-2">
                <div class="col-6 col-md-4 col-lg-3">
                  <label>วันที่</label>
                  <input
                    type="date"
                    v-model="formInvoice.document_date"
                    name="code"
                    class="form-control form-control-sm"
                    placeholder="Code"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label>Due Date</label>
                  <input
                    type="date"
                    v-model="formInvoice.due_date"
                    name="code"
                    class="form-control form-control-sm"
                    placeholder="Code"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3" v-if="formInvoice.code">
                  <label>Invoice Code</label>
                  <input
                    type="text"
                    v-model="formInvoice.code"
                    name="code"
                    class="form-control form-control-sm"
                    placeholder="Code"
                    disabled="disabled"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label>ลูกค้า</label>
                  <input
                    type="text"
                    v-model="formInvoice.customer_name"
                    name="customer_name"
                    class="form-control form-control-sm"
                    placeholder=""
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label>ผู้ติดต่อ</label>
                  <input
                    type="text"
                    v-model="formInvoice.agent_name"
                    name="agent_name"
                    class="form-control form-control-sm"
                    placeholder=""
                  />
                </div>
                <div class="col-12 col-lg-6">
                  <label>ที่อยู่</label>
                  <input
                    type="text"
                    v-model="formInvoice.address"
                    name="address"
                    class="form-control form-control-sm"
                    placeholder=""
                  />
                </div>

                <div class="col-12">
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th class="fw-bold"># Item</th>
                          <th class="fw-bold">รายการ</th>
                          <th class="fw-bold text-end">จำนวนเงิน</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="" v-for="(item, index) in invoiceItems" :key="index">
                          <td scope="row" nowrap>
                            <button
                              type="button"
                              class="btn btn-text text-danger"
                              @click="removeItem(item, index)"
                            >
                              <i class="bi bi-x-circle"></i>
                            </button>
                            {{ index + 1 }})
                            <span class="ms-2 text-primary fw-bold" style="font-size: 13px">{{
                              item.item_code
                            }}</span>
                          </td>
                          <td class="">
                            <div class="fw-bold">
                              <i class="text-danger">{{ item.manufaturer_name }}</i>
                              {{ item.product_name }}
                            </div>

                            <div class="">
                              <ProductMeta :item="item"/>
                            
                            </div>
                          </td>

                          <td class="text-end">
                            {{ parseFloat(item.total).toLocaleString() }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-12">
                  <button type="button" class="btn btn-sm btn-success" @click="addItem()">
                    <i class="bi bi-plus" role="button"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger ms-3"
                    v-if="invoiceStore.items.length > 0"
                    @click="clearItem()"
                  >
                    <i class="bi bi-trash" role="button"></i>
                  </button>
                </div>
                <div class="col-12">Total Items : {{ invoiceStore.countItems }}</div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="card">
          <div class="card-body pt-3">
            <div class="row g-1">
              <div class="col-12">
                <button class="btn btn-primary btn-sm w-100" @click="updateItems()">บันทึก</button>
              </div>
              <div class="col-12">
                <router-link
                  :to="{ name: 'invoices.preview' }"
                  class="btn btn-sm btn-secondary d-block"
                >
                  <i class="bi bi-eye"></i>
                  Preview ดูตัวอย่าง</router-link
                >
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary d-block">
                  <i class="bi bi-printer"></i>
                  พิมพ์</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="modal" ref="modalProductRef">
    <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Work Orders</h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="my-2">
            <form @submit.prevent="onSearchProduct()">
              <div class="row g-2">
                <div class="col-6 col-md-4 col-lg-4">
                  <input
                    type="search"
                    v-model="formSearchProduct.bill_code"
                    class="form-control form-control-sm"
                    placeholder="เลขที่ใบขอรับบริการ"
                    @keyup.enter="onSearchProduct()"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-4">
                  <input
                    type="search"
                    v-model="formSearchProduct.item_code"
                    class="form-control form-control-sm"
                    placeholder="เลขที่ WorderOrder"
                    @keyup.enter="onSearchProduct()"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3"></div>
                <div class="col-6 col-md-4 col-lg-3">
                  <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />
                  <spinner :visible="workorderLoading" class="mx-2 p-0" />
                </div>
              </div>
            </form>
          </div>
          <!-- Small tables -->
          <div class="table table-responsive">
            <table class="table table-sm table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col" class="fw-bold">Action</th>
                  <!-- <th scope="col">#</th> -->
                  <th scope="col" class="fw-bold">Item ID</th>
                  <th scope="col" class="fw-bold">Code</th>
                  <th scope="col" class="fw-bold">Name</th>
                  <th scope="col" class="fw-bold">จำนวนเงิน</th>
   

                  <th scope="col" class="fw-bold">Barcode</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <th scope="row">
                    <template v-if="!existCarts(item)">
                      <button class="btn btn-secondary btn-sm d-block" @click="selectProduct(item)">
                        <i class="bi bi-plus"></i>
                      </button>
                    </template>
                  </th>
                  <td>
                    <span class="">{{ item.item_id }}</span>
                  </td>
                  <td>
                    <span class="badge bg-dark text-light">{{ item.item_code }}</span>
                  </td>
                  <td>
                    <div class="fw-bold"><i class="text-danger">{{item.manufaturer_name}}</i> {{ item.product_name }}</div>
                    <ProductMeta :item="item"/>
                  </td>
                  <td>{{ parseFloat(item.total).toLocaleString() }}</td>
 
                  <td>{{ item.barcode_no }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- End small tables -->
        </div>
        <div class="modal-footer m-0 p-1 d-block">
          <div class="row">
            <!-- <div class="col-md-2 d-none d-sm-block">
              <select
                v-model="pagination.per_page"
                @change="onSearchProduct"
                class="form-select form-select-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div> -->
            <div class="col-xs-10 col-md-10">
              <vue-awesome-paginate
                :total-items="pagination.total"
                :items-per-page="pagination.per_page"
                :max-pages-shown="appStore.settings.page.maxPageShow"
                v-model="pagination.current_page"
                :on-click="onChangePage"
                class=""
              />
            </div>

            <div class="col-xs-2 col-md-2">
              <button type="button" class="btn btn-secondary float-end" data-bs-dismiss="modal">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" ref="modalViewRef">
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
  </div>
</template>

<style lang="scss" scoped>
div[size='A4'] {
  width: 21cm;
  height: 29.7cm;
  padding: 10px;
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);

  > p,
  span,
  li,
  td {
    font-size: 12px;
    font-family: Arial;
  }
}

div[size='A4'][layout='portrait'] {
  width: 29.7cm;
  height: 21cm;
}

@media print {
  body,
  page {
    margin: 0;
    box-shadow: 0;
  }
}
</style>
