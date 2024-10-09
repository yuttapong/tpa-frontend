<script setup>
defineProps({
    data: {
        type: Boolean,
        required: true
    }
})
</script>

<template>
    <div v-if="data">
        <BBadge variant="info" v-if="Boolean(data) == true">JOB
        </BBadge>
    </div>
</template>

<style lang="scss" scoped></style>
