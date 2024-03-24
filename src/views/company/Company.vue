<template>
  <div class="pagetitle">
    <h1>บริษัท</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link tag="a" to="/dashboard">Home</router-link></li>
        <li class="breadcrumb-item">ข้อมูล</li>
        <li class="breadcrumb-item active">บริษัท</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section company">
    <spinner :visible="loading" />
    <!-- Default Tabs -->
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="department-tab"
          data-bs-toggle="tab"
          data-bs-target="#department"
          type="button"
          role="tab"
          aria-controls="department"
          aria-selected="true"
        >
          แผนก
        </button>
      </li>
      <li class="nav-item" role="presentation" :class="{ active: activeTab == 'position' }">
        <button
          class="nav-link"
          id="position-tab"
          data-bs-toggle="tab"
          data-bs-target="#position"
          type="button"
          role="tab"
          aria-controls="position"
          aria-selected="false"
        >
          ตำแหน่งงาน
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="contact-tab"
          data-bs-toggle="tab"
          data-bs-target="#contact"
          type="button"
          role="tab"
          aria-controls="contact"
          aria-selected="false"
        >
          Contact
        </button>
      </li>
    </ul>
    <div class="tab-content pt-2" id="companyTabContent">
      <div
        class="tab-pane show active fade"
        id="department"
        role="tabpanel"
        aria-labelledby="department-tab"
      >
        <div v-if="departments">
          <Departments :items="departments" />
        </div>
      </div>
      <div class="tab-pane fade" id="position" role="tabpanel" aria-labelledby="position-tab">
        <div v-if="positions">
          <Positions :items="positions" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { api } from '@/helpers/api'
import Spinner from '@/components/Spinner.vue'
import Departments from './components/Departments.vue'
import Positions from './components/Positions.vue'
import { useRoute } from 'vue-router'

const positions = ref([])
const departments = ref({})
const loading = ref(true)
const route = useRoute()
const activeTab = ref(route.query.t || 'deparment')
const loadDepartments = async () => {
  const { data } = await api.get('/v2/company/departments')

  departments.value = data
  loading.value = false
}
const loadPositions = async () => {
  const { data } = await api.get('/v2/company/positions')

  positions.value = data
  loading.value = false
}
loadDepartments()
loadPositions()
onMounted(() => {
  console.log('tab', activeTab)
})
</script>
<style lang="scss" scoped>
#companyTabContent {
  height: 600px;
  overflow: scroll;
}
</style>
