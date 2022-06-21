<template>
  <section v-if="!isLoading" class="posts-wall">
    <base-card v-if="posts && posts.length==0" class="no-info">目前尚無動態，新增一則貼文吧！</base-card>
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
          :show-comments="false"
          @change-likes="changePostLikes"
          @change-comments="changePostComments"
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
import BaseCard from '../components/ui/BaseCard.vue'
import useChangePost from '../hooks/changePost.js'
export default {
  components: {
    PostItem, 
    PostFilter,
    BaseCard
  },
  setup () {
    const store = useStore()
    const posts = ref([])
    let sort = {
      timeSort: 'desc',
      content: ''
    }

    const { changeLikes, changeComments } = useChangePost()
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

    // 更新貼文的讚(同步更新DOM)
    function changePostLikes (newData) {
      changeLikes(posts.value, newData)
    }

    // 更新貼文的留言(同步更新DOM)
    function changePostComments (newData) {
      changeComments(posts.value, newData)
    }

    getPosts()

    return {
      posts,
      isLoading,
      searchPosts,
      changePostLikes,
      changePostComments
    }
  }
}
</script>
