<template>
  <!-- ======= Sidebar ======= -->
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li class="nav-item">
        <router-link to="/dashboard" class="nav-link collapsed" href="index.html">
          <i class="bi bi-grid"></i>
          <span>Dashboard {{ width }}</span>
        </router-link>
      </li>
      <!-- End Dashboard Nav -->

      <li class="nav-heading">ระบบงาน</li>

      <li class="nav-item">
        <router-link to="/quotations" class="nav-link collapsed">
          <i class="bi bi-file"></i>
          <span>ใบเสนอราคา</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/bills" class="nav-link collapsed">
          <i class="bi bi-book"></i>
          <span>ใบขอรับบริการ</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/workoders" class="nav-link collapsed">
          <i class="bi bi-star"></i>
          <span>งาน</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/certificates" class="nav-link collapsed">
          <i class="bi bi-check-circle"></i>
          <span>ใบรับรอง</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/invoices" class="nav-link collapsed">
          <i class="bi bi-files"></i>
          <span>ใบแจ้งหนี้</span>
        </router-link>
      </li>
      <li class="nav-heading">ข้อมูล</li>
      <li class="nav-item">
        <router-link to="/data/customers" class="nav-link collapsed">
          <i class="bi bi-people"></i>
          <span>บริษัท/ลูกค้า</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/data/contacts" class="nav-link collapsed">
          <i class="bi bi-person-vcard"></i>
          <span>รายชื่อ/ผู้ติดต่อ</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/data/labs" class="nav-link collapsed">
          <i class="bi bi-people"></i>
          <span>Lab/Sub Lab</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="/data/promotions" class="nav-link collapsed">
          <i class="bi bi-box"></i>
          <span>โปรโมชั่น/ส่วนลด</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/data/products" class="nav-link collapsed">
          <i class="bi bi-box"></i>
          <span>สินค้า/เครื่องมือ</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/data/stdinstruments" class="nav-link collapsed">
          <i class="bi bi-box"></i>
          <span>เครื่องมือมาตรฐาน</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/data/staffs" class="nav-link collapsed">
          <i class="bi bi-person-circle"></i>
          <span>ผู้ใช้/พนักงาน</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/data/company" class="nav-link collapsed">
          <i class="bi bi-person-circle"></i>
          <span>องค์กร</span>
        </router-link>
      </li>
      <li class="nav-heading">สำหรับผู้ดูแลระบบ</li>
      <li class="nav-item">
        <router-link to="/setting/staff" class="nav-link collapsed">
          <i class="bi bi-gear"></i>
          <span>ผู้ใช้งานระบบ</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/setting/permission" class="nav-link collapsed">
          <i class="bi bi-gear"></i>
          <span>บทบาท && สิทธิ์</span>
        </router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#setting-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-gear"></i>
          <span>ตั้งค่า</span>
        </a>
        <ul id="setting-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
          <li class="nav-item">
            <router-link to="/setting/staff" class="nav-link collapsed">
              <i class="bi bi-gear"></i>
              <span>ผู้ใช้งานระบบ</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/setting/permission" class="nav-link collapsed">
              <i class="bi bi-gear"></i>
              <span>Role && Permission</span>
            </router-link>
          </li>
        </ul>
      </li>
      <li class="nav-heading">Pages</li>
      <li class="nav-item">
        <router-link to="register" class="nav-link collapsed">
          <i class="bi bi-card-list"></i>
          <span>Register</span>
        </router-link>
      </li>
      <!-- End Register Page Nav -->

      <li class="nav-item" v-if="!appStore.isLoggedIn">
        <router-link to="/login" class="nav-link collapsed">
          <i class="bi bi-box-arrow-in-right"></i>
          <span>เข้าสู่ระบบ</span>
        </router-link>
      </li>
      <!-- End Login Page Nav -->
      <li class="nav-item" v-if="!appStore.isLoggedIn">
        <router-link to="/profile" class="nav-link collapsed">
          <i class="bi bi-person-lines-fill"></i>
          <span>โปร์ไฟล์</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/error403" class="nav-link collapsed">
          <i class="bi bi-dash-circle"></i>
          <span>Error 403</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/error404" class="nav-link collapsed">
          <i class="bi bi-dash-circle"></i>
          <span>Error 404</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/error500" class="nav-link collapsed">
          <i class="bi bi-dash-circle"></i>
          <span>Error 500</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="blank" class="nav-link collapsed">
          <i class="bi bi-file-earmark"></i>
          <span>Blank</span>
        </router-link>
      </li>
      <!-- End Blank Page Nav -->
    </ul>
  </aside>
  <!-- End Sidebar-->
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { on, select } from '@/helpers/layout'
import { useAppStore } from '@/stores/appStore'
const appStore = new useAppStore()

let windowWidth = ref(window.innerWidth)

const width = computed(() => windowWidth.value)
onMounted(() => {
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth
  })

  if (width.value <= 1199) {
    on(
      'click',
      '.nav-link',
      function () {
        select('body').classList.remove('toggle-sidebar')
      },
      true,
    )
    on(
      'click',
      '#main',
      function () {
        select('body').classList.remove('toggle-sidebar')
      },
      true,
    )
  }
})
</script>
<style lang="scss" scoped>
/*--------------------------------------------------------------
  # Sidebar
  --------------------------------------------------------------*/
.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 300px;
  z-index: 996;
  transition: all 0.3s;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #aab7cf transparent;
  box-shadow: 0px 0px 20px rgba(1, 41, 112, 0.1);
  background-color: #024d79;
}

@media (max-width: 1199px) {
  .sidebar {
    left: -300px;
  }
}

.sidebar::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #ffffff;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #aab7cf;
}

@media (min-width: 1200px) {

  #main,
  #footer {
    margin-left: 300px;
  }
}

@media (max-width: 1199px) {
  .toggle-sidebar .sidebar {
    left: 0;
  }
}

@media (min-width: 1200px) {

  .toggle-sidebar #main,
  .toggle-sidebar #footer {
    margin-left: 0;
  }

  .toggle-sidebar .sidebar {
    left: -300px;
  }
}

.sidebar-nav {
  padding: 0;
  margin: 0;
  list-style: none;
}

.sidebar-nav li {
  padding: 0;
  margin: 0;
  list-style: none;
}

.sidebar-nav .nav-item {
  margin-bottom: 1px;
  // background: #f6f9ff;
}

.sidebar-nav .nav-heading {
  font-size: 16px;
  text-transform: uppercase;
  color: #09f7cf;
  font-weight: 600;
  margin: 10px 0 5px 15px;
}

.sidebar-nav .nav-link {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #ecebdec4;
  transition: 0.3;
  background: none;
  padding: 5px 10px;
  border-radius: 4px;
}

.sidebar-nav .nav-link i {
  font-size: 16px;
  margin-right: 10px;
  color: #ecebdec4;
}

.sidebar-nav .nav-link.collapsed {
  color: #f3f3f3;
  background: none;
}

.sidebar-nav .nav-link.collapsed i {
  color: #f3f3f3;
}

.sidebar-nav .nav-link:hover {
  color: #f5f2f2;
  background: #044da0;
}

.sidebar-nav .nav-link:hover i {
  color: #f5f2f2;
}

.sidebar-nav .nav-link .bi-chevron-down {
  margin-right: 0;
  transition: transform 0.2s ease-in-out;
}

.sidebar-nav .nav-link:not(.collapsed) .bi-chevron-down {
  transform: rotate(180deg);
}

.sidebar-nav .nav-content {
  padding: 5px 0 0 0;
  margin: 0;
  list-style: none;
}

.sidebar-nav .nav-content a {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #012970;
  transition: 0.3;
  padding: 5px 0 5px 35px;
  transition: 0.3s;
}

.sidebar-nav .nav-content a i {
  font-size: 12px;
  margin-right: 8px;
  line-height: 0;
  border-radius: 50%;
}

.sidebar-nav .nav-content a:hover,
.sidebar-nav .nav-content a.active {
  color: #d5d8f0;
}

.sidebar-nav .nav-content a.active i {
  background-color: #4154f1;
}
</style>
