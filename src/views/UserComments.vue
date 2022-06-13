<template>
  <section class="comment">
    <base-caption>我留言的貼文</base-caption>
    <base-card class="user" v-for="user in users" :key="user.id">
      <div class="user__info">
        <div class="user__info-photo">
          <!-- <img src=""> -->
        </div>
        <div class="user__info-wrap">
          <h3 class="user__info-name">
            <router-link to="/">{{ user.name }}</router-link>
          </h3>
          <span class="user__info-time">追蹤時間:2022/1/10 12:00</span>
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
</template>
<script>
import BaseCaption from '../components/ui/BaseCaption.vue'
import BaseCard from '../components/ui/BaseCard.vue'
export default {
  components: {
    BaseCaption, BaseCard
  },
  setup () {
    const users = [
      { id: '01', name: '工程師皮卡' },
      { id: '02', name: '寶可夢大師小智' }
    ]

    return {
      users
    }
  }
}
</script>
