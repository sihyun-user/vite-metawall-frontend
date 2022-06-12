<template>
  <section class="user-wall" v-if="!isLoading">
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
          <div class="follow__info--btn" v-if="!isCurrentUser">
            <button class="baseYellowBtn" v-if="!isfollowing" @click="handleFollow('follow')">追蹤</button>
            <button class="baseGrayBtn-2" v-else @click="handleFollow('unfollow')">取消追蹤</button>
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
</template>

<script>
import { ref, computed, watch } from 'vue'
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
    const user = ref({})
    const posts = ref([])
    const followers = ref([])
    const isfollowing = ref(false)

    const userId = computed(() => store.getters.userId)
    const isLoading = computed(() => store.getters.isLoading)
    const isCurrentUser = computed(() => userId.value == user.value._id)

    watch(() => route.query, (newVal, oldVal) => {
      if (route.query.userId && oldVal !== newVal) {
        getUserWall()
      }
    })

    // 取得個人動態牆
    async function getUserWall() {
      const user_id = route.query.userId
      const result = await store.dispatch('getUserWall', { user_id })
      user.value = result.user
      posts.value = result.posts
      followers.value = result.user.followers
      isfollowing.value = checkIsfollowing()
    }

    // 追蹤/取消追蹤朋友
    async function handleFollow (mode) {
      const user_id = route.query.userId
      if (mode == 'follow') {
        await store.dispatch('followUser', { user_id })
      } else {
        await store.dispatch('unfollowUser', { user_id })
      }

      getUserWall()
    }

    // 檢查是否有追蹤朋友
    function checkIsfollowing() {
      return followers.value.find(el => el.user._id == userId.value)
    }

    getUserWall()

    return {
      user, posts, followers, isfollowing,
      userId, isLoading, isCurrentUser,
      handleFollow
    }
  }
}
</script>
