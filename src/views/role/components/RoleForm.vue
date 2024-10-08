<template>
  <BModal v-model="showModal" :title="title" hide-header buttonSize="sm" :ok-title="formMode">
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

      <div class="row mt-2">
        <div class="col-5">
          <h6>ทั้งหมด ({{ permissionsFiltered.length }})</h6>
          <BFormInput size="sm" v-model="formSearchRole.name" placeholder="ค้นหา..." />
          <BFormSelect v-model="selectedLeftItems" :select-size="10" valueField="id" textField="name" multiple>
            <template v-for="(item, key) in permissionsFiltered" :key="key">
              <BFormSelectOption :value="item.id">{{ item.name }}</BFormSelectOption>
            </template>
          </BFormSelect>
        </div>
        <div class="col-2">
          <div class="d-flex flex-column gap-2 align-items-center align-content-center pt-5">
            <BButton @click="chooseOne()" type="button" size="sm" variant="success"><i class="bi bi-chevron-right"></i>
            </BButton>
            <BButton @click="chooseAll()" type="button" size="sm" variant="success"><i
                class="bi bi-chevron-double-right"></i></BButton>
            <BButton @click="removeOne()" type="button" size="sm" variant="danger"><i class="bi bi-chevron-left"></i>
            </BButton>

            <BButton @click="removeAll()" type="button" size="sm" variant="danger"><i
                class="bi bi-chevron-double-left"></i></BButton>
            <Spinner v-model:visible="loading" />
          </div>
        </div>
        <div class="col-5">
          <h6>อนุญาต ({{ rolePermissionsFiltered.length }})</h6>
          <BFormInput size="sm" v-model="formSearchPermission.name" placeholder="ค้นหา..." />
          <BFormSelect v-model="selectedRightItems" :options="rolePermissionsFiltered" :select-size="10" valueField="id"
            textField="name" multiple />
        </div>
      </div>
    </BForm>
    <template #footer>
      <div class="d-flex flex-warp gap-2">
        <BButton variant="primary" size="sm" type="button" @click="submit"><i class="bi bi-save"></i> บันทึก</BButton>
        <BButton variant="outline-secondary" size="sm" type="button" @click="hide"><i class="bi bi-x"></i> ปิด</BButton>
      </div>
    </template>
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
})

const appStore = useAppStore()

const items = ref([])
const selectedLeftItems = ref([])
const selectedRightItems = ref([])
const rolePermissions = ref([])
const permissions = ref([])
const permissionsFiltered = computed(() => {
  return permissions.value.filter((item) => {
    let a = String(item?.name)
    let b = String(formSearchRole.value.name)
    return a.includes(b)
  })
})
const rolePermissionsFiltered = computed(() => {
  return rolePermissions.value.filter((item, key) => {
    let a = String(item?.name)
    let b = String(formSearchPermission.value.name)
    return a.includes(b)
  })
})

const inArray = (needle, haystack) => {
  var length = haystack.length
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true
  }
  return false
}
const loading = ref(false)
const showModal = ref(props.visible)
const title = ref('Role')
const formSearchRole = ref({ name: '' })
const formSearchPermission = ref({ name: '' })
const form = ref({
  name: props.data?.name,
  display_name: props.data?.display_name,
  description: props.data?.description,
  status: props.data?.status,
})

const formMode = computed(() => props.mode)

const getRolePermissons = async () => {
  const { data } = await api.get(`/v2/roles/${props.data.id}/permissions`, {
    params: {},
  })
  rolePermissions.value = data
}
const getPermissions = async () => {
  loading.value = true
  const { data } = await api.get('v2/permissions')
  permissions.value = data
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
    if (props.mode == 'edit') {
      form.value.id = newValue.id
    }
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
  selectedLeftItems.value = []
  selectedRightItems.value = []
}
const chooseOne = async (e) => {
  let params = selectedLeftItems.value.map((item) => item)
  if (params.length > 0) {
    loading.value = false
    const { data, status } = await api.post(`v2/roles/${props.data.id}/permissions`, params)
    if (status == 200) {
      selectedLeftItems.value = []
      rolePermissions.value = data.data
    }

    loading.value = false
  }
}
const removeOne = async (e) => {
  if (selectedRightItems.value.length > 0) {
    loading.value = true
    const { data, status } = await api.delete(`v2/roles/${props.data.id}/permissions`, {
      data: selectedRightItems.value,
    })
    if (status == 200) {
      rolePermissions.value = data.data
      selectedRightItems.value = []
    }
    loading.value = false
  }
}
const chooseAll = async (e) => {
  const params = permissionsFiltered.value.map((item) => item.id)
  if (params.length > 0) {
    loading.value = true
    const { data, status } = await api.post(`v2/roles/${props.data.id}/permissions`, params)
    if (status == 200) {
      selectedLeftItems.value = []
      rolePermissions.value = data.data
    }
    loading.value = false
  }
}
const removeAll = async (e) => {
  const params = rolePermissionsFiltered.value.map((item) => item.id)
  if (params.length > 0) {
    loading.value = true
    const { data, status } = await api.delete(`v2/roles/${props.data.id}/permissions`, {
      data: params,
    })
    if (status == 200) {
      selectedRightItems.value = []
      rolePermissions.value = data.data
    }
    loading.value = false
  }
}

const submit = async () => {
  if (formMode.value == 'add') {
    loading.value = true
    let params = {
      ...form.value,
    }
    const { data, status } = await api.post('v2/roles', params)

    if (status == 201) {
      emit('onCreated', params)
      toast(`${data.message}`, {
        theme: 'auto',
        type: 'success',
        autoClose: 1500,
        dangerouslyHTMLString: true,
      })
      loading.value = false
      hide()
    }
  }

  if (formMode.value == 'edit') {
    loading.value = true
    let params = {
      ...form.value,
    }
    const { data, status } = await api.put('v2/roles/' + props.data.id, params)

    if (status == 200) {
      emit('onUpdated', data.data)
      emit('update:data', data.data)
      toast(`${data.message}`, {
        theme: 'auto',
        type: 'success',
        autoClose: 1500,
        dangerouslyHTMLString: true,
      })
      loading.value = false
      hide()
    }
  }
}


onMounted(() => { })
</script>
<style lang="scss" scoped>
label {
  margin-top: 15px;
}
</style>
