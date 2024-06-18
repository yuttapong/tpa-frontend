<template>
  <div class="pagetitle">
    <h1>ใบขอรับบริการ ({{ parseInt(pagination.total).toLocaleString() }})</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item active">ใบขอรับบริการ</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section profile">
    <spinner :visible="loading" />

    <div class="row" v-if="items">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <!-- Bordered Tabs -->
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  ใบขอรับบริการ
                  <span v-if="pagination">({{ parseInt(pagination.total).toLocaleString() || 0 }})</span>
                </button>
              </li>
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active qt-index" id="qt-index">
                <form @submit.prevent="onSearch()" class="mb-3">
                  <div class="row g-2">
                    <div class="col-6 col-md-4 col-lg-3">
                      <input
                        type="search"
                        v-model="formSearch.id"
                        name="id"
                        class="form-control form-control-sm"
                        placeholder="ID"
                        @keyup.enter="search"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <input
                        type="search"
                        v-model="formSearch.code"
                        name="code"
                        class="form-control form-control-sm"
                        placeholder="Code"
                        @keyup.enter="search"
                      />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                        class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                        @keyup.enter="search" />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="search" v-model="formSearch.q" name="q" class="form-control form-control-sm"
                        placeholder="ลูกค้า/ผู้ติดต่อ" @keyup.enter="search" />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />
                      <input type="reset" class="btn btn-secondary btn-sm mx-2" value="Reset" @click="resetFormSearch" />
                      <router-link class="btn btn-sm btn-success" to="/bills/form">
                        <i class="bi bi-plus"></i> สร้าง
                      </router-link>
                    </div>
                  </div>
                </form>
                <!-- Small tables -->
                <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                  :on-click="onChangePage" />
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">Action</th>
                        <th scope="col" class="fw-bold text-decoration-underline">#ID</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Code</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Date</th>
                        <th scope="col" class="fw-bold text-decoration-underline" nowrap>
                          Commitment Date
                        </th>

                        <th scope="col" class="fw-bold text-decoration-underline">Customer</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <th scope="row" nowrap>
                          <router-link :to="{ name: 'bills.commitmentForm', params: { code: item.code } }">
                            <i class="bi bi-calendar mx-1" role="button"></i></router-link>
                          <router-link :to="{ name: 'bills.formEdit', params: { code: item.code } }">
                            <i class="bi bi-pencil mx-1" role="button"></i></router-link>
                          <i class="bi bi-search mx-1" @click="showDetail(item)" role="button"></i>
                        </th>
                        <th scope="row">{{ item.id }}</th>
                        <td align="left" nowrap>
                          <router-link :to="`/bills/code/${item.code}`"
                            class="w-full d-block fw-bold border bg-dark text-white p-1" target="_blank">
                            {{ item.code }}
                          </router-link>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark" v-if="item.document_date">{{
                            DateTime(new Date(item?.document_date))
                          }}</span>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark" v-if="item.commitment_date">{{
                            DateTime(new Date(item?.commitment_date))
                          }}</span>
                        </td>

                        <td>
                          <div>{{ item.customer?.companyname }}</div>
                          <small class="text-danger mx-1">({{ item.agent_name }})</small>
                          <small class="text-secondary mx-1">({{ item.customer.taxnumber }})</small>
                        </td>
                        <td>{{ item.progress_status }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                  :on-click="onChangePage" />
                <!-- End small tables -->
              </div>


            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="modal" ref="modalViewRef" v-if="bill">
    <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Bill เลขที่ : {{ bill.code }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">เลขที่</label>
              <p>{{ bill.code }}</p>
            </div>
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">ลูกค้า</label>
              <p>{{ bill?.customer?.companyname }}</p>
            </div>
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">วันที่</label>
              <p>{{ bill.document_date }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">ผู้ติดต่อ</label>
              <p>{{ bill.agent_name }}</p>
            </div>
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">เลขที่</label>
              <p>{{ bill.address_name }} {{ bill.address_detail }}</p>
            </div>
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">เวลาทำรายการ</label>
              <p>{{ bill.date_start }}</p>
            </div>
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">Commitment Date</label>
              <p>{{ bill.commitment_date }}</p>
            </div>
          </div>

          <div class="" v-if="loadingItems">
            <div class="spinner-grow" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-condensed" v-if="!loadingItems">
              <thead>
                <tr>
                  <th class="fw-bold text-decoration-underline">#</th>
                  <th class="fw-bold text-decoration-underline">NO</th>
                  <th class="fw-bold text-decoration-underline">ItemCode</th>
                  <th class="fw-bold text-decoration-underline">รายการ</th>
                  <th class="fw-bold text-decoration-underline">ID No.</th>
                  <th class="fw-bold text-decoration-underline">Model</th>
                  <th class="fw-bold text-decoration-underline">Point</th>
                  <th class="fw-bold text-decoration-underline">Point Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in bill.items" :key="row">
                  <th>
                    <input type="checkbox" v-model="itemsSelected" name="itemsSelected[]" :value="row" />
                  </th>
                  <th>{{ rowIndex + 1 }}</th>
                  <td>{{ row.item_code }}</td>
                  <td>{{ row.product_name }}</td>
                  <td>
                    <span class="mx-2 badge badge-light text-dark d-inline-block">{{
                      row.id_no
                    }}</span>
                  </td>
                  <td>
                    <span class="mx-2 badge badge-light text-dark d-inline-block">{{
                      row.model
                    }}</span>
                  </td>
                  <td>{{ row.point }}</td>
                  <td>{{ row.point_price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <label class="me-3 fw-bold text-decoration-underline">NOTE:</label>{{ bill.note_customers }}
          </p>
        </div>
        <div class="modal-footer d-block">
          <!-- ///////////// -->

          <div class="d-flex">
            <div class="p-1">
              <span class="alert alert-danger p-1" v-if="errorMsg">{{ errorMsg }}</span>
            </div>

            <div class="p-1">
              <span class="badge rounded-pill bg-danger p-2 fw-bold" v-if="itemsSelected.length > 0">{{
                itemsSelected.length }} รายการ</span>
            </div>
          </div>

          <div class="row g-2">
            <div class="col-12 col-lg-12 col-xl-12">
              <Spinner :visible="loadingCancelCommitment" />
              <span v-if="resultCancelCommitment.success === true"
                class="text-success">{{ resultCancelCommitment.message }}</span>
              <span v-if="resultCancelCommitment.success === false"
                class="text-danger">{{ resultCancelCommitment.message }}</span>
            </div>

            <div class="col-12 col-lg-6 col-xl-6">
              <button type="button" class="btn btn-danger btn-sm mx-1" @click="cancelBill(bill)">
                <i class="bi bi-x"></i> ยกเลิก
              </button>
              <button type="button" class="btn btn-success btn-sm mx-1" @click="newInvoice">
                <i class="bi bi-plus"></i> Invoice Cart
              </button>
              <button type="button" class="btn btn-secondary btn-sm mx-1" data-bs-dismiss="modal">
                <i class="bi bi-x-circle"></i> ปิดหน้าต่าง
              </button>
            </div>
          </div>

          <!-- ///////////// -->
        </div>
      </div>
    </div>
  </div>

  <div class="modal" ref="modalInvoiceRef">
    <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">สร้างใบแจ้งหนี้ / Invoice</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-4">
              <!-- <label class="fw-bold text-decoration-underline">เลขที่</label>
                            <p>xxxxxxxxxxxxx</p> -->
            </div>
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">ลูกค้า</label>
              <p>
                <input type="text" v-model="invoice.customer_name" class="form-control form-control-sm" />
              </p>
            </div>
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">ที่อยู่</label>
              <p>
                <input type="date" v-model="invoice.document_date" class="form-control form-control-sm" />
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <label class="fw-bold text-decoration-underline">ผู้ติดต่อ</label>
              <p>
                <input type="text" v-model="invoice.contact_name" class="form-control form-control-sm" />
              </p>
            </div>
            <div class="col-8">
              <label class="fw-bold text-decoration-underline">ที่อยู่</label>
              <p>
                <input type="text" v-model="invoice.address_detail" class="form-control form-control-sm" />
              </p>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-condensed">
              <thead>
                <tr>
                  <th class="fw-bold text-decoration-underline">NO</th>
                  <th class="fw-bold text-decoration-underline">ItemCode</th>
                  <th class="fw-bold text-decoration-underline">รายการ</th>
                  <th class="fw-bold text-decoration-underline">Model</th>
                  <th class="fw-bold text-decoration-underline">ราคา</th>
                  <th class="fw-bold text-decoration-underline">ส่วนลด</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in invoice.items" :key="row">
                  <th>{{ rowIndex + 1 }}</th>
                  <th>{{ row.item_code }}</th>
                  <th>{{ row.product_name }}</th>
                  <th>
                    <span class="mx-2 badge badge-light text-dark d-inline-block">{{
                      row.model
                    }}</span>
                  </th>
                  <th>
                    <input type="number" name="price[]" v-model="row.price" class="form-control form-control-sm"
                      style="width: 100px" />
                  </th>
                  <th>
                    <input type="number" name="price[]" v-model="row.discount" class="form-control form-control-sm"
                      style="width: 100px" />
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <label class="font-bold mr-3">NOTE:</label>
            <textarea class="form-control" placeholder="หมายเหตุ"></textarea>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="createInvoice">
            สร้างใบแจ้งหนี้
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
import { Modal } from 'bootstrap'
import { useInvoiceStore } from '@/stores/invoiceStore'
import router from '@/router'
import { toast } from 'vue3-toastify'
import { timezone } from '@/config'
import { formatInTimeZone, toZonedTime, toDate, format } from 'date-fns-tz'
import { formatISO } from 'date-fns'
import { useAppStore } from '@/stores/appStore'
import axios from 'axios'
import CommitmentBooking from './components/CommitmentBooking.vue'

const appStore = new useAppStore()

const row = ref({})
const items = ref({})
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loadingCancelCommitment = ref(false)
const loading = ref(true)
const loadingItems = ref(true)
const bill = ref({})
const invoice = ref({})
const modalViewRef = ref(null)
const modalView = ref(null)
const modalInvoiceRef = ref(null)
const modalInvoice = ref(null)

const resultCancelCommitment = ref({})
const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})

const invoiceStore = useInvoiceStore()


const loadData = async () => {
  loading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/bills', {
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
  loading.value = false
}

const getBillById = async (id) => {
  try {
    const { data } = await api.get('/v2/bills/' + id)
    if (data) {
      bill.value = data
      loading.value = false
    }
    loadingItems.value = false
  } catch (error) {
    loadingItems.value = false
  }
}

const showDetail = (item) => {
  loadingItems.value = true
  errorMsg.value = ''
  itemsSelected.value = []
  bill.value = item
  bill.value.items = []
  modalView.value.show()
  getBillById(item.id)
}

const errorMsg = ref()
const itemsSelected = ref([])

const cancelBill = async (item) => {
  resultCancelCommitment.value = {}
  let params = {
    bill_id: item.id,
    bill_code: item.code,
  }
  loadingCancelCommitment.value = true
  const { data } = await axios
    .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appStore.token}`,
      },
    })
    .catch((err) => {
      resultCancelCommitment.value.success = false
      loadingCancelCommitment.value = false
      if (err.response) {
        let data = err.response?.data
        if (data) {
          resultCancelCommitment.value.message = data.message
          toast(data.message, {
            theme: 'auto',
            type: 'default',
            dangerouslyHTMLString: true,
          })
        } else {
          resultCancelCommitment.value.message = err.message
          toast(err.message, {
            theme: 'auto',
            type: 'default',
            dangerouslyHTMLString: true,
          })
        }
      } else {
        resultCancelCommitment.value.message = err.message
        toast(err.message, {
          theme: 'auto',
          type: 'default',
          dangerouslyHTMLString: true,
        })
      }
    })
  if (data) {
    resultCancelCommitment.value.success = true
    resultCancelCommitment.value.message = data.message
    loadingCancelCommitment.value = false
    toast(data.message, {
      theme: 'auto',
      type: 'success',
      dangerouslyHTMLString: true,
    })
  }
  return
}
const newInvoice = () => {
  errorMsg.value = ''
  const i = bill.value
  if (itemsSelected.value.length === 0) {
    errorMsg.value = 'โปรดเลือกรายการเครื่องมืออย่างน้อย 1 รายการ'
    return false
  }
  invoice.value = {
    bill_id: i.id,
    bill_code: i.code,
    customer_name: i.customer?.companyname,
    document_date: i.document_date,
    address_name: i.address_name,
    address_detail: i.address_detail,
    contact_name: i.agent_name,
    discount: 0,
  }
  invoice.value.items = itemsSelected.value
  if (itemsSelected.value.length > 0) {
    itemsSelected.value.map((item) => {
      const product = {
        item_id: item.item_id,
        item_code: item.item_code,
        bill_id: item.bill_id,
        product_name: item.product_name,
        product_id: item.product_id,
        product: item?.product,
        id_no: item.id_no,
        model: item.model,
        serialnumber: item.serialnumber,
        barcode_no: item.barcode_no,
        price: item.total,
        manufaturer_name: item.manufaturer_name,
        lab: item.lab,
      }
      invoiceStore.addItem(product)
    })
  }
  modalView.value.hide()
  router.push({ name: 'invoices.create' })
}

const createInvoice = () => {
  alert('สร้างใบแจ้งนี้สำเร็จ')
  invoice.value = {}
  bill.value = {}
  errorMsg.value = ''
  itemsSelected.value = []
  modalView.value.hide()
  modalInvoice.value.hide()
}

const onSearch = async () => {
  try {
    await loadData()
  } catch (error) { }
}
const onChangePage = (page) => {
  pagination.value.current_page = page
  loadData()
}

const resetFormSearch = () => {
  formSearch.value.taxnumber = ''
  formSearch.value.q = ''
}

onMounted(() => {
  errorMsg.value = ''
  modalView.value = new Modal(modalViewRef.value)
  modalInvoice.value = new Modal(modalInvoiceRef.value)
  loadData()
})
</script>
<style lang="scss" scoped>
.qt-detail {
  .row {
    margin-bottom: 20px;
    font-size: 15px;
  }

  .card-title {
    color: #012970;
  }

  .label {
    font-weight: 600;
    color: rgba(1, 41, 112, 0.6);
  }
}

.checkbox {
  transform: scale(
      /*desired magnification*/
    );
}
</style>
