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
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import { useRouter } from 'vue-router'
const items = ref({})
const appStore = useAppStore()
const pagination = ref({
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(false)
const hasError = ref(false)
const router = useRouter()
const modalWorkOrder = ref(null)
const modalContact = ref(null)
const modalCustomer = ref(null)
const errors = ref([])
const invoiceStore = useInvoiceStore()

const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})
const invoiceItems = computed(() => {
  return invoiceStore.myCartItems
})
const formInvoice = ref({
  bill_code: '',
  issue_date: '',
  due_within: 30,
  due_date: '',
  items: [],
  contact_id: '',
  contact_name: '',
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

const onSearch = async () => {
  pagination.value.curent_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) { }
}

const openModalWorkOrder = () => {
  modalWorkOrder.value.show()
}

const removeCart = async () => {
  let items = itemsSelected.value.map((i) => i.item_id)
  const data = await invoiceStore.removeCart(items)
  toast(data.message, {
    autoClose: 200,
    theme: 'auto',
    type: 'success',
    dangerouslyHTMLString: true,
  })
  itemsSelected.value = []
  invoiceStore.loadCart()
}

const onSelectProduct = async (item) => {
  let row = {
    item_code: item.item_code,
    item_id: item.item_id,
    bill_id: item.bill_id,
    bill_code: item?.bill.code,
    product_name: item.product_name,
    product_id: item.product_id,
    product: item,
    id_no: item?.id_no,
    model: item?.model,
    serialnumber: item?.serialnumber,
    barcode_no: item?.barcode_no,
    manufaturer_name: item?.manufaturer_name,
    lab: item.lab,
    test_point: item.test_point,
    discount: 0,
    discount_percent: 0,
    discount_order: 0,
    discount_order_percent: 0,
    qty: 1,
    price: item.total,
    total: item.total,
  }
  invoiceStore.addItem(row)
}

const emptyCart = async () => {
  invoiceStore.emptyCart()
}

const loadCart = async () => {
  invoiceStore.loadCart()
}
const totalPrice = computed(() => {
  return invoiceItems.value
    ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.price)), 0)
    : 0
})
const totalDiscount = computed(() => {
  return invoiceItems.value
    ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.discount)), 0)
    : 0
})
const totalNet = computed(() => {
  return totalPrice.value - totalDiscount.value
})
const openModalCustomer = () => {
  modalCustomer.value.show()
}
const onSelectCustomer = (data) => {
  formInvoice.value.customer_id = data.id
  formInvoice.value.customer_name = data.companyname

  let address = `${data.address} ${data.subdistrict} ${data.district} ${data.province} ${data.postalcode}`
  formInvoice.value.address = address.trim()
}
const openModalContact = () => {
  modalContact.value.show()
}
const onSelectContact = (data) => {
  formInvoice.value.contact_id = data.id
  formInvoice.value.contact_name = data.contactname
}

const resetData = () => {
  formInvoice.value = {}
  invoiceStore.setForm({})
}
const save = async () => {
  hasError.value = false
  formInvoice.value.items = invoiceStore.carts

  formInvoice.value.totalprice = totalPrice.value
  formInvoice.value.totaldiscount = totalDiscount.value
  formInvoice.value.totalvat = (totalPrice.value * 7) / 100
  formInvoice.value.totalnet = totalNet.value

  if (formInvoice.value.id !== undefined && formInvoice.value.id > 0) {
    // loading.value = true
    // const { data } = await api.put('v2/invoices', formInvoice.value)
    // if (data) {
    //   loading.value = false
    //   resetData()
    //   loadCart()
    //   toast(data.message, {
    //     theme: 'auto',
    //     type: 'default',
    //     dangerouslyHTMLString: true,
    //   })
    // } else {
    //   loading.value = false
    // }
  } else {
    loading.value = true
    const { data } = await api.post('v2/invoices', formInvoice.value).catch((err) => {
      console.error(err)
      errors.value = err.response.data.errors
      loading.value = false
      hasError.value = true
    })
    if (data) {
      loading.value = false
      emptyCart()
      resetData()
      loadCart()
      router.push('/invoices')
      toast(data.message, {
        theme: 'auto',
        type: 'default',
        dangerouslyHTMLString: true,
      })
    } else {
      hasError.value = true
      errors.value = loading.value = false
    }
  }
  loading.value = false
}
const headers = [
  { text: 'Item code', value: 'item_code', width: 150 },
  { text: 'เครื่องมือ', value: 'product', width: 200 },
  { text: 'ส่วนลด', value: 'number' },
  { text: 'ส่วนลด Order Type', value: 'discount_order' },
  { text: 'จำนวน', value: 'qty' },
  { text: 'ราคา', value: 'price' },

  { text: 'รวมเป็นเงิน', value: 'total' },
  { text: 'หมายเหตุ', value: 'remark' },
]

loadCart()
const itemsSelected = ref([])
onMounted(() => {
  loadCart()
  if (invoiceStore.form) {
    formInvoice.value = invoiceStore.form
  }
})
onUpdated(() => {
  // invoiceStore.setForm(formInvoice.value)
})
</script>
<template>
  <div>
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
        <div class="col-12 col-md-12">
          <div class="card">
            <div class="card-body pt-3">
              <spinner :visible="loading" />

              <form @submit.prevent="onSearch()">
                <div class="row g-2">
                  <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.issue_date }]">
                    <label>วันที่</label>
                    <input type="date" v-model="formInvoice.issue_date" class="form-control form-control-sm"
                      placeholder="issue date" />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.due_date }]">
                    <label>กำหนดชำระภายใน</label>
                    <input type="number" v-model="formInvoice.due_within" class="form-control form-control-sm"
                      placeholder="due date" />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3" v-if="formInvoice.code">
                    <label>Invoice Code</label>
                    <input type="text" v-model="formInvoice.code" class="form-control form-control-sm" placeholder="Code"
                      disabled="disabled" />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3" :class="[
                    { 'text-danger': errors.customer_id, 'text-danger': errors.customer_name },
                  ]">
                    <label>ลูกค้า
                      <span v-if="formInvoice.customer_id">({{ formInvoice.customer_id }})</span></label>
                    <input type="text" v-model="formInvoice.customer_name" class="form-control form-control-sm"
                      placeholder="บริษัท" @click="openModalCustomer" />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.contact_name }]">
                    <label>ผู้ติดต่อ
                      <span v-if="formInvoice.contact_id">({{ formInvoice.contact_id }})</span></label>
                    <input type="text" v-model="formInvoice.contact_name" class="form-control form-control-sm"
                      placeholder="" @click="openModalContact" />
                  </div>
                  <div class="col-12 col-lg-6" :class="[{ 'text-danger': errors.address }]">
                    <label>ที่อยู่</label>
                    <input type="text" v-model="formInvoice.address" class="form-control form-control-sm"
                      placeholder="ที่อยู่" />
                  </div>
                </div>

                <div class="">

                  <div v-if="errors.items" :class="[{ 'text-danger mt-2': errors.items }]">
                    โปรดระบุรายการเครื่องมือ
                  </div>

                  <EasyDataTable class="my-3" :headers="headers" :items="invoiceItems" alternating rowsPerPage="5"
                    v-model:items-selected="itemsSelected" show-index border-cell buttons-pagination
                    :loading="invoiceStore.cartLoading" fixed-header>
                    <template #loading>
                      <Spinner :visible="invoiceStore.cartLoading" />
                    </template>
                    <template #empty-message>
                      <p class="">ไม่พบรายการใดๆ</p>
                    </template>
                    <template #item-product="item">
                      {{ item.product_name }}
                      <div class="fw-bold text-dark">{{ item.product?.code }}</div>
                    </template>
                  </EasyDataTable>
                </div>

                <div class="row g-3">
                  <div class="col-12 col-md-7">
                    <template v-if="itemsSelected.length">
                      <button type="button" class="btn btn-sm btn-danger" @click="removeCart()">
                        <i class="bi bi-trash" role="button"></i>
                        ลบ ({{ itemsSelected.length }})
                      </button>
                      <!-- <button type="button" class="btn btn-sm btn-danger ms-1" @click="emptyCart()">
                        <i class="bi bi-x" role="button"></i>
                        ล้าง
                      </button> -->
                    </template>

                    <button type="button" class="btn btn-sm btn-secondary  ms-1" @click="openModalWorkOrder()">
                      <i class="bi bi-plus" role="button"></i> ดึงข้อมูลใบขอรับ
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary ms-1" @click="openModalWorkOrder()">
                      <i class="bi bi-plus" role="button"></i> ดึงข้อมูล Invoice ยกเลิก
                    </button>
                  </div>
                  <div class="col-12 col-md-5">
                    Total Net : {{ parseFloat(totalNet).toLocaleString() }}
                    รวมเป็นเงิน : {{ parseFloat(totalNet).toLocaleString() }}


                  </div>
                </div>


              </form>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-12">
          <div class="card">
            <div class="card-body pt-3">
              <div class="row g-1">
                <div class="col">
                  <button class="btn btn-primary btn-sm" @click="save()">บันทึก</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalWorkOrder ref="modalWorkOrder" @select="onSelectProduct" />
      <ModalCustomer ref="modalCustomer" @select="onSelectCustomer" />
      <ModalContact ref="modalContact" @select="onSelectContact" v-model:customerId="formInvoice.customer_id" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
input {
  border: solid 1px #cbc8c8;
  padding: 2px;
  border-radius: 1px;
}
</style>
