<template>
  <!-- <div v-if="data[fieldPercent]" class="d-inline-block" style="width: 3.5rem;">{{ myCurrency(Number(data[fieldPercent]))
  }} %
  </div> -->
  <div v-if="data[fieldAmount]" class="d-inline-block" style="width: 3.5rem;">-{{ myCurrency(data[fieldAmount]) }}</div>
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
