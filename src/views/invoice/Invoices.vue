<script setup>
import { onMounted, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
import { Modal } from 'bootstrap'
import MyModal from '@/components/Modal.vue'
import InvoiceDetail from '@/views/invoice/components/InvoiceDetail.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

import { useInvoiceStore } from '@/stores/invoiceStore'
const row = ref({})
const items = ref({})
const appStore = useAppStore()
const invoiceStore = useInvoiceStore()
const pagination = ref({
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(true)
const modalView = ref(null)
const modalViewRef = ref(null)
const invoice = ref({})
const visibleModal = ref(false)
const route = useRoute()
route.query.noom = 2
const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})

const loadData = async () => {
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/invoices', {
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
const getInvoiceById = async (id) => {
  try {
    const { data } = await api.get('/v2/invoices/' + id)
    if (data) {
      invoice.value = data
      invoiceStore.setInvoice(data)
      loading.value = false
    }
  } catch (error) {}
}
const showDetail = (item) => {
  modalView.value.show()
  visibleModal.value = true
  getInvoiceById(item.id)
}

const onSearch = async () => {
  pagination.value.current_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) {}
}
const resetFormSearch = () => {
  formSearch.value.taxnumber = ''
  formSearch.value.q = ''
}
onMounted(() => {
  modalView.value = new Modal(modalViewRef.value)
  modalView.value.hide()
  loadData()
})
</script>
<template>
  <div>
    <div class="pagetitle">
      <h1>ใบแจ้งหนี้</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
          <li class="breadcrumb-item active">ใบแจ้งหนี้</li>
        </ol>
      </nav>
    </div>
    <!-- End Page Title -->

    <section class="section profile">
      <spinner :visible="loading" />

      <div class="row">
        <div class="col-xl-8">
          <div class="card">
            <div class="card-body pt-3"></div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card">
            <div class="card-body pt-3"></div>
          </div>
        </div>
      </div>

      <div class="row" v-if="items">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-body pt-3">
              <!-- Bordered Tabs -->
              <ul class="nav nav-tabs nav-tabs-bordered">
                <li class="nav-item">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                    ใบแจ้งหนี้
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
                  <form @submit.prevent="onSearch()">
                    <div class="row g-2">
                      <div class="col-6 col-md-4 col-lg-2">
                        <input
                          type="search"
                          v-model="formSearch.code"
                          name="code"
                          class="form-control form-control-sm"
                          placeholder="Code"
                          @keyup.enter="search"
                        />
                      </div>
                      <div class="col-6 col-md-4 col-lg-3">
                        <input
                          type="search"
                          v-model="formSearch.taxnumber"
                          name="taxnumber"
                          class="form-control form-control-sm"
                          placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                          @keyup.enter="search"
                        />
                      </div>
                      <div class="col-6 col-md-4 col-lg-3">
                        <input
                          type="search"
                          v-model="formSearch.q"
                          name="q"
                          class="form-control form-control-sm"
                          placeholder="ลูกค้า/ผู้ติดต่อ"
                          @keyup.enter="search"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-4">
                        <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />
                        <input
                          type="reset"
                          class="btn btn-secondary btn-sm mx-2"
                          value="Reset"
                          @click="resetFormSearch"
                        />
                        <router-link
                          class="btn btn-sm btn-success"
                          :to="{ name: 'invoices.create' }"
                        >
                          <i class="bi bi-plus"></i> สร้างใบแจ้งหนี้
                        </router-link>
                      </div>
                    </div>
                  </form>
                  <!-- Small tables -->
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th scope="col" class="fw-bold text-decoration-underline">#</th>
                          <th scope="col" class="fw-bold text-decoration-underline">Code</th>
                          <th scope="col" class="fw-bold text-decoration-underline">Total Net</th>
                          <th scope="col" class="fw-bold text-decoration-underline">Issue Date</th>
                          <th scope="col" class="fw-bold text-decoration-underline">Due Date</th>

                          <th scope="col" class="fw-bold text-decoration-underline">Customer</th>
                          <th scope="col" class="fw-bold text-decoration-underline">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in items" :key="index">
                          <th scope="row">{{ index + 1 }}</th>
                          <td>
                            <!-- <a
                              class="btn btn-light btn-sm fw-bold"
                              role="button"
                              @click="showDetail(item)"
                            >
                              {{ item.code }}
                            </a> -->
                            <div class="btn-group" role="group" aria-label="Basic outlined example">
                              <button
                                class="btn btn-outline-secondary btn-sm"
                                type="button"
                                :id="`button-view${item.id}`"
                                @click="showDetail(item)"
                              >
                                {{ item.code }}
                              </button>
                              <div class="btn-group" role="group">
                                <button
                                  class="btn btn-outline-secondary dropdown-toggle btn-sm"
                                  type="button"
                                  :id="`dropdownMenu${item.id}`"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                ></button>
                                <ul
                                  class="dropdown-menu"
                                  :aria-labelledby="`dropdownMenu${item.id}`"
                                >
                                  <li>
                                    <button
                                      class="dropdown-item"
                                      type="button"
                                      @click="showDetail(item)"
                                    >
                                      <i class="bi bi-search"></i>
                                      ดูรายละเอียด
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      class="dropdown-item"
                                      type="button"
                                      @click="showDetail(item)"
                                    >
                                    <i class="bi bi-file-earmark-spreadsheet"></i> ส่งออก Excel
                                    </button>
                                  </li>
                                  <li>
                                    <button class="dropdown-item" type="button">
                                      <i class="bi bi-printer"></i> พิมพ์
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </td>
                          <td>{{ parseFloat(item.totalnet).toLocaleString() }}</td>

                          <td>
                            <span class="badge bg-light text-dark">{{
                              item.issue_date ? DateTime(item.issue_date) : ''
                            }}</span>
                          </td>
                          <td>
                            <span class="badge bg-light text-dark">{{
                              item.due_date ? DateTime(item?.due_date) : ''
                            }}</span>
                          </td>

                          <td>
                            <div>{{ item.customer_name }}</div>
                            <small v-if="item.customer" class="text-danger"
                              >({{ item.customer?.taxnumber }})</small
                            >
                          </td>
                          <td>{{ item.contact_name }}</td>
                        </tr>
                      </tbody>
                      +
                    </table>
                  </div>
                  <vue-awesome-paginate
                    :total-items="pagination.total"
                    :items-per-page="pagination.per_page"
                    :max-pages-shown="appStore.settings.page.maxPageShow"
                    v-model="pagination.current_page"
                    :on-click="onChangePage"
                  />
                  <!-- End small tables -->
                </div>

                <div class="tab-pane fade pt-3 qt-detail" id="qt-detail">
                  <!--  Detail -->

                  <h5 class="card-title">About</h5>
                  <p class="small fst-italic">
                    Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus.
                    Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae
                    quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.
                  </p>

                  <h5 class="card-title">Profile Details</h5>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">รหัสพนัก</div>
                    <div class="col-lg-9 col-md-8">{{ row.code }}</div>
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
                    <div class="col-lg-9 col-md-8">
                      <span
                        class="badge bg-light text-dark mx-1"
                        v-for="(name, key) in row.permisions"
                        :key="key"
                      >
                        {{ name }}</span
                      >
                    </div>
                  </div>
                </div>

                <div class="tab-pane fade pt-3 qt-edit" id="qt-edit">
                  <!-- Profile Edit Form -->
                  <form>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"
                        >Full Name</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="fullName"
                          type="text"
                          class="form-control"
                          id="fullName"
                          value="Kevin Anderson"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="about" class="col-md-4 col-lg-3 col-form-label">About</label>
                      <div class="col-md-8 col-lg-9">
                        <textarea
                          name="about"
                          class="form-control"
                          id="about"
                          style="height: 100px"
                        >
Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea
                        >
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="company" class="col-md-4 col-lg-3 col-form-label">Company</label>
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="company"
                          type="text"
                          class="form-control"
                          id="company"
                          value="Lueilwitz, Wisoky and Leuschke"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Job" class="col-md-4 col-lg-3 col-form-label">Job</label>
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="job"
                          type="text"
                          class="form-control"
                          id="Job"
                          value="Web Designer"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Country" class="col-md-4 col-lg-3 col-form-label">Country</label>
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="country"
                          type="text"
                          class="form-control"
                          id="Country"
                          value="USA"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Address" class="col-md-4 col-lg-3 col-form-label">Address</label>
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="address"
                          type="text"
                          class="form-control"
                          id="Address"
                          value="A108 Adam Street, New York, NY 535022"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Phone" class="col-md-4 col-lg-3 col-form-label">Phone</label>
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="phone"
                          type="text"
                          class="form-control"
                          id="Phone"
                          value="(436) 486-3538 x29071"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="email"
                          type="email"
                          class="form-control"
                          id="Email"
                          value="k.anderson@example.com"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Twitter" class="col-md-4 col-lg-3 col-form-label"
                        >Twitter Profile</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="twitter"
                          type="text"
                          class="form-control"
                          id="Twitter"
                          value="https://twitter.com/#"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Facebook" class="col-md-4 col-lg-3 col-form-label"
                        >Facebook Profile</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="facebook"
                          type="text"
                          class="form-control"
                          id="Facebook"
                          value="https://facebook.com/#"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Instagram" class="col-md-4 col-lg-3 col-form-label"
                        >Instagram Profile</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="instagram"
                          type="text"
                          class="form-control"
                          id="Instagram"
                          value="https://instagram.com/#"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Linkedin" class="col-md-4 col-lg-3 col-form-label"
                        >Linkedin Profile</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="linkedin"
                          type="text"
                          class="form-control"
                          id="Linkedin"
                          value="https://linkedin.com/#"
                        />
                      </div>
                    </div>

                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
                  <!-- End Profile Edit Form -->
                </div>

                <div class="tab-pane fade pt-3 qt-settings" id="qt-settings">
                  <!-- Settings Form -->
                  <form @submit.prevent="() => {}">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"
                        >Email Notifications</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="changesMade"
                            checked
                          />
                          <label class="form-check-label" for="changesMade">
                            Changes made to your account
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="newProducts"
                            checked
                          />
                          <label class="form-check-label" for="newProducts">
                            Information on new products and services
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" id="proOffers" />
                          <label class="form-check-label" for="proOffers">
                            Marketing and promo offers
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="securityNotify"
                            checked
                            disabled
                          />
                          <label class="form-check-label" for="securityNotify">
                            Security alerts
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
                  <!-- End settings Form -->
                </div>

                <div class="tab-pane fade pt-3" id="profile-change-password">
                  <!-- Change Password Form -->
                  <form>
                    <div class="row mb-3">
                      <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label"
                        >Current Password</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="password"
                          type="password"
                          class="form-control"
                          id="currentPassword"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="newPassword" class="col-md-4 col-lg-3 col-form-label"
                        >New Password</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="newpassword"
                          type="password"
                          class="form-control"
                          id="newPassword"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label"
                        >Re-enter New Password</label
                      >
                      <div class="col-md-8 col-lg-9">
                        <input
                          name="renewpassword"
                          type="password"
                          class="form-control"
                          id="renewPassword"
                        />
                      </div>
                    </div>

                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Change Password</button>
                    </div>
                  </form>
                  <!-- End Change Password Form -->
                </div>
              </div>
              <!-- End Bordered Tabs -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <MyModal v-model:visible="visibleModal" header="xxx"></MyModal> -->

    <div class="modal" ref="modalViewRef">
      <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Invoice</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <InvoiceDetail />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="modal" ref="modalAddRef">
      <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Invoice</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

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
