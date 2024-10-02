<template>
  <div>
    <div class="modal" ref="modalRef">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div class="row g-2">
              <div class="col-4 text-decoration-underline">Item Code</div>
              <div class="col-8">
                <span class="">{{ row?.item_code }}</span>
              </div>

              <div class="col-4 text-decoration-underline">วันที่รับบริการ</div>
              <div class="col-8">
                <span class="">{{ myFormatDate(row?.document_date) }}</span>
              </div>

              <div class="col-4 text-decoration-underline">วันที่งานเสร็จ Reserved Date</div>
              <div class="col-8">
                <span class="">{{ myFormatDateTime(row?.reserved_at) }}</span>
              </div>
              <div class="col-4 text-decoration-underline">เครื่องมือ</div>
              <div class="col-8">
                <span class="fw-bold">{{ row?.product_name }}</span>
              </div>

              <div class="col-4 text-decoration-underline">Lab</div>
              <div class="col-8">
                <div class="d-inline">{{ row?.lab?.name_th }}</div>
                <div class="text-secondary ms-2 fst-italic">{{ row?.lab?.name }}</div>
              </div>
              <div class="col-4 text-decoration-underline">Sub Lab</div>
              <div class="col-8">
                <div class="d-inline">{{ row?.sublab?.name_th }}</div>
                <div class="text-secondary ms-2 fst-italic">{{ row?.sublab?.name }}</div>
              </div>
              <div class="col-4 text-decoration-underline">Test Point</div>
              <div class="col-8">
                <span class="d-block">{{ row?.test_point }}</span>
              </div>
              <div class="col-4 text-decoration-underline">สถานะงาน - Job status</div>
              <div class="col-8">
                <span class="">
                  <JobStatus v-model="row.job_status"></JobStatus>
                </span>
              </div>

              <div class="col-4 text-decoration-underline">Tracking Status</div>
              <div class="col-8">
                <span class="fw-bold text-danger">
                  <div v-if="row.current_service_status">
                    {{ row?.current_service_status?.name }}
                  </div>
                </span>
              </div>
            </div>
            <hr />
            <h5 class="h6 text-decoration-underline">Tracking Status</h5>
            <JobTimeline :statuses="row?.service_statuses" />
          </div>
          <div class="modal-footer">

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { myFormatDate, myFormatDateTime } from '@/helpers/myformat'
import { useBillStore } from '@/stores/billStore'
import JobStatus from '@/views/bill/components/JobStatus.vue'
import JobTimeline from './JobTimeline.vue'
const emit = defineEmits(['onHide', 'onShow', 'onConfirm'])
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => { },
  },
})
const billStore = useBillStore()
let modalEl = null
let modalRef = ref(null)

const row = computed(() => props.data)

const show = () => {
  modalEl.show()
}
const hide = () => {
  modalEl.hide()
}


onMounted(() => {
  modalEl = new Modal(modalRef.value)
})
defineExpose({ show, hide })
</script>
