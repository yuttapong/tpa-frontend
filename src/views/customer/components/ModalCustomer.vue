<template>
  <div>
    <div class="modal" ref="modalElement">
      <div class="modal-dialog modal-dialog-scrollable modal-xl modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">บริษัท</h5>
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
                      v-model="formSearch.q"
                      class="form-control form-control-sm"
                      placeholder="ชื่อบริษัท"
                      autofocus
                      @keyup.enter="onSearch()"
                    />
                  </div>
                  <div class="col-6 col-md-4 col-lg-3">
                    <input
                      type="search"
                      v-model="formSearch.taxnumber"
                      class="form-control form-control-sm"
                      placeholder="taxnumber"
                      @keyup.enter="onSearch()"
                    />
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
                    <th scope="col">Tax number</th>
                    <th scope="col">บริษัท</th>

                    <th scope="col">เบอร์โทร</th>
                    <th scope="col">จังหวัด</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in items"
                    :key="index"
                    :class="{ 'table-success': item.id == selectedItems.id }"
                  >
                    <th scope="row">
                      <!-- <button class="btn btn-secondary btn-sm d-block" @click="selectProduct(item)">
                        <i class="bi bi-plus"></i>
                      </button> -->
                      <input
                        class="form-check-input"
                        type="radio"
                        v-model="selectedItems"
                        :value="item"
                      />
                    </th>
                    <td>
                      <span class="">{{ item.taxnumber }}</span>
                    </td>
                    <td>
                      <div class="">{{ item.companyname }}</div>
                      <div v-if="item.companynameen" class="mx-1 p-1 ">
                        <small class="text-danger"> {{ item.companynameen }}</small>
                        <small class="mx-2"> ID#{{ item.id }}</small>
                      </div>
                      <!-- <span v-if="item.model" class="mx-1 p-1">{{ item.model }}</span>
                      <span v-if="item.serialnumber" class="mx-1 p-1">{{ item.serialnumber }}</span> -->
                    </td>

                    <td>{{ item.phone }}</td>
                    <td>{{ item.province }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- End small tables -->
          </div>
          <div class="modal-footer d-block">
            <vue-awesome-paginate
              :total-items="pagination.total"
              :items-per-page="pagination.per_page"
              :max-pages-shown="appStore.settings.page.maxPageShow"
              v-model="pagination.current_page"
              :on-click="onChangePage"
              class=""
            />
            <!-- <span class="fw-bold bg-danger text-white p-1"> {{ selectedItems.length }}</span> -->

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
import { useAppStore } from '@/stores/appStore'
const emit = defineEmits(['onSearch', 'onHide', 'onShow', 'select'])
const props = defineProps(['visible', 'perPage', 'data'])

let modal = null
const appStore = useAppStore();
let modalElement = ref(null)
const items = ref([])
const selectedItems = ref([])
const loading = ref(false)
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const formSearch = ref({
  code: '',
  q: '',
})

const onSearch = async () => {
  pagination.value.current_page = 1
  pagination.value.total = 0
  try {
    loadData()
  } catch (error) {}
}
const onChangePage = async (page) => {
  pagination.value.current_page = page
  try {
    loadData()
  } catch (error) {}
}
const loadData = async () => {
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/customers', {
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
