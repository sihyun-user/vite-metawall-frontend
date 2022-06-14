<template>
  <section class="story-list">
    <div class="story-list__row">
      <router-link to="/upload-userpost" class="baseBlueBtn story-list__btn">張貼動態</router-link>
      <ul class="story-list__wrap">
        <li
          v-if="hasUserInfo" class="story-list__mode"
          :class="{active:route.path=='/user-wall'}"
        >
          <router-link :to="curUserWallLink">
            <div class="story-list__mode-row">
              <base-userPhoto :user-photo="userInfo.photo"></base-userPhoto>
            </div>
            <h3 class="story-list__mode-name">{{ userInfo.name }}</h3>
          </router-link>
        </li>
        <li class="story-list__mode" :class="{active:route.path=='/user-follow'}">
          <router-link to="/user-follow">
            <div class="story-list__mode-row">
              <i class="fa-regular fa-bell"></i>
            </div>
            <h3 class="story-list__mode-name">我追蹤的名單</h3>
          </router-link>
        </li>
        <li class="story-list__mode" :class="{active:route.path=='/user-favorite'}">
          <router-link to="/user-favorite">
            <div class="story-list__mode-row">
              <i class="fa-regular fa-thumbs-up"></i>
            </div>
            <h3 class="story-list__mode-name">我按讚的貼文</h3>
          </router-link>
        </li>
        <li class="story-list__mode" :class="{active:route.path=='/user-comment'}">
          <router-link to="/user-comment">
            <div class="story-list__mode-row">
              <i class="fa-regular fa-comment"></i>
            </div>
            <h3 class="story-list__mode-name">我留言的貼文</h3>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import BaseUserPhoto from './ui/BaseUserPhoto.vue'
export default {
  components: {
    BaseUserPhoto
  },
  setup () {
    const route = useRoute()
    const store = useStore()

    const hasUserInfo = computed(() => store.getters.hasUserInfo)
    const userInfo = computed(() => store.getters.userInfo)

    const curUserWallLink = computed(() => {
      return `/user-wall?userId=${store.getters.userId}`
    })

    return {
      route,
      userInfo,
      hasUserInfo,
      curUserWallLink
    }
  }
}
</script>
