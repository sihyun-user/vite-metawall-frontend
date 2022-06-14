<template>
  <section class="post-filter">
    <div class="post-sort">
      <div class="post-sort-select" @click="switchSort">
        <span>{{ sortCaption }}</span>
        <i v-if="isSort" class="fa-solid fa-angle-up"></i>
        <i v-else class="fa-solid fa-angle-down"></i>
      </div>
      <ul v-if="isSort" class="post-sort-list">
        <li
          :class="{ 'post-sort-list--select': sortType=='desc' }"
          @click="switchSortCaption('desc')"
        >
          <input id="desc" v-model="sortType" type="radio">
          <label for="desc" >最新貼文</label>
        </li>
        <li
          :class="{ 'post-sort-list--select': sortType=='asc' }"
          @click="switchSortCaption('asc')"
        >
          <input id="asc" v-model="sortType" type="radio">
          <label for="asc" >最舊貼文</label>
        </li>
      </ul>
    </div>

    <div class="post-search">
      <input v-model="sortContent" type="text" placeholder="搜尋貼文">
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
      } 
      return '最舊貼文'
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

      isSort.value = false
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
