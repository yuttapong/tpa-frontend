<template>
    <div class="pagetitle">
        <h1>Contacts</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item">ข้อมูล</li>
                <li class="breadcrumb-item active">รายชื่อ</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section profile">

        <spinner :visible="loading" />


        <div v-if="items">


            <ContactsTable v-model:items="items" @show="viewContact" />

            <ModalContactDetail ref="modalContact" v-model:data="dataView" :title="dataView?.contactname" />

            <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                :on-click="onChangePage" />

        </div>
    </section>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import avatar from "@/assets/img/profile-img.jpg"
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
import ContactsTable from "@/views/contact/components/ContactsTable.vue";
import ModalContactDetail from "@/views/contact/components/ModalContactDetail.vue";
import { useAppStore } from "@/stores/appStore";

const dataView = ref({})
const items = ref([])
const appStore = useAppStore()
const pagination = ref({
    total: 0,
    current_page: 1,
    last_page: 0,
    per_page: appStore.settings.page.perPage,
})
const loading = ref(true)
const modalContact = ref(null)

const viewContact = async (row) => {
    console.log('view', row);
    modalContact.value.show()
    dataView.value = row
    const { data } = await api.get("/v2/contacts/" + row.id)
    if (data) dataView.value = data
}

const loadData = async () => {
    let params = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
    }
    const { data } = await api.get("/v2/contacts", {
        params
    })
    if (data) {

        const p = {
            total: data.total,
            current_page: data.current_page,
            per_page: data.per_page,
            last_page: data.last_page,
        }
        pagination.value = p
        items.value = data.data
        loading.value = false
    }

}

const onChangePage = (page) => {
    pagination.value.current_page = page
    loadData()
}
const search = (page) => {
    pagination.value.current_page = 1
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