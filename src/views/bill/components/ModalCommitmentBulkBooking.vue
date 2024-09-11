<template>
  <div class="commitment">
    <form @submit="submit()">
      <div class="modal" ref="modalRef" id="modalBulk">
        <div class="modal-dialog modal-dialog-scrollable modal-fullscreen modal-info">
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <h5 class="modal-title text-white" v-html="title"></h5>

              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                style="font-size: 2rem"></button>
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
                    <h2 class="accordion-header">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        :data-bs-target="`#collapse${bKey}`" aria-expanded="true" :aria-controls="`#collapse${bKey}`">
                        <div class="d-flex flex-wrap gap-2 justify-content-between">
                          <div class="">
                            {{ bKey + 1 }})
                            <div class="mx-2 fw-bold d-inline-block" style="min-width: 125px">
                              {{ bill?.code }} {{ bill?.bill_id }}
                            </div>
                          </div>

                          <div>
                            <i class="bi bi-calendar me-1"></i>{{ myFormatDate(bill.document_date) }}
                            <BBadge variant="success" v-if="hasCommitmentDate(bill.commitment_date)">
                              {{ myFormatDate(bill.commitment_date) }}</BBadge>
                          </div>

                          <div class="d-none d-md-block">{{ bill?.address_name }}</div>
                          <div class="" v-if="bill && bill.items">({{ bill.items.length }})</div>
                        </div>
                      </button>
                    </h2>
                    <div :id="`collapse${bKey}`" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                      <div class="accordion-body" style="overflow-y: scroll; height: 180px">
                        <div class="d-block d-md-none">{{ bill?.address_name }}</div>
                        <p v-if="bill" class="text-danger p-1">
                          {{ bill?.note_customers }}
                        </p>
                        <BTableSimple class="" bordered hover small style="" v-if="bill && bill.items">
                          <BThead>
                            <BTr>
                              <BTh class="text-center">ลำดับ</BTh>
                              <BTh>ItemID</BTh>
                              <BTh>ItemCode</BTh>
                              <BTh>ห้องทดลอง</BTh>
                              <BTh>วันนัดรับ</BTh>
                              <BTh class="text-left">เครื่องมือ</BTh>
                              <BTh class="text-left">ID NO.</BTh>
                              <BTh class="text-left">Model</BTh>
                              <BTh class="text-left">Serial Number</BTh>
                              <BTh class="text-center">สถานะ</BTh>
                            </BTr>
                          </BThead>
                          <BTbody>
                            <BTr v-for="(item, itemIndex) in bill.items" :key="itemIndex">
                              <BTd class="text-center">
                                {{ itemIndex + 1 }}
                              </BTd>
                              <BTd class="">
                                {{ item.workorder_id }}
                              </BTd>

                              <BTd class="">
                                {{ item.item_code }}

                              </BTd>
                              <BTd class="">
                                {{ item.lab?.name_th }} #{{ item.lab_id }}
                                <div>
                                  <small class="fw-bold text-danger">{{ item?.sublab?.name_th }} #{{ item.sublab_id
                                  }}</small>
                                </div>
                              </BTd>
                              <BTd class="">

                                <span v-if="hasCommitmentDate(item.reserved_date)">

                                  {{ myFormatDate(item.reserved_date).toLocaleString() }}</span>
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
                              <BTd class="text-center">

                                <JobStatus v-model="item.job_status" />
                                <div> {{ item.service_status_id }}</div>
                              </BTd>
                            </BTr>
                          </BTbody>
                        </BTableSimple>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border p-2">
                  <input type="checkbox" v-model="searchCommitmentDate" @change="onChangeConditionCommitment" />
                  กำหนดวันนัดรับเครื่องมือ
                  <div class="row g-2">
                    <div class="col-8 col-lg-8">
                      <label>Priority</label>
                      <BillPriority v-model="commitmentPriority" />
                    </div>
                    <div class="col-4 col-lg-4">
                      <Spinner :visible="loadingCommitment" />
                    </div>
                  </div>
                </div>
              </form>
              <section v-if="listErrors && listErrors.length > 0">
                <h6 class="mt-3">ผลลัพธ์</h6>
                <BTableSimple class="my-3" small caption-top responsive bordered>
                  <BThead head-variant="dark">
                    <BTr>
                      <BTh width="200">เลขที่ใบขอรับ</BTh>
                      <BTh width="200">วันนัดรับ</BTh>
                      <BTh>ผลลัพธ์</BTh>
                    </BTr>
                  </BThead>
                  <BTbody>
                    <BTr v-for="(err, key) in listErrors" :key="key" class=""
                      :class="err.type == 'error' ? 'text-danger' : 'text-success'">
                      <BTd class="" nowrap>{{ err.code }}</BTd>

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
                  <button type="button" :disabled="loading" class="btn btn-secondary btn-sm" @click="reloadData()">
                    <i class="float-start bi bi-arrow-clockwise me-2"></i> รีโหลดข้อมูล
                  </button>

                  <template v-if="bills && bills.length > 0">
                    <button type="button" class="btn btn-primary btn-sm ms-2" :disabled="loading || Boolean()"
                      @click="submit()">
                      <i class="float-start bi bi-clock me-2"></i> เริ่มคำนวณ
                    </button>
                  </template>
                  <!--
                                    <template v-if="bill.bill_status !== 'completed'">
                                        <button type="button" class="btn btn-danger btn-sm ms-2" @click="cancelBook()">
                                            <i class="float-start bi bi-x me-2"></i> ยกเลิกจองคิว
                                        </button>
                                    </template> 
                                
                                -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <BModal v-if="visibleModalConfirmBook" v-model="visibleModalConfirmBook" id="modal-confirm-book" cancel-title="ยกเลิก"
    ok-title="ใช่" @ok="findCommitmentDate()" @cancel="visibleModalConfirmBook = false" title="ยืนยันจองคิวห้องทดลอง">
    <div class="d-flex flex-wrap gap-2">
      <div v-for="item in billSelectedFilterd" :key="item">
        <div class="border bg-dark text-white p-1">{{ item.code }}</div>
      </div>
    </div>
  </BModal>
  <BModal v-if="visibleModalCancelBook" v-model="visibleModalCancelBook" id="modal-cancel-book" cancel-title="ไม่ใช่"
    ok-title="ใช่, ยกเลิก" @cancel="visibleModalCancelBook = false" title="ยืนยันยกเลิกคิวห้องทดลอง">
  </BModal>
</template>

<script setup>
import { ref, onMounted, computed, watch, inject } from 'vue'
import { Modal } from 'bootstrap'
import ConfirmCommitment from '@/views/bill/components/ConfirmCommitment.vue'
import { toast } from 'vue3-toastify'
import BillButtonStatus from '@/views/bill/components/BillButtonStatus.vue'
import JobButtonStatus from '@/views/bill/components/JobButtonStatus.vue'
import { useConfirmDialog } from '@vueuse/core'
import { useAppStore } from '@/stores/appStore'
import { api } from '@/helpers/api'
import { myCurrency, myFormatDate } from '@/helpers/myformat'
import Spinner from '@/components/Spinner.vue'
import BillPriority from '@/views/bill/components/BillPriority.vue'
import axios from 'axios'
import { formatDate, formatISO } from 'date-fns'
import JobStatus from './JobStatus.vue'

const emit = defineEmits(['onHide', 'onShow', 'onConfirm', 'onReload', 'onComplete'])
const props = defineProps({
  title: {
    type: String,
    default: 'จองคิวทดสอบเครื่องมือ',
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
const searchCommitmentDate = ref(true)
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
const resultCommitment = ref()
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const commitmentDate = ref()
const commitmentPriority = ref('medium')

const billSelected = ref([])
const billSelectedFilterd = computed(() => billSelected.value)

const submit = () => {
  if (searchCommitmentDate.value === true) {
    visibleModalConfirmBook.value = true
  }
}

const resetForm = () => {
  billSelected.value = []
  listErrors.value = []
  messageErrorCommitment.value = ''
  messageSuccessCommitment.value = ''
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
                duration: parseInt(item.product?.duration),
                item_code: item.item_code,
                lab_id: item.lab_id,
                product_id: item.product_id,
                product_name: item.product_name,
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
        let params = {
          priority: commitmentPriority.value,
          bill_id: bill.id,
          code: bill.code,
          document_date: bill.document_date,
          address_name: bill?.address_name,
          agent_name: bill?.agent_name,
          bill_status: bill?.bill_status,
          progress_status: bill?.progress_status,
          note_customers: bill?.note_customers,
          remark: bill?.remark,
          user_start: bill?.user_start,
          company_id: bill?.company_id,
          approve_status: bill?.approve_status,
          approver_name: bill?.approver_name,
          items: _items,
        }
        bill.bill_id = bill.id;
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

  messageErrorCommitment.value = ''
  messageSuccessCommitment.value = ''

  loadingCommitment.value = true
  let totalBill = billSelected.value.length
  let loopCount = 0
  billSelected.value.map(async (bill, index) => {
    delete bill.commitment_date
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

    loadingCommitment.value = false
    if (data.success) {
      let message = `ประมวลผลตารางคิวงานสำเร็จ`
      messageSuccessCommitment.value = message
      const params = data.data
      const resultBill = await api.post(`/v2/bills/${params.bill_id}/commitment`, params)
      if (resultBill.data) {
        const billData = resultBill?.data?.data
        console.log('bill', billData)
        bill._success = messageSuccessCommitment.value
        bill.commitment_date = billData?.commitment_date
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
      }
    } else {
      messageErrorCommitment.value = data.message
      bill._error = messageErrorCommitment.value
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
    commitmentDate.value = null
  }
}

const cancelBook = async (event) => {
  let params = {
    commitment_date: props.bill.commitment_date,
    bill_id: props.bill.id,
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
    clearCommitmentDate(props.bill.id)
    loadingCommitment.value = false
    toast('ยกเลิกสำเร็จ', {
      theme: 'auto',
      type: 'default',
      dangerouslyHTMLString: true,
    })
    setTimeout(() => reloadData(), 500)
  }
}
const clearCommitmentDate = async (billId) => {
  const { data, status } = await api.delete(`/v2/bills/${billId}/commitment`)

  if (status == 200) {
    emit('update:bill', data.data)
  }
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
