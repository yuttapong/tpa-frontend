<script setup>
defineProps({
    status: {
        type: Boolean,
        required: true
    }
})
</script>

<template>
    <div>
        <span class="badge bg-success text-white" v-if="status == 1">ใช้งาน</span>
        <span class="badge bg-danger text-white" v-else>ปิดใช้งาน</span>
    </div>
</template>

<style lang="scss" scoped></style>
