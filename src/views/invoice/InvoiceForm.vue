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
const invoiceItems = computed(() => invoiceStore.carts)
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
  } catch (error) {}
}

const openModalWorkOrder = () => {
  modalWorkOrder.value.show()
}
const clearItem = async () => {
  invoiceStore.emptyCart()
  const { data } = await api.delete('v2/invoices/cart')
  toast('ล้างรายการสำเร็จ', {
    autoClose: 200,
    theme: 'auto',
    type: 'default',
    dangerouslyHTMLString: true,
  })
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
    price: item.total,
    discount: 0,
    qty: 1,
  }
  invoiceStore.addItem(row)
  toast(`เพิ่มรายการ (${item.item_code}) สำเร็จ`, {
    autoClose: 200,
    theme: 'auto',
    type: 'success',
    dangerouslyHTMLString: true,
  })
  const { data } = await api.post('v2/invoices/cart', row)
  if (data) {
  }
}

const emptyCart = async () => {
  formInvoice.value = {}
  invoiceStore.setForm({})
  invoiceStore.updateItems([])
  const { data } = await api.delete('v2/invoices/cart/', {
    staff_id: appStore.user?.id,
  })
}

const removeItem = async (item, index) => {
  invoiceStore.removeItem(item)
  toast(`ลบ ${item.item_code} สำเร็จ`, {
    autoClose: 100,
    theme: 'auto',
    type: 'default',
    dangerouslyHTMLString: true,
  })
  await api.delete('v2/invoices/cart/' + item.item_id, {
    item_i: item.item_id,
  })
}
const totalPrice = computed(() => {
  return invoiceItems.value ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.price)), 0) : 0
})
const totalDiscount = computed(() => {
  return invoiceItems.value ? invoiceItems.value.reduce((total, item) => (total += parseFloat(item.discount)), 0) : 0
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
  invoiceStore.updateItems([])
}
const save = async () => {
  hasError.value = false
  formInvoice.value.items = invoiceStore.carts

  formInvoice.value.totalprice = totalPrice.value
  formInvoice.value.totaldiscount = totalDiscount.value
  formInvoice.value.totalvat = (totalPrice.value * 7) / 100
  formInvoice.value.totalnet = totalNet.value

  if (formInvoice.value.id !== undefined && formInvoice.value.id > 0) {
    loading.value = true
    const { data } = await api.put('v2/invoices', formInvoice.value)
    if (data) {
      loading.value = false
      emptyCart()
      resetData()
      toast(data.message, {
        theme: 'auto',
        type: 'default',
        dangerouslyHTMLString: true,
      })
    } else {
      loading.value = false
    }
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
                <div class="col-6 col-md-4 col-lg-3" :class="[{ 'text-danger': errors.due_date }]">
                  <label>กำหนดชำระภายใน</label>
                  <input
                    type="number"
                    v-model="formInvoice.due_within"
                    class="form-control form-control-sm"
                    placeholder="due date"
                  />
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
                    <span v-if="formInvoice.contact_id">({{ formInvoice.contact_id }})</span></label
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
              </div>

              <div class="">
                <div v-if="errors.items" :class="[{ 'text-danger mt-2': errors.items }]">
                  โปรดระบุรายการเครื่องมือ
                </div>
                <div class="table-responsives mt-2 items-containers" style="height:290px; overflow-y:scroll;">
                  <table class="table table-sm table-bordered tableFixHead">
                    <thead class="">
                      <tr>
                        <th class="fw-bold"># Item</th>
                 
                        <th class="fw-bold text-center text-danger">ส่วนลดสินค้า</th>
                        <th class="fw-bold text-center text-danger">ส่วนลดลูกค้า</th>
                        <th class="fw-bold text-end">ราคาต่อหน่อย</th>
                        <th class="fw-bold text-end" style="width: 100px">รวม</th>
                      </tr>
                    </thead>
                    <tbody v-if="invoiceItems" >
                      <template v-for="(item, index) in invoiceItems" :key="index">
                      <tr class="" >
                        <td scope="row" nowrap>
                          <button
                            type="button"
                            class="btn btn-text text-danger"
                            @click="removeItem(item, index)"
                          >
                            <i class="bi bi-x-circle"></i>
                          </button>
                          {{ index + 1 }})
                          <span class="ms-2 text-dark" style="font-size: 13px">{{
                            item.item_code
                          }}</span>
                        </td>
                        <td class="">
   
                        </td>
                        <td class="text-end" style="width: 250px" nowrap>
                          <div class="input-group input-group-sm">
                            <input
                              type="number"
                              v-model="item.discount_percen"
                              class="form-control form-control-sm text-end text-danger"
                              style="width: 80px"
                                    placeholder="%"
                            />
                            <span class="input-group-text">%</span>
                            <input
                              type="number"
                              v-model="item.discount"
                              class="form-control form-control-sm text-end text-danger"
                              style="width: 90px"
                              placeholder="บาท"
                            />
                          </div>
                        </td>
                        <td class="text-end" style="width: 250px" nowrap>
                          <div class="input-group input-group-sm">
                            <input
                              type="number"
                              v-model="item.discount_customer_percent"
                              class="form-control form-control-sm text-end text-danger"
                              style="width: 80px"
                              placeholder="%"
                            />
                            <span class="input-group-text">%</span>
                            <input
                              type="number"
                              v-model="item.discount_customer"
                              class="form-control form-control-sm text-end text-danger"
                              style="width: 90px"
                                    placeholder="บาท"
                            />
                          </div>
                        </td>
                        <td class="text-end" style="width: 100px">
                          <input
                            type="number"
                            v-model="item.price"
                            class="form-control form-control-sm text-end"
                            style="width: 100px"
                          />
                        </td>
                        <td class="text-end" style="width: 90px">
                          <input
                            type="number"
                            v-model="item.price"
                            class="form-control form-control-sm text-end"
                            style="width: 100px"
                          />
                        </td>
                      </tr>
                      <tr>
                      <td colspan=6>

                    <div class="fw-normal float-start ">
                            <!-- <i class="text-danger">{{ item.manufaturer_name }}</i> -->

                                   <span class="fw-bold fs-65 text-danger">
                              {{ item.product?.product?.code }}
                            </span> : 
                            {{ item.product_name }}
                     
                          </div>

                          <!-- <div class="">
                            <ProductMeta :item="item" />
                          </div> -->
                      <input type="text" placeholder="รายละเอียด..." class="float-end form-control form-control-sm"/>
                      </td>
                      </tr>
                      </template>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th class="text-center">{{}}</th>
                        <th class="text-end fw-bold">
                          {{ parseFloat(totalDiscount).toLocaleString() }}
                        </th>
                        <th class="text-end fw-bold">
                          {{ parseFloat(totalPrice).toLocaleString() }}
                        </th>
                        <th>{{}}</th>
                        <th>{{}}</th>
                        <th>{{}}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div class="row g-3">
                  <!-- <div class="col-3  fw-bold">
                    Qty : {{ parseFloat(invoiceStore.countCartItems).toLocaleString() }}
                  </div>

                  <div class="col-3 fw-bold">
                    Total Discount : {{ parseFloat(totalDiscount).toLocaleString() }}
                  </div> -->
                  <!-- <div class="col-3 fw-bold">
                    Total Price : {{ parseFloat(totalPrice).toLocaleString() }}
                  </div> -->

                  <div class="col-3 fw-bold">
                    Total Net : {{ parseFloat(totalNet).toLocaleString() }}
                  </div>
                </div>
              </div>
              <div class="">
                <button
                  type="button"
                  class="btn btn-sm btn-secondary"
                  @click="openModalWorkOrder()"
                >
                  <i class="bi bi-plus" role="button"></i> ดึงข้อมูลใบขอรับ
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-secondary ms-1"
                  @click="openModalWorkOrder()"
                >
                  <i class="bi bi-plus" role="button"></i> ดึงข้อมูล Invoice ยกเลิก
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-danger ms-3"
                  v-if="invoiceStore.carts"
                  @click="clearItem()"
                >
                  <i class="bi bi-trash" role="button"></i>
                  ล้างรายการ ({{invoiceStore.countCartItems}})
                </button>
                <div v-if="errors && hasError" class="alert alert-danger my-2">
                  <li v-for="(message, key) in errors" :key="key" class="px-1">
                    {{ message }}
                  </li>
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
              <div class="col">
                <router-link
                  :to="{ name: 'invoices.preview' }"
                  class="btn btn-sm btn-secondary d-block"
                >
                  <i class="bi bi-eye"></i>
                  Preview ดูตัวอย่าง</router-link
                >
              </div>
              <!-- <div class="col-12">
                <a class="btn btn-sm btn-secondary d-block">
                  <i class="bi bi-printer"></i>
                  พิมพ์</a
                >
              </div> -->
              <div class="col">
                <a class="btn btn-sm btn-secondary d-block" @click="emptyCart">
                  <i class="bi bi-printer"></i>
                  Reset</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalWorkOrder ref="modalWorkOrder" @select="onSelectProduct" />
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
  border: solid 1px #5f5e5e;
  padding: 1px;
}

.items-container table tbody {
  height: 200px;
  overflow: scroll;
}
</style>
