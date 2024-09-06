<template>
  <div class="commitment">



    <form @submit="submit()">
      <div class="modal" ref="modalRef" id="modal">
        <div class="modal-dialog modal-dialog-scrollable modal-fullscreen modal-info">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" v-html="title"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- ########################################################### -->

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
                    <!-- <input type="date" v-model="form.commitment_date" name="commitment_date"
                                            id="commitment_date" class="form-control form-control-sm" readonly> -->
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
                  <input type="checkbox" v-model="searchCommitmentDate" @change="onChangeConditionCommitment" />
                  กำหนดวันนัดรับเครื่องมือ
                  <div class="row g-2">
                    <div class="col-12 col-lg-8">
                      <label>Priority</label>
                      <BillPriority v-model="commitmentPriority" />
                    </div>
                    <!-- <div class="col-12 col-lg-4">
                      <label>เลือกวันที่</label>
                      <input type="date" class="form-control-sm form-control" v-model="commitmentDate"
                        placeholder="เลือกวันที่" />
                    </div> -->

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
                        <th scope="col" class="fw-bold">
                          <div>ห้องทดลอง</div>SubLab


                        </th>
                        <th scope="col" class="fw-bold">Cal Hour</th>
                        <th scope="col" class="fw-bold" nowrap>
                          <div>วันนัดรับ</div>Reserved Date

                        </th>
                        <th scope="col" class="">Item Id</th>
                        <th scope="col" class="">Item Code</th>
                        <th scope="col" class="">
                          <div>เครื่องมือ</div>Product


                        </th>
                        <!-- 
                        <th scope="col" class="fw-bold">Barcode</th>

                        <th scope="col" class="fw-bold">S/N.</th>
                        <th scope="col" class="fw-bold">ID No.</th> -->
                        <th scope="col" class="fw-bold">
                          <div>รายละเอียด</div> Test Point


                        </th>
                      </tr>
                    </thead>

                    <tbody v-if="bill.items">
                      <tr v-for="(item, index) in bill.items" :key="index"
                        :class="item.product && item.product.is_job != 1 ? 'text-decoration-line-through' : ''">
                        <td>{{ index + 1 }})</td>
                        <td nowrap>
                          <div>{{ item.sublab?.name_th }} #{{ item.lab_id }}</div>
                          <small class="ms-2 text-danger">{{ item.sublab?.name_th }} #{{ item.sublab_id }}</small>
                        </td>
                        <td>{{ item?.product?.calhour }}</td>
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
                        <td style="min-width: 350px;">

                          <BRow align-h="start" gutter-x="1" style="font-size: 13px;">
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Id.No</div>
                              <div class="d-block">{{ item?.id_no }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Model</div>
                              <div class="d-item">{{
                                (item.model)
                              }}
                              </div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">S/N</div>
                              <div class="d-block">{{ item.serialnumber }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Barcode</div>
                              <div class="d-block">{{
                                (item.barcode_no)
                              }}
                              </div>
                            </BCol>
                          </BRow>
                          <BBadge v-if="item.manufaturer_name" variant="warning me-2">{{ item?.manufaturer_name }}
                          </BBadge>
                          <span v-if="item.product && item.product.is_job">
                            {{ item.product_name }}</span>
                        </td>
                        <!-- <td>
                          <span>{{ item?.barcode_no }}</span>
                        </td>

                        <td>
                          <span>{{ item?.serialnumber }}</span>
                        </td>
                        <td>
                          <span>{{ item?.id_no }}</span>
                        </td> -->
                        <td style="min-width: 350px;">

                          <BRow align-h="start" gutter-x="1" style="font-size: 13px;">
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Range</div>
                              <div class="d-block">{{ item?.range_value }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Range Price</div>
                              <div class="d-item">{{
                                myCurrency(item.range_price)
                              }}
                              </div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Point</div>
                              <div class="d-block">{{ item.point }}</div>
                            </BCol>
                            <BCol sm="3" alignSelf="center">
                              <div class="text-decoration-underline fw-bold">Pont Price</div>
                              <div class="d-block">{{
                                myCurrency(item.point_price)
                              }}
                              </div>
                            </BCol>
                          </BRow>
                          {{ item.test_point }}
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
                  <Spinner :visible="loadingCommitment" />

                  <button type="button" class="btn btn-secondary btn-sm" @click="reloadData()">
                    <i class="float-start bi bi-arrow-clockwise me-2"></i> รีโหลดข้อมูล
                  </button>

                  <template v-if="bill.bill_status !== 'completed'">
                    <button type="button" class="btn btn-primary btn-sm  ms-2" @click="submit()">
                      <i class="float-start bi bi-clock me-2"></i> เริ่มคำนวณ
                    </button>
                  </template>

                  <template v-if="(bill.commitment_date) && bill.bill_status !== 'completed'">
                    <button type="button" class="btn btn-danger btn-sm ms-2" @click="cancelBook()">
                      <i class="float-start bi bi-x me-2"></i> ยกเลิกจองคิว
                    </button>
                  </template>


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
const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel }
  = useConfirmDialog()

const emit = defineEmits(['onHide', 'onShow', 'onConfirm', 'Onreload'])
const props = defineProps({
  title: {
    type: String,
    default: 'จองคิวทดสอบเครื่องมือ',
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
  setTimeout(() => reloadData(), 2000)
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
const loadingCommitment = ref(false)
const resultCommitment = ref()
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const commitmentDate = ref()
const commitmentPriority = ref('medium')
const commitmentDateFinal = computed(() => {

  if (resultCommitment.value && resultCommitment.value.data.items !== undefined) {
    let items = resultCommitment.value.data.items || []
    let temp = []
    items.map((item) => {
      temp.push(new Date(item.reserved_date))
    })
    console.log(temp);
    let maxDate = new Date(Math.max.apply(null, temp))
    return formatISO(maxDate)
  }
  return;
})
const findCommitmentDate = async () => {
  if (commitmentPriority.value === undefined) {
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

  if (commitmentPriority.value === undefined) {
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

    resultCommitment.value = data
    console.log("result", resultCommitment.value);
    console.log("date", commitmentDateFinal.value);

    setTimeout(() => {
      resultCommitment.value.data.document_date = props.bill.document_date
      resultCommitment.value.data.commitment_date = commitmentDateFinal.value
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
    if (data.message !== undefined) {
      toast(data.message, {
        theme: 'auto',
        type: 'default',
        dangerouslyHTMLString: true,
      })
    }
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
const updateCommitmentDate = async () => {
  const params = resultCommitment.value.data
  const { data } = await api.post(`/v2/bills/${props.bill.id}/commitment`, params)
  if (data) {
    toast(data.message, {
      theme: 'auto',
      type: 'success',
      dangerouslyHTMLString: true,
    })
    confirmCommitmentToKanban(params)
    setTimeout(() => {
      emit('update:bill', data)
      reloadData()
    }, 3000)
  }
}
const clearCommitmentDate = async (billId) => {
  const { data, status } = await api.delete(`/v2/bills/${billId}/commitment`)

  if (status == 200) {
    emit("update:bill", data.data)
  }
}

const reloadData = async () => {
  emit('onReload', props.bill)
  loading.value = true;
  setTimeout(() => loading.value = false, 2000)
}

onMounted(() => {
  modalEl = new Modal(modalRef.value)
  console.log(modalEl);
  var myModal = document.getElementById('modal')
  myModal.addEventListener("shown.bs.modal", (e) => {
    messageErrorCommitment.value = ""
    messageSuccessCommitment.value = ""
  })
  myModal.addEventListener("hide.bs.modal", (e) => {
    messageErrorCommitment.value = ""
    messageSuccessCommitment.value = ""
  })

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
      isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
      hide()
    }
  };

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

