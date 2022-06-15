<template>
  <section v-if="!isLoading" class="posts-wall">
    <div v-if="posts && posts.length==0" class="no-info">目前尚無動態，新增一則貼文吧！</div>
    <section v-else>
      <post-filter class="filter" @filter-posts='searchPosts'></post-filter>
      <div v-for="post in posts" :key="post._id" class="postCard">
        <post-item
          :post-id="post._id"
          :user="post.user"
          :likes="post.likes"
          :content="post.content"
          :post-image="post.image"
          :comments="post.comments"
          :created-at="post.createdAt"
        >
        </post-item>
      </div>
    </section>
  </section>
  <base-spinner v-else></base-spinner>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import PostItem from '../components/PostItem.vue'
import PostFilter from '../components/PostFilter.vue'
export default {
  components: {
    PostItem, 
    PostFilter
  },
  setup () {
    const store = useStore()
    const posts = ref([])
    let sort = {
      timeSort: 'desc',
      content: ''
    }

    const isLoading = computed(() => store.getters.isLoading)

    // 搜尋貼文
    function searchPosts (val) {
      sort = {...val}
      getPosts()
    }

    // 取得貼文列表
    async function getPosts () {
      const result = await store.dispatch('getPosts', sort)
      posts.value = result
    }

    getPosts()

    return {
      posts,
      isLoading,
      searchPosts
    }
  }
}
</script>
