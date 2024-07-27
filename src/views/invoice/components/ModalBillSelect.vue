<template>
  <div class="modal" ref="modalRef">
    <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-if="props.customer">
            {{ props.customer.id }}#
            {{ props.customer.name }}
          </h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="my-2">
            <form @submit.prevent="search()">
              <div class="d-flex gap-2">
                <div>
                  <input
                    v-model="filterSource"
                    type="radio"
                    value="all"
                    :checked="filterSource == 'all'"
                  />
                  ทั้งหมด
                </div>
                <div>
                  <input
                    v-model="filterSource"
                    type="radio"
                    class="ms-3"
                    value="customer"
                    :checked="filterSource == 'customer'"
                  />
                  {{ customer.name }}
                </div>

                <div>
                  <button type="submit" class="btn btn-primary btn-sm">
                    <i v-if="workorderLoading || invoiceStore.cartLoading" class="bi bi-home"></i>
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="text-center" v-if="workorderLoading">
            <spinner :visible="workorderLoading || invoiceStore.cartLoading" class="mx-2" />
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <!-- Small tables -->
              <div class="table table-responsive" style="height: 400px; overflow: scroll">
                <table class="table table-sm table-striped table-bordered">
                  <thead>
                    <tr>
                  

                      <th scope="col" class="fw-bold">ลูกค้า</th>

                      <th scope="col" class="fw-bold">วันที่</th>
                      <th scope="col" class="fw-bold">สถานะ</th>
                      <th scope="col" class="fw-bold">Bill Code</th>
                    </tr>
                    <tr>
                      <th scope="col" class="fw-bold"></th>
                      <!-- <th scope="col">#</th> -->
                      <th scope="col" class="fw-bold">
                        <input
                          type="search"
                          v-model="formSearchProduct.customer_id"
                          class="form-control form-control-sm"
                          placeholder="Customer ID"
                          @keyup.enter="search()"
                        />
                      </th>
                      <th scope="col" class="fw-bold">
                        <input
                          type="search"
                          v-model="formSearchProduct.bill_code"
                          class="form-control form-control-sm"
                          placeholder="เลขที่ใบขอรับบริการ"
                          @keyup.enter="search()"
                        />
                      </th>
                      <th scope="col" class="fw-bold">
                        <input
                          type="search"
                          v-model="formSearchProduct.q"
                          class="form-control form-control-sm"
                          placeholder="ชื่อลูกค้า"
                          @keyup.enter="search()"
                        />
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
            <div class="col-12 col-md-6">
              <!-- Small tables -->
              <div class="table table-responsive" style="height: 400px; overflow: scroll">
                <table class="table table-sm table-striped table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" class="fw-bold">Actions</th>

                      <th scope="col" class="fw-bold">Item Code</th>
                      <th scope="col" class="fw-bold">จำนวนเงิน</th>
                      <th scope="col" class="fw-bold">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody v-if="bill.items">
                    <tr v-for="(item, index) in bill.items" :key="index">
                      <th scope="row">
                        <template v-if="!existCarts(item)">
                          <input class="form-checkbox" type="checkbox" @click="selectItem(item)" />
                        </template>
                      </th>

                      <td>
                        <span class="badge bg-secondary text-light p-2">{{ item.item_code }}</span>
                      </td>
                      <td>
                        <div class="">
                          <i class="text-danger">{{ item.product_name }}</i>
                          <br />{{ item.manufaturer_name }}
                        </div>
                        <ProductMeta :item="item" />
                      </td>
                      <td>{{ parseFloat(item.price).toLocaleString() }}</td>
                      <td>{{ item.job_status }}<br /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- End small tables -->
            </div>
          </div>
        </div>
        <div class="modal-footer m-0 p-1 d-block">
          <div class="row">
            <div class="col-xs-10 col-md-10">
              <vue-awesome-paginate
                :total-items="pagination.total"
                :items-per-page="pagination.per_page"
                :max-pages-shown="appStore.settings.page.maxPageShow"
                v-model="pagination.current_page"
                :on-click="onChangePage"
                class=""
              />
            </div>

            <div class="col-xs-2 col-md-2">
              <button type="button" class="btn btn-secondary float-end" data-bs-dismiss="modal">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { differenceInDays } from 'date-fns'
import { useAppStore } from '@/stores/appStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import Spinner from '@/components/Spinner.vue'
import { myFormatDate } from '@/helpers/myformat'

const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
const props = defineProps({
  title: {
    type: String,
    default: 'Work Order',
  },
  data: {
    type: Object,
    default: () => {},
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
const selectedItems = ref([])
const items = ref([])
const loading = ref(false)
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
  workorderLoading.value = true
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
    loading.value = false
  }
  workorderLoading.value = false
}
const bill = ref({})
const getBill = async (id) => {
  workorderLoading.value = true

  const { data } = await api.get(`/v2/bills/${id}`, {
    params: {},
  })
  if (data) {
    bill.value = data
    loading.value = false
  }
  workorderLoading.value = false
}
const search = () => {
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
  emit('select', selectedItems.value)
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
  search()
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
</style>
