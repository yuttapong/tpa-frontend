<template>
  <div class="pagetitle">
    <h1>ผู้ใช้งาน</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item">ข้อมูล</li>
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
                  ผู้ใช้งาน
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-settings">
                  ตั้งค่า
                </button>
              </li>
            </ul>


            <div class="tab-content pt-2">


              <div class="tab-pane fade show active qt-index" id="qt-index">
                <StaffTable :items="items" @on-view="showStaff" />
                <vue-awesome-paginate :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                  :on-click="onChangePage" />
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
    <div class="modal" id="staffModal" ref="modalRef" tabindex="-1" aria-labelledby="staffModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-fullscreen-xl-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staffModalLabel">Staff</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="min-height: 350px">


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

                <p>
                  <StaffDetail v-model:data="staff" />
                </p>

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
import { MyFormatDate } from '@/helpers/myformat'
import { Modal } from 'bootstrap'
import StaffLabAssignment from './components/StaffLabAssignment.vue'
import StaffDetail from './components/StaffDetail.vue'
import StaffRoles from './components/StaffRoles.vue'
import { useAppStore } from '@/stores/appStore'
import StaffTable from './components/StaffTable.vue'
const row = ref({})
const items = ref([])
const modalRef = ref(null)
const modal = ref(null)
const loading = ref(true)
const staff = ref()
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
const formSearch = ref({
  q: ""
})
const labs = ref([]);
const roles = ref([]);
const permissions = ref([]);
const userPermissions = ref([])
const appStore = useAppStore()
const pagination = ref({
  total: 0,
  current_page: 1,
  last_page: 0,
  per_page: appStore.settings.page.perPage,
})

const loadData = async () => {
  let params = {
    page: pagination.value.current_page,
    per_page: pagination.value.per_page,
    ...formSearch.value
  }
  const { data } = await api.get('/v2/staffs', {
    params: params
  })
  if (data) {
    const p = {
      total: data.total,
      current_page: data.current_page,
      per_page: data.per_page,
      last_page: data.last_page,
    }
    pagination.value = p
    items.value = data.data
    loading.value = false
  }
}

const search = () => {
  pagination.value.current_page = 1;
  loadData();
}
const onChangePage = (page) => {
  pagination.value.current_page = page;
  loadData();
}

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
  modal.value.show()
  console.log("item", item);
  staff.value = item
  loading.value = false
}
onMounted(() => {
  modal.value = new Modal(modalRef.value)
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
