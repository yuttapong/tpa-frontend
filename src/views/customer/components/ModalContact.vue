<template>
  <div>
    <div class="modal" ref="modalElement">
      <div class="modal-dialog modal-dialog-scrollable modal-xl modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              รายชื่อ <span v-if="_companyId">CustomerID: {{ _companyId }}</span>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="d-flex gap-5">
              <div v-if="customer.id">
                <input type="radio" v-model="onlyOne" value="yes" /> เฉพาะ ({{ customer.name }})
                เท่านั้น
              </div>
              <div><input type="radio" v-model="onlyOne" value="no" /> ทั้งหมด</div>
            </div>

            <form @submit.prevent="search()" class="my-2">
              <div class="d-flex gap-2">
                <div class="">
                  <input
                    type="search"
                    v-model="formSearch.q"
                    class="form-control form-control-sm"
                    placeholder="ชื่อ, สกุล"
                    autofocus
                    @keyup.enter="search()"
                  />
                </div>
                <div class="">
                  <input
                    type="search"
                    v-model="formSearch.taxnumber"
                    class="form-control form-control-sm"
                    placeholder="taxnumber"
                    @keyup.enter="search()"
                  />
                </div>
                <div class="">
                  <input
                    type="search"
                    v-model="formSearch.customer_id"
                    class="form-control form-control-sm"
                    placeholder="Customer ID"
                    @keyup.enter="search()"
                  />
                </div>

                <div class="">
                  <button
                    type="submit"
                    class="btn btn-light btn-sm"
                    :disabled="loading"
                  ><i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </form>

            <!-- Small tables -->
            <div class="table table-responsive">
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
                      <span class="">{{ item.id }}</span>
                    </td>
                    <td>
                      <div class="">
                        {{ item.contactname }}
                        <div
                          style="font-size: 12px"
                          v-if="item.contactposition"
                          class="mx-1 p-1 text-danger"
                        >
                          {{ item.contactposition }}
                        </div>
                        <div style="font-size: 12px" v-if="item.company" class="mx-1 p-1 text-info">
                          {{ item.company.companyname }}
                        </div>
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
          <div class="modal-footer d-block">
            <vue-awesome-paginate
              :total-items="pagination.total"
              :items-per-page="pagination.per_page"
              :max-pages-shown="appStore.settings.page.maxPageShow"
              v-model="pagination.current_page"
              :on-click="onChangePage"
              class=""
            />

            <div class="float-end">
              <div class="input-group input-group-sm">
                <button type="button" class="btn btn-primary" @click="select">
                  <i class="bi bi-check-circle"></i> เลือก
                </button>
                <button type="button" class="btn btn-danger btn-sm" @click="onClearSelected">
                  <i class="bi bi-ban"></i> ไม่เลือก
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x"></i> ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
const emit = defineEmits(['search', 'onHide', 'onShow', 'select'])
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  title: {
    type: Object,
    default: '',
  },
  customer: {
    type: Object,
    default: () => {
      return {
        id: 0,
        name: '',
      }
    },
  },
})

const appStore = useAppStore()
let modal = null
let modalElement = ref(null)
const items = ref([])
const onlyOne = ref('no')
const selectedItems = ref([])
const loading = ref(false)
const _companyId = computed(() => props.customerId)
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const formSearch = ref({
  code: '',
  q: '',
  sortBy: 'id',
  orderBy: 'desc',
})

const search = async () => {
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
  if (props.customer && onlyOne.value == 'yes') {
    params.customer_id = props.customer?.id
    params.customer_name = props.customer?.name
  }
  const { data } = await api.get('/v2/contacts', {
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

const show = () => {
  search()
  emit('onShow', selectedItems.value)
  modal.show()
}
const hide = () => {
  emit('onHide', selectedItems.value)
  modal.hide()
}

const select = () => {
  emit('select', selectedItems.value)
  selectedItems.value = []
  hide()
}
const onClearSelected = () => {
  selectedItems.value = []
  emit('clear', selectedItems.value)
  hide()
}

watch(props.customer, (p) => {
  if (p.customer) {
    formSearch.value.customer_id = p.customer?.id
    search()
  }
})
watch(onlyOne, () => {
  if (onlyOne.value === 'yes') {
    formSearch.value.customer_id = props.customer.id
    formSearch.value.customer_name = props.customer.name
  } else {
    formSearch.value.customer_id = ''
    formSearch.value.customer_name = ''
  }
  search()
})
onMounted(() => {
  modal = new Modal(modalElement.value)
  search()
})
defineExpose({ show, hide })
</script>
<style lang="scss" scoped>
input[type='radio'] {
  transform: scale(2);
  margin: 3px;
}
</style>