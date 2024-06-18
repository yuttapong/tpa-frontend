<template>
  <!-- ======= Header ======= -->
  <header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between">
      <router-link to="/" class="logo d-flex align-items-center">
        <img :src="logo" alt="" />
        <span class="d-none d-lg-block">สัญญาจะซื้อจะขาย+</span>
      </router-link>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div>
    <!-- End Logo -->

    <div class="search-bar">
      <form class="search-form d-flex align-items-center" method="POST" @submit.prevent="doSubmit">
        <input type="search" v-model="q" placeholder="ค้นหา" title="Enter search keyword" />
        <button type="submit" title="Search"><i class="bi bi-search"></i></button>
      </form>
    </div>
    <!-- End Search Bar -->

    <Navbar />
  </header>
  <!-- End Header -->
</template>
<script setup>
import { onMounted, ref } from 'vue'
import logo from '@/assets/img/logo.png'
import Navbar from '@/components/layouts/Navbar.vue'
import { on, select } from '@/helpers/layout'

const q = ref('')

const doSubmit = () => {
  console.log('search', q.value)
}

const toggleSidebar = (e) => {
  select('body').classList.toggle('toggle-sidebar')
}

onMounted(() => {
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
      toggleSidebar()
    })
  }
})
</script>
<style lang="scss" scoped>
.logo {
  line-height: 1;
}

@media (min-width: 1200px) {
  .logo {
    width: 280px;
  }
}

.logo img {
  max-height: 26px;
  margin-right: 6px;
}

.logo span {
  font-size: 26px;
  font-weight: 700;
  color: #09f0e4;
  font-family: 'Nunito', sans-serif;
}

.header {
  transition: all 0.5s;
  z-index: 997;
  height: 60px;
  //   box-shadow: 0px 2px 20px rgba(97, 150, 241, 0.1);
  background-color: #051a5e;
  padding-left: 20px;
  //   border-bottom: solid 2px #2790cf;
  box-shadow: 0px 3px 10px 3px rgba(10, 103, 179, 0.644) //   -webkit-box-shadow: 2px 8px 5px 2px rgba(67, 144, 214, 0.5);
    //   -moz-box-shadow: 2px 8px 5px 2px rgba(67, 144, 214, 0.5);
    /* Toggle Sidebar Button */
    /* Search Bar */
}

.header .toggle-sidebar-btn {
  font-size: 32px;
  padding-left: 10px;
  cursor: pointer;
  color: #ffffff;
  //   color: #012970;
}

.header .search-bar {
  min-width: 360px;
  padding: 0 20px;
}

@media (max-width: 1199px) {
  .header .search-bar {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    padding: 20px;
    box-shadow: 0px 0px 15px 0px rgba(1, 41, 112, 0.1);
    background: white;
    z-index: 9999;
    transition: 0.3s;
    visibility: hidden;
    opacity: 0;
  }

  .header .search-bar-show {
    top: 60px;
    visibility: visible;
    opacity: 1;
  }
}

.header .search-form {
  width: 100%;
}

.header .search-form input {
  border: 0;
  font-size: 14px;
  color: #012970;
  border: 1px solid rgba(1, 41, 112, 0.2);
  padding: 7px 38px 7px 8px;
  border-radius: 3px;
  transition: 0.3s;
  width: 100%;
}

.header .search-form input:focus,
.header .search-form input:hover {
  outline: none;
  box-shadow: 0 0 10px 0 rgba(1, 41, 112, 0.15);
  border: 1px solid rgba(1, 41, 112, 0.3);
}

.header .search-form button {
  border: 0;
  padding: 0;
  margin-left: -30px;
  background: none;
}

.header .search-form button i {
  color: #012970;
}
</style>
