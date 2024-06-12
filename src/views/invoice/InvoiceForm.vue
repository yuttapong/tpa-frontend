<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
import { toast } from 'vue3-toastify'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useAppStore } from '@/stores/appStore'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'
import ModalWorkOrder from '@/views/invoice/components/ModalWorkOrder.vue'
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

const onSearch = async () => {
  pagination.value.curent_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) {}
}

const addItem = () => {
  modalProduct.value.show()
}
const clearItem = () => {
  invoiceStore.updateItems([])
  const { data } = api.delete('v2/invoices/cart').then((rs) => {})
  toast('ล้างรายการสำเร็จ', {
    theme: 'auto',
    type: 'default',
    dangerouslyHTMLString: true,
  })
}

const selectProduct = async (item) => {
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
  const data = await api.post('v2/invoices/cart', row)
  if (data) {
    toast(`เพิ่มรายการ (${item.item_code}) สำเร็จ`, {
      theme: 'auto',
      type: 'default',
      dangerouslyHTMLString: true,
    })
    invoiceStore.addItem(item)
  }
}
const emptyCart = () => {
  formInvoice.value = {}
  invoiceStore.setForm({})
  invoiceStore.updateItems([])
}
const removeItem = async (item, index) => {
  const { data } = await api.delete('v2/invoices/cart/' + item.item_id, {
    item_i: item.item_id,
  })
  if (data.success) {
    toast(`ลบ ${item.item_code} สำเร็จ`, {
      theme: 'auto',
      type: 'default',
      dangerouslyHTMLString: true,
    })
    invoiceStore.removeItem(item)
  }
}

const save = async () => {
  loading.value = true
  const { data } = await api.post('v2/invoices', formInvoice.value)
  if (data) {
    loading.value = false
    emptyCart()
    toast(data.message, {
      theme: 'auto',
      type: 'default',
      dangerouslyHTMLString: true,
    })
  } else {
    loading.value = false
  }
}

onMounted(() => {
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
                              <ProductMeta :item="item" />
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
                <button class="btn btn-primary btn-sm w-100" @click="save()">บันทึก</button>
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
    <ModalWorkOrder ref="modalProduct" @select="selectProduct" />
  </section>
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
