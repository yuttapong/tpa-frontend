<template>
  <div class="modal" ref="modalRef">
    <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Work Orders</h5>

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
              <div class="row g-2">
                <div class="col-6 col-md-4 col-lg-4">
                  <input
                    type="search"
                    v-model="formSearchProduct.bill_code"
                    class="form-control form-control-sm"
                    placeholder="เลขที่ใบขอรับบริการ"
                    @keyup.enter="search()"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-4">
                  <input
                    type="search"
                    v-model="formSearchProduct.item_code"
                    class="form-control form-control-sm"
                    placeholder="เลขที่ WorderOrder"
                    @keyup.enter="search()"
                  />
                </div>
                <div class="col-6 col-md-4 col-lg-3"></div>
                <div class="col-6 col-md-4 col-lg-3">
                  <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />
                  <spinner :visible="workorderLoading" class="mx-2 p-0" />
                </div>
              </div>
            </form>
          </div>
          <!-- Small tables -->
          <div class="table table-responsive">
            <table class="table table-sm table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col" class="fw-bold">Action</th>
                  <!-- <th scope="col">#</th> -->
                  <th scope="col" class="fw-bold">Item ID</th>
                  <th scope="col" class="fw-bold">Code</th>
                  <th scope="col" class="fw-bold">Name</th>
                  <th scope="col" class="fw-bold">จำนวนเงิน</th>

                  <th scope="col" class="fw-bold">Barcode</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <th scope="row">
                    <template v-if="!existCarts(item)">
                      <button class="btn btn-secondary btn-sm d-block" type="button" @click="selectItem(item)">
                        <i class="bi bi-plus"></i>
                      </button>
                    </template>
                  </th>
                  <td>
                    <span class="">{{ item.item_id }}</span>
                  </td>
                  <td>
                    <span class="badge bg-secondary text-light">{{ item.item_code }}</span>
                  </td>
                  <td>
                    <div class="fw-bold">
                      <i class="text-danger">{{ item.manufaturer_name }}</i> {{ item.product_name }}
                    </div>
                    <ProductMeta :item="item" />
                  </td>
                  <td>{{ parseFloat(item.total).toLocaleString() }}</td>

                  <td>{{ item.barcode_no }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- End small tables -->
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
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { DateTime } from '@/helpers/myformat'
import { differenceInDays } from 'date-fns'
import { useAppStore } from '@/stores/appStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
const props = defineProps({
  title: {
    type: String,
    default: 'ยืนยันข้อมูล Commitment Date ?',
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const appStore = useAppStore()
const invoiceStore = useInvoiceStore()
let modalEl = null
let modalRef = ref(null)
const selectedItems = ref([])
const items = ref([])
const loading = ref(false)
const formSearchProduct = ref({
  bill_code: '',
  item_code: '',
  q: '',
  taxnumber: '',
})
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})


const _show = () => {
  emit('show', selectedItems.value)
  modalEl.show()
}

const existCarts = (data) => {
  if(!invoiceStore.carts) return 0
  const find = invoiceStore.carts.filter((item) => item.item_code == data.item_code)
  return Boolean(find.length)
}
const workorderLoading = ref(false)


const loadData = async () => {
  workorderLoading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearchProduct.value,
  }
  const { data } = await api.get('/v2/workorders', {
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
const search = () => {
  pagination.value.current_page = 1
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
  console.log(selectedItems.value);
}

onMounted(() => {
  modalEl = new Modal(modalRef.value)
  search()
})
defineExpose({ show: _show })
</script>
