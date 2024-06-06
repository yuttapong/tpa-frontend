<template>
    <div class="pagetitle">
        <h1>Labs</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item active">Labs</li>
            </ol>
        </nav>
    </div>
    <!-- End Page Title -->

    <section class="section profile">
        <spinner :visible="loading" />
        <div class="row" v-if="items">
            <div class="col-xl-12">
                <div class="card">
                    <div class="card-body pt-3">

                        {{ lab }}

                        <div class="table-responsive">
                            <table class="table table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col" class="fw-bold">#</th>
                                        <th scope="col" class="fw-bold">ID</th>
                                        <th scope="col" class="fw-bold">Code</th>
                                        <th scope="col" class="fw-bold">Name</th>
                                        <th scope="col" class="fw-bold">Sub labs</th>
                                        <th scope="col" class="fw-bold">Conditions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in   items  " :key="index">
                                        <th scope="row">
                                            <a role="button" class="btn btn-link" @click="view(item)">
                                                <i class="bi bi-search"></i> </a>
                                        </th>
                                        <th scope="row">{{ item.id }}</th>
                                        <td>
                                            {{ item.code }}
                                        </td>
                                        <td>
                                            <router-link :to="`/data/labs/${item.id}`" role="button" class="btn btn-link">
                                                {{ item.name_th }} </router-link>
                                            <div class="ps-2">{{ item.name }}</div>

                                        </td>
                                        <td>{{ item?.sublabs.length }}</td>
                                        <td>
                                            <small>{{ item?.conditions.length }}</small>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>



    <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-fullscreen-lg-down">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">รายละเอียด <span v-if="dataInstrument">: {{
                        dataInstrument.standardcode }}</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body ">
                    <p class="fs-5">
                        {{ dataInstrument.standardname }}
                    </p>
                    <ul class="nav nav-tabs" id="stdTab" role="tablist" v-if="dataInstrument">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="std-detail-tab" data-bs-toggle="tab"
                                data-bs-target="#std_detail" type="button" role="tab" aria-controls="detail"
                                aria-selected="true">
                                ข้อมูล
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="std-history-tab" data-bs-toggle="tab"
                                data-bs-target="#้std_history" type="button" role="tab" aria-controls="history"
                                aria-selected="false">
                                ประวัติการสอบเสียบ
                            </button>
                        </li>

                    </ul>
                    <div class="tab-content mt-3" id="stdTabContent">
                        <div class="tab-pane fade show active" id="std_detail" role="tabpanel" aria-labelledby="detail-tab">
                            <!-- #################################### -->

                            <div class="p-2" v-if="dataInstrument">
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Code</div>
                                    <div class="col-lg-9 col-md-8">
                                        {{ dataInstrument.standardcode }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Property No.
                                    </div>
                                    <div class="col-lg-9 col-md-8">
                                        {{ dataInstrument.propertyno }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Name</div>
                                    <div class="col-lg-9 col-md-8">
                                        {{ dataInstrument.standardname }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Group</div>
                                    <div class="col-lg-9 col-md-8">
                                        {{ dataInstrument?.group?.name }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Serail</div>
                                    <div class="col-lg-9 col-md-8">
                                        {{ dataInstrument.serail }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Barcode No.</div>
                                    <div class="col-lg-9 col-md-8">
                                        {{ dataInstrument.barcodeno }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label fw-bold text-decoration-underline">Buy Date</div>
                                    <div class="col-lg-9 col-md-8">
                                        {{ dataInstrument.buydate }}
                                    </div>
                                </div>

                            </div>
                            <!-- #################################### -->
                        </div>
                        <div class="tab-pane fade" id="้std_history" role="tabpanel" aria-labelledby="history-tab">


                            <div class="table-responsive">
                                <table class="table-sm table table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="fw-bolder text-decoration-underline" nowrap>Cert Date
                                            </th>
                                            <th scope="col" class="fw-bolder text-decoration-underline" nowrap>Cert No.</th>
                                            <th scope="col" class="fw-bolder text-decoration-underline">Cert No.</th>


                                        </tr>
                                    </thead>
                                    <tbody v-if="dataHistories">
                                        <tr v-for="  h   in   dataHistories  " :key="h">

                                            <td nowrap>{{ h.caldate }}</td>
                                            <td nowrap>{{ h.cerno }}</td>
                                            <td> {{
                                                h?.trace?.tracecername }}</td>


                                        </tr>

                                    </tbody>
                                </table>
                            </div>



                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'

import Offcanvas from '@/components/Offcanvas.vue'
import { Modal } from 'bootstrap'
import { useRoute } from 'vue-router'
const row = ref({})
const items = ref([])
const sublabs = ref([])
const suppliers = ref([])
const manufactures = ref([])
const pagination = ref({})
const loading = ref(true)
const modalRef = ref(null)
const modal = ref(null)
const route = useRoute();
const dataInstrument = ref({})
const labId = computed(() => route.params?.id)
const visibleDialog = ref(false)
const lab = ref({})

const loadData = async () => {
    loading.value = true
    const { data } = await api.get('/v2/labs/' + labId.value)
    console.log(data);
    if (data) {
        lab.value = data
    }
    loading.value = false
}
const loadGroups = async () => {

    const { data, curent_page, last_page, per_page, total } = await api.get(
        '/v2/sublabs',
    )
    groups.value = data
    loading.value = false
}
const loadSuppliers = async () => {

    const { data, curent_page, last_page, per_page, total } = await api.get('/v2/suppliers')
    suppliers.value = data.data
    loading.value = false
}
const loadManufacturers = async () => {

    const { data, curent_page, last_page, per_page, total } = await api.get(
        '/v2/stdinstruments/manufactures',
    )
    manufactures.value = data
    loading.value = false
}
const view = (item) => {
    visibleDialog.value = true
    dataInstrument.value = {}
    dataHistories.value = []
    modal.value.show()
    console.log(item)
    dataInstrument.value = item
}

const dataHistories = ref([])

const getInstrumentHistoryCal = async (id) => {
    loading.value = true
    const { data, curent_page, last_page, per_page, total } = await api.get(
        '/v2/stdinstruments/' + id + '/histories',
    )
    dataHistories.value = data
    loading.value = false
}

onMounted(() => {
    loadData()
    modal.value = new Modal(modalRef.value)
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
