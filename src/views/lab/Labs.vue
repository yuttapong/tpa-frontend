<template>
  <div class="pagetitle">
    <h1>Labs</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
        <li class="breadcrumb-item">ข้อมูล</li>
        <li class="breadcrumb-item active">Lab & Sub lab</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section profile">
    <spinner :visible="loading" />

    <!-- <div class="row" v-if="items">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">

            <div class="table-responsive">
              <table class="table table-sm table-striped">
                <thead>
                  <tr>
                    <th scope="col" class="fw-bold">#</th>
                    <th scope="col" class="fw-bold">ID</th>
                    <th scope="col" class="fw-bold">Code</th>
                    <th scope="col" class="fw-bold">Name</th>
                    <th scope="col" class="fw-bold">Sub labs</th>
                    <th scope="col" class="fw-bold">Conditions</th>

                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in   items  " :key="index">
                    <th scope="row">
                      <a role="button" class="btn btn-link" @click="view(item)">
                        <i class="bi bi-search"></i> </a>
                    </th>
                    <th scope="row">{{ item.id }}</th>
                    <td>
                      {{ item.code }}
                    </td>
                    <td>
                      <router-link :to="`/data/labs/${item.id}`" role="button" class="btn btn-link">
                        {{ item.name_th }} </router-link>
                      <div class="ps-2">{{ item.name }}</div>

                    </td>
                    <td>{{ item?.sublabs.length }}</td>
                    <td>
                      <small>{{ item?.conditions.length }}</small>
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="accordion" id="accordionLabs">
      <div class="accordion-item" v-for="(item, index) in    items   " :key="index">
        <h2 class="accordion-header" :id="`header${index}`">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapse${index}`"
            aria-expanded="true" :aria-controls="`collapse${index}`">
            {{ index + 1 }}) {{ item.name_th }} {{ item.name }} <span v-if="item.sublabs.length"
              class="mx-2 badge text-bg-secondary">{{
                item.sublabs.length
              }}</span>
          </button>
        </h2>
        <div :id="`collapse${index}`" class="accordion-collapse collapse" :aria-labelledby="`header${index}`"
          data-bs-parent="#accordionLabs">
          <div class="accordion-body">
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" :data-bs-target="`#t-sublab${index}`">ห้อง
                  Sublab ({{ item.sublabs.length }})</button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" :data-bs-target="`#t-condition${index}`">เงื่อนใบรับรอง ({{
                  item.conditions.length }})</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" :data-bs-target="`#t-staff${index}`">พนักงาน</button>
              </li>
            </ul>

            <div class="tab-content">
              <div class="tab-pane fade show active" :id="`t-sublab${index}`">
                <table v-if="item.sublabs" class="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Code</th>
                      <th>Lead Time</th>
                      <th>ผู้อนุม้ติใบรับรอง
                        <button type="button" class="btn btn-text" @click="loadData">
                          <i class="bi bi-arrow-clockwise"></i></button>

                      </th>
                    </tr>
                    <tr v-for="(sublab, skey) in item.sublabs" :key="skey">
                      <td valign="top">{{ skey + 1 }}</td>
                      <td valign="top">{{ sublab.id }}</td>
                      <td>{{ sublab.name_th }}<br><small>{{ sublab.name }}</small></td>
                      <td>2</td>
                      <td>
                        <span class="p-1 me-1 badge bg-dark" v-for="u in sublab.approvers" :key="u">
                          {{ u.name_th }}
                          {{ u.lastname_th }}
                          <i role="button" @click="removeSublabApprover(sublab.id, u.id)"
                            class="bi bi-trash ms-2"></i></span>
                        <button type="button" class="btn btn-sm btn-secondary" @click="showDialogStaff(sublab)"><i
                            class=" bi bi-plus"></i></button>

                      </td>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="tab-pane fade" :id="`t-staff${index}`">
                <ul v-if="item.staffs">
                  <li v-for="(staff, skey) in item.staffs" :key="skey">{{ staff }}</li>
                </ul>
              </div>
              <div class="tab-pane fade" :id="`t-condition${index}`">
                <ul v-if="item.conditions">
                  <li v-for="(c, ckey) in item.conditions" :key="ckey">{{ c.conditioname }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>



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
                    <tr v-for="   h    in    dataHistories   " :key="h">

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

    <ModalStaff ref="modalStaff" />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'

import Offcanvas from '@/components/Offcanvas.vue'
import { Modal } from 'bootstrap'
import ModalStaff from '../staff/components/ModalStaff.vue'

const row = ref({})
const items = ref([])
const sublabs = ref([])
const suppliers = ref([])
const manufactures = ref([])
const pagination = ref({})
const loading = ref(true)
const modalRef = ref(null)
const modal = ref(null)
const modalStaff = ref(null)
const dataInstrument = ref({})

const visibleDialog = ref(false)

const loadData = async () => {
  loading.value = true
  const { data, curent_page, last_page, per_page, total } = await api.get('/v2/labs/all')
  if (data) {
    const p = {
      total: total,
      page: curent_page,
      per_page: per_page,
      page_count: last_page,
    }
    pagination.value = p
    items.value = data
  }
  loading.value = false
}
const loadGroups = async () => {

  const { data, curent_page, last_page, per_page, total } = await api.get(
    '/v2/sublabs',
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
const view = (item) => {
  visibleDialog.value = true
  dataInstrument.value = {}
  dataHistories.value = []
  modal.value.show()
  console.log(item)
  dataInstrument.value = item
}

const removeSublabApprover = async (sublabId, user) => {
  console.log('removeSublabApprover', sublabId, user);
  await api.delete(`/v2/sublabs/${sublabId}/approver/${user}`)
  loadData()
}
const addSublabApprover = async (sublabId, user) => {
  console.log('addSublabApprover');
  await api.post(`/v2/sublabs/${sublabId}/approver/${user}`)
  loadData()
}
const showDialogStaff = async (sublab) => {
  // modalStaff.value.show()
  console.log(sublab, modalStaff.value);
}
const onSelectStaff = (data) => {
  console.log(data);
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
.accordion-body {
  padding: 3px;
  background-color: rgb(206, 210, 221);
}
</style>
