<template>
  <section v-if="!isLoading" class="comment">
    <base-caption>我留言的貼文</base-caption>
    <base-card v-if="comments && comments.length==0" class="no-info">目前尚無留言，留言一則貼文吧！</base-card>
    <base-card v-for="comment in comments" :key="comment._id" class="user">
      <div class="user__content">
        <div class="user__info">
          <span class="user__info-time">
            留言時間:
            <base-formatTime :time="comment.createdAt"></base-formatTime>
          </span>
          <p class="user__info-text">{{ comment.comment }}</p>
        </div>
        <div class="user__details">
          <div class="user__details-favorite">
            <i class="fa-solid fa-pen"></i>
            <span>編輯</span>
          </div>
          <div class="user__details-check" @click="getOnePost(comment.post)">
            <div class="user__details-check--icon">
              <i class="fa-solid fa-arrow-right-long"></i>
            </div>
            <span>查看</span>
          </div>
        </div>
      </div>
    </base-card>
    <base-lightBox v-if="isShow" title="查看貼文" @close="handleClose">
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
    </base-lightBox>
  </section>
  <base-spinner v-else></base-spinner>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseCaption from '../components/ui/BaseCaption.vue'
import BaseLightBox from '../components/ui/BaseLightBox.vue'
import BaseFormatTime from '../components/ui/BaseFormatTime.vue'
import PostItem from '../components/PostItem.vue'
export default {
  components: {
    BaseCard,
    BaseCaption, 
    BaseLightBox,
    BaseFormatTime,
    PostItem
  },
  setup () {
    const store = useStore()
    const comments = ref([])
    const post = ref(null)
    const isShow = ref(false)

    const isLoading = computed(() => store.getters.isLoading)

    async function getCommentPostList () {
      comments.value = await store.dispatch('getCommentPostList')
    }

    async function getOnePost (postId) {
      post.value = await store.dispatch('getOnePost', { postId })
      isShow.value = true
      console.log(post.value)
    }

    function handleClose() {
      isShow.value = false
    }

    getCommentPostList()

    return {
      isShow,
      comments,
      post,
      isLoading,
      getOnePost,
      handleClose
    }
  }
}
</script>
