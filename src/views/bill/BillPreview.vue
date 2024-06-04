<script setup>
import { onMounted, computed, ref } from "vue";
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
import { useBillStore } from "@/stores/billStore";
import { useRoute } from "vue-router";


const billStore = useBillStore()
const route = useRoute()
const carts = computed(() => billStore.items)


</script>
<template>
    <div class="pagetitle">
        <h1>ใบขอรับบริการ</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                <li class="breadcrumb-item"><router-link to="/bills">ใบขอรับบริการ</router-link></li>
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
                                        <tr v-for="(item, index) in carts" :key="index">

                                            <th scope="row">{{ index + 1 }}</th>
                                            <!-- <td> {{ item.item_code }}</td> -->
                                            <td>{{ item.product_name }}
                                                <span class="mx-1">{{ item.serialnumber }}</span>
                                                <span class="mx-1">{{ item.model }}</span>
                                                <span class="mx-1">{{ item.id_no }}</span>
                                            </td>
                                            <td>{{ item.qty }}</td>
                                            <td>{{ item.discount }}</td>
                                            <td>{{ item.price }}</td>





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
                                <router-link to="/dashboard" class="btn btn-sm btn-secondary w-100">
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