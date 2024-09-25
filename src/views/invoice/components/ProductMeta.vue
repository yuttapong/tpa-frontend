<template>
  <div class="">
    <small v-if="item.id_no" class="badge bg-warning text-dark"><i>IdNo: </i> {{ item.id_no }}</small>
    <small v-if="item.model" class="ms-2 badge text-bg-light"><i>Model: </i> {{ item.model }}</small>
    <small v-if="item.serialnumber" class="ms-2 badge text-bg-light"><i>SN.: </i> {{ item.serialnumber }}</small>
    <small v-if="item.barcode_no" class="ms-2 badge text-bg-light"><i>barcode.: </i> {{ item.barcode_no }}</small>
    <div class="fw-light">
      <small>{{ item.test_point }}</small>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(['item'])
</script>
