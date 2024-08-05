<template>
  <div class="d-flex flex-wrap gap-1">
    <BButton v-show="canView" @click="clickView" size="sm" variant="outline-secondary"><i class="bi bi-eye"></i></BButton>
    <BDropdown v-model="show" split-variant="outline-secondary" size="sm" noCaret>
      <template #button-content><i class="bi bi-three-dots-vertical"></i><span class="visually-hidden">menu</span>
      </template>
      <BDropdownItem v-show="canEdit" @click="clickEdit"><i class="bi bi-pencil"></i>แก้ไข
      </BDropdownItem>
      <BDropdownItem v-show="canAssingLab" @click="clickAssignLab"><i class="bi bi-building-add"></i>กำหนดห้อง Lab
      </BDropdownItem>
      <BDropdownDivider />
      <BDropdownItem v-show="canCancel && item.canceled_at < 1" @click="clickCancel">
        <i class="bi bi-ban"></i>ยกเลิก
      </BDropdownItem>
      <BDropdownItem v-if="item.canceled_at > 0" disabled>ถูกยกเลิกแล้ว</BDropdownItem>
      <!-- <BDropdownDivider />
        <BDropdownItem active>Active action</BDropdownItem>
        <BDropdownItem disabled>Disabled action</BDropdownItem> -->
    </BDropdown>
  </div>
  <BModal v-model="modalCancel" :title="`ยืนยันยกเลิก ?`" @ok="confirmCancel()">
    <p>
      ต้องการยกเลิกใช่หรือไม่ ? {{ item?.code }}
      <br />
      <BTableSimple bordered>
        <BTbody>
          <BTr>
            <BTd>เลขที่ใบแจ้งหนี้</BTd>
            <BTd>{{ item.code }}</BTd>
          </BTr>
          <BTr>
            <BTd>ลูกค้า</BTd>
            <BTd>{{ item.customer_name }}</BTd>
          </BTr>
          <BTr>
            <BTd>ผู้ติดต่อ</BTd>
            <BTd>{{ item.contact_name }}</BTd>
          </BTr>
          <BTr>
            <BTd>จำนวนเงิน</BTd>
            <BTd>{{ myCurrency(item.totalnet) }}</BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </p>
    <p>
      <BFormTextarea v-model="formCancel.remark" />
    </p>
  </BModal>
</template>
<script setup>
import { myCurrency } from '@/helpers/myformat'
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
const emit = defineEmits(['clickView', 'clickEdit', 'clickCancel', 'clickAssignLab'])

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      item: {
      }
      index: 0
    },
  },
  canView: {
    type: Boolean,
  },
  canEdit: {
    type: Boolean,
  },
  canAssingLab: {
    type: Boolean,
  },
  canCancel: {
    type: Boolean,
  },
  clickCancel: {
    type: Function,
  },
  clickEdit: {
    type: Function,
  },
})
const item = computed(() => props.data || {})
const show = ref(false)
const modalCancel = ref(false)
const formCancel = reactive({
  id: item.value?.id,
  code: item.value?.code,
  remark: '',
})

const clickView = () => {
  emit('clickView', props.data)
}
const clickEdit = () => {
  emit('clickEdit', props.data)
}
const clickAssignLab = () => {
  emit('clickAssignLab', props.data)
}
const clickCancel = () => {
  modalCancel.value = true
  if (item.value.id !== formCancel.value.id) {
    formCancel.remark = ''
  }
}
const confirmCancel = () => {
  emit('clickCancel', props.data, formCancel)
  modalCancel.value = false
}
</script>
