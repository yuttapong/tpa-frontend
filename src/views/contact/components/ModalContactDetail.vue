<template>
  <div>
    <div class="modal" ref="modalRef">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div class="row g-2">
              <!-- ####### START ROW ########## -->
              <!-- ################# -->
              <div class="col-4 text-decoration-underline">ID</div>
              <div class="col-8">
                <span class="">{{ data?.id }}</span>
              </div>
              <!-- ################# -->
              <div class="col-4 text-decoration-underline">Name</div>
              <div class="col-8">
                <span class="">{{ data?.contactname }}</span>
              </div>

              <!-- ###############-->
              <div class="col-4 text-decoration-underline">ตำแหน่ง</div>
              <div class="col-8">
                <span class="">{{ data?.contactposition }}</span>
              </div>
              <!-- ################# -->
              <div class="col-4 text-decoration-underline">เบอร์โทร</div>
              <div class="col-8">
                <div class="">Tel1. {{ data?.contacttel1 }}</div>
                <div class="">Tel2. {{ data?.contacttel2 }}</div>
              </div>
              <!-- ################# -->
              <div class="col-4 text-decoration-underline">E-mail</div>
              <div class="col-8">
                <span class="">{{ data?.contactemail }}</span>
              </div>
              <!-- ################# -->
              <div class="col-4 text-decoration-underline">Default Contact</div>
              <div class="col-8">
                <span class="badge bg-secondary text-white" v-if="data.statusmain == 1">yes</span>
              </div>
              <!-- ################# -->
              <div class="col-4 text-decoration-underline">บริษัท</div>
              <div class="col-8">
                <span class="">{{ data?.company }}</span>
              </div>
              <!-- ################# -->
              <div class="col-4 text-decoration-underline">Created By</div>
              <div class="col-8">
                <span class="">{{ data?.datestart }}</span>
              </div>
              <!-- ####### END ROW ########## -->
            </div>

          </div>
          <!-- <div class="modal-footer">

          </div> -->
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
