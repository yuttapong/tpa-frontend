<template>
  <div class="table-responsive" v-if="items">
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Action</th>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">ที่อยู่</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <th scope="row">
            <div class="btn-group">
              <button class="btn btn-sm" @click="view(item)"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm"><i class="bi bi-trash"></i></button>
            </div>
          </th>
          <th scope="row">{{ item.id }}</th>

          <td>
            <router-link role="button" class="btn btn-link" :to="`/data/customers/${item.id}`"> {{ item.companyname }}</router-link
            ><br />
            <span class="company-name">{{ item.companynameen }}</span>
            <p>
              <span class="badge bg-info text-white" v-if="item.is_company == 'yes'">Company</span>
              <span class="badge bg-light text-dark p-2 mx-1"
                ><i class="bt bi-phone"></i> {{ item.phone }}</span
              >
              <span class="badge bg-war text-dark p-2 mx-1">
                <i class="bi bi-person-vcard"></i> {{ item.taxnumber }}</span
              >
            </p>
          </td>
          <td>{{ item.province }}</td>
          <td>
            <span class="badge bg-light text-dark">{{ item.status }}</span>
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
})
const view = (item) => {
  emit('show', item)
}
</script>
<style lang="scss" scoped>
.comany-name {
  font-size: 13px;
  color: red;
}
</style>
