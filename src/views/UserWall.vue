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
    <base-card v-if="posts && posts.length == 0" class="no-info">
      目前尚無動態，新增一則貼文吧！
    </base-card>
    <section v-else>
      <post-filter class="filter" @filter-posts='searchPosts'></post-filter>
      <div v-for="post in posts" :key="post._id" class="postCard">
        <post-item
          :user="user"
          :post-id="post._id"
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
    <base-lightBox v-if="isShow" 
      :title="swtchLightBoxTitle" 
      @close="handleClose"
      class="userWall-lightBox"
    >
      <my-followList v-if="mode =='followers'" :follows="followers" :select="'followers'"></my-followList>
      <my-followList v-if="mode =='following'" :follows="following" :select="'following'"></my-followList>
    </base-lightBox>
  </section>
  <base-spinner v-else></base-spinner>
</template>

<script>
import { ref, reactive, computed, watch, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseUserPhoto from '../components/ui/BaseUserPhoto.vue'
import BaseLightBox from '../components/ui/BaseLightBox.vue'
import PostItem from '../components/PostItem.vue'
import PostFilter from '../components/PostFilter.vue'
import myFollowList from '../components/myFollowList.vue'
export default {
  components: {
    BaseCard,
    BaseUserPhoto,
    BaseLightBox,
    PostItem,
    PostFilter,
    myFollowList
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const isfollowing = ref(false)
    const isShow = ref(false)
    const mode = ref('followers')
    const posts = ref([])
    const user = reactive({
      _id: '',
      name: '',
      photo: '',
      followers: [],
      following: [],
    })
    let sort = {
      timeSort: 'desc',
      content: '',
      userId: ''
    }

    const { followers, following } = toRefs(user)

    const userId = computed(() => store.getters.userId)
    const isLoading = computed(() => store.getters.isLoading)
    const isCurrentUser = computed(() => userId.value == user._id)
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
      const { _id, name, photo, followers, following } = result.user
      user._id = _id 
      user.name = name
      user.photo = photo
      user.followers = followers
      user.following = following
      posts.value = result.posts
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

    // 搜尋貼文
    function searchPosts (val) {
      sort = {...val}
      sort.userId = route.query.userId
      getPosts()
    }

    // 取得貼文列表
    async function getPosts () {
      const result = await store.dispatch('getPosts', sort)
      posts.value = result
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
      searchPosts,
      handleShow,
      handleClose,
    }
  }
}
</script>
