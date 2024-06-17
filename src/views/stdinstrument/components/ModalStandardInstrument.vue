<template>
  <div>
    <div class="modal" ref="modalElement">
      <div class="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">เครื่องมือมาตรฐาน</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Small tables -->
            <div class="table table-responsive">
              <form @submit.prevent="onSearch()">
                <div class="row g-2">
                  <div class="col-6 col-md-4 col-lg-3">
                    <input
                      type="search"
                      v-model="formSearchProduct.q"
                      name="q"
                      class="form-control form-control-sm"
                      placeholder="ชื่อสินค้า"
                      @keyup.enter="onSearch()"
                    />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3">
                    <input
                      type="search"
                      v-model="formSearchProduct.code"
                      name="code"
                      class="form-control form-control-sm"
                      placeholder="Code"
                      @keyup.enter="onSearch()"
                    />
                  </div>

                  <div class="col-6 col-md-4 col-lg-3">
                    <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />
                  </div>
                </div>
              </form>

              <table class="table table-sm table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <!-- <th scope="col">#</th> -->
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>

                    <th scope="col">cal price</th>
                    <th scope="col">cal point</th>
                    <th scope="col">cal hour</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <th scope="row">
                      <!-- <button class="btn btn-secondary btn-sm d-block" @click="selectProduct(item)">
                        <i class="bi bi-plus"></i>
                      </button> -->
                      <input type="checkbox" v-model="selectedItems" :value="item" />
                    </th>
                    <td>
                      <span class="badge bg-dark text-light">{{ item.code }}</span>
                    </td>
                    <td>
                      <div class="fw-bolder">{{ item.name }}</div>
                      <div v-if="item.sublab" class="mx-1 p-1">{{ item.sublab?.name }}</div>
                      <!-- <span v-if="item.model" class="mx-1 p-1">{{ item.model }}</span>
                      <span v-if="item.serialnumber" class="mx-1 p-1">{{ item.serialnumber }}</span> -->
                    </td>

                    <td>{{ item.calprice }}</td>
                    <td>{{ item.calpoint }}</td>
                    <td>{{ item.calhour }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- End small tables -->
          </div>
          <div class="modal-footer">
            <span class="fw-bold bg-danger text-white p-1"> {{ selectedItems.length }}</span>

            <button type="button" class="btn btn-primary" @click="select">
              <i class="bi bi-save"></i> ตกลง
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-times"></i> ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
const props = defineProps(['visible'])

let modalProduct = null
let modalElement = ref(null)
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
  } catch (error) {}
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
  modalProduct = new Modal(modalElement.value)
  loadData()
})
defineExpose({ show: _show })
</script>
