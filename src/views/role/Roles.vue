<template>
  <div class="pagetitle">
    <h1>Roles & Permissions</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
        <li class="breadcrumb-item">Settings</li>
        <li class="breadcrumb-item active">Roles & Permissions</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section profile">
    <spinner :visible="loading" />

    <div class="row" v-if="roles">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <!-- Bordered Tabs -->
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-role">
                  บทบาท
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-permission">
                  การอนุญาต
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-user">
                  ผู้ใช้งาน
                </button>
              </li>
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active qt-role" id="qt-role">
                <form @submit.prevent="onSearch()">
                  <div class="d-flex flex-wrap gap-2">
                    <div>
                      <BButton variant="primary" @click="addRole($event)" size="sm"
                        ><i class="bi bi-plus"></i
                      ></BButton>
                    </div>
                    <div class="">
                      <input
                        type="search"
                        v-model="formSearch.q"
                        class="form-control form-control-sm"
                        placeholder="keyword.."
                      />
                    </div>
                    <div class="">
                      <BButton type="submit" size="sm"><i class="bi bi-search"></i></BButton>
                    </div>
                  </div>
                </form>

                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th scope="col">Actions</th>
                      <th scope="col">ID</th>
                      <th scope="col">ชื่อ</th>
                      <th scope="col">ชื่อแสดง</th>

                      <th scope="col">รายละเอียด</th>
                      <th scope="col">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in roles" :key="index">
                      <th scope="row">
                        <BButton
                          variant="outline-secondary"
                          @click="editRole(item, index, $event)"
                          size="sm"
                          ><i class="bi bi-pencil"></i
                        ></BButton>
                      </th>
                      <th scope="row">{{ item.id }}</th>
                      <td>
                        <a role="button" @click="editRole(item, index, $event)"
                          ><i class="bi bi-person me-2"></i>{{ item.name }}</a
                        >
                      </td>
                      <td>
                        {{ item.display_name }}
                      </td>
                      <td>
                        {{ item.description }}
                      </td>
                      <td>
                        {{ item.status }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- End small tables -->
              </div>

              <div class="tab-pane fade qt-permission" id="qt-permission">
                <form @submit.prevent="loadPermissions()">
                  <div class="d-flex flex-wrap gap-2">
                    <div>
                      <BButton @click="addPermission" variant="primary" size="sm"
                        ><i class="bi bi-plus"></i
                      ></BButton>
                    </div>
                    <div class="">
                      <input
                        type="search"
                        v-model="formSearch.q"
                        class="form-control form-control-sm"
                        placeholder=""
                        @keyup.enter="loadPermissions"
                      />
                    </div>
                    <div class="">
                      <BButton type="submit" size="sm"><i class="bi bi-search"></i></BButton>
                    </div>
                  </div>
                </form>
                <div class="dropdown">
                  <button
                    class="btn btn-link dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Type
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" @click="filterType('all')">ทั้งหมด</a></li>
                    <li v-for="(t, key) in permisstionType" :key="key">
                      <a role="button" class="dropdown-item" @click="filterType(t)">{{ t.text }}</a>
                    </li>
                  </ul>
                </div>
                {{ permisstionSelected }}
                <div class="table-resonsive">
                  <table class="table table-sm table-hover table-bordered">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">Actions</th>

                        <th scope="col" class="fw-bold text-decoration-underline">ชื่อ</th>
                        <th scope="col" class="fw-bold text-decoration-underline">ชื่อ</th>

                        <th scope="col" class="fw-bold text-decoration-underline">ชื่อแสดง</th>
                        <th scope="col" class="fw-bold text-decoration-underline">รายละเอียด</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Tags</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in permissions" :key="index">
                        <th scope="row">
                          <BButton
                            variant="outline-secondary"
                            @click="editPermission(item, index, $event)"
                            size="sm"
                            ><i class="bi bi-pencil"></i
                          ></BButton>
                        </th>

                        <!-- <td>
                          <input
                            type="checkbox"
                            name="permisstionSelected[]"
                            v-model="permisstionSelected"
                            class="form-check-input"
                            :id="`p__${item.id}`"
                            :value="item.name"
                          />
                        </td> -->
                        <td>
                          <a role="button" @click="editPermission(item, index, $event)"
                            ><i class="bi bi-lock me-2"></i>{{ item.name }}</a
                          >
                        </td>
                        <td>
                          {{ item.display_name }}
                        </td>
                        <td>
                          {{ item.description }}
                        </td>
                        <td>
                          <span
                            class="badge rounded-pill bg-secondary text-light mx-1 fw-normal"
                            v-for="t in permisstionType"
                            :key="t"
                            >{{ t.text }}</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="tab-pane fade pt-3 qt-edit" id="qt-edit">
                <!-- Profile Edit Form -->
                <form>
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

              <div class="tab-pane fade pt-3 qt-settings" id="qt-settings">
                <!-- Settings Form -->
                <form @submit.prevent="() => {}">
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
  <RoleForm
    v-model:visible="visibleModalRole"
    v-model:data="viewRoleData"
    @onUpdated="onUpdatedRole"
    @onCreated="onCreatedRole"
  />
  <PermissionForm
    v-model:visible="visibleModalPermission"
    v-model:data="viewPermissionData"
    @onUpdated="onUpdatedPermission"
    @onCreated="onCreatedPermission"
  />
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import RoleForm from '@/views/role/components/RoleForm.vue'
import PermissionForm from '@/views/role/components/PermissionForm.vue'
const row = ref({})
const roles = ref([])
const permisstionType = ref([
  {
    value: 'appcal',
    text: 'Appcal',
  },
  {
    value: 'kanban',
    text: 'Kanban',
  },
  {
    value: 'certificate',
    text: 'Certificate',
  },
])
const visibleModalRole = ref(false)
const visibleModalPermission = ref(false)

const viewRoleData = ref({})
const viewRoleIndex = ref(0)
const viewPermissionData = ref({})
const viewPermissionIndex = ref(0)
const permissions = ref([])
const permisstionSelected = ref([])
const loading = ref(true)
const formSearch = ref({
  q: '',
})

const loadRoles = async () => {
  const { data } = await api.get('/v2/roles')
  if (data) {
    roles.value = data
  }
  loading.value = false
}
const loadPermissions = async () => {
  loading.value = true
  const { data } = await api.get('/v2/permissions')
  if (data) {
    permissions.value = data
  }
  loading.value = false
}
const filterType = (item) => {
  console.log(item)
}
const onSearch = () => {
  loadRoles()
}
onMounted(() => {
  loadRoles()
  loadPermissions()
})

const addRole = () => {
  viewRoleData.value = { id: 0 }
  visibleModalRole.value = true
}
const editRole = (row, index, e) => {
  viewRoleData.value = row
  viewRoleIndex.value = index
  visibleModalRole.value = true
}
const addPermission = () => {
  viewPermissionData.value = { id: 0 }
  visibleModalPermission.value = true
}
const editPermission = (row, index, e) => {
  viewPermissionData.value = row
  viewPermissionIndex.value = index
  visibleModalPermission.value = true
}
const onUpdatedRole = (data) => {
  roles.value[viewRoleIndex.value] = data
}
const onCreatedRole = (data) => {
  loadRoles()
}
const onUpdatedPermission = (data) => {
  permissions.value[viewPermissionIndex.value] = data
}
const onCreatedPermission = (data) => {
  loadPermissions()
}
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
