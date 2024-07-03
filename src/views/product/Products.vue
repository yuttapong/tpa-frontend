<template>
    <div class="pagetitle">
        <h1>เครื่องมือ ({{ pagination.total }})</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item">ข้อมูล</li>
                <li class="breadcrumb-item active">เครื่องมือ</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section profile">
        <spinner :visible="loading" />

        <div class="row" v-if="items">


            <div class="col-xl-12">

                <div class="card">
                    <div class="card-body pt-3">
                        <!-- Bordered Tabs -->
                        <ul class="nav nav-tabs nav-tabs-bordered">

                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab"
                                    data-bs-target="#qt-index">เครื่องมือ</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab"
                                    data-bs-target="#tab-category">หมวดหมู่</button>
                            </li>

                            <!-- <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-detail">Detail</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-edit">Edit</button>
                            </li>

                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab"
                                    data-bs-target="#qt-settings">Settings</button>
                            </li> -->



                        </ul>
                        <div class="tab-content pt-2">

                            <div class="tab-pane fade show active qt-index" id="qt-index">


                                <form @submit.prevent="search()">
                                    <div class="row g-2">
                                        <div class="col-6 col-md-4 col-lg-3">
                                            <input type="search" v-model="formSearchProduct.code" name="q"
                                                class="form-control form-control-sm" placeholder="code..."
                                                @keyup.enter="search()" />
                                        </div>
                                        <div class="col-6 col-md-4 col-lg-3">
                                            <input type="search" v-model="formSearchProduct.q" name="q"
                                                class="form-control form-control-sm" placeholder="keyword..."
                                                @keyup.enter="search()" />
                                        </div>

                                        <div class="col-6 col-md-4 col-lg-3">
                                            <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />

                                        </div>
                                    </div>
                                </form>

                                <!-- Small tables -->
                                <table class="table table-sm table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Code</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">CalPoint</th>
                                            <th scope="col">CalHour</th>
                                            <th scope="col">Duration (Minutes)</th>
                                            <th scope="col">CalPrice</th>
                                            <th scope="col">Lab/Sub Lab</th>
                                            <th scope="col">action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in items" :key="index">
                                            <th scope="row">{{ index + 1 }}</th>
                                            <td>
                                                <span class="badge bg-dark text-light">{{ item.code }}</span>
                                            </td>
                                            <td>{{ item.name }}</td>
                                            <td>{{ item.calpoint }}</td>
                                            <td>{{ item.calhour }}</td>
                                            <td>{{ item.duration }}</td>
                                            <td>{{ item.calprice }}</td>
                                            <td>
                                                <small class="fw-bold">{{ item.lab.name }}</small>
                                                <div>{{ item.sublab.name }}</div>
                                            </td>
                                            <td>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- End small tables --> <vue-awesome-paginate :total-items="pagination.total"
                                    :items-per-page="pagination.per_page"
                                    :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                                    :on-click="onChangePage" class="mt-3" />
                            </div>
                            <div class="tab-pane fade  tab-category" id="tab-category">



                                <!-- Small tables -->
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Code</th>
                                            <th scope="col">Name</th>


                                            <th scope="col">action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in items" :key="index">
                                            <th scope="row">{{ index + 1 }}</th>
                                            <td>{{ item.code }}</td>
                                            <td>{{ item.name }}</td>
                                            <td>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- End small tables -->
                            </div>



                        </div><!-- End Bordered Tabs -->

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
import { useAppStore } from '@/stores/appStore'


const row = ref({})
const appStore = useAppStore()
const items = ref({})
const pagination = ref({
    current_page: 1,
    total: 0,
    per_page: appStore.settings.page.perPage
})
const loading = ref(true)
const formSearchProduct = ref({
    q: '',
    code: ''
})

const loadData = async () => {
    loading.value = true
    let params = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
        ...formSearchProduct.value
    }
    const { data, current_page, last_page, per_page, total } = await api.get("/v2/products", {
        params: params,
    })
    if (data) {

        const p = {
            total: data?.total,
            current_page: data?.current_page,
            per_page: data?.per_page,
            page_count: data?.last_page,
        }
        pagination.value = p
        items.value = data.data


    }
    loading.value = false

}

const search = () => {
    pagination.value.current_page = 1
    loadData()
}
const onChangePage = (page) => {
    pagination.value.current_page = page
    loadData()
}


onMounted(() => {
    search()
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