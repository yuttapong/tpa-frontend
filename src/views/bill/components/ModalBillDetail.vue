<template>
  <div>
    <div class="modal" ref="modalRef" id="modalBillDetail">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <Spinner :visible="loading" />
            <div class="row">
              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">เลขที่</label>
                <p>{{ bill.code }}</p>
              </div>
              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">ลูกค้า</label>
                <p>{{ bill?.customer?.companyname }}</p>
              </div>
              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">วันที่</label>
                <p>{{ bill.document_date ? myFormatDate(bill.document_date) : '' }}</p>
              </div>
              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">วันนัดรับเครื่องมือ</label>
                <p v-if="bill.commitment_date">
                  {{ myFormatDateTime(bill.commitment_date) }}
                </p>
              </div>
              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">ผู้ติดต่อ</label>
                <p>{{ bill.agent_name }}</p>
              </div>
              <div class="col-12 col-lg-3">
                <label class="fw-bold text-decoration-underline">ที่อยู่</label>
                <p>{{ bill.address_name }} {{ (bill.address_detail) }}</p>
              </div>

              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">เวลาทำรายการ</label>
                <p>{{ myFormatDate(bill.date_start) }}</p>
              </div>

              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">สถานะ</label>
                <p>
                  <BillStatus v-model="bill.bill_status" />
                </p>
              </div>
              <div class="col-12 col-md-6">
                <label class="fw-bold text-decoration-underline">Note Customer</label>
                <p class="text-wrap fst-italic text-danger">{{ bill.note_customers }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="fw-bold text-decoration-underline">หมายเหตุ</label>
                <p class="text-wrap fst-italic text-danger">{{ bill?.customer?.remark }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="fw-bold text-decoration-underline">หมายเหตุ</label>
                <p class="word-wrap">{{ bill.remark }}</p>
              </div>
            </div>

            <div class="" v-if="loadingItems">
              <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-condensed table-sm table-bordered table-striped" v-if="!loadingItems">
                <thead>
                  <tr>
                    <th class="fw-bold text-decoration-underline">NO</th>
                    <th class="fw-bold text-decoration-underline">ItemCode</th>
                    <th class="fw-bold text-decoration-underline">ห้องทดลอง<br />Sublab</th>
                    <th class="fw-bold text-decoration-underline" nowrap>
                      วันนัดรับ<br />Reserved Date
                    </th>
                    <th class="fw-bold text-decoration-underline">เครื่องมือ<br />Intrument</th>
                    <th class="fw-bold text-decoration-underline">Test Point<br />รายละเอียด</th>

                    <!-- <th class="fw-bold text-decoration-underline text-end">Qty</th> -->
                    <th class="fw-bold text-decoration-underline text-end">Price</th>
                    <th class="fw-bold text-decoration-underline text-end">Total</th>
                  </tr>
                </thead>
                <tbody v-if="bill.items">
                  <tr v-for="(row, rowIndex) in bill.items" :key="row">
                    <!-- <th>
                      <input type="checkbox" v-model="itemsSelected" name="itemsSelected[]" :value="row" />
                    </th> -->
                    <th>{{ rowIndex + 1 }}</th>
                    <td nowrap>
                      {{ row?.item_code }}
                      <div>
                        <small>#<span class="text-primary fw-bold">{{ row?.item_id }}</span></small>
                      </div>
                    </td>
                    <td style="min-width: 200px">
                      <!-- <JobStatus v-model="row.job_status" /> -->
                      <div class="">
                        <small>{{ row?.lab?.name_th }} #{{ row?.lab?.id }}</small>
                      </div>
                      <div class="ms-2 border-bottom">
                        <small class="fs-italic text-secondary">
                          {{ row?.sublab?.name_th }} #{{ row?.sublab?.id }}</small>
                      </div>
                      <div v-if="row.current_service_status" style="font-size: 12px"
                        class="border-bottom text-danger fw-bold">
                        {{ row.current_service_status.status_name }} #{{
                          row.current_service_status.status_id
                        }}
                      </div>
                      <template v-if="canChangeStatus">
                        <JobButtonStatus v-model="row.job_status" :data="row" @on-change="onChangeJobStatus" />
                      </template>
                      <template v-else>
                        <JobStatus v-model="row.job_status" />
                      </template>
                    </td>
                    <td nowrap>{{ myFormatDate(row.reserved_date) }}</td>
                    <td style="min-width: 300px">
                      <BRow align-h="start" gutter-x="2" style="font-size: 13px">
                        <BCol alignSelf="center">
                          <div class="text-decoration-underline fw-bold">Id.No</div>
                          <div class="d-block">{{ row?.id_no }}</div>
                        </BCol>
                        <BCol alignSelf="center">
                          <div class="text-decoration-underline fw-bold">Model</div>
                          <div class="d-item">{{ row.model }}</div>
                        </BCol>
                        <BCol alignSelf="center">
                          <div class="text-decoration-underline fw-bold">S/N</div>
                          <div class="d-block">{{ row.serialnumber }}</div>
                        </BCol>
                        <BCol alignSelf="center">
                          <div class="text-decoration-underline fw-bold">Barcode</div>
                          <div class="d-block">{{ row.barcode_no }}</div>
                        </BCol>
                      </BRow>
                      <BBadge v-if="row.manufaturer_name" variant="warning me-2">{{ row?.manufaturer_name }}
                      </BBadge>
                      <span v-if="row"> {{ row.product_name }}</span>
                    </td>
                    <td style="min-width: 300px">
                      <BRow align-h="start" gutter-x="1" style="font-size: 13px">
                        <BCol sm="3" alignSelf="center">
                          <div class="text-decoration-underline fw-bold">Range</div>
                          <div class="d-block">{{ row?.range_value }}</div>
                        </BCol>
                        <BCol sm="3" alignSelf="center">
                          <div class="text-decoration-underline fw-bold">Range Price</div>
                          <div class="d-block">{{ myCurrency(row.range_price) }}</div>
                        </BCol>
                        <BCol sm="3" alignSelf="center">
                          <div class="text-decoration-underline fw-bold">Point</div>
                          <div class="d-block">{{ row.point }}</div>
                        </BCol>
                        <BCol sm="3" alignSelf="center">
                          <div class="text-decoration-underline fw-bold">Pont Price</div>
                          <div class="d-block">{{ myCurrency(row.point_price) }}</div>
                        </BCol>
                      </BRow>
                      {{ row.test_point }}
                    </td>
                    <!-- <td class="text-end">{{ row.qty }}</td> -->
                    <td class="text-end">{{ myCurrency(row.price) }}</td>
                    <td class="text-end">{{ myCurrency(row.total) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="5">
                      ค่าบริการ Onsite
                      <span class="ms-3">{{ parseFloat(bill.cost_onsite).toLocaleString() }}</span>

                      <label class="ms-5">ค่าขนส่ง</label>
                      <span class="ms-3">{{ parseFloat(bill.cost_travel).toLocaleString() }}</span>
                    </td>

                    <td colspan="2">รวม</td>
                    <td class="text-end fw-bold">
                      {{ parseFloat(bill.total_price).toLocaleString() }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5"></td>
                    <td colspan="2">VAT ({{ parseFloat(bill.vat_percent).toLocaleString() }}%)</td>
                    <td class="text-end fw-bold">
                      {{ parseFloat(bill.vat_total).toLocaleString() }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5"></td>
                    <td colspan="2">รวมเป็นเงินทั้งหมด</td>
                    <td class="text-end fw-bolder text-decoration-underline">
                      {{ Number(bill.grand_total).toLocaleString() }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p>
              <label class="me-3 fw-bold text-decoration-underline">ที่อยู่ในการจัดส่งใบรับรอง:</label>
              <span class="text-wrap">
                {{
                  certAddress
                }}</span>
            </p>
          </div>
          <div class="modal-footer d-block">
            <div class="d-flex">
              <div v-show="canChangeStatus">
                <label> สถานะ</label>
                <BillButtonStatus v-model="bill.bill_status" :data="bill" @on-change="onChangeBillStatus" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { myFormatDate, myFormatDateTime, myCurrency } from '@/helpers/myformat'
import { useBillStore } from '@/stores/billStore'
import JobStatus from '@/views/bill/components/JobStatus.vue'
import JobButtonStatus from './JobButtonStatus.vue'
import BillButtonStatus from './BillButtonStatus.vue'
import BillStatus from './BillStatus.vue'
import Spinner from '@/components/Spinner.vue'
import { removeUndefinedAndNull } from '@/helpers/string'
import { api } from '@/helpers/api'
const emit = defineEmits([
  'onHide',
  'onShow',
  'onConfirm',
  'onChangeJobStatus',
  'onChangeBillStatus',
])
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  canChangeStatus: {
    type: Boolean
  }
})
const billStore = useBillStore()
const loading = ref(false)
let modalEl = null
let modalRef = ref(null)

const bill = computed(() => billStore.bill)
const title = computed(() => {
  if (billStore.bill) {
    return `${bill.value.code}  ID#${bill.value?.id}`
  }
})
const certAddress = computed(() => {
  let address = `${bill.cert_address_name} ${bill.cert_address_detail}
                                ${bill.cert_address_province} ${bill.cert_address_zipcode} ${bill.cert_address_phone}`.trim();
  return removeUndefinedAndNull(address)
})
const show = () => {
  modalEl.show()
}
const hide = () => {
  modalEl.hide()
}
const getBillById = async (id) => {
  loading.value = true
  console.log("load more items", id);
  const rs = await api.get('v2/bills/' + id).catch(() => {
    loading.value = false
  })
  if (rs.data) {
    billStore.setBill(rs.data)
    loading.value = false
  }
}
const onChangeBillStatus = (result) => {
  getBillById(result.data.id)
  setTimeout(() => emit('onChangeBillStatus', bill.value), 3000)
}
const onChangeJobStatus = (result) => {
  console.log("onChangeJobStatus", result.data);
  getBillById(result.data.bill_id)
  setTimeout(() => emit('onChangeJobStatus', result.data), 3000)
}
onMounted(() => {
  modalEl = new Modal(modalRef.value)
  var modalBillDetail = document.getElementById('modalBillDetail')
  modalBillDetail.addEventListener('shown.bs.modal', (e) => {
    console.log('show', bill.value);
    if (bill.value.id) {
      getBillById(bill.value.id)
    }

  })
  modalBillDetail.addEventListener('hide.bs.modal', (e) => {

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
