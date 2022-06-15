<template>
  <section class="post">
    <base-userHeader :user="user" :created-at="createdAt"></base-userHeader>
    <div class="post__content">
      <p class="post__content-text">
        {{ content }}
      </p>
      <div v-if="postImage" class="post__content-img">
        <img :src="postImage">
      </div>
    </div>
    <div class="post__state">
      <div class="post__state-like">
        <i class="fa-regular fa-thumbs-up"></i>
        <!-- <i class="fa-solid fa-thumbs-up"></i> -->
        <span>{{ likes.length }}</span>
      </div>
      <div class="post__state-msg" @click="switchMsgMode">
        <i class="fa-regular fa-comment"></i>
        <span>{{comments.length }} 則留言</span>
      </div>
    </div>
    <section v-if="msgMode" class="post__commentWall">
      <div class="post__writeComment">
        <div class="post__writeComment-photo">
          <base-userPhoto :user-photo="userInfo.photo"></base-userPhoto>
        </div>
        <div class="post__writeComment-wrap">
          <input v-model="commentContent" type="text" placeholder="留言...">
          <button @click="addPostComment">留言</button>
        </div>
      </div>
      <div class="post__comments">
        <div v-if="comments.length==0" class="post__no-comment">目前尚無留言，新增一則留言吧！</div>
        <div v-for="comment in comments" :key="comment._id" class="post__commentItem">
          <base-userHeader :user="comment.user" :created-at="comment.createdAt"></base-userHeader>
          <div class="post__commentItem-row">
            <p>{{ comment.comment }}</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { ref, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import BaseCard from './ui/BaseCard.vue'
import BaseUserHeader from './ui/BaseUserHeader.vue'
import BaseUserPhoto from './ui/BaseUserPhoto.vue'
export default {
  components: {
    BaseCard,
    BaseUserHeader,
    BaseUserPhoto
  },
  props: ['postId', 'user', 'likes', 'content', 'postImage', 'comments', 'createdAt'],
  setup (props) {
    const { postId } = toRefs(props)
    const store = useStore()
    const msgMode = ref(false)
    const commentContent = ref('')

    const userInfo = computed(() => store.getters.userInfo)

    function switchMsgMode () {
      msgMode.value = !msgMode.value
    }

    function addPostComment () {
      store.dispatch('addPostComment', { 
        postId: postId.value,
        comment: commentContent.value
      })
    }

    return {
      msgMode,
      commentContent,
      userInfo,
      switchMsgMode,
      addPostComment
    }
  }
}
</script>
