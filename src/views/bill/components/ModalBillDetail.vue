<template>
  <div>
    <div class="modal" ref="modalRef">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
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
                <label class="fw-bold text-decoration-underline">ผู้ติดต่อ</label>
                <p>{{ bill.agent_name }}</p>
              </div>
              <div class="col-12 col-lg-3">
                <label class="fw-bold text-decoration-underline">ที่อยู่</label>
                <p>{{ bill.address_name }} {{ bill.address_detail }}</p>
              </div>

              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">เวลาทำรายการ</label>
                <p>{{ myFormatDate(bill.date_start) }}</p>
              </div>
              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">วันนัดรับเครื่องมือ</label>
                <p v-if="bill.commitment_date">
                  {{ myFormatDate(bill.commitment_date) }}
                </p>
              </div>
              <div class="col-4 col-lg-3">
                <label class="fw-bold text-decoration-underline">สถานะ</label>
                <p>
                  <BillButtonStatus
                    v-model="bill.bill_status"
                    :data="bill"
                    @on-change="onChangeBillStatus"
                  />
                </p>
              </div>
              <div class="col-12 col-md-6">
                <label class="fw-bold text-decoration-underline">Note Customer</label>
                <p class="text-muted text-wrap fst-italic fw-light">{{ bill.note_customers }}</p>
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
              <table class="table table-condensed table-sm table-bordered" v-if="!loadingItems">
                <thead>
                  <tr>
                    <th class="fw-bold text-decoration-underline">#</th>
                    <th class="fw-bold text-decoration-underline">NO</th>
                    <th class="fw-bold text-decoration-underline">ItemCode</th>
                    <th class="fw-bold text-decoration-underline">Tracking Status</th>
                    <th class="fw-bold text-decoration-underline" nowrap>วันที่</th>
                    <th class="fw-bold text-decoration-underline">Item Name</th>
                    <th class="fw-bold text-decoration-underline">Test Point</th>
                    <th class="fw-bold text-decoration-underline">SN.</th>

                    <th class="fw-bold text-decoration-underline text-end">Qty</th>
                    <th class="fw-bold text-decoration-underline text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in bill.items" :key="row">
                    <th>
                      <input
                        type="checkbox"
                        v-model="itemsSelected"
                        name="itemsSelected[]"
                        :value="row"
                      />
                    </th>
                    <th>{{ rowIndex + 1 }}</th>
                    <td nowrap>
                      {{ row.item_code }}
                      <div>
                        <small
                          >#<span class="text-primary fw-bold">{{ row.item_id }}</span></small
                        >
                      </div>
                    </td>
                    <td nowrap>
                      <!-- <JobStatus v-model="row.job_status" /> -->
                      <div>{{ row?.lab.name_th }} #{{ row.lab.id }}</div>
                      <div class="ms-2 border-bottom">
                        <small class="fs-italic">
                          {{ row?.sublab.name_th }} #{{ row.sublab.id }}</small
                        >
                      </div>
                      <div
                        v-if="row.current_service_status"
                        style="font-size: 12px"
                        class="border-bottom text-danger fw-bold"
                      >
                        {{ row.current_service_status.status_name }} #{{
                          row.current_service_status.status_id
                        }}
                      </div>
                      <JobButtonStatus
                        v-model="row.job_status"
                        :data="row"
                        @on-change="onChangeJobStatus"
                      />
                    </td>
                    <td nowrap>{{ myFormatDate(row.reserved_date) }}</td>
                    <td>{{ row.product_name }}</td>
                    <td>{{ row.test_point }}</td>
                    <td>{{ row.serialnumber }}</td>
                    <td class="text-end">{{ row.qty }}</td>
                    <td class="text-end">{{ row.total }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="8">
                      ค่าบริการ Onsite
                      <span class="ms-3">{{ parseFloat(bill.cost_onsite).toLocaleString() }}</span>

                      <label class="ms-5">ค่าขนส่ง</label>
                      <span class="ms-3">{{ parseFloat(bill.cost_travel).toLocaleString() }}</span>
                    </td>

                    <td>รวม</td>
                    <td colspan="2" class="text-end fw-bold">
                      {{ parseFloat(bill.total_price).toLocaleString() }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="8"></td>
                    <td>VAT ({{ parseFloat(bill.vat_percent).toLocaleString() }}%)</td>
                    <td colspan="2" class="text-end fw-bold">
                      {{ parseFloat(bill.vat_total).toLocaleString() }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="8"></td>
                    <td>รวมเป็นเงินทั้งหมด</td>
                    <td colspan="2" class="text-end fw-bolder text-decoration-underline">
                      {{ Number(bill.grand_total).toLocaleString() }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p>
              <label class="me-3 fw-bold text-decoration-underline"
                >ที่อยู่ในการจัดส่งใบรับรอง:</label
              >
              <span class="text-wrap">
                {{
                  `${bill.cert_address_name} ${bill.cert_address_detail}
                          ${bill.cert_address_province} ${bill.cert_address_zipcode} ${bill.cert_address_phone}`.trim()
                }}</span
              >
            </p>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { myFormatDate } from '@/helpers/myformat'
import { useBillStore } from '@/stores/billStore'
import JobStatus from '@/views/bill/components/JobStatus.vue'
import JobButtonStatus from './JobButtonStatus.vue'
import BillButtonStatus from './BillButtonStatus.vue'
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
  data: {
    type: Object,
    default: () => {},
  },
})
const billStore = useBillStore()
let modalEl = null
let modalRef = ref(null)

const bill = computed(() => props.data)

const show = () => {
  modalEl.show()
}
const hide = () => {
  modalEl.hide()
}
const getBillByCode = async (code) => {
  return await api.get('v2/bills/code/' + code)
}
const onChangeBillStatus = (bill) => {
  emit('onChangeBillStatus', bill.data)
}
const onChangeJobStatus = (job) => {
  emit('onChangeJobStatus', job.data)
}
onMounted(() => {
  modalEl = new Modal(modalRef.value)
})

defineExpose({ show, hide })
</script>
