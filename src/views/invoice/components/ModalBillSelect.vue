<template>
  <div class="modal" ref="modalRef">
    <div class="modal-dialog modal-fullscreen-md-down modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}
          </h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="my-2">
            <form @submit.prevent="search()">
              <div class="d-flex gap-2">
                <div>
                  <input v-model="filterSource" type="radio" value="all" :checked="filterSource == 'all'" />
                  ทั้งหมด
                </div>
                <div v-if="customer.id">
                  <input v-model="filterSource" type="radio" class="ms-3" value="customer"
                    :checked="filterSource == 'customer'" />
                  {{ customer.name }}
                </div>

                <div>
                  <button type="submit" class="btn btn-primary btn-sm">
                    <i v-if="billLoading || invoiceStore.cartLoading" class="bi bi-home"></i>
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="text-center" v-if="billLoading">
            <spinner :visible="billLoading || invoiceStore.cartLoading" class="mx-2" />
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <h5><i class="bi bi-book"></i> ใบขอรับบริการ</h5>
              <!-- Small tables -->
              <div class="table table-responsive" style="height: 400px; overflow: scroll">
                <table class="table table-sm table-striped table-bordered">
                  <thead>
                    <tr>

                      <th scope="col" class="fw-bold">วันที่</th>
                      <th scope="col" class="fw-bold">ลูกค้า</th>
                      <th scope="col" class="fw-bold">สถานะ</th>
                      <th scope="col" class="fw-bold">Bill Code</th>
                    </tr>
                    <tr>
                      <th scope="col" class="fw-bold">
                        <input type="search" v-model="formSearchProduct.q" class="form-control form-control-sm"
                          placeholder="Customer ID" @keyup.enter="search()" />
                      </th>

                      <input type="date" v-model="formSearchProduct.document_date" class="form-control form-control-sm"
                        placeholder="วันที่" @change="search()" />
                      <th scope="col" class="fw-bold">
                        <select v-model="formSearchProduct.bill_status" class="form-control form-control-sm"
                          placeholder="สถานะ" @keyup.enter="search()" />
                      </th>
                      <th scope="col" class="fw-bold">
                        <input type="search" v-model="formSearchProduct.code" class="form-control form-control-sm"
                          placeholder="เลขที่ใบขอรับริการ" @keyup.enter="search()" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                      <td>
                        <div class="">
                          <i class="text-danger">{{ item.address_name }}</i>
                          <br />{{ item.agent_name }}
                        </div>
                        <ProductMeta :item="item" />
                      </td>

                      <td>{{ myFormatDate(item.document_date) }}</td>
                      <td>{{ item.bill_status }}<br /></td>
                      <td nowrap>
                        <button class="fw-bold btn-link btn" @click="getBill(item.id)">
                          {{ item.code }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- End small tables -->
            </div>
            <!-- ############################# STAR BILL ITEMS ################################### -->
            <div v-if="isModeBill()" class="col-12 col-md-6">
              <h5><i class="bi bi-tools"></i> เครื่องมือ
                <!-- <BBadge variant="danger" text-indicator v-if="bill.items">{{ bill.items.length }}</BBadge> -->
                <span variant="danger" text-indicator v-if="bill.items">({{ bill.items.length }})</span>
              </h5>

              <span v-if="selectedItems.length > 0"> เลือก {{ selectedItems.length }} รายการ</span>
              <div class="table table-responsive" style="height: 400px; overflow: scroll">
                <table class="table table-sm table-striped table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" class="fw-bold text-center">
                        <button type="button" @click="selectAll(bill.items)" value="All"
                          class="btn btn-outline-secondary btn-sm"><i class="bi bi-check"></i></button>
                        <button type="button" @click="clearAll()" value="Clear"
                          class="ms-1 btn btn-outline-secondary btn-sm">
                          <i class="bi bi-x"></i></button>
                      </th>

                      <th scope="col" class="fw-bold">Item Code</th>
                      <th scope="col" class="fw-bold">เครื่องมือ</th>
                      <th scope="col" class="fw-bold">จำนวนเงิน</th>
                      <th scope="col" class="fw-bold">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody v-if="workorderLoading">
                    <tr>
                      <td colspan="5">
                        <spinner :visible="workorderLoading" class="mx-2" />
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-if="!workorderLoading && bill.items">
                    <tr v-for="(item, index) in bill.items" :key="index">
                      <th class="text-center align-middle">
                        <template v-if="!existCarts(item) || item.invoice_item_id < 1">
                          <input class="form-checkbox" v-model="selectedItems" type="checkbox" :value="item" />
                        </template>
                      </th>

                      <td class="align-middle" nowrap>
                        <span class="p-1">{{ item.item_code }}</span>
                      </td>
                      <td>
                        <div class="">
                          <i class="text-danger">{{ item.product_name }}</i>
                          <br />{{ item.manufaturer_name }}
                        </div>
                        <ProductMeta :item="item" />
                      </td>
                      <td>{{ parseFloat(item.total).toLocaleString() }}</td>
                      <td>{{ item.job_status }}<br /></td>
                    </tr>
                  </tbody>
                </table>
                <!-- {{ selectedItems }} -->
                <!-- {{ invoiceStore.invoiceItems }} -->
              </div>

            </div>
            <!-- ############################# END BILL ITEMS ################################### -->

            <!-- ############################# STAR CUSTOMER DETAIL ################################### -->
            <div v-if="isModeCustomer()" class="col-12 col-md-5">
              <h5><i class="bi bi-person"></i> ลูกค้า</h5>
              <div v-if="workorderLoading">
                <spinner :visible="workorderLoading" class="mx-2" />
              </div>
              <div v-else class="border p-2 rounded">
                <div v-if="!bill.id">
                  <p class="alert alert-info">
                    <i class="bi bi-info"></i>โปรดเลือกใบขอรับบริการก่อน
                  </p>
                </div>
                <div v-else>

                  <BTableSimple hover small caption-top stacked>
                    <BTbody>
                      <BTr>
                        <BTh rowspan="3" class="text-center fw-bold text-primary">{{ bill?.address_name }}</BTh>
                        <BTh stacked-heading="Customer ID" class="text-start">{{ bill?.company_id }}</BTh>
                        <BTh stacked-heading="ลูกค้า/บริษัท" class="text-start">{{ bill.address_name }}</BTh>
                        <BTd stacked-heading="ที่อยู่">
                          <span v-if="bill.address_detail"> {{ bill.address_detail }}</span>
                          <span v-if="bill.address_province"> {{ bill.address_province }}</span>
                          <span v-if="bill.address_zipcode"> {{ bill.address_zipcode }}</span>
                        </BTd>
                        <BTd stacked-heading="เบอร์โทร">{{ bill.address_phone }}</BTd>
                        <BTd stacked-heading="ผู้ติดต่อ">{{ bill.agent_name }}</BTd>

                      </BTr>
                    </BTbody>
                  </BTableSimple>
                </div>


              </div>


            </div>
            <!-- ############################# END CUSTOMER DETAIL  ################################### -->
          </div>
        </div>
        <div class="modal-footer m-0 p-1 d-block">
          <div class="row">
            <div class="col-xs-10 col-md-7">
              <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                :on-click="onChangePage" class="" />
            </div>

            <div class="col-xs-2 col-md-5">
              <div class="d-flex gap-2 justify-content-end">
                <template v-if="isModeCustomer()">
                  <button type="button" class="btn btn-success btn-sm" @click="confirmSelectCustomer">
                    <i class="bi bi-person"></i> ดึงข้อมูลลูกค้า
                  </button></template>
                <template v-if="isModeBill()">
                  <button type="button" class="btn btn-success btn-sm" @click="confirmSelectBill">
                    <i class="bi bi-files"></i> ดึงข้อมูลเครื่องมือ
                  </button>
                </template>


                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                  <i class="bi bi-x"></i>
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <BModal v-if="bill" v-model="visibleModalConfirmCustomer" id="modal__cofirm_customer">
    <BButton @click="hide"><i class="bi bi-x"></i> ปิด</BButton>
  </BModal>
  <!-- <BModal v-if="bill.items" v-model="visibleModalConfirmBill" id="modal__cofirm_bill">
          <BButton @click="hide"><i class="bi bi-x"></i> ปิด</BButton>
        </BModal> -->
</template>
<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { differenceInDays } from 'date-fns'
import { useAppStore } from '@/stores/appStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import Spinner from '@/components/Spinner.vue'
import { myFormatDate } from '@/helpers/myformat'
import { BButton, useModal, useModalController } from 'bootstrap-vue-next'
const { confirm } = useModalController()
const { hide, modal, show } = useModal()


const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'onSelect'])
const props = defineProps({
  mode: {
    type: String,
    default: 'customer'
  },
  title: {
    type: String,
    default: 'Work Order',
  },
  customer: {
    type: Object,
    default: () => {
      return {
        id: '',
        name: '',
      }
    },
  },
})
const appStore = useAppStore()
const invoiceStore = useInvoiceStore()
let modalEl = null
let modalRef = ref(null)

const items = ref([])
const billLoading = ref(false)
const workorderLoading = ref(false)
const formSearchProduct = ref({
  bill_code: '',
  item_code: '',
  q: '',
  taxnumber: '',
  customer_id: '',
})
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const isModeCustomer = () => props.mode == 'customer'
const isModeBill = () => props.mode == 'bill'

const _show = () => {
  loadData()
  invoiceStore.loadCart()
  emit('show', selectedItems.value)
  modalEl.show()
}



const existCarts = (data) => {
  if (!invoiceStore.invoiceItems) return 0
  const find = invoiceStore.invoiceItems.filter((item) => {
    if (item.bill_items_id == data.item_id) {
      return item
    }
  })
  return Boolean(find.length)
}

const loadData = async () => {
  billLoading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearchProduct.value,
  }
  if (filterSource.value == 'customer') {
    params.customer_id = props.customer.id
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
    billLoading.value = false
  }
  billLoading.value = false
}

const bill = ref({})
const getBill = async (id) => {
  workorderLoading.value = true

  const { data } = await api.get(`/v2/bills/${id}`, {
    params: {},
  })
  if (data) {
    bill.value = data
    billLoading.value = false
    selectAll()
  }
  workorderLoading.value = false
}

const selectedItems = ref([])

let selectAll = () => {
  selectedItems.value = bill.value.items ? bill.value.items.filter(item => Number(item.invoice_item_id) < 1) : []
}

let clearAll = () => {
  selectedItems.value = []
}

let toggleSelect = function (email) {
  if (selectedEmails.has(email)) {
    selectedEmails.delete(email)
  } else {
    selectedEmails.add(email)
  }
}

const visibleModalConfirmCustomer = ref(false)
const visibleModalConfirmBill = ref(false)
const confirmSelectCustomer = async () => {

  // console.log('confirm');
  if (bill.value.company_id === undefined) return

  // visibleModalConfirmCustomer.value = true
  const value = await confirm?.({
    props: {
      title: `ยืนยันดึงข้อมูลลูกค้า รหัส # ${bill.value?.company_id} ?`,
      body: `${bill.value?.address_name}`,
      buttonSize: "sm",
      noFade: true
    },
  })
  if (value) {
    emit("onSelect", bill.value, selectedItems.value)
    modalEl.hide()
  }

  modal.show?.({
    props: {
      title: `Promise resolved to ${value}`,
      variant: 'info',

    }
  })
}
const confirmSelectBill = async () => {
  console.log('confirm');
  const value = await confirm?.({
    props: {
      title: `ยืนยันดึงข้อมูลใบขอรับเลขที่ # ${bill.value?.code} ?`,
      bodyScrolling: true,
      body: `จำนวน ${selectedItems.value.length} รายการ`
    }
  })
  if (value) {
    emit("onSelect", bill.value, selectedItems.value)
    modalEl.hide()
  }

  modal.show?.({ props: { title: `Promise resolved to ${value}`, variant: 'info' } })
}
const search = () => {
  bill.value = {}
  bill.value.items = []
  pagination.value.current_page = 1
  invoiceStore.loadCart()
  loadData()
}
const onChangePage = (page) => {
  pagination.value.current_page = page
  loadData()
}
const selectItem = (data) => {
  selectedItems.value = data
  emit('onSelect', {
    bill: bill.value,
    items: selectedItems.value
  })
  selectedItems.value = []

}
const filterSource = ref()
onMounted(() => {
  if (props.customer.id !== undefined) {
    filterSource.value = 'customer'
  } else {
    filterSource.value = 'all'
  }
  modalEl = new Modal(modalRef.value)
})
defineExpose({ show: _show })

watch(props.customer, (data) => {
  console.log('loadData', data)
  search()
})
</script>
<style lang="scss" scoped>
th,
td {
  font-size: 13px;
}

input[type=checkbox] {
  /* Double-sized Checkboxes */
  -ms-transform: scale(2);
  /* IE */
  -moz-transform: scale(2);
  /* FF */
  -webkit-transform: scale(2);
  /* Safari and Chrome */
  -o-transform: scale(2);
  /* Opera */
  transform: scale(2);
  padding: 5px;
  margin-left: 5px;
}
</style>
