<template>
  <div class="table-responsive">
    <table class="table table-sm table-hover table-borderless">
      <thead>
        <tr>
          <th scope="col" class="fw-bold text-decoration-underline">Actions</th>
          <th scope="col" class="fw-bold text-decoration-underline">ID</th>
          <th scope="col" class="fw-bold text-decoration-underline">Code</th>

          <th scope="col" class="fw-bold text-decoration-underline">Name</th>
          <th scope="col" class="fw-bold text-decoration-underline">Username</th>
          <th scope="col" class="fw-bold text-decoration-underline">Level</th>
          <th scope="col" class="fw-bold text-decoration-underline">Created</th>
          <th scope="col" class="fw-bold text-decoration-underline">สถานะ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <th>
            <StaffButtonActions
              canAssingLab
              canEdit
              canView
              @clickView="viewStaff(item)"
              @clickAssignLab="viewLabAssign(item)"
              @clickEdit="viewEdit(item)"
              canAssingRole
              @clickAssignRole="viewRoleAssign(item)"
            />
          </th>
          <th scope="row">{{ item.id }}</th>
          <td>{{ item.code }}</td>

          <td>
            <a class="text-primary" role="button" @click="viewStaff(item)">
              {{ `${item.name_th} ${item.lastname_th}` }}<br />
            </a>
          </td>
          <td>{{ item.username }}</td>
          <td>{{ item.level }}</td>
          <td>
            <span class="badge bg-light text-dark">{{
              myFormatDate(new Date(item.date_starts))
            }}</span>
          </td>
          <td><status-active :status="item.status" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import {} from 'vue'
import LabAssignForm from '@/views/staff/components/LabAssignForm.vue'
import StaffButtonActions from '@/views/staff/components/StaffButtonActions.vue'
import { myFormatDate } from '@/helpers/myformat'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  onView: {
    type: Function,
  },
  onEdit: {
    type: Function,
  },
  onAssignRole: {
    type: Function,
  },
})
const emit = defineEmits(['onView', 'onEdit', 'onAssignRole'])

const viewStaff = (item) => emit('onView', item)
const viewLabAssign = (item) => emit('onAssignLab', item)
const viewRoleAssign = (item) => emit('onAssignRole', item)
const viewEdit = (item) => emit('onEdit', item)
</script>
