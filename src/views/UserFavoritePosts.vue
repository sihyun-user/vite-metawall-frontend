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
            <router-link to="/">{{ post.user.name }}</router-link>
          </h3>
          <span class="user__info-time">
            按讚時間
            <base-formatTime :time="post.createdAt"></base-formatTime>
            </span>
        </div>
      </div>
      <div class="user__wrap">
        <div class="user__wrap-favorite">
          <i class="fa-regular fa-thumbs-up"></i>
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

    const isLoading = computed(() => store.getters.isLoading)

    // 取得個人按讚名單
    async function getLikePostList () {
      posts.value = await store.dispatch('getLikePostList')
    }

    function switchLightBox(data) {
      console.log(data)
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
      switchLightBox,
      handleClose
    }
  }
}
</script>
