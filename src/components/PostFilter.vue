<template>
  <section class="post-filter">
    <div class="post-sort">
      <div class="post-sort-select" @click="switchSort">
        <span>{{ sortCaption }}</span>
        <i class="fa-solid fa-angle-up" v-if="isSort"></i>
        <i class="fa-solid fa-angle-down" v-else></i>
      </div>
      <ul class="post-sort-list" v-if="isSort">
        <li
          :class="{ 'post-sort-list--select': sortType=='desc' }"
          @click="switchSortCaption('desc')"
        >
          <input type="radio" id="desc" v-model="sortType">
          <label for="desc" >最新貼文</label>
        </li>
        <li
          :class="{ 'post-sort-list--select': sortType=='asc' }"
          @click="switchSortCaption('asc')"
        >
          <input type="radio" id="asc" v-model="sortType">
          <label for="asc" >最舊貼文</label>
        </li>
        <!-- <li
          :class="{ 'post-sort-list--select': sortType=='recommend' }"
          @click="switchSortCaption('recommend')"
        >
          <input type="radio" id="recommend" v-model="sortType">
          <label for="recommend" >推薦貼文</label>
        </li> -->
      </ul>
    </div>

    <div class="post-search">
      <input type="text" placeholder="搜尋貼文" v-model="sortContent">
      <button class="post-search__btn" @click="filterPosts">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  </section>
</template>

<script>
import { computed, ref } from 'vue'
export default {
  emits:['filter-posts'],
  setup (_, content) {
    const isSort = ref(false)
    const sortType = ref('desc')
    const sortContent = ref('')

    const sortCaption = computed(() => {
      if (sortType.value === 'desc') {
        return '最新貼文'
      } else if (sortType.value === 'asc') {
        return '最舊貼文'
      }

      return '推薦貼文'
    })

    function switchSort () {
      isSort.value = !isSort.value
    }

    function switchSortCaption (val) {
      isSort.value = false
      sortType.value = val
    }

    function filterPosts () {
      const filterData = {
        timeSort: sortType.value,
        content:  sortContent.value
      }

      sortContent.value = ''
      content.emit('filter-posts', filterData)
    }

    return {
      isSort,
      sortType,
      sortCaption,
      sortContent,
      switchSort,
      switchSortCaption,
      filterPosts
    }
  }
}
</script>
