<script setup>
import Datepicker from 'vue3-datepicker'
import { ref } from 'vue'
import { th } from 'date-fns/locale'
const picked = ref(new Date())
</script>

<template>
  <Datepicker v-model="picked" :locale="th" class="d-inline-block" />
</template>
<style>
.v3dp__clearable {
  display: inline;
}
</style>
