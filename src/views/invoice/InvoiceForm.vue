<script setup>
import { onMounted, computed, ref, reactive, onUpdated, watch } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { myFormatDate } from '@/helpers/myformat'
import { toast } from 'vue3-toastify'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useAppStore } from '@/stores/appStore'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'
import ModalWorkOrder from '@/views/invoice/components/ModalWorkOrder.vue'
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import ProductDiscountInput from '@/views/invoice/components/ProductDiscountInput.vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import currency from 'currency.js'
import { myCurrency } from '@/helpers/myformat'
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
const formMode = computed(() => {
  if (Number(formInvoice.value.id) !== 0) {
    return 'edit'
  } else {
    return 'add'
  }
})
const invoiceStore = useInvoiceStore()

const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})
const customerTypes = ref([])

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
  vat_percent: appStore.settings.vat,
  items: [],
})
const items = computed(() => formInvoice.value.items)
const vatPercent = ref(appStore.settings.vat)
const discountCustomer = ref(0)
const discountCustomerType = ref('percentage')
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
const getCustomerTypes = async () => {
  const { data } = await api.get('/v2/customers/types')

  if (data) {
    customerTypes.value = data
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
  let price = Number(item.total)
  let qty = 1
  let total = Number(item.total)
  let grand_total = Number(item.total)
  let row = {
    item_code: item.item_code,
    item_id: item.item_id,
    bill_id: item.bill_id,
    bill_code: item?.bill.code,
    product_name: item.product_name,
    product_id: item.product_id,
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
    qty: qty,
    price: price,
    vat: 0,
    total: total,
    grand_total: grand_total,
    product: item?.product,
    staff_id: appStore.user.id,
  }
  formInvoice.value.items.push(row)
  //invoiceStore.addItem(row)
}
const onChangeCustomerType = (rs) => {
  calculate()
}
const emptyCart = async () => {
  invoiceStore.emptyCart()
}

const loadCart = async () => {
  // invoiceStore.loadCart()
  getInvoice(1)
}
const totalPrice = computed(() => {
  return items.value.reduce((total, item) => (total += Number(item.price)), 0)
})

const totalBillDiscount = computed(() => {
  return formInvoice.value.total_bill_discount || 0
})
const totalLabDiscount = computed(() => {
  return formInvoice.value.items.reduce((total, item) => (total += Number(item.discount_lab)), 0)
})
const totalOrderTypeDiscount = computed(() => {
  return formInvoice.value.items.reduce((total, item) => (total += Number(item.discount_order)), 0)
})
const totalCustomerTypeDiscount = computed(() => {
  return formInvoice.value.items.reduce(
    (total, item) => (total += Number(item.discount_customer)),
    0,
  )
})
const totalDiscount = computed(() => {
  return formInvoice.value.items.reduce((total, item) => (total += Number(item.discount)), 0)
})
const totalAllDiscount = computed(() => {
  let discountBill = Number(formInvoice.value.total_bill_discount) || 0

  return Number(totalDiscount.value) + discountBill
})
const totalPriceAfterDiscount = computed(() => {
  return totalPrice.value - totalAllDiscount.value
})
const totalVat = computed(() => {
  let total = (totalPriceAfterDiscount.value * vatPercent.value) / 100
  return total
})
const totalNet = computed(() => {
  let net = totalPriceAfterDiscount.value + totalVat.value
  return net
})
const openModalCustomer = () => {
  modalCustomer.value.show()
}
const updateInvoiceInput = (e, row, field) => {
  console.log(row);
  let temp = formInvoice.value.items.map((item, itemKey) => {
    if (row.index == itemKey) {
      console.log(item[field], row.item[field])
      item[field] = row.item[field]
    }
    console.log(item[field], itemKey);
    return item
  })
  formInvoice.value.items = temp
  calculate()
}
const updateDiscountRow = (data, row, key) => {
  console.log(row)
  let temp = formInvoice.value?.items || []
  let discountType = data.type
  let discountValue = data.value

  if (!discountValue) return

  let items = temp.map((item, itemIndex) => {
    let percent = 0
    let amount = 0
    let total = Number(item.price)
    let discount = Number(item.discount)
    if (item.product && Number(item.product.is_job) === 1 && Number(item.price > 0)) {
      if (discountType == 'percentage') {
        amount = (total * discountValue) / 100
        percent = Number(discountValue).toFixed(2)
      } else if (discountType == 'amount') {
        amount = discountValue
        percent = Number((discountValue * 100) / total).toFixed(2)
      }
    }
    console.log('=>>>', row.index, data.index)
    if (itemIndex === row.index) {
      item[data.fieldAmount] = amount
      item[data.fieldPercent] = percent

      discount =
        Number(item.discount_customer) + Number(item.discount_lab) + Number(item.discount_order)
    }
    let grand_total = total - discount
    item.total = total
    item.discount = discount
    item.net = grand_total

    return item
  })
  formInvoice.value.items = items
  let unit = discountType === 'percentage' ? '%' : 'บาท'
  toast(`เพิ่มส่วนลด : ${discountValue} ${unit} สำเร็จ`, {
    theme: 'auto',
    type: 'info',
    dangerouslyHTMLString: true,
  })
}

const calculate = () => {
  let items = formInvoice.value.items.map((item) => {
    let price = Number(item.price)
    let total = Number(item.price)

    let discount =
      Number(item.discount_customer) + Number(item.discount_lab) + Number(item.discount_order)
    item.discount = discount
    item.total = total
    item.price = price
    item.net = total - discount

    return item
  })
  formInvoice.value.items = items
}
const addDiscountCustomer = () => {
  let temp = formInvoice.value?.items || []
  let discountType = discountCustomerType.value
  let discountValue = discountCustomer.value

  let items = temp.map((item) => {
    let percent = 0
    let amount = 0
    let total = Number(item.price)

    if (item.product && Number(item.product.is_job) === 1 && Number(item.price > 0)) {
      if (discountType == 'percentage') {
        item.discount_customer_percent = discountValue
        amount = (total * discountValue) / 100
        percent = Number(discountValue).toFixed(2)
      } else if (discountType == 'amount') {
        amount = discountValue
        percent = Number((discountValue * 100) / total).toFixed(2)
      }
    }
    item.discount_customer = amount
    item.discount_customer_percent = percent

    let discount =
      Number(item.discount_customer) + Number(item.discount_lab) + Number(item.discount_order)
    let grand_total = total - discount

    item.total = total
    item.discount = discount
    item.net = grand_total
    console.log(discountType, discountValue, total, amount, percent, grand_total)
    return item
  })
  formInvoice.value.items = items
  discountCustomer.value = 0
  let unit = discountType === 'percentage' ? '%' : 'บาท'
  toast(`เพิ่มส่วนลด : ${discountValue} ${unit} สำเร็จ`, {
    theme: 'auto',
    type: 'info',
    dangerouslyHTMLString: true,
  })
}
const onSelectCustomer = (data) => {
  console.log(data)
  const customer = data?.customers
  const contact = data?.contacts
  formInvoice.value.customer_id = customer?.id
  formInvoice.value.customer_name = customer?.companyname
  if (contact.id !== undefined) {
    formInvoice.value.contact_name = contact?.contactname
    formInvoice.value.contact_id = contact?.id
  }

  let address = `${customer?.address} 
  ${customer?.subdistrict} 
  ${customer?.district} 
  ${customer?.province} 
  ${customer?.postalcode}`.trim()
  formInvoice.value.address = address.trim()
  loadCart()
}
const openModalContact = () => {
  modalContact.value.show()
}
const onSelectContact = (data) => {
  formInvoice.value.contact_id = data.id
  formInvoice.value.contact_name = data.contactname
}
const onChangeDiscountType = (e) => {
  formInvoice.value.discount_type = e.target.value
  calculate()
}

const resetData = () => {
  formInvoice.value = {}
  invoiceStore.setForm({})
}

const saveAsDraft = () => {
  formInvoice.value.invoice_status = 'draft'
  if (confirm('ยันยันบันทึกใบแจ้งหนี้เป็นฉบับร่าง ?')) {
    save()
  }
}
const saveAndSend = () => {
  formInvoice.value.invoice_status = 'pending'
  if (confirm('ยันยันบันทึกและส่งใบแจ้งหนี้ ?')) {
    save()
  }
}
const getInvoice = async (id) => {
  loading.value = true
  const { data } = await api.get('v2/invoices/' + id)
  if (data) {
    formInvoice.value = data
    if (Number(formInvoice.value.vat_percent) == 0) {
      formInvoice.value.vat_percent = appStore.settings.vat
    }
  }
  loading.value = false
}
getInvoice(1)
const save = async () => {
  hasError.value = false
  formInvoice.value.items = items.value
  formInvoice.value.totalprice = totalPrice.value
  formInvoice.value.totaldiscount = totalDiscount.value
  formInvoice.value.totalvat = (totalPriceAfterDiscount.value * appStore.settings.vat) / 100
  formInvoice.value.totalnet = totalNet.value
  formInvoice.value.staff_id = appStore.user.id

  if (formMode.value === 'edit') {
    loading.value = true
    const { data } = await api
      .post(`v2/invoices/${formInvoice.value.id}`, formInvoice.value)
      .catch((err) => {
        console.error(err)
        errors.value = err.response.data.errors
        loading.value = false
        hasError.value = true
        let message = err.response.data?.message
        toast(message, {
          theme: 'auto',
          type: 'error',
          dangerouslyHTMLString: true,
        })
      })
    if (data) {
      loading.value = false
      getInvoice(formInvoice.value.id)
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

  if (formMode.value === 'add') {
    loading.value = true
    const { data } = await api.post('v2/invoices', formInvoice.value).catch((err) => {
      console.error(err)
      errors.value = err.response.data.errors
      loading.value = false
      hasError.value = true
      let message = err.response.data?.message
      toast(message, {
        theme: 'auto',
        type: 'error',
        dangerouslyHTMLString: true,
      })
    })
    if (data) {
      loading.value = false
      emptyCart()
      resetData()
      loadCart()
      getCustomerTypes()
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
  // { text: 'sorter', value: 'sorter', width: 30 },
  { text: 'bill_code', value: 'bill_code', width: 150 },
  { text: 'เครื่องมือ', value: 'product_name', width: 200 },
  { text: 'ราคา/หน่วย', value: 'price', width: 100 },
  { text: 'ส่วนลด Cust.', value: 'discount_customer' },
  { text: 'ส่วนลด Lab', value: 'discount_lab' },
  { text: 'ส่วนลด Order.', value: 'discount_order' },
  { text: 'ส่วนลด', value: 'discount' },
  { text: 'รวมเป็นเงิน', value: 'net', width: 150 },
  { text: 'หมายเหตุ', value: 'remark' },
]
const tableFields = [
  { key: 'index', label: '#' },
  { key: 'bill_code', sortable: true },
  { key: 'product_name', label: 'รายการ', sortable: true, sticky: true },
  { key: 'price', label: 'ราคา', sortable: true },
  { key: 'discount_customer', label: 'ส่วนลด Cust', sortable: true },
  { key: 'discount_lab', label: 'ส่วนลด Lab', sortable: true },
  { key: 'discount_order', label: 'ส่วนลด Order', sortable: true },
  { key: 'discount', label: 'ส่วนลด', sortable: true },
  { key: 'net', label: 'จำนวนเงิน', sortable: true },
  { key: 'remark', sortable: false, label: 'Remark' },
]
getCustomerTypes()

watch(formInvoice.value, () => {
  invoiceStore.setForm(formInvoice.value)
})
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

          <li v-if="formMode === 'add'" class="breadcrumb-item active">สร้างใบแจ้งหนี้</li>
          <li v-if="formMode === 'edit'" class="breadcrumb-item active">{{ formInvoice.code }}</li>
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
                      <div class="input-group input-group-sm">
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          @click="openModalCustomer"
                        >
                          <i class="bi bi-person"></i>
                        </button>
                        <input
                          type="search"
                          v-model="formInvoice.customer_name"
                          class="form-control form-control-sm"
                          placeholder="บริษัท"
                        />
                        <input
                          type="hidden"
                          v-model="formInvoice.customer_id"
                          class="form-control form-control-sm"
                          placeholder="รหัสลูกค้า"
                        />
                      </div>
                    </div>
                    <div
                      class="col-12 col-md-8 col-lg-6"
                      :class="[{ 'text-danger': errors.address }]"
                    >
                      <label>ที่อยู่</label>
                      <input
                        type="text"
                        v-model="formInvoice.address"
                        class="form-control form-control-sm"
                        placeholder="ที่อยู่"
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
                      <div class="input-group input-group-sm">
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          @click="openModalContact"
                        >
                          <i class="bi bi-person-vcard"></i>
                        </button>
                        <input
                          type="search"
                          v-model="formInvoice.contact_name"
                          class="form-control form-control-sm"
                          placeholder=""
                        />
                      </div>
                    </div>

                    <div
                      class="col-6 col-md-4 col-lg-3"
                      :class="[{ 'text-danger': errors.customer_type }]"
                    >
                      <label
                        >ประเภทลูกค้า
                        <span v-if="formInvoice.customer_type_code">
                          ({{ formInvoice.customer_type_code }})</span
                        >
                      </label>

                      <select
                        required
                        class="form-select form-select-sm"
                        v-model="formInvoice.customer_type_code"
                        @change="onChangeCustomerType"
                      >
                        <option v-for="(item, key) in customerTypes" :key="key" :value="item.code">
                          {{ item.code }} : {{ item.name }} - {{ item.nameen }}
                        </option>
                      </select>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <div></div>
                    </div>
                  </div>
                </div>

                <!-- <button type="button" @click="formInvoice.customer_type_code = ''">x</button> -->
                <div class="">
                  <div class="row my-2 g-2">
                    <div class="col-12 col-md-6">
                      <div
                        class="btn-toolbar float-start"
                        role="toolbar"
                        aria-label="Toolbar with button groups"
                      >
                        <div class="btn-group me-2" role="group" aria-label="">
                          <button
                            type="button"
                            class="btn btn-sm btn-danger"
                            @click="removeCart()"
                            v-if="itemsSelected.length"
                          >
                            <i class="bi bi-trash" role="button"></i>
                            <span>({{ itemsSelected.length }})</span>
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
                            class="btn btn-sm btn-success"
                            @click="openModalWorkOrder()"
                          >
                            <i class="bi bi-plus" role="button"></i> เพิ่มเครื่องมือ
                          </button>
                          <!-- <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            @click="openModalWorkOrder()"
                          >
                            <i class="bi bi-plus" role="button"></i> ดึงข้อมูล Invoice ยกเลิก
                          </button> -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="errors.items" :class="[{ 'text-danger my-2': errors.items }]">
                    โปรดระบุรายการเครื่องมือ
                  </div>
                  <!-- ################################################## -->

                  <BTable
                    busyLoadingText="กำหลังโหลด.."
                    stickyHeader
                    responsive
                    hover
                    small
                    caption-top
                    bordered
                    :items="formInvoice.items"
                    :fields="tableFields"
                    :busy="loading"
                  >
                    <template #cell(index)="row">
                      {{ row.index + 1 }}
                      <!-- <BButton
                        size="sm"
                        class="mr-1"
                        @click="info(row.item, row.index)"
                        icon="bi bi-eye"
                      >
                        <i class="bi bi-eye"></i>
                      </BButton> -->
                    </template>
                    <template #cell(price)="row">
                      <BInput
                        type="number"
                        min="0"
                        v-model="row.item.price"
                        style="width: 80px"
                        @change="updateInvoiceInput($event, row, 'price')"
                      />
                      <!-- <BButton
                        size="sm"
                        class="mr-1"
                        @click="info(row.item, row.index)"
                        icon="bi bi-eye"
                      >
                        <i class="bi bi-eye"></i>
                      </BButton> -->
                    </template>
                    <template #cell(discount_customer)="row">
                      <product-discount-input
                        :index="row.index"
                        :data="row.item"
                        fieldAmount="discount_customer"
                        fieldPercent="discount_customer_percent"
                        @change="updateDiscountRow($event, row, row.index)"
                      />
                    </template>
                    <template #cell(discount_lab)="row">
                      <product-discount-input
                        :index="row.index"
                        :data="row.item"
                        fieldAmount="discount_lab"
                        fieldPercent="discount_lab_percent"
                        @change="updateDiscountRow($event, row, row.index)"
                      />
                    </template>
                    <template #cell(discount_order)="row">
                      <product-discount-input
                        :index="row.index"
                        :data="row.item"
                        fieldAmount="discount_order"
                        fieldPercent="discount_order_percent"
                        @change="updateDiscountRow($event, row, row.index)"
                      />
                    </template>
                  </BTable>
                  <!-- ################################################## -->

                  <!-- <EasyDataTable
                    class="my-3"
                    :headers="headers"
                    :items="formInvoice.items"
                    v-model:items-selected="itemsSelected"
                    show-index
                    border-cell
                    fixed-header
                    :loading="invoiceStore.cartLoading"
                    bodyStyle="height:400px"
                    hide-rows-per-page
                    table-height="300"
                  >
      
                    <template #empty-message>
                      <p class="">ไม่พบรายการใดๆ</p>
                    </template>
                    <template #item-product="item">
                      {{ item.product_name }}
                      <div class="fw-bold text-dark">
                        {{ item.product?.code }}
                        {{ item.product?.name }}
                        <i class="bi bi-star text-danger ms-2" v-if="item.product?.is_job"></i>
                        <span class="mx-2 text-danger">
                          <i class="bi bi-arrow-down text-danger ms-2" v-if="item.discount"> </i>
                          -{{ myCurrency(item.discount) }}
                        </span>
                      </div>
                    </template>
                    <template #item-discount="item">
                      <div class="fw-bold text-danger" v-if="item.discount">
                        {{ myCurrency(item.discount) }}
                      </div>
                    </template>
                    <template #item-discount_lab="item">

                      <ProductDiscountInput
                        :rowKey="item.index"
                        :data="item"
                        fieldAmount="discount_lab"
                        fieldPercent="discount_lab_percent"
                        @change="updateDiscountRow($event, item, item.index)"
                      />
                    </template>
                    <template #item-discount_order="item">
                      <ProductDiscountInput
                        :rowKey="item.index"
                        :data="item"
                        fieldAmount="discount_order"
                        fieldPercent="discount_order_percent"
                        @change="updateDiscountRow($event, item, item.index)"
                      />
                    </template>
                    <template #item-discount_customer="item">
                      <ProductDiscountInput
                        :rowKey="item.index"
                        :data="item"
                        fieldAmount="discount_customer"
                        fieldPercent="discount_customer_percent"
                        @change="updateDiscountRow($event, item, item.index)"
                      />

                    </template>
                    <template #item-qty="item">
                      <input
                        type="number"
                        v-model="item.qty"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'qty')"
                        min="1"
                      />
                    </template>
                    <template #item-price="item">
                      <input
                        type="number"
                        v-model="item.price"
                        class="text-end"
                        @change="updateInvoiceInput($event, item, 'price')"
                        min="0"
                      />
                    </template>
                    <template #item-total="item">
                      <div class="text-end">
                        <div class="fw-bold text-muted" v-if="item.discount > 0">
                          <del>{{ myCurrency(item.price) }}</del>
                        </div>
                        <div class="fw-bold text-dark h5">{{ myCurrency(item.net) }}</div>
                      </div>
                    </template>
                    <template #item-remark="item">
                      <input
                        type="text"
                        v-model="item.remark"
                        class=""
                        @change="updateInvoiceInput($event, item, 'remark')"
                      />
                    </template>
                  </EasyDataTable> -->
                </div>

                <!-- ################ DISCOUNT ################################# -->
                <div class="row">
                  <div class="col-12 col-sm-6" style="font-size: 14px">
                    <div class="input-group input-group-sm mb-3">
                      <label class="input-group-text bg-danger text-white">
                        <i class="bi bi-gift me-2"></i> ส่วนลดลูกค้า</label
                      >

                      <input
                        type="number"
                        v-model="discountCustomer"
                        class="form-control form-control-sm"
                        placeholder="จำนวนเงิน"
                        min="0"
                        style="width: 100px"
                      />
                      <select
                        required
                        class="form-select form-select-sm"
                        style="width: 90px"
                        v-model="discountCustomerType"
                        @change="onChangeDiscountType"
                      >
                        <option value="percentage" :selected="percentage">%</option>
                        <option value="amount" :selected="amount">บาท</option>
                      </select>
                      <button class="btn btn-secondary" @click="addDiscountCustomer" type="button">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6" style="font-size: 14px">
                    <div class="input-group input-group-sm mb-3">
                      <label class="input-group-text bg-danger text-white"
                        ><i class="bi bi-gift me-2"></i> ส่วนลดท้ายบิล</label
                      >
                      <input
                        type="number"
                        v-model="formInvoice.total_bill_discount"
                        class="text-end"
                      />
                    </div>
                  </div>
                </div>

                <!-- #################### SUMMAYRY ####################### -->
                <div class="row g-1">
                  <div class="col-12 col-md-6" style="font-size: 14px">
                    <div class="row border border-danger m-1">
                      <div class="col-6 text-end">ส่วนลด Customer</div>
                      <div class="col-6">
                        <div class="text-end fw-bold">
                          - {{ myCurrency(totalCustomerTypeDiscount) }}
                        </div>
                      </div>

                      <div class="col-6 text-end">ส่วนลด Lab</div>
                      <div class="col-6">
                        <div class="text-end fw-bold">- {{ myCurrency(totalLabDiscount) }}</div>
                      </div>
                      <div class="col-6 text-end">ส่วนลด Order Type</div>
                      <div class="col-6">
                        <div class="text-end fw-bold">
                          - {{ myCurrency(totalOrderTypeDiscount) }}
                        </div>
                      </div>

                      <div class="col-6 text-end">ส่วนลดท้ายบิล</div>
                      <div class="col-6">
                        <div class="text-end fw-bold">- {{ myCurrency(totalBillDiscount) }}</div>
                      </div>
                      <div class="col-6 text-end">รวมส่วนลดทั้งหมด</div>
                      <div class="col-6">
                        <div class="text-end fw-bold text-danger">
                          - {{ myCurrency(totalAllDiscount) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6" style="font-size: 14px">
                    <div class="row">
                      <div class="col-6 text-end">รวมเงิน</div>
                      <div class="col-6">
                        <div class="text-end fw-bold">{{ myCurrency(totalPrice) }}</div>
                      </div>
                    </div>
                    <div class="row" v-if="totalAllDiscount > 0">
                      <div class="col-6 text-end">ส่วนลด</div>
                      <div class="col-6">
                        <div class="text-end fw-bold text-danger">
                          - {{ myCurrency(totalAllDiscount) }}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6 text-end">คงเหลือ</div>
                      <div class="col-6">
                        <div class="text-end fw-bold text-decoration-underline">
                          {{ myCurrency(totalPriceAfterDiscount) }}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6 text-end">VAT {{ vatPercent }}%</div>
                      <div class="col-6">
                        <div class="text-end fw-bold text-decoration-underline">
                          {{ myCurrency(totalVat) }}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6 text-end">จำนวนเงินทั้งสิ้น</div>
                      <div class="col-6">
                        <div class="text-end fw-bold h4 text-decoration-underline">
                          {{ myCurrency(totalNet) }}
                        </div>
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
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-outline-secondary btn-md mx-1" type="button">
                  <i class="bi bi-calculator"></i> คำนวณ
                </button>
                <button class="btn btn-outline-secondary btn-md mx-1" type="button">
                  <i class="bi bi-eye"></i> ดูตัวอย่าง
                </button>
                <button class="btn btn-primary btn-md mx-1" type="submit" @click="saveAsDraft()">
                  <i class="bi bi-save"></i> บันทึก(ร่าง)
                </button>
                <button class="btn btn-primary btn-md mx-1" type="submit" @click="saveAndSend()">
                  <i class="bi bi-save"></i> บันทึกและส่ง
                </button>
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

      <ModalWorkOrder
        ref="modalWorkOrder"
        @select="onSelectProduct"
        :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }"
      />
      <ModalCustomer
        ref="modalCustomer"
        @select="onSelectCustomer"
        :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }"
        @clear="
          () => {
            formInvoice.customer_id = ''
            formInvoice.customer_name = ''
          }
        "
      />
      <ModalContact
        ref="modalContact"
        @select="onSelectContact"
        :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }"
        @clear="
          () => {
            formInvoice.contact_id = ''
            formInvoice.contact_name = ''
          }
        "
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
label {
  font-size: small;
  // font-style: italic;
}
</style>
