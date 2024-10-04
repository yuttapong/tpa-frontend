<template>
  <div class="modal" ref="modalRef">
    <div class="modal-dialog modal-fullscreen modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="my-2">
            <form @submit.prevent="search()">
              <div class="d-flex gap-2">
                <div>
                  <input v-model="filterSource" type="radio" value="all" :checked="filterSource == 'all'"
                    @change="search()" />
                  ทั้งหมด
                </div>
                <div v-if="customer.id">
                  <input v-model="filterSource" type="radio" class="ms-3" value="customer"
                    :checked="filterSource == 'customer'" @change="search()" />
                  {{ customer.name }}
                </div>

                <div>
                  <button type="submit" class="btn btn-primary btn-sm">
                    <i v-if="billLoading || invoiceStore.cartLoading" class="bi bi-home"></i>
                    <i class="bi bi-search"></i>
                  </button>
                </div>
                <div>
                  <spinner :visible="billLoading || invoiceStore.cartLoading" class="mx-2" />
                </div>
              </div>
            </form>
          </div>

          <div class="row">
            <div class="col-12 col-md-6">
              <h5>ใบขอรับบริการ</h5>
              <!-- Small tables -->
              <div class="table table-responsive" style="height: 510px; overflow: scroll">
                <table class="table table-sm table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th scope="col" class="fw-bold">เลขที่ใบขอรับ</th>
                      <th scope="col" class="fw-bold">วันที่</th>
                      <th scope="col" class="fw-bold">ลูกค้า</th>
                      <th scope="col" class="fw-bold">สถานะ</th>
                    </tr>
                    <tr>
                      <th scope="col" class="fw-bold">
                        <input type="search" v-model="formSearchProduct.code" class="form-control form-control-sm"
                          placeholder="เลขที่ใบขอรับริการ" @keyup.enter="search()" />
                      </th>

                      <input type="date" v-model="formSearchProduct.document_date" class="form-control form-control-sm"
                        placeholder="วันที่" @change="search()" />
                      <th scope="col" class="fw-bold">
                        <input type="search" v-model="formSearchProduct.q" class="form-control form-control-sm"
                          placeholder="" @keyup.enter="search()" />
                      </th>
                      <th scope="col" class="fw-bold">
                        <select v-model="formSearchProduct.bill_status" class="form-control form-control-sm"
                          placeholder="สถานะ" @keyup.enter="search()" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                      <td nowrap>
                        <button class="fw-bold btn-link btn" @click="getBill(item.id)">
                          {{ item.code }}
                        </button>
                      </td>
                      <td>{{ myFormatDate(item.document_date) }}</td>
                      <td>
                        <div class="">
                          <i class="">{{ item.address_name }}</i>
                          <br />{{ item.agent_name }}
                        </div>
                        <ProductMeta :item="item" />
                      </td>

                      <td>{{ item.bill_status }}<br /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- End small tables -->
            </div>
            <div class="col-12 col-md-6" id="detail">
              <BAlert :model-value="!bill.id" variant="warning" dismissible><i class="bi bi-info-circle"></i>
                โปรดเลือกใบขอรับบริการ
              </BAlert>
              <BTabs :active-id="mode" small v-model="currentTab" @activate-tab="setTab" class="">
                <BTab title="ข้อมูลลูกค้า" id="customer">
                  <div class="text-center mt-2">
                    <Spinner :visible="workorderLoading" />
                  </div>

                  <BTableSimple v-if="!workorderLoading" small caption-top stacked class="mt-2">
                    <BTbody>
                      <BTr>
                        <BTd stacked-heading="เลขที่ใบขอรับบริการ">{{ bill.code }}</BTd>
                        <BTh rowspan="3" class="text-center fw-bold text-primary">{{
                          bill?.address_name
                        }}</BTh>
                        <BTh stacked-heading="Customer ID" class="text-start">{{
                          bill?.company_id
                        }}</BTh>
                        <BTh stacked-heading="ประเภทลูกค้า" class="text-start">
                          {{ bill.customer?.customer_type?.code }} :
                          {{ bill.customer?.customer_type?.name }}</BTh>
                        <BTh stacked-heading="ส่วนลูกค้า" class="text-start">
                          <div v-if="customerDiscount" class="text-danger fw-bold">
                            <span>{{ customerDiscount.discount }}</span>
                            <span v-if="customerDiscount.discount_type == 'percent'">%</span>
                            <span v-if="customerDiscount.discount_type == 'amount'">บาท</span>
                          </div>
                        </BTh>
                        <BTh stacked-heading="ลูกค้า/บริษัท" class="text-start">{{
                          bill.address_name
                        }}</BTh>
                        <BTd stacked-heading="ที่อยู่">
                          <span v-if="bill.address_detail"> {{ bill.address_detail }}</span>
                          <span v-if="bill.address_province"> {{ bill.address_province }}</span>
                          <span v-if="bill.address_zipcode"> {{ bill.address_zipcode }}</span>
                        </BTd>
                        <BTd stacked-heading="เบอร์โทร">{{ bill.address_phone }}</BTd>
                        <BTd stacked-heading="ผู้ติดต่อ">{{ bill.agent_name }}</BTd>
                        <BTd stacked-heading="ผู้ส่ง">{{ bill?.sender_name }}</BTd>
                        <BTd stacked-heading="Note ลูกค้า">{{ bill.note_customers }}</BTd>
                      </BTr>
                    </BTbody>
                  </BTableSimple>
                  <DiscountAndReword v-model:customer-id="bill.company_id" :reward="customerReward"
                    :discount="customerDiscount" :customerName="bill.address_name" />

                </BTab>
                <BTab :title="`เครื่องมือ (${bill.items ? bill.items.length : 0})`" id="product">
                  <div class="d-flex flex-row gap-2 my-2">
                    <BButton type="button" @click="selectAll(bill.items)" value="All" size="sm" variant="text"
                      class="mx-2">
                      <i class="bi bi-check"></i> เลือกทั้งหมด
                    </BButton>
                    <BButton type="button" @click="clearAll()" size="sm" variant="text">
                      <i class="bi bi-x"></i> ไม่เลือก
                    </BButton>
                  </div>

                  <div class="table table-responsive" style="height: 450px; overflow: scroll">
                    <table class="table table-sm table-striped table-bordered table-hover">
                      <thead>
                        <tr>
                          <th scope="col" class="fw-bold text-center">
                            <span v-if="selectedItems.length > 0"> {{ selectedItems.length }}</span>
                          </th>

                          <th scope="col" class="fw-bold">Item Code</th>
                          <th scope="col" class="fw-bold">เครื่องมือ</th>
                          <th scope="col" class="fw-bold">Point</th>
                          <th scope="col" class="fw-bold" nowrap>Point Price</th>
                          <th scope="col" class="fw-bold">Range</th>
                          <th scope="col" class="fw-bold" nowrap>Range Price</th>

                          <th scope="col" class="fw-bold">จำนวนเงิน</th>
                          <th scope="col" class="fw-bold">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody v-if="workorderLoading">
                        <tr>
                          <td colspan="9" align="center">
                            <spinner :visible="workorderLoading" class="mx-2" />
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-if="!workorderLoading && bill.items">
                        <tr v-for="(item, index) in bill.items" :key="index">
                          <th class="text-center align-middle">
                            <template v-if="!isExistItem(item) && item.invoice_item_id == 0">
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
                          <td class="text-right">{{ item.point }}</td>
                          <td class="text-right">
                            {{ Number(item.point_price).toLocaleString() }}
                          </td>
                          <td class="text-right">{{ item.range_value }}<br /></td>
                          <td class="text-right">
                            {{ Number(item.range_price).toLocaleString() }}
                          </td>

                          <td class="text-right">{{ Number(item.price).toLocaleString() }}</td>

                          <td>{{ item.job_status }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </BTab>
              </BTabs>
            </div>
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
                <template v-if="currentTab == 0 && mode == 'customer'">
                  <button type="button" class="btn btn-primary btn-sm" @click="confirmSelectCustomer">
                    <i class="bi bi-download"></i> ดึงข้อมูลลูกค้า
                  </button></template>
                <template v-if="currentTab == 1 && mode == 'product'">
                  <button type="button" class="btn btn-primary btn-sm" @click="confirmSelectBill">
                    <i class="bi bi-download"></i> ดึงรายการเครื่องมือ
                  </button>
                </template>
                <!-- 
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                  <i class="bi bi-x"></i>
                  ปิด
                </button> -->
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
</template>
<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import Spinner from '@/components/Spinner.vue'
import { myFormatDate } from '@/helpers/myformat'
import { BButton, useModal, useModalController } from 'bootstrap-vue-next'
import DiscountAndReword from '@/views/customer/components/DiscountAndReword.vue'
const { confirm } = useModalController()
const { hide, modal, show } = useModal()

const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'onSelectProduct', 'onSelectCustomer'])
const props = defineProps({
  mode: {
    type: String,
    default: 'customer',
  },
  title: {
    type: String,
    default: 'ดึงข้อมูลใบขอรับบริการ',
  },
  billCode: { type: String },
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
const currentTab = ref(props.mode)
const items = ref([])
const billLoading = ref(false)
const workorderLoading = ref(false)
const customerDiscount = ref()
const customerReward = ref()
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

const _show = () => {
  loadData()
  invoiceStore.loadCart()
  emit('show', selectedItems.value)
  modalEl.show()
}
const getCustomerStatistics = async (customerId) => {
  customerDiscount.value = {}
  customerReward.value = {}
  const { data } = await api.post(`v2/customers/${customerId}/statistics`)
  console.log('statistics', data)
  if (data) {
    customerDiscount.value = data.discount || {}
    customerReward.value = data.reward || {}
    return data
  }
}
const setTab = (tab) => {
  switch (tab) {
    case 0:
      emit('update:mode', 'customer')
      break
    case 1:
      emit('update:mode', 'bill')
      break
    default:
      emit('update:mode', 'customer')
      break
  }
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
  console.log('id', id)
  const { data } = await api.get(`/v2/bills/${id}`, {
    params: {},
  })
  if (data) {
    bill.value = data
    billLoading.value = false
    getCustomerStatistics(data.company_id)
  }
  workorderLoading.value = false
}
const getBillByCode = async (code) => {
  workorderLoading.value = true

  const { data, status } = await api.get(`/v2/bills/code/${code}`, {
    params: {},
  })
  if (status === 200) {
    bill.value = data
  }
  workorderLoading.value = false
}

const selectedItems = ref([])

const invoiceItems = computed(() => invoiceStore.form?.items || [])
let selectAll = () => {
  selectedItems.value = bill.value.items
    ? bill.value.items.filter((item) => !isExistItem(item) && item.invoice_item_id == 0)
    : []
}

const isExistItem = (bill) => {
  let rs = invoiceItems.value.filter(
    (item) => String(item.bill_items_code) == String(bill.item_code),
  )
  return rs.length > 0 ? true : false
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
  if (bill.value.company_id === undefined) return

  const value = await confirm?.({
    props: {
      title: `ยืนยันดึงข้อมูลลูกค้า  ?`,
      body: `ID#${bill.value?.company_id} : ${bill.value?.address_name}`,
      buttonSize: 'sm',
      noFade: false,
      okTitle: 'ตกลง',
      cancelTitle: 'ยกเลิก',
    },
  })
  if (value) {
    emit('onSelectCustomer', bill.value, selectedItems.value)
    selectedItems.value = []
    modalEl.hide()
  }
}
const confirmSelectBill = async () => {
  if (selectedItems.value.length === 0) return
  const value = await confirm?.({
    props: {
      title: `ยืนยันดึงข้อมูลใบขอรับเลขที่ # ${bill.value?.code} ?`,
      bodyScrolling: true,
      body: `จำนวน ${selectedItems.value.length} รายการ`,
      okTitle: 'ตกลง',
      cancelTitle: 'ยกเลิก',
    },
  })
  if (value) {
    emit('onSelectProduct', bill.value, selectedItems.value)
    selectedItems.value = []
    modalEl.hide()
  }
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
    items: selectedItems.value,
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
  if (props.billCode) {
    formSearchProduct.value.code = props.billCode
    getBillByCode(props.billCode)
  }
  modalEl = new Modal(modalRef.value)
})

defineExpose({ show: _show })

watch(props.customer, (data) => {
  search()
})
watch(props.billCode, (data) => {
  formSearchProduct.value.code = data
})
</script>
<style lang="scss" scoped>
.btn-close {
  font-size: 3rem;
}

th,
td {
  font-size: 13px;
}

input[type='checkbox'] {
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
