<template>
  <div>
    <div class="modal" ref="modelRef">
      <div class="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">สินค้า</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Small tables -->
            <div class="table table-responsive">
              <form @submit.prevent="onSearch()">
                <div class="row g-2">
                  <div class="col-6 col-md-4 col-lg-3">
                    <input type="search" v-model="formSearchProduct.q" name="q" class="form-control form-control-sm"
                      placeholder="ชื่อสินค้า" @keyup.enter="onSearch()" />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3">
                    <input type="search" v-model="formSearchProduct.code" name="code" class="form-control form-control-sm"
                      placeholder="Code" :disabled="loading" @keyup.enter="onSearch()" />
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
                    <th scope="col">รายการ</th>
                    <th scope="col">เครื่องมือ</th>

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

                    <td>
                      <input type="checkbox" disabled v-model="item.is_job" true-value="1" false-value="0" />
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
          <div class="modal-footer d-block">
            <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
              :max-pages-shown="5" v-model="pagination.current_page" :on-click="onChangePage" class="" />

            <div class="float-end">
              <button type="button" class="btn btn-primary btn-sm ms-2" @click="select">
                <i class="bi bi-save"></i> เลือก
                <span class="badge text-bg-danger"> {{ selectedItems.length }}</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm ms-2" data-bs-dismiss="modal">
                <i class="bi bi-x"></i> ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
const props = defineProps(['visible'])

const appStore = useAppStore()
let modelEle = null
let modelRef = ref(null)
const items = ref([])
const selectedItems = ref([])
const loading = ref(false)
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const formSearchProduct = ref({
  code: '',
  q: '',
})

const onSearch = async () => {
  pagination.value.current_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) { }
}
const onChangePage = async (page) => {
  pagination.value.current_page = page
  try {
    loadData()
  } catch (error) { }
}
const loadData = async () => {
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearchProduct.value,
  }
  const { data } = await api.get('/v2/products', {
    params: params,
  })
  if (data) {
    const p = {
      total: data?.total,
      current_page: data?.current_page,
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
  modelEle.show()
}

const select = () => {
  emit('select', selectedItems.value)
  selectedItems.value = []
  modelEle.hide()
  emit('onHide')
}
onMounted(() => {
  modelEle = new Modal(modelRef.value)
  loadData()
})
defineExpose({ show: _show })
</script>
<style lang="scss" scoped>
input[type="checkbox"] {
  width: 2em;
  height: 2rem;
  accent-color: rgb(14, 108, 180);
}
</style>
