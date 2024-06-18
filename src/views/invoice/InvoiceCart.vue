<script setup>
import { onMounted, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'

const invoiceStore = useInvoiceStore()

const invoiceItems = computed(() => invoiceStore.items)

onMounted(() => { })
</script>
<template>
    <div class="pagetitle">
        <h1>Invoice Cart</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item">
                    <router-link tag="a" to="/invoices">Invoices</router-link>
                </li>
                <li class="breadcrumb-item active">Cart</li>
            </ol>
        </nav>
    </div>
    <!-- End Page Title -->

    <section class="section">

    </section>
</template>

<style lang="scss" scoped>
div[size='A4'] {
    width: 21cm;
    height: 29.7cm;
    padding: 10px;
    background: white;
    display: block;
    margin: 0 auto;
    margin-bottom: 0.5cm;
    box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);

    >p,
    span,
    li,
    td {
        font-size: 12px;
        font-family: Arial;
    }
}

div[size='A4'][layout='portrait'] {
    width: 29.7cm;
    height: 21cm;
}

@media print {

    body,
    page {
        margin: 0;
        box-shadow: 0;
    }
}
</style>
