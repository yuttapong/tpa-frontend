<script setup>
import { onMounted, computed, ref, onUpdated } from "vue";
import { api } from "@/helpers/api";
import { Modal } from "bootstrap";
import '@popperjs/core'

const productId = defineModel({ default: 0 })
const props = defineProps({
    select: {
        type: Function
    },

})

const items = ref({})
const pagination = ref({
    per_page: 5,
    curent_page: 1,
})
const loading = ref(false)

const modalProduct = ref(null)
const modalProductRef = ref(null)

const formSearchProduct = ref({
    q: '',
})

const loadProducts = async () => {
    let params =
    {
        per_page: pagination.value.per_page,
        page: pagination.value.curent_page,
        ...formSearchProduct.value,
    }
    const { data } = await api.get("/v2/products", {
        params: params

    })

    if (data) {
        const p = {
            total: data?.total,
            page: data?.curent_page,
            per_page: data?.per_page,
            page_count: data?.last_page
        }
        pagination.value = p
        items.value = data.data
        loading.value = false
    }
}

const onSearchProduct = async () => {
    pagination.value.curent_page = 1;
    pagination.value.total = 0;
    try {
        loadProducts();
    } catch (error) {
    }
}

const showModal = () => {
    modalProduct.value.show()
}

const selectProduct = (item) => {

    let row = {
        product_name: item.name,
        product_id: item.id,
        product: item,
        id_no: item?.id_no,
        model: item?.model,
        serialnumber: item?.serialnumber,
        barcode_no: item?.barcode_no,
        manufaturer_name: item?.manufaturer_name,
        lab: item.lab,
        discount: 0,
        price: 0,
        qty: 1
    }

    props.select(row);

    modalProduct.value.hide()
}


onMounted(() => {
    modalProduct.value = new Modal(modalProductRef.value)
    modalProduct.value.hide()
    loadProducts();
})

onUpdated(() => {


})
</script>
<template>
    <input v-model="productId" class="form-control form-control-sm" @click="showModal()" />
    {{ productId }}
    <div class=" modal" ref="modalProductRef">
        <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">สินค้า/เครื่องมือ</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Small tables -->
                    <div style="height: 350px; overflow: scroll;" class="table table-responsive">
                        <form @submit.prevent="onSearchProduct()">
                            <div class="row g-2">
                                <div class="col-6 col-md-4 col-lg-3">
                                    <input type="search" v-model="formSearchProduct.q" name="q"
                                        class="form-control form-control-sm" placeholder="Code"
                                        @keyup.enter="onSearchProduct()" />
                                </div>

                                <div class="col-6 col-md-4 col-lg-3">
                                    <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />

                                </div>
                            </div>
                        </form>

                        <table class="table table-sm table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Action</th>
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
                                    <th scope="row"><button class="btn btn-success btn-sm d-block"
                                            @click="selectProduct(item)">เลือก</button></th>
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>
                                        <span class="badge bg-dark text-light">{{ item.code
                                        }}</span>
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
                    </div>
                    <!-- End small tables -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped></style>