<template>
    <span v-if="data[fieldPercent]">{{ myCurrency(Number(data[fieldPercent])) }} % </span>
    <span v-if="data[fieldAmount]"> ({{ myCurrency(data[fieldAmount]) }})</span>
</template>
<script setup>
import { myCurrency } from '@/helpers/myformat';
const props = defineProps({
    data: {
        type: Object,
    },
    index: { type: Number, required: false, default: 0 },
    fieldAmount: {
        type: String,
        required: true,
    },
    fieldPercent: {
        type: String,
        required: true,
    },
})
</script>
