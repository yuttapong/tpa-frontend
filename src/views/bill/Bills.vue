<template>
  <div class="pagetitle">
    <h1>ใบขอรับบริการ ({{ parseInt(pagination.total).toLocaleString() }})</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item active">ใบขอรับบริการ {{ loading }}</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section profile">
    <div class="row" v-if="items">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body pt-3">
            <!-- Bordered Tabs -->
            <ul class="nav nav-tabs nav-tabs-bordered">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#qt-index">
                  <i class="bi bi-book"></i> ใบขอรับบริการ
                  <span v-if="pagination">({{ parseInt(pagination.total).toLocaleString() || 0 }})</span>
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#qt-status">
                  <i class="bi bi-wifi"></i> สถานะ
                </button>
              </li>
            </ul>

            <div class="tab-content pt-2">
              <div class="tab-pane fade show active qt-index" id="qt-index">
                <form @submit.prevent="onSearch()" class="mb-3">
                  <div class="row g-2">
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="search" v-model="formSearch.id" name="id" class="form-control form-control-sm"
                        placeholder="ID" @keyup.enter="search" />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="search" v-model="formSearch.code" name="code" class="form-control form-control-sm"
                        placeholder="Code" @keyup.enter="search" autofocus />
                    </div>
                    <div class="col-6 col-md-4 col-xl-3">
                      <input type="search" v-model="formSearch.taxnumber" name="taxnumber"
                        class="form-control form-control-sm" placeholder="เลขประจำตัวผู้เสียภาษี/บัตรประชาชน"
                        @keyup.enter="search" />
                    </div>
                    <div class="col-6 col-md-4 col-lg-3">
                      <input type="search" v-model="formSearch.q" name="q" class="form-control form-control-sm"
                        placeholder="ลูกค้า/ผู้ติดต่อ" @keyup.enter="search" />
                    </div>
                    <div class="col-12 col-md-4 col-lg-3">
                      <input type="submit" class="btn btn-primary btn-sm" value="ค้นหา" />
                      <input type="reset" class="btn btn-light btn-sm mx-2" value="Reset" @click="resetFormSearch" />
                      <button type="button" class="btn btn-sm btn-outline-success" @click="newBill">
                        <i class="bi bi-plus"></i> สร้าง
                      </button>
                    </div>
                  </div>
                </form>
                <!-- Small tables -->
                <!-- <vue-awesome-paginate :total-items="pagination.total" :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow" v-model="pagination.current_page"
                  :on-click="onChangePage" /> -->
                <EasyDataTable class="my-3" :headers="headers" :items="items" alternating
                  v-model:server-options="serverOptions" :server-items-length="pagination.total"
                  v-model:items-selected="itemsSelected" show-index border-cell fixed-header>
                  <template #item-action="item">
                    <div class="btn-group gap-1" role="group" aria-label="Basic example">
                      <div>
                        <button type="button" class="btn btn-secondary outlined btn-sm" @click="showDetail(item)">
                          <i class="bi bi-search"></i>
                        </button>
                      </div>
                      <!-- <div>
                        <button type="button" class="btn btn-secondary btn-sm" @click="openModalCommitment(item)">
                          <i class="bi bi-clock"></i>
                        </button>
                      </div> -->

                      <div>
                        <router-link class="btn btn-secondary btn-sm"
                          :to="{ name: 'bills.commitmentForm', params: { code: item.code } }" title="คำนวณวันนัดรับ">
                          <i class="bi bi-calendar mx-1" role="button"></i></router-link>
                        <!-- <router-link class="btn btn-secondary btn-sm"
                          :to="{ name: 'bills.formEdit', params: { code: item.code } }">
                          <i class="bi bi-pencil" role="button"></i></router-link> -->
                      </div>
                      <div>
                        <button type="button" class="btn btn-secondary outlined btn-sm" @click="showEdit(item)">
                          <i class="bi bi-pen"></i>
                        </button>
                      </div>

                    </div>
                  </template>
                  <template #item-address_name="item">{{ item.address_name }}

                    <div>{{ item.customer.taxnumber }}</div>
                  </template>
                  <template #item-code="item">
                    <BillCode :data="item.code" role="button" @click="showDetail(item)" />
                  </template>
                  <template #item-document_date="item">
                    <div class="fw-bold" v-if="item.document_date">
                      {{ MyFormatDate(item.document_date) }}
                    </div>
                  </template>
                  <template #item-commitment_date="item">
                    <div class="fw-bold" v-if="item.commitment_date">
                      {{ item.commitment_date ? MyFormatDate(item.commitment_date) : null }}
                    </div>
                  </template>
                  <template #item-bill_status="item">
                    <div class="fw-bold">
                      <BillStatus v-model="item.bill_status" />
                    </div>
                  </template>
                </EasyDataTable>
                <!-- <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="fw-bold text-decoration-underline">Action</th>
                        <th scope="col" class="fw-bold text-decoration-underline">#ID</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Code</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Date</th>
                        <th scope="col" class="fw-bold text-decoration-underline" nowrap>
                          Commitment Date
                        </th>

                        <th scope="col" class="fw-bold text-decoration-underline">Customer</th>
                        <th scope="col" class="fw-bold text-decoration-underline">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <th scope="row" nowrap>
                          <router-link
                            :to="{ name: 'bills.commitmentForm', params: { code: item.code } }"
                          >
                            <i class="bi bi-calendar mx-1" role="button"></i
                          ></router-link>
                          <router-link
                            :to="{ name: 'bills.formEdit', params: { code: item.code } }"
                          >
                            <i class="bi bi-pencil mx-1" role="button"></i
                          ></router-link>
                          <i class="bi bi-search mx-1" @click="showDetail(item)" role="button"></i>
                        </th>
                        <th scope="row">{{ item.id }}</th>
                        <td align="left" nowrap>
                          <router-link
                            :to="`/bills/code/${item.code}`"
                            class="w-full d-block fw-bold border bg-dark text-white p-1"
                            target="_blank"
                          >
                            {{ item.code }}
                          </router-link>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark" v-if="item.document_date">{{
                            MyFormatDate(new Date(item?.document_date))
                          }}</span>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark" v-if="item.commitment_date">{{
                            MyFormatDate(new Date(item?.commitment_date))
                          }}</span>
                        </td>

                        <td>
                          <div>{{ item.customer?.companyname }}</div>
                          <small class="text-danger mx-1">({{ item.agent_name }})</small>
                          <small class="text-secondary mx-1">({{ item.customer.taxnumber }})</small>
                        </td>
                        <td>{{ item.progress_status }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <vue-awesome-paginate
                  :total-items="pagination.total"
                  :items-per-page="pagination.per_page"
                  :max-pages-shown="appStore.settings.page.maxPageShow"
                  v-model="pagination.current_page"
                  :on-click="onChangePage"
                /> -->
                <!-- End small tables -->
              </div>
            </div>
            <div class="tab-content pt-2">
              <div class="tab-pane fade qt-status" id="qt-status">
                <table class="table table-sm table-border">
                  <thead>
                    <tr>
                      <th>สถานะ</th>
                      <th>คำอธิบาย</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>New Request</td>
                      <td>
                        <ul>
                          <li>สร้างใบขอรับบริการใหม่</li>
                          <li>รอเพิ่มเครื่องมือต่างๆ</li>
                          <li>สามารถเปลี่ยนเป็น Pending / Canceled</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Pending</td>
                      <td>
                        <ul>
                          <li>
                            เมื่อมีการระบุ [วันที่ทดสอบ] และ [วันนัดรับ] สถานะของงานจะถูกเปลี่ยนเป็น
                            Pending
                          </li>
                          <li>สามารถเปลี่ยนสถานะเป็น In Progress / Canceled / Void</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>In Progress</td>
                      <td>
                        <ul>
                          <li>
                            เมื่อมีการเริ่มดำเนินการ หรืองานเข้าห้องทดลอง สถานะเปลี่ยนเป็น In
                            Progress
                          </li>
                          <li>สามารถเปลี่ยนเป็น Completed / Canceled / Void</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Completed</td>
                      <td>
                        <ul>
                          <li>ใบขอรับบริการที่งานเสร็จหมดแล้ว สถานะเปลี่ยนเป็น Completed</li>
                          <li>ใบขอรับบริการที่มีสถานะเป็น Completed สามารถดึงไปออกใบรับรอง</li>
                          <li>สามารถเปลี่ยน Closed</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Closed</td>
                      <td>
                        <ul>
                          <li>
                            มีการสร้างใบรับรอง หรือ Invoice แล้ว เอกสารทุกอย่างเรียบร้อย มีสถานะเป็น
                            Closed
                          </li>

                          <li>
                            ใบขอรับบริการที่มีสถานะเป็น Closed
                            ไม่สามารถเปลี่ยนสถานะเป็นอย่างอื่นได้อีก
                          </li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Canceled</td>
                      <td>
                        <ul>
                          <li>ใบขอรับบริการที่ถูกเลิก สถานะถูกเปลี่ยนเป็น Canceled</li>
                          <li>
                            ใบขอรับบริการที่มีสถานะเป็น Canceled
                            ไม่สามารถเปลี่ยนสถานะเป็นอย่างอื่นได้อีก
                          </li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Void</td>
                      <td>
                        <ul>
                          <li>
                            ใบขอรับบริการที่สถานะเป็น Void จะไม่สามารถนำไปใช้งานจริงและออกรายงาน
                          </li>
                          <li>ใช้สำหรับในการทดสอบระบบ</li>
                        </ul>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- End Bordered Tabs -->
          </div>
        </div>
      </div>
    </div>

    <ModalBillCreate ref="modalBillCreateRef" title="สร้างใบขอรับบริการใหม่" :billTypes="billTypes" />
    <ModalBillDetail ref="modalBillDetailRef" title="รายละเอียดใบขอรับบริการ" :billTypes="billTypes" :data="bill" />
    <ModalBillEdit ref="modalBillEditRef" title="แก้ไขใบขอรับบริการ" :billTypes="billTypes" :data="bill" />
    <ModalCommitmentBooking ref="modalCommitmentRef" :bill="bill" @onSave="(data) => {
      console.log('saved', data);
      loadData();
    }
      " @onReload="(data) => {
    console.log('reload after booking', data);
    getBillById(data.id)

  }
    " />
  </section>

  <div class="modal" ref="modalViewRef" v-if="bill">
    <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Bill ID#{{ bill.id }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-4 col-lg-3">
              <label class="fw-bold text-decoration-underline">เลขที่</label>
              <p>{{ bill.code }}</p>
            </div>
            <div class="col-4 col-lg-3">
              <label class="fw-bold text-decoration-underline">ลูกค้า</label>
              <p>{{ bill?.customer?.companyname }}</p>
            </div>
            <div class="col-4 col-lg-3">
              <label class="fw-bold text-decoration-underline">วันที่</label>
              <p>{{ bill.document_date ? MyFormatDate(bill.document_date) : '' }}</p>
            </div>

            <div class="col-4 col-lg-3">
              <label class="fw-bold text-decoration-underline">ผู้ติดต่อ</label>
              <p>{{ bill.agent_name }}</p>
            </div>
            <div class="col-12 col-lg-3">
              <label class="fw-bold text-decoration-underline">ที่อยู่</label>
              <p>{{ bill.address_name }} {{ bill.address_detail }}</p>
            </div>

            <div class="col-4 col-lg-3">
              <label class="fw-bold text-decoration-underline">เวลาทำรายการ</label>
              <p>{{ MyFormatDate(bill.date_start) }}</p>
            </div>
            <div class="col-4 col-lg-3">
              <label class="fw-bold text-decoration-underline">วันนัดรับเครื่องมือ</label>
              <p v-if="bill.commitment_date">
                {{ MyFormatDate(bill.commitment_date) }}
              </p>
            </div>
            <div class="col-4 col-lg-3">
              <label class="fw-bold text-decoration-underline">สถานะ</label>
              <p>
                <BillButtonStatus v-model="bill.bill_status" :data="bill" @on-change="onChangeBillStatus" />
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="fw-bold text-decoration-underline">Note Customer</label>
              <p class="text-muted text-wrap fst-italic fw-light">{{ bill.note_customers }}</p>
            </div>
            <div class="col-12 col-md-6">
              <label class="fw-bold text-decoration-underline">หมายเหตุ</label>
              <p class="word-wrap">{{ bill.remark }}</p>
            </div>
          </div>

          <div class="" v-if="loadingItems">
            <div class="spinner-grow" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-condensed table-sm table-bordered" v-if="!loadingItems">
              <thead>
                <tr>
                  <th class="fw-bold text-decoration-underline">#</th>
                  <th class="fw-bold text-decoration-underline">NO</th>
                  <th class="fw-bold text-decoration-underline">ItemCode</th>
                  <th class="fw-bold text-decoration-underline">Tracking Status</th>
                  <th class="fw-bold text-decoration-underline" nowrap>วันที่</th>
                  <th class="fw-bold text-decoration-underline">Item Name</th>
                  <th class="fw-bold text-decoration-underline">Test Point</th>
                  <th class="fw-bold text-decoration-underline">SN.</th>

                  <th class="fw-bold text-decoration-underline text-end">Qty</th>
                  <th class="fw-bold text-decoration-underline text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in bill.items" :key="row">
                  <th>
                    <input type="checkbox" v-model="itemsSelected" name="itemsSelected[]" :value="row" />
                  </th>
                  <th>{{ rowIndex + 1 }}</th>
                  <td nowrap>
                    {{ row.item_code }}
                    <div>
                      <small>#<span class="text-primary fw-bold">{{ row.item_id }}</span></small>
                    </div>
                  </td>
                  <td nowrap>
                    <!-- <JobStatus v-model="row.job_status" /> -->
                    <div>{{ row?.lab.name_th }} #{{ row.lab.id }}</div>
                    <div class="ms-2 border-bottom">
                      <small class="fs-italic">
                        {{ row?.sublab.name_th }} #{{ row.sublab.id }}</small>
                    </div>
                    <div v-if="row.current_service_status" style="font-size: 12px"
                      class="border-bottom text-danger fw-bold">
                      {{ row.current_service_status.status_name }} #{{
                        row.current_service_status.status_id
                      }}
                    </div>
                    <JobButtonStatus v-model="row.job_status" :data="row" @on-change="onChangeJobStatus" />
                  </td>
                  <td nowrap>{{ MyFormatDate(row.reserved_date) }}</td>
                  <td>{{ row.product_name }}</td>
                  <td>{{ row.test_point }}</td>
                  <td>{{ row.serialnumber }}</td>
                  <td class="text-end">{{ row.qty }}</td>
                  <td class="text-end">{{ row.total }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="8">
                    ค่าบริการ Onsite
                    <span class="ms-3">{{ parseFloat(bill.cost_onsite).toLocaleString() }}</span>

                    <label class="ms-5">ค่าขนส่ง</label>
                    <span class="ms-3">{{ parseFloat(bill.cost_travel).toLocaleString() }}</span>
                  </td>

                  <td>รวม</td>
                  <td colspan="2" class="text-end fw-bold">
                    {{ parseFloat(bill.total_price).toLocaleString() }}
                  </td>
                </tr>
                <tr>
                  <td colspan="8"></td>
                  <td>VAT ({{ parseFloat(bill.vat_percent).toLocaleString() }}%)</td>
                  <td colspan="2" class="text-end fw-bold">
                    {{ parseFloat(bill.vat_total).toLocaleString() }}
                  </td>
                </tr>
                <tr>
                  <td colspan="8"></td>
                  <td>รวมเป็นเงินทั้งหมด</td>
                  <td colspan="2" class="text-end fw-bolder text-decoration-underline">
                    {{ Number(bill.grand_total).toLocaleString() }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p>
            <label class="me-3 fw-bold text-decoration-underline">ที่อยู่ในการจัดส่งใบรับรอง:</label>
            <span class="text-wrap">
              {{
                `${bill.cert_address_name} ${bill.cert_address_detail}
                            ${bill.cert_address_province} ${bill.cert_address_zipcode} ${bill.cert_address_phone}`.trim()
              }}</span>
          </p>
        </div>
        <div class="modal-footer d-block">
          <!-- ///////////// -->

          <div class="d-flex">
            <div class="p-1">
              <span class="alert alert-danger p-1" v-if="errorMsg">{{ errorMsg }}</span>
            </div>

            <div class="p-1">
              <span class="badge rounded-pill bg-danger p-2 fw-bold" v-if="itemsSelected.length > 0">{{
                itemsSelected.length }} รายการ</span>
            </div>
          </div>

          <div class="row g-2">
            <div class="col-12 col-lg-12 col-xl-12">
              <Spinner :visible="loadingCancelCommitment" />
              <span v-if="resultCancelCommitment.success === true" class="text-success">{{
                resultCancelCommitment.message
              }}</span>
              <span v-if="resultCancelCommitment.success === false" class="text-danger">{{
                resultCancelCommitment.message
              }}</span>
            </div>

            <div class="col-12 col-lg-6 col-xl-6">
              <!-- <button type="button" class="btn btn-danger btn-sm mx-1" @click="cancelBill(bill)">
                <i class="bi bi-x"></i> ยกเลิก
              </button> -->
              <!-- <button type="button" class="btn btn-success btn-sm mx-1" @click="newInvoice">
                <i class="bi bi-plus"></i> Invoice Cart
              </button> -->
              <!-- <button type="button" class="btn btn-secondary btn-sm mx-1" data-bs-dismiss="modal">
                <i class="bi bi-x-circle"></i> ปิดหน้าต่าง
              </button> -->
            </div>
          </div>

          <!-- ///////////// -->
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
          <div class="table-responsive">
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
                  <th>{{ row.product_name }}</th>
                  <th>
                    <span class="mx-2 badge badge-light text-dark d-inline-block">{{
                      row.model
                    }}</span>
                  </th>
                  <th>
                    <input type="number" name="price[]" v-model="row.price" class="form-control form-control-sm"
                      style="width: 100px" />
                  </th>
                  <th>
                    <input type="number" name="price[]" v-model="row.discount" class="form-control form-control-sm"
                      style="width: 100px" />
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <label class="font-bold mr-3">NOTE:</label>
            <textarea class="form-control" placeholder="หมายเหตุ"></textarea>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="createInvoice">
            สร้างใบแจ้งหนี้
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Modal } from 'bootstrap'
import { useInvoiceStore } from '@/stores/invoiceStore'
import router from '@/router'
import { toast } from 'vue3-toastify'
import { useAppStore } from '@/stores/appStore'
import axios from 'axios'
import { MyFormatDate } from '@/helpers/myformat.js'
import BillStatus from '@/views/bill/components/BillStatus.vue'
import JobStatus from '@/views/bill/components/JobStatus.vue'
import BillButtonStatus from '@/views/bill/components/BillButtonStatus.vue'
import JobButtonStatus from '@/views/bill/components/JobButtonStatus.vue'
import BillCode from '@/views/bill/components/BillCode.vue'
import ModalBillCreate from '@/views/bill/components/ModalBillCreate.vue'
import ModalCommitmentBooking from '@/views/bill/components/ModalCommitmentBooking.vue'
import ModalBillDetail from '@/views/bill/components/ModalBillDetail.vue'
import ModalBillEdit from '@/views/bill/components/ModalBillEdit.vue'
import { useBillStore } from '@/stores/billStore'

const appStore = new useAppStore()
const billStore = new useBillStore()
const items = ref([])
const pagination = ref({
  total: 0,
  per_page: appStore.settings.page.perPage,
  current_page: 1,
})
const loadingCancelCommitment = ref(false)
const loading = ref(false)
const loadingItems = ref(true)
const bill = ref({})
const billTypes = ref([])
const invoice = ref({})
const modalViewRef = ref(null)
const modalView = ref(null)
const modalInvoiceRef = ref(null)
const modalInvoice = ref(null)
const modalBillCreateRef = ref(null)
const modalBillDetailRef = ref(null)
const modalBillEditRef = ref(null)
const modalCommitmentRef = ref(null)

const resultCancelCommitment = ref({})
const formSearch = ref({
  code: '',
  taxnumber: '',
  q: '',
})

const invoiceStore = useInvoiceStore()

const loadData = async () => {
  loading.value = true
  let params = {
    per_page: pagination.value.per_page,
    page: pagination.value.current_page,
    ...formSearch.value,
  }
  const { data } = await api.get('/v2/bills', {
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
    loading.value = false
    console.log('data', items.value);
  }
  loading.value = false
}
const getBillTypes = async () => {
  const { data } = await api.get('/v2/bills/types')
  if (data) billTypes.value = data
}

getBillTypes()

const getBillById = async (id) => {
  try {
    const { data } = await api.get('/v2/bills/' + id)
    if (data) {
      bill.value = data
      loading.value = false
    }
    loadingItems.value = false
  } catch (error) {
    loadingItems.value = false
  }
}
const getBillByCode = async (code) => {
  try {
    const { data } = await api.get('/v2/bills/code/' + code)
    if (data) {
      bill.value = data
      billStore.formEdit = data
      loading.value = false
    }
    loadingItems.value = false
  } catch (error) {
    loadingItems.value = false
  }
}

const showDetail = (item) => {
  loadingItems.value = true
  errorMsg.value = ''
  itemsSelected.value = []
  bill.value = item
  bill.value.items = []
  // modalView.value.show()
  modalBillDetailRef.value.show()
  getBillByCode(item.code)
}
const showEdit = (item) => {
  loadingItems.value = true
  errorMsg.value = ''
  itemsSelected.value = []
  billStore.formEdit = item
  modalBillEditRef.value.show()
}

const onChangeBillStatus = (result) => {
  if (result.success) {
    toast(result.message, {
      autoClose: 500,
      theme: 'auto',
      type: 'success',
      dangerouslyHTMLString: true,
    })
    getBillByCode(result.data.code)
  }
}
const onChangeJobStatus = (result) => {
  if (result.success) {
    toast(result.message, {
      autoClose: 500,
      theme: 'auto',
      type: 'success',
      dangerouslyHTMLString: true,
    })
    getBillById(result.data.bill_id)
  }
}
const errorMsg = ref()
const itemsSelected = ref([])

const cancelBill = async (item) => {
  resultCancelCommitment.value = {}
  let params = {
    bill_id: item.id,
    bill_code: item.code,
  }
  loadingCancelCommitment.value = true
  const { data } = await axios
    .post(import.meta.env.VITE_KANBAN_API_URL + '/v1/bills', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appStore.token}`,
      },
    })
    .catch((err) => {
      resultCancelCommitment.value.success = false
      loadingCancelCommitment.value = false
      if (err.response) {
        let data = err.response?.data
        if (data) {
          resultCancelCommitment.value.message = data.message
          toast(data.message, {
            theme: 'auto',
            type: 'default',
            dangerouslyHTMLString: true,
          })
        } else {
          resultCancelCommitment.value.message = err.message
          toast(err.message, {
            theme: 'auto',
            type: 'default',
            dangerouslyHTMLString: true,
          })
        }
      } else {
        resultCancelCommitment.value.message = err.message
        toast(err.message, {
          theme: 'auto',
          type: 'default',
          dangerouslyHTMLString: true,
        })
      }
    })
  if (data) {
    resultCancelCommitment.value.success = true
    resultCancelCommitment.value.message = data.message
    loadingCancelCommitment.value = false
    toast(data.message, {
      theme: 'auto',
      type: 'success',
      dangerouslyHTMLString: true,
    })
  }
  return
}

const newInvoice = () => {
  errorMsg.value = ''
  const i = bill.value
  if (itemsSelected.value.length === 0) {
    errorMsg.value = 'โปรดเลือกรายการเครื่องมืออย่างน้อย 1 รายการ'
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
    discount: 0,
  }
  invoice.value.items = itemsSelected.value
  if (itemsSelected.value.length > 0) {
    itemsSelected.value.map((item) => {
      const product = {
        item_id: item.item_id,
        item_code: item.item_code,
        bill_id: item.bill_id,
        product_name: item.product_name,
        product_id: item.product_id,
        product: item?.product,
        id_no: item.id_no,
        model: item.model,
        serialnumber: item.serialnumber,
        barcode_no: item.barcode_no,
        price: item.total,
        manufaturer_name: item.manufaturer_name,
        lab: item.lab,
      }
      invoiceStore.addItem(product)
    })
  }
  modalView.value.hide()
  router.push({ name: 'invoices.create' })
}

// const createInvoice = () => {
//   alert('สร้างใบแจ้งนี้สำเร็จ')
//   invoice.value = {}
//   bill.value = {}
//   errorMsg.value = ''
//   itemsSelected.value = []
//   modalView.value.hide()
//   modalInvoice.value.hide()
// }

const newBill = () => {
  modalBillCreateRef.value.show()
}
const openModalCommitment = (item) => {
  console.log('caldate', item.code)
  errorMsg.value = ''
  bill.value = item
  // bill.value.items = []
  modalCommitmentRef.value.show()
}
const onSearch = async () => {
  try {
    pagination.value.current_page = 1
    await loadData()
  } catch (error) { }
}

const resetFormSearch = () => {
  formSearch.value.taxnumber = ''
  formSearch.value.q = ''
}
onSearch()
onMounted(() => {
  errorMsg.value = ''
  modalView.value = new Modal(modalViewRef.value)
  modalInvoice.value = new Modal(modalInvoiceRef.value)
})

const headers = [
  // { text: 'ID', value: 'id' },
  { text: 'Action', value: 'action', width: 100 },
  { text: 'Code', value: 'code', width: 120 },
  { text: 'ID', value: 'id' },
  { text: 'วันที่', value: 'document_date', width: 100, sortable: true },
  { text: 'นัดรับ', value: 'commitment_date', width: 110, sortable: true },

  { text: 'บริษัท/ลูกค้า', value: 'address_name' },
  { text: 'ผู้ติดต่อ', value: 'agent_name' },
  { text: 'รวมเป็นเงิน', value: 'grand_total' },
  { text: 'Bill Status', value: 'bill_status' },
]

const serverOptions = ref({
  page: pagination.value.current_page,
  rowsPerPage: appStore.settings.page.perPage,
})

watch(
  serverOptions,
  (data) => {
    console.log(data)
    pagination.value.current_page = data.page
      ; (pagination.value.per_page = data.rowsPerPage), (formSearch.value.sortBy = data.sortBy)
    formSearch.value.orderBy = data.sortType
    loadData()
  },
  {
    deep: true,
  },
)
</script>
<style lang="scss" scoped>
td,
th {
  font-size: 14px;
}

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
