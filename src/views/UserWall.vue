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
      <div v-for="post in posts" :key="post._id" class="userPost postCard">
        <post-item
          :user="user"
          :post-id="post._id"
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
        <!-- 編輯貼文 -->
        <div v-if="isCurrentUser" class="userPost__details">
          <div class="userPost__details-edit" @click="handleEditPost(post)">
            <i class="fa-solid fa-pen"></i>
            <span>編輯</span>
          </div>
          <span class="userPost__details-delete" @click="deleteOnePost(post)">刪除</span>
        </div>
      </div>
    </section>
    <!-- lightBox -->
    <base-lightBox
      v-if="isShowComments" 
      :title="swtchLightBoxTitle" 
      @close="handleClose"
    >
      <follow-list v-if="mode =='followers'" :follows="followers" select="followers"></follow-list>
      <follow-list v-if="mode =='following'" :follows="following" select="following"></follow-list>
    </base-lightBox>

    <base-lightBox
      v-if="isShowEdit"
      title="編輯貼文" 
      @close="handleClose"
    >
      <upload-post
        action="update"
        :post-id="editPostContent.id"
        :post-content="editPostContent.content" 
        :post-image="editPostContent.image"
        @handle-update="updatePost"
      >
      </upload-post>
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
import FollowList from '../components/FollowList.vue'
import UploadPost from '../components/UploadPost.vue'
export default {
  components: {
    BaseCard,
    BaseUserPhoto,
    BaseLightBox,
    PostItem,
    PostFilter,
    FollowList,
    UploadPost
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const isfollowing = ref(false)
    const isShowEdit = ref(false)
    const isShowComments = ref(false)
    const mode = ref('followers')
    const posts = ref([])
    const editPostContent = reactive({
      id:'',
      content: '',
      image: ''
    })
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
    const swtchLightBoxTitle = computed(() => mode.value == 'followers' ?  '粉絲' : '追蹤')

    watch(() => route.query, (newVal, oldVal) => {
      if (route.query.userId && oldVal !== newVal) {
        handleClose()
        getUserWall()
      }
    })

    watch(isShowEdit, () => store.commit('setErrorMag', null))

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

    // 刪除一則貼文
    async function deleteOnePost (postData) {
      const reault = await store.dispatch('deleteOnePost', { 
        postId: postData._id,
      })

      if(!reault) return
      getUserWall()
    }

    // 取得當下編輯貼文資料(lightBox)
    function handleEditPost (postData) {
      editPostContent.id = postData._id
      editPostContent.content = postData.content
      editPostContent.image = postData.image
      isShowEdit.value = true
    }

    // 編輯一則貼文
    async function updatePost (data) {
      // 沒有編輯圖片
      if (!data.image) {
        data.image = editPostContent.image

        const result = await store.dispatch('updatePost', data)
        if (!result) return
      } else {
        // 有編輯圖片，重新上傳圖片
        const imageUrl = await store.dispatch('uploadImage', data.image)
        if (!imageUrl) return

        data.image = imageUrl
        const result = await store.dispatch('updatePost', data)
        if (!result) return
      }

      handleClose()
      getUserWall()
    }

    // 更新貼文的讚(同步更新DOM)
    function changePostLikes (val) {
      posts.value.find((post) => {
        if (post._id == val.postId) {
          post.likes = val.newLikes
        }
      })
    }

    // 更新貼文的留言(同步更新DOM)
    function changePostComments (val) {
      posts.value.find((post) => {
        if (post._id == val.postId) {
          post.comments = val.comments
        }
      })
    }

    function handleShow (modeVal) {
      isShowComments.value = true
      mode.value = modeVal
    }

    function handleClose() {
      isShowEdit.value = false
      isShowComments.value = false
    }

    getUserWall()

    return {
      isShowEdit,
      isShowComments,
      mode,
      user, 
      posts,
      editPostContent,
      followers,
      following,
      isfollowing,
      userId, 
      isLoading, 
      isCurrentUser,
      swtchLightBoxTitle,
      handleFollow,
      searchPosts,
      handleEditPost,
      deleteOnePost,
      updatePost,
      changePostLikes,
      changePostComments,
      handleShow,
      handleClose,
    }
  }
}
</script>
