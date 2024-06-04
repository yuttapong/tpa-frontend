<template>
    <div class="pagetitle">
        <h1>Work Orders</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                <li class="breadcrumb-item active">งาน</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section profile">

        <spinner :visible="loading" />

        <div class="row">


            <div class="col-xl-12">

                <div class="card">
                    <div class="card-body pt-3">
                        <!-- Bordered Tabs -->
                        <ul class="nav nav-tabs nav-tabs-bordered">

                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">List ({{
                                    pagination.total }})</button>
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
                                <div class="row">
                                    <div class="col-6">
                                        <input type="search" v-model="taxnumber" name="taxnumber"
                                            class="form-control form-control-sm"
                                            placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน" @keyup.enter="search" />
                                    </div>
                                    <div class="col-6">
                                        <input type="search" v-model="q" name="q" class="form-control form-control-sm"
                                            placeholder="สินค้า/seriallnumber/id_no/model" @keyup.enter="search" />
                                    </div>
                                </div>
                                <!-- Small tables -->
                                <div class="my-3 p-2 bg-light text-danger" v-if="taxnumber && Number(pagination.total) > 0">

                                </div>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th scope="col" class="fw-bold text-decoration-underline">#</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">Code</th>

                                                <th scope="col" class="fw-bold text-decoration-underline">Product</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">Date</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">Customer</th>
                                                <th scope="col" class="fw-bold text-decoration-underline">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in items" :key="index">
                                                <th scope="row">{{ index + 1 }}</th>
                                                <td nowrap><span class="btn btn-sm text-dark fw-bold">{{ item.item_code
                                                }}</span></td>
                                                <td>
                                                    <div>{{ item.product_name }}</div>
                                                    <span class="badge badge-light text-dark mx-2 d-inline-block"
                                                        style="width: 100px;">
                                                        {{ item.model
                                                        }}</span>
                                                    <span class="badge bg-warning text-dark mx-2  d-inline-block"
                                                        style="width: 100px;">
                                                        {{ item.serialnumber
                                                        }}</span>
                                                </td>
                                                <td> <span class="badge bg-light text-dark">{{ DateTime(new
                                                    Date(item.bill.document_date)) }}</span>
                                                </td>

                                                <td>
                                                    <div>{{ item.customer.companyname }}</div>
                                                    <small class="text-danger  mx-1">({{ item.bill.agent_name }})</small>
                                                    <small class="text-dark mx-1">({{ item.customer.taxnumber
                                                    }})</small>
                                                </td>
                                                <td>{{ item.current_service_status }}</td>
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
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import avatar from "@/assets/img/profile-img.jpg"
import { api } from "@/helpers/api";
import Spinner from "@/components/Spinner.vue";
import { DateTime, Number } from "@/helpers/myformat";
const row = ref({})
const items = ref({})
const pagination = ref({})
const loading = ref(true)

const loadData = async () => {
    const { data } = await api.get("/v2/workorders")
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
const q = ref("")
const taxnumber = ref("")
const search = async () => {
    pagination.value.curent_page = 1;
    pagination.value.total = 0;
    let params = {
        taxnumber: taxnumber.value,
        q: q.value
    }
    const { data } = await api.get("/v2/workorders", {
        params
    })
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