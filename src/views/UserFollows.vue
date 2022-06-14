<template>
  <section v-if="!isLoading" class="follow">
    <base-caption>我追蹤的名單</base-caption>
    <base-card v-for="follow in following" :key="follow.id" class="user">
      <div class="user__info">
        <div class="user__info-photo">
          <base-userPhoto :user-photo="follow.user.photo"></base-userPhoto>
        </div>
        <div class="user__info-wrap">
          <h3 class="user__info-name">
            <router-link :to="{ path: '/user-wall', query: { userId: follow.user._id }}">
              {{ follow.user.name }}
            </router-link>
          </h3>
          <span class="user__info-time">
            追蹤時間:
            <base-formatTime :time="follow.createdAt"></base-formatTime>
          </span>
        </div>
      </div>
      <div class="user__time">您已追蹤 {{ getFollowDay(follow.createdAt) }} 天！</div>
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
    const following = ref([])

    const isLoading = computed(() => store.getters.isLoading)

    // 計算追蹤天數
    function getFollowDay (time) {
      const day1 = new Date(time)
      const day2 = new Date()
      return parseInt(Math.abs(day1 - day2)/1000/3600/24)
    }

    // 取得個人追蹤名單
    async function getFollowUserList () {
      following.value = await store.dispatch('getFollowUserList')
    }

    getFollowUserList()

    return {
      following,
      isLoading,
      getFollowDay
    }
  }
}
</script>
