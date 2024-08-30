<template>
  <div class="row">
    <div class="col-12">
      <h5>บทบาท</h5>
      <ul v-if="filterRoles">
        <li v-for="(item, key) in filterRoles" :key="key" :value="item">
          {{ `${item?.name} - ${item.description}` }}
        </li>
      </ul>
      <h5>การอนุญาต</h5>
      <ul v-if="filterPermissions">
        <li v-for="(item, key) in filterPermissions" :key="key" :value="item">
          {{ `${item?.name} - ${item.description}` }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  permissions: {
    type: Array,
    required: false,
    default: () => [],
  },
  roles: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const roleSelected = ref()

const items = computed(() => {
  let items = []
  if (props.roles.length > 0) {
    props.roles.map((r) => {
      items.push({
        type: 'role',
        description: r.display_name,
        name: r.name,
      })
    })
  }
  if (props.permissions.length > 0) {
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
  return props.roles.filter((item) => item)
})
const filterPermissions = computed(() => {
  return props.permissions.filter((item) => item)
})

const onSelected = (e, item) => {
  console.log(e, item)
}
const chooseLab = (e, item) => {
  console.log(e, item)
}
</script>
<style scoped lang="scss"></style>
