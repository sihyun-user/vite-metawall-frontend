<template>
  <section v-if="!isLoading" class="favorite">
    <base-caption>我按讚的貼文</base-caption>
    <base-card v-if="posts && posts.length==0" class="no-info">目前尚無按讚貼文，按讚一則貼文吧！</base-card>
    <base-card v-for="post in posts" :key="post.id" class="user">
      <div class="user__info">
        <div class="user__info-photo">
          <base-userPhoto :user-photo="post.user.photo"></base-userPhoto>
        </div>
        <div class="user__info-wrap">
          <h3 class="user__info-name">
            <router-link :to="{ path: '/user-wall', query: { userId: post.user._id } }">
              {{ post.user.name }}
            </router-link>
          </h3>
          <span class="user__info-time">
            按讚時間
            <base-formatTime :time="post.createdAt"></base-formatTime>
          </span>
        </div>
      </div>
      <div class="user__wrap">
        <div class="user__wrap-favorite" @click="canclePostLike(post._id)">
          <i class="fa-solid fa-thumbs-up"></i>
          <span>取消</span>
        </div>
        <div class="user__wrap-check" @click="switchLightBox(post)">
          <div class="user__wrap-check--icon">
            <i class="fa-solid fa-arrow-right-long"></i>
          </div>
          <span>查看</span>
        </div>
      </div>
    </base-card>

    <!-- light-box -->
    <base-lightBox v-if="isShowPost" title="查看貼文" @close="handleClose">
      <post-item
        :post-id="postObj._id"
        :user="postObj.user"
        :likes="postObj.likes"
        :content="postObj.content"
        :post-image="postObj.image"
        :comments="postObj.comments"
        :created-at="postObj.createdAt"
        :show-comments="true"
        @change-likes="changePostLikes"
        @change-comments="changePostComments"
      >
      </post-item>
    </base-lightBox>
  </section>
  <base-spinner v-else></base-spinner>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import BaseCaption from '../components/ui/BaseCaption.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseUserPhoto from '../components/ui/BaseUserPhoto.vue'
import BaseFormatTime from '../components/ui/BaseFormatTime.vue'
import BaseLightBox from '../components/ui/BaseLightBox.vue'
import PostItem from '../components/PostItem.vue'
import useChangePost from '../hooks/changePost.js'
export default {
  components: {
    BaseCaption, 
    BaseCard,
    BaseUserPhoto,
    BaseFormatTime,
    BaseLightBox,
    PostItem
  },
  setup () {
    const store = useStore()
    const posts = ref({})
    const postObj = ref({})
    const isShowPost = ref(false)

    const { changeComments } = useChangePost()
    const isLoading = computed(() => store.getters.isLoading)

    // 取得個人按讚名單
    async function getLikePostList () {
      posts.value = await store.dispatch('getLikePostList')
    }

    // 取消一則貼文的讚
    async function canclePostLike (id) {
      const result = await store.dispatch('canclePostLike', { postId: id })
      if (!result) return

      getLikePostList()
    }

    // 更新貼文的讚(重新取得按讚名單)
    function changePostLikes () {
      handleClose()
      getLikePostList()
    }

     // 更新貼文的留言(同步更新DOM)
    function changePostComments (newData) {
      changeComments(posts.value, newData)
    }

    function switchLightBox(data) {
      isShowPost.value = true
      postObj.value = data
    }

    function handleClose() {
      isShowPost.value = false
    }

    getLikePostList()

    return {
      isLoading,
      posts,
      postObj,
      isShowPost,
      canclePostLike,
      changePostLikes,
      changePostComments,
      switchLightBox,
      handleClose
    }
  }
}
</script>
