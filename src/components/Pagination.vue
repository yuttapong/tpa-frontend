<template>
  <!-- Pagination 1 - HCF Bootstrap 5 Component -->

  <nav aria-label="Pagination">
    <ul class="pagination">
      <li class="page-item">
        <a
          class="page-link"
          @click="first()"
          :class="[model === 1 ? disabledClass : null]"
          href="javascript:void(0)"
          >|<</a
        >
      </li>
      <li class="page-item" :class="[model === 1 ? disabledClass : null]">
        <a class="page-link" @click="previous()" href="javascript:void(0)">&laquo;</a>
      </li>
      <li
        class="page-item"
        v-for="i in pageCount"
        :key="i"
        :class="[i == model ? activeClass : null]"
      >
        <a class="page-link" @click="paginate(i)" href="javascript:void(0)"> {{ i }}</a>
      </li>

      <li class="page-item" :class="[model === pageCount ? disabledClass : null]">
        <a class="page-link" @click="next()" href="javascript:void(0)">&raquo;</a>
      </li>
      <li class="page-item" :class="[currentPage === pageCount ? disabledClass : null]">
        <a class="page-link" @click="last()" href="javascript:void(0)">>|</a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
import { computed, ref } from 'vue'
const emit = defineEmits(['change'])
const model = defineModel()
const props = defineProps({
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  perPage: {
    type: Number,
    required: true,
  },

  pageCount: {
    type: Number,
    default: 0,
  },
})
const activeClass = ref('active')
const disabledClass = ref('disabled')

const currentPage = computed(() => model.value)
const paginate = (page) => {
  model.value = page
  console.log('paginate', model.value)
  emit('change', page)
}
const first = () => (model.value = 1)
const last = () => (model.value = props.pageCount)
const previous = () => {
  if (model.value > 1) {
    model.value--
    console.log('page', model.value)
  }
}
const next = () => {
  if (model.value < props.pageCount) {
    model.value++
    console.log('page', model.value)
  }
}
</script>
<style scope lang="scss"></style>
