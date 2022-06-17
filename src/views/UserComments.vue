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
          <div class="user__details-edit" @click="switchLightBox('edit', comment.post)">
            <i class="fa-solid fa-pen"></i>
            <span>編輯</span>
          </div>
          <div class="user__details-check" @click="switchLightBox('post', comment.post)">
            <div class="user__details-check--icon">
              <i class="fa-solid fa-arrow-right-long"></i>
            </div>
            <span>查看</span>
          </div>
        </div>
      </div>
    </base-card>

    <!-- light-box -->
    <base-lightBox v-if="isShowPost" title="查看貼文" @close="handleClose">
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
    <base-lightBox v-if="isShowEdit" title="修改留言" @close="handleClose">
      <div class="editComment">
        <h3>刪除留言</h3>
        <textarea v-model="editComment" placeholder="輸入您的貼文內容"></textarea>
      </div>
    </base-lightBox>
    <!-- //TODO: 刪除貼文時(沒有貼文卻還有留言)呈現畫面 -->
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
    const post = ref({})
    const isShowPost = ref(false)
    const isShowEdit = ref(false)
    const editComment = ref('ddd')
    
    const isLoading = computed(() => store.getters.isLoading)

    // 取得個人留言名單
    async function getCommentPostList () {
      comments.value = await store.dispatch('getCommentPostList')
    }

    // 編輯一則個人留言
    async function updatePostComment (id) {
      store.dispatch('updatePostComment', {
        comment_id: id,
        comment: editComment
      })
    }

    function switchLightBox(type, data) {
      type == 'edit' ?  isShowEdit.value = true : isShowPost.value = true
      post.value = data
    }

    function handleClose() {
      isShowPost.value = false
      isShowEdit.value = false
    }

    getCommentPostList()

    return {
      isShowPost,
      isShowEdit,
      comments,
      post,
      editComment,
      isLoading,
      handleClose,
      switchLightBox
    }
  }
}
</script>
