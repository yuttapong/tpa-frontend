<template>
  <div>
    <div class="modal" ref="modalElement">
      <div class="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-toolbar">ลูกค้า ({{ pagination.total.toLocaleString() }})</div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-2">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <form @submit.prevent="searchCustomer()">
                  <div class="d-flex gap-2">
                    <div>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm ms-1"
                        @click="addCustomer()"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                    <div class="">
                      <input
                        type="search"
                        v-model="formSearch.q"
                        class="form-control form-control-sm"
                        placeholder="ชื่อบริษัท"
                        autofocus
                        @keyup.enter="searchCustomer()"
                      />
                    </div>
                    <div class="">
                      <input
                        type="search"
                        v-model="formSearch.taxnumber"
                        class="form-control form-control-sm"
                        placeholder="taxnumber"
                        @keyup.enter="searchCustomer()"
                      />
                    </div>

                    <div class="">
                      <button type="submit" class="btn btn-light btn-sm" :disabled="loading">
                        <i class="bi bi-search"></i>
                      </button>
                    </div>
                    <div class="spinner-border" role="status" v-if="loading">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </form>
                <BListGroup style="font-size: 13px" class="mt-2" flush>
                  <BListGroupItem
                    v-for="(item, index) in items"
                    :key="index"
                    :active="item.id == selectedCustomers.id ? true : fasle"
                    icon
                  >
                    <div class="row">
                      <div class="col-1">
                        <input
                          class="form-check-input mt-3 ms-2"
                          type="radio"
                          v-model="selectedCustomers"
                          :value="item"
                          @click="clickCustomer(item)"
                        />
                      </div>

                      <div class="col-9">
                        <i class="bi bi-person-fill"></i>
                        <span class="fw-bold">{{ item.companyname }}</span>
                        <div v-if="item.companynameen" class="mx-1 p-1">
                          <small class="text-secondary"> {{ item.companynameen }}</small>
                          <div class="mx-2">TaxID : {{ item.taxnumber }}</div>
                          <div class="mx-2" v-if="item.idcard">IDCard : {{ item.idcard }}</div>
                        </div>
                      </div>
                      <div class="col-2">
                        #{{ item.id }}
                        <BButton type="button" @click="editCustomer(item)" variant="text" size="sm"
                          ><i class="bi bi-pencil"></i
                        ></BButton>
                      </div>
                    </div>
                  </BListGroupItem>
                </BListGroup>
              </div>
              <div class="col-12 col-md-6" id="customer-detail" ref="customerDetail">
                <div v-if="selectedCustomers.id !== undefined" class="border p-2">
                  <BCard
                    variant=""
                    class=""
                    :title="selectedCustomers?.companyname"
                    :subtitle="selectedCustomers?.companynameen"
                  >
                    <BCardText style="font-size: small" class="">
                      {{ selectedCustomers?.address }}
                      {{ selectedCustomers?.subdistrict }}
                      {{ selectedCustomers?.district }}
                      {{ selectedCustomers?.province }}
                      {{ selectedCustomers?.postalcode }}
                    </BCardText>

                    <a href="#" class="card-link"> {{ selectedCustomers?.taxnumber }}</a>
                    <BLink href="#" class="card-link"> {{ selectedCustomers?.taxnumber }}</BLink>
                  </BCard>

                  <BTabs>
                    <BTab visible>
                      <template #title
                        ><i class="bi bi-person me-1"></i> สมุดรายชื่อ
                        <!-- <BButton size="sm" type="button" @click="addContact()" variant="link"
                        ><i class="bi bi-plus"></i
                      ></BButton> -->
                      </template>
                      <div class="my-2">
                        <form @submit.prevent="onSearchContact()">
                          <div class="d-flex gap-2">
                            <div>
                              <BButton
                                type="button"
                                @click="addContact()"
                                variant="primary"
                                size="sm"
                              >
                                <i class="bi bi-plus"></i>
                              </BButton>
                            </div>
                            <div class="">
                              <input
                                type="search"
                                v-model="formSearchContact.q"
                                class="form-control form-control-sm"
                                placeholder="ชื่อ"
                                autofocus
                                @keyup.enter="onSearchContact()"
                              />
                            </div>

                            <div class="">
                              <button
                                type="submit"
                                class="btn btn-light btn-sm"
                                :disabled="loadingContact"
                              >
                                <i class="bi bi-search"></i>
                              </button>
                            </div>
                            <div class="spinner-border" role="status" v-if="loadingContact">
                              <span class="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        </form>
                        <BListGroup
                          class="my-2"
                          flush
                          style="height: 400px; overflow-y: scroll; font-size: 13px"
                        >
                          <BListGroupItem
                            v-for="(item, index) in filtedContacts"
                            :key="index"
                            class="border-bottom"
                            :active="item.id == selectedContacts.id ? true : false"
                            icon="pi pi-person"
                          >
                            <div class="float-start d-inline-block">
                              <input
                                class="form-check-input"
                                type="radio"
                                v-model="selectedContacts"
                                :value="item"
                              />
                            </div>

                            <div class="d-inline-block ms-3">
                              {{ item.contactname }}
                              <div class="text">
                                <small class="mx-2" v-if="item.contacttel1"
                                  ><i class="bi bi-phone"></i> {{ item.contacttel1 }}</small
                                >
                                <small class="mx-2" v-if="item.contacttel2"
                                  ><i class="bi bi-phone"></i> {{ item.contacttel2 }}</small
                                >
                              </div>
                            </div>
                            <div class="float-end d-inline-block">
                              #{{ item.id }}
                              <BButton
                                type="button"
                                size="sm"
                                variant="text"
                                @click="editContact(item)"
                              >
                                <i class="bi bi-pencil"></i>
                              </BButton>
                            </div>
                          </BListGroupItem>
                        </BListGroup>
                      </div>
                    </BTab>
                    <BTab>
                      <template #title
                        ><i class="bi bi-truck me-1"></i> ที่อยู่
                        <!-- <BButton variant="text" @click="addAddress()" type="button"
                        ><div class="bi bi-plus"></div
                      ></BButton> -->
                      </template>
                      <div class="my-2">
                        <!-- <form @submit.prevent="">
                          <div class="d-flex gap-2">
                            <div>
                              <button
                                type="button"
                                @click="addAddress()"
                                class="btn btn-primary btn-sm ms-1"
                              >
                                <i class="bi bi-plus"></i>
                              </button>
                            </div>
                            <div class="">
                              <input
                                type="search"
                                v-model="formSearchAddress.q"
                                class="form-control form-control-sm"
                                placeholder="ชื่อ"
                                autofocus
                                @keyup.enter="onSearchAddress()"
                              />
                            </div>

                            <div class="">
                              <button
                                type="button"
                                class="btn btn-light btn-sm"
                                :disabled="loadingContact"
                              >
                                <i class="bi bi-search"></i>
                              </button>
                            </div>
                            <div class="spinner-border" role="status" v-if="loadingContact">
                              <span class="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        </form> -->
                        <BListGroup
                          class=""
                          style="height: 400px; overflow-y: scroll; font-size: 13px"
                          flush
                        >
                          <BListGroupItem
                            v-for="(item, index) in customerAddresses"
                            :key="index"
                            class=""
                          >
                            <div class="d-inline-block ms-3">
                              {{ `${item.address} ${item.address}`.trim() }}
                              <div class="text">
                                <small class="mx-2" v-if="item.contacttel1"
                                  ><i class="bi bi-phone"></i> {{ item.contacttel1 }}</small
                                >
                                <small class="mx-2" v-if="item.contacttel2"
                                  ><i class="bi bi-phone"></i> {{ item.contacttel2 }}</small
                                >
                              </div>
                            </div>
                          </BListGroupItem>
                        </BListGroup>
                      </div>
                    </BTab>
                  </BTabs>
                </div>
                <div v-else>
                  <BAlert :model-value="true">โปรดเลือกลูกค้า</BAlert>

                  <BAlert>xxx</BAlert>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer d-block">
            <!-- <span class="fw-bold bg-danger text-white p-1"> {{ selectedItems.length }}</span> -->

            <div class="d-flex gap-2 flex-wrap justify-content-center">
              <div>
                <vue-awesome-paginate
                  :total-items="pagination.total"
                  :items-per-page="pagination.per_page"
                  :max-pages-shown="5"
                  v-model="pagination.current_page"
                  :on-click="onChangePage"
                  class=""
                />
              </div>
              <div class="text-right">
                <div class="d-flex gap-2 flex-wrap">
                  <template v-if="selectedCustomers.id || selectedContacts.contactid">
                    <button type="button" class="btn btn-primary btn-sm" @click="select">
                      <i class="bi bi-check-circle"></i> เลือก
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" @click="onClearAll">
                      <i class="bi bi-trash"></i> เคลียร์
                    </button>
                  </template>
                  <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                    <i class="bi bi-x"></i> ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ################################# CONTACT ###################################### -->
    <BModal
      hideFooter
      id="modal-contact"
      title="ผู้ติดต่อ"
      v-model="visibleModalContact"
      bodyScrolling
    >
      <p class="">
        <BForm ref="formContactRef" novalidate @submit="saveContact">
          <div class="">
            <BFormFloatingLabel label="ชื่อ *" label-for="contactname" class="my-2">
              <BFormInput
                v-model="formContact.contactname"
                id="contactname"
                type="text"
                placeholder="ชื่อ"
                :state="!!formContact.contactname"
              />
            </BFormFloatingLabel>
            <BFormFloatingLabel label="ตำแหน่งงาน" label-for="contactposition" class="my-2">
              <BFormInput
                v-model="formContact.contactposition"
                id="contactposition"
                type="text"
                placeholder="position"
              />
            </BFormFloatingLabel>

            <BFormFloatingLabel label="เบอร์โทร 1" label-for="contacttel1" class="my-2 w-100">
              <BFormInput
                v-model="formContact.contacttel1"
                id="contactemail"
                type="text"
                placeholder="Phone 1"
              />
            </BFormFloatingLabel>
            <BFormFloatingLabel label="เบอร์โทร 2" label-for="contacttel2" class="my-2 w-100">
              <BFormInput
                v-model="formContact.contacttel2"
                id="contacttel2"
                type="text"
                placeholder="Phone 2"
              />
            </BFormFloatingLabel>
            <BFormFloatingLabel label="email" label-for="contactemail" class="my-2">
              <BFormInput
                v-model="formContact.contactemail"
                id="contactemail"
                type="text"
                placeholder="email"
              />
            </BFormFloatingLabel>
            <div>
              <BFormRadio v-model="formContact.status" name="status" value="1"
                >เปิดใช้งาน
              </BFormRadio>
              <BFormRadio v-model="formContact.status" name="status" value="0"
                >ปิดใช้งาน
              </BFormRadio>
            </div>
          </div>
          <div class="d-flex gap-2 justify-content-center">
            <BButton type="submit" variant="primary"><i class="bi bi-save" /> OK</BButton>
            <BButton type="button" @click="visibleModalContact = false" variant="outline-secondary"
              ><i class="bi bi-x" /> Cancel</BButton
            >
          </div>
        </BForm>
      </p>
    </BModal>
    <!-- ################################# ADDRESS ###################################### -->
    <BModal
      id="modal-address"
      title="ที่อยู่"
      v-model="visibleModalAddress"
      bodyScrolling
      hideFooter
    >
      <p class="">
        <BForm ref="formAddressRef" novalidate>
          <div class="my-2 d-flex gap-5">
            <BFormRadio v-model="formCustomer.is_company" name="is_company" value="yes"
              >นิติบุคคล
            </BFormRadio>
            <BFormRadio v-model="formCustomer.is_company" name="is_company" value="no"
              >บุคคลทั่วไป
            </BFormRadio>
          </div>
          <BFormFloatingLabel label="ชื่อบริษัท" label-for="companyname" class="my-2">
            <BFormInput id="companyname" type="text" placeholder="ชื่อบริษัท" />
          </BFormFloatingLabel>
          <BFormFloatingLabel label="ชื่อบริษัท(en)" label-for="companynameen" class="my-2">
            <BFormInput id="companynameen" type="text" placeholder="company name" />
          </BFormFloatingLabel>
        </BForm>
      </p>
    </BModal>
    <!-- ################################# CUSTOMER ###################################### -->
    <BModal
      id="modal-customer"
      title="ลูกค้า"
      bodyScrolling
      v-model="visibleModalCustomer"
      hideFooter
    >
      <template #header>
        ลูกค้า
        <span v-if="formCustomer.customercode">#{{ formCustomer?.customercode }} </span>
      </template>
      <p class="">
        <BForm ref="formCustomerRef" novalidate @submit="saveCustomer">
          <div class="my-2 d-flex gap-5">
            <BFormRadio v-model="formCustomer.is_company" name="is_company" value="yes"
              >นิติบุคคล
            </BFormRadio>
            <BFormRadio v-model="formCustomer.is_company" name="is_company" value="no"
              >บุคคลทั่วไป
            </BFormRadio>
          </div>
          <BFormFloatingLabel label="ประเภทลูกค้า" label-for="customer_type" class="my-2">
            <BFormSelect
              v-model="formCustomer.customer_type"
              size="sm"
              class="my-2"
              value-field="code"
              text-field="name"
            >
              <template #first>
                <BFormSelectOption value="">-เลือกประเภท-</BFormSelectOption>
              </template>
              <BFormSelectOption v-for="(item, key) in customerTypes" :value="item.code" :key="key"
                >{{ item.code }} : {{ item.name }}</BFormSelectOption
              >
            </BFormSelect>
          </BFormFloatingLabel>
          <div class="">
            <template v-if="formCustomer.is_company == 'yes'">
              <BFormFloatingLabel
                label="ชื่อบริษัท (th)"
                label-for="companyname"
                class="my-2 w-100"
              >
                <BFormInput
                  v-model="formCustomer.companyname"
                  id="companyname"
                  type="text"
                  placeholder="ชื่อบริษัท"
                  :state="!!formCustomer.companyname"
                />
              </BFormFloatingLabel>

              <BFormFloatingLabel
                label="ชื่อบริษัท (en)"
                label-for="companynameen"
                class="my-2 w-100"
              >
                <BFormInput
                  v-model="formCustomer.companynameen"
                  id="companynameen"
                  type="text"
                  placeholder="company name"
                  size="sm"
                  :state="!!formCustomer.companynameen"
                />
              </BFormFloatingLabel>
            </template>
            <template v-else>
              <BFormFloatingLabel label="ชื่อ (th)" label-for="name_th" class="my-2">
                <BFormInput
                  v-model="formCustomer.name"
                  id="name_th"
                  type="text"
                  placeholder="name_th"
                  size="sm"
                />
              </BFormFloatingLabel>
              <BFormFloatingLabel label="นามสกุล (th)" label-for="lastname_th" class="my-2">
                <BFormInput
                  v-model="formCustomer.lastname_th"
                  id="lastname_th"
                  type="text"
                  placeholder="lastname_th"
                  size="sm"
                />
              </BFormFloatingLabel>
              <BFormFloatingLabel label="ชื่อ (en)" label-for="name" class="my-2">
                <BFormInput
                  v-model="formCustomer.name"
                  id="name"
                  type="text"
                  placeholder="name"
                  size="sm"
                />
              </BFormFloatingLabel>
              <BFormFloatingLabel label="นามสกุล (en)" label-for="lastname" class="my-2">
                <BFormInput
                  v-model="formCustomer.lastname"
                  id="lastname"
                  type="text"
                  placeholder="lastname"
                  size="sm"
                />
              </BFormFloatingLabel>
            </template>

            <BFormFloatingLabel label="อำเภอ/เขต" label-for="district" class="my-2">
              <BFormInput
                v-model="formCustomer.district"
                id="district"
                type="text"
                placeholder="district"
                size="sm"
              />
            </BFormFloatingLabel>
            <BFormFloatingLabel label="จังหวัด" label-for="province" class="my-2">
              <BFormInput
                v-model="formCustomer.province"
                id="province"
                type="text"
                placeholder="province"
                size="sm"
              />
            </BFormFloatingLabel>
            <BFormFloatingLabel label="รหัสไปรษณีย์" label-for="postalcode" class="my-2">
              <BFormInput
                v-model="formCustomer.postalcode"
                id="postalcode"
                type="text"
                placeholder="postalcode"
                size="sm"
              />
            </BFormFloatingLabel>
            <BFormFloatingLabel label="ประเทศ" label-for="country" class="my-2">
              <BFormInput
                v-model="formCustomer.country"
                id="country"
                type="text"
                placeholder="country"
                size="sm"
              />
            </BFormFloatingLabel>
            <BFormFloatingLabel
              label="ผู้ติดต่อหลัก (Default)"
              label-for="contactmain"
              class="my-2 w-100"
            >
              <BFormInput
                v-model="formCustomer.contactmain"
                disabled
                id="contactmain"
                type="text"
                placeholder="contactmain"
                size="sm"
              />
            </BFormFloatingLabel>
          </div>
          <div class="d-flex gap-2 justify-content-center">
            <BButton type="submit" variant="primary"><i class="bi bi-save" /> OK</BButton>
            <BButton type="button" @click="visibleModalCustomer = false" variant="outline-secondary"
              ><i class="bi bi-x" /> Cancel</BButton
            >
          </div>
        </BForm>
      </p>
      <template #footer> </template>
    </BModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'onSelect'])
const props = defineProps({
  visible: {
    type: Boolean,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  data: {
    type: Object,
    default: () => {},
  },
  title: {
    type: String,
    default: 'บริษัท',
  },
  customerTypes: {
    type: Object,
    default: () => [],
  },
})

let modal = null
const appStore = useAppStore()
let modalElement = ref(null)
const items = ref([])
const contacts = ref([])
const filtedContacts = computed(() => contacts.value || [])
const selectedCustomers = ref([])
const selectedContacts = ref([])
const loading = ref(false)

const visibleModalAddress = ref(false)
const visibleModalContact = ref(false)
const visibleModalCustomer = ref(false)
const formCustomerRef = ref(null)
const formContactRef = ref(null)
const formAddressRef = ref(null)

const loadingContact = ref(false)
const customerAddresses = ref([])
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const formSearch = ref({
  code: '',
  q: '',
})
const formSearchContact = ref({
  code: '',
  q: '',
})
const formCustomer = ref({
  address: '',
  companyname: '',
  companynameen: '',
  contactmain: '',
  country: '',
  customer_type: '',
  customercode: '',
  district: '',
  idcard: '',
  is_company: '',
  lastname: '',
  lastname_th: '',
  name: '',
  name_th: '',
  phone: '',
  postalcode: '',
  province: '',
  status: '1',
  subdistrict: '',
  taxnumber: '',
})
const formContact = ref({
  contactemail: '',
  contactfax: '',
  contactname: '',
  contactposition: '',
  contactreceivenews: '',
  contacttel1: '',
  contacttel2: '',
  customer_id: '',
  status: 1,
  statusmain: '',
})
const formAddress = ref({
  type: '',
  address: '',
})

const searchCustomer = async () => {
  pagination.value.current_page = 1
  // pagination.value.total = 0
  try {
    loadData()
  } catch (error) {}
  emit('onSearch', formSearch.value)
}
const onChangePage = async (page) => {
  pagination.value.current_page = page
  try {
    loadData()
  } catch (error) {}
}
const loadData = async () => {
  loading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/customers', {
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
const loadContactByCustomerId = async (customerId) => {
  if (customerId) {
    loadingContact.value = true
    let params = {
      ...formSearchContact.value,
    }
    const { data } = await api.get(`/v2/customers/${customerId}/contacts`, {
      params: params,
    })
    if (data) {
      contacts.value = data
    }
    loadingContact.value = false
  }
}

const onSearchContact = () => {
  loadContactByCustomerId(selectedCustomers.value.id)
}

const onClearAll = (row, index) => {
  console.log('clear customer')
  selectedCustomers.value = []
  selectedContacts.value = []
  emit('clear', {
    customers: selectedCustomers.value,
    contacts: selectedContacts.value,
  })
  emit('onHide', selectedCustomers.value)
  modal.hide()
}
const onClearCustomer = (row, index) => {
  console.log('clear customer')
  selectedCustomers.value = []
  emit('clearCustomer', {
    customers: selectedCustomers.value,
  })
}
const onClearContact = (row, index) => {
  console.log('clear contact')
  selectedContacts.value = []
  emit('clearContact', {
    contacts: selectedContacts.value,
  })
}

const show = () => {
  searchCustomer()
  emit('onShow', selectedCustomers.value)
  modal.show()
}
const hide = () => {
  emit('onHide', selectedCustomers.value)
  modal.hide()
}

const select = () => {
  emit('onSelect', {
    customers: selectedCustomers.value,
    contacts: selectedContacts.value,
  })
  selectedCustomers.value = []
  selectedContacts.value = []
  modal.hide()
  emit('onHide')
}
const customerDetail = ref(null)
const clickCustomer = (item) => {
  console.log('click', item)
  loadContactByCustomerId(item.id)
  loadAddrressByCustomerId(item.id)
  customerDetail.value.scrollIntoView({ behavior: 'smooth' })
}
onMounted(() => {
  modal = new Modal(modalElement.value)
})

// watch(props.customer, (p) => {
//   if (p.customer) {
//     formSearch.value.customer_id = p.customer?.id
//     searchCustomer()
//   }
// })
defineExpose({ show, hide })
const formFieldsCopy = ref({})
const addCustomer = () => {
  visibleModalCustomer.value = true
  formCustomer.value = { ...formFieldsCopy.value }
  formCustomer.value.is_company = 'yes'
}

const editCustomer = async (item) => {
  visibleModalCustomer.value = true
  formCustomer.value = item
  const { data } = await api.get('v2/customers/' + item.id)
  if (data) formCustomer.value = data
}
const saveCustomer = async () => {
  if (formCustomer.value.id > 0) {
    visibleModalCustomer.value = true
    formCustomer.value
    const { status, data } = await api.put(
      'v2/customers/' + formCustomer.value.id,
      formCustomer.value,
    )
    if (status === 200) {
      visibleModalCustomer.value = false
      formCustomer.value = data.data
      toast(`${data.message}`, {
        theme: 'auto',
        type: 'success',
        autoClose: 500,
        dangerouslyHTMLString: true,
      })
    } else {
      toast(`${data.message}`, {
        theme: 'auto',
        type: 'danger',
        autoClose: 50000,
        dangerouslyHTMLString: true,
      })
    }
  }
}
const addContact = () => {
  visibleModalContact.value = true
  formContact.value = { ...formFieldsCopy.value }
  formContact.value.customer_id = selectedCustomers.value?.id || 0
}
const editContact = async (item) => {
  visibleModalContact.value = true
  formContact.value._index = contacts.value.indexOf(item)
  formContact.value = item
  const { data } = await api.get(`v2/contacts/${item.id}`)
  if (data) formContact.value = { ...data }
}
const loadAddrressByCustomerId = async (customerId) => {
  const { data } = await api.get(`v2/customers/${customerId}/addresses`)
  if (data) customerAddresses.value = data
}
const saveContact = async () => {
  if (formContact.value.id > 0) {
    try {
      const { data } = await api.put(`v2/contacts/${formContact.value.id}`, formContact.value)
      if (data) {
        loadContactByCustomerId(formContact.value.customer_id)
        formContact.value = { ...data.data }
        visibleModalContact.value = false
        toast(`${data.message}`, {
          theme: 'auto',
          type: 'success',
          autoClose: 1500,
          dangerouslyHTMLString: true,
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  } else {
    try {
      const { data, status } = await api.post(`v2/contacts`, formContact.value)
      console.log('save', data)
      if (status == 200) {
        loadContactByCustomerId(formContact.value.customer_id)
        formContact.value = { ...formFieldsCopy }
        visibleModalContact.value = false

        toast(`${data.message}`, {
          theme: 'auto',
          type: 'success',
          autoClose: 1500,
          dangerouslyHTMLString: true,
        })
      } else {
        toast(`${data.message}`, {
          theme: 'auto',
          type: 'danger',
          autoClose: 50000,
          dangerouslyHTMLString: true,
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }
}

const addAddress = () => {
  visibleModalAddress.value = true
  formAddress.value = { ...formFieldsCopy.value }
  formContact.value.customer_id = selectedCustomers.value?.id || 0
}
const editAddress = async (item) => {
  visibleModalAddress.value = true
  formAddress.value = item
  const { data } = await api.get(`v2/customers/${item.id}/address`)
  if (data) formAddress.value = data
}
</script>
<style lang="scss" scoped>
td,
th {
  font-size: 13px;
}

input[type='radio'] {
  transform: scale(2);
  margin: 3px;
}
.list-group {
  // .active {
  //   background-color: rgb(56, 58, 58);
  // }
}
</style>
