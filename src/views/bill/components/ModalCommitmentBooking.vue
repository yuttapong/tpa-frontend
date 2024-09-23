<template>
  <div class="commitment">
    <form @submit="submit()">
      <div class="modal" ref="modalRef" id="modalCommitment">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" v-html="title"></h5>

              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                style="font-size: 2rem"></button>
            </div>
            <div class="modal-body">
              <!-- ########################################################### -->
              <Spinner :visible="loading" class="me-2" />
              <!-- #####################START######################## -->
              <form @submit.prevent="onSearch()">
                <div class="d-flex flex-wrap gap-3">
                  <div class="">
                    <label class="text-decoration-underline fw-bold">Bill ID</label>
                    <p class="">{{ bill.id }}</p>
                  </div>
                  <div class="">
                    <label class="text-decoration-underline fw-bold">Bill Code</label>
                    <p class="">{{ bill.code }}</p>
                  </div>
                  <div class="">
                    <label class="text-decoration-underline fw-bold">วันที่</label>
                    <p>
                      {{ myFormatDate(bill.document_date) }}
                    </p>
                  </div>
                  <div class="">
                    <label class="text-decoration-underline fw-bold">วันนัดรับ</label>
                    <template v-if="bill.commitment_date">
                      <p>
                        {{ myFormatDate(bill.commitment_date) }}
                      </p>
                    </template>
                    <template v-else>
                      <p>-</p>
                    </template>
                  </div>
                  <div class="">
                    <label class="text-decoration-underline fw-bold">ลูกค้า</label>
                    <p class="">{{ bill?.address_name }}</p>
                  </div>
                  <div class="">
                    <label class="text-decoration-underline fw-bold">ผู้ติดต่อ</label>
                    <p class="">{{ bill?.agent_name }}</p>
                  </div>
                  <div class="">
                    <label class="text-decoration-underline fw-bold">Note Customer</label>
                    <p class="text-danger">{{ bill?.note_customers }}</p>
                  </div>
                  <div class="">
                    <label class="text-decoration-underline fw-bold">Remark</label>
                    <p class="">{{ bill?.remark }}</p>
                  </div>
                </div>

                <div class="border p-2">
                  <div class="row g-2">
                    <div class="col-12 col-lg-4">
                      <label>Priority</label>
                      <BillPriority v-model="commitmentPriority" @onChange="onChangePriority" />
                    </div>
                    <div class="col-12 col-lg-4" v-if="commitmentPriority == 'high'">
                      <label>เลือกวันที่</label>
                      <input type="date" class="form-control-sm form-control" v-model="commitmentDate"
                        placeholder="เลือกวันที่" />
                    </div>
                    <div class="col-12 col-lg-4">
                      <div class="mt-4 ms-3">
                        <input type="checkbox" class="" v-model="acceptedCommitmentDate"
                          @change="onChangeConditionCommitment" />
                        <label class="ms-1">ยืนยันจองคิวห้องทดลอง</label>
                      </div>
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
                            myFormatDate(resultCommitment.data.document_date, {
                              hideTime: true,
                            })
                          }}
                          <span class="mx-2"><i class="bi bi-calendar"></i> วันนัดรับ</span>
                          {{
                            myFormatDate(resultCommitment.data.commitment_date, {
                              hideTime: true,
                            })
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                        <th scope="col" class="">Item Id</th>
                        <th scope="col" class="">Item Code</th>
                        <th scope="col" class="">
                          <div>เครื่องมือ</div>
                          Product
                        </th>
                        <th scope="col" class="fw-bold">
                          <div>รายละเอียด</div>
                          Test Point
                        </th>
                        <th scope="col" class="fw-bold">
                          <div>ห้องทดลอง</div>
                          SubLab
                        </th>
                        <th scope="col" class="fw-bold">Cal Hour</th>
                        <th scope="col" class="fw-bold">Duration</th>
                        <th scope="col" class="fw-bold" nowrap>
                          <div>วันนัดรับ</div>
                          Reserved Date
                        </th>

                        <th>สถานะ</th>

                      </tr>
                    </thead>

                    <tbody v-if="bill.items">
                      <tr v-for="(item, index) in bill.items" :key="index" :class="item.product && item.product.is_job != 1
                        ? 'text-decoration-line-through'
                        : ''
                        ">
                        <td>{{ index + 1 }})</td>
                        <td>
                          <span>{{ item.item_id }}</span>
                        </td>
                        <td nowrap>
                          <div>
                            {{ item.item_code }}
                          </div>
                          <template v-if="item.product_id">
                            <BBadge variant="info" v-if="Boolean(item?.product?.is_job) == true">JOB
                            </BBadge>
                          </template>
                        </td>
                        <td style="min-width: 290px">

                          <BRow align-h="start" gutter-x="1" style="font-size: 12px">
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Id.No</div>
                              <div class="d-block">{{ item?.id_no }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Model</div>
                              <div class="d-item">{{ item.model }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">S/N</div>
                              <div class="d-block">{{ item.serialnumber }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Barcode</div>
                              <div class="d-block">{{ item.barcode_no }}</div>
                            </BCol>
                          </BRow>
                          <BBadge v-if="item.manufaturer_name" variant="warning me-2">{{ item?.manufaturer_name }}
                          </BBadge>
                          <span class="text-primary">{{ item.product_name }}</span>
                        </td>

                        <td style="min-width: 290px">
                          <BRow align-h="start" gutter-x="2" style="font-size: 12px">
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Range</div>
                              <div class="d-block">{{ item?.range_value }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Range Price</div>
                              <div class="d-item">{{ myCurrency(item.range_price) }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Point</div>
                              <div class="d-block">{{ item.point }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Pont Price</div>
                              <div class="d-block">{{ myCurrency(item.point_price) }}</div>
                            </BCol>
                          </BRow>
                          {{ item.test_point }}
                        </td>
                        <td nowrap>
                          <div>{{ item.lab?.name_th }} #{{ item.lab_id }}</div>
                          <small class="ms-2 text-danger">{{ item.sublab?.name_th }} #{{ item.sublab_id }}</small>
                        </td>
                        <td nowrap>{{ item?.product?.calhour }} (ชม.)</td>
                        <td nowrap>{{ item?.product?.duration }} (นาที)</td>
                        <td nowrap>
                          <span>{{ item?.reserved_date }}</span>
                          <!-- 
                          <div v-if="item.current_service_status">
                            {{ item.current_service_status.status_id }} :
                            {{ item?.current_service_status.status_name }}
                          </div> -->
                        </td>
                        <td nowrap>
                          <template v-if="item">
                            <JobStatus v-model="item.job_status" />

                            <div v-if="item.current_service_status" style="font-size: 12px"
                              class="border-bottom text-danger">
                              {{ item?.current_service_status.status_name }} #{{
                                item?.current_service_status.status_id
                              }}
                            </div>
                          </template>
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>
              </form>

              <!-- ########################################################### -->
            </div>
            <div class="modal-footer">
              {{ resultCommitment }}
              <div class="row g-1">
                <div class="col-12">
                  <Spinner :visible="loadingCommitment" />

                  <button type="button" class="btn btn-secondary btn-sm" @click="reloadData()" :disabled="loading">
                    <i class="float-start bi bi-arrow-clockwise me-2"></i> รีโหลด
                  </button>

                  <template v-if="bill.bill_status !== 'completed' &&
                    bill.id &&
                    acceptedCommitmentDate &&
                    !hasCommitmentDate(bill.commitment_date)
                    ">
                    <button type="button" class="btn btn-primary btn-sm ms-2" @click="submit()" :disabled="loading">
                      <i class="float-start bi bi-clock me-2"></i> จองคิว
                    </button>
                  </template>

                  <template v-if="bill.bill_status !== 'completed' &&
                    bill.id &&
                    hasCommitmentDate(bill.commitment_date)
                    ">
                    <button type="button" class="btn btn-danger btn-sm ms-2" @click="cancelBook()" :disabled="loading">
                      <i class="float-start bi bi-x me-2"></i> ยกเลิกคิว
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <ConfirmCommitment ref="modalConfirm" :data="resultCommitment" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Modal } from 'bootstrap'
import ConfirmCommitment from '@/views/bill/components/ConfirmCommitment.vue'
import { toast } from 'vue3-toastify'
import { useAppStore } from '@/stores/appStore'
import { api } from '@/helpers/api'
import { myCurrency, myFormatDate } from '@/helpers/myformat'
import Spinner from '@/components/Spinner.vue'
import BillPriority from '@/views/bill/components/BillPriority.vue'
import axios from 'axios'
import { formatDate, formatISO, format } from 'date-fns'
import { useBillStore } from '@/stores/billStore'

const emit = defineEmits(['onHide', 'onShow', 'onConfirm', 'onReload'])
const props = defineProps({
  title: {
    type: String,
    default: 'จองคิวทดสอบเครื่องมือ',
  },
  onCancel: {
    type: Function,
  },
})
const appStore = useAppStore()
const billStore = useBillStore()
const bill = computed(() => billStore.bill)
let modalEl = null
let modalRef = ref(null)
const loading = ref(false)
const acceptedCommitmentDate = ref(false)
const modalConfirm = ref(null)

const show = () => {
  modalEl.show()
}
const hide = () => {
  modalEl.hide()
}
const resetForm = () => {

  messageErrorCommitment.value = ''
  messageSuccessCommitment.value = ''
  acceptedCommitmentDate.value = false
}

//  commitment
const loadingCommitment = ref(false)
const resultCommitment = ref()
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const commitmentDate = ref()
const commitmentPriority = ref('medium')
const billId = computed(() => billStore.bill.id)

const getBillById = async () => {
  loading.value = true
  const { data } = await api.get('/v2/bills/' + billId.value)
  if (data) {
    billStore.setBill(data)

    loading.value = false
  }
}

const onChangePriority = (data) => {
  if (commitmentPriority.value !== 'high') {
    commitmentDate.value = ''
  }
}

const findCommitmentDate = async () => {
  resultCommitment.value = {}
  if (commitmentPriority.value === undefined) {
    messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    return
  }
  let jobItems = []
  bill.value.items.filter((item) => {
    if (Boolean(item.product.is_job) === true) {
      let filteredItem = {
        item_id: item.item_id,
        workorder_id: item.item_id,
        item_code: item.item_code,
        duration: item.product?.duration,
        lead_time: item.product?.duration,
        lab_id: item.lab_id,
        product_id: item.product_id,
        sorter: item.sorter,
        sublab_id: item.sublab_id,
        is_job: item.product.is_job,
      }
      jobItems.push(filteredItem)
    }
  })
  const params = {
    priority: commitmentPriority.value,
    bill_id: bill.value.id,
    code: bill.value.code,
    document_date: bill.value.document_date ? formatISO(bill.value.document_date) : '',
    items: jobItems,
  }

  messageErrorCommitment.value = ''
  messageSuccessCommitment.value = ''

  if (commitmentPriority.value === undefined) {
    messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    return
  }
  if (commitmentPriority.value === 'high') {
    if (!commitmentDate.value) {
      messageErrorCommitment.value = 'โปรดระบุ commitment date ที่ต้องการ'
      return
    } else {
      params.commitment_date = commitmentDate.value ? formatISO(commitmentDate.value) : ''
    }
  } else {
    commitmentDate.value = ''
  }



  loadingCommitment.value = true

  try {
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
      })
    console.log('result', data)
    resultCommitment.value = data

    setTimeout(() => {
      resultCommitment.value.data.document_date = bill.value.document_date
      updateCommitmentDate(resultCommitment.value.data)
    }, 200)

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
    loadingCommitment.value = false
  }
}
const onChangeConditionCommitment = (e) => {
  let checked = e.target.checked
  if (checked == false) {
  }
}

const submit = () => {
  if (acceptedCommitmentDate.value === true) {
    findCommitmentDate()
  }
}

const cancelBook = async (event) => {
  resultCommitment.value = {}
  let params = {
    commitment_date: bill.value.commitment_date,
    bill_id: bill.value.id,
  }
  loading.value = true
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
      loading.value = false
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
        position: toast.POSITION.TOP_CENTER,
      })
    })
  if (data.success) {
    loadingCommitment.value = false
    loading.value = false
    toast('ยกเลิกสำเร็จ', {
      theme: 'auto',
      type: 'default',
      dangerouslyHTMLString: true,
      position: toast.POSITION.TOP_CENTER,
    })
    clearCommitmentDate(bill.value.id)
  }
}
const updateCommitmentDate = async (params) => {
  const { data } = await api.post(`/v2/bills/${bill.value.id}/commitment`, params)
  if (data) {
    reloadData()
    toast(data.message, {
      theme: 'auto',
      type: 'success',
      dangerouslyHTMLString: true,
    })
    resetForm()
  }
}
const clearCommitmentDate = async (billId) => {
  const { data, status } = await api.delete(`/v2/bills/${billId}/commitment`)

  if (status == 200) {
    getBillById()
    emit('onReload')
    resetForm()
    hide()
  }
}

const reloadData = async () => {
  getBillById()
  emit('onReload', bill.value)
  loading.value = true
  setTimeout(() => (loading.value = false), 200)
}
const hasCommitmentDate = (date) => {
  if (!date) return false
  if (String(date) === '0000-00-00 00:00:00') return false
  if (String(date) === '0000-00-00') return false
  return true
}
onMounted(() => {
  modalEl = new Modal(modalRef.value)
  var myModal = document.getElementById('modalCommitment')
  myModal.addEventListener('shown.bs.modal', (e) => {
    getBillById()
  })
  myModal.addEventListener('hide.bs.modal', (e) => {
    resetForm()
  })

  document.onkeydown = function (evt) {
    evt = evt || window.event
    var isEscape = false
    if ('key' in evt) {
      isEscape = evt.key === 'Escape' || evt.key === 'Esc'
    } else {
      isEscape = evt.keyCode === 27
    }
    if (isEscape) {
      hide()
    }
  }
})
defineExpose({ show, hide })
</script>

<style lang="scss" scoped>
.commitment {}

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
