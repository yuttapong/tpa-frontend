<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
import { Modal } from 'bootstrap'
import { useBillStore } from '@/stores/billStore'
import ModalProduct from '@/views/product/components/ModalProduct.vue'
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import CommitmentBooking from '@/views/bill/components/CommitmentBooking.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { formatInTimeZone, toZonedTime, toDate, format } from 'date-fns-tz'
import { formatDate, formatISO } from 'date-fns'
import { timezone } from "@/config"
import { useAppStore } from '@/stores/appStore'
const route = useRoute()
const items = ref({})
const pagination = ref({
  per_page: 5,
  curent_page: 1,
})
const appStore = useAppStore();
const loading = ref(false)
const modalView = ref(null)
const searchCommitmentDate = ref(true)

const modalProduct = ref(null)
const modalContact = ref(null)
const modalCustomer = ref(null)
const addresses = ref([])
const certAddresses = ref([])
const billStore = useBillStore()

const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})
const carts = computed(() => billStore.items)
const form = ref({
  id: 0,
  bill_code: '',
  document_date: new Date(),
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
})

//  commitment
const loadingCommitment = ref(false)
const errorMsg = ref()
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

const loadData = async () => {
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.curent_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/bills', {
    params: params,
  })
  if (data) {
    const p = {
      total: data?.total,
      page: data?.curent_page,
      per_page: data?.per_page,
      page_count: data?.last_page,
    }
    pagination.value = p
    items.value = data.data
    loading.value = false
  }
}

const getInvoiceById = async (id) => {
  try {
    const { data } = await api.get('/v2/bills/' + id)
    if (data) {
      items.value = data
      loading.value = false
    }
  } catch (error) { }
}
const showDetail = (item) => {
  modalView.value.show()
  getInvoiceById(item.id)
}

const addProduct = () => {
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
  form.value.items.splice(index, 1)
  billStore.removeItem(item)
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
    console.log(formCommitment.value);
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
const saveBill = () => {
  form.value.items = billStore.selectedItems
  console.log('formCommitment', formCommitment.value);
  console.log('saveBill', form.value)
  billStore.setForm(form.value)

  if (searchCommitmentDate.value === true) {
    findCommitmentDate()
    console.log(resultCommitment.value);
  } else {
  }
}

onMounted(() => {
  form.value = billStore.form

  if (route.query.id) {
    api.get('/v2/bills/' + route.query.id).then((rs) => {
      form.value = rs.data
      billStore.updateItems(rs.data?.items)
      billStore.setForm(form.value)
    })
  }
})
onUpdated(() => {
  billStore.updateItems(carts.value)
  form.value.items = carts.value

})
</script>
<template>
  <div class="pagetitle">
    <h1>ใบขอรับบริการ</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item">
          <router-link to="/invoices">ใบขอรับบริการ</router-link>
        </li>
        <li class="breadcrumb-item active">สร้างใบขอรับบริการใหม่</li>
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

            <h4 class="bg-info-subtle p-2">แบบฟอร์มเปิดงานทดสอบเครื่องมือ</h4>

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
                                <span v-if="form.company_id">({{ form?.company_id }})</span></label>
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
                        <div class="accordion-body">

                          <div v-for="(item, index) in carts" :key="index" class="my-2">
                            <table class="table table-sm table-striped border">
                              <thead>
                                <tr>
                                  <td>{{ index + 1 }})</td>
                                  <td colspan="5">
                                    <h5 class="h6 text-primary my-0 fw-bolder">
                                      {{ item?.product_name }}
                                    </h5>
                                    <div class="text-danger">{{ item?.product_code }}</div>
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="col" class="text-strong h5"></th>

                                  <th scope="col">Barcode</th>

                                  <th scope="col">Serial No.</th>
                                  <th scope="col">Model</th>
                                  <th scope="col">ID No.</th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td scope="row">
                                    <i @click="removeItem(item, index)" class="bi bi-trash text-danger" role="button"></i>
                                  </td>
                                  <td>
                                    <input type="text" class="form-control form-control-sm" v-model="item.barcode_no"
                                      placeholder="barcode" />
                                  </td>

                                  <td>
                                    <input type="text" class="form-control form-control-sm" v-model="item.serialnumber"
                                      placeholder="S/N" />
                                  </td>
                                  <td>
                                    <input type="text" class="form-control form-control-sm" v-model="item.model"
                                      placeholder="model" />
                                  </td>
                                  <td>
                                    <input type="text" class="form-control form-control-sm" v-model="item.id_no"
                                      placeholder="id_no" />
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row" colspan="1"></th>
                                  <td colspan="4">
                                    <div class="row g-2 mt-1">
                                      <div class="col-12 col-md-3">
                                        <label>range price</label>
                                        <input type="number" v-model="item.range_price"
                                          class="form-control-sm form-control" placeholder="range_price" />
                                      </div>
                                      <div class="col-12 col-md-3">
                                        <label>range value</label>
                                        <input type="number" v-model="item.range_value"
                                          class="form-control-sm form-control" placeholder="range_value" />
                                      </div>
                                      <div class="col-12 col-md-3">
                                        <label>point price</label>
                                        <input type="number" class="form-control form-control-sm" min="0"
                                          v-model="item.point_price" />
                                      </div>
                                      <div class="col-12 col-md-3">
                                        <label>point</label>
                                        <input type="number" class="form-control form-control-sm" min="0"
                                          v-model="item.point" />
                                      </div>
                                    </div>
                                    <div class="row g-2 mt-1">
                                      <div class="col-12 col-md-6">
                                        <input type="text" v-model="item.test_point" class="form-control-sm form-control"
                                          placeholder="test point..." />
                                      </div>
                                      <div class="col-12 col-md-3">
                                        <input type="number" v-model="item.discount" class="form-control-sm form-control"
                                          placeholder="discount" />
                                      </div>
                                      <div class="col-12 col-md-3">
                                        <input type="number" v-model="item.total" class="form-control-sm form-control"
                                          placeholder="total" />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <button type="button" class="btn btn-sm btn-success" @click="addProduct()">
                            <i class="bi bi-plus" role="button"></i>
                          </button>
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
                    <div class="accordion-item">
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
                          <CommitmentBooking :data="form" title="" class="my-2" @change="onSelectCommitmentDate"
                            v-model:commitmentDate="commitmentDate" />
                        </div>
                        commitmentDate: {{ commitmentDate }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div v-if="messageErrorCommitment" class="alert alert-danger">
                    {{ messageErrorCommitment }}
                  </div>
                  <div v-if="messageSuccessCommitment" class="alert alert-success">
                    {{ messageSuccessCommitment }}
                    <div>
                      <span class="mx-2">วันที่เอกสาร</span> {{ DateTime(resultCommitment.data.document_date, {
                        hideTime: true
                      }) }}
                      <span class="mx-2">งานเสร็จวันที่</span> {{ DateTime(resultCommitment.data.commitment_date, {
                        hideTime: true
                      }) }}
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
              <div class="col-12">
                <button class="btn btn-primary btn-sm w-100" @click="saveBill()">บันทึก</button>
              </div>
              <div class="col-12">
                <router-link :to="{
                  name: 'bills.preview',
                  params: {
                    code: '',
                  },
                }" class="btn btn-sm btn-secondary d-block">
                  <i class="bi bi-eye"></i>
                  Preview ดูตัวอย่าง</router-link>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary d-block">
                  <i class="bi bi-printer"></i>
                  พิมพ์</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalProduct ref="modalProduct" @select="onSelectProducts" />
    <ModalCustomer ref="modalCustomer" @select="onSelectCustomer" />
    <ModalContact ref="modalContact" @select="onSelectContact" />

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
