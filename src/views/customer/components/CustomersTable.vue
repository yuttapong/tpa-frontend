<template>
  <div class="table-responsive" v-if="items">
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">ที่อยู่</th>
          <th scope="col">Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <th scope="row">{{ item.id }}</th>

          <td>
            <a @click="view(item)" role="button" class="btn btn-link"> {{ item.companyname }}</a
            ><br />
            <span class="badge bg-light text-danger">{{ item.companynameen }}</span>
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
            <!-- <span class="badge bg-light text-dark">{{ DateTime(new
                                                Date(item.datestart))
                                            }}</span> -->
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
