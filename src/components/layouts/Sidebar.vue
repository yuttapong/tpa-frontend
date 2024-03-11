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
          <i class="bi bi-person"></i>
          <span>Profile</span>
        </router-link>
      </li><!-- End Profile Page Nav -->

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


</script>