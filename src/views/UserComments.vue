<template>
  <section v-if="!isLoading" class="comment">
    <base-caption>我留言的貼文</base-caption>
    <base-card v-for="comment in comments" :key="comment._id" class="user">
      <div class="user__info">
        <div class="user__info-photo">
          <base-userPhoto :user-photo="comment.user.photo"></base-userPhoto>
        </div>
        <div class="user__info-wrap">
          <h3 class="user__info-name">
            <router-link to="/">{{ comment.user.name }}</router-link>
          </h3>
          <span class="user__info-time">
            留言時間:
            <base-formatTime :time="comment.createdAt"></base-formatTime>
          </span>
        </div>
      </div>
      <div class="user__wrap">
        <div class="user__wrap-favorite">
          <i class="fa-regular fa-thumbs-up"></i>
          <span>取消</span>
        </div>
        <div class="user__wrap-check">
          <div class="user__wrap-check--icon">
            <i class="fa-solid fa-arrow-right-long"></i>
          </div>
          <span>查看</span>
        </div>
      </div>
    </base-card>
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
export default {
  components: {
    BaseCaption, 
    BaseCard,
    BaseUserPhoto,
    BaseFormatTime
  },
  setup () {
    const store = useStore()
    const comments = ref([])

    const isLoading = computed(() => store.getters.isLoading)

    async function getCommentPostList () {
      comments.value = await store.dispatch('getCommentPostList')
    }

    getCommentPostList()

    return {
      comments,
      isLoading
    }
  }
}
</script>
