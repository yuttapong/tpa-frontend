<template>
  <span v-if="data[fieldAmount]" class="mx-1">-{{ myCurrency(data[fieldAmount]) }}</span>
  <small v-if="data[fieldPercent]"><br />({{ myCurrency(Number(data[fieldPercent])) }} %) </small>
</template>
<script setup>
import { myCurrency } from '@/helpers/myformat'
const props = defineProps({
  data: {
    type: Object,
  },
  index: { type: Number, required: false, default: 0 },
  fieldAmount: {
    type: String,
    required: true,
  },
  fieldPercent: {
    type: String,
    required: true,
  },
})
</script>
