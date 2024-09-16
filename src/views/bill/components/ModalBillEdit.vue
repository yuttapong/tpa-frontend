<template>
  <div>
    <div class="modal" ref="modalRef">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ title }} <span v-if="Number(form.id) > 0"> {{ form.code }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- ###################################################################### -->
            <spinner :visible="loading" />

            <!-- <h5 class="p-2" v-if="form.code">{{ form.code }}</h5> -->

            <!-- #####################START######################## -->
            <form @submit.prevent="onSearch()">
              <div class="row gap-0">
                <div class="col-12 p-0">
                  <div class="accordion" id="accordionBill">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingCustomer">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseCustomer" aria-expanded="true" aria-controls="collapseCustomer">
                          <i class="bi bi-person mx-2"></i>
                          1) ข้อมูลทั่วไป
                        </button>
                      </h2>
                      <div id="collapseCustomer" class="accordion-collapse collapse show"
                        aria-labelledby="headingCustomer" data-bs-parent="#accordionBill">
                        <div class="accordion-body">
                          <div class="row g-2">
                            <template v-if="form.id === 0">
                              <div class="col-6 col-md-4 col-lg-3">
                                <label>ประเภทบิล</label>
                                <select class="form-select form-select-sm" v-model="form.bill_type"
                                  :disabled="form.id > 0">
                                  <option value="">-ประเภทบิล-</option>
                                  <option v-for="(type, key) in billTypes" :key="key" :value="type.value">
                                    {{ type.value }} : {{ type.text }}
                                  </option>
                                </select>
                              </div>
                            </template>
                            <template v-else>
                              <div class="col-6 col-md-4 col-lg-3">
                                <label>เลขที่</label>
                                <input type="text" v-model="form.code" name="code" class="form-control form-control-sm"
                                  placeholder="เลขที่" disabled="disabled" />
                              </div>
                            </template>

                            <div class="col-6 col-md-4 col-lg-3">
                              <label>วันที่</label>
                              <input type="date" v-model="form.document_date" name="code"
                                class="form-control form-control-sm" placeholder="Code" />
                            </div>

                            <div class="col-6 col-md-4 col-lg-3">
                              <label>วันนัดรับเครื่องมือ</label>
                              <input type="date" v-model="form.commitment_date" name="commitment_date"
                                class="form-control form-control-sm" placeholder="commitment_date" disabled />
                            </div>
                            <div class="col-6 col-md-6 col-lg-6">
                              <label>Note Customer</label>
                              <textarea type="text" v-model="form.note_customers" class="form-control form-control-sm"
                                placeholder="commitment_date" disabled rows="4" />
                            </div>
                            <div class="col-6 col-md-6 col-lg-6">
                              <label>Remark</label>
                              <textarea type="text" v-model="form.remark" class="form-control form-control-sm"
                                placeholder="Remark" rows="4" />
                            </div>
                          </div>
                          <!-- ############ START BUTTON ################# -->
                          <div class="text-end my-2">
                            <button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseCustomerAddress" aria-expanded="false"
                              aria-controls="collapseCustomerAddress">
                              <i class="bi bi-arrow-right"></i> ถัดไป
                            </button>
                          </div>
                          <!-- ############ END BUTTON ################# -->
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingTwo">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseCustomerAddress" aria-expanded="false"
                          aria-controls="collapseCustomerAddress">
                          <i class="bi bi-house-up mx-2"></i>
                          2) ลูกค้า
                        </button>
                      </h2>
                      <div id="collapseCustomerAddress" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                        data-bs-parent="#accordionBill">
                        <div class="accordion-body">
                          <div class="row g-2">
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>บริษัท
                                <span v-if="form.company_id">({{ form.company_id }})</span></label>
                              <input type="text" v-model="form.address_name" name="customer_name"
                                class="form-control form-control-sm" placeholder="" @click="addCustomer" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>ผู้ติดต่อ</label>
                              <input type="text" v-model="form.agent_name" name="agent_name"
                                class="form-control form-control-sm" placeholder="ผู้ติดต่อ" @click="addContact" />
                            </div>
                            <div class="col-12">
                              <label>ที่อยู่</label>
                              <textarea v-model="form.address_detail" class="form-control form-control-sm" placeholder=""
                                rows="3" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>ชื่อ(ผู้ส่ง)</label>
                              <input type="text" v-model="form.sender_name" name="sender_name"
                                class="form-control form-control-sm" placeholder="ผู้ส่ง" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>เบอร์โทร (ผู้ส่ง)</label>
                              <input type="text" v-model="form.sender_tel" class="form-control form-control-sm"
                                placeholder="เบอร์โทร" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>email (ผู้ส่ง)</label>
                              <input type="text" v-model="form.sender_email" class="form-control form-control-sm"
                                placeholder="email" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>แผนกงาน (ผู้ส่ง)</label>
                              <input type="text" v-model="form.sender_department" class="form-control form-control-sm"
                                placeholder="แผนก" />
                            </div>
                          </div>
                          <!-- ############ START BUTTON ################# -->
                          <div class="text-end my-2">
                            <button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseCustomer" aria-expanded="false" aria-controls="collapseCustomer">
                              <i class="bi bi-arrow-left"></i> ก่อนหน้า
                            </button>
                            <button class="btn btn-secondary btn-sm ms-3" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseCertAddress" aria-expanded="false"
                              aria-controls="collapseCertAddress">
                              <i class="bi bi-arrow-right"></i> ถัดไป
                            </button>
                          </div>
                          <!-- ############ END BUTTON ################# -->
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingCertAddress">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseCertAddress" aria-expanded="false" aria-controls="collapseCertAddress">
                          <i class="bi bi-house-up mx-2"></i>
                          3) ที่อยู่ส่งใบรับรอง
                        </button>
                      </h2>
                      <div id="collapseCertAddress" class="accordion-collapse collapse"
                        aria-labelledby="headingCertAddress" data-bs-parent="#accordionBill">
                        <div class="accordion-body">
                          <ul v-if="certAddresses" class="list-unstyled">
                            <li v-for="a in certAddresses" :key="a" class="border border-bottom p-1">
                              <input type="radio" class="form-radio me-2" @click="fillCertAddress(a)" />
                              <small>
                                {{ a.customer_name.trim() }}<br />
                                <div class="ms-2">
                                  {{ a.address.trim() }}
                                  {{ a.subdistrict.trim() }}
                                  {{ a.district.trim() }}
                                  {{ a.province.trim() }}
                                  {{ a.postcode.trim() }}
                                  {{ a.country }}
                                </div>
                              </small>
                            </li>
                          </ul>
                          <div class="row g-2">
                            <div class="col-12 col-xl-12">
                              <label>บริษัท <span></span></label>
                              <input type="text" v-model="form.cert_address_name" name="customer_name"
                                class="form-control form-control-sm" placeholder="" />
                            </div>
                            <div class="col-12 col-xl-12">
                              <label>ที่อยู่</label>
                              <textarea type="text" v-model="form.cert_address_detail"
                                class="form-control form-control-sm" placeholder="ที่อยู่" rows="3" />
                            </div>
                          </div>
                          <!-- ############ START BUTTON ################# -->
                          <div class="text-end my-2">
                            <button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseCustomer" aria-expanded="false" aria-controls="collapseCustomer">
                              <i class="bi bi-arrow-left"></i> ก่อนหน้า
                            </button>
                            <button class="btn btn-secondary btn-sm ms-3" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseTools" aria-expanded="false" aria-controls="collapseTools">
                              <i class="bi bi-arrow-right"></i> ถัดไป
                            </button>
                          </div>
                          <!-- ############ END BUTTON ################# -->
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingTools">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseTools" aria-expanded="false" aria-controls="collapseTools">
                          <i class="bi bi-tools mx-2"></i>
                          4) สินค้า/เครื่องมือ ({{ formItems ? formItems.length : 0 }})
                        </button>
                      </h2>
                      <div id="collapseTools" class="accordion-collapse collapse" aria-labelledby="headingTools"
                        data-bs-parent="#accordionBill">
                        <div class="accordion-body px-3">
                          <div class="row">
                            <div class="col-12 col-md-6 p-1"></div>
                            <div class="col-12 col-md-6 p-1 text-end">
                              <div class="d-flex gap-1 justify-content-end">
                                <button type="button" class="btn btn-sm btn-success" @click="openModalProducts()">
                                  <i class="bi bi-plus" role="button"></i> เครื่องมือ
                                </button>
                                <button type="button" class="btn btn-sm btn-success" @click="openModalDiscounts()">
                                  <i class="bi bi-plus" role="button"></i> ส่วนลด
                                </button>
                                <button type="button" class="btn btn-sm btn-secondary" @click="editItem()">
                                  <i class="bi bi-pencil" role="button"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-danger" @click="removeSelectedItems()">
                                  <i class="bi bi-x" role="button"></i>
                                </button>
                              </div>
                            </div>
                            <div class="col-12 p-0 m-0">
                              <BTable stickyHeader responsive small caption-top bordered striped variant="light"
                                :fields="headers" :items="formItems" alternating>

                                <template #cell(item_code)="row">
                                  <BInput size="sm" type="text" v-model="row.item.item_code" class="" style="width: 150px"
                                    @change="updateItemField('item_code', row)" />
                                </template>
                                <template #cell(product_name)="row">
                                  <div class="fw-bold" style="min-width: 150px;">{{ row?.item?.product?.code }}</div>
                                  {{ row.item?.product_name }}
                                </template>

                                <template #cell(qty)="row">
                                  <input type="number" v-model="row.item.qty" class="" style="width: 50px"
                                    @change="updateItemField('qty', row)" />
                                </template>

                                <template #cell(test_point)="row">
                                  <BFormTextarea size="sm" v-model="row.item.test_point" class="w-100"
                                    style="min-width: 200px;" @change="updateItemField('test_point', row)" />
                                </template>
                                <template #cell(point)="row">
                                  <BInput size="sm" type="number" v-model="row.item.point" class="w-full"
                                    style="width: 50px" @change="updateItemField('point', row)" />
                                </template>
                                <template #cell(point_price)="row">
                                  <BInput size="sm" type="number" v-model="row.item.point_price" class="w-full"
                                    style="width: 95px" @change="updateItemField('point_price', row)" />
                                </template>
                                <template #cell(range_value)="row">
                                  <BInput size="sm" type="number" v-model="row.item.range_value" class="w-full"
                                    style="width: 50px" @change="updateItemField('range_value', row)" />
                                </template>
                                <template #cell(range_price)="row">
                                  <BInput size="sm" type="number" v-model="row.item.range_price" class="w-full"
                                    style="width: 95px" @change="updateItemField('range_price', row)" />
                                </template>

                                <template #cell(price)="row">
                                  <BInput size="sm" type="number" v-model="row.item.price" class="" style="width: 80px"
                                    @change="updateItemField('price', row)" />
                                </template>
                                <template #cell(discount)="row">
                                  <BInput size="sm" type="number" v-model="row.item.discount" class="" style="width: 95px"
                                    @change="updateItemField('discount', row)" />
                                </template>
                                <template #cell(total)="row">
                                  {{ myCurrency(row.item.total) }}
                                  <!-- <BInput size="sm" type="number" class="w-full" style="width: 300px"
                                    :value="(Number(row.item.price) * 1) - Number(row.item.discount)" disabled /> -->
                                </template>
                                <template #cell(remark)="row">
                                  <BFormTextarea size="sm" v-model="row.item.remark" class="w-100 w-full"
                                    style="min-width: 200px" />
                                </template>

                              </BTable>

                              <div class="row">
                                <div class="col-12 col-md-6 py-2">
                                  <button type="button" @click="calculate" class="btn btn-success btn-sm">
                                    <i class="bi bi-calculator" /> คำนวณ
                                  </button>
                                </div>
                                <div class="col-12 col-md-6 text-end">
                                  <div class="row">
                                    <div class="col-6">รวม</div>
                                    <div class="col-6">
                                      <span class="text-decoration-underline fw-bold">{{
                                        Number(totalPrice).toLocaleString()
                                      }}

                                      </span>
                                    </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-6">VAT(%)</div>
                                    <div class="col-6 d-flex gap-2 justify-content-end">
                                      <div>
                                        <input type="number" v-model="form.vat_percent"
                                          class="form-control form-control-sm" style="width: 80px" placeholder="%" />
                                      </div>
                                      <div class="text-decoration-underline fw-bold">
                                        {{ Number(totalVat).toLocaleString() }}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-6">รวมเป็นเงินทั้งหมด</div>
                                    <div class="col-6">
                                      <span class="text-decoration-underline fw-bold">{{
                                        Number(grandTotal).toLocaleString()
                                      }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <!-- #######################END ###################### -->

            <ModalProduct ref="modalProduct" @select="onSelectProducts" />
            <ModalCustomer ref="modalCustomer" @select="onSelectCustomer" />
            <ModalContact ref="modalContact" @select="onSelectContact" v-model:customerId="form.company_id" />
            <!-- ###################################################################### -->
          </div>
          <div class="modal-footer d-block">
            <!-- ############ START BUTTON ################# -->
            <!-- <div class="d-flex gap-2">
              <template v-if="form.id">
                <div class="">
                  <button type="button" class="btn btn-primary btn-sm w-100" @click="saveBill()">
                    <i class="float-start bi bi-save me-2"></i> บันทึก
                  </button>
                </div>
                <div class="">
                  <router-link :to="`/bills/code/${form.code}/commitment`" class="btn btn-sm btn-secondary d-block">
                    <i class="bi bi-clock float-start me-2"></i>
                    จองคิวงาน</router-link>
                </div>
                <div class="">
                  <a class="btn btn-sm btn-secondary d-block">
                    <i class="bi bi-printer float-start me-2"></i>
                    พิมพ์</a>
                </div>
              </template>
              <template v-else>
                <div class="">
                  <button type="button" class="btn btn-primary btn-sm w-100" @click="createBill()">
                    <i class="float-start bi bi-save me-2"></i> สร้างใบขอรับบริการ
                  </button>
                </div>
                <div class="">
                  <router-link to="/bills/preview" class="btn btn-sm btn-secondary d-block">
                    <i class="bi bi-eye float-start me-2"></i>
                    ดูตัวอย่าง</router-link>
                </div>
              </template>
            </div> -->
            <!-- ############ END BUTTON ################# -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { Modal } from 'bootstrap'
import { myFormatDate, myCurrency } from '@/helpers/myformat'
import { useBillStore } from '@/stores/billStore'
import JobStatus from '@/views/bill/components/JobStatus.vue'
import JobButtonStatus from './JobButtonStatus.vue'
import BillButtonStatus from './BillButtonStatus.vue'

import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import ModalProduct from '@/views/product/components/ModalProduct.vue'
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import { useAppStore } from '@/stores/appStore'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['onHide', 'onShow', 'onConfirm'])
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  billId: { type: Number },
  data: {
    type: Object,
    default: () => { },
  },
})
const billStore = useBillStore()
let modalEl = null
let modalRef = ref(null)

const show = () => {
  getBillById(billStore.formEdit.id)
  modalEl.show()
  form.value = billStore.formEdit
}
const hide = () => {
  modalEl.hide()
}

const getBillById = async (id) => {
  try {
    const { data } = await api.get('/v2/bills/' + billStore.formEdit?.id)
    if (data) {
      billStore.formEdit = data
      if (data.items) {
        billStore.setItems(data.items)
      }
    }
  } catch (error) { }
}

onMounted(() => {
  modalEl = new Modal(modalRef.value)
})
defineExpose({ show, hide })
const loading = ref(false)
const billTypes = ref([])

const modalProduct = ref(null)
const modalContact = ref(null)
const modalCustomer = ref(null)
const addresses = ref([])
const certAddresses = ref([])

const form = computed(() => billStore.formEdit)
const formItems = computed(() => billStore.items || [])
const headers = [
  { label: 'No.', key: 'sorter' },
  { label: 'ItemCode', key: 'item_code' },
  { label: 'เครื่องมือ', key: 'product_name', stickyColumn: true },
  { label: 'Test Point', key: 'test_point' },
  { label: 'Point', key: 'point' },
  { label: 'Pont Price', key: 'point_price' },
  { label: 'Range', key: 'range_value' },
  { label: 'Range Price', key: 'range_price' },
  { label: 'Price', key: 'price' },
  { label: 'จำนวน', key: 'qty' },
  { label: 'ส่วนลด', key: 'discount' },

  { label: 'Total', key: 'total' },
  { label: 'หมายเหตุ', key: 'remark' },
  // { label: 'Total', key: 'total' },
]
const totalPrice = computed(() => {
  return formItems.value
    ? formItems.value.reduce((total, item) => {
      let qty = item.qty ? Number(item.qty) : 1;
      let price = item.total ? Number(item.total) : 0;
      let discount = item.discount ? Number(item.discount) : 0;
      return total += (Number(price) - Number(discount)) * Number(qty)
    }, 0)
    : 0
})
const totalVat = computed(() => {
  let sum = (totalPrice.value * Number(form.value.vat_percent)) / 100
  form.value.vat = sum
  return sum
})
const grandTotal = computed(() => {
  return formItems.value
    ? formItems.value.reduce((total, item) => {
      return totalVat.value + totalPrice.value
    }, 0)
    : 0
})

const itemsSelected = ref([])

const calculate = () => {
  form.value.grand_total = grandTotal.value
  let newItems = formItems.value.map((item, key) => {
    let qty = item.qty ? Number(item.qty) : 1;
    let total = item.total ? Number(item.total) : 0;
    let discount = item.discount ? Number(item.discount) : 0;
    item.qty = qty
    item.total = total - discount * qty;
    return item;
  })
  billStore.items = newItems
}
const updateItemField = (name, data) => {
  console.log('row', data.index, data.field.key, data.value);
  let items = billStore.items.map((row, rowKey) => {

    if (rowKey == data.index) {
      console.log(rowKey, data.index, data.value);
      row[data.field.key] = data.value
      row.total = Number(data.item.qty) * Number(data.item.price)
    }
    return row
  })
  billStore.setItems(items)
  calculate()
}
const openModalProducts = () => {
  modalProduct.value.show()
}
const addCustomer = () => {
  modalCustomer.value.show()
}
const addContact = () => {
  modalContact.value.show()
}
const loadAddress = async (customerId) => {
  try {
    const { data } = await api.get(`/v2/customers/${customerId}/addresses`)
    if (data[0]) {
      addresses.value = data
      let a = data[0]
      console.log('addess', data)
      let text = `${a.address} ${a.subdistrict} ${a.district} ${a.province} ${a.postcode}`.trim()
      console.log(text)
      form.value.address_detail = text
    }
  } catch (error) { }
}
const loadCertAddress = async (customerId) => {
  try {
    const { data } = await api.get(`/v2/customers/${customerId}/cert-addresses`)
    if (data) {
      certAddresses.value = data
      console.log('certAddresses', data)
    }
  } catch (error) { }
}
const onSelectCustomer = (data) => {
  if (data) {
    form.value.company_id = data.customers.id
    form.value.address_name = data.customers.companyname
    form.value.agent_id = data.contacts.id
    form.value.agent_name = data.contacts.contactname
    form.value.sender_name = data.contacts.contactname
    let t1 = data.contacts.contacttel1 !== undefined ? data.contacts.contacttel1 : ''
    let t2 = data.contacts.contacttel2 !== undefined ? data.contacts.contacttel2 : ''
    form.value.sender_tel = `${t1} ${t2}`.trim()
    form.value.sender_email = data.contacts.contactemail
    loadAddress(form.value.company_id)
    loadCertAddress(form.value.company_id)
  }
}
const onSelectContact = (data) => {
  if (data) {
    form.value.agent_id = data.id
    form.value.agent_name = data.contactname
  }
}

const onSelectProducts = (items) => {
  if (items) {
    items.map((item) => {
      let row = {
        product_name: item.name,
        product_id: item.id,
        product_code: item.code,
        product: item,
        lab_id: item?.lab_id,
        sublab_id: item?.sublab_id,
        lab: item.lab,
        test_point: item.test_point,
        //new input
        id_no: item?.id_no,
        model: item?.model,
        serialnumber: item?.serialnumber,
        barcode_no: item?.barcode_no,
        manufaturer_name: item?.manufaturer_name,
        discount: 0,
        price: parseFloat(item.calprice) * parseFloat(item.calpoint),
        qty: 1,
      }
      billStore.addItem(row)
    })
  }
}

const fillCertAddress = (data) => {
  let address = data?.address
  let subdistrict = data?.subdistrict
  let district = data?.district
  let province = data?.province
  let postcode = data?.postcode
  let country = data.country ? data.country : ''
  let all = `${address} ${subdistrict} ${district} ${province} ${postcode} ${country}`.trim()
  form.value.cert_address_name = data?.customer_name
  form.value.cert_address_detail = all.replace('null', '')
}
const removeItem = (item, index) => {
  console.log(item)
  billStore.removeItem(item)
}
const removeSelectedItems = () => {
  let items = itemsSelected.value
  console.log(items)
  let _items = []
  items.map((item, key) => {
    console.log(key, item);

  })

  form.value.items = billStore.formItems
}

const createBill = () => {
  form.value.items = billStore.formItems
  console.log('createBill', form.value)

  api
    .post('/v2/bills', form.value)
    .then((rs) => {
      console.log(rs)
    })
    .catch((err) => {
      console.log(err)
    })
}
const saveBill = async () => {
  form.value.items = billStore.formItems
  let msg = 'ยังไม่อนุมัติให้แก้ไขข้อมูลสำหรับดูข้อมูลเท่านั้น'
  alert(msg)
  toast(msg, {
    theme: 'auto',
    type: 'success',
    dangerouslyHTMLString: true,
  })
  return false
  if (form.value.id > 0) {
    const { data } = await api.put('v2/bills/' + form.value.id, form.value)
    console.log('=>', data.message)
    if (data.success) {
      toast(data.message, {
        theme: 'auto',
        type: 'success',
        dangerouslyHTMLString: true,
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.accordion {
  .accordion-body {
    background-color: rgb(255, 255, 255);
    color: #130f0f;

    .form-control,
    .form-select {
      border: solid 1px #8b8a8a;
    }
  }
}

.table-bill-items {
  border: solid 1px #130f0f;
}
</style>
