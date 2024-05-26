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

const items = ref({})
const pagination = ref({
  per_page: 5,
  curent_page: 1,
})
const loading = ref(false)
const modalView = ref(null)


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
  invoice_status: '',
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
  } catch (error) {}
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
      console.log('addess', data);
      let text = (`${a.address} ${a.subdistrict} ${a.district} ${a.province} ${a.postcode}`).trim()
      console.log(text);
      form.value.address_detail = text
    }
  } catch (error) {}
}
const loadCertAddress = async (customerId) => {
  try {
    const { data } = await api.get(`/v2/customers/${customerId}/cert-addresses`)
    if (data) {
      certAddresses.value = data
      console.log('certAddresses', data);
    }
  } catch (error) {}
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

onMounted(() => {})
onUpdated(() => {
  billStore.updateItems(carts.value)
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

            <h3>แบบฟอร์มเปิดงานทดสอบเครื่องมือ</h3>

            <form @submit.prevent="onSearch()">
              <div class="row g-2">
                <div class="col-6 col-md-4 col-lg-3">
                  <label>Date Issued</label>
                  <input
                    type="date"
                    v-model="form.document_date"
                    name="code"
                    class="form-control form-control-sm"
                    placeholder="Code"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label>Due Date</label>
                  <input
                    type="date"
                    v-model="form.due_date"
                    name="code"
                    class="form-control form-control-sm"
                    placeholder="Code"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3" v-if="form.code">
                  <label>Code</label>
                  <input
                    type="text"
                    v-model="form.code"
                    name="code"
                    class="form-control form-control-sm"
                    placeholder="Code"
                    disabled="disabled"
                  />
                </div>

                <div class="col-12">
                  <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingOne">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <i class="bi bi-person mx-2"></i>
                          ข้อมูลลูกค้า
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        class="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <div class="row g-2">
                            <div class="col-6 col-md-4 col-lg-3">
                              <label>บริษัท <span>{{}}</span></label>
                              <input
                                type="text"
                                v-model="form.address_name"
                                name="customer_name"
                                class="form-control form-control-sm"
                                placeholder=""
                                @click="addCustomer"
                              />
                            </div>
                            <div class="col-6 col-md-4 col-lg-3">
                              <label>ผู้ติดต่อ</label>
                              <input
                                type="text"
                                v-model="form.agent_name"
                                name="agent_name"
                                class="form-control form-control-sm"
                                placeholder="ผู้ติดต่อ"
                                @click="addContact"
                              />
                            </div>
                            <div class="col-6 col-md-4 col-lg-6">
                              <label>ที่อยู่</label>
                              <input
                                type="text"
                                v-model="form.address_detail"
                     
                                class="form-control form-control-sm"
                                placeholder=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingTwo">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          ที่อยู่ลูกค้า
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <strong>This is the second item's accordion body.</strong> It is hidden by
                          default, until the collapse plugin adds the appropriate classes that we
                          use to style each element. These classes control the overall appearance,
                          as well as the showing and hiding via CSS transitions. You can modify any
                          of this with custom CSS or overriding our default variables. It's also
                          worth noting that just about any HTML can go within the
                          <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingThree">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          ที่อยู่ในการจัดส่งใบรับรอง
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <strong>This is the third item's accordion body.</strong> It is hidden by
                          default, until the collapse plugin adds the appropriate classes that we
                          use to style each element. These classes control the overall appearance,
                          as well as the showing and hiding via CSS transitions. You can modify any
                          of this with custom CSS or overriding our default variables. It's also
                          worth noting that just about any HTML can go within the
                          <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="(item, index) in carts"
                    :key="index"
                    style="border: solid 1px #cccc"
                    class="my-2"
                  >
                    <table class="table table-sm table-striped">
                      <thead>
                        <tr>
                          <td></td>
                          <td colspan="9">
                            <h5 class="h5 text-primary">{{ item.product_name }}</h5>
                            <div class="text-danger">{{ item.product_code }}</div>
                          </td>
                        </tr>
                        <tr>
                          <th scope="col" class="text-strong h5">{{ index + 1 }}</th>
                          <th scope="col">#</th>
                          <th scope="col">Barcode</th>

                          <th scope="col">Serial No.</th>
                          <th scope="col">Model</th>
                          <th scope="col">ID No.</th>

                          <th scope="col">ส่วนลด</th>
                          <th scope="col">ราคา</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <th scope="row"></th>
                          <th scope="row">
                            <i
                              @click="removeItem(item, index)"
                              class="bi bi-trash text-danger"
                              role="button"
                            ></i>
                          </th>
                          <td>
                            <input
                              type="text"
                              class="form-control form-control-sm"
                              v-model="item.barcode_no"
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              class="form-control form-control-sm"
                              v-model="item.serialnumber"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control form-control-sm"
                              v-model="item.model"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control form-control-sm"
                              v-model="item.id_no"
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              class="form-control form-control-sm"
                              min="0"
                              v-model="item.discount"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              class="form-control form-control-sm"
                              min="0"
                              v-model="item.price"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button type="button" class="btn btn-sm btn-success" @click="addProduct()">
                    <i class="bi bi-plus" role="button"></i>
                  </button>
                </div>
                <div class="col-12">Total Items : {{ useBillStore.countItems }}</div>
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
                  :to="{
                    name: 'bills.preview',
                    params: {
                      code: '',
                    },
                  }"
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
    <ModalProduct ref="modalProduct" @select="onSelectProducts" />
    <ModalCustomer ref="modalCustomer" @select="onSelectCustomer" />
    <ModalContact ref="modalContact" @select="onSelectContact" />
    {{ form }}
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
