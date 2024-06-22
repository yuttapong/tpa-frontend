<script setup>
import { onMounted, computed, ref, onUpdated } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { DateTime, Number } from '@/helpers/myformat'
import { useBillStore } from '@/stores/billStore'
import BillPriority from '@/views/bill/components/BillPriority.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { formatInTimeZone, toZonedTime, toDate, format } from 'date-fns-tz'
import { formatDate, formatISO, isValid, parse } from 'date-fns'
import { timezone } from '@/config'
import { useAppStore } from '@/stores/appStore'
import ConfirmCommitment from './components/ConfirmCommitment.vue'
import { toast } from 'vue3-toastify'
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
  const params = {
    priority: commitmentPriority.value,
    bill_id: form.value.id,
    code: form.value.code,
    // document_date: d1 ? formatISO(toZonedTime(form.value.document_date, timezone)) : '',
    // commitment_date: d2 ? formatISO(toZonedTime(d2, timezone)) : '',
    document_date: form.value.document_date,
    commitment_date: commitmentDate.value,
    items: form.value.items.map((item) => {
      return {
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
      }
    }),
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
      .delete(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills', {
        data: {
          ...params,
        },
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
      loadData()
    }
  }
}
const clearCommitmentDate = async (billId) => {
  await api.delete(`/v2/bills/${billId}/commitment`)
}

const loadData = async () => {
  if (billCode.value) {
    const { data } = await api.get('/v2/bills/code/' + billCode.value)
    if (data) form.value = data
  }
}
onMounted(() => {
  loadData()
})
onUpdated(() => {})
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
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-body pt-3">
            <spinner :visible="loading" />

            <!-- #####################START######################## -->
            <form @submit.prevent="onSearch()">
              <div class="row g-3">
                <div class="col-12 col-lg-4 col-xl-3">
                  <label>Bill ID</label>
                  <p class="fw-bold">{{ form.id }}</p>
                </div>
                <div class="col-12 col-lg-4 col-xl-3">
                  <label>Bill Code</label>
                  <p class="fw-bold">{{ form.code }}</p>
                </div>
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <label>วันที่</label>
                  <input
                    type="date"
                    v-model="form.document_date"
                    name="document_date"
                    id="document_date"
                    class="form-control form-control-sm"
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <label>Commitment Date</label>
                  <template v-if="form.commitment_date">
                    <p>
                      {{ DateTime(form.commitment_date) }}
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
                <input
                  type="checkbox"
                  v-model="searchCommitmentDate"
                  @change="onChangeConditionCommitment"
                />
                จองคิวห้อง Lab
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
                          DateTime(resultCommitment.data.document_date, {
                            hideTime: true,
                          })
                        }}
                        <span class="mx-2">งานเสร็จวันที่</span>
                        {{
                          DateTime(resultCommitment.data.commitment_date, {
                            hideTime: true,
                          })
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row g-1">
                  <div class="col-12">
                    <button type="button" class="btn btn-primary btn-sm" @click="submit()">
                      <i class="float-start bi bi-clock me-2"></i> จองคิว
                    </button>
                    <template v-if="form.id > 0">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm ms-2"
                        @click="cancelBook()"
                      >
                        <i class="float-start bi bi-x me-2"></i> ยกเลิกคิวจอง
                      </button>
                    </template>

                    <Spinner :visible="loadingCommitment" />
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

                  <tbody v-for="(item, index) in items" :key="index">
                    <tr>
                      <td>{{ index + 1 }})</td>
                      <td>
                        <span>{{ item.sublab.name_th }}</span>
                      </td>
                      <td nowrap>
                        <span>{{ item?.reserved_date }}</span>
                      </td>
                      <td>
                        <span>{{ item.item_id }}</span>
                      </td>
                      <td nowrap>
                        {{ item.item_code }}
                      </td>
                      <td>
                        {{ item.product_name }}
                      </td>
                      <td>
                        <span>{{ item.barcode_no }}</span>
                      </td>

                      <td>
                        <span>{{ item.serialnumber }}</span>
                      </td>
                      <td>
                        <span>{{ item.id_no }}</span>
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
