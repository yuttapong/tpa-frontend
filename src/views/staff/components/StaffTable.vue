<template>
    <div class="table-responsive">
        <table class="table table-sm table-hover">
            <thead>
                <tr>
                    <th scope="col" class="fw-bold text-decoration-underline">ID</th>
                    <th scope="col" class="fw-bold text-decoration-underline">Code</th>

                    <th scope="col" class="fw-bold text-decoration-underline">Name</th>
                    <th scope="col" class="fw-bold text-decoration-underline">Username</th>
                    <th scope="col" class="fw-bold text-decoration-underline">Level</th>
                    <th scope="col" class="fw-bold text-decoration-underline">Created</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <th scope="row">{{ item.id }}</th>
                    <td>{{ item.code }}</td>

                    <td>
                        <a class="text-primary" role="button" @click="showStaff(item)">
                            {{ `${item.name_th} ${item.lastname_th}` }}<br />
                        </a>


                    </td>
                    <td>{{ item.username }}</td>
                    <td>{{ item.level }}</td>
                    <td>
                        <span class="badge bg-light text-dark">{{
                            myFormatDate(new Date(item.date_starts))
                        }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { } from 'vue';
import { myFormatDate } from '@/helpers/myformat';
const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    onView: {
        type: Function
    }
})
const emit = defineEmits(['onView'])
const showStaff = (item) => emit("onView", item)

</script>