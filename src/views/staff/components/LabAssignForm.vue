<template>
  <BModal
    scrollable
    headerClass="py-1 text-light"
    footerClass="d-block"
    v-model="showModal"
    @hide="hide"
    @ok="submit()"
    buttonSize="sm"
    size="xl"
    headerBgVariant="primary"
  >
    <template #header>
      <div class="d-none d-md-inline">
        <div class="d-flex flex-wrap gap-2">
          <div style="min-width: 60px">
            <label for="name" class="fw-bold text-decoration-underline">ID</label>
            <p>{{ data?.id }}</p>
          </div>
          <div style="min-width: 180px">
            <label for="name" class="fw-bold text-decoration-underline">ชื่อ</label>
            <div>
              {{ data?.name_th }}
              {{ data?.lastname_th }}
            </div>
          </div>
          <div style="min-width: 180px">
            <label for="lastname_th" class="fw-bold text-decoration-underline">ชื่อ (EN)</label>
            <div>
              {{ data?.name }}
              {{ data?.lastname }}
            </div>
          </div>
          <div style="min-width: 180px">
            <label for="name" class="fw-bold text-decoration-underline">Level</label>
            <p>{{ data?.level }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #footer class="d-block">
      <div class="row">
        <div class="col-6">
          <span v-if="selectedLabItems">{{ selectedLabItems.length }} Lab</span>
          <span v-if="selectedSublabItems"> | {{ selectedSublabItems.length }} Sublab</span>
        </div>
        <div class="col-6 d-flex gap-2">
          <BButton variant="primary" size="sm" @click="submit">OK</BButton>
          <BButton variant="secondary" size="sm" @click="hide">Cancel</BButton>
        </div>
      </div>
    </template>

    <BForm @submit.stop.prevent>
      <div class="row mt-2">
        <div class="col-12">
          <h6>ทั้งหมด ({{ labsFiltered.length }})</h6>
          <BFormInput size="sm" v-model="formSearchRole.name" placeholder="ค้นหา..." />
          <p>
            <BButton text variant="text" @click="checkAll"
              ><i class="bi bi-check-square"></i> เลือกทั้งหมด</BButton
            >
            <BButton text variant="text" @click="uncheckAll"
              ><i class="bi bi-square"></i> ไม่เลือก</BButton
            >
          </p>
          <Spinner v-model:visible="loading" />
          <section v-if="!loading">
            <div v-for="(item, key) in labsFiltered" :key="key" class="d-flex gap-3 my-1">
              <div><BFormCheckbox v-model="selectedLabItems" :value="item.id" /></div>
              <div>
                <span class="fw-normal text-dark"
                  ><BBade variant="info">{{ item.code }}</BBade> : {{ item.name }}
                  {{ item.name_th }} ({{ item.sublabs.length }})</span
                >
                <ol v-if="item.sublabs.length > 0">
                  <li
                    v-for="(job, jobIndex) in item.sublabs"
                    :key="jobIndex"
                    class="d-flex gap-2 flex-wrap"
                  >
                    <BFormCheckbox v-model="selectedSublabItems" :value="job.id" class="" />
                    <small class="text-danger"
                      ><BBade variant="secondary">{{ item.code }}</BBade> : {{ job.name }}
                      {{ job.name_th }}</small
                    >
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </div>
        <!-- <div class="col-12">
          <div class="d-flex flex-row gap-2 align-items-center align-content-center py-3">
            <BButton @click="chooseOne()" type="button" size="sm" variant="success"
              ><i class="bi bi-chevron-down"></i
            ></BButton>
            <BButton @click="chooseAll()" type="button" size="sm" variant="success"
              ><i class="bi bi-chevron-double-down"></i
            ></BButton>
            <BButton @click="removeOne()" type="button" size="sm" variant="danger"
              ><i class="bi bi-chevron-up"></i
            ></BButton>

            <BButton @click="removeAll()" type="button" size="sm" variant="danger"
              ><i class="bi bi-chevron-double-up"></i
            ></BButton>
            <Spinner v-model:visible="loading" />
          </div>
        </div> -->
        <!-- <div class="col-12">
          <h6>อนุญาต ({{ rolePermissionsFiltered.length }})</h6>
          <BFormInput size="sm" v-model="formSearchPermission.name" placeholder="ค้นหา..." />
          <BFormSelect
            v-model="selectedRightItems"
            :options="rolePermissionsFiltered"
            :select-size="10"
            valueField="id"
            textField="name"
            multiple
          />
        </div> -->
      </div>
    </BForm>
  </BModal>
</template>

<script setup>
import { ref, onMounted, watchEffect, watch, computed } from 'vue'
import { toast } from 'vue3-toastify'

import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
const emit = defineEmits(['updated', 'created'])
const props = defineProps({
  visible: { type: Boolean },
  data: { type: Object },
  type: { type: String, default: 'add' },
})

const appStore = useAppStore()

const items = ref([])
const selectedLabItems = ref([])
const selectedSublabItems = ref([])
const selectedRightItems = ref([])
const rolePermissions = ref([])
const labs = ref([])
const labsFiltered = computed(() => {
  return labs.value.filter((item) => {
    let name = String(item?.name)
    let name_th = String(item?.name)
    let b = String(formSearchRole.value.name)
    return name.includes(b) || name_th.includes(b)
  })
})
const rolePermissionsFiltered = computed(() => {
  return rolePermissions.value.filter((item, key) => {
    let a = String(item?.name)
    let b = String(formSearchPermission.value.name)
    return a.includes(b)
  })
})

const loading = ref(false)
const showModal = ref(props.visible)
const title = ref(props.title || 'ตั้งค่าห้อง LAB')
const formSearchRole = ref({ name: '' })
const formSearchPermission = ref({ name: '' })
const form = ref({
  name: props.data?.name,
  display_name: props.data?.display_name,
  description: props.data?.description,
  status: props.data?.status,
})

const formMode = computed(() => (props.data.id !== undefined && props.data.id > 0 ? 'edit' : 'add'))

const getRolePermissons = async () => {
  const { data, status } = await api.get(`/v2/staffs/${props.data.id}/assign-labs`, {
    params: {},
  })
  if (status == 200) {
    selectedLabItems.value = data.labs ? data.labs.map((item) => item.id) : []
    selectedSublabItems.value = data.sublabs ? data.sublabs.map((item) => item.id) : []
    console.log('selectedLabItems', selectedLabItems.value)
    console.log('selectedSublabItems', selectedSublabItems.value)
  }
}
const getPermissions = async () => {
  loading.value = true
  const { data } = await api.get('v2/labs/all')
  labs.value = data
  loading.value = false
}
watch(
  () => props.visible,
  (newValue, oldValue) => {
    emit('update:visible', newValue)
    showModal.value = newValue // Update the value in the ref if needed
    if (newValue === true) {
      getPermissions()
      if (props.data.id !== undefined && props.data.id > 0) {
        getRolePermissons()
      }
    }
  },
)
watch(
  () => props.data,
  (newValue, oldValue) => {
    form.value.id = newValue.id
    form.value.name = newValue.name
    form.value.display_name = newValue.display_name
    form.value.description = newValue.description
    form.value.status = newValue.status
    form.value = newValue
  },
)
const hide = (e) => {
  emit('update:visible', false)
  rolePermissions.value = []
  selectedLabItems.value = []
  selectedRightItems.value = []
}

const assignLab = async (e) => {
  let labs = selectedLabItems.value ? selectedLabItems.value : []
  let sublabs = selectedSublabItems.value ? selectedSublabItems.value : []

  loading.value = true
  let params = {
    labs,
    sublabs,
  }
  const { data, status } = await api.post(`v2/staffs/${props.data.id}/assign-labs`, params)
  if (status == 200) {
    selectedLabItems.value = data.data.labs ? data.data.labs.map((item) => item.id) : []
    selectedSublabItems.value = data.data.sublabs ? data.data.sublabs.map((item) => item.id) : []
  }
  loading.value = false
}
const showTitle = computed(() => {
  if (formMode.value == 'add') emit('update:title', `สร้าง Role ใหม่`)
  if (formMode.value == 'edit') emit('update:title', `แก้ไข Role : ${form.value.name}`)
})
const submit = async () => {
  loading.value = true

  assignLab()
}

const cancel = () => {}
const checkAll = () => {
  let sl = []
  let l = []
  labs.value.map((item) => {
    item.sublabs.map((x) => sl.push(x.id))
    l.push(item.id)
  })
  console.log(l, sl)
  selectedLabItems.value = l
  selectedSublabItems.value = sl
}
const uncheckAll = () => {
  selectedLabItems.value = []
  selectedSublabItems.value = []
}
onMounted(() => {})
</script>
<style lang="scss" scoped>
label {
  margin-top: 15px;
}
</style>
