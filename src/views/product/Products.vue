<template>
    <div class="pagetitle">
        <h1>Products</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item active">Products</li>
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
                                    data-bs-target="#qt-index">List</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab"
                                    data-bs-target="#tab-category">Category</button>
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


                                <form @submit.prevent="onSearch()">
                                    <div class="row g-2">
                                        <div class="col-6 col-md-4 col-lg-3">
                                            <input type="search" v-model="formSearchProduct.q" name="q"
                                                class="form-control form-control-sm" placeholder="keyword..."
                                                @keyup.enter="onSearch()" />
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
                                <!-- End small tables -->
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
import { DateTime, Number } from "@/helpers/myformat";
const row = ref({})
const items = ref({})
const pagination = ref({
    per_page: 15,
    curent_page: 1,
})
const loading = ref(true)
const formSearchProduct = ref({
    q: '',
})

const loadData = async () => {
    loading.value = true
    const { data, curent_page, last_page, per_page, total } = await api.get("/v2/products", {
        params: {
            ...pagination.value,
            ...formSearchProduct.value
        }
    })
    if (data) {

        const p = {
            total: total,
            page: curent_page,
            per_page: per_page,
            page_count: last_page
        }
        pagination.value = p
        items.value = data.data


    }
    loading.value = false

}
const onSearch = async () => {
    pagination.value.curent_page = 1;
    pagination.value.total = 0;
    try {
        loadData();
    } catch (error) {
        loading.value = false
    }
}

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