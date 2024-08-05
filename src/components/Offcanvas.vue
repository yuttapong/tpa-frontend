<template>
  <div>
    <div class="offcanvas offcanvas-end" tabindex="-1" :id="computedId" ref="idRef" aria-labelledby="offcanvasLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasLabel">
          <slot name="title"> Offcanvas </slot>
        </h5>

        <slot name="button">
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </slot>
      </div>
      <div class="offcanvas-body">
        <slot name="body"></slot>
      </div>
    </div>
    <button type="button" @click="show">{{ props.modelValue }}</button>
    {{ props.id }}
  </div>
</template>
<script setup>
import { Offcanvas } from 'bootstrap'
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
  },
  modelValue: {
    type: Boolean,
  },
})
const idRef = ref(null)
const canvas = ref(null)
const computedId = computed(() => props.id)
const emit = defineEmits(['modelValue'])
onMounted(() => {
  canvas.value = new Offcanvas(idRef.value)
})
const show = () => canvas.value.show()
const hide = () => canvas.value.hide()
watch(props, () => {
  if (props.modelValue === true) {
    show()
  }
})
</script>
