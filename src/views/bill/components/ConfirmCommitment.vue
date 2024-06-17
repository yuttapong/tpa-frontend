<template>
  <div>
    <div class="modal" ref="modalConfirmRef">
      <div class="modal-dialog modal-dialog-scrollable modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2">
              <div class="col-4">เลขที่ใบขอรับบริการ</div>
              <div class="col-8"><span class="">{{ doc?.code }}</span></div>

              <div class="col-4">วันที่เอกสาร</div>
              <div class="col-8"><span class="">{{ DateTime(doc?.document_date)
              }}</span></div>

              <div class="col-4">วันที่งานเสร็จ</div>
              <div class="col-8"><span class="">{{ DateTime(doc?.commitment_date)
              }}</span>
              </div>
              <div class="col-4">จำนวนงาน</div>
              <div class="col-8"><span class="">{{ doc?.items.length }}</span>
              </div>
              <div class="col-4">ใช้เวลา (วัน)</div>
              <div class="col-8"><span class="">{{ differenceInDays(doc?.commitment_date, doc?.document_date) }}</span>
              </div>
            </div>


          </div>
          <div class="modal-footer">

            <button type="button" class="btn btn-primary btn-sm" @click="confirm()">
              <i class="bi bi-check"></i> ยืนยัน
            </button>
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
              <i class="bi bi-x"></i> ไม่
            </button>

          </div>
        </div>
      </div>
    </div>
    {{ data }}
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { DateTime } from "@/helpers/myformat"
import { differenceInDays } from "date-fns"
const emit = defineEmits(['onHide', 'onShow', 'onConfirm'])
const props = defineProps({
  title: {
    type: String,
    default: 'ยืนยันข้อมูล Commitment Date ?',
  },
  data: {
    type: Object,
    default: () => { }
  }
})

let modalEl = null
let modalConfirmRef = ref(null)
const selectedItems = ref([])

const doc = computed(() => props.data?.data)


const _show = () => {
  emit('onShow', selectedItems.value)
  modalEl.show()
}

const confirm = () => {
  emit('onConfirm', selectedItems.value)
  selectedItems.value = props.data
  modalEl.hide()
  emit('onHide')
}

onMounted(() => {
  modalEl = new Modal(modalConfirmRef.value)
})
defineExpose({ show: _show })
</script>
