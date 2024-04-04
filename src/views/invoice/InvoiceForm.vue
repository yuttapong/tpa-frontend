<script setup>
import { onMounted, computed, ref, onUpdated } from "vue";
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
import { DateTime, Number } from "@/helpers/myformat";
import { Modal } from "bootstrap";
import { useInvoiceStore } from "@/stores/invoiceStore";
import ProductSelect from "@/views/product/components/ProductSelect.vue";

const row = ref({})
const items = ref({})
const pagination = ref({
    per_page: 5,
    curent_page: 1,
})
const loading = ref(false)
const modalView = ref(null)
const modalViewRef = ref(null)
const modalProduct = ref(null)
const modalProductRef = ref(null)
const invoiceStore = useInvoiceStore()
const invoice = ref({})
const formSearch = ref({
    code: "",
    taxnumber: "",
    q: ""
})
const invoiceItems = computed(() => invoiceStore.items)
const formInvoice = ref({
    "bill_code": "",
    "document_date": new Date(),
    "items": [],
    "agent_id": "",
    "agent_name": "",
    "status": "",
})

const loadData = async () => {
    let params =
    {
        per_page: pagination.value.per_page,
        page: pagination.value.curent_page,
        ...formSearch.value,
    }
    const { data } = await api.get("/v2/invoices", {
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
const getInvoiceById = async (id) => {
    try {
        const { data } = await api.get("/v2/invoices/" + id)
        if (data) {
            items.value = data
            loading.value = false
        }
    } catch (error) {
    }

}
const showDetail = (item) => {
    modalView.value.show();
    getInvoiceById(item.id)
}

const onSearch = async () => {
    pagination.value.curent_page = 1;
    pagination.value.total = 0;
    try {
        loadData();
    } catch (error) {
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
const resetFormSearch = () => {
    formSearch.value.taxnumber = ""
    formSearch.value.q = ""
}
const addItem = () => {
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
    invoiceStore.addItem(row)
    modalProduct.value.hide()
}

const removeItem = (item, index) => {
    console.log('remove', index, item)
    // let index = selectedItems.value.indexOf(item)
    formInvoice.value.items.splice(index, 1)
    invoiceStore.removeItem(item)
}

const updateItems = () => {
    invoiceStore.updateItems(invoiceItems.value)
}


onMounted(() => {
    modalView.value = new Modal(modalViewRef.value)
    modalView.value.hide()
    modalProduct.value = new Modal(modalProductRef.value)
    modalProduct.value.hide()
    loadProducts();
})
onUpdated(() => {
    console.log('onUpdated')
    invoiceStore.updateItems(invoiceItems.value)

})
</script>
<template>
    <div class="pagetitle">
        <h1>Invoices</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item"><router-link tag="a" to="/invoices">Invoices</router-link></li>
                <li class="breadcrumb-item active">สร้างใบแจ้งหนี้</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section">

        <div class="row">
            <div class="col-12 col-md-9">
                <div class="card">
                    <div class="card-body pt-3">

                        <spinner :visible="loading" />

                        <form @submit.prevent="onSearch()">
                            <div class="row g-2">
                                <div class="col-6 col-md-4 col-lg-3">
                                    <label>Date Issued</label>
                                    <input type="date" v-model="formSearch.document_date" name="code"
                                        class="form-control form-control-sm" placeholder="Code" />
                                </div>
                                <div class="col-6 col-md-4 col-lg-3">
                                    <label>Due Date</label>
                                    <input type="date" v-model="formSearch.due_date" name="code"
                                        class="form-control form-control-sm" placeholder="Code" />
                                </div>
                                <div class="col-6 col-md-4 col-lg-3">
                                    <label>Invoice Code</label>
                                    <input type="text" v-model="formSearch.code" name="code"
                                        class="form-control form-control-sm" placeholder="Code" />
                                </div>
                                <div class="col-6 col-md-4 col-lg-3">
                                    <label>ลูกค้า</label>
                                    <input type="text" v-model="formSearch.customer_name" name="customer_name"
                                        class="form-control form-control-sm" placeholder="" />
                                </div>
                                <div class="col-6 col-md-4 col-lg-3">
                                    <label>ผู้ติดต่อ</label>
                                    <input type="text" v-model="formSearch.agent_name" name="agent_name"
                                        class="form-control form-control-sm" placeholder="" />
                                </div>
                                <div class="col-6 col-md-4 col-lg-3">
                                    <label>ที่อยู่</label>
                                    <input type="text" v-model="formSearch.address" name="address"
                                        class="form-control form-control-sm" placeholder="" />
                                </div>

                                <div class="col-12">

                                    <table class="table table-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col">#</th>
                                                <th scope="col">Item Code</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Serial No.</th>
                                                <th scope="col">Model</th>
                                                <th scope="col">ID No.</th>

                                                <th scope="col">ส่วนลด</th>
                                                <th scope="col">ราคา</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in invoiceItems" :key="index">
                                                <th scope="row"><i @click="removeItem(item, index)"
                                                        class="bi bi-trash text-danger" role="button"></i>
                                                </th>
                                                <th scope="row">{{ index + 1 }}</th>
                                                <td>
                                                    <span class="badge bg-light text-dark">{{ item.item_code }}</span>
                                                </td>
                                                <td>{{ item.product_name }}</td>
                                                <td><input type="text" class="form-control form-control-sm"
                                                        v-model="item.serialnumber" />
                                                </td>
                                                <td><input type="text" class="form-control form-control-sm"
                                                        v-model="item.model" />
                                                </td>
                                                <td><input type="text" class="form-control form-control-sm"
                                                        v-model="item.id_no" />
                                                </td>


                                                <td><input type="number" class="form-control form-control-sm" min="0"
                                                        v-model="item.discount" /></td>
                                                <td><input type="number" class="form-control form-control-sm" min="0"
                                                        v-model="item.price" /></td>



                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td>
                                                    <button type="button" class="btn btn-sm btn-success"><i
                                                            class="bi bi-plus" @click="addItem()"
                                                            role="button"></i></button>
                                                </td>
                                                <td colspan="7">

                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                </div>
                                <div class="col-12">

                                    <ProductSelect />
                                    Total Items : {{ invoiceStore.countItems }}
                                </div>
                            </div>
                        </form>

                        <!-- 
                        <h3 class="mt-3">Preview</h3>

                        <div class="preview">

                            <div size="A4">
                                <table class="table table-sm table-condensed">
                                    <thead>
                                        <tr>

                                            <th scope="col">#</th>
                                            <th scope="col">Item Code</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">ID No.</th>
                                            <th scope="col">Model</th>
                                            <th scope="col">ส่วนลด</th>
                                            <th scope="col">ราคา</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in invoiceItems" :key="index">

                                            <th scope="row">{{ index + 1 }}</th>
                                            <td> {{ item.item_code }}</td>
                                            <td>{{ item.product_name }}</td>
                                            <td>{{ item.id_no }}</td>
                                            <td>{{ item.model }}</td>
                                            <td>{{ item.discount }}</td>
                                            <td>{{ item.price }}</td>





                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-success"><i class="bi bi-plus"
                                                        @click="addItem()" role="button"></i></button>
                                            </td>
                                            <td colspan="7">

                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                        </div> -->

                    </div>
                </div>

            </div>
            <div class="col-12 col-md-3">
                <div class="card">
                    <div class="card-body pt-3">
                        <div class="row g-1">
                            <div class="col-12">
                                <button class="btn btn-primary btn-sm w-100" @click="updateItems()">บันทึก</button>
                            </div>
                            <div class="col-12">
                                <router-link :to="{ name: 'invoices.preview' }" class="btn btn-sm btn-secondary d-block">
                                    <i class="bi bi-eye"></i>
                                    Preview ดูตัวอย่าง</router-link>
                            </div>
                            <div class="col-12">
                                <a class="btn btn-sm btn-secondary d-block">
                                    <i class="bi bi-printer"></i>
                                    พิมพ์</a>
                            </div>


                        </div>
                    </div>
                </div>

            </div>
        </div>

    </section>



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

    <div class="modal" ref="modalViewRef">
        <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Invoice</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
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