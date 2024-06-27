<template>
    <div class="dropdown">
        <a class="btn btn-sm btn-text dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
            data-bs-toggle="dropdown" aria-expanded="false">
            {{ currentStatus }}
        </a>

        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li v-for="(item, key) in statuses" :key="key" @click="setStatus(item)">
                <a class="dropdown-item" href="javascript:void(0)">{{
                    item.text }}</a>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { billStatuses } from '@/config'
import { api } from '@/helpers/api';
import { ref, computed } from 'vue'
const props = defineProps({
    modelValue: {
        type: String,
    },
    data: {
        type: Object,
        default: () => { }
    },
    onUpdate: {
        type: Function
    }
})
const emit = defineEmits(['onChange'])
const statuses = billStatuses
const currentStatus = computed(() => {
    let find = statuses.filter((i) => i.value == props.modelValue)
    return find[0] ? find[0].text : ''
})

const setStatus = async (item) => {
    const { data } = await api.put("v2/bills/" + props.data.id, {
        id: props.data.id,
        bill_status: item.value
    })
    if (data) {
        emit('onChange', data)
    }
}
</script>
