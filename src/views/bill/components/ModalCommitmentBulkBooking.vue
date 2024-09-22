<template>
  <div class="commitment">
    <form @submit="submit()">
      <div class="modal" ref="modalRef" id="modalBulk">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" :class="type == 'BOOK' ? 'text-primary' : ' text-danger'">
                {{ type == 'BOOK' ? 'จองคิว' : 'ยกเลิกจองคิว' }}
              </h5>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style="font-size: 2rem"
              ></button>
            </div>
            <div class="modal-body">
              <!-- ########################################################### -->

              <!-- #####################START######################## -->
              <form @submit.prevent="onSearch()" v-if="billSelected">
                <!-- ใบขอรับบริการ
                                <BBadge variant="danger">{{ bills.length }}</BBadge> รายการ -->
                <Spinner :visible="loading" class="me-2" />
                <h6 class="mt-3">ใบขอรับบริการ ({{ billSelected.length }})</h6>

                <div class="accordion mb-2" id="accordionBills" v-if="!loading">
                  <div class="accordion-item" v-for="(bill, bKey) in billSelected" :key="bKey">
                    <div class="accordion-header">
                      <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#collapse${bKey}`"
                        aria-expanded="true"
                        :aria-controls="`#collapse${bKey}`"
                      >
                        <div class="d-flex flex-wrap gap-2 justify-content-between">
                          <div class="">
                            {{ bKey + 1 }})
                            <div class="mx-2 fw-bold d-inline-block" style="min-width: 125px">
                              {{ bill?.code }} {{ bill?.bill_id }}
                            </div>
                          </div>

                          <div>
                            <i class="bi bi-calendar me-1"></i
                            >{{ myFormatDate(bill.document_date) }}
                            <BBadge
                              variant="success"
                              v-if="hasCommitmentDate(bill.commitment_date)"
                            >
                              {{ myFormatDate(bill.commitment_date) }}</BBadge
                            >
                          </div>

                          <div class="d-none d-md-block">{{ bill?.address_name }}</div>
                          <div class="" v-if="bill && bill.items">({{ bill.items.length }})</div>
                          <div><BillStatus :status="bill.bill_status" /></div>
                        </div>
                      </button>
                    </div>
                    <div
                      :id="`collapse${bKey}`"
                      class="accordion-collapse collapse"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body" style="overflow-y: scroll; height: 250px">
                        <div class="d-block d-md-none">{{ bill?.address_name }}</div>
                        <p v-if="bill" class="text-danger p-1">
                          {{ bill?.note_customers }}
                        </p>
                        <BTableSimple
                          class=""
                          bordered
                          hover
                          small
                          style=""
                          v-if="bill && bill.items"
                        >
                          <BThead>
                            <BTr>
                              <BTh class="text-center">ลำดับ</BTh>
                              <BTh>ItemID</BTh>
                              <BTh>ItemCode</BTh>
                              <BTh class="text-left">เครื่องมือ</BTh>
                              <BTh class="text-left">ID NO.</BTh>
                              <BTh class="text-left">Model</BTh>
                              <BTh class="text-left">Serial Number</BTh>
                              <BTh>ห้องทดลอง</BTh>
                              <BTh>CalHour</BTh>
                              <BTh>Duration</BTh>
                              <BTh>Reserved Date</BTh>
                              <BTh class="text-center">สถานะ</BTh>
                            </BTr>
                          </BThead>
                          <BTbody v-if="bill.items">
                            <BTr v-for="(item, itemIndex) in bill.items" :key="itemIndex">
                              <BTd class="text-center">
                                {{ itemIndex + 1 }}
                              </BTd>
                              <BTd class="">
                                {{ item?.workorder_id }}
                              </BTd>

                              <BTd class="" nowrap>
                                <div>{{ item?.item_code }}</div>
                                <BBadge variant="info" v-if="Boolean(item.product.is_job)"
                                  >JOB</BBadge
                                >
                              </BTd>
                              <BTd>
                                {{ item?.product_name }}
                              </BTd>
                              <BTd class="text-left">
                                {{ item?.id_no }}
                              </BTd>
                              <BTd class="text-left">
                                {{ item?.model }}
                              </BTd>
                              <BTd class="text-left">
                                {{ item?.serialnumber }}
                              </BTd>
                              <BTd class="">
                                {{ item?.lab?.name_th }} #{{ item.lab_id }}
                                <div>
                                  <small class="fw-bold text-danger"
                                    >{{ item?.sublab?.name_th }} #{{ item.sublab_id }}</small
                                  >
                                </div>
                              </BTd>
                              <BTd class="">{{ item?.product?.calhour }} (ชม.)</BTd>
                              <BTd class="">{{ item?.product?.duration }} (นาที)</BTd>
                              <BTd class="">
                                <span v-if="hasCommitmentDate(item.reserved_date)">
                                  {{ myFormatDate(item.reserved_date).toLocaleString() }}</span
                                >
                              </BTd>

                              <BTd class="text-center">
                                <JobStatus v-model="item.job_status" />
                                <div>{{ item.service_status_id }}</div>
                              </BTd>
                            </BTr>
                          </BTbody>
                        </BTableSimple>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="props.type == 'CANCEL'" class="border p-2">
                  <div class="row g-3">
                    <div class="col-12 col-lg-4">
                      <div class="mt-4 ms-3">
                        <input type="checkbox" class="" v-model="acceptedCancel" />
                        <label class="ms-1">ยืนยันยกเลิกจองคิวห้องทดลอง</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="props.type == 'BOOK'" class="border p-2">
                  <div class="row g-3">
                    <div class="col-12 col-lg-4">
                      <label>Priority</label>
                      <BillPriority v-model="commitmentPriority" @onChange="onChangePriority" />
                    </div>
                    <div class="col-12 col-lg-4" v-if="commitmentPriority == 'high'">
                      <label>เลือกวันที่</label>
                      <input
                        type="date"
                        class="form-control-sm form-control"
                        v-model="commitmentDate"
                        placeholder="เลือกวันที่"
                      />
                    </div>
                    <div class="col-12 col-lg-4">
                      <div class="mt-4 ms-3">
                        <input
                          type="checkbox"
                          class=""
                          v-model="acceptedCommitmentDate"
                          @change="onChangeConditionCommitment"
                        />
                        <label class="ms-1">ยืนยันจองคิวห้องทดลอง</label>
                      </div>
                    </div>
                  </div>
                  <Spinner :visible="loadingCommitment" class="me-2" />
                  <div v-if="messageErrorCommitment" class="alert alert-danger">
                    {{ messageErrorCommitment }}
                  </div>
                </div>
              </form>

              <section v-if="listErrors && listErrors.length > 0">
                <h6 class="mt-3">ผลลัพธ์</h6>
                <BTableSimple class="my-3" small caption-top responsive bordered>
                  <BThead head-variant="dark">
                    <BTr>
                      <BTh width="200">เลขที่ใบขอรับ</BTh>
                      <BTh width="200">Commitment Date</BTh>
                      <BTh>ผลลัพธ์</BTh>
                    </BTr>
                  </BThead>
                  <BTbody>
                    <BTr
                      v-for="(err, key) in listErrors"
                      :key="key"
                      class=""
                      :class="err.type == 'error' ? 'text-danger' : 'text-success'"
                    >
                      <BTd class="" nowrap>{{ err.bill.code }}</BTd>

                      <BTd :class="err.type == 'error' ? 'text-danger' : 'text-success'">{{
                        err.bill.commitment_date
                      }}</BTd>
                      <BTd :class="err.type == 'error' ? 'text-danger' : 'text-success'">{{
                        err.message
                      }}</BTd>
                    </BTr>
                  </BTbody>
                </BTableSimple>
              </section>

              <!-- ########################################################### -->
            </div>
            <div class="modal-footer">
              <div class="row g-1">
                <div class="col-12">
                  <button
                    type="button"
                    :disabled="loading"
                    class="btn btn-secondary btn-sm"
                    @click="reloadData()"
                  >
                    <i class="float-start bi bi-arrow-clockwise me-2"></i> รีโหลด
                  </button>

                  <template v-if="bills && bills.length > 0 && type == 'BOOK'">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm ms-2"
                      :disabled="loading || !acceptedCommitmentDate"
                      @click="submit()"
                    >
                      <i class="float-start bi bi-clock me-2"></i> จองคิว
                    </button>
                  </template>
                  <template v-if="bills && bills.length > 0 && type == 'CANCEL'">
                    <button
                      type="button"
                      class="btn btn-danger btn-sm ms-2"
                      :disabled="loading || !acceptedCancel"
                      @click="cancelBook()"
                    >
                      <i class="float-start bi bi-ban me-2"></i> ยกเลิกจองคิว
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

  <BModal
    v-if="visibleModalConfirmBook"
    v-model="visibleModalConfirmBook"
    id="modal-confirm-book"
    cancel-title="ยกเลิก"
    ok-title="ใช่"
    @ok="findCommitmentDate()"
    @cancel="visibleModalConfirmBook = false"
    title="ยืนยันจองคิวห้องทดลอง"
  >
    <div class="row g3 mb-2">
      <div class="col-4 fw-bold">Priority</div>
      <div class="col-8">{{ commitmentPriority }}</div>
    </div>
    <div class="row g3 mb-2">
      <div class="col-4 fw-bold">Commitment Date</div>
      <div class="col-8">{{ commitmentDate ? showDateTimeZone(commitmentDate) : '' }}</div>
    </div>
    <div class="row g3 mb-2">
      <div class="col-4 fw-bold">ใบขอรับบริการ</div>
      <div class="col-8">{{ billSelectedFilterd ? billSelectedFilterd.length : 0 }}</div>
    </div>
    <div class="d-flex flex-wrap gap-2">
      <div v-for="item in billSelectedFilterd" :key="item">
        <div class="border bg-secondary text-white p-1">{{ item.code }}</div>
      </div>
    </div>
  </BModal>
  <BModal
    v-if="visibleModalCancelBook"
    v-model="visibleModalCancelBook"
    id="modal-cancel-book"
    cancel-title="ไม่ใช่"
    ok-title="ใช่, ยกเลิก"
    @cancel="visibleModalCancelBook = false"
    title="ยืนยันยกเลิกคิวห้องทดลอง"
  >
  </BModal>
</template>

<script setup>
import { ref, onMounted, computed, watch, inject } from 'vue'
import { Modal } from 'bootstrap'
import ConfirmCommitment from '@/views/bill/components/ConfirmCommitment.vue'
import { toast } from 'vue3-toastify'
import BillButtonStatus from '@/views/bill/components/BillButtonStatus.vue'
import BillStatus from '@/views/bill/components/BillStatus.vue'
import JobButtonStatus from '@/views/bill/components/JobButtonStatus.vue'
import { useAppStore } from '@/stores/appStore'
import { api } from '@/helpers/api'
import { myCurrency, myFormatDate } from '@/helpers/myformat'
import Spinner from '@/components/Spinner.vue'
import BillPriority from '@/views/bill/components/BillPriority.vue'
import axios from 'axios'
import { formatDate, formatISO, format } from 'date-fns'
import JobStatus from './JobStatus.vue'

const emit = defineEmits(['onHide', 'onShow', 'onConfirm', 'onReload', 'onComplete'])
const props = defineProps({
  type: {
    type: String,
    default: 'BOOK',
  },
  title: {
    type: String,
    default: 'จองคิวห้องทดลอง',
  },
  onCancel: {
    type: Function,
  },
  bills: {
    type: Object,
    default: () => [],
  },
})
const appStore = useAppStore()

let modalEl = null
let modalRef = ref(null)

const show = () => {
  listErrors.value = []
  modalEl.show()
}

const hide = () => {
  modalEl.hide()
}

const loading = ref(false)
const acceptedCommitmentDate = ref(false)
const visibleModalConfirmBook = ref(false)
const visibleModalCancelBook = ref(false)
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
const loadingCommitment = ref(false)
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const acceptedCancel = ref(false)
const commitmentDate = ref()
const commitmentPriority = ref('medium')

const billSelected = ref([])
const billSelectedFilterd = computed(() => {
  return billSelected.value
})

const submit = () => {
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
    }
  } else {
    commitmentDate.value = ''
  }

  if (acceptedCommitmentDate.value === true) {
    visibleModalConfirmBook.value = true
  }
}

const resetForm = () => {
  billSelected.value = []
  listErrors.value = []
  messageErrorCommitment.value = ''
  messageSuccessCommitment.value = ''
  acceptedCancel.value = false
  acceptedCommitmentDate.value = false
}
const showDateTimeZone = (date) => {
  return date ? format(new Date(date), 'dd/MM/yyyy HH:mm z') : ''
}
const getItems = () => {
  billSelected.value = []
  loading.value = true
  if (props.bills.length == 0) {
    return []
  }
  billSelected.value = props.bills.map((bill, index) => {
    let _items = []
    api
      .get('v2/bills/' + bill.id)
      .then(({ data, status }) => {
        if (data.items) {
          bill.items = data.items.map((item) => {
            if (Number(item.product.is_job) == 1) {
              let filteredItem = {
                duration: item.product?.duration,
                item_code: item.item_code,
                lab_id: item.lab_id,
                product_id: item.product_id,
                product_name: item.product_name,
                product: item?.product,
                barcode_no: item.barcode_no,
                serialnumber: item.serialnumber,
                id_no: item.id_no,
                model: item.model,
                sorter: item.sorter,
                sublab_id: item.sublab_id,
                sublab: item.sublab,
                lab: item.lab,
                workorder_id: item.item_id,
                service_status_id: item.service_status_id,
                is_job: item.product.is_job,
                reserved_date: item?.reserved_date,
              }
              _items.push(filteredItem)
              return filteredItem
            }
          })
        }
        loading.value = false
        bill.bill_id = bill.id
        bill.priority = commitmentPriority.value
      })
      .catch((err) => (loading.value = false))
    return bill
  })
}

const listErrors = ref([])

const hasCommitmentDate = (date) => {
  if (!date) return false
  if (String(date) === '0000-00-00 00:00:00') return false
  if (String(date) === '0000-00-00') return false
  return true
}

const findCommitmentDate = async () => {
  listErrors.value = []
  if (commitmentPriority.value === undefined) {
    messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    return
  }

  loadingCommitment.value = true
  let totalBill = billSelected.value.length
  let loopCount = 0
  billSelected.value.map(async (bill, index) => {
    if (commitmentPriority.value !== 'high') {
      delete bill.commitment_date
    } else {
      bill.commitment_date = commitmentDate.value ? formatISO(commitmentDate.value) : ''
    }

    bill.priority = commitmentPriority.value
    const { data } = await axios
      .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills', bill, {
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
        bill._error = messageErrorCommitment.value
        listErrors.value.push({
          type: 'error',
          code: bill.code,
          message: messageErrorCommitment.value,
          bill: bill,
        })
        loopCount += 1
      })

    if (data.success) {
      let message = `ประมวลผลตารางคิวงานสำเร็จ`
      messageSuccessCommitment.value = message
      const params = data.data
      loadingCommitment.value = true
      const resultBill = await api.post(`/v2/bills/${params.bill_id}/commitment`, params)
      if (resultBill.data) {
        const billData = resultBill?.data?.data
        bill._success = messageSuccessCommitment.value
        bill.commitment_date = formatISO(billData?.commitment_date)
        toast(resultBill.data?.message || message, {
          theme: 'auto',
          type: 'success',
          position: toast.POSITION.TOP_CENTER,
          dangerouslyHTMLString: true,
        })
        listErrors.value.push({
          type: 'success',
          code: bill.code,
          message: messageSuccessCommitment.value,
          bill: billData,
        })
        loopCount += 1
        loadingCommitment.value = false
      }
    } else {
      messageErrorCommitment.value = data.message
      bill._error = messageErrorCommitment.value
      loadingCommitment.value = false
    }
    if (totalBill == loopCount) {
      getItems()
      emit('onComplete', loopCount)
    }
    return bill
  })
}

const onChangeConditionCommitment = (e) => {
  let checked = e.target.checked
  if (checked == false) {
  }
}

const cancelBook = () => {
  let totalBill = billSelected.value.length
  let loopCount = 0
  billSelected.value.map(async (bill, billIndex) => {
    const rsCancel = await axios
      .delete(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills?bill_id=' + bill.id, {
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
        listErrors.value.push({
          type: 'error',
          message: messageErrorCommitment.value,
          bill: bill,
        })
        loopCount += 1
        toast(messageErrorCommitment, {
          theme: 'auto',
          type: 'default',
          dangerouslyHTMLString: true,
        })
      })
    if (rsCancel.status == 200) {
      const { data, status } = await api.delete(`/v2/bills/${bill.id}/commitment`)
      bill.commitment_date = ''
      loadingCommitment.value = false
      console.log(data, status)
      if (data.success) {
        loopCount += 1
        listErrors.value.push({
          type: 'success',
          message: 'ยกเลิกคิวจองสำเร็จ',
          bill: bill,
        })
        toast('ยกเลิกสำเร็จ', {
          theme: 'auto',
          type: 'default',
          dangerouslyHTMLString: true,
        })
      }
    }
    console.log(totalBill, loopCount)
    if (totalBill == loopCount) {
      getItems()
      emit('onComplete', loopCount)
    }
    return bill
  })
}

const reloadData = async () => {
  // emit('onReload', props.bills)
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}

onMounted(() => {
  modalEl = new Modal(modalRef.value)
  var myModal = document.getElementById('modalBulk')
  myModal.addEventListener('shown.bs.modal', (e) => {
    if (props.bills) {
      getItems()
    }
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
      emit('update:bills', [])
      billSelected.value = []
    }
  }
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
