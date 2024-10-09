<template>
  <div class="pagetitle">
    <h3>Certificates ({{ parseInt(pagination.total).toLocaleString() }})</h3>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-lin to="/">Home</router-lin></li>
        <li class="breadcrumb-item active">Certificates</li>
      </ol>
    </nav>
  </div>

  <section class="section profile">


    <div class="row" v-if="items">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <ul class="nav nav-tabs nav-tabs-bordered" id="tab_certificate" role="tablist" ref="tabViewRef">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  List ({{ parseInt(pagination.total).toLocaleString() }})
                </button>
              </li>

              <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab_cert_detail">
                  Detail
                </button>
              </li>
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active qt-index" id="qt-index">
                <form @submit.prevent="search()">
                  <div class="d-flex flex-wrap gap-2 my-2">
                    <div class="">
                      <select v-model="filterField" class="form-select form-select-sm">
                        <option value="cerno">cerno</option>
                        <option value="cerid">cerid</option>
                        <option value="bill_code">bill_code</option>
                        <option value="item_code">item_code</option>
                      </select>
                    </div>
                    <div class="">
                      <input type="search" v-model="filterValue" class="form-control form-control-sm"
                        placeholder="keyword..." @keyup.enter="search" autofocus />
                    </div>
                    <div class="">
                      <BButton type="submit" class="btn btn-light btn-sm" :loading="loading">
                        <i class="bi bi-search"></i>
                      </BButton>
                    </div>
                  </div>
                </form>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold">CerId</th>
                        <th scope="col" class="fw-bold">CerNo</th>
                        <th scope="col" class="fw-bold">Issue Date</th>
                        <th scope="col" class="fw-bold">cal Date</th>

                        <th scope="col" class="fw-bold">Product</th>
                        <th scope="col" class="fw-bold">Customer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <td scope="row">{{ item.cerid }}</td>
                        <td>
                          <button type="button" class="fw-bold border bg-dark text-white p-1 w-full d-block"
                            @click="viewCert(item)">
                            {{ item.cerno }}
                          </button>

                          <!-- <router-link :to="`/certificates/${item.cerno}`">
                            {{item.cerno}}
                          </router-link> -->
                        </td>
                        <td>
                          <span class="badge bg-light text-dark">{{
                            myFormatDate(item.issuedate)
                          }}</span>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark">{{
                            myFormatDate(item.caldate)
                          }}</span>
                        </td>

                        <td>
                          <div class="fw-bold">{{ item?.equipment?.product_name }}</div>
                          <small class="badge bg-warning text-dark">
                            <i>Model.</i> {{ item.equipment?.model }}</small>
                          <div class="ms-2">
                            <small>{{ item.lab?.name }}</small>
                          </div>
                        </td>
                        <td>{{ item.submitted.customer }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>


                <BPagination v-model="pagination.current_page" :total-rows="pagination.total"
                  :per-page="pagination.per_page" size="sm" class="my-0" @page-click="onChangePage" />
              </div>

              <div class="tab-pane fade pt-3" id="tab_cert_detail">
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
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Full Name</div>
                  <div class="col-lg-9 col-md-8"></div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Company</div>
                  <div class="col-lg-9 col-md-8">Lueilwitz, Wisoky and Leuschke</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Job</div>
                  <div class="col-lg-9 col-md-8">Web Designer</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Country</div>
                  <div class="col-lg-9 col-md-8">USA</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Address</div>
                  <div class="col-lg-9 col-md-8">A108 Adam Street, New York, NY 535022</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Phone</div>
                  <div class="col-lg-9 col-md-8">(436) 486-3538 x29071</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Email</div>
                  <div class="col-lg-9 col-md-8">k.anderson@example.com</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Permissions</div>
                  <div class="col-lg-9 col-md-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="modal" ref="modalViewRef">
    <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Certificate</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Certificate v-model:data="viewData" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'

import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Tab, Modal } from 'bootstrap'
import Certificate from './components/Certificate.vue'
import { useAppStore } from '@/stores/appStore'
import { myFormatDate } from '@/helpers/myformat'

const row = ref({})
const appStore = useAppStore()
const items = ref({})
const pagination = ref({
  current_page: 1,
  total: 0,
  per_page: appStore.settings.page.perPage,
})
const loading = ref(true)
const viewData = ref({})
const modalViewRef = ref(null)
const modalView = ref()
const tabViewRef = ref(null)
const filterField = ref('cerno')
const filterValue = ref('')
const formSearch = ref({
  q: '',
})
const loadData = async () => {
  items.value = []
  loading.value = true
  let params = {
    page: pagination.value.current_page,
    per_page: pagination.value.per_page,
  }
  if (filterField.value) {
    params[filterField.value] = filterValue.value
  }

  const { data } = await api.get('/v2/certificates', {
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

const search = () => {
  pagination.value.current_page = 1
  loadData()
}
const onChangePage = (e, page) => {
  console.log(page);
  pagination.value.current_page = page
  loadData()
}

const viewCert = async (item) => {
  viewData.value = {}
  modalView.value.show()
  const { data } = await api.get('/v2/certificates/code/' + item.cerno)

  viewData.value = data
}
onMounted(() => {
  modalView.value = new Modal(modalViewRef.value)
  modalView.value.hide()
  // tabView.value = new Tab("#tab_cert_detail")
  // tabView.value.show()
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
