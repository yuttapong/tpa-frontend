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
    <div class="row" v-if="items">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <!-- Bordered Tabs -->
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  <i class="bi bi-book"></i> ใบขอรับบริการ
                  <span v-if="pagination">({{ parseInt(pagination.total).toLocaleString() || 0 }})</span>
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-status">
                  <i class="bi bi-wifi"></i> สถานะ
                </button>
              </li>
            </ul>

            <div class="tab-content pt-2">
              <div class="tab-pane fade show active qt-index" id="qt-index">
                <form @submit.prevent="onSearch()" class="mb-3">
                  <div class="d-flex flex-wrap gap-2">
                    <div class="">
                      <button type="button" class="btn btn-primary btn-sm" @click="newBill()">
                        <i class="bi bi-plus"></i>
                        สร้างใบขอรับบริการ
                      </button>
                    </div>


                    <div class="">
                      <input type="search" v-model="formSearch.code" name="code" class="form-control form-control-sm"
                        placeholder="เลขที่ใบขอรับ" @keyup.enter="search" autofocus />
                    </div>
                    <div class="">
                      <BButton size="sm" variant="light" @click="showModalFilterOfSearch = true">
                        <i class="bi bi-filter"></i>
                      </BButton>
                      <BButton type="submit" size="sm" variant="light" :loading="loading">
                        <i class="bi bi-search"></i>
                      </BButton>
                    </div>


                  </div>
                  <BModal v-model="showModalFilterOfSearch" title="เงือนไขการค้นหา" @cancel="onResetSearch(); onSearch();"
                    ok-title="ค้นหา" cancel-title="รีเซ็ต" @ok="onSearch()">
                    <div class="d-flex flex-wrap gap-2">

                      <div class="">
                        <input type="search" v-model="formSearch.id" name="id" class="form-control form-control-sm"
                          placeholder="ID" @keyup.enter="search" />
                      </div>

                      <div class="">
                        <input type="search" v-model="formSearch.code" name="code" class="form-control form-control-sm"
                          placeholder="เลขที่ใบขอรับ" @keyup.enter="search" autofocus />
                      </div>
                      <div class="">
                        <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                          class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                          @keyup.enter="search" />
                      </div>
                      <div class="">
                        <input type="search" v-model="formSearch.q" name="q" class="form-control form-control-sm"
                          placeholder="ลูกค้า/ผู้ติดต่อ" @keyup.enter="search" />
                      </div>
                      <div class="">

                        <VueDatePicker v-model="documentDateRange" range locale="th" class="form-control-sm p-0"
                          placeholder="ช่วงวันที่ dd/mm/yyyy - dd/mm/yyyy" style="min-width: 353px"
                          :hide-navigation="['time']" model-type="iso" :format="searchFormatDate"
                          @change="onChangeDateRange" />
                      </div>
                    </div>

                  </BModal>
                </form>

                <div class="my-2 d-flex flex-wrap gap-2">

                  <div class="">
                    <button type="button" v-if="billSelected.length" class="btn btn-outline-secondary btn-sm"
                      @click="openModalBulkCommitmentBook()">
                      <i class="bi bi-clock"></i>
                      จองคิวห้องทดลอง ({{ billSelected.length }})
                    </button>
                  </div>
                  <div>
                    <button type="button" v-if="billSelected.length" class="btn btn-outline-danger btn-sm"
                      @click="openModalBulkCommitmentCancel()">
                      <i class="bi bi-clock"></i>
                      ยกเลิกจองคิว ({{ billSelected.length }})
                    </button>
                  </div>
                </div>
                <BTableSimple bordered :items="items" class="" :per-page="pagination.per_page" hover small caption-top
                  responsive>
                  <BThead head-variant="dark">
                    <BTr>
                      <BTh colspan="2" class="text-center">Actions</BTh>

                      <BTh colspan="3" class="text-center">ใบขอรับบริการ</BTh>
                      <BTh rowspan="2" class="text-center">ลูกค้า</BTh>
                      <BTh rowspan="2" class="text-center">สถานะ</BTh>
                      <BTh colspan="2" class="text-center">ผู้ทำรายการ</BTh>

                    </BTr>
                    <BTr>
                      <BTh>
                        <BFormCheckbox @change="onChageSelectAll" v-model="selectAll" />
                      </BTh>
                      <BTh class="text-center"></BTh>
                      <BTh nowrap class="text-center">เลขที่</BTh>
                      <BTh class="text-center">วันที่</BTh>
                      <BTh>วันนัดรับ</BTh>
                      <BTh class="text-center">โดย</BTh>
                      <BTh class="text-center">เวลา</BTh>
                    </BTr>
                  </BThead>
                  <BTbody>
                    <BTr v-for="item in items" :key="item">
                      <BTd>
                        <BFormCheckbox v-model="billSelected" :value="item" />
                      </BTd>
                      <BTd>
                        <div class="d-flex gap-1">
                          <!-- <router-link class="btn btn-sm btn-outline-secondary"
                        :to="{ name: 'bills.commitmentForm', params: { code: row.item.code } }">
                        <i class="bi bi-calendar" role="button"></i></router-link> -->
                          <button type="button" @click="showDetail(item)" class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-eye"></i>
                          </button>

                          <button type="button" class="btn btn-outline-secondary btn-sm" @click="showEdit(item)">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button type="button" class="btn btn-outline-secondary btn-sm"
                            @click="openModalCommitment(item)">
                            <i class="bi bi-clock"></i>
                          </button>
                        </div>
                      </BTd>
                      <BTd>
                        <div class="text-center" style="width: 130px">
                          <BillCode :data="item.code" role="button" @click="showDetail(item)" />
                          {{ item.id }}
                        </div>
                      </BTd>
                      <BTh>{{ myFormatDate(item.document_date) }}</BTh>
                      <BTd>
                        <div class="" style="width: 100px">
                          {{ myFormatDate(item.commitment_date) }}
                        </div>
                      </BTd>

                      <BTd>
                        <div>
                          <div>{{ item.address_name }}</div>
                          <div class="d-flex flex-wrap gap-2">
                            <BBadge variant="warning" v-if="item.customer" class="text-danger">{{
                              item?.customer.province
                            }}</BBadge>
                            <small v-if="item.agent_name" class="text-danger">{{
                              item.agent_name
                            }}</small>
                          </div>
                        </div>
                      </BTd>
                      <BTd class="text-center">
                        <div class="" style="width: 100px">
                          <BillStatus v-model="item.bill_status" />

                        </div>
                      </BTd>
                      <BTd>
                        <div class="text-center" style="width: 50px">
                          <i class="bi bi-person"></i>
                          {{ item.user_start }}
                        </div>
                      </BTd>
                      <BTd>
                        <div class="" style="width: 100px">

                          {{ myFormatDateTime(item.date_start) }}
                        </div>
                      </BTd>
                    </BTr>
                  </BTbody>
                </BTableSimple>

                <BPagination v-model="pagination.current_page" :total-rows="pagination.total"
                  :per-page="pagination.per_page" size="sm" class="my-0" @page-click="onChangePage" />
              </div>
            </div>
            <div class="tab-content pt-2">
              <div class="tab-pane fade qt-status" id="qt-status">
                <table class="table table-sm table-border">
                  <thead>
                    <tr>
                      <th>สถานะ</th>
                      <th>คำอธิบาย</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>New Request</td>
                      <td>
                        <ul>
                          <li>สร้างใบขอรับบริการใหม่</li>
                          <li>รอเพิ่มเครื่องมือต่างๆ</li>
                          <li>สามารถเปลี่ยนเป็น Pending / Canceled</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Pending</td>
                      <td>
                        <ul>
                          <li>
                            เมื่อมีการระบุ [วันที่ทดสอบ] และ [วันนัดรับ] สถานะของงานจะถูกเปลี่ยนเป็น
                            Pending
                          </li>
                          <li>สามารถเปลี่ยนสถานะเป็น In Progress / Canceled / Void</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>In Progress</td>
                      <td>
                        <ul>
                          <li>
                            เมื่อมีการเริ่มดำเนินการ หรืองานเข้าห้องทดลอง สถานะเปลี่ยนเป็น In
                            Progress
                          </li>
                          <li>สามารถเปลี่ยนเป็น Completed / Canceled / Void</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Completed</td>
                      <td>
                        <ul>
                          <li>ใบขอรับบริการที่งานเสร็จหมดแล้ว สถานะเปลี่ยนเป็น Completed</li>
                          <li>ใบขอรับบริการที่มีสถานะเป็น Completed สามารถดึงไปออกใบรับรอง</li>
                          <li>สามารถเปลี่ยน Closed</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Closed</td>
                      <td>
                        <ul>
                          <li>
                            มีการสร้างใบรับรอง หรือ Invoice แล้ว เอกสารทุกอย่างเรียบร้อย มีสถานะเป็น
                            Closed
                          </li>

                          <li>
                            ใบขอรับบริการที่มีสถานะเป็น Closed
                            ไม่สามารถเปลี่ยนสถานะเป็นอย่างอื่นได้อีก
                          </li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Canceled</td>
                      <td>
                        <ul>
                          <li>ใบขอรับบริการที่ถูกเลิก สถานะถูกเปลี่ยนเป็น Canceled</li>
                          <li>
                            ใบขอรับบริการที่มีสถานะเป็น Canceled
                            ไม่สามารถเปลี่ยนสถานะเป็นอย่างอื่นได้อีก
                          </li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Void</td>
                      <td>
                        <ul>
                          <li>
                            ใบขอรับบริการที่สถานะเป็น Void จะไม่สามารถนำไปใช้งานจริงและออกรายงาน
                          </li>
                          <li>ใช้สำหรับในการทดสอบระบบ</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>

    <ModalBillCreate ref="modalBillCreateRef" title="สร้างใบขอรับบริการใหม่" :billTypes="billTypes"
      @onSave="onCreatedBill" />
    <ModalBillDetail ref="modalBillDetailRef" title="รายละเอียดใบขอรับบริการ" :billTypes="billTypes" :data="bill"
      @onChangeBillStatus="loadData" :canChangeStatus="true" />
    <ModalBillEdit ref="modalBillEditRef" title="แก้ไขใบขอรับบริการ" :billTypes="billTypes" :data="bill" />
    <ModalCommitmentBooking ref="modalCommitmentRef" :bill="bill" @onReload="(data) => {
      loadData()
    }
      " />
    <ModalCommitmentBulkBooking :type="commitmentActionType" ref="modalCommitmentBulkRef" :bills="billSelected" @onReload="(data) => {
      loadData()
    }
      " @onComplete="(data) => {
    billSelected = []
    loadData()
  }
    " />
  </section>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Modal } from 'bootstrap'
import { useInvoiceStore } from '@/stores/invoiceStore'
import router from '@/router'
import { toast } from 'vue3-toastify'
import { useAppStore } from '@/stores/appStore'
import axios from 'axios'
import BillStatus from '@/views/bill/components/BillStatus.vue'
import JobStatus from '@/views/bill/components/JobStatus.vue'
import BillButtonStatus from '@/views/bill/components/BillButtonStatus.vue'
import JobButtonStatus from '@/views/bill/components/JobButtonStatus.vue'
import BillCode from '@/views/bill/components/BillCode.vue'
import ModalBillCreate from '@/views/bill/components/ModalBillCreate.vue'
import ModalCommitmentBooking from '@/views/bill/components/ModalCommitmentBooking.vue'
import ModalCommitmentBulkBooking from '@/views/bill/components/ModalCommitmentBulkBooking.vue'
import ModalBillDetail from '@/views/bill/components/ModalBillDetail.vue'
import ModalBillEdit from '@/views/bill/components/ModalBillEdit.vue'
import DatePicker from '@/components/DatePicker.vue'
import { useBillStore } from '@/stores/billStore'
import { myCurrency, myFormatDateTime, myFormatDate } from '@/helpers/myformat'
import { formatISO, isValid, parse, format } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'


const appStore = new useAppStore()
const billStore = new useBillStore()
const items = ref([])
const pagination = ref({
  total: 0,
  per_page: appStore.settings?.per_page,
  current_page: 1,
})
const loadingCancelCommitment = ref(false)
const loading = ref(false)
const loadingItems = ref(true)
const bill = ref({})
const billSelected = ref([])

const billTypes = ref([])

const modalBillCreateRef = ref(null)
const modalBillDetailRef = ref(null)
const modalBillEditRef = ref(null)
const modalCommitmentRef = ref(null)
const modalCommitmentBulkRef = ref(null)
const resultCancelCommitment = ref({})
const commitmentActionType = ref('BOOK')
const errorMsg = ref()
const itemsSelected = ref([])
const formSearch = ref({
  year: new Date().getFullYear(),
  code: '',
  taxnumber: '',
  q: '',
})
const documentDateRange = ref(null)
const showModalFilterOfSearch = ref(false)

const searchFormatDate = (date) => {
  return `${format(new Date(date[0]), 'dd/MM/yyyy')} - ${format(new Date(date[1]), 'dd/MM/yyyy')}`;
}

const onResetSearch = () => {
  formSearch.value.year = ""
  formSearch.value.code = ""
  formSearch.value.taxnumber = ""
  formSearch.value.q = ""
  documentDateRange.value = null
}

const invoiceStore = useInvoiceStore()

const billSelectedForCancel = computed(() => {
  return billSelected.value.filter((item) => {
    if (hasCommitmentDate(item.commitment_date)) {
      return item
    }
  })
})
const selectAll = ref(false)
const onChageSelectAll = (e) => {
  console.log('selectAll', e.target._modelValue, selectAll.value)
  if (e.target._modelValue) billSelected.value = items.value
  else billSelected.value = []
}
const hasCommitmentDate = (date) => {
  if (!date) return false
  if (String(date) === '0000-00-00 00:00:00') return false
  if (String(date) === '0000-00-00') return false
  return true
}
const loadData = async () => {
  loading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  if (documentDateRange.value) {
    params.document_date = documentDateRange.value
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
      total: data?.total || 0,
    }
    pagination.value = p
    items.value = data.data
    loading.value = false
  }
  loading.value = false
}

const onChangePage = (e, page) => {
  billSelected.value = []
  selectAll.value = false
  pagination.value.current_page = page
  loadData()
}
const getBillTypes = async () => {
  const { data } = await api.get('/v2/bills/types')
  if (data) billTypes.value = data
}

getBillTypes()

const getBillById = async (id) => {
  bill.value = {}
  try {
    const { data } = await api.get('/v2/bills/' + id)
    if (data) {
      bill.value = data
      billStore.setBill(data)
      loading.value = false
    }
    loadingItems.value = false
  } catch (error) {
    loadingItems.value = false
  }
}
const getBillByCode = async (code) => {
  bill.value = {}
  try {
    const { data } = await api.get('/v2/bills/code/' + code)
    if (data) {
      bill.value = data
      billStore.formEdit = data
      billStore.setBill(data)
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
  billStore.setBill(item)
  modalBillDetailRef.value.show()
}

const showEdit = (item) => {
  loadingItems.value = true
  errorMsg.value = ''
  itemsSelected.value = []
  bill.value = item
  bill.value.items = []
  billStore.formEdit = item
  modalBillEditRef.value.show()
}
const newBill = () => {
  modalBillCreateRef.value.show()
}

const onCreatedBill = (bill) => {
  onSearch()
  console.log(bill.data)
  showEdit(bill.data)
}
const openModalCommitment = (item) => {
  errorMsg.value = ''
  bill.value = item
  billStore.setBill(item)
  modalCommitmentRef.value.show()
}

const openModalBulkCommitmentBook = () => {
  errorMsg.value = ''
  commitmentActionType.value = 'BOOK'
  if (billSelected.value.length === 0) {
    console.log('please select a bill')
    return false
  }
  modalCommitmentBulkRef.value.show()
}
const openModalBulkCommitmentCancel = () => {
  errorMsg.value = ''
  commitmentActionType.value = 'CANCEL'
  if (billSelected.value.length === 0) {
    console.log('please select a bill')
    return false
  }
  modalCommitmentBulkRef.value.show()
}

const onSearch = async () => {
  try {
    pagination.value.current_page = 1
    await loadData()
  } catch (error) { }
}

const resetFormSearch = () => {
  formSearch.value.taxnumber = ''
  formSearch.value.q = ''
}

onSearch()

onMounted(() => {
  errorMsg.value = ''
})

const headers = [
  // { text: 'ID', value: 'id' },
  { text: 'Actions', value: 'actions', width: 100 },
  { text: 'Code', value: 'code', width: 120 },
  { text: 'ID', value: 'id' },
  { text: 'วันที่', value: 'document_date', width: 100, sortable: true },
  { text: 'นัดรับ', value: 'commitment_date', width: 110, sortable: true },

  { text: 'บริษัท/ลูกค้า', value: 'address_name' },
  { text: 'ผู้ติดต่อ', value: 'agent_name' },
  { text: 'รวมเป็นเงิน', value: 'grand_total' },
  { text: 'Bill Status', value: 'bill_status' },
]
const tableFields = [
  { label: 'เลือก', key: 'select' },
  { label: 'Actions', key: 'actions' },
  { label: 'Code', key: 'code' },
  { label: 'วันที่', key: 'document_date' },
  { label: 'นัดรับ', key: 'commitment_date' },
  { label: 'บริษัท/ลูกค้า', key: 'address_name' },
  // { label: 'ผู้ติดต่อ', key: 'agent_name' },
  { label: 'รวมเป็นเงิน', key: 'grand_total' },
  { label: 'สถานะ', key: 'bill_status' },
]

const serverOptions = ref({
  page: pagination.value.current_page,
  rowsPerPage: appStore.settings?.page_page,
})

watch(
  serverOptions,
  (data) => {
    console.log(data)
    pagination.value.current_page = data.page
      ; (pagination.value.per_page = data.rowsPerPage), (formSearch.value.sortBy = data.sortBy)
    formSearch.value.orderBy = data.sortType
    loadData()
  },
  {
    deep: true,
  },
)
</script>
<style lang="scss" scoped>
td,
th {
  font-size: 14px;
}

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
