<template>
    <div class="dropdown">
        <a class="btn btn-sm btn-outline-secondary dropdown-toggle p-1" href="#" role="button" id="dropdownMenuLink"
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
import { jobStatuses } from '@/config'
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
const statuses = jobStatuses
const currentStatus = computed(() => {
    let find = statuses.filter((i) => i.value == props.modelValue)
    return find[0] ? find[0].text : ''
})

const setStatus = async (item) => {
    const { data } = await api.put("v2/workorders/" + props.data.item_id, {
        item_id: props.data.item_id,
        job_status: item.value
    })
    if (data) {
        emit('onChange', data)
    }
}
</script>
