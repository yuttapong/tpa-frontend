<template>
  <!-- ======= Sidebar ======= -->
  <aside id="sidebar" class="sidebar">

    <ul class="sidebar-nav" id="sidebar-nav">

      <li class="nav-item">
        <router-link to="/dashboard" class="nav-link " href="index.html">
          <i class="bi bi-grid"></i>
          <span>Dashboard</span>
        </router-link>
      </li><!-- End Dashboard Nav -->



      <li class="nav-heading">Pages</li>

      <li class="nav-item">
        <router-link to="/profile" class="nav-link collapsed">
          <i class="bi bi-person-lines-fill"></i>
          <span>Profile</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/customers" class="nav-link collapsed">
          <i class="bi bi-people"></i>
          <span>Customers</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/contacts" class="nav-link collapsed">
          <i class="bi bi-person-vcard"></i>
          <span>Contacts</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/quotations" class="nav-link collapsed">
          <i class="bi bi-file"></i>
          <span>Quotations</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/bills" class="nav-link collapsed">
          <i class="bi bi-file"></i>
          <span>Bills</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/Products" class="nav-link collapsed">
          <i class="bi bi-star"></i>
          <span>Products</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/staffs" class="nav-link collapsed">
          <i class="bi bi-person-circle"></i>
          <span>Staffs</span>
        </router-link>
      </li>

      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#setting-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-gear"></i>
          <span>Settings</span>
        </a>
        <ul id="setting-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li class="nav-item">
            <router-link to="/setting/staff" class="nav-link collapsed">
              <i class="bi bi-gear"></i>
              <span>Staff</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/setting/permission" class="nav-link collapsed">
              <i class="bi bi-gear"></i>
              <span>Role && Permission</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/setting/product" class="nav-link collapsed">
              <i class="bi bi-gear"></i>
              <span>Product</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/setting/stdinstrument" class="nav-link collapsed">
              <i class="bi bi-gear"></i>
              <span>Standard Instrument</span>
            </router-link>
          </li>

        </ul>
      </li>

      <li class="nav-item">
        <router-link to="register" class="nav-link collapsed">
          <i class="bi bi-card-list"></i>
          <span>Register</span>
        </router-link>
      </li><!-- End Register Page Nav -->

      <li class="nav-item">
        <router-link tag="a" to="/login" class="nav-link collapsed">
          <i class="bi bi-box-arrow-in-right"></i>
          <span>Login</span>
        </router-link>
      </li>
      <!-- End Login Page Nav -->

      <li class="nav-item">
        <router-link tag="a" to="/error403" class="nav-link collapsed">
          <i class="bi bi-dash-circle"></i>
          <span>Error 403</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link tag="a" to="/error404" class="nav-link collapsed">
          <i class="bi bi-dash-circle"></i>
          <span>Error 404</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link tag="a" to="/error500" class="nav-link collapsed">
          <i class="bi bi-dash-circle"></i>
          <span>Error 500</span>
        </router-link>
      </li>


      <li class="nav-item">
        <router-link to="blank" class="nav-link collapsed">
          <i class="bi bi-file-earmark"></i>
          <span>Blank</span>
        </router-link>
      </li><!-- End Blank Page Nav -->

    </ul>

  </aside><!-- End Sidebar-->
</template>
<script setup>
import { onMounted } from 'vue';
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
onMounted(() => {
  // on('click', '.nav-link', function (e) {
  //   select('body').classList.toggle('toggle-sidebar')
  // }, true)
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
  background-color: #fff;
}

@media (max-width: 1199px) {
  .sidebar {
    left: -300px;
  }
}

.sidebar::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #fff;
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
  margin-bottom: 5px;
}

.sidebar-nav .nav-heading {
  font-size: 11px;
  text-transform: uppercase;
  color: #899bbd;
  font-weight: 600;
  margin: 10px 0 5px 15px;
}

.sidebar-nav .nav-link {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #4154f1;
  transition: 0.3;
  background: #f6f9ff;
  padding: 10px 15px;
  border-radius: 4px;
}

.sidebar-nav .nav-link i {
  font-size: 16px;
  margin-right: 10px;
  color: #4154f1;
}

.sidebar-nav .nav-link.collapsed {
  color: #012970;
  background: #fff;
}

.sidebar-nav .nav-link.collapsed i {
  color: #899bbd;
}

.sidebar-nav .nav-link:hover {
  color: #4154f1;
  background: #f6f9ff;
}

.sidebar-nav .nav-link:hover i {
  color: #4154f1;
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
  padding: 10px 0 10px 40px;
  transition: 0.3s;
}

.sidebar-nav .nav-content a i {
  font-size: 6px;
  margin-right: 8px;
  line-height: 0;
  border-radius: 50%;
}

.sidebar-nav .nav-content a:hover,
.sidebar-nav .nav-content a.active {
  color: #4154f1;
}

.sidebar-nav .nav-content a.active i {
  background-color: #4154f1;
}
</style>