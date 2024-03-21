<template>
    <div class="p-2" v-if="data">
        <div class="row">
            <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Code</div>
            <div class="col-lg-9 col-md-8">
                {{ data.customercode }}
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Name</div>
            <div class="col-lg-9 col-md-8">
                {{ data.companyname }}
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Phone</div>
            <div class="col-lg-9 col-md-8">
                {{ data.phone }}
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Tax Number</div>
            <div class="col-lg-9 col-md-8">
                {{ data.taxnumber }}
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Address</div>
            <div class="col-lg-9 col-md-8">

                {{ data.province }}
            </div>
        </div>

    </div>
</template>
<script setup>
const props = defineProps({
    data: {
        type: Object
    }
})
</script>