<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { useBillStore } from '@/stores/billStore'
import ModalProduct from '@/views/product/components/ModalProduct.vue'
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { MyFormatDate } from '@/helpers/myformat'
import { formatInTimeZone, toZonedTime, toDate, format } from 'date-fns-tz'
import { formatDate, formatISO } from 'date-fns'
import { timezone } from '@/config'
import { useAppStore } from '@/stores/appStore'
import { toast } from 'vue3-toastify'

const route = useRoute()
const appStore = useAppStore()
const loading = ref(false)


const modalProduct = ref(null)
const modalContact = ref(null)
const modalCustomer = ref(null)
const addresses = ref([])
const certAddresses = ref([])
const billStore = useBillStore()
const billCode = computed(() => route.params.code)
const carts = ref(billStore.items)
const form = ref({
  id: 0,
  bill_code: '',
  document_date: '',
  items: [],
  company_id: '',
  address_name: '',
  address_detail: '',
  cert_address_name: '',
  cert_address_detail: '',
  agent_id: '',
  agent_name: '',
  status: '',
  bill_status: '',
  service_status_id: 0,
  vat_percent: 7,
  vat: 0,
})

//  commitment
const loadingCommitment = ref(false)
const resultCommitment = ref()
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const commitmentDate = ref()
const commitmentPriority = ref()
const formCommitment = ref({
  priority: 'medium',
  commitment_date: '',
  document_date: '',
  bill_id: 0,
  code: '',
  items: [
    // {
    //   item_code: '',
    //   lab_id: '',
    //   product_id: '',
    //   reserved_date: '',
    //   sorter: '',
    //   sublab_id: '',
    //   workorder_id: '',
    //   sorter: 0,
    // },
  ],
})

const headers = [
  // { text: 'ID', value: 'id' },
  // { text: 'ItemCode', value: 'item_code' },
  { text: 'Productcode', value: 'product_code' },
  { text: 'Product', value: 'product_name' },
  { text: 'Qty', value: 'qty' },
  { text: 'Discount', value: 'discount' },
  { text: 'Price', value: 'price' },
  { text: 'Total', value: 'total' },
  { text: 'Remark', value: 'remark' },
  // { text: 'Total', value: 'total' },
]
const totalPrice = computed(() => {
  return carts.value ? carts.value.reduce((total, item) => {
    return total += Number(item.price) * Number(item.qty) - Number(item.discount)
  }, 0) : 0
})
const totalVat = computed(() => {
  let sum = totalPrice.value * Number(form.value.vat_percent) / 100
  form.value.vat = sum
  return sum
})
const grandTotal = computed(() => {
  return carts.value ? carts.value.reduce((total, item) => {
    return totalVat.value + totalPrice.value
  }, 0) : 0
})

const itemsSelected = ref([])

const calculate = () => {
  let total = grandTotal.value
  console.log('cal', total);
  form.value.grand_total = total
}
const updateItemField = (name, item) => {

  // let data = carts.value[item.index]["product_id"]

  console.log(name, item);
  //billStore.updateItems(data)
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
    form.value.company_id = data.id
    form.value.address_name = data.companyname
    loadAddress(data.id)
    loadCertAddress(data.id)
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
const removeItem = (item, index) => {
  console.log(item);
  billStore.removeItem(item)
}
const removeSelectedItems = () => {
  let items = itemsSelected.value
  let _items = []
  items.map((item) => {
    _items.push(item.index)
  })



}

const updateItems = () => {
  billStore.updateItems(carts.value)
}

const dataCommitment = computed(() => {
  let d1 = form.value?.document_date ? new Date(`${form.value?.document_date} 00:00:00`) : ''
  let d2 = new Date(`${formCommitment.value?.commitment_date} 00:00:00`)
  const params = {
    priority: formCommitment.value.priority,
    bill_id: form.value.bill_id,
    code: form.value.code,
    document_date: d1 ? formatISO(toZonedTime(form.value.document_date, timezone)) : '',
    commitment_date: d2 ? formatISO(toZonedTime(d2, timezone)) : '',
    items: billStore.selectedItems.map((item) => {
      return {
        duration: 1,
        item_code: item.item_code,
        lab_id: item.lab_id,
        product_id: item.product_id,
        reserved_date: form.value?.document_date,
        sorter: item.sorter,
        sublab_id: item.sublab_id,
        workorder_id: item.item_id,
      }
    }),
  }
  return params
})
const findCommitmentDate = async () => {
  messageErrorCommitment.value = ''
  messageSuccessCommitment.value = ''

  if (formCommitment.value.commitment_date == '' || formCommitment.value.priority == '') {
    messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    return
  }
  loadingCommitment.value = true
  try {
    const { data } = await axios
      .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills/inquiry', dataCommitment.value, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${appStore.token}`,
        },
      })
      .catch((err) => {
        loadingCommitment.value = false

        if (err.response) {
          let data = err.response?.data
          if (data) {
            messageErrorCommitment.value = data.message
          } else {
            messageErrorCommitment.value = err.message
          }
        } else {
          messageErrorCommitment.value = err.message
        }
      })
    setTimeout(() => {
      loadingCommitment.value = false
    }, 2000)
    resultCommitment.value = data
    console.log('=>', data)
    if (data) {
      if (data.success) {
        let message = `ประมวลผลตารางคิวงานสำเร็จ`
        resultCommitment.value.message = message
        console.log(message)
        messageSuccessCommitment.value = message
      } else {
        messageErrorCommitment.value = data.message
      }
    }
  } catch (error) {
    resultCommitment.value = error
    console.log('error', error)
    loadingCommitment.value = false
  }
}
const onChangeConditionCommitment = (e) => {
  let checked = e.target.checked
  if (checked == false) {
    formCommitment.value.commitment_date = null
    commitmentDate.value = null
    console.log(formCommitment.value)
  }
}
const onSelectCommitmentDate = (data) => {
  if (data) {
    formCommitment.value.commitment_date = data.commitment_date
    formCommitment.value.document_date = data.document_date
    formCommitment.value.priority = data.priority

    commitmentDate.value = data.commitment_date
    commitmentPriority.value = data.priority
  }
}

const createBill = () => {
  form.value.items = billStore.selectedItems
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
  form.value.items = billStore.selectedItems
  if (form.value.id > 0) {
    const { data } = await api.put('v2/bills/' + form.value.id, form.value)
    console.log("=>", data.message)
    if (data.success) {
      toast(data.message, {
        theme: 'auto',
        type: 'success',
        dangerouslyHTMLString: true,
      })
    }
  }
}

onMounted(() => {
  if (billCode.value) {
    api.get('/v2/bills/code/' + billCode.value).then((rs) => {
      form.value = rs.data
      billStore.updateItems(rs.data?.items)
      billStore.setForm(form.value)
    })
  }
})
onUpdated(() => {
  if (!billCode.value) {
    billStore.updateItems(carts.value)
    form.value.items = carts.value
  }
})
</script>
<template>
  <div class="pagetitle">
    <h1>Bills</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item">
          <router-link to="/bills">ใบขอรับบริการ</router-link>
        </li>
        <template v-if="form.id">
          <li class="breadcrumb-item active">
            <router-link :to="`/bills/code/${form?.code}`">{{ form.code }}</router-link>
          </li>
          <li class="breadcrumb-item active">แก้ไข</li>
        </template>
        <template v-else>
          <li class="breadcrumb-item active">สร้างใบขอรับบริการใหม่</li>
        </template>
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

            <h5 class="p-2" v-if="form.code">{{ form.code }}</h5>

            <!-- #####################START######################## -->
            <form @submit.prevent="onSearch()">
              <div class="row g-2">
                <div class="col-12 bg-info-subtle p-1">
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
                            <div class="col-6 col-md-4 col-lg-3">
                              <label>วันที่</label>
                              <input type="date" v-model="form.document_date" name="code"
                                class="form-control form-control-sm" placeholder="Code" />
                            </div>
                            <div class="col-6 col-md-4 col-lg-3">
                              <label>Commitment Date</label>
                              <input type="date" v-model="form.commitment_date" name="commitment_date"
                                class="form-control form-control-sm" placeholder="commitment_date" disabled />
                            </div>
                            <div class="col-12 col-md-4 col-lg-3">
                              <label>เลขที่</label>
                              <input type="text" v-model="form.code" name="code" class="form-control form-control-sm"
                                placeholder="เลขที่" disabled="disabled" />
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
                              <label>ผู้ส่ง(ชื่อ)</label>
                              <input type="text" v-model="form.sender_name" name="sender_name"
                                class="form-control form-control-sm" placeholder="ผู้ส่ง" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>ผู้ส่ง(เบอร์โทร)</label>
                              <input type="text" v-model="form.sender_tel" class="form-control form-control-sm"
                                placeholder="เบอร์โทร" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>ผู้ส่ง(email)</label>
                              <input type="text" v-model="form.sender_email" class="form-control form-control-sm"
                                placeholder="email" />
                            </div>
                            <div class="col-12 col-lg-6 col-xl-4">
                              <label>ผู้ส่ง(แผนกงาน)</label>
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
                          4) สินค้า/เครื่องมือ ({{ billStore.countItems }})
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
                                  <i class="bi bi-plus" role="button"></i>
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
                              <EasyDataTable class="m-0" :headers="headers" :items="carts" alternating
                                v-model:items-selected="itemsSelected" show-index border-cell :loading="loading"
                                :rowsPerPage="10" fixed-header>
                                <template #empty-message>
                                  ไม่มีรายการเครื่องมือใด ๆ
                                </template>
                                <template #item-qty="item">
                                  <input type="number" v-model="item.qty" class="" style="width: 50px;"
                                    @change="updateItemField('qty', item)" />
                                </template>
                                <template #item-discount="item">
                                  <input type="number" v-model="item.discount" class="" style="width: 80px;"
                                    @change="updateItemField('discount', item)" />
                                </template>
                                <template #item-price="item">
                                  <input type="number" v-model="item.price" class="" style="width: 80px;"
                                    @change="updateItemField('price', item)" />
                                </template>
                                <template #item-total="item">
                                  <input type="number" class="" style="width: 80px;"
                                    :value="(item.price - item.discount) * item.qty" disabled />
                                </template>
                                <template #item-remark="item">
                                  <input type="text" v-model="item.remark" class="" />
                                </template>
                              </EasyDataTable>
                              <div class="row">
                                <div class="col-12 col-md-6  py-2">
                                  <button type="button" @click="calculate" class="btn btn-success btn-sm">
                                    <i class="bi bi-calculator" /> คำนวณ
                                  </button>
                                </div>
                                <div class="col-12 col-md-6 text-end">
                                  <div class="row">
                                    <div class="col-6">รวม</div>
                                    <div class="col-6"><span class="text-decoration-underline fw-bold">{{
                                      Number(totalPrice).toLocaleString() }}</span></div>
                                  </div>
                                  <div class="row">
                                    <div class="col-6">VAT(%)</div>
                                    <div class="col-6 d-flex gap-2 justify-content-end">
                                      <div>
                                        <input type="number" v-model="form.vat_percent"
                                          class="form-control form-control-sm" style="width: 80px;" placeholder="%" />
                                      </div>
                                      <div class="text-decoration-underline fw-bold">{{
                                        Number(totalVat).toLocaleString() }}</div>
                                    </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-6">รวมเป็นเงินทั้งหมด</div>
                                    <div class="col-6"><span class="text-decoration-underline fw-bold">{{
                                      Number(grandTotal).toLocaleString()
                                    }}</span>
                                    </div>
                                  </div>

                                </div>
                              </div>

                            </div>
                          </div>


                          <!-- ############ START BUTTON ################# -->
                          <div class="text-end my-2">
                            <button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseCertAddress" aria-expanded="false"
                              aria-controls="collapseCertAddress">
                              <i class="bi bi-arrow-left"></i> ก่อนหน้า
                            </button>
                            <button class="btn btn-secondary btn-sm ms-3" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseCommitmentDate" aria-expanded="false"
                              aria-controls="collapseCommitmentDate">
                              <i class="bi bi-arrow-right"></i> ถัดไป
                            </button>
                          </div>
                          <!-- ############ END BUTTON ################# -->
                        </div>
                      </div>
                    </div>
                 
                    <!-- <div class="accordion-item">
                      <h2 class="accordion-header" id="headingCommitmentDate">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseCommitmentDate" aria-expanded="false"
                          aria-controls="collapseCommitmentDate">
                          <i class="bi bi-calendar mx-2"></i>
                          5) Commitment Date && Received Date
                        </button>
                      </h2>
                      <div id="collapseCommitmentDate" class="accordion-collapse collapse"
                        aria-labelledby="headingCommitmentDate" data-bs-parent="#accordionBill" value="yes">
                        <div class="accordion-body">
                          <input type="checkbox" v-model="searchCommitmentDate" @change="onChangeConditionCommitment" />
                          จองคิวห้อง Lab
                          <div class="row g2">
                            <div class="col-12 col-lg-4">
                              <input type="date" class="form-control-sm form-control" v-model="commitmentDate" />

                            </div>
                            <div class="col-12 col-lg-8">
                              <BillPriority v-model="commitmentPriority" />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div> -->
                  </div>
                </div>
                <div class="col-12">
                  <div v-if="messageErrorCommitment" class="alert alert-danger">
                    {{ messageErrorCommitment }}
                  </div>
                  <div v-if="messageSuccessCommitment" class="alert alert-success">
                    {{ messageSuccessCommitment }}
                    <div>
                      <span class="mx-2">วันที่เอกสาร</span>
                      {{
                        MyFormatDate(resultCommitment.data.document_date, {
                          hideTime: true,
                        })
                      }}
                      <span class="mx-2">งานเสร็จวันที่</span>
                      {{
                        MyFormatDate(resultCommitment.data.commitment_date, {
                          hideTime: true,
                        })
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <!-- #######################END ###################### -->
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="card">
          <div class="card-body pt-3">
            <div class="row g-1">
              <template v-if="form.id">
                <div class="col-12">
                  <button class="btn btn-primary btn-sm w-100" @click="saveBill()">
                    <i class="float-start bi bi-save"></i> บันทึก
                  </button>
                </div>
                <div class="col-12">
                  <router-link :to="`/bills/code/${form.code}/commitment`" class="btn btn-sm btn-secondary d-block">
                    <i class="bi bi-clock float-start"></i>
                    จองคิวงาน</router-link>
                </div>
                <div class="col-12">
                  <a class="btn btn-sm btn-secondary d-block">
                    <i class="bi bi-printer float-start"></i>
                    พิมพ์</a>
                </div>
              </template>
              <template v-else>
                <div class="col-12">
                  <button class="btn btn-primary btn-sm w-100" @click="createBill()">
                    <i class="float-start bi bi-save"></i> สร้างใบขอรับบริการ
                  </button>
                </div>
                <div class="col-12">
                  <router-link to="/bills/preview" class="btn btn-sm btn-secondary d-block">
                    <i class="bi bi-eye float-start"></i>
                    ดูตัวอย่าง</router-link>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalProduct ref="modalProduct" @select="onSelectProducts" />
    <ModalCustomer ref="modalCustomer" @select="onSelectCustomer" />
    <ModalContact ref="modalContact" @select="onSelectContact" v-model:customerId="form.company_id" />
  </section>
</template>

<style lang="scss" scoped>
.accordion {
  .accordion-body {
    background-color: rgb(230, 230, 230);
    color: #130f0f;

    .form-control {
      border: solid 1px #8b8a8a;
    }
  }
}

.table-bill-items {
  border: solid 1px #130f0f;
}

div[size='A4'] {
  width: 21cm;
  height: 29.7cm;
  padding: 10px;
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);

  >p,
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
