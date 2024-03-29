<template>
    <div class="pagetitle">
        <h1>Bills</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item active">Bills</li>
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
                                    data-bs-target="#qt-index">ใบขอรับบริการ <span v-if="pagination">({{ pagination.total ||
                                        0
                                    }})</span></button>
                            </li>
                            <!-- 
                            <li class="nav-item">
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

                                <!-- Small tables -->
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th scope="col" class="fw-bold text-decoration-underline">Action</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">#</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">Code</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">Date</th>

                                                <th scope="col" class="fw-bold text-decoration-underline">Customer</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in items" :key="index">
                                                <th scope="row">
                                                    <i class="bi bi-pencil mx-1" @click="showDetail(item)"
                                                        role="button"></i>
                                                    <i class="bi bi-search mx-1" @click="showDetail(item)"
                                                        role="button"></i>
                                                </th>
                                                <th scope="row">{{ index + 1 }}</th>
                                                <td>
                                                    <a class="btn btn-light fw-bold border btn-sm"
                                                        @click="showDetail(item)">{{ item.code }}</a>
                                                </td>
                                                <td> <span class="badge bg-light text-dark">{{ DateTime(new
                                                    Date(item.document_date)) }}</span></td>

                                                <td>
                                                    <div>{{ item.customer.companyname }}</div>
                                                    <small class="text-danger">({{ item.agent_name }})</small>
                                                </td>
                                                <td>{{ item.progress_status }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- End small tables -->
                            </div>

                            <div class="tab-pane fade pt-3 qt-detail" id="qt-detail">

                                <!--  Detail -->

                                <h5 class="card-title">About</h5>
                                <p class="small fst-italic">Sunt est soluta temporibus accusantium neque nam maiores
                                    cumque
                                    temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum
                                    quae
                                    quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</p>

                                <h5 class="card-title">Profile Details</h5>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label ">รหัสพนัก</div>
                                    <div class="col-lg-9 col-md-8">{{ row.code }}</div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label ">Full Name</div>
                                    <div class="col-lg-9 col-md-8">{{ fullname }}</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Company</div>
                                    <div class="col-lg-9 col-md-8">Lueilwitz, Wisoky and Leuschke</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Job</div>
                                    <div class="col-lg-9 col-md-8">Web Designer</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Country</div>
                                    <div class="col-lg-9 col-md-8">USA</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Address</div>
                                    <div class="col-lg-9 col-md-8">A108 Adam Street, New York, NY 535022</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Phone</div>
                                    <div class="col-lg-9 col-md-8">(436) 486-3538 x29071</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Email</div>
                                    <div class="col-lg-9 col-md-8">k.anderson@example.com</div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Permissions</div>
                                    <div class="col-lg-9 col-md-8">
                                        <span class="badge bg-light text-dark mx-1" v-for="(name, key) in row.permisions"
                                            :key="key">
                                            {{ name }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane fade pt-3 qt-edit" id="qt-edit">

                                <!-- Profile Edit Form -->
                                <form>


                                    <div class="row mb-3">
                                        <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Full Name</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="fullName" type="text" class="form-control" id="fullName"
                                                value="Kevin Anderson">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="about" class="col-md-4 col-lg-3 col-form-label">About</label>
                                        <div class="col-md-8 col-lg-9">
                                            <textarea name="about" class="form-control" id="about"
                                                style="height: 100px">Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea>
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="company" class="col-md-4 col-lg-3 col-form-label">Company</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="company" type="text" class="form-control" id="company"
                                                value="Lueilwitz, Wisoky and Leuschke">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Job" class="col-md-4 col-lg-3 col-form-label">Job</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="job" type="text" class="form-control" id="Job"
                                                value="Web Designer">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Country" class="col-md-4 col-lg-3 col-form-label">Country</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="country" type="text" class="form-control" id="Country" value="USA">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Address" class="col-md-4 col-lg-3 col-form-label">Address</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="address" type="text" class="form-control" id="Address"
                                                value="A108 Adam Street, New York, NY 535022">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Phone" class="col-md-4 col-lg-3 col-form-label">Phone</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="phone" type="text" class="form-control" id="Phone"
                                                value="(436) 486-3538 x29071">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="email" type="email" class="form-control" id="Email"
                                                value="k.anderson@example.com">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Twitter" class="col-md-4 col-lg-3 col-form-label">Twitter
                                            Profile</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="twitter" type="text" class="form-control" id="Twitter"
                                                value="https://twitter.com/#">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Facebook" class="col-md-4 col-lg-3 col-form-label">Facebook
                                            Profile</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="facebook" type="text" class="form-control" id="Facebook"
                                                value="https://facebook.com/#">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Instagram" class="col-md-4 col-lg-3 col-form-label">Instagram
                                            Profile</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="instagram" type="text" class="form-control" id="Instagram"
                                                value="https://instagram.com/#">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Linkedin" class="col-md-4 col-lg-3 col-form-label">Linkedin
                                            Profile</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="linkedin" type="text" class="form-control" id="Linkedin"
                                                value="https://linkedin.com/#">
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary">Save Changes</button>
                                    </div>
                                </form><!-- End Profile Edit Form -->

                            </div>

                            <div class="tab-pane fade pt-3 qt-settings" id="qt-settings">

                                <!-- Settings Form -->
                                <form @submit.prevent="() => { }">

                                    <div class="row mb-3">
                                        <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Email
                                            Notifications</label>
                                        <div class="col-md-8 col-lg-9">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="changesMade" checked>
                                                <label class="form-check-label" for="changesMade">
                                                    Changes made to your account
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="newProducts" checked>
                                                <label class="form-check-label" for="newProducts">
                                                    Information on new products and services
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="proOffers">
                                                <label class="form-check-label" for="proOffers">
                                                    Marketing and promo offers
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="securityNotify" checked
                                                    disabled>
                                                <label class="form-check-label" for="securityNotify">
                                                    Security alerts
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary">Save Changes</button>
                                    </div>
                                </form><!-- End settings Form -->

                            </div>

                            <div class="tab-pane fade pt-3" id="profile-change-password">
                                <!-- Change Password Form -->
                                <form>

                                    <div class="row mb-3">
                                        <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Current
                                            Password</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="password" type="password" class="form-control"
                                                id="currentPassword">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">New
                                            Password</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="newpassword" type="password" class="form-control" id="newPassword">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Re-enter New
                                            Password</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="renewpassword" type="password" class="form-control"
                                                id="renewPassword">
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary">Change Password</button>
                                    </div>
                                </form><!-- End Change Password Form -->

                            </div>

                        </div><!-- End Bordered Tabs -->

                    </div>
                </div>

            </div>
        </div>
    </section>

    <div class="modal" ref="modalViewRef" v-if="bill">
        <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Bill เลขที่ : {{ bill.code }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">เลขที่</label>
                            <p>{{ bill.code }}</p>
                        </div>
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">ลูกค้า</label>
                            <p>{{ bill?.customer?.companyname }}</p>
                        </div>
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">วันที่</label>
                            <p>{{ bill.document_date }}</p>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">ผู้ติดต่อ</label>
                            <p>{{ bill.agent_name }}</p>
                        </div>
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">เลขที่</label>
                            <p>{{ bill.address_name }} {{ bill.address_detail }}</p>
                        </div>
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">เวลาทำรายการ</label>
                            <p>{{ bill.date_start }}</p>
                        </div>
                    </div>
                    <div class="" v-if="loadingItems">
                        <div class="spinner-grow" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <table class="table table-condensed" v-if="!loadingItems">
                        <thead>
                            <tr>
                                <th class="fw-bold text-decoration-underline">#</th>
                                <th class="fw-bold text-decoration-underline">NO</th>
                                <th class="fw-bold text-decoration-underline">ItemCode</th>
                                <th class="fw-bold text-decoration-underline">รายการ</th>
                                <th class="fw-bold text-decoration-underline">Model</th>
                                <th class="fw-bold text-decoration-underline">Point</th>
                                <th class="fw-bold text-decoration-underline">Point Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, rowIndex) in bill.items" :key="row">
                                <th><input type="checkbox" v-model="itemsSelected" name="itemsSelected[]" :value="row" />
                                </th>
                                <th>{{ rowIndex + 1 }}</th>
                                <th>{{ row.item_code }}</th>
                                <th>{{ row.product_name }}
                                </th>
                                <th> <span class="mx-2 badge badge-light text-dark d-inline-block">{{ row.model }}</span>
                                </th>
                                <th>{{ row.point }}</th>
                                <th>{{ row.point_price }}</th>

                            </tr>
                        </tbody>
                    </table>
                    <p>
                        NOTE: {{ bill.note_customers }}
                    </p>
                </div>
                <div class="modal-footer">
                    <span class="alert alert-danger" v-if="errorMsg">{{ errorMsg }}</span>
                    <span class="badge rounded-pill bg-danger p-2 fw-bold" v-if="itemsSelected.length > 0">{{
                        itemsSelected.length
                    }}
                        รายการ</span>

                    <button type="button" class="btn btn-success" @click="newInvoice"><i class=""></i>สร้างใบแจ้งหนี้ - New
                        Invoice</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" ref="modalInvoiceRef">
        <div class="modal-dialog modal-fullscreen-lg-down modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">สร้างใบแจ้งหนี้ / Invoice</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">

                        <div class="col-4">
                            <!-- <label class="fw-bold text-decoration-underline">เลขที่</label>
                            <p>xxxxxxxxxxxxx</p> -->
                        </div>
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">ลูกค้า</label>
                            <p>
                                <input type="text" v-model="invoice.customer_name" class="form-control form-control-sm" />
                            </p>
                        </div>
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">ที่อยู่</label>
                            <p>
                                <input type="date" v-model="invoice.document_date" class="form-control form-control-sm" />
                            </p>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-4">
                            <label class="fw-bold text-decoration-underline">ผู้ติดต่อ</label>
                            <p>
                                <input type="text" v-model="invoice.contact_name" class="form-control form-control-sm" />
                            </p>
                        </div>
                        <div class="col-8">
                            <label class="fw-bold text-decoration-underline">ที่อยู่</label>
                            <p>
                                <input type="text" v-model="invoice.address_detail" class="form-control form-control-sm" />
                            </p>
                        </div>

                    </div>
                    <table class="table table-condensed">
                        <thead>
                            <tr>

                                <th class="fw-bold text-decoration-underline">NO</th>
                                <th class="fw-bold text-decoration-underline">ItemCode</th>
                                <th class="fw-bold text-decoration-underline">รายการ</th>
                                <th class="fw-bold text-decoration-underline">Model</th>
                                <th class="fw-bold text-decoration-underline">ราคา</th>
                                <th class="fw-bold text-decoration-underline">ส่วนลด</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, rowIndex) in invoice.items" :key="row">

                                <th>{{ rowIndex + 1 }}</th>
                                <th>{{ row.item_code }}</th>
                                <th>{{ row.product_name }}
                                </th>
                                <th> <span class="mx-2 badge badge-light text-dark d-inline-block">{{ row.model }}</span>
                                </th>
                                <th><input type="number" name="price[]" v-model="row.price"
                                        class="form-control form-control-sm " style="width:100px;" /></th>
                                <th><input type="number" name="price[]" v-model="row.discount"
                                        class="form-control form-control-sm " style="width:100px;" /></th>

                            </tr>
                        </tbody>
                    </table>
                    <p>
                        NOTE:
                        <textarea class="form-control" placeholder="หมายเหตุ"></textarea>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="createInvoice">สร้างใบแจ้งหนี้</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import avatar from "@/assets/img/profile-img.jpg"
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
import { DateTime, Number } from "@/helpers/myformat";
import { Modal } from "bootstrap";

const row = ref({})
const items = ref({})
const pagination = ref({})
const loading = ref(true)
const loadingItems = ref(true)
const bill = ref({})
const invoice = ref({})
const modalViewRef = ref(null)
const modalView = ref(null)
const modalInvoiceRef = ref(null)
const modalInvoice = ref(null)

const loadData = async () => {
    const { data } = await api.get("/v2/bills")
    if (data) {
        console.log(data)
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

const getBillById = async (id) => {
    try {
        const { data } = await api.get("/v2/bills/" + id)
        if (data) {
            bill.value = data
            loading.value = false
        }
        loadingItems.value = false
    } catch (error) {
        loadingItems.value = false
    }

}


const showDetail = (item) => {
    loadingItems.value = true
    errorMsg.value = ""
    itemsSelected.value = []
    bill.value = item
    bill.value.items = []
    modalView.value.show();
    getBillById(item.id)
}
const errorMsg = ref()
const itemsSelected = ref([])
const newInvoice = () => {
    errorMsg.value = ""
    const i = bill.value
    if (itemsSelected.value.length === 0) {
        errorMsg.value = "โปรดเลือกรายการเครื่องมืออย่างน้อย 1 รายการ"
        return false
    }
    invoice.value = {
        bill_id: i.id,
        bill_code: i.code,
        customer_name: i.customer?.companyname,
        document_date: i.document_date,
        address_name: i.address_name,
        address_detail: i.address_detail,
        contact_name: i.agent_name,
        bill_id: i.id,
        discount: 0,
    }
    invoice.value.items = itemsSelected.value
    modalView.value.hide()
    modalInvoice.value.show()
}

const createInvoice = () => {
    alert('สร้างใบแจ้งนี้สำเร็จ')
    invoice.value = {}
    bill.value = {}
    errorMsg.value = ""
    itemsSelected.value = []
    modalView.value.hide()
    modalInvoice.value.hide()
}
onMounted(() => {
    errorMsg.value = ""
    modalView.value = new Modal(modalViewRef.value)
    modalInvoice.value = new Modal(modalInvoiceRef.value)
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

.checkbox {
    transform: scale(
            /*desired magnification*/
        );
}
</style>