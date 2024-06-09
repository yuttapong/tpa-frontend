<template>
    <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li v-for="(page,key) in pages" class="page-item" :key="key">
        <a class="page-link" @click="changePage(page)">{{page}}</a></li>

    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
  {{ itemsPerPage
   }}
</nav>
</template>
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
        page: {
            type: Number,
            default: 1
        },
        pageCount: {
            type: Number,
            default: 1
        },
        change: {
            type: Function
        }
    },
    setup(props) {
        const currentPage = ref(props.page);

        const pageCount = computed(() =>
            Math.ceil(props.pageCount / props.itemsPerPage)
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
            props.change(currentPage.value)
        }

        watch(currentPage, () => {
           props.change(currentPage.value)
           console.log('pageChange', currentPage.value);
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