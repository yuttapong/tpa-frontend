<template>
    <!-- ======= Header ======= -->
    <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
            <router-link tag="a" to="/" class="logo d-flex align-items-center">
                <img :src="logo" alt="">
                <span class="d-none d-lg-block">AppCAL</span>
            </router-link>
            <i class="bi bi-list toggle-sidebar-btn" @click="toggleSidebar"></i>
        </div><!-- End Logo -->

        <div class="search-bar">
            <form class="search-form d-flex align-items-center" method="POST" @submit.prevent="doSubmit">
                <input type="text" name="query" placeholder="Search" title="Enter search keyword">
                <button type="submit" title="Search"><i class="bi bi-search"></i></button>
            </form>
        </div><!-- End Search Bar -->

        <Navbar />


    </header><!-- End Header -->
</template>
<script setup>
import logo from "@/assets/img/logo.png"
import Navbar from '@/components/layouts/Navbar.vue';


const select = (el, all = false) => {
    el = el.trim()
    if (all) {
        return [...document.querySelectorAll(el)]
    } else {
        return document.querySelector(el)
    }
}

/**
 * Easy event listener function
 */
const on = (type, el, listener, all = false) => {

    if (all) {
        select(el, all).forEach((e) => e.addEventListener(type, listener))
    } else {
        select(el, all)
    }
}

if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
        select('body').classList.toggle('toggle-sidebar')
    })
}

if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function (e) {
        select('.search-bar').classList.toggle('search-bar-show')
    })
}



const toggleSidebar = (ea) => {
    select('body').classList.toggle('toggle-sidebar')
}

const doSubmit = () => {

}

</script>
<style lang="scss" scoped>
/*--------------------------------------------------------------
  # Header
  --------------------------------------------------------------*/
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
    color: #012970;
    font-family: 'Nunito', sans-serif;
}

.header {
    transition: all 0.5s;
    z-index: 997;
    height: 60px;
    box-shadow: 0px 2px 20px rgba(1, 41, 112, 0.1);
    background-color: #fff;
    padding-left: 20px;
    /* Toggle Sidebar Button */
    /* Search Bar */
}

.header .toggle-sidebar-btn {
    font-size: 32px;
    padding-left: 10px;
    cursor: pointer;
    color: #012970;
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
    color: #012970;
    margin-right: 25px;
    position: relative;
}

.header-nav .nav-profile {
    color: #012970;
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