<template>
  <div class="pagetitle">
    <h1>งาน ({{ parseInt(pagination.total).toLocaleString() }})</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item active">งาน</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section profile">
    <spinner :visible="loading" />

    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <!-- Bordered Tabs -->
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  List ({{ parseInt(pagination.total).toLocaleString() }})
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
                <form @submit.prevent="search" class="rounded bg-light border my-2 p-2">
                  <div class="row">
                    <div class="col-12 col-md-2">
                      <label>Tax Number</label>
                      <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                        class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                        @keyup.enter="search" />
                    </div>
                    <div class="col-12 col-md-2">
                      <label>Item ID</label>
                      <input type="search" v-model="formSearch.item_id" class="form-control form-control-sm"
                        placeholder="Item ID" @keyup.enter="search" autofocus />
                    </div>
                    <div class="col-12 col-md-2">
                      <label>Item Code</label>
                      <input type="search" v-model="formSearch.item_code" class="form-control form-control-sm"
                        placeholder="Item Code" @keyup.enter="search" autofocus />
                    </div>
                    <div class="col-12 col-md-2">
                      <label>Bill Code</label>
                      <input type="search" v-model="formSearch.bill_code" class="form-control form-control-sm"
                        placeholder="Bill Code" @keyup.enter="search" autofocus />
                    </div>
                    <div class="col-12 col-md-6" v-if="labs">
                      <label>Lab</label>

                      <select v-model="formSearch.lab_id" class="form-select form-select-sm" @change="onSelectLab">
                        <option value="">--Lab--</option>
                        <option v-for="(item, key) in labs" :key="item.id" :value="item.id">
                          {{ item.name_th }} - {{ item.name }} ({{ item.sublabs.length }})
                        </option>
                      </select>
                    </div>
                    <div class="col-12 col-md-6" v-if="labs">
                      <label>Sub Lab</label>
                      <select class="form-select form-select-sm" v-model="formSearch.sublab_id">
                        <option value="">--SubLab--</option>
                        <option v-for="(item, key) in sublabs" :key="item" :value="item.id">
                          {{ item.code }} : {{ item.name_th }} - {{ item.name }}
                        </option>
                      </select>

                    </div>
                    <div class="col-12 col-md-2 col-xxl-1">
                      <button type="submit" class="btn btn-sm btn-primary mt-2">
                        <i class="bi bi-search"></i>
                      </button>
                      <button type="reset" class="btn btn-sm btn-light mt-2 ms-2"><i class="p"></i>Reset</button>
                    </div>
                  </div>
                </form>
                <!-- Small tables -->
                <div class="my-3 p-2 bg-light text-danger" v-if="taxnumber && Number(pagination.total) > 0"></div>
                <div class="table-responsive">
                  <table class="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">#</th>
                        <th scope="col" class="fw-bold text-decoration-underline">ItemID</th>
                        <th scope="col" class="fw-bold text-decoration-underline">ItemCode</th>

                        <th scope="col" class="fw-bold text-decoration-underline">Product</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Date</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Customer</th>
                        <th scope="col" class="fw-bold text-decoration-underline">EMS Receive</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ item.item_id }}</td>
                        <td nowrap>
                          <small class="border bg-dark text-white p-1 w-full" role="button"
                            @click="openModalWorkOrder(item)">{{ item.item_code }}</small>
                        </td>
                        <td>
                          <div>{{ item.product_name }}</div>
                          <span v-if="item.id_no" class="badge bg-dark-subtle text-dark mx-2 d-inline-block"
                            style="min-width: 100px">
                            <i>IdNo.</i> {{ item.id_no }}</span>
                          <span v-if="item.model" class="badge bg-dark-subtle text-dark mx-2 d-inline-block"
                            style="min-width: 100px">
                            <i>Model.</i> {{ item.model }}</span>
                          <span v-if="item.serialnumber" class="badge bg-dark-subtle text-dark mx-2 d-inline-block"
                            style="min-width: 100px">
                            <i>S/N.</i> {{ item.serialnumber }}</span>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark">{{
                            item.bill ? MyFormatDate(new Date(item.bill.document_date)) : ''
                          }}</span>
                        </td>

                        <td>
                          <div v-if="item.customer">{{ item.customer?.companyname }}</div>
                          <small class="text-danger mx-1">({{ item.bill?.agent_name }})</small>
                          <small class="text-dark mx-1">({{ item.customer?.taxnumber }})</small>
                        </td>
                        <td>{{ item.ems_receive }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                  :on-click="onChangePage" class="mt-3" />
                <!-- End small tables -->
              </div>

              <div class="tab-pane fade pt-3 qt-detail" id="qt-detail">
                <!--  Detail -->

                <h5 class="card-title">About</h5>
                <p class="small fst-italic">
                  Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus.
                  Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam
                  autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.
                </p>

                <h5 class="card-title">Profile Details</h5>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">รหัสพนัก</div>
                  <div class="col-lg-9 col-md-8"></div>
                </div>

              </div>

              <div class="tab-pane fade pt-3 qt-edit" id="qt-edit">


              </div>

              <div class="tab-pane fade pt-3 qt-settings" id="qt-settings">

              </div>
            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>
    <WorderOrderDetail ref="modalWorkOrder" v-model:data="workorder" :title="workorder?.item_code" />
  </section>
</template>

<script setup>
import { onMounted, onBeforeMount, computed, ref } from 'vue'

import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { MyFormatDate, Number } from '@/helpers/myformat'
import { useAppStore } from '@/stores/appStore'
import WorderOrderDetail from './components/WorderOrderDetail.vue'
import { useBillStore } from '@/stores/billStore'
const appStore = useAppStore()
const modalWorkOrder = ref(null)
const workorder = ref({})
const items = ref({})

const billStore = useBillStore()
const labs = ref([])
const sublabs = ref([])
const pagination = ref({
  total: 0,
  current_page: 1,
  per_page: appStore.settings.page.perPage,
})
const loading = ref(true)

const formSearch = ref({
  q: '',
  item_code: '',
  taxnumber: '',
  bill_code: '',
  barcode_no: '',
  lab_id: "",
})
const getLabs = async () => {
  const { data } = await api.get('/v2/labs/all')
  if (data) {
    labs.value = data
  }
}

const getSublabs = (labid) => {
  formSearch.value.sublab_id = ""
  sublabs.value = []
  const x = labs.value.filter((i) => i.id == labid)
  if (x[0] != undefined) {
    sublabs.value = x[0].sublabs
  }
}
const loadData = async () => {
  loading.value = true
  let params = {
    page: pagination.value.current_page,
    per_page: pagination.value.per_page,
    ...formSearch.value,
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
}
const onSelectLab = (e) => {
  console.log(e.target.value)
  const id = e.target.value
  getSublabs(id)

}
const search = async () => {
  pagination.value.current_page = 1
  loadData()
}
const onChangePage = (page) => {
  pagination.value.current_page = page
  loadData()
}
const openModalWorkOrder = async (row) => {
  workorder.value = row
  console.log(row);
  modalWorkOrder.value.show()
  const { data } = await api.get('v2/workorders/code/' + row.item_code)
  if (data) {
    workorder.value = data
  }
}
onBeforeMount(() => {
  getLabs()
  search()
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
</style>
