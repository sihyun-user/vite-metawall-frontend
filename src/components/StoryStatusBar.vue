<template>
  <section class="story-bar">
    <div class="story-bar__wrap">
      <ul class="story-bar__items">
        <li :class="{active:route.path=='/user-follow'}">
          <router-link to="/user-follow">
            <i class="fa-regular fa-bell"></i>
          </router-link>
        </li>
        <li :class="{active:route.path=='/user-favorite'}">
          <router-link to="/user-favorite">
            <i class="fa-regular fa-thumbs-up"></i>
          </router-link>
        </li>
        <li :class="{active:route.path=='/posts-wall'}">
          <router-link to="/posts-wall">
            <i class="fa-solid fa-house"></i>
          </router-link>
        </li>
        <li :class="{active:route.path=='/upload-userpost'}">
          <router-link to="/upload-userpost">
            <i class="fa-solid fa-plus"></i>
          </router-link>
        </li>
        <li :class="{active:route.path=='/user-comment'}">
          <router-link to="/user-comment">
            <i class="fa-regular fa-comment"></i>
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
