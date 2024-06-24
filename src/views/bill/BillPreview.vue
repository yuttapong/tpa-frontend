<script setup>
import { onMounted, computed, ref } from "vue";
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
import { useBillStore } from "@/stores/billStore";
import { useRoute } from "vue-router";


const billStore = useBillStore()
const route = useRoute()
const carts = computed(() => billStore.items)
const form = computed(() => billStore.form)


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
                                    <p class="fw-bolder" style="font-size: 1.2rem;">ใบขอรับบริการ</p>
                                </div>
                            </div>
                            <div size="">
                                {{ form }}
                                <div class="row g-2">
                                    <div class="col-12 col-lg-6 col-xl-4">
                                        <label>บริษัท
                                            <span v-if="form.company_id">({{ form.company_id }})</span></label>
                                        <input type="text" v-model="form.address_name" name="customer_name"
                                            class="form-control form-control-sm" placeholder="" @click="addCustomer" />
                                    </div>
                                    <div class="col-12 col-lg-6 col-xl-4">
                                        <label>ผู้ติดต่อ</label>
                                        <input type="text" v-model="form.agent_name" name="agent_name"
                                            class="form-control form-control-sm" placeholder="ผู้ติดต่อ"
                                            @click="addContact" />
                                    </div>
                                    <div class="col-12">
                                        <label>ที่อยู่</label>
                                        <textarea v-model="form.address_detail" class="form-control form-control-sm"
                                            placeholder="" rows="3" />
                                    </div>
                                    <div class="col-12 col-lg-6 col-xl-4">
                                        <label>ผู้ส่ง(ชื่อ)</label>
                                        <input type="text" v-model="form.sender_name" name="sender_name"
                                            class="form-control form-control-sm" placeholder="ผู้ส่ง" />
                                    </div>
                                    <div class="col-12 col-lg-6 col-xl-4">
                                        <label>ผู้ส่ง(เบอร์โทร)</label>
                                        <input type="text" v-model="form.sender_tel" class="form-control form-control-sm"
                                            placeholder="เบอร์โทร" />
                                    </div>
                                    <div class="col-12 col-lg-6 col-xl-4">
                                        <label>ผู้ส่ง(email)</label>
                                        <input type="text" v-model="form.sender_email" class="form-control form-control-sm"
                                            placeholder="email" />
                                    </div>
                                    <div class="col-12 col-lg-6 col-xl-4">
                                        <label>ผู้ส่ง(แผนกงาน)</label>
                                        <input type="text" v-model="form.sender_department"
                                            class="form-control form-control-sm" placeholder="แผนก" />
                                    </div>
                                </div>
                                <table class="table table-sm table-condensed">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="text-decoration-underline fw-bold">ลำดับที่</th>
                                            <th scope="col" class="text-decoration-underline  fw-bold">รายการ</th>
                                            <th scope="col" class="text-decoration-underline text-end fw-bold">จำนวน</th>
                                            <th scope="col" class="text-decoration-underline text-end fw-bold">ส่วนลด</th>
                                            <th scope="col" class="text-decoration-underline text-end fw-bold">ราคารวม</th>


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
                                            <td class="text-end">{{ item.qty }}</td>
                                            <td class="text-end">{{ item.discount }}</td>
                                            <td class="text-end">{{ item.price }}</td>





                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>

                                            <td colspan="6">

                                            </td>
                                            <td>

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
                                <router-link to="/bills/form" class="btn btn-sm btn-secondary w-100">
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