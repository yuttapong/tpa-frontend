<template>
  <div>
    <div class="cert" v-if="data.cerno">
      <div class="row">
        <div class="col-8 fw-bold"><h1 class="header">Certificate of Calibration</h1></div>
        <div class="col-4">{{ data.cerno }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Equipment</div>
        <div class="col-8">{{ data.equipment?.product_name }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Manufacturer</div>
        <div class="col-8">{{ data.equipment?.manufaturer_name }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Model</div>
        <div class="col-8">{{ data.equipment?.model }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Serial No.</div>
        <div class="col-8">{{ data.equipment?.serialnumber }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">ID No.</div>
        <div class="col-8">{{ data.equipment?.id_no }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Condition AS-Receiveed</div>
        <div class="col-8">{{ data.asreceived }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Calibratio Date:</div>
        <div class="col-8">{{ data.caldate }}</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Received Date:</div>
        <div class="col-8">{{ data.receceiveddate }}</div>
      </div>
      <div class="row">
        <div class="col-2 fw-bold">Reference</div>
        <div class="col-2">{{ data.referace }}</div>
        <div class="col-2 fw-bold fw-bold">Submitted by:</div>
        <div class="col-6">
          {{ data?.submitted?.customer }}<br />
          {{ data?.submitted?.address }}
        </div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Ambient Temperature:</div>
        <div class="col-8">({{ data.ambienttempmax }} {{ data.ambienttempmin }}) &#8451;</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Relative Humidity:</div>
        <div class="col-8">({{ data.relativehummax }} {{ data.relativehummin }}) %</div>
      </div>
      <div class="row">
        <div class="col-4 fw-bold">Atmospheric Pressure:</div>
        <div class="col-8">{{ data.atmosphericpressure }}</div>
      </div>
      <div class="row">
        <div class="col-3 fw-bold">Procedure used:</div>
        <div class="col-9">{{ data.cerprocedure }}</div>
      </div>
      <div class="row">
        <div class="col-12">
          <strong class="text-decoration-underline">Condition of this result of calibration</strong>
        </div>
        <div class="col-12">
          <ol>
            <li>
              1.Reference standards instruments:
              <table class="table-sm w-100">
                <thead>
                  <tr>
                    <th class="fw-bold text-decoration-underline">Instrument</th>
                    <th class="fw-bold text-decoration-underline">Model</th>
                    <th class="fw-bold text-decoration-underline">Serial No.</th>
                    <th class="fw-bold text-decoration-underline">Certificate No.</th>
                    <th class="fw-bold text-decoration-underline">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, key) in data.reference_standard_instrument" :key="key">
                    <td>{{ i.instrument.instrument }}</td>
                    <td>{{ i.instrument?.model }}</td>
                    <td>{{ i.instrument?.serail }}</td>
                    <td>{{ i?.testreportno }}</td>
                    <td>{{ i.duedate }}</td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li
              class="text-danger conditionname"
              v-for="(c, ckey) in data.certificate_conditions"
              :key="ckey"
            >
              <span v-html="c.conditionname"></span>
            </li>
            <li class="text-info">
              The certificate is valid only to the item calibrated on date and place of calibration.
            </li>
            <li>
              This Certification is traceable to the International System of Unit maintained at:-
              <!-- {{ traces }} -->

              <template v-if="data.condition">
                <ul v-for="(t, tkey) in data.condition?.tracecername" :key="tkey">
                  <!-- <span class="badge bg-info mx-1">{{ t.standardid }}</span>
                  <span class="badge bg-dark mx-1">{{ t.cerno }}</span> -->
                  <li>{{ t?.tracecername }}</li>
                </ul>
              </template>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div v-else>
      <Spinner :visible="!data.cerid" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import avatar from '@/assets/img/profile-img.jpg'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import { Tab, Modal } from 'bootstrap'
import { DateTime, Number } from '@/helpers/myformat'
import { object } from 'yup'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const traces = computed(() => {
  let list = []
  if (props.data.reference_standard_instrument) {
    props.data.reference_standard_instrument.map((i) => {
      i.cal_histories.map((t) => {
        let x = new Object()
        x.standardid = t.standardid
        x.tracecername = t.trace.tracecername
        x.cerno = t.cerno
        list.push(x)
      })
    })
  }
  return list
})
</script>
<style lang="scss" scoped>
.cert {
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
.conditionname {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}
</style>
