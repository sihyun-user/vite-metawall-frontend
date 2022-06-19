<template>
  <div class="userHeader">
    <div class="userHeader__photo">
      <base-userPhoto :user-photo="user.photo"></base-userPhoto>
    </div>
    <div class="userHeader__wrap">
      <h3 class="userHeader__name">
        <router-link :to="userWallLink">{{ name }}</router-link>
      </h3>
      <span class="userHeader__time">
        <base-formatTime :time="createdAt"></base-formatTime>
      </span>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import BaseUserPhoto from '../ui/BaseUserPhoto.vue'
import BaseFormatTime from '../ui/BaseFormatTime.vue'
export default {
  components: {
    BaseUserPhoto,
    BaseFormatTime
  },
  props: {
    user: Object,
    createdAt: String
  },
  setup(props) {
    const { _id, name, photo } = toRefs(props.user);

    const userWallLink = computed(() => {
      return `/user-wall?userId=${_id.value}`
    })

    return {
      name,
      photo,
      userWallLink
    }
  }
}
</script>
