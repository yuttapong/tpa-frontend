<template>
  <div class="pagetitle">
    <h1>ใบเสนอราคา ({{ parseInt(pagination.total).toLocaleString() }})</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item active">ใบเสนอราคา</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section profile">

    <div class="row" v-if="items">
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
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-detail">
                  Detail
                </button>
              </li> -->
              <!-- <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit">
                  Edit
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-settings">
                  Settings
                </button>
              </li> -->
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


                <!-- Small tables -->
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Actions</th>
                        <th scope="col">Code</th>
                        <th scope="col">Date</th>
                        <th scope="col">Price</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>
                          <div class="input-group gap-1">
                            <button type="type" class="btn btn-sm btn-outline-secondary"
                              @click="openModalQuotation(item)"><i class="bi bi-eye"></i></button>
                          </div>
                        </td>
                        <td>
                          <DocCode :data="item.code" @click="openModalQuotation(item)" role="button" />
                        </td>
                        <td>
                          <span class="badge bg-light text-dark">{{
                            myFormatDate(new Date(item.document_date))
                          }}</span>
                        </td>
                        <td>{{ Number(item.total_price).toLocaleString() }}</td>
                        <td>
                          <div>{{ item.address_name }}</div>
                          <small class="text-danger">({{ item.agent_name }})</small>
                        </td>
                        <td>
                          <StatusActive :status="item.status" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>


                <BPagination v-model="pagination.current_page" :total-rows="pagination.total"
                  :per-page="pagination.per_page" size="sm" class="my-0" @page-click="onChangePage" />

                <!-- <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                  :on-click="onChangePage" /> -->

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
                  <div class="col-lg-9 col-md-8">{{ row.code }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Full Name</div>
                  <div class="col-lg-9 col-md-8">{{ fullname }}</div>
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
                    <span class="badge bg-light text-dark mx-1" v-for="(name, key) in row.permisions" :key="key">
                      {{ name }}</span>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade pt-3 qt-edit" id="qt-edit">
                <!-- Profile Edit Form -->
                <form>
                  <div class="row mb-3">
                    <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Full Name</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="fullName" type="text" class="form-control" id="fullName" value="Kevin Anderson" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="about" class="col-md-4 col-lg-3 col-form-label">About</label>
                    <div class="col-md-8 col-lg-9">
                      <textarea name="about" class="form-control" id="about" style="height: 100px">
Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="company" class="col-md-4 col-lg-3 col-form-label">Company</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="company" type="text" class="form-control" id="company"
                        value="Lueilwitz, Wisoky and Leuschke" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Job" class="col-md-4 col-lg-3 col-form-label">Job</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="job" type="text" class="form-control" id="Job" value="Web Designer" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Country" class="col-md-4 col-lg-3 col-form-label">Country</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="country" type="text" class="form-control" id="Country" value="USA" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Address" class="col-md-4 col-lg-3 col-form-label">Address</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="address" type="text" class="form-control" id="Address"
                        value="A108 Adam Street, New York, NY 535022" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Phone" class="col-md-4 col-lg-3 col-form-label">Phone</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="phone" type="text" class="form-control" id="Phone" value="(436) 486-3538 x29071" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="email" type="email" class="form-control" id="Email" value="k.anderson@example.com" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Twitter" class="col-md-4 col-lg-3 col-form-label">Twitter Profile</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="twitter" type="text" class="form-control" id="Twitter" value="https://twitter.com/#" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Facebook" class="col-md-4 col-lg-3 col-form-label">Facebook Profile</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="facebook" type="text" class="form-control" id="Facebook"
                        value="https://facebook.com/#" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Instagram" class="col-md-4 col-lg-3 col-form-label">Instagram Profile</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="instagram" type="text" class="form-control" id="Instagram"
                        value="https://instagram.com/#" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="Linkedin" class="col-md-4 col-lg-3 col-form-label">Linkedin Profile</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="linkedin" type="text" class="form-control" id="Linkedin"
                        value="https://linkedin.com/#" />
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
                <form @submit.prevent="() => { }">
                  <div class="row mb-3">
                    <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Email Notifications</label>
                    <div class="col-md-8 col-lg-9">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="changesMade" checked />
                        <label class="form-check-label" for="changesMade">
                          Changes made to your account
                        </label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="newProducts" checked />
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
                        <input class="form-check-input" type="checkbox" id="securityNotify" checked disabled />
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
                    <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Current Password</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="password" type="password" class="form-control" id="currentPassword" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">New Password</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="newpassword" type="password" class="form-control" id="newPassword" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
                    <div class="col-md-8 col-lg-9">
                      <input name="renewpassword" type="password" class="form-control" id="renewPassword" />
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
    <ModalQuotationDetail ref="modalQuotation" :data="quotation" />
  </section>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { myFormatDate } from '@/helpers/myformat'
import { useAppStore } from '@/stores/appStore'
import ModalQuotationDetail from "@/views/quotation/components/ModalQuotationDetail.vue"
import StatusActive from "@/components/StatusActive.vue"
import DocCode from "@/components/DocCode.vue"
const appStore = useAppStore()
const row = ref({})
const items = ref({})
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loading = ref(true)
const quotation = ref({})
const modalQuotation = ref(null)

const search = () => {
  pagination.value.current_page = 1
  loadData();
}


const onChangePage = (e, page) => {
  pagination.value.current_page = page
  loadData()
}
const loadData = async () => {
  items.value = []
  loading.value = true
  let params = {
    page: pagination.value.current_page,
    per_page: pagination.value.per_page,
  }
  const { data } = await api.get('/v2/quotations', { params: params })
  if (data) {
    console.log(data)
    const p = {
      total: data?.total,
      current_page: data?.current_page,
      per_page: data?.per_page,
      page_count: data?.last_page,
    }
    pagination.value = p
    items.value = data.data
  }
  loading.value = false
}
const fullname = computed(() =>
  row.value ? `${row.value?.name_th} ${row.value?.lastname_th}` : null,
)

const openModalQuotation = async (row) => {
  quotation.value = row
  modalQuotation.value.show()
  const { data } = await api.get("v2/quotations/" + row.id)
  if (data) quotation.value = data
}
onMounted(() => {
  loadData()
})
</script>
<style lang="scss" scoped></style>
