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


    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <!-- Bordered Tabs -->
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  <i class="bi bi-star"></i> งาน
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-status">
                  <i class="bi bi-wifi"></i> สถานะ
                </button>
              </li>
              <!-- <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit">Edit</button>
                            </li>

                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab"
                                    data-bs-target="#qt-settings">Settings</button>
                            </li> -->
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active qt-index" id="qt-index">
                <form @submit.prevent="onSearch" class="rounded bg-light border my-2 p-2">
                  <div class="d-flex gap-2">
                    <div class="">
                      <input type="search" v-model="formSearch.item_code" class="form-control form-control-sm"
                        placeholder="Item Code" @keyup.enter="onSearch" autofocus />
                    </div>
                    <div class="">
                      <BButton size="sm" variant="light" @click="showModalFilterOfSearch = true">
                        <i class="bi bi-filter"></i>
                      </BButton>
                      <BButton :loading="loading" type="submit" variant="text" size="sm">
                        <i class="bi bi-search"></i>
                      </BButton>
                      <BButton type="reset" variant="text" size="sm" @click="onResetSearch(); onSearch()">
                        <i class="bi bi-arrow-clockwise"></i> Reset
                      </BButton>
                    </div>

                  </div>
                  <BModal v-model="showModalFilterOfSearch" title="เงือนไขการค้นหา" @cancel="onResetSearch(); onSearch();"
                    ok-title="ค้นหา" cancel-title="รีเซ็ต" @ok="onSearch()">
                    <div class="d-flex flex-wrap gap-2">

                      <div class="d-flex gap-3 flex-wrap">

                        <div class="col-6 col-md-4 col-xl-3">

                          <input type="search" v-model="formSearch.item_id" class="form-control form-control-sm"
                            placeholder="Item ID" @keyup.enter="onSearch" />
                        </div>
                        <div class="col-6 col-md-4 col-xl-3">

                          <input type="search" v-model="formSearch.item_code" class="form-control form-control-sm"
                            placeholder="Item Code" @keyup.enter="onSearch" autofocus />
                        </div>
                        <div class="col-6 col-md-4 col-xl-3">

                          <input type="search" v-model="formSearch.bill_code" class="form-control form-control-sm"
                            placeholder="Bill Code" @keyup.enter="onSearch" />
                        </div>
                        <div class="col-12 col-md-12 col-xl-12">

                          <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                            class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                            @keyup.enter="onSearch" />
                        </div>
                        <div class="col-12 col-md-6" v-if="labs">


                          <select v-model="formSearch.lab_id" class="form-select form-select-sm" @change="onSelectLab">
                            <option value="">--Lab--</option>
                            <option v-for="(item, key) in labs" :key="item.id" :value="item.id">
                              {{ item.id }} : {{ item.name_th }} - {{ item.name }} ({{
                                item.sublabs.length
                              }})
                            </option>
                          </select>
                        </div>
                        <div class="col-12 col-md-6" v-if="labs">

                          <select class="form-select form-select-sm" v-model="formSearch.sublab_id">
                            <option value="">--SubLab--</option>
                            <option v-for="(item, key) in sublabs" :key="item" :value="item.id">
                              {{ item.id }} : {{ item.code }} : {{ item.name_th }} - {{ item.name }}
                            </option>
                          </select>
                        </div>

                      </div>
                    </div>
                  </BModal>

                </form>
                <!-- Small tables -->
                <div class="my-3 p-2 bg-light text-danger" v-if="taxnumber && Number(pagination.total) > 0"></div>
                <div class="table-responsive">
                  <table class="table table-sm table-striped table-bordered">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">#</th>
                        <th scope="col" class="fw-bold text-decoration-underline">ItemID</th>
                        <th scope="col" class="fw-bold text-decoration-underline">ItemCode</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Status</th>

                        <th scope="col" class="fw-bold text-decoration-underline">สินค้า</th>
                        <th scope="col" class="fw-bold text-decoration-underline" nowrap>วันที่รับบริการ</th>
                        <th scope="col" class="fw-bold text-decoration-underline" nowrap>วันที่งานเสร็จ</th>
                        <th scope="col" class="fw-bold text-decoration-underline">ลูกค้า</th>

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
                          <JobStatus v-model="item.job_status" />
                        </td>
                        <td>
                          <div>{{ item.product_name }}</div>
                          <div>
                            <span v-if="item.id_no" class="badge bg-dark-subtle text-dark mx-2 d-inline-block"
                              style="min-width: 100px">
                              <i>IdNo.</i> {{ item.id_no }}</span>
                            <span v-if="item.model" class="badge bg-dark-subtle text-dark mx-2 d-inline-block"
                              style="min-width: 100px">
                              <i>Model.</i> {{ item.model }}</span>
                            <span v-if="item.serialnumber" class="badge bg-dark-subtle text-dark mx-2 d-inline-block"
                              style="min-width: 100px">
                              <i>S/N.</i> {{ item.serialnumber }}</span>
                          </div>
                          <div class="fw-bold text-danger mt-1">
                            <small v-if="item.current_service_status">
                              {{ item?.current_service_status?.id }} - {{ item?.current_service_status?.name }}
                            </small>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark">{{
                            item.bill ? myFormatDate(new Date(item.bill.document_date)) : ''
                          }}</span>
                        </td>
                        <td>
                          <span v-if="item.reserved_date" class="badge bg-light text-dark">{{
                            item.bill ? myFormatDate(new Date(item.reserved_date)) : ''
                          }}</span>
                        </td>

                        <td>
                          <div v-if="item.customer">{{ item.customer?.companyname }}</div>
                          <small class="text-danger mx-1">({{ item.bill?.agent_name }})</small>
                          <small class="text-dark mx-1">({{ item.customer?.taxnumber }})</small>
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>


                <BPagination v-model="pagination.current_page" :total-rows="pagination.total"
                  :per-page="pagination.per_page" size="sm" class="my-0" @page-click="onChangePage" />

                <!-- <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                  :on-click="onChangePage" class="mt-3" /> -->
                <!-- End small tables -->
              </div>

              <div class="tab-pane fade pt-3 qt-status" id="qt-status">
                <!--  Detail -->

                <div class="table-responsive">
                  <table class="table table-sm table-border">
                    <thead>
                      <tr>
                        <th>สถานะ</th>
                        <th>คำอธิบาย</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Pending</td>
                        <td>
                          <ul>
                            <li>สถานะเริ่มต้น เมื่อมีการสร้างใบขอรับบริการและสร้างงานใหม่</li>
                            <li>Admin สามารถเปลี่ยนเป็น Dispatched หรือ Canceled ได้</li>
                          </ul>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Dispatched</td>
                        <td>
                          <ul>
                            <li>
                              เมื่อมีการระบุ [วันที่ทดสอบ] และ [วันนัดรับ] จากระบบ Kanban
                              สถานะของงานจะถูกเปลี่ยนเป็น Dispatched
                            </li>
                            <li>Admin สามารถเปลี่ยนเป็น Pending หรือ Canceled ได้</li>
                            <li>Lab กดเริ่มงาน สถานะเปลี่ยนเป็น Running</li>
                          </ul>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Running</td>
                        <td>
                          <ul>
                            <li>เมื่อกดเริ่มงานเข้าห้อง Lab สถานะเปลี่ยนเป็น Running</li>
                            <li>เมื่องานเสร็จแล้ว พนักงานสามารถเปลี่ยน Completed or Held</li>
                          </ul>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Held</td>
                        <td>
                          <ul>
                            <li>
                              หากงานมีปัญหาขัดข้องหรือหยุดระหว่างดำเนินการ สามารถเปลี่ยนเป็น Held
                            </li>
                            <li>
                              งานที่อยู่ในสถานะ Held สามารถเปลี่ยนเป็น Completed or Canceled โดย
                              Admin
                            </li>
                            <li>เมื่อพนักเริ่มทำงานต่อ สามารถเปลี่ยนเป็น Running</li>
                          </ul>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Completed</td>
                        <td>
                          <ul>
                            <li>ทดสอบเครื่องมือเสร็จแล้ว สถานะเป็น Completed</li>
                            <li>
                              งานที่มีสถานะเป็น Completed ไม่สามารถเปลี่ยนสถานะเป็นอย่างอื่นได้อีก
                            </li>
                          </ul>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Canceled</td>
                        <td>
                          <ul>
                            <li>งานที่ถูกยกเลิกสถานะถูกเปลี่ยนเป็น Canceled</li>
                            <li>
                              งานที่มีสถานะเป็น Canceled ไม่สามารถเปลี่ยนสถานะเป็นอย่างอื่นได้อีก
                            </li>
                          </ul>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="tab-pane fade pt-3 qt-edit" id="qt-edit"></div>

              <div class="tab-pane fade pt-3 qt-settings" id="qt-settings"></div>
            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>
    <ModalWorderOrderDetail ref="modalWorkOrder" v-model:data="workorder" :title="workorder?.item_code" />
  </section>
</template>

<script setup>
import { onMounted, onBeforeMount, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { useAppStore } from '@/stores/appStore'
import ModalWorderOrderDetail from './components/ModalWorderOrderDetail.vue'
import { useBillStore } from '@/stores/billStore'
import JobStatus from '@/views/bill/components/JobStatus.vue'
import { myCurrency, myFormatDateTime, myFormatDate } from '@/helpers/myformat'
import { formatISO, isValid, parse, format } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

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
const showModalFilterOfSearch = ref(false)
const formSearch = ref({
  q: '',
  item_code: '',
  taxnumber: '',
  bill_code: '',
  barcode_no: '',
  lab_id: '',
})

const onResetSearch = () => {
  formSearch.value.item_id = ""
  formSearch.value.item_code = ""
  formSearch.value.taxnumber = ""
  formSearch.value.bill_code = ""
  formSearch.value.barcode_no = ""
  formSearch.value.lab_id = ""
  formSearch.value.sublab_id = ""
}
const getLabs = async () => {
  const { data } = await api.get('/v2/labs/all')
  if (data) {
    labs.value = data
  }
}

const getSublabs = (labid) => {
  formSearch.value.sublab_id = ''
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
  } else {
    items.value = []
    loading.value = false
  }
}
const onSelectLab = (e) => {
  const id = e.target.value
  getSublabs(id)
}
const onSearch = async () => {
  pagination.value.current_page = 1
  loadData()
}
const onChangePage = (e, page) => {
  pagination.value.current_page = page
  loadData()
}

const openModalWorkOrder = async (row) => {
  workorder.value = row
  modalWorkOrder.value.show()
  const { data } = await api.get('v2/workorders/' + row.item_id)
  if (data) {
    workorder.value = data
  }
}
onBeforeMount(() => {
  getLabs()
  onSearch()
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
