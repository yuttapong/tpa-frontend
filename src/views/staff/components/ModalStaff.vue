<template>
  <div>
    <div class="modal" ref="modalElement">
      <div class="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">พนักงาน</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Small tables -->
            <div class="table table-responsive">
              <form @submit.prevent="onSearch()">
                <div class="row g-2">
                  <div class="col-6 col-md-4 col-lg-3">
                    <input type="search" v-model="formSearchProduct.q" class="form-control form-control-sm"
                      placeholder="ชื่อ, สกุล" autofocus @keyup.enter="onSearch()" />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3">
                    <input type="search" v-model="formSearchProduct.taxnumber" class="form-control form-control-sm"
                      placeholder="taxnumber" @keyup.enter="onSearch()" />
                  </div>

                  <div class="col-6 col-md-4 col-lg-3">
                    <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" :disabled="loading" />

                  </div>
                </div>
              </form>
              <div class="spinner-border" role="status" v-if="loading">
                <span class="visually-hidden">Loading...</span>
              </div>

              <table class="table table-sm table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <!-- <th scope="col">#</th> -->
                    <th scope="col">ID</th>
                    <th scope="col">ชื่อ - สกุล</th>

                    <th scope="col">อีเมล์</th>
                    <th scope="col">เบอร์โทร</th>

                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index"
                    :class="{ 'table-success': item.id == selectedItems.id }">
                    <th scope="row">
                      <!-- <button class="btn btn-secondary btn-sm d-block" @click="selectProduct(item)">
                        <i class="bi bi-plus"></i>
                      </button> -->
                      <input class="form-check-input" type="radio" v-model="selectedItems" :value="item" />
                    </th>
                    <td>
                      <span class="">{{ item.id }}</span>
                    </td>
                    <td>
                      <div class="">
                        {{ item.contactname }}
                        <span v-if="item.contactposition" class="mx-1 p-1 text-danger">{{
                          item.contactposition
                        }}</span>
                      </div>

                      <!-- <span v-if="item.model" class="mx-1 p-1">{{ item.model }}</span>
                      <span v-if="item.serialnumber" class="mx-1 p-1">{{ item.serialnumber }}</span> -->
                    </td>

                    <td>{{ item.contactemail }}</td>
                    <td>
                      {{ item.contacttel1 }}
                      <div>{{ item.contacttel2 }}</div>
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>
            <!-- End small tables -->
          </div>
          <div class="modal-footer">


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
import { ref, defineEmits, defineProps, onMounted, defineExpose } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
const props = defineProps(['visible', 'perPage', 'data'])

let modal = null
let modalElement = ref(null)
const items = ref([])
const selectedItems = ref([])
const loading = ref(false)
const pagination = ref({
  per_page: props.perPage || 8,
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
  loading.value = true
  const { data } = await api.get('/v2/staffs', {
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
  modal.show()
}

const select = () => {
  emit('select', selectedItems.value)
  selectedItems.value = []
  modal.hide()
  emit('onHide')
}
onMounted(() => {
  modal = new Modal(modalElement.value)
  loadData()
})
defineExpose({ show: _show })
</script>
