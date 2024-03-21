<template>
    <div class="table-responsive" v-if="items">
        <table class="table-sm table table-bordered ">
            <thead>
                <tr>
                    <th scope="col" class="fw-bolder text-decoration-underline" nowrap>Code</th>
                    <th scope="col" class="fw-bolder text-decoration-underline" nowrap>Date</th>
                    <th scope="col" class="fw-bolder text-decoration-underline">Contact</th>

                </tr>
            </thead>
            <tbody v-if="items">
                <tr v-for="h in items" :key="h">

                    <td nowrap>{{ h.code }}</td>
                    <td nowrap>{{ h.document_date }}</td>
                    <td> {{ h.agent_name }}</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>
<script setup>
const props = defineProps({
    items: {
        type: Array
    }
})
</script>