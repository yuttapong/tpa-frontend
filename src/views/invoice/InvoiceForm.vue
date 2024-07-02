<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { MyFormatDate } from '@/helpers/myformat'
import { toast } from 'vue3-toastify'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useAppStore } from '@/stores/appStore'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'
import ModalWorkOrder from '@/views/invoice/components/ModalWorkOrder.vue'
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
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
const invoiceItems = computed(() => invoiceStore.carts)
const invoiceTypes = [
  { text: '', value: 'onsite' },
  { text: '', value: 'walk_in' },
  { text: '', value: 'normal' },
]
const dueWithinList = [
  {
    text: '15 วัน',
    value: 15,
  },
  {
    text: '30 วัน',
    value: 30,
  },
  {
    text: '45 วัน',
    value: 45,
  },
  {
    text: '60 วัน',
    value: 60,
  },
  {
    text: '90 วัน',
    value: 90,
  },
]
const formInvoice = ref({
  bill_code: '',
  issue_date: format(new Date(), 'yyyy-MM-dd'),
  due_within: 30,
  due_date: '',
  items: [],
  contact_id: '',
  contact_name: '',
  status: '',
  vat_percent: 7,
  vat: 0,
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
  } catch (error) {}
}

const openModalWorkOrder = () => {
  modalWorkOrder.value.show()
}

const removeCart = async () => {
  if (itemsSelected.value.length === 0) {
    return false
  }
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
    discount_lab: 0,
    discount_lab_percent: 0,
    discount_order: 0,
    discount_order_percent: 0,
    discount_customer: 0,
    discount_customer_percent: 0,
    qty: 1,
    price: item.total,
    vat: 0,
    total: item.total,
    product: item?.product,
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
const totalBillDiscount = computed(() => {
  return formInvoice.value.total_bill_discount
})
const totalLabDiscount = computed(() => {
  return invoiceItems.value
    ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.discount_lab)), 0)
    : 0
})
const totalOrderTypeDiscount = computed(() => {
  return invoiceItems.value
    ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.discount_order)), 0)
    : 0
})
const totalCustomerTypeDiscount = computed(() => {
  return invoiceItems.value
    ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.discount_customer)), 0)
    : 0
})
const totalDiscount = computed(() => {
  return invoiceItems.value
    ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.discount)), 0)
    : 0
})
const totalAllDiscount = computed(() => {
  return (
    parseFloat(totalDiscount.value) +
    parseFloat(totalLabDiscount.value) +
    parseFloat(totalOrderTypeDiscount.value) +
    parseFloat(totalCustomerTypeDiscount.value) +
    Number(formInvoice.value.total_bill_discount)
  )
})

const totalVat = computed(() => {
  let total = (totalPrice.value * parseFloat(formInvoice.value.vat_percent)) / 100
  formInvoice.value.vat = total
  return total
})
const totalNet = computed(() => {
  return (
    totalPrice.value -
    totalDiscount.value -
    totalCustomerTypeDiscount.value -
    totalOrderTypeDiscount.value
  )
})
const openModalCustomer = () => {
  modalCustomer.value.show()
}

const calculate = () => {
  loadCart()
}
const onSelectCustomer = (data) => {
  console.log("c", data);
  formInvoice.value.customer_id = data?.customers.id
  formInvoice.value.customer_name = data.customers.companyname
  formInvoice.value.contact_name = data.contacts.contactname
  formInvoice.value.contact_id = data.contacts.id

  let address = (`${data.address} ${data.subdistrict} ${data.district} ${data.province} ${data.postalcode}`).trim()
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
  formInvoice.value.items = invoiceStore.myCartItems
  formInvoice.value.totalprice = totalPrice.value
  formInvoice.value.totaldiscount = totalDiscount.value
  formInvoice.value.totalvat = (totalPrice.value * 7) / 100
  formInvoice.value.totalnet = totalNet.value

  if (formInvoice.value.id !== undefined && formInvoice.value.id > 0) {
    return
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
  { text: 'ส่วนลด', value: 'discount' },
  { text: 'ส่วนลด Lab', value: 'discount_lab' },
  { text: 'ส่วนลด Order.', value: 'discount_order' },
  { text: 'ส่วนลด Cust.', value: 'discount_customer' },
  { text: 'จำนวน', value: 'qty' },
  { text: 'ราคา', value: 'price' },

  { text: 'รวมเป็นเงิน', value: 'total' },
  { text: 'หมายเหตุ', value: 'remark' },
]

const updateInvoiceInput = async (e, row, field) => {
  console.log(e.target.value, row[field], row)
  delete row['key']
  delete row['checkbox']
  delete row['index']
  delete row['product']
  // let items = invoiceItems.value.map(item => {
  //   if (item.item_id == row.item_id) {
  //     return item[field] = row[field]
  //   }
  // })
  // invoiceItems.value = items
  const { data } = await api.patch('v2/invoices/cart/' + row.cart_id, row)
  loadCart()
}

const onUpdatePageItems = (items) => {
  console.log('onUpdatePageItems', items)
}

loadCart()
const itemsSelected = ref([])
onMounted(() => {})
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
          <div class="card m-0">
            <div class="card-body p-2">
              <spinner :visible="loading" />

              <form @submit.prevent="onSearch()">
                <div class="border p-1">
                  <div class="row g-2">
                    <div
                      class="col-6 col-md-4 col-lg-3"
                      :class="[{ 'text-danger': errors.issue_date }]"
                    >
                      <label>วันที่</label>
                      <input
                        type="date"
                        v-model="formInvoice.issue_date"
                        class="form-control form-control-sm"
                        placeholder="issue date"
                      />
                    </div>
                    <div
                      class="col-6 col-md-4 col-lg-3"
                      :class="[{ 'text-danger': errors.due_date }]"
                    >
                      <label>กำหนดชำระภายใน</label>

                      <select class="form-select form-select-sm" v-model="formInvoice.due_within">
                        <option value="">----</option>
                        <option v-for="i in dueWithinList" :value="i.value" :key="i">
                          {{ i.text }}
                        </option>
                      </select>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" v-if="formInvoice.code">
                      <label>Invoice Code</label>
                      <input
                        type="text"
                        v-model="formInvoice.code"
                        class="form-control form-control-sm"
                        placeholder="Code"
                        disabled="disabled"
                      />
                    </div>
                    <div
                      class="col-6 col-md-4 col-lg-3"
                      :class="[
                        { 'text-danger': errors.customer_id, 'text-danger': errors.customer_name },
                      ]"
                    >
                      <label
                        >ลูกค้า
                        <span v-if="formInvoice.customer_id"
                          >({{ formInvoice.customer_id }})</span
                        ></label
                      >
                      <input
                        type="text"
                        v-model="formInvoice.customer_name"
                        class="form-control form-control-sm"
                        placeholder="บริษัท"
                        @click="openModalCustomer"
                      />
                    </div>
                    <div
                      class="col-6 col-md-4 col-lg-3"
                      :class="[{ 'text-danger': errors.contact_name }]"
                    >
                      <label
                        >ผู้ติดต่อ
                        <span v-if="formInvoice.contact_id"
                          >({{ formInvoice.contact_id }})</span
                        ></label
                      >
                      <input
                        type="text"
                        v-model="formInvoice.contact_name"
                        class="form-control form-control-sm"
                        placeholder=""
                        @click="openModalContact"
                      />
                    </div>
                    <div class="col-12 col-lg-6" :class="[{ 'text-danger': errors.address }]">
                      <label>ที่อยู่</label>
                      <input
                        type="text"
                        v-model="formInvoice.address"
                        class="form-control form-control-sm"
                        placeholder="ที่อยู่"
                      />
                    </div>
                    <div class="col-12 col-lg-6" :class="[{ 'text-danger': errors.address }]"></div>
                  </div>
                </div>
                <div class="">
                  <div class="row my-2 g-2">
                    <div class="col-12 col-md-6">
                      <div
                        class="btn-toolbar float-start"
                        role="toolbar"
                        aria-label="Toolbar with button groups"
                      >
                        <div class="btn-group me-2" role="group" aria-label="">
                          <button type="button" class="btn btn-sm btn-danger" @click="removeCart()">
                            <i class="bi bi-trash" role="button"></i>
                            <span v-if="itemsSelected.length">({{ itemsSelected.length }})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div
                        class="btn-toolbar float-md-end"
                        role="toolbar"
                        aria-label="Toolbar with button groups "
                      >
                        <div class="btn-group me-2" role="group" aria-label="First group">
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            @click="openModalWorkOrder()"
                          >
                            <i class="bi bi-plus" role="button"></i> ดึงข้อมูลใบขอรับ
                          </button>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            @click="openModalWorkOrder()"
                          >
                            <i class="bi bi-plus" role="button"></i> ดึงข้อมูล Invoice ยกเลิก
                          </button>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-success"
                            @click="calculate()"
                          >
                            <i class="bi bi-calculator" role="button"></i> คำนวณ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="errors.items" :class="[{ 'text-danger my-2': errors.items }]">
                    โปรดระบุรายการเครื่องมือ
                  </div>
                 

                  <EasyDataTable
                    class="my-3"
                    :headers="headers"
                    :items="invoiceItems"
                    alternating
                    rowsPerPage="5"
                    v-model:items-selected="itemsSelected"
                    show-index
                    border-cell
                    buttons-pagination
                    fixed-header
                    :loading="invoiceStore.cartLoading"
                    @update-page-items="onUpdatePageItems"
                  >
                    <!-- <template #loading>
                      <Spinner :visible="invoiceStore.cartLoading" />
                    </template> -->
                    <template #empty-message>
                      <p class="">ไม่พบรายการใดๆ</p>
                    </template>
                    <template #item-product="item">
                      {{ item.product_name }}
                      <div class="fw-bold text-dark">{{ item.product?.code }}</div>
                    </template>
                    <template #item-discount="item">
                      <input
                        type="number"
                        v-model="item.discount"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'discount')"
                      />
                    </template>
                    <template #item-discount_lab="item">
                      <input
                        type="number"
                        v-model="item.discount_lab"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'discount_lab')"
                      />
                    </template>
                    <template #item-discount_order="item">
                      <input
                        type="number"
                        v-model="item.discount_order"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'discount_order')"
                      />
                    </template>
                    <template #item-discount_customer="item">
                      <input
                        type="number"
                        v-model="item.discount_customer"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'discount_customer')"
                      />
                    </template>
                    <template #item-qty="item">
                      <input
                        type="number"
                        v-model="item.qty"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'qty')"
                      />
                    </template>
                    <template #item-price="item">
                      <input
                        type="number"
                        v-model="item.price"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'price')"
                      />
                    </template>
                    <template #item-total="item">
                      <input type="number" v-model="item.total" class="text-end" disabled />
                    </template>
                    <template #item-remark="item">
                      <input type="text" v-model="item.remark" class="" />
                    </template>
                  </EasyDataTable>
                </div>

                <div class="row g-1">
                  <div class="col-12 col-md-8 bg-light" style="font-size: 14px">
                    <div class="row">
                      <div class="col-6 col-md-3 text-end">ส่วนลดท้ายบิล</div>
                      <div class="col-6 col-md-3">
                        <input
                          type="number"
                          v-model="formInvoice.total_bill_discount"
                          class="text-end"
                        />
                      </div>

                      <div class="col-6 col-md-3 text-end">รวมส่วนลดท้ายบิลทั้งหมด</div>
                      <div class="col-6 col-md-3">
                        <input type="number" v-model="totalBillDiscount" class="text-end" />
                      </div>

                      <div class="col-6 col-md-3 text-end">รวมส่วนลด Order Type</div>
                      <div class="col-6 col-md-3">
                        <input type="number" v-model="totalOrderTypeDiscount" class="text-end" />
                      </div>

                      <div class="col-6 col-md-3 text-end">รวมส่วนลด Customer</div>
                      <div class="col-6 col-md-3">
                        <input
                          type="number"
                          v-model="totalCustomerTypeDiscount"
                          class="text-end"
                          disabled
                        />
                      </div>

                      <div class="col-6 col-md-3 text-end">รวมส่วนลดทั้งหมด (totalAllDiscount)</div>
                      <div class="col-6 col-md-3">
                        <input type="number" v-model="totalAllDiscount" class="text-end" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4" style="font-size: 14px">
                    <div class="row">
                      <div class="col-6 text-end">รวม</div>
                      <div class="col-6">
                        <input type="number" v-model="totalPrice" class="text-end" disabled />
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6 text-end">VAT (%)</div>
                      <div class="col-6">
                        <input
                          type="number"
                          v-model="formInvoice.vat_percent"
                          class="text-end"
                          placeholder="%"
                        />
                        <input type="number" v-model="totalVat" class="text-end" disabled />
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6 text-end">จำนวนเงินทั้งสิ้น</div>
                      <div class="col-6">
                        <input type="number" v-model="totalNet" class="text-end" disabled />
                      </div>
                    </div>
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
                <div class="col" align="center">
                  <button class="btn btn-primary btn-lg mx-1" @click="save()">
                    <i class="bi bi-save"></i> Save
                  </button>
                  <button class="btn btn-secondary btn-lg mx-1" @click="save()">
                    <i class="bi bi-x"></i> Cancel
                  </button>
                </div>
              </div>
              <!-- <h6 class="mt-3 text-decoration-underline text-danger">ข้อสังเกตุ</h6>
              <ul>
                <li>ค่าขนส่ง ไม่นำมาคิดส่วนลด</li>
                <li>ค่าขนส่ง มีการคิด VAT ด้วย</li>
                <li>ลูกค้า Walk In มีการให้ส่วนลด 5%</li>
              </ul> -->
            </div>
          </div>
        </div>
      </div>
      
      <ModalWorkOrder ref="modalWorkOrder" @select="onSelectProduct" 
       v-model:customer_id="formInvoice.customer_id"
       title="xxx"
      />
      <ModalCustomer ref="modalCustomer" @select="onSelectCustomer" />
      <ModalContact
        ref="modalContact"
        @select="onSelectContact"
        v-model:customerId="formInvoice.customer_id"
      />
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
