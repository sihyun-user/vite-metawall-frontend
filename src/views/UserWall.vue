<template>
  <section class="user-wall">
    <div class="follow">
      <div class="follow__content follow__info">
        <div class="follow__info--photo">
          <img src="../assets/img/user_default.jpg">
        </div>
        <div class="follow__info--wrap">
          <div class="follow__info--user">
            <h3>工程師皮卡</h3>
            <span>987,987 人追蹤</span>
          </div>
          <div class="follow__info--btn">
            <!-- <button class="baseYellowBtn">追蹤</button> -->
            <button class="baseGrayBtn-2">取消追蹤</button>
          </div>
        </div>
      </div>
      <div class="follow__bg"></div>
    </div>
    <post-filter class="filter"></post-filter>
    <post-card v-for="post in posts"
      :key="post._id"
      :user="post.user"
      :content="post.content"
      :postImage="post.image"
    >
    </post-card>
  </section>
</template>

<script>
import PostFilter from '../components/PostFilter.vue'
import PostCard from '../components/PostCard.vue'
export default {
  components: {
    PostFilter, PostCard
  },
  setup () {
    const posts = [
      { id: '01', user: {name: 'Mary', photo: ''}, image: 'https://pokemon.com', content: '測試資料' }
    ]

    return {
      posts
    }
  }
}
</script>
