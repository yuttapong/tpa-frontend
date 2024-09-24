<script setup>
import { onMounted, computed, ref, reactive, onUpdated, watch } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { toast } from 'vue3-toastify'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useAppStore } from '@/stores/appStore'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'
import ModalWorkOrder from '@/views/invoice/components/ModalWorkOrder.vue'
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import ModalBillSelect from '@/views/invoice/components/ModalBillSelect.vue'
import ProductDiscountInput from '@/views/invoice/components/ProductDiscountInput.vue'
import ProductDiscountDetail from '@/views/invoice/components/ProductDiscountDetail.vue'
import InvoiceDetail from '@/views/invoice/components/InvoiceDetail.vue'
import { useRouter, useRoute } from 'vue-router'
import { add, format, formatDate } from 'date-fns'
import { myCurrency, myFormatDateTime, myFormatDate } from '@/helpers/myformat'
import { useModalController, useModal } from 'bootstrap-vue-next'
import { invoiceStatuses } from '@/config'
import { pointRangeToPricePerUnit } from '@/helpers/order'

const appStore = useAppStore()
const pagination = ref({
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(false)
const hasError = ref(false)
const router = useRouter()
const route = useRoute()
const modal = useModal()
const { confirm } = useModalController()
const modalBill = ref(null)
const modalWorkOrder = ref(null)
const modalContact = ref(null)
const modalCustomer = ref(null)
const visibleModalEditItem = ref(false)
const infoProduct = ref({})
const invoiceId = computed(() => route.params.id)
const itemsSelected = ref([])
const visibleModalConfirmDel = ref(false)
const visibleModalPreview = ref(false)
const itemView = ref({})
const errors = ref([])
const formMode = computed(() => {
  if (formInvoice.value?.code !== undefined) {
    return 'edit'
  } else {
    return 'add'
  }
})
const modeModalBill = ref('customer')

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
const discountTypes = [
  { value: 'A', text: 'A:ปกติ (คิดส่วนลดและสะสมยอด)' },
  { value: 'B', text: 'B:ไม่เอาส่วนลดแต่สะสมยอด' },
  { value: 'C', text: 'C:ไม่เอาส่วนลดและไม่สะสมยอด' },
]
const dueWithinList = [
  {
    text: '0 วัน',
    value: 0,
  },
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
  issue_date: formatDate(new Date(), 'yyyy-MM-dd'),
  vat_percent: appStore.settings.vat,
  items: [],
})
const formDiscountAdd = ref({
  index: null,
  discountCustomerType: 'percentage',
  discountCustomerValue: 0,
  discountLabType: 'percentage',
  discountLabValue: 0,
  discountOrderType: 'percentage',
  discountOrderValue: 0,
})


const items = computed(() => formInvoice.value.items)
const vatPercent = computed(() => formInvoice.value.vat_percent || 0)
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
  } catch (error) { }
}

const openModalWorkOrder = () => {
  modalWorkOrder.value.show()
}

const addItems = async (item) => {
  let qty = 1
  let price = Number(item.price)
  let total = Number(price) * qty
  let row = {
    is_job: item.product.is_job || 1,
    item_id: 0,
    bill_id: item.bill_id,
    bill_items_code: item.item_code,
    bill_items_id: item.item_id,
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
    range: Number(item?.range_value),
    range_price: Number(item?.range_price),
    point: Number(item?.point),
    point_price: Number(item?.point_price),
    discount: 0,
    discount_percent: 0,
    discount_lab_type: 'percentage',
    discount_lab: 0,
    discount_lab_percent: 0,
    discount_order_type: 'percentage',
    discount_order: 0,
    discount_order_percent: 0,
    discount_customer_type: 'percentage',
    discount_customer: 0,
    discount_customer_percent: 0,
    qty: qty,
    price: price,
    vat: 0,
    total: total,
    net: total,
    product: item?.product,
    staff_id: appStore.user.id,
    invoice_item_id: item?.invoice_item_id,
  }
  let items = []
  items.push(row)
  formInvoice.value.items.push(row)
  calculate()
  save()
}

const fillDataBill = async (bill, billItems) => {
  formInvoice.value.note_customer = bill.note_customers
  if (billItems.length > 0) {
    billItems.map((item) => {
      let qty = item.qty || 1
      let price = Number(item.price)
      let total = Number(price) * qty
      let row = {
        is_job: item.product.is_job || 1,
        has_vat: item.product.has_vat || 1,
        item_id: 0,
        bill_id: item.bill_id,
        bill_items_code: item.item_code,
        bill_items_id: item.item_id,
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
        range: Number(item?.range_value),
        range_price: Number(item?.range_price),
        point: Number(item?.point),
        point_price: Number(item?.point_price),
        discount: 0,
        discount_percent: 0,
        discount_lab_type: 'percentage',
        discount_lab: 0,
        discount_lab_percent: 0,
        discount_order_type: 'percentage',
        discount_order: 0,
        discount_order_percent: 0,
        discount_customer_type: 'percentage',
        discount_customer: 0,
        discount_customer_percent: 0,
        qty: qty,
        price: price,
        vat: 0,
        total: total,
        net: total,
        product: item?.product,
        staff_id: appStore.user.id,
        invoice_item_id: item?.invoice_item_id,
      }
      formInvoice.value.items.push(row)
    })
  }

  calculate()
  setTimeout(() => save(), 500)
}

const fillDataCustomer = async (bill, billItems) => {
  if (bill) {
    let addressText =
      `${bill?.address_name} ${bill?.address_detail} ${bill?.address_province} ${bill?.address_zipcode}`.trim()
    let data = {
      customer_id: bill?.company_id,
      customer_name: bill?.address_name,
      address: addressText,
      phone: bill?.address_phone,
      contact_id: bill?.agent_id,
      contact_name: bill?.agent_name,
      bill_code: bill?.code,
      bill_id: bill?.id,
    }
    formInvoice.value.customer_id = data.customer_id
    formInvoice.value.customer_name = data.customer_name
    formInvoice.value.customer_type_code = bill.customer?.customer_type?.code
    formInvoice.value.address = data.address
    formInvoice.value.phone = data.phone
    formInvoice.value.contact_id = data.contact_id
    formInvoice.value.contact_name = data.contact_name
    formInvoice.value.bill_id = data?.bill_id
    formInvoice.value.bill_code = data?.bill_code
    formInvoice.value.note_customer = bill?.note_customers

    //fill address
    if (!formInvoice.value.subdistrict) formInvoice.value.subdistrict = bill.customer?.subdistrict

    if (!formInvoice.value.district) formInvoice.value.district = bill.customer?.district

    if (!formInvoice.value.province) formInvoice.value.province = bill.customer?.province

    if (!formInvoice.value.postalcode) formInvoice.value.postalcode = bill.customer?.postalcode

    if (!formInvoice.value.country) formInvoice.value.country = bill.customer?.country
  }
}

const showConfirmDeleteItems = async () => {
  const value = await confirm?.({
    props: {
      title: `ต้องการลบรายการใบแจ้งหนี้ใช่หรือไม่ ?`,
      okTitle: 'ใช่',
      cancelTitle: 'ไม่ใช่',
      body: `${itemsSelected.value.length} รายการ`,
      okVariant: 'danger',
    },
  })
  if (value) {
    deleteItems()
  }
}

const deleteItems = () => {
  if (itemsSelected.value.length > 0) {
    itemsSelected.value.map((row) => {
      items.value.map((product, index) => {
        if (String(row.item_id) == String(product.item_id)) {
          formInvoice.value.items.splice(index, 1)
        }
      })
    })
    save()
    itemsSelected.value = []
  }
}
const onChangeCustomerType = () => {
  calculate()
}
const calPriceFromPointAndRange = (row) => {
  let items = formInvoice.value.items.map((item, index) => {
    if (index === row.index) {
      console.log(index, item.index, row.value)
      item.price = pointRangeToPricePerUnit(
        row.item.point,
        row.item.point_price,
        row.item.range,
        row.item.range_price,
      )
    }
    return item
  })
  formInvoice.value.items = items
  calculate()
}
const onChangePricePerUnit = (row) => {
  let items = formInvoice.value.items.map((item, index) => {
    if (index === row.index) {
      console.log(index, item.index, row.value)
      item.price = row.value
    }
    return item
  })
  formInvoice.value.items = items
  calculate()
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

/**
 * แสดง Modal เลือกลูกค้า
 */
const openModalCustomer = () => {
  modalCustomer.value.show()
}

const updatePriceItems = (row) => {
  calculate()
}
/**
 * คำนวณส่วนลดให้ให้ฟอร์มใน Modal แก้ไขรายการการย่าย
 * @param {} type
 */
const updateDiscountItem = (type) => {
  if (!type) return false
  let row = infoProduct.value
  let percent = 0
  let amount = 0
  let price = Number(row.price)
  // let price = pointRangeToPricePerUnit(row.point, row.point_price, row.range, row.range_price);
  row.total = price

  if (type) {
    switch (type) {
      case 'customer':
        if (formDiscountAdd.value.discountCustomerType == 'percentage') {
          percent = Number(formDiscountAdd.value.discountCustomerValue)
          amount = (Number(formDiscountAdd.value.discountCustomerValue) * price) / 100
        } else {
          amount = Number(formDiscountAdd.value.discountCustomerValue)
          percent = (Number(formDiscountAdd.value.discountCustomerValue) * 100) / price
        }
        row.discount_customer_type = formDiscountAdd.value.discountCustomerType
        row.discount_customer_percent = percent
        row.discount_customer = amount
        row.discount =
          Number(row.discount_customer) + Number(row.discount_lab) + Number(row.discount_order)
        row.net = Number(price) - Number(row.discount)
        formInvoice.value.items = formInvoice.value.items.map((item, itemKey) => {
          if (itemKey === formDiscountAdd.value.index) {
            item = row
          }
          return item
        })
        calculate()
        break
      case 'lab':
        if (formDiscountAdd.value.discountLabType == 'percentage') {
          percent = Number(formDiscountAdd.value.discountLabValue)
          amount = (Number(formDiscountAdd.value.discountLabValue) * price) / 100
        } else {
          amount = Number(formDiscountAdd.value.discountLabValue)
          percent = (Number(formDiscountAdd.value.discountLabValue) * 100) / price
        }
        row.discount_lab_type = formDiscountAdd.value.discountLabType
        row.discount_lab_percent = percent
        row.discount_lab = amount
        row.discount =
          Number(row.discount_customer) + Number(row.discount_lab) + Number(row.discount_order)
        row.net = Number(price) - Number(row.discount)
        formInvoice.value.items = formInvoice.value.items.map((item, itemKey) => {
          if (itemKey === formDiscountAdd.value.index) {
            item = row
          }
          return item
        })
        calculate()
        break
      case 'order':
        if (formDiscountAdd.value.discountOrderType == 'percentage') {
          percent = Number(formDiscountAdd.value.discountOrderValue)
          amount = (Number(formDiscountAdd.value.discountOrderValue) * price) / 100
        } else {
          amount = Number(formDiscountAdd.value.discountOrderValue)
          percent = (Number(formDiscountAdd.value.discountOrderValue) * 100) / price
        }
        row.discount_order_type = formDiscountAdd.value.discountOrderType
        row.discount_order_percent = percent
        row.discount_order = amount
        row.discount =
          Number(row.discount_customer) + Number(row.discount_lab) + Number(row.discount_order)
        row.net = Number(price) - Number(row.discount)
        formInvoice.value.items = formInvoice.value.items.map((item, itemKey) => {
          if (itemKey === formDiscountAdd.value.index) {
            item = row
          }
          return item
        })
        calculate()
        break
      case 'price':
        // discount customer
        if (row.discount_customer_type == 'percentage') {
          row.discount_customer_percent = Number(row.discount_customer_percent)
          row.discount_customer = (Number(row.discount_customer_percent) * price) / 100
        } else if (row.discount_customer_type == 'amount') {
          row.discount_customer = Number(row.discount_customer)
          row.discount_customer_percent = (Number(row.discount_customer) * 100) / price
        }
        // discount lab
        if (row.discount_lab_type == 'percentage') {
          row.discount_lab_percent = Number(row.discount_lab_percent)
          row.discount_lab = (Number(row.discount_lab_percent) * price) / 100
        } else if (row.discount_lab_type == 'amount') {
          row.discount_lab = Number(row.discount_lab)
          row.discount_lab_percent = (Number(row.discount_lab) * 100) / price
        }
        // discount order
        if (row.discount_order_type == 'percentage') {
          row.discount_order_percent = Number(row.discount_order_percent)
          row.discount_order = (Number(row.discount_order_percent) * price) / 100
        } else if (row.discount_order_type == 'amount') {
          row.discount_order = Number(row.discount_order)
          row.discount_order_percent = (Number(row.discount_order) * 100) / price
        }
        //console.log('price', row.discount_customer_percent, row.discount_customer, row.discount_customer_type);

        row.discount =
          Number(row.discount_customer) + Number(row.discount_lab) + Number(row.discount_order)
        row.net = Number(price) - Number(row.discount)
        formInvoice.value.items = formInvoice.value.items.map((item, itemKey) => {
          if (itemKey === formDiscountAdd.value.index) {
            item = row
          }
          return item
        })
        calculate()
        break
    }
  }
}

/**
 * คำนวณตัวเลขทั้งหมดก่อนส่งไปบันทึก DB
 */
const calculate = () => {
  let items = formInvoice.value.items.map((item) => {
    let qty = Number(item.qty) || 1
    let price = Number(item.price)
    let total = price * qty;
    let vatPercent = Number(formInvoice.value.vat_percent)
    let vat = 0;
    let discount = 0;
    console.log(item);
    discount = Number(item.discount_customer) + Number(item.discount_lab) + Number(item.discount_order)
    if (vatPercent > 0) {
      vat = ((total - discount) * vatPercent) / 100
    }
    item.qty = qty
    item.discount = discount
    item.price = price
    item.total = total
    item.vat = vat
    item.net = (price - discount) + vat
    return item
  })
  formInvoice.value.items = items
  formInvoice.value.totaldiscount = totalAllDiscount.value
  formInvoice.value.totalprice = totalPrice.value
  formInvoice.value.totavat = totalVat.value
  formInvoice.value.totalnet = totalNet.value
}

/**
 * เพิ่มส่วนลดลูกค้าที่ละหลายรายการครั้งเดียว ส่วนลดลูกค้า
 */
const addDiscountCustomer = () => {
  let temp = formInvoice.value?.items || []
  let discountType = discountCustomerType.value
  let discountValue = discountCustomer.value

  let items = temp.map((item) => {
    let percent = 0
    let amount = 0
    // let price = pointRangeToPricePerUnit(item.point, item.point_price, item.range, item.range_price)
    let price = Number(item.price)
    let total = Number(item.price) * Number(item.qty)

    if (item.product && Number(item.product.is_job) === 1 && Number(total > 0)) {
      if (discountType == 'percentage') {
        item.discount_customer_percent = discountValue
        amount = (total * discountValue) / 100
        percent = Number(discountValue).toFixed(2)
      } else if (discountType == 'amount') {
        amount = discountValue
        percent = Number((discountValue * 100) / total).toFixed(2)
      }
    }

    item.discount_customer_type = discountType
    item.discount_customer = amount
    item.discount_customer_percent = percent

    let discount =
      Number(item.discount_customer) + Number(item.discount_lab) + Number(item.discount_order)
    item.price = price
    item.total = total
    item.discount = discount
    if (formInvoice.value.vat_percent) {
      item.vat = ((total - discount) * formInvoice.value.vat_percent) / 100
    }
    item.net = total - discount + item.vat
    return item
  })

  formInvoice.value.items = items
  discountCustomer.value = 0
  save(true)
}

/**
 * เพิ่มส่วนลดลูกค้าที่ละหลายรายการครั้งเดียว ส่วนลดลูกค้า
 */
const onChangeDiscountTypeOfItems = (item, typeName, discountType) => {
  let index = formInvoice.value.items.indexOf(item)

  let discountValue = 0
  if (discountType == 'percentage') {
    discountValue = Number(item[`discount_${typeName}_percent`])
  } else if (discountType == 'amount') {
    discountValue = Number(item[`discount_${typeName}`])
  }

  let percent = 0
  let amount = 0
  let qty = Number(item.qty) || 1
  let price = Number(item.price)
  let total = price * qty
  let vat = 0
  let vatPercent = Number(formInvoice.value.vat_percent)
  let discount = 0

  if (product && (Boolean(item.product.is_job) === true) && Number(total > 0)) {
    if (discountType == 'percentage') {
      amount = (total * discountValue) / 100
      percent = (discountValue).toFixed(2)
    } else if (discountType == 'amount') {
      amount = discountValue
      percent = ((discountValue * 100) / total).toFixed(2)
    }
  }
  discount = Number(item.discount_customer) + Number(item.discount_lab) + Number(item.discount_order)

  item[`discount_${typeName}_type`] = discountType
  item[`discount_${typeName}`] = amount
  item[`discount_${typeName}_percent`] = percent

  if (vatPercent) {
    vat = ((total - discount) * vatPercent) / 100
  }

  item.price = price
  item.total = total
  item.discount = discount
  item.vat = vat
  item.net = total - discount + vat
  formInvoice.value.items[index] = item
}

const onSelectCustomer = (data) => {
  const customer = data?.customers
  const contact = data?.contacts

  formInvoice.value.bill_id = data.id
  formInvoice.value.bill_code = data.code
  formInvoice.value.customer_id = customer?.id
  formInvoice.value.customer_id = customer?.id
  formInvoice.value.customer_name = customer?.companyname
  formInvoice.value.customer_type_code = customer?.customer_type?.code
  formInvoice.value.customerType = customer?.customer_type

  if (contact.id != undefined) {
    formInvoice.value.contact_name = contact?.contactname
    formInvoice.value.contact_id = contact?.id
  }

  let address = `${customer?.address}
  ${customer?.subdistrict}
  ${customer?.district}
  ${customer?.province}
  ${customer?.postalcode}`.trim()
  formInvoice.value.address = address.trim()
}
const openModalContact = () => {
  modalContact.value.show()
}

const openModalPreview = async (inv) => {
  itemView.value = inv
  invoiceStore.invoice = inv
  visibleModalPreview.value = true
  const { data } = await api.get(`v2/invoices/${inv.id}`)
  if (data) invoiceStore.invoice = data
}

const openModalBill = (data) => {
  modalBill.value.show()
}

const onSelectContact = (data) => {
  formInvoice.value.contact_id = data.id
  formInvoice.value.contact_name = data.contactname
}

const onChangeDiscountType = (e) => {
  formInvoice.value.discount_type = e.target.value
  calculate()
}
const onChangeDueWithin = (e) => {
  let due_date = add(new Date(formInvoice.value.issue_date), {
    days: formInvoice.value.due_within,
  })
  formInvoice.value.due_date = due_date
}

const saveAsDraft = (notify = false) => {
  formInvoice.value.invoice_status = 'draft'
  save(notify)
}
const saveAndSend = () => { }

const getInvoice = async (id) => {
  loading.value = true
  const { data } = await api.get('v2/invoices/' + id)
  if (data) {
    formInvoice.value = data
    if (formInvoice.value.tot)
      if (!formInvoice.value.subdistrict) formInvoice.value.subdistrict = data.customer?.subdistrict

    if (!formInvoice.value.district) formInvoice.value.district = data.customer?.district

    if (!formInvoice.value.province) formInvoice.value.province = data.customer?.province

    if (!formInvoice.value.postalcode) formInvoice.value.postalcode = data.customer?.postalcode

    if (!formInvoice.value.country) formInvoice.value.country = data.customer?.country
  }
  loading.value = false
}

const save = async (notify = false) => {
  hasError.value = false
  calculate()
  setTimeout(async () => {
    formInvoice.value.items = items.value
    formInvoice.value.totalprice = totalPrice.value
    formInvoice.value.totaldiscount = totalDiscount.value // ไม่รวมส่วนลดท้ายบิล
    formInvoice.value.totalvat = (totalPriceAfterDiscount.value * vatPercent.value) / 100
    formInvoice.value.totalnet = totalNet.value
    formInvoice.value.staff_id = appStore.user.id

    if (formMode.value === 'edit') {
      loading.value = true
      const { data, status } = await api
        .put(`v2/invoices/${formInvoice.value.id}`, formInvoice.value)
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

      if (status == 200) {
        loading.value = false
        formInvoice.value = data?.data

        //fill address
        let bill = data.data
        if (!formInvoice.value.subdistrict)
          formInvoice.value.subdistrict = bill.customer?.subdistrict

        if (!formInvoice.value.district) formInvoice.value.district = bill.customer?.district

        if (!formInvoice.value.province) formInvoice.value.province = bill.customer?.province

        if (!formInvoice.value.postalcode) formInvoice.value.postalcode = bill.customer?.postalcode

        if (!formInvoice.value.country) formInvoice.value.country = bill.customer?.country

        if (notify) {
          toast(data.message, {
            theme: 'auto',
            type: 'success',
            dangerouslyHTMLString: true,
          })
        }
      } else if (status == 422) {
        errors.value = data.errors
        loading.value = false
        hasError.value = true
        let message = data?.message
        toast(message, {
          theme: 'auto',
          type: 'error',
          dangerouslyHTMLString: true,
        })
      }
    }

    if (formMode.value === 'add') {
      loading.value = true
      try {
        const { data, status } = await api.post('v2/invoices', formInvoice.value)
        if (status == 200) {
          loading.value = false
          hasError.value = true
          errors.value = loading.value = false
          router.push('/invoices/edit/' + data.data?.id)
          toast(resultCreate.data.message, {
            theme: 'auto',
            type: 'success',
            dangerouslyHTMLString: true,
          })
        } else if (status == 422) {
          errors.value = data.errors
          loading.value = false
          hasError.value = true
          let message = data?.message
          toast(message, {
            theme: 'auto',
            type: 'error',
            dangerouslyHTMLString: true,
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, 300)
  loading.value = false
}

const tableFields = [
  { key: 'index', label: '#' },
  { key: 'actions', label: 'Actions' },

  { key: 'product_code', label: 'รหัสสินค้า', sortable: false },
  { key: 'product_name', label: 'รายการ', sortable: false, stickyColumn: true },
  { key: 'bill_code', label: 'ใบขอรับ', sortable: false },
  // { key: 'model', label: 'Model' },
  { key: 'serialnumber', label: 'S/N' },
  { key: 'id_no', label: 'IDNo' },
  { key: 'cerno', label: 'Cer No' },
  { key: 'po_no', label: 'Po No' },
  { key: 'point', label: 'Point' },
  { key: 'point_price', label: 'Point Price' },
  { key: 'range', label: 'Range' },
  { key: 'range_price', label: 'Range Price' },

  { key: 'price', label: 'ราคาต่อหน่วย', sortable: false },
  { key: 'discount_customer', label: 'ส่วนลด Cust', sortable: false },
  { key: 'discount_lab', label: 'ส่วนลด Lab', sortable: false },
  { key: 'discount_order', label: 'ส่วนลด Order', sortable: false },
  { key: 'qty', label: 'QTY', sortable: false },
  { key: 'total', label: 'จำนวนเงิน', sortable: false },
  { key: 'discount', label: 'ส่วนลด', sortable: false },
  { key: 'vat', label: 'VAT', sortable: false },
  { key: 'net', label: ' ยอดรวมสุทธิ', sortable: false },
  { key: 'remark', sortable: false, label: 'Remark' },
]

getCustomerTypes()

watch(route, (r) => {
  invoiceId.value = r.params.id
  getInvoice(r.params.id)
})

onMounted(() => {
  if (invoiceId.value !== undefined) {
    getInvoice(invoiceId.value)
  }
  // set default init data
  if (formMode.value == 'add') {
    formInvoice.value.due_within = 0
    formInvoice.value.invoice_status = 'draft'
    formInvoice.value.discount_pattern = 'A'
    formInvoice.value.vat_percent = appStore.settings.vat
  }
})
const customerTypeCode = ref()

onUpdated(() => {
  invoiceStore.setForm(formInvoice.value)
  if (formInvoice.value.bill_code) {
    let code = formInvoice.value.bill_code
    let temp = code.replace(/[\-0-9]/g, '')
    customerTypeCode.value = temp
    console.log('customerTypeCode#', customerTypeCode.value)
  }
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
              <form @submit.prevent="onSearch()">
                <div class="border p-2 my-2">
                  <div class="row g-2">
                    <div class="col-6 col-md-4 col-lg-3">
                      <label>ใบขอรับบริการ</label>
                      <BInputGroup size="sm" class="">
                        <input type="text" v-model="formInvoice.bill_code" class="form-control form-control-sm"
                          placeholder="เลขที่ใบขอรับบริการ" disabled="disabled" />
                        <button class="btn btn-sm btn-text" @click="openModalBill()">
                          <i class="bi bi-search"></i>
                        </button>
                      </BInputGroup>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" v-if="formInvoice.code">
                      <label>Invoice Code</label>
                      <input type="text" v-model="formInvoice.code" class="form-control form-control-sm"
                        placeholder="Code" disabled="disabled" />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.issue_date }]">
                      <label>วันที่ออก Invoice</label>
                      <BInput type="date" :state="!!formInvoice.issue_date" v-model="formInvoice.issue_date"
                        class="form-control form-control-sm" placeholder="issue date" />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.invoice_status }]">
                      <label>สถานะ {{ formInvoice.invoice_status }}</label>
                      <BFormSelect :options="invoiceStatuses" :state="!!formInvoice.invoice_status"
                        v-model="formInvoice.invoice_status" size="sm">
                      </BFormSelect>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.due_within }]">
                      <label>กำหนดชำระภายใน
                        <span v-if="formInvoice.due_date">({{ myFormatDate(formInvoice.due_date) }})</span>
                      </label>

                      <select class="form-select form-select-sm" v-model="formInvoice.due_within"
                        @change="onChangeDueWithin">
                        <option value="">----</option>
                        <option v-for="i in dueWithinList" :value="i.value" :key="i">
                          {{ i.text }}
                        </option>
                      </select>
                    </div>

                    <div class="col-6 col-md-4 col-lg-3">
                      <label>ส่วนลดและการสมสมยอด</label>
                      <BFormSelect :options="discountTypes" :state="!!formInvoice.discount_pattern"
                        v-model="formInvoice.discount_pattern" size="sm">
                      </BFormSelect>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" :class="[
                      { 'text-danger': errors.customer_id, 'text-danger': errors.customer_name },
                    ]">
                      <label>ลูกค้า
                        <span v-if="formInvoice.customer_id"> ({{ formInvoice.customer_id }})</span>

                        <span v-if="formInvoice.customer_type_code">
                          ({{ formInvoice.customer_type_code }})</span>
                        <span v-if="customerTypeCode"> ({{ customerTypeCode }})</span>
                      </label>
                      <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" type="button" @click="openModalCustomer">
                          <i class="bi bi-person"></i>
                        </button>
                        <input type="search" v-model="formInvoice.customer_name" class="form-control form-control-sm"
                          placeholder="บริษัท" />
                        <input type="hidden" v-model="formInvoice.customer_id" class="form-control form-control-sm"
                          placeholder="รหัสลูกค้า" />
                      </div>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.customer_type_code }]"
                      v-if="!formInvoice.customer_type_code">
                      <label>ประเภทลูกค้า
                        <span v-if="formInvoice.customer_type_code">
                          ({{ formInvoice.customer_type_code }})</span>
                      </label>

                      <select required class="form-select form-select-sm" v-model="formInvoice.customer_type_code"
                        @change="onChangeCustomerType">
                        <option v-for="(item, key) in customerTypes" :key="key" :value="item.code">
                          {{ item.code }} : {{ item.name }} - {{ item.nameen }}
                        </option>
                      </select>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.contact_name }]">
                      <label>ผู้ติดต่อ
                        <span v-if="formInvoice.contact_id">({{ formInvoice.contact_id }})</span></label>
                      <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" type="button" @click="openModalContact">
                          <i class="bi bi-person-vcard"></i>
                        </button>
                        <input type="search" v-model="formInvoice.contact_name" class="form-control form-control-sm"
                          placeholder="" />
                      </div>
                    </div>

                    <div class="col-12 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.address }]">
                      <label>ที่อยู่</label>
                      <BFormTextarea :state="!!formInvoice.address" type="text" v-model="formInvoice.address"
                        class="form-control form-control-sm" placeholder="ที่อยู่" rows="2" />
                    </div>
                    <div class="col-12 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.subdistrict }]">
                      <label>ตำบล/แขวง</label>
                      <BInput type="text" v-model="formInvoice.subdistrict" class="form-control form-control-sm"
                        placeholder="ตำบล/แขวง" />
                    </div>
                    <div class="col-12 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.district }]">
                      <label>อำเภอ/เขต</label>
                      <BInput type="text" v-model="formInvoice.district" class="form-control form-control-sm"
                        placeholder="อำเภอ/เขต" />
                    </div>
                    <div class="col-12 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.provice }]">
                      <label>จังหวัด</label>
                      <BInput type="text" v-model="formInvoice.province" class="form-control form-control-sm"
                        placeholder="จังหวัด" />
                    </div>
                    <div class="col-12 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.postalcode }]">
                      <label>รหัสไปรษณีย์</label>
                      <BInput type="text" v-model="formInvoice.postalcode" class="form-control form-control-sm"
                        placeholder="รหัสไปรษณีย์" />
                    </div>

                    <div class="col-12 col-md-4 col-lg-5">
                      <label>Note ลูกค้า</label>

                      <BFormTextarea v-model="formInvoice.note_customer" class="text-danger" rows="3"
                        style="font-size: 13px" size="small" readonly />
                    </div>
                    <div class="col-12 col-md-4 col-lg-4">
                      <label>Note</label>
                      <BFormTextarea v-model="formInvoice.remark" rows="3" style="font-size: 13px" size="small" />
                    </div>
                  </div>
                </div>

                <!-- <button type="button" @click="formInvoice.customer_type_code = ''">x</button> -->

                <section v-if="formMode == 'edit'">
                  <div v-if="errors.items" :class="[{ 'text-danger my-2': errors.items }]">
                    โปรดระบุรายการเครื่องมือ
                  </div>


                  <!-- ######################## TABLE ######################## -->
                  <BTable busyLoadingText="กำหลังโหลด.." stickyHeader responsive small caption-top bordered
                    :items="formInvoice.items" :fields="tableFields" striped variant="light">
                    <template #cell(index)="row">
                      {{ row.index + 1 }}
                    </template>

                    <template #cell(actions)="row">
                      <BButtonGroup>
                        <input type="checkbox" class="mx-1" v-model="itemsSelected" :value="row.item" />
                        <!-- <BButton size="sm" class="mr-1" variant="" @click="openModalEditItem(row.item, row.index)">
                          <i class="bi bi-pencil"></i>
                        </BButton> -->
                      </BButtonGroup>
                    </template>
                    <template #cell(product_code)="row">
                      <div style="min-width: 115px" class="">
                        <small> {{ row.item?.product?.code }}</small>
                      </div>
                    </template>
                    <template #cell(bill_code)="row">
                      <div style="min-width: 115px" class="">
                        <small> {{ row.item.bill_code }}</small>
                      </div>
                    </template>
                    <template #cell(product_name)="row">
                      <div class="" style="min-width: 115px">
                        {{ row.item.product_name }}
                      </div>
                      <small class="text-danger">Model. {{ row.item.model }}</small>
                    </template>

                    <template #cell(serialnumber)="row">
                      <div class="fw-normal" style="min-width: 100px">
                        <small>{{ row.item.serialnumber }}</small>
                      </div>
                    </template>
                    <template #cell(id_no)="row">
                      <div class="" style="min-width: 60px">
                        <small> {{ row.item.id_no }}</small>
                      </div>
                    </template>
                    <template #cell(cerno)="row">
                      <div class="fw-normal" style="min-width: 60px">
                        <small>{{ row.item.cerno }}</small>
                      </div>
                    </template>
                    <template #cell(po_no)="row">
                      <div class="fw-normal" style="min-width: 80px">
                        <!-- <small>{{ row.item.po_no }}</small> -->
                        <BInput type="text" min="0" v-model="row.item.po_no" style="width: 6rem" class="text-end" />
                      </div>
                    </template>

                    <template #cell(range)="row">
                      <div class="text-center">
                        <!-- {{ row.item.range }} -->
                        <!-- <BInput type="number" min="0" v-model="row.item.range" class="text-end" /> -->
                        <BInput type="number" min="0" v-model="row.item.range" style="width: 5rem" class="text-end"
                          @change="updatePriceItems(row.item)" @keyup="updatePriceItems(row.item)" />
                      </div>
                    </template>
                    <template #cell(range_price)="row">
                      <div class="text-end" style="min-width: 90px">
                        <!-- {{ myCurrency(row.item.range_price) }} -->
                        <!-- <BInput type="number" min="0" v-model="row.item.range_price" style="width: 5rem"
                          class="text-end" /> -->
                        <BInput type="number" min="0" v-model="row.item.range_price" style="width: 5rem" class="text-end"
                          @change="updatePriceItems(row.item)" @keyup="updatePriceItems(row.item)" />
                      </div>
                    </template>
                    <template #cell(point)="row">
                      <div class="text-center">
                        <!-- {{ row.item.point }} -->
                        <!-- <BInput type="number" min="0" v-model="row.item.point" style="width: 5rem" class="text-end" /> -->
                        <BInput type="number" min="0" v-model="row.item.point" style="width: 5rem" class="text-end"
                          @change="updatePriceItems(row.item)" @keyup="updatePriceItems(row.item)" />
                      </div>
                    </template>
                    <template #cell(point_price)="row">
                      <div class="text-end">
                        <!-- {{ myCurrency(row.item.point_price) }} -->
                        <!-- <BInput type="number" min="0" v-model="row.item.point_price" style="width: 5rem"
                          class="text-end" /> -->
                        <BInput type="number" min="0" v-model="row.item.point_price" style="width: 5rem" class="text-end"
                          @change="updatePriceItems(row.item)" @keyup="updatePriceItems(row.item)" />
                      </div>
                    </template>
                    <template #cell(price)="row">
                      <div class="text-end" style="width: 7.5rem">
                        <!-- {{ myCurrency(row.item.price) }} -->
                        <div class="input-group input-group-sm">
                          <BButton type="button" @click="calPriceFromPointAndRange(row)"><i class="bi bi-calculator"></i>
                          </BButton>
                          <BInput type="number" min="0" v-model="row.item.price" style="width: 5rem" class="text-end"
                            @change="onChangePricePerUnit(row)" @keyup="onChangePricePerUnit(row)" />
                        </div>
                      </div>
                    </template>
                    <template #cell(discount_customer)="row">
                      <div class="text-danger text-center" style="width: 8rem">
                        <div class="input-group input-group-sm">
                          <div>
                            <BInput type="number" min="0" v-model="row.item.discount_customer_percent" style="width: 5rem"
                              class="text-end" @change="
                                onChangeDiscountTypeOfItems(row.item, 'customer', 'percentage')
                                " @keyup="
    onChangeDiscountTypeOfItems(row.item, 'customer', 'percentage')
    " />
                          </div>
                          <div>
                            <BButton variant="text">%</BButton>
                          </div>
                        </div>
                        <div class="input-group input-group-sm">
                          <div>
                            <BInput type="number" min="0" v-model="row.item.discount_customer" style="width: 5rem"
                              class="text-end" @change="onChangeDiscountTypeOfItems(row.item, 'customer', 'amount')"
                              @keyup="onChangeDiscountTypeOfItems(row.item, 'customer', 'amount')" />
                          </div>
                          <div>
                            <BButton variant="text">฿</BButton>
                          </div>
                        </div>
                        <!-- <product-discount-detail :index="row.index" v-model:data="row.item"
                          fieldAmount="discount_customer" fieldPercent="discount_customer_percent" /> -->
                      </div>
                      <!-- {{ row.item.discount_customer_type }} -->
                    </template>
                    <template #cell(discount_lab)="row">
                      <div class="text-danger text-center" style="width: 8rem">
                        <div class="input-group input-group-sm">
                          <div>
                            <BInput type="number" min="0" v-model="row.item.discount_lab_percent" style="width: 5rem"
                              class="text-end" @change="onChangeDiscountTypeOfItems(row.item, 'lab', 'percentage')"
                              @keyup="onChangeDiscountTypeOfItems(row.item, 'lab', 'percentage')" />
                          </div>
                          <div>
                            <BButton variant="text">%</BButton>
                          </div>
                        </div>
                        <div class="input-group input-group-sm">
                          <div>
                            <BInput type="number" min="0" v-model="row.item.discount_lab" style="width: 5rem"
                              class="text-end" @change="onChangeDiscountTypeOfItems(row.item, 'lab', 'amount')"
                              @keyup="onChangeDiscountTypeOfItems(row.item, 'lab', 'amount')" />
                          </div>
                          <div>
                            <BButton variant="text">฿</BButton>
                          </div>
                        </div>
                        <!-- <product-discount-detail :index="row.index" v-model:data="row.item" fieldAmount="discount_lab"
                          fieldPercent="discount_lab_percent" /> -->
                      </div>
                      <!-- {{ row.item.discount_lab_type }} -->
                    </template>
                    <template #cell(discount_order)="row">
                      <div class="text-danger text-center" style="width: 8rem">
                        <div class="input-group input-group-sm">
                          <div>
                            <BInput type="number" min="0" v-model="row.item.discount_order_percent" style="width: 5rem"
                              class="text-end" @change="onChangeDiscountTypeOfItems(row.item, 'order', 'percentage')"
                              @keyup="onChangeDiscountTypeOfItems(row.item, 'order', 'percentage')" />
                          </div>
                          <div>
                            <BButton variant="text">%</BButton>
                          </div>
                        </div>
                        <div class="input-group input-group-sm">
                          <div>
                            <BInput type="number" min="0" v-model="row.item.discount_order" style="width: 5rem"
                              class="text-end" @change="onChangeDiscountTypeOfItems(row.item, 'order', 'amount')"
                              @keyup="onChangeDiscountTypeOfItems(row.item, 'order', 'amount')" />
                          </div>
                          <div>
                            <BButton variant="text">฿</BButton>
                          </div>
                        </div>
                        <!-- <product-discount-detail :index="row.index" v-model:data="row.item" fieldAmount="discount_order"
                          fieldPercent="discount_order_percent" /> -->
                      </div>
                      <!-- {{ row.item.discount_order_type }} -->
                    </template>
                    <template #cell(discount)="row">
                      <div v-if="row.item.discount" class="fw-bold text-danger text-end">
                        -{{ myCurrency(row.item.discount) }}
                      </div>
                    </template>

                    <template #cell(total)="row">
                      <div class="fw-bold text-end" style="min-width: 80px">
                        {{ myCurrency(row.item.total) }}
                      </div>
                    </template>
                    <template #cell(net)="row">
                      <div class="fw-bold text-end" style="min-width: 80px">
                        {{ myCurrency(row.item.net) }}
                      </div>
                    </template>

                    <template #cell(remark)="row">
                      <div style="width: 200px">
                        <BFormTextarea type="text" min="0" v-model="row.item.remark" size="sm" placeholder="หมายเหตุ" />
                      </div>
                    </template>
                  </BTable>
                  <!-- ################################################## -->

                  <!-- ################ DISCOUNT ################################# -->
                  <div class="d-flex flex-wrap gap-3 justify-content-start align-items-center">
                    <div>
                      <BInputGroup>
                        <BButton type="button" variant="outline-secondary" size="sm" @click="openModalBill('product')">
                          <i class="bi bi-plus"></i> ดึงเครื่องมือ 1
                        </BButton>
                        <BButton type="button" variant="outline-secondary" size="sm" @click="openModalWorkOrder">
                          <i class="bi bi-plus"></i> ดึงเครื่องมือ 2
                        </BButton>
                        <button type="button" class="btn btn-sm btn-danger" @click="showConfirmDeleteItems()"
                          v-if="itemsSelected.length">
                          <i class="bi bi-x"></i> Delete
                          <span>({{ itemsSelected.length }})</span>
                        </button>
                      </BInputGroup>
                    </div>

                    <div class="" style="font-size: 14px">
                      <div class="input-group input-group-sm">
                        <label class="input-group-text fw-bold">
                          <i class="bi bi-gift me-2"></i> ส่วนลดลูกค้า</label>

                        <input type="number" v-model="discountCustomer" class="form-control form-control-sm"
                          placeholder="จำนวนเงิน" min="0" style="width: 100px" />
                        <select required class="form-select form-select-sm" style="width: 90px"
                          v-model="discountCustomerType" @change="onChangeDiscountType">
                          <option value="percentage" :selected="percentage">%</option>
                          <option value="amount" :selected="amount">บาท</option>
                        </select>
                        <button class="btn btn-secondary" @click="addDiscountCustomer" type="button">
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div class="" style="font-size: 14px">
                      <div class="input-group input-group-sm">
                        <label class="input-group-text fw-bold"><i class="bi bi-gift me-2"></i> ส่วนลดท้ายบิล</label>
                        <input type="number" v-model="formInvoice.total_bill_discount" class="text-end" min="0" />
                      </div>
                    </div>

                  </div>

                  <!-- #################### START SUMMAYRY ####################### -->
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
                        <div class="col-6 text-end">
                          <BButtonGroup size="sm">
                            <BButton type="button" variant="light" text>VAT</BButton>
                            <BFormSelect v-model="formInvoice.vat_percent" class="form-select d-inline-block"
                              @change="calculate">
                              <BFormSelectOption v-for="(n, i) in 10" :key="i" :value="i" :selected="i == vatPercent">
                                {{ i }}
                              </BFormSelectOption>
                            </BFormSelect>
                            <BButton type="button" variant="light" text>%</BButton>
                          </BButtonGroup>
                        </div>
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
                    <!-- <div class="col-12">
                      <textarea v-model="formInvoice.remark" class="form-control"
                        placeholder="Remark หมายเหตุ..."></textarea>
                    </div> -->
                  </div>
                  <!-- #################### END SUMMAYRY ####################### -->
                </section>
              </form>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-12">
          <div class="card">
            <div class="card-body pt-3">
              <div class="d-flex flex-wrap gap-2">
                <!-- <button class="btn btn-outline-secondary btn-md mx-1" type="button">
                  <i class="bi bi-calculator"></i> คำนวณ
                </button> -->

                <button class="btn btn-outline-secondary btn-md mx-1" type="button" v-if="formMode == 'edit'"
                  @click="openModalPreview(formInvoice)">
                  <i class="bi bi-eye"></i> ดูตัวอย่าง
                </button>
                <button class="btn btn-success btn-md mx-1" type="submit" @click="saveAsDraft(true)">
                  <i class="bi bi-save"></i> บันทึก(ฉบับร่าง)
                </button>

                <button class="btn btn-primary btn-md mx-1" type="submit" @click="saveAndSend()"
                  v-if="formMode == 'edit'">
                  <i class="bi bi-save"></i> บันทึกเพื่อรอส่ง
                </button>
                <spinner :visible="loading" />
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

      <template v-if="formMode === 'add'">
        <ModalBillSelect mode="customer" ref="modalBill" @onSelectCustomer="fillDataCustomer"
          @onSelectProduct="fillDataBill" title="ดึงข้อมูลลูกค้า"
          :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }" />
      </template>
      <template v-if="formMode === 'edit'">
        <ModalBillSelect mode="product" ref="modalBill" @onSelectCustomer="fillDataCustomer"
          @onSelectProduct="fillDataBill" title="ดึงรายการเครื่องมือ"
          :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }"
          :billCode="formInvoice.bill_code" />
      </template>

      <ModalWorkOrder ref="modalWorkOrder" @onSelect="addItems"
        :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }" />
      <ModalCustomer ref="modalCustomer" @onSelect="onSelectCustomer" :customer-types="customerTypes"
        :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }" @clear="() => {
          formInvoice.customer_id = ''
          formInvoice.customer_name = ''
        }
          " />
      <ModalContact ref="modalContact" @onSelect="onSelectContact"
        :customer="{ id: formInvoice.customer_id, name: formInvoice.customer_name }" @clear="() => {
          formInvoice.contact_id = ''
          formInvoice.contact_name = ''
        }
          " />

      <BModal v-if="itemView" v-model="visibleModalConfirmDel" id="modal__confirmDelItems" okTitle="ใช่"
        ok-variant="danger" cancel-title="ไม่ใช่" @cancel="() => {
          itemView = {}
          visibleModalConfirmDel = false
        }
          ">
        <template #header> ยืนยันลบรายการ ? </template>

        <p>
          <BTableSimple responsive stacked>
            <BTbody>
              <BTr>
                <BTh rowspan="3" class="text-center">{{ itemView.product_name }}</BTh>
                <BTh stacked-heading="Item Code" class="text-start">
                  {{ itemView.bill_items_code }}</BTh>
                <BTd stacked-heading="ID No.">{{ itemView.id_no }}</BTd>
                <BTd stacked-heading="Model">{{ itemView.model }}</BTd>
                <BTd stacked-heading="S/N.">{{ itemView.serialnumber }}</BTd>
                <BTd stacked-heading="ราคา">{{ myCurrency(itemView.price) }}</BTd>
                <BTd stacked-heading="ส่วนลดทั้งหมด">{{ myCurrency(itemView.discount) }}</BTd>
                <BTd stacked-heading="คงเหลือ">{{ myCurrency(itemView.total) }}</BTd>
              </BTr>
            </BTbody>
          </BTableSimple>
        </p>
      </BModal>
      <BModal v-if="itemView" v-model="visibleModalPreview" id="modal__preview" okTitle="ปิด" okOnly okVariant="secondary"
        size="xl" :title="`ID# ${itemView?.id}`" scrollable @cancel="() => {
          itemView = {}
          visibleModalPreview = false
        }
          ">
        <!-- <template #header>ID# {{ itemView?.id }} </template> -->

        <p>
          <invoice-detail />
        </p>
        <template #footer>
          สร้างเมื่อ: {{ myFormatDateTime(itemView.date_starts, {
            format: "PPp"
          }) }}
        </template>
      </BModal>
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
