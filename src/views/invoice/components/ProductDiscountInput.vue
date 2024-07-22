<template>
  <div class="input-group input-group-sm" style="width: 185px">
    <input
      type="number"
      style="width: 65px"
      class="form-control form-control-sm bg-danger text-white"
      v-model="percent"
      @change="onChangePercent"
      min="0"
      max="100"
    />
    <span class="input-group-text bg-danger text-white">%</span>
    <input
      type="number"
      style="width: 65px"
      class="form-control form-control-sm bg-warning text-black"
      v-model="amount"
      @change="onChangeAmount"
      min="0"
    />
    <span class="input-group-text bg-warning text-black">฿</span>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/appStore'
import { ref, watch, computed, onMounted } from 'vue'
const model = defineModel()
const props = defineProps({
  data: {
    type: Object,
  },
  index: { type: Number, required: true, default: 0 },
  fieldAmount: {
    type: String,
    required: true,
  },
  fieldPercent: {
    type: String,
    required: true,
  },
})
const appStore = useAppStore()

const percent = computed({
  get() {
    return props.data[props.fieldPercent]
  },
  set(value) {
    return value
  },
})
const amount = computed({
  get() {
    return props.data[props.fieldAmount]
  },
  set(value) {
    return value
  },
})
const emit = defineEmits(['change'])
const onChangePercent = (e) => {
  emit('change', {
    index: props.index,
    type: 'percentage',
    value: e.target.value,
    fieldAmount: props.fieldAmount,
    fieldPercent: props.fieldPercent,
  })
}
const onChangeAmount = (e) => {
  emit('change', {
    index: props.index,
    type: 'amount',
    value: e.target.value,
    fieldAmount: props.fieldAmount,
    fieldPercent: props.fieldPercent,
  })
}
</script>
