<template>
  <div class="commitment">



    <form @submit="submit()">
      <div class="modal" ref="modalRef" id="modal">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" v-html="title"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- ########################################################### -->

              <!-- #####################START######################## -->
              <form @submit.prevent="onSearch()">
                <div class="row g-3">
                  <div class="col-12 col-lg-4 col-xl-3">
                    <label>Bill ID</label>
                    <p class="fw-bold">{{ bill.id }}</p>
                  </div>
                  <div class="col-12 col-lg-4 col-xl-3">
                    <label>Bill Code</label>
                    <p class="fw-bold">{{ bill.code }}</p>
                  </div>
                  <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <label>วันที่</label>
                    <input type="date" v-model="bill.document_date" name="document_date" id="document_date"
                      class="form-control form-control-sm" readonly />
                  </div>
                  <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <label>วันนัดรับเครื่องมือ</label>
                    <template v-if="bill.commitment_date">
                      <p>
                        {{ MyFormatDate(bill.commitment_date) }}
                      </p>
                    </template>
                    <template v-else>
                      <p>-</p>
                    </template>
                    <!-- <input type="date" v-model="form.commitment_date" name="commitment_date"
                                            id="commitment_date" class="form-control form-control-sm" readonly> -->
                  </div>
                  <div class="col-12 col-lg-4 col-xl-3"></div>
                  <div class="col-12 col-lg-4 col-xl-3"></div>
                  <div class="col-12 col-lg-4 col-xl-3"></div>
                </div>

                <div class="border p-2">
                  <input type="checkbox" v-model="searchCommitmentDate" @change="onChangeConditionCommitment" />
                  กำหนดวันนัดรับเครื่องมือ
                  <div class="row g-2">
                    <div class="col-12 col-lg-8">
                      <label>Priority</label>
                      <BillPriority v-model="commitmentPriority" />
                    </div>
                    <div class="col-12 col-lg-4">
                      <label>เลือกวันที่</label>
                      <input type="date" class="form-control-sm form-control" v-model="commitmentDate"
                        placeholder="เลือกวันที่" />
                    </div>

                    <div class="col-12">
                      <div v-if="messageErrorCommitment" class="alert alert-danger">
                        {{ messageErrorCommitment }}
                      </div>
                      <div v-if="messageSuccessCommitment" class="alert alert-success">
                        {{ messageSuccessCommitment }}
                        <div>
                          <span class="mx-2"><i class="bi bi-calendar"></i> วันที่เอกสาร</span>
                          {{
                            MyFormatDate(resultCommitment.data.document_date, {
                              hideTime: true,
                            })
                          }}
                          <span class="mx-2"><i class="bi bi-calendar"></i> วันนัดรับ</span>
                          {{
                            MyFormatDate(resultCommitment.data.commitment_date, {
                              hideTime: true,
                            })
                          }}
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
                <Spinner :visible="loading" class="me-2" />
                <div class="my-2 table-responsive">
                  <table class="table table-sm table-bordered table-striped">
                    <thead>
                      <!-- <tr>
                                            <td>{{ index + 1 }})</td>
                                            <td colspan="5">
                                                <h5 class="h6 text-primary my-0 fw-bolder">
                                                    {{ item?.product_name }}
                                                    <span class="bg-secondary p-1 text-white fw-bold float-end"> {{
                                                        item.item_code
                                                    }}</span>
                                                </h5>
                                                <div class="text-danger">{{ item.product.code }}</div>
                                            </td>
                                        </tr> -->
                      <tr>
                        <th scope="col" class="">#</th>
                        <th scope="col" class="fw-bold">SubLab</th>
                        <th scope="col" class="fw-bold" nowrap>Reserved Date</th>
                        <th scope="col" class="">Item Id</th>
                        <th scope="col" class="">Item Code</th>
                        <th scope="col" class="">Product</th>

                        <th scope="col" class="fw-bold">Barcode</th>

                        <th scope="col" class="fw-bold">S/N.</th>
                        <th scope="col" class="fw-bold">ID No.</th>
                      </tr>
                    </thead>

                    <tbody v-if="bill.items">
                      <tr v-for="(item, index) in bill.items" :key="index"
                        :class="item.product && item.product.is_job != 1 ? 'text-decoration-line-through' : ''">
                        <td>{{ index + 1 }})</td>
                        <td>
                          <div>{{ item.sublab?.name_th }} #{{ item.lab_id }}</div>
                          <small class="ms-2 text-danger">{{ item.sublab?.name_th }} #{{ item.sublab_id }}</small>
                        </td>
                        <td nowrap>
                          <span>{{ item?.reserved_date }}</span>
                          <!-- <JobButtonStatus :data="item?.service_status_id"/> -->

                          <div v-if="item.current_service_status">
                            {{ item.current_service_status.status_id }} : {{ item?.current_service_status.status_name }}
                          </div>
                        </td>
                        <td>
                          <span>{{ item.item_id }}</span>
                        </td>
                        <td nowrap>
                          {{ item.item_code }}
                        </td>
                        <td>
                          <div v-if="item.product && item.product.is_job">{{ item.product_name }}</div>
                          <div>{{ item.product_name }}</div>
                        </td>
                        <td>
                          <span>{{ item?.barcode_no }}</span>
                        </td>

                        <td>
                          <span>{{ item?.serialnumber }}</span>
                        </td>
                        <td>
                          <span>{{ item?.id_no }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </form>

              <!-- ########################################################### -->
            </div>
            <div class="modal-footer">
              <div class="row g-1">
                <div class="col-12">

                  <button type="button" class="btn btn-secondary btn-sm" @click="loadData()">
                    <i class="float-start bi bi-arrow-clockwise me-2"></i> รีโหลดข้อมูล
                  </button>
                  <button type="button" class="btn btn-primary btn-sm  ms-2" @click="submit()">
                    <i class="float-start bi bi-clock me-2"></i> เริ่มคำนวณ
                  </button>
                  <template v-if="form.commitment_date">
                    <button type="button" class="btn btn-danger btn-sm ms-2" @click="cancelBook()">
                      <i class="float-start bi bi-x me-2"></i> ยกเลิกวัน
                    </button>
                  </template>

                  <Spinner :visible="loadingCommitment" />
                </div>
              </div>
              <!-- <button type="submit" class="btn btn-sm btn-primary"><i class="bi bi-save me-1"></i>
                สร้างใบขอรับบริการ</button>
              <button class="btn btn-sm btn-secondary" @click="hide"><i class="bi bi-x me-1"></i>
                ยกเลิก</button> -->
            </div>
          </div>
        </div>
      </div>
    </form>

  </div>

  <ConfirmCommitment ref="modalConfirm" :data="resultCommitment" @onConfirm="updateCommitmentDate" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Modal } from 'bootstrap'
import { MyFormatDate } from '@/helpers/myformat'
import ConfirmCommitment from '@/views/bill/components/ConfirmCommitment.vue'
import { toast } from 'vue3-toastify'
import BillButtonStatus from '@/views/bill/components/BillButtonStatus.vue'
import JobButtonStatus from '@/views/bill/components/JobButtonStatus.vue'
import { useConfirmDialog } from '@vueuse/core'
import { useAppStore } from '@/stores/appStore'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import BillPriority from '@/views/bill/components/BillPriority.vue'
import axios from 'axios'
const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel }
  = useConfirmDialog()

const emit = defineEmits(['onHide', 'onShow', 'onConfirm', 'Onreload'])
const props = defineProps({
  title: {
    type: String,
    default: 'จองคิวทดสอบเครื่องมือ',
  },
  onSave: {
    type: Function,
  },
  onCancel: {
    type: Function,
  },
  billTypes: {
    type: Object,
    default: () => []
  },
  bill: {
    type: Object,
  }
})
const appStore = useAppStore()

let modalEl = null
let modalRef = ref(null)

const show = () => {
  setTimeout(() => loadData(), 2000)
  modalEl.show()
}
const hide = () => {
  modalEl.hide()
}

const loading = ref(false)
const searchCommitmentDate = ref(true)
const modalConfirm = ref(null)

const form = ref({
  id: 0,
  bill_code: '',
  document_date: '',
  items: [],
  company_id: '',
  address_name: '',
  address_detail: '',
  cert_address_name: '',
  cert_address_detail: '',
  agent_id: '',
  agent_name: '',
  status: '',
  bill_status: '',
  service_status_id: 0,
})

//  commitment
const billCode = computed(() => props.bill.code)
const items = ref(props.bill?.items || [])
const loadingCommitment = ref(false)
const resultCommitment = ref()
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const commitmentDate = ref()
const commitmentPriority = ref('medium')

const findCommitmentDate = async () => {
  if (commitmentDate.value === undefined || commitmentPriority.value === undefined) {
    messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    return
  }
  // let d1 = form.value?.document_date ? new Date(`${form.value?.document_date} 00:00:00`) : ''
  // let d2 = new Date(`${commitmentDate.value} 00:00:00`)
  let _items = []
  props.bill.items.filter((item) => {
    if (Number(item.product.is_job) == 1) {
      let filteredItem = {
        duration: parseInt(item.product?.duration),
        item_code: item.item_code,
        lab_id: item.lab_id,
        product_id: item.product_id,
        product_name: item.product_name,
        barcode_no: item.barcode_no,
        serialnumber: item.serialnumber,
        // reserved_date: form.value?.document_date,
        sorter: item.sorter,
        sublab_id: item.sublab_id,
        workorder_id: item.item_id,
        service_status_id: item.service_status_id,
        is_job: item.product.is_job,
        // product: item.product,
      }
      _items.push(filteredItem)
    }
  })
  const params = {
    priority: commitmentPriority.value,
    bill_id: props.bill.id,
    code: props.bill.code,
    // document_date: d1 ? formatISO(toZonedTime(form.value.document_date, timezone)) : '',
    // commitment_date: d2 ? formatISO(toZonedTime(d2, timezone)) : '',
    document_date: props.bill.document_date,
    commitment_date: commitmentDate.value,
    items: _items,
  }

  messageErrorCommitment.value = ''
  messageSuccessCommitment.value = ''

  if (commitmentDate.value === undefined || commitmentPriority.value === undefined) {
    messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    return
  }
  loadingCommitment.value = true

  try {
    const { data } = await axios
      .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills/inquiry', params, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${appStore.token}`,
        },
      })
      .catch((err) => {
        loadingCommitment.value = false

        if (err.response) {
          let data = err.response?.data
          if (data) {
            messageErrorCommitment.value = data.message
          } else {
            messageErrorCommitment.value = err.message
          }
        } else {
          messageErrorCommitment.value = err.message
        }
      })
    console.log('data', data)
    resultCommitment.value = data
    loadingCommitment.value = false
    if (data.success) {
      let message = `ประมวลผลตารางคิวงานสำเร็จ`
      messageSuccessCommitment.value = message
      modalConfirm.value.show()
    } else {
      messageErrorCommitment.value = data.message
    }
  } catch (error) {
    resultCommitment.value = error
    console.log('error', error)
    loadingCommitment.value = false
  }
}
const onChangeConditionCommitment = (e) => {
  let checked = e.target.checked
  if (checked == false) {
    commitmentDate.value = null
  }
}

const submit = () => {
  if (searchCommitmentDate.value === true) {
    findCommitmentDate()
  }
}
const confirmCommitmentToKanban = async (params) => {
  const { data } = await axios
    .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appStore.token}`,
      },
    })
    .catch((err) => {
      loadingCommitment.value = false

      if (err.response) {
        let data = err.response?.data
        if (data) {
          messageErrorCommitment.value = data.message
        } else {
          messageErrorCommitment.value = err.message
        }
      } else {
        messageErrorCommitment.value = err.message
      }
      toast(messageErrorCommitment, {
        theme: 'auto',
        type: 'default',
        dangerouslyHTMLString: true,
      })
    })
  if (data) {
    loadingCommitment.value = false
    toast(data.message, {
      theme: 'auto',
      type: 'default',
      dangerouslyHTMLString: true,
    })
  }
}
const cancelBook = async () => {
  if (confirm('ยืนยันยกเลิกจองคิว ?')) {
    let params = {
      commitment_date: form.value.commitment_date,
      bill_id: form.value.id,
    }
    const { data } = await axios
      .delete(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills?bill_id=' + params.bill_id, {
        data: {},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${appStore.token}`,
        },
      })
      .catch((err) => {
        loadingCommitment.value = false

        if (err.response) {
          let data = err.response?.data
          if (data) {
            messageErrorCommitment.value = data.message
          } else {
            messageErrorCommitment.value = err.message
          }
        } else {
          messageErrorCommitment.value = err.message
        }
        toast(messageErrorCommitment, {
          theme: 'auto',
          type: 'default',
          dangerouslyHTMLString: true,
        })
      })
    if (data.success) {
      clearCommitmentDate(form.value.id)
      loadingCommitment.value = false
      toast('ยกเลิกสำเร็จ', {
        theme: 'auto',
        type: 'default',
        dangerouslyHTMLString: true,
      })
      loadData()
    }
  }
}
const updateCommitmentDate = async () => {
  const bill = resultCommitment.value.data
  const { data } = await api.post(`/v2/bills/${bill.bill_id}/commitment`, bill)
  console.log(data)
  if (data) {
    if (data) {
      toast(data.message, {
        theme: 'auto',
        type: 'default',
        dangerouslyHTMLString: true,
      })
      confirmCommitmentToKanban(bill)
      setTimeout(() => {
        loadData()
      }, 3000)
    }
  }
}
const clearCommitmentDate = async (billId) => {
  await api.delete(`/v2/bills/${billId}/commitment`)
}

const loadData = async () => {
  loading.value = true;
  emit("onReload", props.bill)
  setTimeout(() => loading.value = false, 2000)
}

const getBill = async () => {
  if (billCode.value) {
    const { data } = await api.get('/v2/bills/code/' + billCode.value, {
      onlyjob: 'yes',
    })
    if (data) {
      console.log("data", data);
      emit("update:bill", data)
    }
  }
}
onMounted(() => {
  modalEl = new Modal(modalRef.value)
  console.log(modalEl);
  var myModal = document.getElementById('modal')
  myModal.addEventListener("shown.bs.modal", (e) => {
    console.log('show');
    messageErrorCommitment.value = ""
    messageSuccessCommitment.value = ""
  })
  myModal.addEventListener("hide.bs.modal", (e) => {
    console.log('hide');
    messageErrorCommitment.value = ""
    messageSuccessCommitment.value = ""
  })
})
defineExpose({ show, hide })
</script>

<style lang="scss" scoped>
.commitment {

}

.table-bill-items {
  border: solid 1px #130f0f;
}

table {
  th {
    font-size: 13px;
    font-weight: bold;
  }

  td {
    font-size: 13px;
  }
}
</style>

