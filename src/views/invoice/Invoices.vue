<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Modal } from 'bootstrap'
import BillCode from '@/views/bill/components/BillCode.vue'
import InvoiceDetail from '@/views/invoice/components/InvoiceDetail.vue'
import ModalBillDetail from '@/views/bill/components/ModalBillDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, } from '@/stores/appStore'
import { useBillStore } from '@/stores/billStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { invoiceStatuses } from '@/config'

import { myCurrency, myFormatDate } from '@/helpers/myformat'
import InvoiceButtonActions from './components/InvoiceButtonActions.vue'
import { toast } from 'vue3-toastify'
import { fromUnixTime } from 'date-fns'
import printJS from 'print-js'
import DatePicker from '@/components/DatePicker.vue'
import InvoiceStatus from '@/views/invoice/components/InvoiceStatus.vue'
import { formatISO, isValid, parse, format } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const row = ref({})
const bill = ref({})
const items = ref([])
const appStore = useAppStore()
const invoiceStore = useInvoiceStore()
const billStore = useBillStore()
const pagination = ref({
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(true)
const modalView = ref(null)
const modalViewRef = ref(null)
const invoice = ref({})
const visibleModal = ref(false)
const modalBill = ref(null)
const route = useRoute()
const itemsSelected = ref([])
const router = useRouter()

const formSearch = ref({
  invoice_status: '',
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

const sortItems = [
  { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  { isActive: true, age: 45, first_name: 'Zelda', last_name: 'Macdonald' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
  { isActive: false, age: 89, first_name: 'Gary', last_name: 'Wilson' },
  { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' },
]

const tableFields = [
  { label: '#', key: 'index' },
  { label: 'Action', key: 'actions' },
  { label: 'เลขที่ใบแจ้งหนี้', key: 'code' },
  { label: 'เลขที่ใบขอรับ', key: 'bill_code' },
  { label: 'วันที่', key: 'issue_date' },
  { label: 'กำหนดชำระ', key: 'due_date' },
  { label: 'จำนวนเงิน', key: 'totalnet' },
  { label: 'บริษัท/ลูกค้า', key: 'customer_name' },
  { label: 'ผู้ติดต่อ', key: 'contact_name' },
  { label: 'สถานะ', key: 'invoice_status' },
]

const serverOptions = ref({
  page: pagination.value.current_page,
  rowsPerPage: appStore.settings.page.perPage,
})
const onChangePage = (e, page) => {
  pagination.value.current_page = page
  loadData()
}
const loadData = async () => {
  loading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  if (documentDateRange.value) {
    params.issue_date = documentDateRange.value
  }
  const { data, status } = await api.get('/v2/invoices', {
    params: params,
  })
  if (status == 200) {
    const p = {
      total: data?.total,
      current_page: data?.current_page,
      per_page: data?.per_page,
      page_count: data?.last_page,
    }
    pagination.value = p
    items.value = data?.data || []
    loading.value = false
  }
}

const getInvoiceById = async (id) => {
  try {
    const { data } = await api.get('/v2/invoices/' + id)

    if (data) {
      invoice.value = data
      invoiceStore.setInvoice(data)
      loading.value = false
    }
  } catch (error) { }
}
const getBillById = async (billId) => {
  bill.value = {}
  try {
    const { data } = await api.get('/v2/bills/' + billId)

    if (data) {
      bill.value = data
    }
  } catch (error) { }
}

const clickView = (item) => {
  invoice.value = item
  invoiceStore.setInvoice(item)
  modalView.value.show()
  visibleModal.value = true
  getInvoiceById(item.id)
}

const clickViewBill = (item) => {
  bill.value = item.bill
  // getBillById(item.bill_id)
  console.log("bill", bill.value);
  billStore.setBill(item.bill)
  modalBill.value.show()
}
const clickCancel = async (row, form) => {
  console.log('cancel', form)
  const { data, status } = await api.patch(`v2/invoices/${row.item.id}/actions/cancel`, {
    id: row.item.id,
    remark: form.remark,
    status: 'canceled',
  })
  if (status == 200) {
    loadData()
    toast(`${data.message}`, {
      theme: 'auto',
      type: 'success',
      autoClose: 2000,
      dangerouslyHTMLString: true,
    })
  } else if (status == 422) {
    toast(`${data.message}`, {
      theme: 'auto',
      type: 'danger',
      autoClose: 7000,
      dangerouslyHTMLString: true,
    })
  }
}
const clickEdit = (data) => {
  // let resolvedRoute = router.resolve({
  //   name: "invoices.edit",
  //   params: { id: data.item.id }
  // });
  // window.open(resolvedRoute.href, '_blank');
  router.push({
    name: 'invoices.edit',
    params: { id: data.item.id },
  })
}

const onSearch = async () => {
  pagination.value.current_page = 1
  try {
    loadData()
  } catch (error) { }
}
const resetFormSearch = () => {
  formSearch.value.taxnumber = ''
  formSearch.value.q = ''
}
const setFilterStatus = (item) => {
  if (item === null) {
    formSearch.value.invoice_status = ''
  } else {
    formSearch.value.invoice_status = item.value
  }

  onSearch()
}
onSearch()
onMounted(() => {
  modalView.value = new Modal(modalViewRef.value)
  modalView.value.hide()
})
watch(
  serverOptions,
  (v) => {
    console.log(v)
    pagination.value.current_page = v.page
    pagination.value.per_page = v.rowsPerPage
    loadData()
  },
  { deep: false },
)

const print = () => {
  printJS({
    printable: 'print',
    type: 'html',
    header: `ใบแจ้งหนี้เลขที่ : ${invoiceStore.invoice?.code}`,
    targetStyles: ['*'],
    font: 'Sarabun',
    font_size: '13pt',
    style: `
    @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css')
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
    body { 
      color: red; 
      font-family: 'Sarabun', sans-serif,
    }`,
  })
}
</script>
<template>
  <div>
    <div class="pagetitle">
      <h1>ใบแจ้งหนี้ ({{ pagination.total }})</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
          <li class="breadcrumb-item active">ใบแจ้งหนี้</li>
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
                    ใบแจ้งหนี้
                  </button>
                </li>

              </ul>
              <div class="tab-content pt-2">
                <div class="tab-pane fade show active qt-index" id="qt-index">
                  <div class="my-2">
                    <button @click="setFilterStatus(null)" class="btn btn-sm btn-light" type="button">
                      ทั้งหมด
                    </button>
                    <button v-for="item in invoiceStatuses" :key="item" @click="setFilterStatus(item)"
                      class="btn btn-sm btn-light" type="button">
                      {{ item.text }}
                    </button>
                  </div>

                  <form @submit.prevent="onSearch()">
                    <div class="d-flex gap-2 flex-wrap my-2">
                      <div>
                        <router-link class="btn btn-sm btn-primary" :to="{ name: 'invoices.create' }">
                          <i class="bi bi-plus"></i> สร้างใบแจ้งหนี้
                        </router-link>
                      </div>
                      <div class="">
                        <div class="input-group">
                          <input type="search" v-model="formSearch.code" name="code" class="form-control form-control-sm"
                            placeholder="เลขที่ใบแจ้งหนี้" @keyup.enter="onSearch" />
                        </div>
                      </div>
                      <div class="">
                        <div class="input-group">
                          <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                            class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                            @keyup.enter="onSearch" />
                        </div>
                      </div>

                      <div class="">
                        <input type="search" v-model="formSearch.q" name="q" class="form-control form-control-sm"
                          placeholder="ลูกค้า/ผู้ติดต่อ" @keyup.enter="onSearch" />
                      </div>
                      <div class="">
                        <div class="input-group"></div>
                      </div>
                      <div>
                        <BButton size="sm" variant="light" @click="showModalFilterOfSearch = true">
                          <i class="bi bi-filter"></i>
                        </BButton>
                        <BButton type="submit" size="sm" variant="light">
                          <i class="bi bi-search"></i>
                        </BButton>
                      </div>
                      <div>
                        <Spinner :visible="loading" />
                      </div>
                    </div>
                    <!-- ############start search filter ############### -->
                    <BModal v-model="showModalFilterOfSearch" title="เงือนไขการค้นหา"
                      @cancel="onResetSearch(); onSearch();" ok-title="ค้นหา" cancel-title="รีเซ็ต" @ok="onSearch()">
                      <div class="d-flex flex-wrap gap-2">

                        <div class="">
                          <input type="search" v-model="formSearch.id" name="id" class="form-control form-control-sm"
                            placeholder="ID" @keyup.enter="onSearch" />
                        </div>

                        <div class="">
                          <input type="search" v-model="formSearch.code" name="code" class="form-control form-control-sm"
                            placeholder="เลขที่ใบแจ้งหนี้" @keyup.enter="onSearch" autofocus />
                        </div>
                        <div class="">
                          <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                            class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                            @keyup.enter="onSearch" />
                        </div>
                        <div class="">
                          <input type="search" v-model="formSearch.q" name="q" class="form-control form-control-sm"
                            placeholder="ลูกค้า/ผู้ติดต่อ" @keyup.enter="onSearch" />
                        </div>
                        <div class="">

                          <VueDatePicker v-model="documentDateRange" range locale="th" class="form-control-sm p-0"
                            placeholder="ช่วงวันที่ dd/mm/yyyy - dd/mm/yyyy" style="min-width: 353px"
                            :hide-navigation="['time']" model-type="iso" :format="searchFormatDate"
                            @change="onChangeDateRange" />
                        </div>
                      </div>

                    </BModal>
                    <!-- ############# end search filter  ############## -->
                  </form>

                  <!-- tables -->

                  <BTable :items="items" :fields="tableFields" :per-page="pagination.per_page" :responsive="true" small
                    striped>
                    <template #cell(index)="row">
                      {{ row.index + 1 }}
                    </template>

                    <template #cell(actions)="row">
                      <div class="d-flex gap-1">
                        <button type="button" class="btn btn-outline-secondary btn-sm" @click="clickView(row.item)">
                          <i class="bi bi-eye"></i>
                        </button>
                        <InvoiceButtonActions :data="row" canEdit canCancel @clickEdit="clickEdit"
                          @clickCancel="clickCancel" />
                      </div>
                    </template>

                    <template #cell(code)="row">
                      <div class="" style="min-width: 120px">

                        <BillCode :data="row.item.code" />
                      </div>
                    </template>

                    <template #cell(bill_code)="row">
                      <div class="d-block" style="min-width: 120px;">
                        <span role="button" @click="clickViewBill(row.item)" variant="text" style="font-size:12px;">{{
                          row.item.bill_code }}</span>
                      </div>
                    </template>

                    <template #cell(invoice_status)="row">
                      <div class="">
                        <InvoiceStatus v-model="row.item.invoice_status" />
                      </div>
                    </template>

                    <template #cell(issue_date)="row">
                      <div class="" style="width: 120px" v-if="row.item.issue_date">
                        {{ myFormatDate(row.item.issue_date) }}
                      </div>
                    </template>
                    <template #cell(due_date)="row">
                      <div class="" style="width: 120px" v-if="row.item.due_date">
                        {{ myFormatDate(row.item.due_date) }}
                      </div>
                    </template>
                    <template #cell(totalnet)="row">
                      <div class="" style="width: 80px">
                        {{ myCurrency(row.item.totalnet) }}
                      </div>
                    </template>

                    <template #cell(customer_name)="row">
                      <div class="">
                        {{ row.item.customer_name }}
                      </div>
                      <div class="d-flex gap-3 justify-content-start ms-2 text-secondary">
                        <small class=""> {{ row.item.contact_name }}</small>
                      </div>
                    </template>
                  </BTable>

                  <BPagination v-model="pagination.current_page" :total-rows="pagination.total"
                    :per-page="pagination.per_page" size="sm" class="my-0" @page-click="onChangePage" />

                  <!--  tables -->

                  <!-- End small tables -->
                </div>
              </div>
              <!-- End Bordered Tabs -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <MyModal v-model:visible="visibleModal" header="xxx"></MyModal> -->

    <div class="modal" ref="modalViewRef">
      <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              รายละเอียดใบแจ้งหนี้ #{{ invoiceStore.invoice.id }}
              <BButton variant="outline-text">{{ invoiceStore.invoice?.invoice_status }}</BButton>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <page class="A4" id="print">
              <InvoiceDetail @print="print()" />
            </page>
          </div>
          <div class="modal-footer d-block">
            <div class="d-flex flex-wrap gap-2 justify-content-end">
              <div v-if="invoiceStore.invoice.id !== undefined && invoiceStore.invoice.cancel_remark">
                หมายเหตุยกเลิก:
                <span class="ms-2 text-danger">
                  {{ invoiceStore.invoice?.cancel_remark }} (
                  {{ myFormatDate(fromUnixTime(invoiceStore.invoice.canceled_at)) }})</span>
              </div>
              <div>
                <button type="button" class="btn btn-secondary" @click="print()">
                  <i class="bi bi-printer"></i>
                  พิมพ์
                </button>
              </div>
              <div>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x"></i>ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalBillDetail v-model:data="bill" :v-model:billId="bill?.id" ref="modalBill" />
</template>

<style lang="scss" scoped></style>
