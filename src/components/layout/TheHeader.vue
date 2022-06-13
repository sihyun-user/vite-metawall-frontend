<template>
  <header>
    <nav>
      <h1><router-link to="/posts-wall">MetaWall</router-link></h1>
      <div class="user-wrap" v-if="hasUserInfo">
        <div class="user-wrap__photo">
          <base-userPhoto :user-photo="userInfo.photo"></base-userPhoto>
        </div>
        <div class="user-wrap__name">{{ userInfo.name }}</div>
        <div class="user-wrap__listBox">
          <ul class="user-wrap__list">
            <li>
              <router-link :to="curUserWallLink">我的貼文牆</router-link>
            </li>
            <li>
              <router-link to="/edit-userinfo">修改個人資料</router-link>
            </li>
            <li @click="logout">登出</li>
          </ul>
          <div class="user-wrap__list-bg"></div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import BaseUserPhoto from '../ui/BaseUserPhoto.vue'
export default {
  components: {
    BaseUserPhoto
  },
  setup() {
    const store = useStore()

    const hasUserInfo = computed(() => store.getters.hasUserInfo)
    const userInfo = computed(() => store.getters.userInfo)

    const curUserWallLink = computed(() => {
      return `/user-wall?userId=${store.getters.userId}`
    })
    
    function logout () {
      store.dispatch('logout')
    }

    return {
      logout,
      userInfo,
      hasUserInfo,
      curUserWallLink
    }
  }
}
</script>
