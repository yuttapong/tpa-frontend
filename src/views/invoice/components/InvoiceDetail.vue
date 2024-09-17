<script setup>
import { onMounted, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import ProductMeta from '@/views/invoice/components/ProductMeta.vue'
import { myFormatDate, myCurrency } from '@/helpers/myformat'

const invoiceStore = useInvoiceStore()

const data = computed(() => invoiceStore.invoice)
onMounted(() => {})
</script>
<template>
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
          <p>{{ myFormatDate(data?.issue_date) }}</p>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <label class="fw-bold text-danger">Due Date</label>
          <p>{{ myFormatDate(data?.due_date) }}</p>
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
              <th scope="col" class="fw-bold">Point</th>
              <th scope="col" class="fw-bold">Point Price</th>
              <th scope="col" class="fw-bold">Range</th>
              <th scope="col" class="fw-bold">Range Price</th>
              <th scope="col" class="fw-bold text-end" nowrap>ราคา</th>
              <th scope="col" class="fw-bold text-end" nowrap>ส่วนลด</th>

              <th scope="col" class="fw-bold text-end" nowrap>รวมเป็นเงิน</th>
              <th scope="col" class="fw-bold" nowrap>หมายเหตุ</th>
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

              <td class="text-end">{{ parseFloat(item.point).toLocaleString() }}</td>
              <td class="text-end">{{ parseFloat(item.point_price).toLocaleString() }}</td>
              <td class="text-end">{{ parseFloat(item.range).toLocaleString() }}</td>
              <td class="text-end">{{ parseFloat(item.range_price).toLocaleString() }}</td>

              <td class="text-end">{{ parseFloat(item.price).toLocaleString() }}</td>
              <td class="text-end">{{ parseFloat(item.discount).toLocaleString() }}</td>
              <td class="text-end">
                {{ (parseFloat(item.price) - parseFloat(item.discount)).toLocaleString() }}
              </td>
              <td class="text-left">{{ item.remark }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>

              <td class="text-end">{{ parseFloat(data?.totalprice).toLocaleString() }}</td>
              <td class="text-end">{{ parseFloat(data?.totaldiscount).toLocaleString() }}</td>
              <td class="text-end">{{ parseFloat(data?.totalnet).toLocaleString() }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <!-- <div class="row g-3">
        <div class="col-3"></div>
        <div class="col-3">Total Price: {{ parseFloat(data?.totalprice).toLocaleString() }}</div>
        <div class="col-3">
          Total Discount : {{ parseFloat(data?.totaldiscount).toLocaleString() }}
        </div>
        <div class="col-3">Total Net : {{ parseFloat(data?.totalnet).toLocaleString() }}</div>
      </div> -->

      <!-- #################### START SUMMAYRY ####################### -->

      <div class="row g-1">
        <div class="col-12 col-md-6" style="font-size: 14px">
          <div class="row border border-danger m-1">
            <div class="col-6 text-end">ส่วนลดสินค้า</div>
            <div class="col-6">
              <div class="text-end fw-bold text-danger">
                - {{ myCurrency(invoiceStore.totalDiscount) }}
              </div>
            </div>
            <div class="col-6 text-end">ส่วนลดท้ายบิล</div>
            <div class="col-6">
              <div class="text-end fw-bold text-danger">
                - {{ myCurrency(invoiceStore.totalBillDiscount) }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6" style="font-size: 14px">
          <div class="row">
            <div class="col-6 text-end">รวมเงิน</div>
            <div class="col-6">
              <div class="text-end fw-bold">{{ myCurrency(data.totalprice) }}</div>
            </div>
          </div>
          <div class="row" v-if="data?.totaldiscount > 0">
            <div class="col-6 text-end text-danger">ส่วนลดทั้งหมด</div>
            <div class="col-6">
              <div class="text-end fw-bold text-danger">
                - {{ myCurrency(invoiceStore.totalAllDiscount) }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6 text-end">คงเหลือ</div>
            <div class="col-6">
              <div class="text-end fw-bold text-decoration-underline">
                {{ myCurrency(invoiceStore.totalPriceAfterDiscount) }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6 text-end">ภาษีมูลค่าเพิ่ม (VAT)</div>
            <div class="col-6">
              <div class="text-end fw-bold text-decoration-underline">
                {{ myCurrency(data?.totalvat) }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6 text-end">จำนวนเงินทั้งสิ้น</div>
            <div class="col-6">
              <div class="text-end fw-bold h4 text-decoration-underline">
                {{ myCurrency(data?.totalnet) }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <!-- <textarea v-model="data?.remark" class="form-control" placeholder="Remark หมายเหตุ..."></textarea> -->
        </div>
      </div>
      <!-- #################### END SUMMAYRY ####################### -->
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
