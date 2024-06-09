<script setup>
import { onMounted, computed, ref } from "vue";
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
import { useInvoiceStore } from "@/stores/invoiceStore";
import ProductMeta from "@/views/invoice/components/ProductMeta.vue"

const invoiceStore = useInvoiceStore()

const invoiceItems = computed(() => invoiceStore.items)

onMounted(() => {


})
</script>
<template>
    <div class="pagetitle">
        <h1>Invoices</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item"><router-link tag="a" to="/invoices">Invoices</router-link></li>
                <li class="breadcrumb-item"><router-link tag="a" to="/invoices/create">Form</router-link></li>
                <li class="breadcrumb-item active">Preview</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section">

        <div class="row">
            <div class="col-12 col-lg-9">

                <div class="card">
                    <div class="card-body pt-3">
                        <div class="preview">
                            <div class="row">
                                <div class="col-6">
                                    <p>
                                        <img src="https://tpacal.or.th/wp-content/uploads/2023/12/Logo-Banner-new-1.jpg"
                                            height="60" />
                                    </p>
                                </div>
                                <div class="col-6">
                                    <p class="fw-bolder" style="font-size: 1.2rem;">Invoice # INV-20240400001</p>
                                </div>
                            </div>
                            <div size="">

                                <table class="table table-sm table-condensed">
                                    <thead>
                                        <tr>
                                            <th scope="col">ลำดับที่</th>
                                            <th scope="col">รายการ</th>
                                            <th scope="col">จำนวน</th>
                                            <th scope="col">ส่วนลด</th>
                                            <th scope="col">ราคารวม</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in invoiceItems" :key="index">

                                            <th scope="row">{{ index + 1 }}</th>
                                            <!-- <td> {{ item.item_code }}</td> -->
                                            <td>{{ item.product_name }}


                                                <ProductMeta :item="item"/>
                           
                                            </td>
                                            <td>{{ 1 }}</td>
                                            <td>{{ parseFloat(item.discount).toLocaleString() }}</td>
                                            <td>{{ parseFloat(item.total).toLocaleString() }}</td>





                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>

                                            <td colspan="6">

                                            </td>
                                            <td>
                                                xxxx
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-3">

                <div class="card">
                    <div class="card-body pt-3">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'invoices.create' }" class="btn btn-sm btn-secondary w-100">
                                    <i class="bi bi-pencil"></i>
                                    แก้ไข</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>





    </section>
</template>


<style lang="scss" scoped>
div[size="A4"] {
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

div[size="A4"][layout="portrait"] {
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