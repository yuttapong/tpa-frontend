<template>
  <div>
    <form @submit="submit">
      <div class="modal" ref="modalRef">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" v-html="title"></h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <!-- <Teleport to="body">
                                <div v-if="visibleConfirm">
                                    <p>Hello from the modal!</p>
                                    <button @click="visibleConfirm = false">Close</button>
                                </div>
                            </Teleport> -->

              <div class="row g-2">
                <div class="col-4 text-decoration-underline">วันที่</div>
                <div class="col-8">
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="form.document_date"
                    required
                  />
                </div>
                <div class="col-4 text-decoration-underline">ประเภทบิล</div>
                <div class="col-8">
                  <select required class="form-select form-select-sm" v-model="form.bill_type">
                    <option v-for="(item, key) in billTypes" :key="key" :value="item.value">
                      {{ item.value }} : {{ item.text }}
                    </option>
                  </select>
                </div>
                <div class="col-4 text-decoration-underline">ลูกค้า</div>
                <div class="col-1 text-center">
                  <button type="button" class="btn btn-link btn-sm">
                    <i class="bi bi-search" @click="openModalCustomer"></i>
                  </button>
                </div>
                <div class="col-7 form-inline">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="form.company_name"
                    required
                  />
                </div>
                <div class="col-4 text-decoration-underline">ผู้ติดต่อ</div>
                <div class="col-1 text-center">
                  <button type="button" class="btn btn-sm btn-link">
                    <i class="bi bi-search" @click="openModalContact"></i>
                  </button>
                </div>
                <div class="col-7 form-inline">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="form.agent_name"
                    required
                  />
                </div>
                <div class="col-4 text-decoration-underline">ที่อยู่</div>
                <div class="col-8">
                  <BFormTextarea
                    class="form-control form-control-sm"
                    v-model="form.address_detail"
                    rows="5"
                  />
                </div>
                <div class="col-4 text-decoration-underline">จังหวัด</div>
                <div class="col-8">
                  <BInput
                    class="form-control form-control-sm"
                    v-model="form.address_province"
                    rows="5"
                  />
                </div>
                <div class="col-4 text-decoration-underline">รหัสไปรษณีย์</div>
                <div class="col-8">
                  <BInput class="form-control form-control-sm" v-model="form.address_zipcode" />
                </div>
                <div class="col-4 text-decoration-underline">เบอร์โทร</div>
                <div class="col-8">
                  <BInput
                    class="form-control form-control-sm"
                    v-model="form.address_phone"
                    rows="5"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-sm btn-primary">
                <i class="bi bi-save me-1"></i> สร้างใบขอรับบริการ
              </button>
              <button class="btn btn-sm btn-secondary" @click="hide">
                <i class="bi bi-x me-1"></i> ยกเลิก
              </button>
              <!-- {{ form }} -->
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <ModalCustomer ref="modalCustomerRef" @onSelect="onSelectCustomer" />
  <ModalContact
    ref="modalContactRef"
    @onSelect="onSelectContact"
    :customer="{ id: form.company_id, name: form.company_name }"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Modal } from 'bootstrap'
import { myFormatDate } from '@/helpers/myformat'
import { useBillStore } from '@/stores/billStore'
import ModalCustomer from '@/views/customer/components/ModalCustomer.vue'
import ModalContact from '@/views/customer/components/ModalContact.vue'
import { useConfirmDialog } from '@vueuse/core'
import { api } from '@/helpers/api'
import { format } from 'date-fns-tz'
const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel } = useConfirmDialog()

const emit = defineEmits(['onHide', 'onShow', 'onConfirm'])
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  onSave: {
    type: Function,
  },
  billTypes: {
    type: Object,
    default: () => [],
  },
})
const billStore = useBillStore()
const visibleConfirm = ref(false)
const modalCustomerRef = ref(null)
const modalContactRef = ref(null)

let modalEl = null
let modalRef = ref(null)
const year = ref()
const form = ref({
  document_date: format(new Date(), 'yyyy-mm-dd'),
  bill_type: '',
  id: 0,
  company_id: '',
  agent_id: '',
  agent_name: '',
})
const resetForm = () => {
  form.value = {
    document_date: new Date(),
    bill_type: '',
    id: 0,
    company_id: '',
    agent_id: '',
    agent_name: '',
  }
}
const customerId = computed(() => form.value.company_id)

const show = () => {
  modalEl.show()
}
const hide = () => {
  modalEl.hide()
}

const submit = async (e) => {
  e.preventDefault()
  visibleConfirm.value = true
  console.log(form.value)
  const params = {
    ...form.value,
  }
  const rs = await api.post('v2/bills', params)
  console.log(rs)
  if (rs.status == 201) {
    emit('onSave', rs.data)
    resetForm()
    hide()
  }
}

const onSelectCustomer = (data) => {
  console.log(data)
  modalCustomerRef.value.hide()
  form.value.company_id = data.customers.id
  form.value.company_name = data.customers.companyname
  form.value.agent_id = data.contacts.id
  form.value.agent_name = data.contacts.contactname
  form.value.address_name = data.customers.companyname
  let address = `${data?.customers?.address} 
  ${data?.customers?.subdistrict}
  ${data?.customers?.district}
  `.trim()

  form.value.address_detail = address.replace(/(\r\n|\n|\r)/gm, '')
  form.value.address_phone = data.customers.phone
  form.value.address_province = data.customers.province
  form.value.address_zipcode = data.customers.postalcode
}
const onSelectContact = (data) => {
  modalContactRef.value.hide()
  form.value.agent_id = data.id
  form.value.agent_name = data.contactname
}

const openModalCustomer = () => {
  modalCustomerRef.value.show()
}
const openModalContact = () => {
  modalContactRef.value.show()
}

watch(year, () => {
  let x = year.value.split('-')
  form.value.year = x[0] !== undefined ? x[0] : ''
})

onMounted(() => {
  modalEl = new Modal(modalRef.value)
})
defineExpose({ show, hide })
</script>
