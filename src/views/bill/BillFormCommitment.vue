<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import BillPriority from '@/views/bill/components/BillPriority.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { myCurrency, myFormatDate } from '@/helpers/myformat'
import { useAppStore } from '@/stores/appStore'
import ConfirmCommitment from './components/ConfirmCommitment.vue'
import { toast } from 'vue3-toastify'
import BillButtonStatus from '@/views/bill/components/BillButtonStatus.vue'
import JobButtonStatus from '@/views/bill/components/JobButtonStatus.vue'

const route = useRoute()
const appStore = useAppStore()
const loading = ref(false)
const searchCommitmentDate = ref(true)
const modalConfirm = ref(null)
const items = computed(() => form.value?.items || [])
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
const billCode = computed(() => route.params?.code)
console.log(billCode.value)
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
  form.value.items.filter((item) => {
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
    bill_id: form.value.id,
    code: form.value.code,
    // document_date: d1 ? formatISO(toZonedTime(form.value.document_date, timezone)) : '',
    // commitment_date: d2 ? formatISO(toZonedTime(d2, timezone)) : '',
    document_date: form.value.document_date,
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
    console.log(resultCommitment.value)
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
      setTimeout(() => {
        loadData()
      }, 3000)
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
  if (billCode.value) {
    const { data } = await api.get('/v2/bills/code/' + billCode.value, {
      onlyjob: 'yes',
    })
    if (data) form.value = data
  }
}

loadData()
</script>
<template>
  <div class="pagetitle">
    <h1>Bills</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item">
          <router-link to="/bills">ใบขอรับบริการ</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link :to="`/bills/code/${billCode}`">{{ billCode }}</router-link>
        </li>
        <li class="breadcrumb-item active">Commitment Date</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body pt-3">
            <spinner :visible="loading" />

            <!-- #####################START######################## -->
            <form @submit.prevent="onSearch()">
              <div class="d-flex flex-wrap gap-3">
                <div class="">
                  <label class="text-decoration-underline">Bill ID</label>
                  <p class="">{{ form.id }}</p>
                </div>
                <div class="">
                  <label class="text-decoration-underline">Bill Code</label>
                  <p class="">{{ form.code }}</p>
                </div>

                <div class="">
                  <label class="text-decoration-underline">วันที่เอกสาร</label>
                  <p>
                    {{ myFormatDate(form.document_date) }}
                  </p>
                </div>
                <div class="">
                  <label class="text-decoration-underline">วันนัดรับเครื่องมือ</label>
                  <template v-if="form.commitment_date">
                    <p>
                      {{ myFormatDate(form.commitment_date) }}
                    </p>
                  </template>
                  <template v-else>
                    <p>-</p>
                  </template>
                  <!-- <input type="date" v-model="form.commitment_date" name="commitment_date"
                                            id="commitment_date" class="form-control form-control-sm" readonly> -->
                </div>
                <div class="">
                  <label class="text-decoration-underline">ลูกค้า</label>
                  <p>
                    {{ form.customer?.companyname }}
                  </p>
                </div>
                <div class="">
                  <label class="text-decoration-underline">Note Customer</label>
                  <p class="text-danger">
                    {{ form.note_customers }}
                  </p>
                </div>
                <div class="">
                  <label class="text-decoration-underline">Remark</label>
                  <p class="">
                    {{ form.remark }}
                  </p>
                </div>
              </div>

              <div class="border p-3 bg-info rounded">
                <input
                  type="checkbox"
                  v-model="searchCommitmentDate"
                  @change="onChangeConditionCommitment"
                />
                หาวันนัดรับเครื่องมือ
                <div class="row g-2">
                  <div class="col-12 col-lg-8">
                    <label>Priority</label>
                    <BillPriority v-model="commitmentPriority" />
                  </div>
                  <div class="col-12 col-lg-4">
                    <label>เลือกวันที่</label>
                    <input
                      type="date"
                      class="form-control-sm form-control"
                      v-model="commitmentDate"
                      placeholder="เลือกวันที่"
                    />
                  </div>

                  <div class="col-12">
                    <div v-if="messageErrorCommitment" class="alert alert-danger">
                      {{ messageErrorCommitment }}
                    </div>
                    <div v-if="messageSuccessCommitment" class="alert alert-success">
                      {{ messageSuccessCommitment }}
                      <div>
                        <span class="mx-2">วันที่เอกสาร</span>
                        {{
                          myFormatDate(resultCommitment.data.document_date, {
                            hideTime: true,
                          })
                        }}
                        <span class="mx-2">งานเสร็จวันที่</span>
                        {{
                          myFormatDate(resultCommitment.data.commitment_date, {
                            hideTime: true,
                          })
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row g-1">
                  <div class="col-12">
                    <Spinner :visible="loadingCommitment" />
                    <button type="button" class="btn btn-secondary btn-sm" @click="loadData()">
                      <i class="float-start bi bi-arrow-clockwise me-2"></i> รีโหลดข้อมูล
                    </button>
                    <template v-if="bill?.bill_status !== 'completed'">
                      <button type="button" class="btn btn-primary btn-sm ms-2" @click="submit()">
                        <i class="float-start bi bi-clock me-2"></i> เริ่มคำนวณ
                      </button>
                    </template>
                    <template v-if="form.commitment_date && bill?.bill_status !== 'completed'">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm ms-2"
                        @click="cancelBook()"
                      >
                        <i class="float-start bi bi-x me-2"></i> ยกเลิกจองคิว
                      </button>
                    </template>
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
                      <th scope="col" nowrap>รหัสงาน<br />Item Id</th>
                      <th scope="col" nowrap>เลขที่งาน<br />Item Code</th>
                      <th scope="col">ห้องทดลอง<br />SubLab</th>
                      <th scope="col" nowrap><br />Lead Time</th>
                      <th scope="col" nowrap>วันนัดรับ<br />Reserved Date</th>

                      <th scope="col" class="">เครื่องมือ<br />Product</th>
                      <!-- 
                      <th scope="col" class="fw-bold">Barcode</th>

                      <th scope="col" class="fw-bold">S/N.</th>
                      <th scope="col" class="fw-bold">ID No.</th> -->
                      <th scope="col" class="fw-bold">รายละเอียด<br />Test Point</th>
                    </tr>
                  </thead>

                  <tbody v-for="(item, index) in items" :key="index">
                    <tr :class="item.product.is_job != 1 ? 'text-decoration-line-through' : ''">
                      <td>{{ index + 1 }})</td>
                      <td>
                        <span>{{ item.item_id }}</span>
                      </td>
                      <td nowrap>
                        {{ item.item_code }}
                      </td>
                      <td style="min-width: 150px">
                        <div>{{ item.sublab?.name_th }} #{{ item.lab_id }}</div>
                        <small class="ms-2 text-danger"
                          >{{ item.sublab?.name_th }} #{{ item.sublab_id }}</small
                        >
                      </td>
                      <td nowrap>{{ item?.product?.calhour }}</td>
                      <td nowrap>
                        <span>{{ item?.reserved_date }}</span>
                        <!-- <JobButtonStatus :data="item?.service_status_id"/> -->

                        <div v-if="item.current_service_status">
                          {{ item.current_service_status.status_id }} :
                          {{ item?.current_service_status.status_name }}
                        </div>
                      </td>

                      <td style="min-width: 350px">
                        <BRow align-h="start" gutter-x="1" style="font-size: 13px">
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
                        <BBadge v-if="item.manufaturer_name" variant="warning me-2"
                          >{{ item?.manufaturer_name }}
                        </BBadge>
                        <span v-if="item.product && item.product.is_job">
                          {{ item.product_name }}</span
                        >
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
                      <td>
                        <BRow align-h="start" gutter-x="1" style="font-size: 13px">
                          <BCol sm="3" alignSelf="center">
                            <div class="text-decoration-underline fw-bold">Range</div>
                            <div class="d-block">{{ item.range_value }}</div>
                          </BCol>
                          <BCol sm="3" alignSelf="center">
                            <div class="text-decoration-underline fw-bold">Range Price</div>
                            <div class="d-block">{{ myCurrency(item.range_price) }}</div>
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
                        <span>{{ item?.test_point }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
            <!-- #######################END ###################### -->
          </div>
        </div>
      </div>
    </div>
    <ConfirmCommitment
      ref="modalConfirm"
      :data="resultCommitment"
      @onConfirm="updateCommitmentDate"
    />
  </section>
</template>

<style lang="scss" scoped>
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
