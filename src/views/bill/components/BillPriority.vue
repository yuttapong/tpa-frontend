<template>
  <div class="">
    <div class="">
      <div v-for="(c, key) in  commitmentPriority " :key="key" class=" form-check form-check-inline">
        <input v-model="props.modelValue" type="radio" :id="'priority' + key" :value="c.code" @change="onChange"
          :selected="c.default === true ? 'selected' : ''" class="form-check-input" :key="c" />

        <label class="form-check-label" :for="'priority' + key"> {{ c.text }}</label>
      </div>
    </div>

  </div>
</template>
<script setup>
import {  } from 'vue'
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
    code: 'high',
    text: 'สูง (ไม่มีการจองคิว)',
    default: false,
  },
]
const onChange = (e) => {
  emit("update:modelValue", e.target.value)
}

</script>
