<template>
  <div class="pagetitle">
    <h1>เครื่องมือมาตรฐาน</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
        <li class="breadcrumb-item">ข้อมูล</li>
        <li class="breadcrumb-item active">เครื่องมือมาตรฐาน</li>
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
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-instrument">
                  เครื่องมือมาตรฐาน / Standard Instruments
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-group" @click="loadGroups">
                  หมวดหมู่ / Category
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-supplier" @click="loadSuppliers()">
                  ผู้จัดจำหน่าย / Supplier
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-manufacture"
                  @click="loadManufacturers()">
                  ผู้ผลิต / Manufacturers
                </button>
              </li>

    
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active" id="tab-instrument">
                <!-- <Offcanvas :id="canvas_intrument" v-model="visibleCanvasIntrument">
                  <template #title>
                    <h3>เครื่องมือมาตรฐาน</h3>
                  </template>
                  <template #body>
                    Content for the offcanvas goes here. You can place just about any Bootstrap
                    component or custom elements here.
                  </template>
                </Offcanvas> -->
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
                  <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasLabel">Offcanvas</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                      aria-label="Close"></button>
                  </div>
                  <div class="offcanvas-body">
                    Content for the offcanvas goes here. You can place just about any Bootstrap
                    component or custom elements here.
                  </div>
                </div>
                <!-- <a
                  class="btn btn-primary"
                  data-bs-toggle="offcanvas"
                  href="#canvas_intrument"
                  role="button"
                  aria-controls="canvas_intrument"
                >
                  Link with href
                </a> -->
                <div class="table-responsive">
                  <table class="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold">ID</th>
                        <th scope="col" class="fw-bold">Barcode</th>
                        <th scope="col" class="fw-bold">Name</th>
                        <th scope="col" class="fw-bold">Group</th>
                        <th scope="col" class="fw-bold">Location</th>
                        <th scope="col" class="fw-bold">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <th scope="row">{{ item.standardid }}</th>
                        <td>
                          <span class="p-2 badge bg-dark text-white">
                            <i class="bi bi-upc-scan"></i> {{ item.barcodeno }}
                          </span>
                        </td>
                        <td>
                          <a role="button" class="btn btn-link" @click="viewInstrument(item)">
                            {{ item.standardname }}</a>
                          <div>
                            <span class="badge bg-light text-dark mx-1 p-2">
                              SN. {{ item.serail }}</span>
                            <span class="badge bg-light text-dark mx-1 p-2">
                              Model {{ item.model }}</span>
                          </div>
                        </td>
                        <td>{{ item.group?.name }}</td>
                        <td>
                          <small>{{ item.currentlocation }}</small>
                        </td>
                        <td>
                          {{ Number(item.price) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane fade tab-category" id="tab-group">
                <!-- Small tables -->
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">ID</th>
                        <th scope="col" class="fw-bold text-decoration-underline" style="width: 100px">
                          Name
                        </th>
                        <th scope="col" class="fw-bold text-decoration-underline">Lab</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Sub Lab</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in groups" :key="index">
                        <th scope="row">{{ item.id }}</th>
                        <td>{{ item.name }}</td>
                        <td>{{ item.lab_id }}</td>
                        <td>{{ item.sublab_id }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- End small tables -->
              </div>
              <div class="tab-pane fade" id="tab-supplier">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">ID</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Code</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Name</th>

                        <th scope="col" class="fw-bold text-decoration-underline">จังหวัด</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in suppliers" :key="index">
                        <th scope="row">{{ item.id }}</th>
                        <td class="fw-bold">{{ item.suppliercode }}</td>
                        <td>{{ item.suppliername }}</td>
                        <td>{{ item.province }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane fade" id="tab-manufacture">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">ID</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Code</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Name</th>

                        <th scope="col" class="fw-bold text-decoration-underline">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in manufactures" :key="index">
                        <th scope="row">{{ item.id }}</th>
                        <td class="fw-bold">{{ item.code }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.date_starts }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">รายละเอียด <span v-if="dataInstrument">: {{
              dataInstrument.standardcode }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body ">
            <p class="fs-5">
              {{ dataInstrument.standardname }}
            </p>
            <ul class="nav nav-tabs" id="stdTab" role="tablist" v-if="dataInstrument">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="std-detail-tab" data-bs-toggle="tab" data-bs-target="#std_detail"
                  type="button" role="tab" aria-controls="detail" aria-selected="true">
                  ข้อมูล
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="std-history-tab" data-bs-toggle="tab" data-bs-target="#้std_history"
                  type="button" role="tab" aria-controls="history" aria-selected="false">
                  ประวัติการสอบเสียบ
                </button>
              </li>

            </ul>
            <div class="tab-content mt-3" id="stdTabContent">
              <div class="tab-pane fade show active" id="std_detail" role="tabpanel" aria-labelledby="detail-tab">
                <!-- #################################### -->

                <div class="p-2" v-if="dataInstrument">
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Code</div>
                    <div class="col-lg-9 col-md-8">
                      {{ dataInstrument.standardcode }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Property No.</div>
                    <div class="col-lg-9 col-md-8">
                      {{ dataInstrument.propertyno }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Name</div>
                    <div class="col-lg-9 col-md-8">
                      {{ dataInstrument.standardname }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Group</div>
                    <div class="col-lg-9 col-md-8">
                      {{ dataInstrument?.group?.name }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Serail</div>
                    <div class="col-lg-9 col-md-8">
                      {{ dataInstrument.serail }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Barcode No.</div>
                    <div class="col-lg-9 col-md-8">
                      {{ dataInstrument.barcodeno }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Buy Date</div>
                    <div class="col-lg-9 col-md-8">
                      {{ dataInstrument.buydate }}
                    </div>
                  </div>

                </div>
                <!-- #################################### -->
              </div>
              <div class="tab-pane fade" id="้std_history" role="tabpanel" aria-labelledby="history-tab">


                <div class="table-responsive">
                  <table class="table-sm table table-bordered ">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bolder text-decoration-underline" nowrap>Cert Date</th>
                        <th scope="col" class="fw-bolder text-decoration-underline" nowrap>Cert No.</th>
                        <th scope="col" class="fw-bolder text-decoration-underline">Cert No.</th>


                      </tr>
                    </thead>
                    <tbody v-if="dataHistories">
                      <tr v-for="h in dataHistories" :key="h">

                        <td nowrap>{{ h.caldate }}</td>
                        <td nowrap>{{ h.cerno }}</td>
                        <td> {{
                          h?.trace?.tracecername }}</td>


                      </tr>

                    </tbody>
                  </table>
                </div>



              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'

import Offcanvas from '@/components/Offcanvas.vue'
import { Modal } from 'bootstrap'
const row = ref({})
const items = ref([])
const groups = ref([])
const suppliers = ref([])
const manufactures = ref([])
const pagination = ref({})
const loading = ref(true)
const modalRef = ref(null)
const modal = ref(null)

const dataInstrument = ref({})

const visibleCanvasIntrument = ref(false)

const loadData = async () => {
  loading.value = true
  const { data, curent_page, last_page, per_page, total } = await api.get('/v2/stdinstruments')
  if (data) {
    const p = {
      total: total,
      page: curent_page,
      per_page: per_page,
      page_count: last_page,
    }
    pagination.value = p
    items.value = data.data
  }
  loading.value = false
}
const loadGroups = async () => {

  const { data, curent_page, last_page, per_page, total } = await api.get(
    '/v2/stdinstruments/groups',
  )
  groups.value = data
  loading.value = false
}
const loadSuppliers = async () => {

  const { data, curent_page, last_page, per_page, total } = await api.get('/v2/suppliers')
  suppliers.value = data.data
  loading.value = false
}
const loadManufacturers = async () => {

  const { data, curent_page, last_page, per_page, total } = await api.get(
    '/v2/stdinstruments/manufactures',
  )
  manufactures.value = data
  loading.value = false
}
const viewInstrument = (item) => {
  visibleCanvasIntrument.value = true
  dataInstrument.value = {}
  dataHistories.value = []
  modal.value.show()
  console.log(item)
  dataInstrument.value = item
  getInstrumentHistoryCal(item.standardid)
}

const dataHistories = ref([])

const getInstrumentHistoryCal = async (id) => {
  loading.value = true
  const { data, curent_page, last_page, per_page, total } = await api.get(
    '/v2/stdinstruments/' + id + '/histories',
  )
  dataHistories.value = data
  loading.value = false
}

onMounted(() => {
  loadData()
  modal.value = new Modal(modalRef.value)
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
