<template>
    <div class="commitment">



        <form @submit="submit()">
            <div class="modal" ref="modalRef" id="modalBulk">
                <div class="modal-dialog modal-dialog-scrollable modal-fullscreen modal-info">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" v-html="title"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- ########################################################### -->

                            <!-- #####################START######################## -->
                            <form @submit.prevent="onSearch()" v-if="bills">
                                ใบขอรับบริการ
                                <BBadge variant="danger">{{ bills.length }}</BBadge> รายการ

                                <BTableSimple class="" bordered hover small caption-top responsive
                                    style="min-height: 200px;;">
                                    <BThead>
                                        <BTr>
                                            <BTh sticky-column>ลำดับ</BTh>
                                            <BTh sticky-column>BillID</BTh>
                                            <BTh sticky-column>เลขที่ใบขอรับ</BTh>
                                            <BTh sticky-column>วันที่</BTh>
                                            <BTh sticky-column>วันนัดรับ</BTh>
                                            <BTh sticky-column class="text-center">เครื่องมือ</BTh>
                                            <BTh sticky-column class="text-center">ลูกค้า</BTh>
                                            <BTh sticky-column class="text-center">สถานะ</BTh>
                                        </BTr>
                                    </BThead>
                                    <BTbody>
                                        <BTr v-for="(bill, key) in bills">
                                            <BTd class="">
                                                {{ key + 1 }}
                                            </BTd>
                                            <BTd class="">
                                                {{ bill.id }}
                                            </BTd>

                                            <BTd class="">
                                                {{ bill.code }}
                                            </BTd>
                                            <BTd class="">

                                                {{ myFormatDate(bill.document_date) }}

                                            </BTd>
                                            <BTd class="">
                                                <template v-if="bill.commitment_date">

                                                    {{ myFormatDate(bill.commitment_date) }}

                                                </template>
                                                <template v-else>
                                                    <p>-</p>
                                                </template>

                                            </BTd>
                                            <BTd class="text-center">

                                                <template v-if="bill.items !== undefined"> {{ (bill.items.length)
                                                }}</template>

                                            </BTd>
                                            <BTd class="text-left">
                                                {{ bill?.address_name }}


                                            </BTd>
                                            <BTd class="text-center">
                                                <BillButtonStatus :data="bill" v-model="bill.id" />


                                            </BTd>
                                        </BTr>
                                    </BTbody>
                                </BTableSimple>


                                <div class="border p-2">
                                    <input type="checkbox" v-model="searchCommitmentDate"
                                        @change="onChangeConditionCommitment" />
                                    กำหนดวันนัดรับเครื่องมือ
                                    <div class="row g-2">
                                        <div class="col-12 col-lg-8">
                                            <label>Priority</label>
                                            <BillPriority v-model="commitmentPriority" />
                                        </div>
                                        <!-- <div class="col-12 col-lg-4">
                      <label>เลือกวันที่</label>
                      <input type="date" class="form-control-sm form-control" v-model="commitmentDate"
                        placeholder="เลือกวันที่" />
                    </div> -->

                                        <div class="col-12">
                                            <div v-if="messageErrorCommitment" class="alert alert-danger">
                                                {{ messageErrorCommitment }}
                                            </div>
                                            <div v-if="messageSuccessCommitment" class="alert alert-success">
                                                {{ messageSuccessCommitment }}
                                                <div>
                                                    <span class="mx-2"><i class="bi bi-calendar"></i> วันที่เอกสาร</span>
                                                    {{
                                                        myFormatDate(resultCommitment.data.document_date, {
                                                            hideTime: true,
                                                        })
                                                    }}
                                                    <span class="mx-2"><i class="bi bi-calendar"></i> วันนัดรับ</span>
                                                    {{
                                                        myFormatDate(resultCommitment.data.commitment_date, {
                                                            hideTime: true,
                                                        })
                                                    }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <Spinner :visible="loading" class="me-2" />

                            </form>
                            <!-- <pre>
                            {{ billSelectedFilterd }}
                          </pre> -->
                            <!-- ########################################################### -->
                        </div>
                        <div class="modal-footer">
                            <div class="row g-1">
                                <div class="col-12">
                                    <Spinner :visible="loadingCommitment" />

                                    <button type="button" class="btn btn-secondary btn-sm" @click="reloadData()">
                                        <i class="float-start bi bi-arrow-clockwise me-2"></i> รีโหลดข้อมูล
                                    </button>

                                    <template v-if="bills && bills.length > 0">
                                        <button type="button" class="btn btn-primary btn-sm  ms-2" @click="getItems()">
                                            <i class="float-start bi bi-clock me-2"></i> เริ่มคำนวณ
                                        </button>
                                    </template>
                                    <!--
                                    <template v-if="bill.bill_status !== 'completed'">
                                        <button type="button" class="btn btn-danger btn-sm ms-2" @click="cancelBook()">
                                            <i class="float-start bi bi-x me-2"></i> ยกเลิกจองคิว
                                        </button>
                                    </template> 
                                
                                -->


                                </div>
                            </div>
                            <!-- <button type="submit" class="btn btn-sm btn-primary"><i class="bi bi-save me-1"></i>
                สร้างใบขอรับบริการ</button>
              <button class="btn btn-sm btn-secondary" @click="hide"><i class="bi bi-x me-1"></i>
                ยกเลิก</button> -->
                        </div>
                    </div>
                </div>
            </div>
        </form>

    </div>

    <ConfirmCommitment ref="modalConfirm" :data="resultCommitment" @onConfirm="updateCommitmentDate" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Modal } from 'bootstrap'
import ConfirmCommitment from '@/views/bill/components/ConfirmCommitment.vue'
import { toast } from 'vue3-toastify'
import BillButtonStatus from '@/views/bill/components/BillButtonStatus.vue'
import JobButtonStatus from '@/views/bill/components/JobButtonStatus.vue'
import { useConfirmDialog } from '@vueuse/core'
import { useAppStore } from '@/stores/appStore'
import { api } from '@/helpers/api'
import { myCurrency, myFormatDate } from '@/helpers/myformat'
import Spinner from '@/components/Spinner.vue'
import BillPriority from '@/views/bill/components/BillPriority.vue'
import axios from 'axios'
import { formatDate, formatISO } from 'date-fns'
import { string } from 'i/lib/util'
const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel }
    = useConfirmDialog()

const emit = defineEmits(['onHide', 'onShow', 'onConfirm', 'Onreload'])
const props = defineProps({
    title: {
        type: String,
        default: 'จองคิวทดสอบเครื่องมือ',
    },
    onCancel: {
        type: Function,
    },
    bills: {
        type: Object,
        default: () => []
    }
})
const appStore = useAppStore()

let modalEl = null
let modalRef = ref(null)

const show = () => {
    modalEl.show()
}
const hide = () => {
    modalEl.hide()
}

const loading = ref(false)
const searchCommitmentDate = ref(true)
const modalConfirm = ref(null)

const form = ref({
    id: 0,
    bill_code: '',
    document_date: '',
    items: [],
    company_id: '',
    address_name: '',
    address_detail: '',
    cert_address_name: '',
    cert_address_detail: '',
    agent_id: '',
    agent_name: '',
    status: '',
    bill_status: '',
    service_status_id: 0,
})

//  commitment
const loadingCommitment = ref(false)
const resultCommitment = ref()
const messageSuccessCommitment = ref()
const messageErrorCommitment = ref()
const commitmentDate = ref()
const commitmentPriority = ref('medium')

const billSelected = ref([])
const billSelectedFilterd = computed(() => billSelected.value)

const commitmentDateFinal = computed(() => {

    if (resultCommitment.value && resultCommitment.value.data.items !== undefined) {
        let items = resultCommitment.value.data.items || []
        let temp = []
        items.map((item) => {
            temp.push(new Date(item.reserved_date))
        })
        console.log(temp);
        let maxDate = new Date(Math.max.apply(null, temp))
        return formatISO(maxDate)
    }
    return;
})


const getItems = () => {
    if (props.bills.length == 0) {
        return []
    }
    let billList = [];

    props.bills.map((bill, index) => {

        let _items = []
        api.get("v2/bills/" + bill.id).then(({ data, status }) => {
            console.log(status, data);

            if (data.items) {
                data.items.map((item) => {
                    if (Number(item.product.is_job) == 1) {
                        let filteredItem = {
                            duration: parseInt(item.product?.duration),
                            item_code: item.item_code,
                            lab_id: item.lab_id,
                            product_id: item.product_id,
                            product_name: item.product_name,
                            barcode_no: item.barcode_no,
                            serialnumber: item.serialnumber,
                            sorter: item.sorter,
                            sublab_id: item.sublab_id,
                            workorder_id: item.item_id,
                            service_status_id: item.service_status_id,
                            is_job: item.product.is_job,
                        }
                        _items.push(filteredItem)
                    }
                })
                console.log("items", _items);
                return bill.items = data.items
            }
            const params = {
                priority: commitmentPriority.value,
                bill_id: bill.id,
                code: bill.code,
                // document_date: d1 ? formatISO(toZonedTime(form.value.document_date, timezone)) : '',
                // commitment_date: d2 ? formatISO(toZonedTime(d2, timezone)) : '',
                document_date: bill.document_date,
                commitment_date: "",
                items: _items,
            }
            billSelected.value.push(params)
        })
    })
    emit("update:bills", billSelectedFilterd.value)
}



const findCommitmentDate = async (bill) => {
    // if (commitmentPriority.value === undefined) {
    //     messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    //     return
    // }
    // let d1 = form.value?.document_date ? new Date(`${form.value?.document_date} 00:00:00`) : ''
    // let d2 = new Date(`${commitmentDate.value} 00:00:00`)
    let _items = []
    bill.items.filter((item) => {
        if (Number(item.product.is_job) == 1) {
            let filteredItem = {
                duration: parseInt(item.product?.duration),
                item_code: item.item_code,
                lab_id: item.lab_id,
                product_id: item.product_id,
                product_name: item.product_name,
                barcode_no: item.barcode_no,
                serialnumber: item.serialnumber,
                // reserved_date: form.value?.document_date,
                sorter: item.sorter,
                sublab_id: item.sublab_id,
                workorder_id: item.item_id,
                service_status_id: item.service_status_id,
                is_job: item.product.is_job,
                // product: item.product,
            }
            _items.push(filteredItem)
        }
    })
    const params = {
        priority: commitmentPriority.value,
        bill_id: bill.id,
        code: bill.code,
        // document_date: d1 ? formatISO(toZonedTime(form.value.document_date, timezone)) : '',
        // commitment_date: d2 ? formatISO(toZonedTime(d2, timezone)) : '',
        document_date: bill.document_date,
        commitment_date: commitmentDate.value,
        items: _items,
    }

    messageErrorCommitment.value = ''
    messageSuccessCommitment.value = ''

    // if (commitmentPriority.value === undefined) {
    //     messageErrorCommitment.value = 'โปรดเลือก Priority และ ระบุ commitment date ที่ต้องการ'
    //     return
    // }
    loadingCommitment.value = true

    try {
        const { data } = await axios
            .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills', params, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${appStore.token}`,
                },
            })
            .catch((err) => {
                loadingCommitment.value = false

                if (err.response) {
                    let data = err.response?.data
                    if (data) {
                        messageErrorCommitment.value = data.message
                    } else {
                        messageErrorCommitment.value = err.message
                    }
                } else {
                    messageErrorCommitment.value = err.message
                }
            })

        resultCommitment.value = data
        console.log("result", resultCommitment.value);
        console.log("date", commitmentDateFinal.value);

        setTimeout(() => {
            resultCommitment.value.data.document_date = bill.document_date
            // resultCommitment.value.data.commitment_date = commitmentDateFinal.value
            updateCommitmentDate()
        }, 200)

        loadingCommitment.value = false
        if (data.success) {
            let message = `ประมวลผลตารางคิวงานสำเร็จ`
            messageSuccessCommitment.value = message
            // modalConfirm.value.show()
        } else {
            messageErrorCommitment.value = data.message
        }
    } catch (error) {
        resultCommitment.value = error
        console.log('error', error)
        loadingCommitment.value = false
    }
}

const onChangeConditionCommitment = (e) => {
    let checked = e.target.checked
    if (checked == false) {
        commitmentDate.value = null
    }
}

const submit = () => {
    if (searchCommitmentDate.value === true) {
        findCommitmentDate()
    }
}

const confirmCommitmentToKanban = async (params) => {
    const { data } = await axios
        .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills', params, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${appStore.token}`,
            },
        })
        .catch((err) => {
            loadingCommitment.value = false

            if (err.response) {
                let data = err.response?.data
                if (data) {
                    messageErrorCommitment.value = data.message
                } else {
                    messageErrorCommitment.value = err.message
                }
            } else {
                messageErrorCommitment.value = err.message
            }
            toast(messageErrorCommitment, {
                theme: 'auto',
                type: 'default',
                dangerouslyHTMLString: true,
            })
        })
    if (data) {
        loadingCommitment.value = false
        if (data.message !== undefined) {
            toast(data.message, {
                theme: 'auto',
                type: 'default',
                dangerouslyHTMLString: true,
            })
        }
    }
}
const cancelBook = async (event) => {


    let params = {
        commitment_date: props.bill.commitment_date,
        bill_id: props.bill.id,
    }

    const { data } = await axios
        .delete(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills?bill_id=' + params.bill_id, {
            data: {},
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${appStore.token}`,
            },
        })
        .catch((err) => {
            loadingCommitment.value = false

            if (err.response) {
                let data = err.response?.data
                if (data) {
                    messageErrorCommitment.value = data.message
                } else {
                    messageErrorCommitment.value = err.message
                }
            } else {
                messageErrorCommitment.value = err.message
            }
            toast(messageErrorCommitment, {
                theme: 'auto',
                type: 'default',
                dangerouslyHTMLString: true,
            })
        })
    if (data.success) {
        clearCommitmentDate(props.bill.id)
        loadingCommitment.value = false
        toast('ยกเลิกสำเร็จ', {
            theme: 'auto',
            type: 'default',
            dangerouslyHTMLString: true,
        })
        setTimeout(() => reloadData(), 500)
    }
}
const updateCommitmentDate = async () => {
    const params = resultCommitment.value.data
    const { data } = await api.post(`/v2/bills/${params.bill_id}/commitment`, params)
    if (data) {
        toast(data.message, {
            theme: 'auto',
            type: 'success',
            dangerouslyHTMLString: true,
        })

    }
}
const clearCommitmentDate = async (billId) => {
    const { data, status } = await api.delete(`/v2/bills/${billId}/commitment`)

    if (status == 200) {
        emit("update:bill", data.data)
    }
}

const reloadData = async () => {
    emit('onReload', props.bills)
    loading.value = true;
    setTimeout(() => loading.value = false, 2000)
}

onMounted(() => {
    modalEl = new Modal(modalRef.value)
    var myModal = document.getElementById('modalBulk')
    myModal.addEventListener("shown.bs.modal", (e) => {
        messageErrorCommitment.value = ""
        messageSuccessCommitment.value = ""
        console.log('shown');
        if (props.bills) {
            getItems()
        }
    })
    myModal.addEventListener("hide.bs.modal", (e) => {
        messageErrorCommitment.value = ""
        messageSuccessCommitment.value = ""
        emit('update:bills', [])
        billSelected.value = []
        console.log('hidden');
    })

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            hide()
            emit('update:bills', [])
            billSelected.value = []
        }
    };

})
defineExpose({ show, hide })
</script>

<style lang="scss" scoped>
.commitment {}

.table-bill-items {
    border: solid 1px #130f0f;
}

table {
    th {
        font-size: 13px;
        font-weight: bold;
    }

    td {
        font-size: 13px;
    }
}
</style>

