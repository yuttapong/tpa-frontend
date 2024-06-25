<template>
  <span v-for="(status, key) in statuses" :key="key">
    <small class="fw-normal" v-if="status.value == props.modelValue">{{ status.text }}</small>
  </span>
</template>
<script setup>
import { jobStatuses } from '@/config'
import {} from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
  },
})
const statuses = jobStatuses
</script>
