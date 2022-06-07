<template>
  <section class="story-list">
    <div class="story-list__row">
      <router-link to="/upload-userpost" class="baseBlueBtn story-list__btn">張貼動態</router-link>
      <ul class="story-list__wrap">
        <li class="story-list__mode" :class="{active:route.path=='/user-wall'}">
          <router-link to="/user-wall">
            <div class="story-list__mode-row">
              <!-- <img src=""> -->
            </div>
            <h3 class="story-list__mode-name">工程師皮卡</h3>
          </router-link>
        </li>
        <li class="story-list__mode" :class="{active:route.path=='/user-follow'}">
          <router-link to="/user-follow">
            <div class="story-list__mode-row">
              <i class="fa-regular fa-bell"></i>
            </div>
            <h3 class="story-list__mode-name">追蹤名單</h3>
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
      </ul>
    </div>
  </section>
</template>

<script>
import { useRoute } from 'vue-router'
export default {
  setup () {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>
