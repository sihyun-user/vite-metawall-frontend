<template>
  <section class="user-wall">
    <section v-if="!isLoading">
      <div class="follow">
        <div class="follow__content follow__info">
          <div class="follow__info--photo">
            <!-- <base-userPhoto :userPhoto="userInfo.photo"></base-userPhoto> -->
          </div>
          <div class="follow__info--wrap">
            <div class="follow__info--user">
              <h3>工程師皮卡</h3>
              <span>987,987 人追蹤</span>
            </div>
            <div class="follow__info--btn">
              <!-- <button class="baseYellowBtn">追蹤</button> -->
              <button class="baseGrayBtn-2">取消追蹤</button>
            </div>
          </div>
        </div>
        <div class="follow__bg"></div>
      </div>
      <div class="no-post" v-if="posts && posts.length==0">目前尚無動態，新增一則貼文吧！</div>
      <section v-else>
        <post-filter class="filter"></post-filter>
        <post-card  v-for="post in posts"
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
  </section>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import PostFilter from '../components/PostFilter.vue'
import BaseUserPhoto from '../components/ui/BaseUserPhoto.vue'
export default {
  components: {
    PostCard,
    PostFilter, 
    BaseUserPhoto
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const posts = ref([])

    const isLoading = computed(() => store.getters.isLoading)

    // const currentUser = computed(() => posts)

    async function getUserPosts() {
      const userId = route.query.userId
      const result = await store.dispatch('getUserPosts', { userId })
      posts.value = result
    }

    // async function getUserInfo() {
    //   const result = await store.dispatch('getUserInfo')

    //   console.log(result)
    // }

    getUserPosts()

    return {
      posts,
      isLoading
    }
  }
}
</script>
