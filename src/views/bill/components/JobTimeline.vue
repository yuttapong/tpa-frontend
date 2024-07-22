<template>
  <div>
    <ul class="timeline">
      <li class="event" v-for="(item, key) in props.statuses" :key="key">
        <div class="left-arrow"></div>
        <div class="time">
          <template v-if="item.created_at > 0">
            {{ item.created_at > 0 ? myFormatDate(fromUnixTime(item.created_at), 'p') : '' }}
            <br />{{ showTime(item.created_at) }} <span class="glyphicon glyphicon-time"></span>
          </template>
          <template v-else> เวลาไม่ถูกต้อง </template>
        </div>
        <h6 class="fw-bold text-primary">{{ item.status_name }} #{{ item.status_id}}</h6>
        <div class="description">
          <small class="ms-3 text-danger"
            ><i class="bi bi-person-circle"></i> {{ item.created_name }}</small
          >
          <p v-if="item.sublab_id">Sublab # {{ item.sublab_id }} - {{ item.sublab_name }}</p>
          <p v-if=" item.remark ">{{ item.remark }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { myFormatDate } from '@/helpers/myformat'
import {} from 'vue'
import { fromUnixTime, format, isValid } from 'date-fns'

const props = defineProps({
  modelValue: {
    type: String,
  },
  statuses: {
    type: Object,
    default: () => [],
  },
})
const isValidDate = (date) => isValid(fromUnixTime(date))
const showDate = (date) => format(fromUnixTime(date), 'P')
const showTime = (date) => format(fromUnixTime(date), 'p')
</script>
<style lang="scss" scoped>
ul.timeline {
  position: relative;
  list-style-type: none;
  padding-left: 180px;
}

ul.timeline:before {
  position: absolute;
  display: block;
  left: 136px;
  width: 8px;
  height: 100%;
  border-radius: 4px;
  background-color: #07b;
  content: ' ';
}

ul.timeline .event {
  position: relative;
  padding: 16px;
  background: rgb(255, 255, 255);
  border-radius: 2px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  padding: 16px;
  margin-bottom: 5px;
}

ul.timeline .event:before {
  display: block;
  position: absolute;
  top: 30px;
  left: -55px;
  width: 30px;
  height: 30px;
  border: 6px solid #07b;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 4px -1px rgba(0, 0, 0, 0.6);
  content: ' ';
}

ul.timeline h3 {
  font-size: 1.5em;
  margin-top: 0;
  margin-bottom: 5px;
}

ul.timeline .time {
  position: absolute;
  display: block;
  width: 120px;
  top: 20px;
  left: -179px;
  font-size: 0.9em;
  text-align: right;
  font-weight: 600;
  text-transform: uppercase;
}

ul.timeline .time > .glyphicon-time {
  top: 2px;
}

ul.timeline .left-arrow:before {
  position: absolute;
  top: 30px;
  left: -15px;
  display: inline-block;
  border-top: 15px solid transparent;
  border-right: 15px solid #ddd;
  border-left: 0 solid #ddd;
  border-bottom: 15px solid transparent;
  content: ' ';
}

ul.timeline .left-arrow:after {
  position: absolute;
  top: 30px;
  left: -14px;
  display: inline-block;
  border-top: 15px solid transparent;
  border-right: 15px solid #fff;
  border-left: 0 solid #fff;
  border-bottom: 15px solid transparent;
  content: ' ';
}
</style>
