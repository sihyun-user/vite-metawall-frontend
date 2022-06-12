<template>
  <section class="posts-wall" v-if="!isLoading">
    <div class="no-post" v-if="posts && posts.length==0">目前尚無動態，新增一則貼文吧！</div>
    <section v-else>
      <post-filter class="filter" @filter-posts='searchPosts'></post-filter>
      <post-card v-for="post in posts"
      :key="post._id"
      :postId="post._id"
      :user="post.user"
      :likes="post.likes"
      :content="post.content"
      :postImage="post.image"
      :comments="post.comments"
      :createdAt="post.createdAt"
      >
      </post-card>
    </section>
  </section>
  <base-spinner v-else></base-spinner>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import PostCard from '../components/PostCard.vue'
import PostFilter from '../components/PostFilter.vue'
export default {
  components: {
    PostCard, PostFilter
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
