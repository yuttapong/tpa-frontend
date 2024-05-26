<template>
  <div class="pagetitle">
    <h1>Certificates</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
        <li class="breadcrumb-item active">Certificates</li>
      </ol>
    </nav>
  </div>

  <section class="section profile">
    <spinner :visible="loading" />

    <div class="row" v-if="items">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <ul class="nav nav-tabs nav-tabs-bordered" id="tab_certificate" role="tablist" ref="tabViewRef">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  List
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
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold">CerId</th>
                        <th scope="col" class="fw-bold">CerNo</th>
                        <th scope="col" class="fw-bold">Date</th>

                        <th scope="col" class="fw-bold">Product</th>
                        <th scope="col" class="fw-bold">Customer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <td scope="row">{{ item.cerid }}</td>
                        <td>
                          <button type="button" class="btn btn-link fw-bold" @click="viewCert(item)">
                            {{ item.cerno }}
                          </button>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark">{{ item.caldate }}</span>
                        </td>

                        <td>
                          <div>{{ item?.equipment?.product_name }}</div>
                          <small class="badge bg-warning text-dark">{{
                            item.equipment?.model
                          }}</small>
                          <div class="text-info">{{ item.lab?.name }}</div>
                        </td>
                        <td>{{ item.submitted.customer }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Tab, Modal } from 'bootstrap'
import { DateTime, Number } from '@/helpers/myformat'
import Certificate from './components/Certificate.vue'

const row = ref({})
const items = ref({})
const pagination = ref({})
const loading = ref(true)
const viewData = ref({})
const modalViewRef = ref(null)
const modalView = ref()
const tabViewRef = ref(null)
const tabView = ref(null)

const loadData = async () => {
  const { data } = await api.get('/v2/certificates')
  if (data) {
    console.log(data)
    const p = {
      total: data?.total,
      page: data?.curent_page,
      per_page: data?.per_page,
      page_count: data?.last_page
    }
    pagination.value = p
    items.value = data.data
    loading.value = false
  }
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
  loadData()
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
