<script setup>
defineProps({
    data: {
        type: Boolean,
        required: true
    }
})
</script>

<template>
    <div>
        <span class="code px-2" v-if="data">{{ data }}</span>
    </div>
</template>

<style lang="scss" scoped>
.code {
    min-width: 100px;
    display: inline-block;
    background: #000;
    color: #ffffff;
    border-radius: 15px;
    text-align: center;
}
</style>
