<template>
  <section class="user-wall">
    <section v-if="!isLoading">
      <div class="follow">
        <div class="follow__content follow__info">
          <div class="follow__info--photo">
            <base-userPhoto :userPhoto="user.photo"></base-userPhoto>
          </div>
          <div class="follow__info--wrap">
            <div class="follow__info--user">
              <h3>{{ user.name }}</h3>
              <span>{{ followers.length }} 人追蹤</span>
            </div>
            <div class="follow__info--btn" v-if="userId !== user._id">
              <button class="baseYellowBtn" v-if="!isfollowing">追蹤</button>
              <button class="baseGrayBtn-2" v-else>取消追蹤</button>
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
import { ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
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
    const router = useRouter()
    const user = ref({})
    const posts = ref([])
    const followers = ref({})
    const isfollowing = ref(false)

    const userId = computed(() => store.getters.userId)
    const isLoading = computed(() => store.getters.isLoading)

    watch(() => user.value, (val) => {
      followers.value = val.followers

      // 檢查是否是追蹤對象
      for(let i = 0; i < val.followers.length; i++) {
        if (val.followers[i].user._id == userId.value) {
          isfollowing.value = true
          break
        }

        isfollowing.value = false
      }
    }, {deep: true})

    // 取得個人動態牆
    async function getUserWall() {
      const userId = route.query.userId
      const result = await store.dispatch('getUserWall', { userId })
      user.value = result.user
      posts.value = result.posts
    }

    // 追蹤
    

    getUserWall()

    return {
      user,
      posts,
      userId, 
      isLoading,
      followers,
      isfollowing
    }
  }
}
</script>
