<template>
  <nav class="header-nav ms-auto">
    <ul class="d-flex align-items-center">
      <li class="nav-item d-block d-xl-none">
        <a class="nav-link nav-icon search-bar-toggle" role="button" href="javascript:void(0)">
          <i class="bi bi-search"></i>
        </a>
      </li>
      <!-- End Search Icon-->

      <li class="nav-item dropdown">
        <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
          <i class="bi bi-bell"></i>
          <span class="badge bg-primary badge-number">4</span> </a><!-- End Notification Icon -->

        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
          <li class="dropdown-header">
            You have 4 new notifications
            <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="notification-item">
            <i class="bi bi-exclamation-circle text-warning"></i>
            <div>
              <h4>Lorem Ipsum</h4>
              <p>Quae dolorem earum veritatis oditseno</p>
              <p>30 min. ago</p>
            </div>
          </li>

          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="notification-item">
            <i class="bi bi-x-circle text-danger"></i>
            <div>
              <h4>Atque rerum nesciunt</h4>
              <p>Quae dolorem earum veritatis oditseno</p>
              <p>1 hr. ago</p>
            </div>
          </li>

          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="notification-item">
            <i class="bi bi-check-circle text-success"></i>
            <div>
              <h4>Sit rerum fuga</h4>
              <p>Quae dolorem earum veritatis oditseno</p>
              <p>2 hrs. ago</p>
            </div>
          </li>

          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="notification-item">
            <i class="bi bi-info-circle text-primary"></i>
            <div>
              <h4>Dicta reprehenderit</h4>
              <p>Quae dolorem earum veritatis oditseno</p>
              <p>4 hrs. ago</p>
            </div>
          </li>

          <li>
            <hr class="dropdown-divider" />
          </li>
          <li class="dropdown-footer">
            <a href="#">Show all notifications</a>
          </li>
        </ul>
        <!-- End Notification Dropdown Items -->
      </li>
      <!-- End Notification Nav -->

      <li class="nav-item dropdown">
        <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
          <i class="bi bi-chat-left-text"></i>
          <span class="badge bg-success badge-number">3</span> </a><!-- End Messages Icon -->

        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
          <li class="dropdown-header">
            You have 3 new messages
            <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="message-item">
            <a href="#">
              <img :src="message1" alt="" class="rounded-circle" />
              <div>
                <h4>Maria Hudson</h4>
                <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                <p>4 hrs. ago</p>
              </div>
            </a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="message-item">
            <a href="#">
              <img :src="message2" alt="" class="rounded-circle" />
              <div>
                <h4>Anna Nelson</h4>
                <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                <p>6 hrs. ago</p>
              </div>
            </a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="message-item">
            <a href="#">
              <img :src="message3" alt="" class="rounded-circle" />
              <div>
                <h4>David Muldon</h4>
                <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                <p>8 hrs. ago</p>
              </div>
            </a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>

          <li class="dropdown-footer">
            <a href="#">Show all messages</a>
          </li>
        </ul>
        <!-- End Messages Dropdown Items -->
      </li>
      <!-- End Messages Nav -->

      <template v-if="appStore.isLoggedIn()">
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <img :src="profile" alt="Profile" class="rounded-circle" />
            <span class="d-none d-md-block dropdown-toggle ps-2">{{ user?.name }}</span>
          </a><!-- End Profile Iamge Icon -->

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <template v-if="appStore.isLoggedIn()">

              <li class="dropdown-header">
                <h6>{{ user?.name }}</h6>
                <span>{{ user?.level }}</span>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <router-link class="dropdown-item d-flex align-items-center" to="profile">
                  <i class="bi bi-person"></i>
                  <span>โปรไฟล์</span>
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
            </template>


            <!-- <li>
            <router-link class="dropdown-item d-flex align-items-center" to="/profile?t=setting">
              <i class="bi bi-gear"></i>
              <span>Account Settings</span>
            </router-link>
          </li> -->
            <li>
              <hr class="dropdown-divider" />
            </li>

            <!-- <li>
            <a class="dropdown-item d-flex align-items-center" href="pages-faq.html">
              <i class="bi bi-question-circle"></i>
              <span>Need Help?</span>
            </a>
          </li> -->
            <li>
              <hr class="dropdown-divider" />
            </li>

            <li v-if="!appStore.isLoggedIn()">
              <router-link class="dropdown-item d-flex align-items-center" to="/login">
                <i class="bi bi-unlock"></i>
                <span>เข้าสู่ระบบ</span>
              </router-link>
            </li>
            <li v-else>
              <a class="dropdown-item d-flex align-items-center" href="javascription:void()" @click="doLogout()">
                <i class="bi bi-box-arrow-right"></i>
                <span>ออกจากระบบ</span>
              </a>
            </li>
          </ul>
          <!-- End Profile Dropdown Items -->
        </li>
        <!-- End Profile Nav -->
      </template>
      <template v-else>
        <!-- <li class="nav-item">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">

            <span class="d-none d-md-block dropdown-toggle ps-2">{{ user?.name }}</span>
          </a>
        </li> -->
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/login">
            <i class="bi bi-unlock"></i>
            <span>เข้าสู่ระบบ</span>
          </router-link>
        </li>
      </template>
    </ul>
  </nav>
  <!-- End Icons Navigation -->
</template>
<script setup>
import '@/assets/js/layout.js'
import { onMounted, computed, ref } from 'vue'
import { on, select } from '@/helpers/layout'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
defineProps({
  name: {
    type: String,
    default: '',
  },
})

import profile from '@/assets/img/profile-img.jpg'
import message1 from '@/assets/img/messages-1.jpg'
import message2 from '@/assets/img/messages-2.jpg'
import message3 from '@/assets/img/messages-3.jpg'
import { baseUrl } from '@/config'
import { useAppStore } from '@/stores/appStore'
const appStore = new useAppStore()


const router = useRouter()
const user = computed(() => appStore.user)
const doLogout = () => {
  if (confirm('ต้องการออกจากระบบ ?')) {
    appStore.logout();
    router.replace({ name: "login" })
  }
}
onMounted(() => {
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function (e) {
      console.log('toggle search', new Date().getUTCMilliseconds())
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }
})
</script>
<style lang="scss" scoped>
/*--------------------------------------------------------------
  # Header Nav
  --------------------------------------------------------------*/
.header-nav ul {
  list-style: none;
}

.header-nav>ul {
  margin: 0;
  padding: 0;
}

.header-nav .nav-icon {
  font-size: 22px;
  color: #edf2f8;
  margin-right: 25px;
  position: relative;
}

.header-nav .nav-profile {
  color: #e9e9e9;
}

.header-nav .nav-profile img {
  max-height: 36px;
}

.header-nav .nav-profile span {
  font-size: 14px;
  font-weight: 600;
}

.header-nav .badge-number {
  position: absolute;
  inset: -2px -5px auto auto;
  font-weight: normal;
  font-size: 12px;
  padding: 3px 6px;
}

.header-nav .notifications {
  inset: 8px -15px auto auto !important;
}

.header-nav .notifications .notification-item {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  transition: 0.3s;
}

.header-nav .notifications .notification-item i {
  margin: 0 20px 0 10px;
  font-size: 24px;
}

.header-nav .notifications .notification-item h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.header-nav .notifications .notification-item p {
  font-size: 13px;
  margin-bottom: 3px;
  color: #919191;
}

.header-nav .notifications .notification-item:hover {
  background-color: #f6f9ff;
}

.header-nav .messages {
  inset: 8px -15px auto auto !important;
}

.header-nav .messages .message-item {
  padding: 15px 10px;
  transition: 0.3s;
}

.header-nav .messages .message-item a {
  display: flex;
}

.header-nav .messages .message-item img {
  margin: 0 20px 0 10px;
  max-height: 40px;
}

.header-nav .messages .message-item h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #444444;
}

.header-nav .messages .message-item p {
  font-size: 13px;
  margin-bottom: 3px;
  color: #919191;
}

.header-nav .messages .message-item:hover {
  background-color: #f6f9ff;
}

.header-nav .profile {
  min-width: 240px;
  padding-bottom: 0;
  top: 8px !important;
}

.header-nav .profile .dropdown-header h6 {
  font-size: 18px;
  margin-bottom: 0;
  font-weight: 600;
  color: #444444;
}

.header-nav .profile .dropdown-header span {
  font-size: 14px;
}

.header-nav .profile .dropdown-item {
  font-size: 14px;
  padding: 10px 15px;
  transition: 0.3s;
}

.header-nav .profile .dropdown-item i {
  margin-right: 10px;
  font-size: 18px;
  line-height: 0;
}

.header-nav .profile .dropdown-item:hover {
  background-color: #f6f9ff;
}
</style>
