<template>
  <form class="row row-cols-lg-auto g-3 align-items-center my-2" @submit.prevent="onSearch">
    <div class="col-12">
      <label class="visually-hidden" for="inlineFormInputGroupUsername">Username</label>
      <div class="input-group">
        <div class="input-group-text">@</div>
        <input
          type="text"
          class="form-control"
          id="inlineFormInputGroupUsername"
          placeholder="keyword..."
          v-model="form.q"
        />
      </div>
    </div>

    <div class="col-12">
      <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
      <select class="form-select" id="inlineFormSelectPref" v-model="form.customer">
        <option selected>Choose...</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
    </div>

    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="inlineFormCheck" />
        <label class="form-check-label" for="inlineFormCheck"> Remember me </label>
      </div>
    </div>

    <div class="col-12">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</template>
<script setup>
import { defineComponent } from 'vue'

const props = defineProps({
  onSearch: {
    type: Function,
  },
})
</script>
