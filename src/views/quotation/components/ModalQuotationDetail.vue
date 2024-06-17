<script setup>
import { onMounted, computed, ref } from 'vue'
import Spinner from '@/components/Spinner.vue'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'
import { DateTime } from '@/helpers/myformat.js'

import { Modal } from 'bootstrap'
const props = defineProps(['data'])
const emit = defineEmits(['onHide', 'onShow'])

const modalEle = ref(null)
const modalRef = ref(null)
const remark = computed(() => {
  if (props.data.remark) {
    let list = props.data.remark.split('|')
    return list
  }
  return []
})
const tatalDiscount = computed(() => props.data.items ? props.data.items.reduce((total, item) => total+=parseFloat(item.discount),0) : 0)
const tatalPrice = computed(() => props.data.items ? props.data.items.reduce((total, item) => total+=parseFloat(item.price),0) : 0)
const _show = () => {
  emit('onShow', props.data)
  modalEle.value.show()
}
onMounted(() => {
  modalEle.value = new Modal(modalRef.value)
})
defineExpose({ show: _show })
</script>
<template>
  <div class="modal" ref="modalRef">
    <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            ใบเสนอราคา
            <span v-if="data.code" class="ms-3">{{ data?.code }}</span>
            <span v-if="data.code" class="ms-3">{{
              Number(data?.grand_total).toLocaleString()
            }}</span>
          </h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <section class="section">
            <div class="preview">
              <div class="row">
                <div class="col-6">
                  <p>
                    <img
                      src="https://tpacal.or.th/wp-content/uploads/2023/12/Logo-Banner-new-1.jpg"
                      height="60"
                    />
                  </p>
                </div>
                <div class="col-6">
                  <p class="fw-bolder" style="font-size: 1.2rem">{{ data?.code }}</p>
                </div>
              </div>
              <div class="row g-2">
                <div class="col-6 col-md-4 col-lg-3">
                  <label class="fw-bold text-danger">วันที่</label>
                  <p>{{ DateTime(data?.document_date) }}</p>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label class="fw-bold text-danger">Due Date</label>
                  <p>{{ DateTime(data?.due_date) }}</p>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label class="fw-bold text-danger">Code</label>
                  <p>{{ data?.code }}</p>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label class="fw-bold text-danger">ลูกค้า ({{ data?.company_id }})</label>
                  <p v-if="data.customer">{{ data.customer.companyname }}
                    <div v-if="data.customer.is_company === 'yes'"><small class="ms-1">{{ data?.customer.taxnumber }}</small></div>
                  </p>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <label class="fw-bold text-danger">ผู้ติดต่อ </label>
                  <p>{{ data?.agent_name }}</p>
                </div>
                <div class="col-12 col-lg-6">
                  <label class="fw-bold text-danger">ที่อยู่</label>
                  <p>
                    {{ data?.address_detail }}
                    {{ data?.address_province }}
                    {{ data?.address_zipcode }}
                    {{ data?.address_provice }}
                  </p>
                </div>
              </div>
              <spinner :visible="!data.items" />
              <div size="">
                <table class="table table-sm table-condensed table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" nowrap class="fw-bold">ลำดับที่</th>
                      <th scope="col" class="fw-bold">รายการ</th>

                      <th scope="col" class="fw-bold" nowrap>ส่วนลด</th>
                      <th scope="col" class="fw-bold" nowrap>ราคา</th>
                      <th scope="col" class="fw-bold" nowrap>ราคารวม</th>
                    </tr>
                  </thead>
                  <tbody v-if="data.items">
                    <tr v-for="(item, index) in data.items" :key="index">
                      <th scope="row" class="text-center">{{ index + 1 }}</th>
                      <!-- <td> {{ item.item_code }}</td> -->
                      <td>
                        {{ item.product_name }}

                        <ProductMeta :item="item" />
                      </td>

                      <td class="text-right">{{ parseFloat(item.discount).toLocaleString() }}</td>
                      <td class="text-right">{{ parseFloat(item.price).toLocaleString() }}</td>
                      <td class="text-right">
                        {{ (parseFloat(item.total)).toLocaleString() }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="text-right">
                        {{ parseFloat(tatalDiscount).toLocaleString() }}
                      </td>
                      <td class="text-right">
                        {{ parseFloat(tatalPrice).toLocaleString() }}
                      </td>
                      <td class="text-right">{{ parseFloat(data?.grand_total).toLocaleString() }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div class="row g-3">
                <div class="col-3"></div>
                <div class="col-3">
                  Total Price: {{ parseFloat(data?.total_price).toLocaleString() }}
                </div>
                <div class="col-3">
                  Total Discount : {{ parseFloat(data?.total_discount).toLocaleString() }}
                </div>
                <div class="col-3">
                  Total Net : {{ parseFloat(data?.grand_total).toLocaleString() }}
                </div>
              </div>

              <template v-if="remark">
                <h6 class="fw-bold text-decoration-underline">หมายเหตุ</h6>
                <p v-for="text in remark" :key="text">{{ text }}</p>
              </template>
            </div>
          </section>
        </div>
        <div class="modal-footer m-0 p-1 d-block">
          <div class="row">
            <div class="col-xs-10 col-md-10"></div>

            <div class="col-xs-2 col-md-2">
              <button type="button" class="btn btn-secondary float-end" data-bs-dismiss="modal">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div[size='A4'] {
  width: 21cm;
  height: 29.7cm;
  padding: 10px;
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);

  > p,
  span,
  li,
  td {
    font-size: 12px;
    font-family: Arial;
  }
}

div[size='A4'][layout='portrait'] {
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
