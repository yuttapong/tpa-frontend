<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Modal } from 'bootstrap'
import BillCode from '@/views/bill/components/BillCode.vue'
import InvoiceDetail from '@/views/invoice/components/InvoiceDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { invoiceStatuses } from '@/config'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { myCurrency, myFormatDate } from '@/helpers/myformat'
import InvoiceButtonActions from './components/InvoiceButtonActions.vue'
import { toast } from 'vue3-toastify'
import { fromUnixTime } from 'date-fns'
import printJS from 'print-js'
import DatePicker from '@/components/DatePicker.vue'
import InvoiceStatus from '@/views/invoice/components/InvoiceStatus.vue'

const row = ref({})
const items = ref([])
const appStore = useAppStore()
const invoiceStore = useInvoiceStore()
const pagination = ref({
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(true)
const modalView = ref(null)
const modalViewRef = ref(null)
const invoice = ref({})
const visibleModal = ref(false)
const route = useRoute()
const itemsSelected = ref([])
const router = useRouter()
route.query.noom = 2
const formSearch = ref({
  invoice_status: '',
  code: '',
  taxnumber: '',
  q: '',
})

const sortItems = [
  { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  { isActive: true, age: 45, first_name: 'Zelda', last_name: 'Macdonald' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
  { isActive: false, age: 89, first_name: 'Gary', last_name: 'Wilson' },
  { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' },
]

const sortFields = [
  { key: 'last_name', sortable: true },
  { key: 'first_name', sortable: true },
  { key: 'age', sortable: true },
  { key: 'isActive', sortable: false },
]

const headers = [
  { text: 'Action', value: 'action' },
  // { text: 'ID', value: 'id' },
  { text: 'Code', value: 'code' },
  { text: 'วันที่', value: 'issue_date' },
  { text: 'กำหนดชำระ', value: 'due_date' },
  { text: 'Total', value: 'totalnet' },
  { text: 'ผู้ติดต่อ', value: 'contact_name' },
  { text: 'บริษัท/ลูกค้า', value: 'customer_name' },
  { text: 'สถานะ', value: 'invoice_status' },
]

const tableItems = items.value
const tableFields = [
  { label: '#', key: 'index' },
  { label: 'Action', key: 'actions' },
  { label: 'code', key: 'code' },
  { label: 'สถานะ', key: 'invoice_status' },
  { label: 'วันที่', key: 'issue_date' },
  { label: 'กำหนดชำระ', key: 'due_date' },
  { label: 'Total', key: 'totalnet' },
  { label: 'ผู้ติดต่อ', key: 'contact_name' },
  { label: 'บริษัท/ลูกค้า', key: 'customer_name' },
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

const getInvoiceById = async (item) => {
  try {
    const { data } = await api.get('/v2/invoices/' + item.id)

    if (data) {
      invoice.value = data
      invoiceStore.setInvoice(data)
      loading.value = false
    }
  } catch (error) { }
}

const clickView = (item) => {
  invoice.value = item
  invoiceStore.setInvoice(item)
  modalView.value.show()
  visibleModal.value = true
  getInvoiceById(item)
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

const search = async () => {
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

  search()
}
search()
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
  // var divContents = document.getElementById("print").innerHTML;
  // var a = window.open('', '', 'height=500, width=500');
  // a.document.write('<html>');
  // a.document.write(`
  // <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  // `);
  // a.document.write('<body > <h1>Div contents are <br>');
  // a.document.write(divContents);
  // a.document.write('</body></html>');
  // a.document.close();
  // a.print();
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
      <!-- <div class="row">
        <div class="col-xl-8">
          <div class="card">
            <div class="card-body pt-3"></div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card">
            <div class="card-body pt-3">
              <button type="button" class="btn bg-secondary text-white border position-relative">
                <i class="bi bi-cart"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ invoiceStore.countCart }}
                  <span class="visually-hidden">unread messages</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div> -->

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

                <!-- <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-detail">Detail</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit">Edit</button>
                            </li>

                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab"
                                    data-bs-target="#qt-settings">Settings</button>
                            </li> -->
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

                  <form @submit.prevent="search()">
                    <div class="d-flex gap-2 flex-wrap my-2">
                      <div>
                        <router-link class="btn btn-sm btn-primary" :to="{ name: 'invoices.create' }">
                          <i class="bi bi-plus"></i> สร้างใบแจ้งหนี้
                        </router-link>
                      </div>
                      <div class="">
                        <div class="input-group">
                          <input type="search" v-model="formSearch.code" name="code" class="form-control form-control-sm"
                            placeholder="Code" @keyup.enter="search" />
                        </div>
                      </div>
                      <div class="">
                        <div class="input-group">
                          <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                            class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                            @keyup.enter="search" />
                        </div>
                      </div>
                      <div class="">
                        <DatePicker v-model="formSearch.due_date" :clearable="true" placeholder="วันที่" />
                      </div>
                      <div class="">
                        <DatePicker v-model="formSearch.due_date" :clearable="true" placeholder="กำหนดชำระ" />
                      </div>
                      <div class="">
                        <div class="input-group">
                          <input type="search" v-model="formSearch.q" name="q" class="form-control form-control-sm"
                            placeholder="ลูกค้า/ผู้ติดต่อ" @keyup.enter="search" />
                        </div>
                      </div>
                      <div>
                        <button type="submit" class="btn btn-light btn-sm">
                          <i class="bi bi-search" />
                        </button>
                      </div>
                      <div>
                        <Spinner :visible="loading" />
                      </div>
                    </div>
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
                        <!-- <RouterLink :to="`invoices/edit/${row.item.id}`">
                          <button type="button" class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-pen"></i>
                          </button>
                        </RouterLink> -->
                        <!-- <button
                          type="button"
                          class="btn btn-outline-secondary btn-sm"
                          @click="clickView(item)"
                        >
                          <i class="bi bi-pen"></i>
                        </button> -->
                        <!-- <button type="button" class="btn btn-outline-secondary btn-sm" @click="() => { }">
                          <i class="bi bi-trash"></i>
                        </button> -->
                        <InvoiceButtonActions :data="row" canEdit canCancel @clickEdit="clickEdit"
                          @clickCancel="clickCancel" />
                      </div>
                    </template>
                    <!-- <template #cell(bill_items_code)="row">
                      <div style="min-width: 140px" class="">
                        {{ row.item.bill_items_code }}
                      </div>
                    </template> -->
                    <template #cell(code)="row">
                      <div class="" style="width: 150px">
                        <BillCode :data="row.item.code" role="button" @click="clickView(row.item)" />
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
</template>

<style lang="scss" scoped></style>
