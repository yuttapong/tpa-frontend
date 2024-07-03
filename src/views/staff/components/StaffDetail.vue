<template>
    <div class="">
        <div class="row">
            <div class="col-2 fw-bold text-decoration-underline">ID</div>
            <div class="col-4">{{ data?.id }}</div>
            <div class="col-2 fw-bold text-decoration-underline">Code</div>
            <div class="col-4">{{ data?.code }}</div>
        </div>
        <div class="row">
            <div class="col-2 fw-bold text-decoration-underline">Username</div>
            <div class="col-4">{{ data?.username }}</div>
            <div class="col-2 fw-bold text-decoration-underline">Level</div>
            <div class="col-4">{{ data?.level }}</div>
        </div>
        <div class="row">
            <div class="col-2 fw-bold text-decoration-underline">ชื่อ - สกุล</div>
            <div class="col-4">{{ `${data?.name_th} ${data?.lastname_th}` }}</div>
            <div class="col-2 fw-bold text-decoration-underline">ชื่อ - สกุล</div>
            <div class="col-4">{{ `${data?.name} ${data?.lastname}` }}</div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
        required: true,
    },
})

</script>
<style scoped lang="scss">
select {
    optgroup label {
        font-weight: bold;
    }
}

optgroup {
    font-size: .9rem;
    font-weight: 'bold';
}

/* Bigger text */
</style>