<template>
  <section class="comment" v-if="!isLoading">
    <base-caption>我留言的貼文</base-caption>
    <base-card class="user" v-for="comment in comments" :key="comment._id">
      <div class="user__info">
        <div class="user__info-photo">
          <!-- <img src=""> -->
        </div>
        <div class="user__info-wrap">
          <h3 class="user__info-name">
            <router-link to="/">{{ comment.user.name }}</router-link>
          </h3>
          <span class="user__info-time">留言時間: {{comment.createdAt}}</span>
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
import moment from 'moment'
export default {
  components: {
    BaseCaption, BaseCard
  },
  setup () {
    const store = useStore()
    const comments = ref([])

    const isLoading = computed(() => store.getters.isLoading)
    // const createdTime = computed(() => {
    //   console.lgo(date)
    //   return comments.value.filter(date => moment(date.createdAt).format('YYYY/MM/DD HH:mm'))
    // })

    async function getCommentPostList () {
      comments.value = await store.dispatch('getCommentPostList')
      // comments.value = comments.value.forEach(item => moment(item.createdAt).format('YYYY/MM/DD HH:mm'))
    }

    getCommentPostList()

    return {
      comments,
      isLoading
    }
  }
}
</script>
