<template>
  <div class="pagetitle">
    <h1>Cusomers</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
        <li class="breadcrumb-item active">Cusomers</li>
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
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-customer">
                  Customers
                </button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-category">
                  Customer Types
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit"></button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-settings">
                  Settings
                </button>
              </li>
            </ul>
            <div class="tab-content pt-2">
              <div class="tab-pane fade show active tab-customer" id="tab-customer">
                <CustomersTable :items="items" @show="getCustomer" />

                xx total : {{ totalCustomer }}
                <p v-if="totalCustomer">
                  <Pagination
                    v-model="customerPagination.current_page"
                    v-model:total="totalCustomer"
                    :perPage="customerPagination.per_page"
                    :pageCount="customerPagination.last_page"
                    alignment="center"
                    :onChange="onChangeCustomer"
                  />
                </p>
              </div>

              <div class="tab-pane fade pt-3 tab-category" id="tab-category">
                <table class="table table-sm table-borderless table-hover">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Code</th>
                      <th scope="col">Name</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in customerTypes" :key="index">
                      <th scope="row">{{ item.id }}</th>
                      <th scope="row">{{ item.code }}</th>
                      <td>
                        {{ item.name }}
                      </td>
                      <td>
                        {{ item.status }}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
  <div
    class="modal fade"
    id="exampleModal"
    ref="modalRef"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-fullscreen-xl-down">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Detail</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="min-height: 350px" v-if="dataCustomer">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                รายละเอียด
              </button>
            </li>

            <li class="nav-item" role="presentation">
              <button
                @click="loadBills(dataCustomer.id)"
                class="nav-link"
                id="bill-tab"
                data-bs-toggle="tab"
                data-bs-target="#bills"
                type="button"
                role="tab"
                aria-controls="bills"
                aria-selected="false"
              >
                Bills / ประวัติใช้บริการ
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                @click="loadCertificates(dataCustomer.id)"
                class="nav-link"
                id="contact-tab"
                data-bs-toggle="tab"
                data-bs-target="#certificates"
                type="button"
                role="tab"
                aria-controls="certificates"
                aria-selected="false"
              >
                Certificates / ใบรับรอง
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                @click="loadContacts(dataCustomer.id)"
                class="nav-link"
                id="contact-tab"
                data-bs-toggle="tab"
                data-bs-target="#contacts"
                type="button"
                role="tab"
                aria-controls="contacts"
                aria-selected="false"
              >
                Contacts
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#addresses"
                type="button"
                role="tab"
                aria-controls="addresss"
                aria-selected="false"
              >
                ที่อยู่
              </button>
            </li>
          </ul>
          <div class="tab-content pt-3" id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <CustomerDetail :data="dataCustomer" />
            </div>
            <div class="tab-pane fade" id="contacts" role="tabpanel" aria-labelledby="contact-tab">
              contact
            </div>
            <div class="tab-pane fade" id="bills" role="tabpanel" aria-labelledby="bill-tab">
              <CustomerBills :items="bills" />
            </div>
            <div
              class="tab-pane fade"
              id="certificates"
              role="tabpanel"
              aria-labelledby="certificate-tab"
            >
              Cert
            </div>

            <div class="tab-pane fade" id="addresses" role="tabpanel" aria-labelledby="address-tab">
              Address
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <spinner :visible="loading" />
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Send message</button>
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
import { DateTime, Number } from '@/helpers/myformat'
import { Modal } from 'bootstrap'
import CustomerDetail from '@/views/customer/components/CustomerDetail.vue'
import CustomerBills from './components/CustomerBills.vue'
import Pagination from '@/components/Pagination.vue'
import CustomersTable from './components/CustomersTable.vue'
import { Vue3BsPaginate } from 'vue3-bootstrap-paginate'

const items = ref([])
const customerTypes = ref([])
const customerPagination = ref({
  total: 0,
  current_page: 1,
  last_page: 0,
  per_page: 15,
})
const totalCustomer = ref(0)
const loading = ref(true)
const modalRef = ref(null)
const modal = ref(null)
const dataCustomer = ref({})
const bills = ref({})
const certificates = ref({})

const loadData = async () => {
  const { data } = await api.get('/v2/customers', {
    params: {
      page: customerPagination.value.current_page,
    },
  })

  if (data) {
    totalCustomer.value = data.total
    const p = {
      total: Number(data.total),
      page: data.current_page,
      per_page: data.per_page,
      last_page: data.last_page,
    }
    customerPagination.value = p
    items.value = data.data
    loading.value = false
    console.log('pagination ff', customerPagination.value)
  }
}
const loadCustomerTypes = async () => {
  const { data } = await api.get('/v2/customers/types')
  if (data) {
    customerTypes.value = data
    loading.value = false
  }
}
const loadContacts = async (id) => {
  const { data } = await api.get(`/v2/customers/${id}/contacts`)
  if (data) {
    contacts.value = data
    loading.value = false
  }
}
const loadBills = async (id) => {
  const { data } = await api.get(`/v2/customers/${id}/history/bills`)
  if (data) {
    bills.value = data.data
    loading.value = false
  }
}
const loadCertificates = async (id) => {
  const { data } = await api.get(`/v2/customers/${id}/history/certificates`)
  if (data) {
    certificates.value = data.data
    loading.value = false
  }
}
const getCustomer = async (item) => {
  console.log('show', item.id)
  modal.value.show()
  loading.value = true
  const { data } = await api.get('/v2/customers/' + item.id)
  if (data) {
    dataCustomer.value = data
    loading.value = false
  }
}

const onChangeCustomer = (page) => {
  console.log(page)
  console.log('page', page)
  customerPagination.value.current_page = page
  loadData()
}

onMounted(() => {
  loadData()
  loadCustomerTypes()
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
