<template>
  <div class="table-responsive">
    <table class="table table-sm table-borderless table-hover">
      <thead>
        <tr>
          <th scope="col" class="fw-bold text-decoration-underline">Action</th>
          <th scope="col" class="fw-bold text-decoration-underline">ID</th>
          <th scope="col" class="fw-bold text-decoration-underline">Code</th>
          <th scope="col" class="fw-bold text-decoration-underline">Name</th>
          <th scope="col" class="fw-bold text-decoration-underline">Name En</th>
          <th scope="col" class="fw-bold text-decoration-underline">Created At</th>
          <th scope="col" class="fw-bold text-decoration-underline">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <th scope="row">
            <div class="btn-group">
              <button class="btn btn-sm"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm"><i class="bi bi-trash"></i></button>
            </div>
          </th>
          <th scope="row">{{ item.id }}</th>
          <th scope="row">
            <a @click="view(item)" role="button">{{ item.code }}</a>
          </th>
          <td>
            <a @click="view(item)" role="button">{{ item.name }}</a>
          </td>
          <td>
            <a @click="view(item)" role="button">{{ item.nameen }}</a>
          </td>
          <td>
            {{ item.datestart }}
          </td>
          <td>
            {{ item.status }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
const emit = defineEmits(['show'])
const props = defineProps({
  items: {
    type: Array,
  },
  show: {
    type: Function,
  },
  onUpdate: {
    type: Function,
  },
  onCreate: {
    type: Function,
  },
})
const view = (item) => {
  console.log('show', item)
  emit('show', item)
}
</script>
