<template>
  <div class="pagetitle">
    <h1>ผู้ใช้งาน</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link  to="/">Home</router-link></li>
        <li class="breadcrumb-item active">ผู้ใช้งาน</li>
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
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  List
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-detail">
                  Detail
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit">
                  Edit
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-settings">
                  Settings
                </button>
              </li>
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active qt-index" id="qt-index">
                <div class="table-responsive">
                  <table class="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">ID</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Code</th>

                        <th scope="col" class="fw-bold text-decoration-underline">Name</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Username</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Level</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <th scope="row">{{ item.id }}</th>
                        <td>{{ item.code }}</td>

                        <td>
                          <a class="text-primary" role="button" @click="showStaff(item)">
                            {{ `${item.name_th} ${item.lastname_th}` }}<br />
                          </a>


                        </td>
                        <td>{{ item.username }}</td>
                        <td>{{ item.level }}</td>
                        <td>
                          <span class="badge bg-light text-dark">{{
                            DateTime(new Date(item.date_starts))
                          }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                    <label for="profileImage" class="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                    <div class="col-md-8 col-lg-9">
                      <img :src="avatar" alt="Profile" />
                      <div class="pt-2 btn-group">
                        <a href="#" class="btn btn-primary btn-sm" title="Upload new profile image"><i
                            class="bi bi-upload"></i></a>
                        <a href="#" class="btn btn-danger btn-sm" title="Remove my profile image"><i
                            class="bi bi-trash"></i></a>
                      </div>
                    </div>
                  </div>

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
                <form>
                  <div class="row mb-3">
                    <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Default Appcal Role</label>
                    <div class="col-md-8 col-lg-9">
                      <div class="form-check" v-for="(role, key) in kanbanRoles" :key="key">
                        <span class="bi bi-check mx-3"></span>
                        <label class="form-check-label" for="changesMade">
                          {{ role.text }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Kanban Role Level</label>
                    <div class="col-md-8 col-lg-9">
                      <div class="form-check" v-for="(role, key) in kanbanRoles" :key="key">
                        <input type="radio" name="kanban_defaultlevvel" v-model="setting.kanban_defaultLevel"
                          :value="role.value" class="mx-3" :checked="role.value == setting.kanban_defaultLevel" />
                        <label class="form-check-label" for="changesMade">
                          {{ role.text }}
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
            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>
    <!-- ######### START MODAL ############### -->
    <div class="modal fade" id="staffModal" ref="modalRef" tabindex="-1" aria-labelledby="staffModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg modal-fullscreen-xl-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staffModalLabel">Staff : {{ staff?.code }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="min-height: 350px" v-if="staff">
            <p>
              <StaffDetail :data="staff" />
            </p>
            <ul class="nav nav-tabs" id="staffTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="detail-tab" data-bs-toggle="tab" data-bs-target="#detail"
                  type="button" role="tab" aria-controls="detail" aria-selected="true">
                  รายละเอียด
                </button>
              </li>

              <li class="nav-item" role="presentation">
                <button class="nav-link" id="labs-tab" data-bs-toggle="tab" data-bs-target="#labs" type="button"
                  role="tab" aria-controls="labs" aria-selected="false">
                  ห้องแล๊ปที่รับผิดชอบ
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="roles-tab" data-bs-toggle="tab" data-bs-target="#roles" type="button"
                  role="tab" aria-controls="roles" aria-selected="false">
                  สิทธิ์การใช้งาน
                </button>
              </li>

            </ul>
            <div class="tab-content pt-3" id="myTabContent">
              <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="detail-tab">

              </div>
              <div class="tab-pane fade" id="labs" role="tabpanel" aria-labelledby="labs-tab">
                <StaffLabAssignment :labs="labs" />

              </div>
              <div class="tab-pane fade" id="roles" role="tabpanel" aria-labelledby="bill-tab">
                <StaffRoles :permissions="permissions" :roles="roles" :userPermissions="userPermissions.permisions"
                  :userRoles="userPermissions.roles" />

              </div>

            </div>
          </div>
          <div class="modal-footer">
            <spinner :visible="loading" />
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

          </div>
        </div>
      </div>
    </div>
    <!-- ###########END MODAL ########### -->
  </section>
</template>

<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
import { Modal } from 'bootstrap'
import StaffLabAssignment from './components/StaffLabAssignment.vue'
import StaffDetail from './components/StaffDetail.vue'
import StaffRoles from './components/StaffRoles.vue'
const row = ref({})
const items = ref([])
const pagination = ref({})
const modalRef = ref(null)
const modal = ref(null)
const loading = ref(true)
const staff = ref({})
const setting = ref({
  appcal_defaultRole: 'Officer',
  kanban_defaultLevel: 'officer',
})
const kanbanRoles = ref([
  { value: 'officer', text: 'Officer', level: 1 },
  { value: 'lab', text: 'Lab', level: 1 },
  { value: 'leader', text: 'Leader', level: 2 },
  { value: 'manager', text: 'Manager', level: 3 },
  { value: 'admin', text: 'Admin', level: 5 },
])
const labs = ref([]);
const roles = ref([]);
const permissions = ref([]);
const userPermissions = ref([])

const loadData = async () => {
  const { data } = await api.get('/v1/staff')
  if (data) {
    const p = {
      total: data?.total,
      page: data?.curent_page,
      per_page: data?.per_page,
      page_count: data?.last_page,
    }
    pagination.value = p
    items.value = data.result
    loading.value = false
  }
}
const fullname = computed(() =>
  row.value ? `${row.value?.name_th} ${row.value?.lastname_th}` : null,
)
const getAllRoles = async () => {
  try {
    const rs = await api.get("/v2/roles")
    roles.value = rs.data
  } catch (error) {

  }
}
const getAllPermissions = async () => {
  try {
    const rs = await api.get("/v2/roles/permissions")
    permissions.value = rs.data
  } catch (error) {

  }
}
const getUserPermissions = async (id) => {
  try {
    const rs = await api.get("/v2/roles/user/" + id)
    userPermissions.value = rs.data
  } catch (error) {

  }
}
const getLabs = async () => {
  try {
    const rs = await api.get("/v2/labs/all")
    labs.value = rs.data
  } catch (error) {

  }
}
const showStaff = (item) => {
  getAllRoles();
  getAllPermissions();
  getUserPermissions(item.id)
  getLabs()
  console.log('labs', labs.value)
  modal.value.show()

  staff.value = item
}
onMounted(() => {
  modal.value = new Modal(modalRef.value)
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
