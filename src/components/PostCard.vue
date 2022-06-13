<template>
  <base-card class="post">
    <base-userHeader :user="user" :createdAt="createdAt"></base-userHeader>
    <div class="post__content">
      <p class="post__content-text">
        {{ content }}
      </p>
      <div class="post__content-img" v-if="postImage">
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
    <section class="post__commentWall" v-if="msgMode">
      <div class="post__writeComment">
        <div class="post__writeComment-photo">
          <base-userPhoto :user-photo="userInfo.photo"></base-userPhoto>
        </div>
        <div class="post__writeComment-wrap">
          <input type="text" placeholder="留言..." v-model="commentContent">
          <button @click="addPostComment">留言</button>
        </div>
      </div>
      <div class="post__comments">
        <div class="post__no-comment" v-if="comments.length==0">目前尚無留言，新增一則留言吧！</div>
        <div class="post__commentItem" v-for="comment in comments" :key="comment._id">
          <base-userHeader :user="comment.user" :createdAt="comment.createdAt"></base-userHeader>
          <div class="post__commentItem-row">
            <p>{{ comment.comment }}</p>
          </div>
        </div>
      </div>
    </section>
  </base-card>
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
