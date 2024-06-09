<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="spinner-grow" role="status" v-if="visible">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<style scoped></style>
