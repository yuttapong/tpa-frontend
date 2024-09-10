<template>
  <div class="">
    <span v-for="(status, key) in statuses" :key="key">
      <span class="fw-normal" v-if="status.value == props.modelValue">{{ status.text }}</span>
    </span>
  </div>
</template>
<script setup>
import { invoiceStatuses } from '@/config'
import {} from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
  },
})
const statuses = invoiceStatuses
</script>
