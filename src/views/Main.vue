<template>
    <Header />
    <Sidebar />
    <main>
        <RouterView />
    </main>
    <Footer />
</template>
<script setup>
import Sidebar from '@/components/layouts/Sidebar.vue';
import Footer from '@/components/layouts/Footer.vue';
import Header from '@/components/layouts/Header.vue';
</script>