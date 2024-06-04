<template>
  <div>
    <fieldset class="border p-2">
      <legend v-if="title" class="fw-normal" style="font-size: 16px">{{ title }}</legend>
      <div class="row g-2">
        <div class="col-auto">
          <input type="date" id="commitment_date" v-model="IcommitmentDate" class="form-control-sm form-control"
            @change="onChange" />
        </div>
        <div class="col-auto">
          <label class="me-4 fw-bold">Priority</label>
          <div v-for="(c, key) in commitmentPriority" :key="key" class="form-check form-check-inline px-2 me-3">
            <input type="radio" :id="'priority' + key" v-model="Ipriority" :value="c.code"
              :selected="c.default === true ? 'selected' : ''" class="form-check-input" @change="onChange" />

            <label class="form-check-label" :for="'priority' + key"> {{ c.text }}</label>
          </div>
        </div>

        <div class="col-auto">
          <!-- <button
            class="btn btn-primary btn-sm"
            type="button"
            :disabled="loadingCommitment"
            @click="seachCommitmentDate"
            
          >
            <template v-if="loadingCommitment">
              <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
              <span class="visually-hidden">Loading...</span>
            </template>
            <template v-else><i class="bi bi-search"></i></template>
          </button> -->
        </div>
        {{ commitmentDate }}
      </div>

      <span class="text-success p-1" v-if="messageSuccessCommitment">{{
        messageSuccessCommitment
      }}</span>
      <span class="text-danger p-1" v-if="messageErrorCommitment">{{
        messageErrorCommitment
      }}</span>
    </fieldset>
  </div>
</template>
<script setup>
import axios from 'axios'
import { formatInTimeZone, toZonedTime, toDate, format } from 'date-fns-tz'
import { formatISO } from 'date-fns'
import { ref, computed, onMounted, onUpdated } from 'vue'
import { timezone } from '@/config'
import { useAppStore } from '@/stores/appStore'
import { object } from 'yup'

const appStore = new useAppStore()
const emit = defineEmits(['onSearch', 'change'])
const props = defineProps({
  title: {
    type: String,
    default: 'Commitment Date',
  },
  data: {
    type: object,
  },
  priority: {
    type: String,
    default: 'medium'
  },
  commitmentDate: {
    type: String,
  }
})
const loadingCommitment = ref(false)
const errorMsg = ref()
const resultCommitment = ref()
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const IcommitmentDate = ref(props.commitmentDate)
const Ipriority = ref(props.priority)
const result = ref({})

onMounted(() => {

})

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
const items = computed(() => {
  if (props.data.items) {
    return props.data.items.map((item) => {
      return {
        duration: 3,
        item_code: item.item_code,
        lab_id: item.lab_id,
        product_id: item.product_id,
        reserved_date: item.reserved_date,
        sorter: item.sorter,
        sublab_id: item.sublab_id,
        workorder_id: item.item_id,
      }
    })
  }
  return []
})
const onChange = () => {
  let data = {
    commitment_date: IcommitmentDate.value,
    priority: Ipriority.value
  }
  emit('change', data)
}

// const seachCommitmentDate = async () => {
//   messageErrorCommitment.value = ''
//   messageSuccessCommitment.value = ''

//   if (!formCommitment.value.commitment_date || !formCommitment.value.priority) {
//     messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
//     return
//   }
//   let d1 = props.data.document_date ? new Date(`${props.data.document_date} 00:00:00`) : ''
//   let d2 = new Date(`${formCommitment.value.commitment_date} 00:00:00`)
//   const params = {
//     priority: formCommitment.value.priority,
//     bill_id: props.data.bill_id,
//     code: props.data.code,
//     document_date: d1 ? formatISO(toZonedTime(props.data.document_date, timezone)) : '',
//     commitment_date: d2 ? formatISO(toZonedTime(d2, timezone)) : '',
//     items: items.value,
//   }

//   loadingCommitment.value = true
//   try {
//     const { data } = await axios
//       .post(import.meta.env.VITE_KANBAN_API_URL + '/bills/inquiry', params, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${appStore.token}`,
//         },
//       })
//       .catch((err) => {
//         loadingCommitment.value = false
//         if (err.response) {
//           let data = err.response?.data
//           console.log('err', data)
//           if (data) {
//             messageErrorCommitment.value = data.message
//           } else {
//             messageErrorCommitment.value = err.message
//           }
//         } else {
//           messageErrorCommitment.value = err.message
//         }
//       })
//     setTimeout(() => {
//       loadingCommitment.value = false
//     }, 2000)
//     resultCommitment.value = data
//     console.log('=>', data)
//     if (data) {
//       if (data.success) {
//         let message = `สำเร็จค้นพบวันที่ ${formatISO(data.data?.commitment_date)}`
//         resultCommitment.value.message = message
//         console.log(message)
//         messageSuccessCommitment.value = message
//       } else {
//         messageErrorCommitment.value = data.message
//       }
//     }
//     emit('onSearch', data)
//   } catch (error) {
//     console.log('error', error)
//     loadingCommitment.value = false
//   }
// }
</script>
