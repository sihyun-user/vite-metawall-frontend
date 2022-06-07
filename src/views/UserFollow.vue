<template>
  <section class="follow">
    <base-caption>追蹤名單</base-caption>
    <base-card class="user" v-for="user in users" :key="user.id">
      <div class="user__info">
        <div class="user__info-photo">
          <!-- <img src=""> -->
        </div>
        <div class="user__info-wrap">
          <h3 class="user__info-name">
            <router-link to="/">{{ user.name }}</router-link>
          </h3>
          <span class="user__info-time">發文時間:2022/1/10 12:00</span>
        </div>
      </div>
      <div class="user__time">您已追蹤 90 天！</div>
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
      { id: '01', name: '工程師皮卡', photo: 'https://pokemon.com' },
      { id: '02', name: '寶可夢大師小智', photo: null }
    ]

    return {
      users
    }
  }
}
</script>
