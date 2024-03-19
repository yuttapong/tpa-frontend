<template>
  <div class="pagetitle">
    <h1>Standard Instruments</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
        <li class="breadcrumb-item active">Standard Instruments</li>
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
                <button
                  class="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#tab-instrument"
                >
                  เครื่องมือ/Instruments
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#tab-group"
                  @click="loadGroups"
                >
                  กลุ่ม/Category
                </button>
              </li>

              <li class="nav-item">
                <button
                  class="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#tab-supplier"
                  @click="loadSuppliers()"
                >
                  ผู้จัดจำหน่าย/Supplier
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#tab-manufacture"
                  @click="loadManufacturers()"
                >
                  ผู้ผลิต/Manufacturers
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-setting">
                  Settings
                </button>
              </li>
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active" id="tab-instrument">
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
                          {{ item.standardname }}
                          <div>
                            <span class="badge bg-light text-dark mx-1 p-2">
                              SN. {{ item.serail }}</span
                            >
                            <span class="badge bg-light text-dark mx-1 p-2">
                              Model {{ item.model }}</span
                            >
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
                        <th scope="col" class="fw-bold text-decoration-underline">Name</th>

                        <th scope="col" class="fw-bold text-decoration-underline">action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in groups" :key="index">
                        <th scope="row">{{ item.id }}</th>
                        <td>{{ item.name }}</td>
                        <td></td>
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

              <div class="tab-pane fade pt-3" id="tab-detail">
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
                    <label for="profileImage" class="col-md-4 col-lg-3 col-form-label"
                      >Profile Image</label
                    >
                    <div class="col-md-8 col-lg-9">
                      <img :src="avatar" alt="Profile" />
                      <div class="pt-2 btn-group">
                        <a href="#" class="btn btn-primary btn-sm" title="Upload new profile image"
                          ><i class="bi bi-upload"></i
                        ></a>
                        <a href="#" class="btn btn-danger btn-sm" title="Remove my profile image"
                          ><i class="bi bi-trash"></i
                        ></a>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Full Name</label>
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
                      <textarea name="about" class="form-control" id="about" style="height: 100px">
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

              <div class="tab-pane fade pt-3 tab-settings" id="tab-settings">
                <!-- Settings Form -->
                <form>
                  <div class="row mb-3">
                    <label for="fullName" class="col-md-4 col-lg-3 col-form-label"
                      >Email Notifications</label
                    >
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

              <div class="tab-pane fade pt-3" id="tab-setting">
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
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
const row = ref({})
const items = ref([])
const groups = ref([])
const suppliers = ref([])
const manufactures = ref([])
const pagination = ref({})
const loading = ref(true)

const loadData = async () => {
  const { data, curent_page, last_page, per_page, total } = await api.get('/v2/stdinstruments')
  if (data) {
    const p = {
      total: total,
      page: curent_page,
      per_page: per_page,
      page_count: last_page
    }
    pagination.value = p
    items.value = data.data
  }
  loading.value = false
}
const loadGroups = async () => {
  const { data, curent_page, last_page, per_page, total } = await api.get(
    '/v2/stdinstruments/groups'
  )

  groups.value = data.data

  loading.value = false
}
const loadSuppliers = async () => {
  const { data, curent_page, last_page, per_page, total } = await api.get('/v2/suppliers')
  suppliers.value = data.data
  loading.value = false
}
const loadManufacturers = async () => {
  const { data, curent_page, last_page, per_page, total } = await api.get(
    '/v2/stdinstruments/manufactures'
  )
  console.log('manufactures', data)
  manufactures.value = data
  loading.value = false
}

const fullname = computed(() =>
  row.value ? `${row.value?.name_th} ${row.value?.lastname_th}` : null
)
onMounted(() => {
  loadData()
  loadGroups()
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
