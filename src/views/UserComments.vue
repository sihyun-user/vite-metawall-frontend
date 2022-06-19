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
          <div class="user__details-edit" @click="getEditLightBox(comment)">
            <i class="fa-solid fa-pen"></i>
            <span>編輯</span>
          </div>
          <div class="user__details-check" @click="getPostLightBox(comment.post)">
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
        :show-comments="true"
        @change-likes="changePostLikes"
        @change-comments="changePostComments"
      >
      </post-item>
    </base-lightBox>
    <base-lightBox v-if="isShowEdit" title="編輯留言" @close="handleClose">
      <div class="editComment">
        <h3 @click="canclePostComment">刪除留言</h3>
        <textarea v-model="editComment" placeholder="輸入您的留言內容"></textarea>
        <div class="editComment__btn">
          <button class="baseGrayBtn" @click="updatePostComment">送出留言</button>
        </div>
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
    const editComment = ref('')
    const selectCommentId = ref('')
    const isShowPost = ref(false)
    const isShowEdit = ref(false)
    
    const isLoading = computed(() => store.getters.isLoading)

    // 取得個人留言名單
    async function getCommentPostList () {
      comments.value = await store.dispatch('getCommentPostList')
    }

    // 編輯一則個人留言
    async function updatePostComment () {
      isShowEdit.value = false

      const result = await store.dispatch('updatePostComment', {
        commentId: selectCommentId.value,
        comment: editComment.value
      })
      if (!result) return

      getCommentPostList()
    }

    // 刪除一則個人留言
    async function canclePostComment () {
      isShowEdit.value = false

      const result = await store.dispatch('canclePostComment', { 
        commentId: selectCommentId.value
      })
      if (!result) return

      getCommentPostList()
    }

    // 更新貼文的讚(同步更新DOM)
    function changePostLikes (val) {
      comments.value.find((comment) => {
        const selectPost = comment.post
        if (selectPost._id == val.postId) {
          selectPost.likes = val.newLikes
        }
      })
    }

    // 更新貼文的留言(同步更新DOM)
    function changePostComments (val) {
      comments.value.find((comment) => {
        const selectPost = comment.post
        if (selectPost._id == val.postId) {
          selectPost.comments = val.comments
        }
      })
    }

    function getPostLightBox(postData) {
      isShowPost.value = true
      post.value = postData
    }

    function getEditLightBox(commentData) {
      isShowEdit.value = true
      selectCommentId.value = commentData._id
      editComment.value = commentData.comment
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
      updatePostComment,
      canclePostComment,
      changePostLikes,
      changePostComments,
      getPostLightBox,
      getEditLightBox,
      handleClose
    }
  }
}
</script>
