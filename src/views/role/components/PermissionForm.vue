<template>
  <BModal v-model="showModal" :title="title" hideHeader buttonSize="sm">
    <BForm @submit.stop.prevent>
      <div class="d-flex flex-wrap gap-2">
        <div>
          <label for="name">ชื่อ</label>
          <BFormInput v-model="form.name" :state="!!form.name" id="name" />
        </div>
        <div>
          <label for="displany_name">ชื่อแสดง</label>
          <BFormInput v-model="form.display_name" :state="!!form.display_name" id="display_name" />
        </div>
        <div>
          <label for="displany_name">รายละเอียด</label>
          <BFormTextarea v-model="form.description" id="description" />
        </div>
        <div class="ps-5">
          <label for="status">เปิดใช้งาน</label>
          <BFormRadioGroup v-model="form.status" :state="!!form.status" id="status">
            <BFormRadio value="0">ปิด</BFormRadio>
            <BFormRadio value="1">เปิด</BFormRadio>
          </BFormRadioGroup>
        </div>
      </div>
      <Spinner :visible="loading" />
      <template v-if="!loading">
        <fielset v-if="form.roles" class="p-2 border my-2 d-block">
          <BBadge variant="warning" v-for="(role, key) in form.roles" :key="key">{{
            role.name
          }}</BBadge>
        </fielset>
        <div class="row mt-2">
          <div class="col-12">
            <h6>ผู้ใช้งานที่มีสิทธิ์</h6>

            <BFormSelect readonly :select-size="10" valueField="id" textField="name_th">
              <BFormSelectOption :value="null" v-for="(staff, key) in form.staffs" :key="key">{{
                `${staff.id}#${staff.name_th} ${staff.lastname_th} ${staff.level ? '(' + staff.level + ')' : ''}`
              }}</BFormSelectOption>
            </BFormSelect>
          </div>
        </div>
      </template>
    </BForm>
    <template #footer>
      <div class="d-flex flex-warp gap-2">
        <BButton variant="primary" size="sm" type="button" @click="submit"
          ><i class="bi bi-save"></i> บันทึก</BButton
        >
        <BButton variant="secondary" size="sm" type="button" @click="hide"
          ><i class="bi bi-x"></i> ปิด</BButton
        >
      </div>
    </template>
  </BModal>
</template>

<script setup>
import { ref, onMounted, watchEffect, watch, computed } from 'vue'
import { toast } from 'vue3-toastify'

import { api } from '@/helpers/api'
import { useAppStore } from '@/stores/appStore'
const emit = defineEmits(['onUpdated', 'onCreated'])
const props = defineProps({
  visible: { type: Boolean },
  data: { type: Object },
  type: { type: String, default: 'add' },
})

const appStore = useAppStore()

const items = ref([])
const selectedPermission = ref([])
const rolePermissions = ref([])
const loading = ref(false)
const showModal = ref(props.visible)
const title = ref('คำอนุญาต')
const form = ref({
  name: '',
  display_name: '',
  description: '',
  status: 1,
  staffs: [],
  roles: [],
})

const formMode = computed(() => (form.value.id !== undefined && form.value.id > 0 ? 'edit' : 'add'))

const getRolePermissons = async () => {
  loading.value = true
  const { data, status } = await api.get(`/v2/permissions/${form.value.id}`, {
    params: {},
  })
  if (status == 200) {
    loading.value = false
    rolePermissions.value = data
    form.value.roles = data?.roles || []
    form.value.staffs = data?.staffs || []
  }
}
const getPermissions = async () => {
  loading.value = true
  const { data, status } = await api.get(`v2/permissions/${props.data.id}`)
  if (status === 200) {
    form.value.roles = data?.roles || []
    form.value.staffs = data?.staffs || []
    loading.value = false
  }
}
watch(
  () => props.visible,
  (newValue, oldValue) => {
    emit('update:visible', newValue)
    showModal.value = newValue // Update the value in the ref if needed
    if (newValue === true) {
      if (props.data.id !== undefined && props.data.id > 0) {
        getPermissions()
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
  },
)
const hide = (e) => {
  emit('update:visible', false)
  rolePermissions.value = []
  form.value.roles = []
  form.value.staffs = []
}

const submit = async () => {
  if (formMode.value == 'add') {
    loading.value = true
    let params = {
      ...props.data,
      ...form.value,
    }
    const { data, status } = await api.post('v2/permissions', params)

    if (status == 201) {
      emit('onCreated', params)
      toast(`เพิ่ม Role สำเร็จ`, {
        theme: 'auto',
        type: 'success',
        autoClose: 1500,
        dangerouslyHTMLString: true,
      })
      hide()
    }
    loading.value = false
  }
  if (formMode.value == 'edit') {
    loading.value = true
    let params = {
      ...props.data,
      ...form.value,
    }
    const { data, status } = await api.put('v2/permissions/' + props.data.id, params)

    if (status == 200) {
      selectedPermission.value = []
      emit('onUpdated', data.data)
      emit('update:data', data.data)
      toast(`${data.message}`, {
        theme: 'auto',
        type: 'success',
        autoClose: 1500,
        dangerouslyHTMLString: true,
      })
      hide()
    }
    loading.value = false
  }
}

const cancel = () => {}
onMounted(() => {})
</script>
<style lang="scss" scoped>
label {
  margin-top: 15px;
}
</style>
