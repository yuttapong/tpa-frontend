<template></template>
<script>
import { ref, computed, watch } from 'vue';

export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        itemsPerPage: {
            type: Number,
            default: 10
        },
    },
    setup(props) {
        const currentPage = ref(1);

        const pageCount = computed(() =>
            Math.ceil(props.items.length / props.itemsPerPage)
        );

        const pages = computed(() => {
            return Array.from({ length: pageCount.value }, (_, i) => i + 1);
        });

        const displayedItems = computed(() => {
            const startIndex = (currentPage.value - 1) * props.itemsPerPage;
            const endIndex = startIndex + props.itemsPerPage;

            return props.items.slice(startIndex, endIndex);
        });

        function changePage(pageNumber) {
            currentPage.value = pageNumber;
        }

        watch(currentPage, () => {
            //If you want the window to scroll up on page change
            //window.scrollTo({
            //     top: 0,
            //     behavior: 'smooth'
            // });
        });

        return {
            currentPage,
            pageCount,
            pages,
            displayedItems,
            changePage
        };
    }
};
</script>