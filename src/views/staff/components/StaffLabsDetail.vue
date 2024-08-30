<template>
  <div class="row">
    <div class="col-12">
      <h5>Labs</h5>

      <select
        v-model="labSelected"
        class="form-select"
        @change="onSelected($event)"
        aria-label="เลือกห้องแล็ป"
      >
        <option :value="[]">---------- เลือกห้องแล็ป -------------</option>
        <option v-for="(item, key) in labs" :key="item" :value="item">
          {{ `${item?.code} - ${item?.name_th}` }}
        </option>
      </select>

      <select
        v-model="sublabSelected"
        class="form-select mt-2"
        style="min-height: 180px"
        multiple
        aria-label="เลือกห้องแล็ปย่อย"
      >
        <option :value="[]">---------- เลือกห้องแล็ปย่อย -------------</option>
        <option v-for="item in sublabs" :key="item" :value="item">
          {{ `${item?.code} - ${item?.name_th}` }}
        </option>
      </select>
      <div class="row my-2">
        <div class="col-4">
          <button class="btn btn-secondary"><i class="bi bi-arrow-down"></i></button>
        </div>
        <div class="col-4">
          <button class="btn btn-secondary">
            <i class="bi bi-arrow-down"></i>
            ...
            <i class="bi bi-arrow-down"></i>
          </button>
        </div>
        <div class="col-4">
          <button class="btn btn-success">
            <i class="bi bi-arrow-down"></i>
            All Lab & Sublab
            <i class="bi bi-arrow-down"></i>
          </button>
        </div>
      </div>
      <select
        v-model="allSelected"
        class="form-select"
        style="min-height: 180px"
        multiple
        aria-label="เลือกห้องแล็ปย่อย"
      >
        <optgroup
          v-for="item in labs"
          :value="item"
          :key="item"
          :label="`***** ${item?.code} - ${item?.name_th} *****`"
        >
          <option v-for="sub in item.sublabs" :key="sub" :value="sub">
            {{ `${sub?.code} - ${sub?.name_th}` }}
          </option>
        </optgroup>
      </select>
    </div>

    <div class="col-12"></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  labs: {
    type: Array,
    required: true,
    default: [],
  },
  defaultLabs: {
    type: Array,
    default: [],
  },
  defaultSublabs: {
    type: Array,
    default: [],
  },
  onSave: {
    type: Function,
  },
})

const labSelected = ref()
const sublabSelected = ref()
const allSelected = ref([])
const userLabs = ref(props.labs)
const userSublabs = ref([])

const sublabs = computed(() => {
  if (labSelected.value && labSelected.value.sublabs) {
    return labSelected.value.sublabs.map((i) => {
      return i
    })
  }
  return []
})
const onSelected = (e, item) => {
  console.log(e, item)
}
const chooseLab = (e, item) => {
  console.log(e, item)
}
</script>
<style scoped lang="scss">
select {
  optgroup label {
    font-weight: bold;
  }
}

optgroup {
  font-size: 0.9rem;
  font-weight: 'bold';
}

/* Bigger text */
</style>
