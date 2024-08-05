<template>
  <div class="row">
    <div class="col-12">
      <div class="p-2 d-flex bd-highlight gap-2">
        <span class="p-2 bd-highlight border border" role="button">Quotation</span>
        <span class="p-2 bd-highlight border border" role="button">Bill</span>
        <span class="p-2 bd-highlight border border" role="button">Invoice</span>
      </div>
      <select
        v-model="roleSelected"
        class="form-select"
        @click="onSelected($event)"
        aria-label="เลือกห้องแล็ป"
        multiple
        style="min-height: 200px"
      >
        <optgroup label="Roles">
          <option v-for="(item, key) in filterRoles" :key="item" :value="item">
            {{ `${item?.name} - ${item.description}` }}
          </option>
        </optgroup>

        <optgroup label="Permissions">
          <option v-for="(item, key) in filterPermissions" :key="item" :value="item">
            {{ `${item?.name} - ${item?.description}` }}
          </option>
        </optgroup>
      </select>

      <!-- 
            <select class="form-select mt-2" style="min-height: 200px;" multiple aria-label="เลือกห้องแล็ปย่อย">
                <option :value="[]">---------- เลือกห้องแล็ปย่อย -------------</option>
                <option v-for="(item, key) in allSelected" :value="item">{{ `${item?.code} - ${item?.name_th}` }}</option>

            </select> -->
      <div class="row my-2">
        <div class="col-4">
          <button class="btn btn-secondary"><i class="bi bi-arrow-down"></i></button>
        </div>
        <div class="col-4">
          <button class="btn btn-secondary">
            <i class="bi bi-arrow-down"></i>
            ...
            <i class="bi bi-arrow-down"></i>
          </button>
        </div>
        <div class="col-4">
          <button class="btn btn-success">
            <i class="bi bi-arrow-down"></i>
            All Roles & Permissions
            <i class="bi bi-arrow-down"></i>
          </button>
        </div>
      </div>
      <select class="form-select" style="min-height: 200px" multiple aria-label="เลือกห้องแล็ปย่อย">
        <optgroup label="Roles">
          <option v-for="(item, key) in filterRoles" :key="item" :value="item">
            {{ `${item?.name} - ${item?.description}` }}
          </option>
        </optgroup>

        <optgroup label="Permissions">
          <option v-for="(item, key) in filterPermissions" :key="item" :value="item">
            {{ `${item?.name} - ${item?.description}` }}
          </option>
        </optgroup>
      </select>
    </div>

    <div class="col-12"></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  permissions: {
    type: Array,
    required: true,
    default: [],
  },
  roles: {
    type: Array,
    required: true,
    default: [],
  },
  defaultRoles: {
    type: Array,
    default: [],
  },
  defaultPermissions: {
    type: Array,
    default: [],
  },
  userPermissions: {
    type: Array,
    default: [],
  },
  onSave: {
    type: Function,
  },
})

const roleSelected = ref()

const items = computed(() => {
  let items = []
  if (props.roles) {
    props.roles.map((r) => {
      items.push({
        type: 'role',
        description: r.display_name,
        name: r.name,
      })
    })
  }
  if (props.permissions) {
    props.permissions.map((r) => {
      items.push({
        type: 'permission',
        description: r.display_name,
        name: r.name,
      })
    })
  }
  return items
})

const filterRoles = computed(() => {
  return items.value.filter((item) => item.type == 'role')
})
const filterPermissions = computed(() => {
  return items.value.filter((item) => item.type == 'permission')
})

const onSelected = (e, item) => {
  console.log(e, item)
}
const chooseLab = (e, item) => {
  console.log(e, item)
}
</script>
<style scoped lang="scss"></style>
