<template>
  <BModal
    scrollable
    headerClass="py-1"
    footerClass="d-block"
    v-model="showModal"
    buttonSize="sm"
    size="md"
  >
    <template #header>
      <div class="d-none d-md-inline">
        <div class="d-flex flex-wrap gap-2">
          <div style="min-width: 60px" v-if="mode == 'add'">เพิ่มผู้ใช้งาน</div>
          <div style="min-width: 60px" v-if="mode == 'edit'">
            <span>#{{ data?.id }}</span>
            <span class="ms-3"
              >{{ `${data?.name_th} ${data?.lastname_th} (${data?.username}` }})</span
            >
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="row">
        <div class="col-6">
          <span v-if="selectedLabItems">Lab({{ selectedLabItems.length }})</span>
          <span v-if="selectedSublabItems"> | Sublab({{ selectedSublabItems.length }})</span>
        </div>
        <div class="col-6 d-flex gap-2 justify-content-end">
          <BButton variant="primary" size="sm" @click="submit"
            ><i class="bi bi-save"></i> บันทึก</BButton
          >
          <BButton variant="secondary" size="sm" @click="hide"><i class="bi bi-x"></i> ปิด</BButton>
        </div>
      </div>
    </template>

    <BForm @submit.stop.prevent>
      <div class="row mt-2">
        <div class="col-12">
          <Spinner v-model:visible="loading" />
          <div class="d-flex flex-wrap gap-2">
            <div>
              <label for="code">Code</label>
              <BFormInput v-model="form.code" trim id="code" />
            </div>
            <div>
              <label for="level">Level</label>
              <BFormSelect v-model="form.level" :options="settings?.levels" />
            </div>
            <div>
              <label for="name_th">ชื่อ (TH)</label>
              <BFormInput v-model="form.name_th" trim id="name_th" />
            </div>
            <div>
              <label for="lastname_th">ชื่อ (TH)</label>
              <BFormInput v-model="form.lastname_th" trim id="name_th" />
            </div>
            <div>
              <label for="name">ชื่อ (EN)</label>
              <BFormInput v-model="form.name" trim id="name" />
            </div>
            <div>
              <label for="lastname">ชื่อ (EN)</label>
              <BFormInput v-model="form.lastname" trim id="lastname" />
            </div>
            <div>
              <label for="email">Email</label>
              <BFormInput v-model="form.email" trim id="email" />
            </div>
            <div>
              <label for="username">Username</label>
              <BFormInput v-model="form.username" trim id="username" />
            </div>
            <div>
              <label for="status">Status</label>
              <input
                type="checkbox"
                class="d-block form-check"
                v-model="form.status"
                trim
                id="status"
                true-value="1"
                false-value="0"
              />
            </div>

            <div></div>
          </div>
          <!-- <section v-if="!loading">
                        <div v-for="(item, key) in labsFiltered" :key="key" class="d-flex gap-3 my-1">
                            <div>
                                <BFormCheckbox v-model="selectedLabItems" :value="item.id" />
                            </div>
                            <div>
                                <span class="fw-normal text-dark">
                                    <BBade variant="info" class="fw-bold">{{ item.code }}</BBade> : {{ item.name }}
                                    {{ item.name_th }} ({{ item.sublabs.length }})
                                </span>
                                <ol v-if="item.sublabs.length > 0" class="m-0 p-0">
                                    <li v-for="(job, jobIndex) in item.sublabs" :key="jobIndex" class="d-flex gap-2">
                                        <BFormCheckbox v-model="selectedSublabItems" :value="job.id" class="" />
                                        <small class="text-secondary">
                                            <BBade variant="secondary" class=" fw-bold">{{ item.code }}</BBade> : {{
                                                job.name }}
                                            {{ job.name_th }}
                                        </small>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </section> -->
        </div>
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
  mode: { type: String, default: 'add' },
  settings: { type: Object },
})

const labs = ref([])

const loading = ref(false)
const showModal = ref(props.visible)

const form = ref({
  id: '',
  level: '',
  name_th: '',
  lastname_th: '',
  name: '',
  lastname: '',
  code: '',
  username: '',
  code: '',
  address_card: '',
  address_contact: '',
  birthday: '',
  status: 1,
  systemstatus: '',
})

const formMode = computed(() => props.mode)

const getStaff = async () => {
  const { data, status } = await api.get(`/v2/staffs/${props.data.id}`, {
    params: {},
  })
  if (status == 200) {
    form.value = data
  }
}

watch(
  () => props.visible,
  (newValue, oldValue) => {
    emit('update:visible', newValue)
    showModal.value = newValue // Update the value in the ref if needed
    if (newValue === true) {
      if (props.data && props.data.id > 0) {
        getStaff()
      }
    } else {
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
}
const save = async (e) => {
  if (props.mode == 'add') {
    loading.value = true
    let params = form.value
    const { data, status } = await api.post(`v2/staffs/${props.data.id}`, params)
    if (status == 201) {
      hide()
      form.value = data.data
      emit('created', data.data)
    }
    loading.value = false
  } else if (props.mode == 'edit') {
    loading.value = true
    let params = form.value
    const { data, status } = await api.put(`v2/staffs/${props.data.id}`, params)
    if (status == 200) {
      hide()
      form.value = data.data
      emit('updated', data.data)
    }
    loading.value = false
  }
}

const submit = async () => {
  save()
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
