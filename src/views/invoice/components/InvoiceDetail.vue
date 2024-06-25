<script setup>
import { onMounted, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'
import {  MyFormatDate } from '@/helpers/myformat'

const invoiceStore = useInvoiceStore()

const data = computed(() => invoiceStore.invoice)
onMounted(() => { })
</script>
<template>
  <section class="section">
    <div class="preview">
      <div class="row">
        <div class="col-6">
          <p>
            <img src="https://tpacal.or.th/wp-content/uploads/2023/12/Logo-Banner-new-1.jpg" height="60" />
          </p>
        </div>
        <div class="col-6">
          <p class="fw-bolder" style="font-size: 1.2rem">{{ data?.code }}</p>
        </div>
      </div>
      <div class="row g-2">
        <div class="col-6 col-md-4 col-lg-3">
          <label class="fw-bold text-danger">วันที่</label>
          <p>{{ MyFormatDate(data?.issue_date) }}</p>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <label class="fw-bold text-danger">Due Date</label>
          <p>{{ MyFormatDate(data?.due_date) }}</p>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <label class="fw-bold text-danger">Invoice Code</label>
          <p>{{ data?.code }}</p>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <label class="fw-bold text-danger">ลูกค้า </label>
          <p>{{ data?.customer_name }}</p>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <label class="fw-bold text-danger">ผู้ติดต่อ </label>
          <p>{{ data?.contact_name }}</p>
        </div>
        <div class="col-12 col-lg-6">
          <label class="fw-bold text-danger">ที่อยู่</label>
          <p>{{ data?.address }}</p>
        </div>
      </div>
      <spinner :visible="data && !data.items" />
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
          <tbody v-if="data && data.items">
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
                {{ (parseFloat(item.price) - parseFloat(item.discount)).toLocaleString() }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td class="text-right">{{ parseFloat(data?.totaldiscount).toLocaleString() }}</td>
              <td class="text-right">{{ parseFloat(data?.totalprice).toLocaleString() }}</td>
              <td class="text-right">{{ parseFloat(data?.totalnet).toLocaleString() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="row g-3">
        <div class="col-3"></div>
        <div class="col-3">Total Price: {{ parseFloat(data?.totalprice).toLocaleString() }}</div>
        <div class="col-3">
          Total Discount : {{ parseFloat(data?.totaldiscount).toLocaleString() }}
        </div>
        <div class="col-3">Total Net : {{ parseFloat(data?.totalnet).toLocaleString() }}</div>
      </div>
    </div>

  </section>
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

  >p,
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
