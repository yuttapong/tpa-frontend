<template>
    <main>
        <div class="container">

            <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>500</h1>
                <h2>Internal Server Error</h2>
                <router-link class="btn" to="/">Back to home</router-link>
                <img :src="notfound" class="img-fluid py-5" alt="Page Not Found">

            </section>
        </div>
    </main>

    <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i
            class="bi bi-arrow-up-short"></i></a>
</template>
<script setup>
import notfound from "@/assets/img/not-found.svg"
</script>