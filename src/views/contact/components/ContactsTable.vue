<template>
  <div class="table-responsive" v-if="items">
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Action</th>
          <th scope="col">ID</th>
          <th scope="col">ชื่อ - สกุล</th>
          <th scope="col">บริษัท</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in  items " :key="index">
          <th scope="row">
            <div class="btn-group">
              <button type="button" class="btn btn-sm" @click="view(item)"><i class="bi bi-search"></i></button>
              <!-- <button class="btn btn-sm"><i class="bi bi-trash"></i></button> -->
            </div>
          </th>
          <th>{{ item.id }}</th>

          <td>
            <a class="btn btn-link" role="button" @click="view(item)"> {{ item.contactname }}</a>
            <p>
              <span v-if="item.contacttel1" class="badge bg-light text-dark p-2 mx-1"><i class="bt bi-phone"></i> {{
                item.contacttel1 }}</span>
              <span v-if="item.contacttel2" class="badge bg-light text-dark p-2 mx-1"><i class="bt bi-phone"></i> {{
                item.contacttel2 }}</span>
              <span v-if="item.contactemail" class="badge bg-war text-dark p-2 mx-1">
                <i class="bi bi-person-vcard"></i> {{ item.contactemail }}</span>
            </p>
          </td>
          <td>
            <div v-if="item.company">{{ item.company }}</div>
          </td>
          <td>
            <StatusActive :status="item.status" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import StatusActive from "@/components/StatusActive.vue"
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
