<template>
  <div>
    <div class="modal" ref="modalRef">
      <div class="modal-dialog modal-dialog-scrollable modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2">
              <div class="col-4 text-decoration-underline">Item Code</div>
              <div class="col-8">
                <span class="">{{ workorder?.item_code }}</span>
              </div>

              <div class="col-4 text-decoration-underline">วันที่เอกสาร</div>
              <div class="col-8">
                <span class="">{{ MyFormatDate(workorder?.document_date) }}</span>
              </div>

              <div class="col-4 text-decoration-underline">วันที่งานเสร็จ</div>
              <div class="col-8">
                <span class="">{{ MyFormatDate(workorder?.reserved_at) }}</span>
              </div>
              <div class="col-4 text-decoration-underline">เครื่องมือ</div>
              <div class="col-8">
                <span class="">{{ workorder?.product_name }}</span>
              </div>
              <div class="col-4 text-decoration-underline">Lab</div>
              <div class="col-8">
                <span class="d-block">{{ workorder?.lab?.name_th }}</span>
                <span class="text-secondary ms-2 fst-italic">{{ workorder?.lab?.name }}</span>
              </div>
              <div class="col-4 text-decoration-underline">Sub Lab</div>
              <div class="col-8">
                <span class="d-block">{{ workorder?.sublab?.name_th }}</span>
                <span class="text-secondary ms-2 fst-italic">{{ workorder?.sublab?.name }}</span>
              </div>
              <div class="col-4 text-decoration-underline">Test Point</div>
              <div class="col-8">
                <span class="d-block">{{ workorder?.test_point }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-sm" @click="confirm()">
              <i class="bi bi-check"></i> ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { MyFormatDate } from '@/helpers/myformat'
import { useBillStore } from '@/stores/billStore'
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

const workorder = computed(() => props.data)

const _show = () => {
  modalEl.show()
}

const confirm = () => {
  modalEl.hide()
  emit('onHide')
}

onMounted(() => {
  modalEl = new Modal(modalRef.value)
})
defineExpose({ show: _show })
</script>
