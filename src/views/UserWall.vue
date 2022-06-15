<template>
  <section v-if="!isLoading" class="user-wall">
    <!-- 追蹤資訊 -->
    <div class="follow">
      <div class="follow__content follow__info">
        <div class="follow__info--photo">
          <base-userPhoto :user-photo="user.photo"></base-userPhoto>
        </div>
        <div class="follow__info--wrap">
          <div class="follow__info--user">
            <h3>{{ user.name }}</h3>
            <div class="follow__info--row">
              <span>{{ posts.length }} 貼文</span>
              <span @click="handleShow('followers')">{{ followers.length }} 粉絲</span>
              <span @click="handleShow('following')">{{ following.length }} 追蹤</span>
            </div>
          </div>
          <div v-if="!isCurrentUser" class="follow__info--btn">
            <button v-if="!isfollowing" class="baseYellowBtn" @click="handleFollow('follow')">追蹤</button>
            <button v-else class="baseGrayBtn-2" @click="handleFollow('unfollow')">取消追蹤</button>
          </div>
        </div>
      </div>
      <div class="follow__bg"></div>
    </div>
    <!-- 貼文 -->
    <div v-if="posts && posts.length==0" class="no-info">目前尚無動態，新增一則貼文吧！</div>
    <section v-else>
      <post-filter class="filter"></post-filter>
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
    <!-- lightBox -->
    <base-lightBox v-if="isShow" :title="swtchLightBoxTitle" @close="handleClose">
      <my-followList v-if="mode =='followers'" :follows="followers" :select="'followers'"></my-followList>
      <my-followList v-if="mode =='following'" :follows="following" :select="'following'"></my-followList>
    </base-lightBox>
  </section>
  <base-spinner v-else></base-spinner>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import BaseLightBox from '../components/ui/BaseLightBox.vue'
import BaseUserPhoto from '../components/ui/BaseUserPhoto.vue'
import PostItem from '../components/PostItem.vue'
import PostFilter from '../components/PostFilter.vue'
import myFollowList from '../components/myFollowList.vue'
export default {
  components: {
    PostItem,
    PostFilter, 
    BaseUserPhoto,
    BaseLightBox,
    myFollowList
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const isfollowing = ref(false)
    const isShow = ref(false)
    const mode = ref('followers')
    const user = ref({})
    const posts = ref([])
    const followers = ref([])
    const following = ref([])


    const userId = computed(() => store.getters.userId)
    const isLoading = computed(() => store.getters.isLoading)
    const isCurrentUser = computed(() => userId.value == user.value._id)
    const swtchLightBoxTitle = computed(() => {
      if (mode.value == 'followers') {
        return '粉絲'
      }
      return '追蹤'
    })

    watch(() => route.query, (newVal, oldVal) => {
      if (route.query.userId && oldVal !== newVal) {
        isShow.value = false
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
      following.value = result.user.following
      isfollowing.value = checkIsfollowing()
    }

    // 追蹤/取消追蹤朋友
    async function handleFollow (val) {
      const user_id = route.query.userId
      if (val == 'follow') {
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

    function handleShow (modeVal) {
      isShow.value = true
      mode.value = modeVal
    }

    function handleClose() {
      isShow.value = false
    }

    getUserWall()

    return {
      isShow,
      mode,
      user, 
      posts, 
      followers,
      following,
      isfollowing,
      userId, 
      isLoading, 
      isCurrentUser,
      swtchLightBoxTitle,
      handleFollow,
      handleShow,
      handleClose,
    }
  }
}
</script>
