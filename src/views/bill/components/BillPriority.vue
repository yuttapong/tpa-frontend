<template>
  <div class="row g-2">
    <div class="col-auto">
      <label class="me-4 fw-bold">Priority</label>
      <div v-for="(c, key) in commitmentPriority" :key="key" class="form-check form-check-inline px-2 me-3">
        <input type="radio" :id="'priority' + key" v-model="props.modelValue" :value="c.code"
          :selected="c.default === true ? 'selected' : ''" class="form-check-input"
          @input="emit('update:modelValue', $event.target.value)" />

        <label class="form-check-label" :for="'priority' + key"> {{ c.text }}</label>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUpdated, provide } from 'vue'


const props = defineProps({
  modelValue: {
    type: String
  }
});
const emit = defineEmits(['update:modelValue']);

const commitmentPriority = [
  {
    code: 'low',
    text: 'ต่ำ',
    default: false,
  },
  {
    code: 'medium',
    text: 'ปานกลาง',
    default: true,
  },
  {
    code: 'height',
    text: 'สูง (ไม่มีการจองคิว)',
    default: false,
  },
]

</script>
