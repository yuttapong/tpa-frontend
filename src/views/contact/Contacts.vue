<template>
    <div class="pagetitle">
        <h1>Contacts</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item active">Contacts</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section profile">

        <spinner :visible="loading" />


        <div v-if="items">
            <div class="row gy-2 gx-2">
                <div class="col-12 col-md-4 col-xl-4 col-xxl-3" v-for="(item, index) in items" :key="index">

                    <div class="card rounded-5" style="height: 100%; font-size: 13px;">
                        <!-- <div>
                            <img src="https://placehold.co/220x350" class="rounded-start" />
                        </div> -->
                        <div class="">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <i class="bi bi-person-vcard"></i>
                                    {{ item.contactname }}
                                </h5>
                                <p class="card-text">
                                <div class="row">
                                    <div class="col-4"><i class="bi bi-person-bounding-box"></i></div>
                                    <div class="col-8">{{ item.contactposition }}</div>
                                </div>
                                <div class="row">
                                    <div class="col-4"><i class="bi bi-envelope"></i></div>
                                    <div class="col-8">{{ item.contactemail }}</div>
                                </div>
                                <div class="row">
                                    <div class="col-4"><i class="bi bi-telephone"></i> <i class="bi bi-1-circle"></i></div>
                                    <div class="col-8">{{ item.contacttel1 }}</div>
                                </div>
                                <div class="row">
                                    <div class="col-4"><i class="bi bi-telephone"></i> <i class="bi bi-2-circle"></i></div>
                                    <div class="col-8">{{ item.contacttel2 }}</div>
                                </div>
                                </p>

                                <router-link tag="a" :to="`/contacts/${item.id}`"
                                    class="btn btn-info text-light btn-sm">Contact</router-link>
                            </div>
                        </div>
                    </div>


                </div>
            </div>



        </div>
    </section>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import avatar from "@/assets/img/profile-img.jpg"
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
const row = ref({})
const items = ref([])
const pagination = ref({})
const loading = ref(true)
const loadData = async () => {
    const { data } = await api.get("/v2/contacts")
    if (data) {

        const p = {
            total: data.total,
            page: data.curent_page,
            per_page: data.per_page,
            page_count: data.last_page
        }
        pagination.value = p
        items.value = data.data
        loading.value = false
    }

}
const fullname = computed(() => row.value ? `${row.value?.name_th} ${row.value?.lastname_th}` : null)
onMounted(() => {
    loadData()
})
</script>
<style lang="scss" scoped>
.qt-detail {
    .row {
        margin-bottom: 20px;
        font-size: 15px;
    }

    .card-title {
        color: #012970;
    }

    .label {
        font-weight: 600;
        color: rgba(1, 41, 112, 0.6);
    }
}
</style>