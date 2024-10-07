<template>
    <div class="d-inline-block border rounded">
        <div class="d-flex flex-wrap gap-2 justify-content-start align-items-center pt-4 p-2">
            <div><i class="bi bi-gift fs-5 mb"></i></div>
            <div class="text-center">
                <label class="text-muted">รหัสลูกค้า</label>
                <p class="value  px-2">{{ props.customerId || "-" }}</p>
            </div>
            <div class="text-center">
                <label class="text-muted">ยอดสะสมสุทธิ</label>
                <p class="value  px-2">{{ myCurrency(props.reward?.accumulated_amount) }}</p>
            </div>
            <div class="text-center p-0">
                <label class="text-muted">ได้รับส่วนลด</label>
                <p class="value px-2">{{ myCurrency(props.discount?.discount) }}
                    <span class="ml-2" v-if="props.discount?.discount_type == 'percent'">%</span>
                    <span class="ml-2" v-if="props.discount?.discount_type == 'amount'">บาท</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { api } from '@/helpers/api';
import { myCurrency } from '@/helpers/myformat';
import { ref, watch } from 'vue'
const emit = defineEmits(['show'])
const props = defineProps({
    customerId: {
        type: Number,
    },
    customerName: {
        type: String,
    },
    discount: {
        type: Object,
        default: () => {
            return {
                customer_id: 0,
                discount: 0,
                discount_type: 'percent',
            }
        }
    },
    reward: {
        type: Object,
        default: () => {
            return {
                customer_id: 0,
                accumulated_amount: 0,
                name: '',
            }
        }
    },
    onClickLoad: {
        type: Function,
    },
})
const discount = ref()
const reward = ref()
const getData = async () => {
    if (props.customerId) {
        const { data } = await api.get(`v2/customers/${props.customerId}/statistics`)
        if (data) {
            console.log(data);
            reward.value = data.reward
            discount.value = data.discount
            emit('onClickLoad', data)
        }
    }
    return null
}
const loadData = () => {
    getData()
}
watch(props.customerId, (rs) => {
    getData()
})
</script>
<style lang="scss" scoped>
.value {
    height: 30px;
    background-color: rgb(111, 126, 120);
    color: #fff;
    border-radius: 5px;
    font-size: 1.2rem;
}
</style>