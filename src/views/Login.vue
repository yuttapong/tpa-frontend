<template>
  <main>
    <div class="container">
      <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5 d-flex flex-column align-items-center justify-content-center">
              <div class="d-flex justify-content-center py-4">
                <a href="/" class="logo d-flex align-items-center w-auto">
                  <img :src="logo" alt="" />
                  <span class="d-none d-lg-block">TPA AppCAL</span>
                </a>
              </div>
              <!-- End Logo -->

              <div class="card mb-3">
                <div class="card-body">
                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                    <p class="text-center small">Enter your username & password to login</p>
                  </div>
                  <form class="row g-3 needs-validation" novalidate @submit.prevent="login">
                    <div class="col-12">
                      <label for="username" class="form-label">Username</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" name="username" class="form-control" id="username" required
                          v-model="username" />
                        <div class="invalid-feedback">Please enter your username.</div>
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="password" class="form-label">Password</label>
                      <input type="password" name="password" class="form-control" id="password" required
                        v-model="password" />
                      <div class="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div class="col-12">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                        <label class="form-check-label" for="rememberMe">Remember me</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary w-100" type="submit">Login</button>
                    </div>
                    <div class="col-12">
                      <p class="small mb-0">
                        Don't have account?
                        <router-link tag="a" to="register">Create an account</router-link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
  <!-- End #main -->
</template>
<script setup>
import logo from '@/assets/img/logo.png'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref, computed } from 'vue'
import { api } from '@/helpers/api'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import {MyFormatDate} from '@/helpers/myformat'

const appStore = new useAppStore()

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})
const router = useRouter()

const { values, errors, defineField } = useForm(schema)

const username = ref('user_lab_mm')
const password = ref('1234')

const login = (e) => {
  const params = {
    username: username.value,
    password: password.value,
  }
  api
    .post('v1/auth/login', params)
    .then((rs) => {
      console.log(rs.data);
      if (rs.data) {
        const r = rs.data.result
        const ep = r.expire_time
        const token = r.token
        const user = r.user
        const permissions = r.permisions
        const epDay = ep / 24 / 60 / 60 || 0
        appStore.setExpired(epDay)
        appStore.login(token, user, permissions)
        router.replace("/profile")
      }
    })
    .catch((err) => {
      console.log(err)
      if (err.response) {
        const status = err.response.status === 401
        if (status === 401) {
          console.log(err)

        }
      }
    })
}

const nowDat = computed(() => {
  return MyFormatDate(new Date(), {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
})
</script>
