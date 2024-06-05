<template>
  <div>
    <div class="modal" ref="modalConfirmRef">
      <div class="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">



          </div>
          <div class="modal-footer">

            <button type="button" class="btn btn-primary" @click="select">
              <i class="bi bi-save"></i> ตกลง
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-times"></i> ปิด
            </button>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted, defineExpose } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
const props = defineProps(['visible'])

let modalProduct = null
let modalConfirmRef = ref(null)
const items = ref([])
const selectedItems = ref([])
const loading = ref(false)
const pagination = ref({
  per_page: 5,
  curent_page: 1,
})
const formSearchProduct = ref({
  code: '',
  q: '',
})

const onSearch = async () => {
  pagination.value.curent_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) { }
}
const loadData = async () => {
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.curent_page,
    ...formSearchProduct.value,
  }
  const { data } = await api.get('/v2/products', {
    params: params,
  })
  if (data) {
    const p = {
      total: data?.total,
      page: data?.curent_page,
      per_page: data?.per_page,
      page_count: data?.last_page,
    }
    pagination.value = p
    items.value = data.data
    loading.value = false
  }
}

const _show = () => {
  emit('onShow', selectedItems.value)
  modalProduct.show()
}

const select = () => {
  emit('select', selectedItems.value)
  selectedItems.value = []
  modalProduct.hide()
  emit('onHide')
}
onMounted(() => {
  modalProduct = new Modal(modalConfirmRef.value)
  loadData()
})
defineExpose({ show: _show })
</script>
