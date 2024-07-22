<template>
  <main>
    <div class="container">
      <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5 d-flex flex-column align-items-center justify-content-center">
              <div class="d-flex justify-content-center py-4">
                <a href="javascript:void(0)" class="logo d-flex align-items-center w-auto">
                  <img src="https://tpacal.or.th/wp-content/uploads/2023/12/Logo-Banner-new-1.jpg" alt="" />

                </a>
              </div>
              <!-- End Logo -->

              <div class="card mb-3">
                <div class="card-body">
                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Login to <span class="text-danger appcal">APPCAL</span>
                    </h5>
                    <p class="text-center small">Enter your username & password to login</p>
                  </div>
                  <form class="row g-3 needs-validation" @submit.prevent="login">
                    <div class="col-12">
                      <label for="username" class="form-label">Username</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text"><i class="bi bi-person-circle"></i></span>
                        <input type="text" name="username" class="form-control" id="username" required v-model="username"
                          placeholder="ชื่อผู้ใช้" />
                        <div class="invalid-feedback">Please enter your username.</div>
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="password" class="form-label">Password</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text"><i class="bi bi-key"></i></span>
                        <input type="password" name="password" class="form-control" id="password" placeholder="รหัสผ่าน"
                          required v-model="password" @keyup.enter="login" />
                        <div class="invalid-feedback">Please enter your password!</div>
                      </div>
                    </div>

                    <!-- <div class="col-12">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                        <label class="form-check-label" for="rememberMe">Remember me</label>
                      </div>
                    </div> -->
                    <div class="col-12">
                      <button class="btn btn-primary w-100" type="submit">เข้าสู่ระบบ</button>
                      <div class="alert alert-danger mt-2" v-if="messageError">{{ messageError }}</div>
                    </div>
                    <!-- <div class="col-12">
                      <p class="small mb-0">
                        Don't have account?
                        <router-link tag="a" to="register">Create an account</router-link>
                      </p>
                    </div> -->
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
import { useRouter, } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { myFormatDate } from '@/helpers/myformat'
// import router from "@/router/index"
const appStore = new useAppStore()

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})

const router = useRouter()
const { values, errors, defineField } = useForm(schema)

const username = ref('')
const password = ref('')
// const username = ref('user_lab_mm')
// const password = ref('1234')
const messageError = ref("")


const login = (e) => {
  messageError.value = ""
  const params = {
    username: username.value,
    password: password.value,
  }

  try {
    api
      .post('v1/auth/login', params)
      .then((rs) => {
        console.log(rs);
        messageError.value = ""
        if (rs) {
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
        console.error(err)

        if (err) {
          const status = err.response.status
          messageError.value = err.response.data.message
          if (status === 401) {


          }
        }
      })

  } catch (error) {
    console.log('error', error);
  }

}

</script>
<style lang="scss" scoped>
.appcal {
  font-size: 2rem;
}
</style>
