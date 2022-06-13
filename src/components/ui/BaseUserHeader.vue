<template>
  <div class="userHeader">
    <div class="userHeader__photo">
      <base-userPhoto :user-photo="user.photo"></base-userPhoto>
    </div>
    <div class="userHeader__wrap">
      <h3 class="userHeader__name">
        <router-link :to="userWallLink">{{ name }}</router-link>
      </h3>
      <span class="userHeader__time">{{ createdTime }}</span>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import moment from 'moment'
import BaseUserPhoto from '../ui/BaseUserPhoto.vue'
export default {
  components: {
    BaseUserPhoto
  },
  props: ['user', 'createdAt'],
  setup(props) {
    const { _id, name, photo } = toRefs(props.user);

    const createdTime = computed(() => moment(props.createdAt).format('YYYY/MM/DD HH:mm'))

    const userWallLink = computed(() => {
      return `/user-wall?userId=${_id.value}`
    })

    return {
      name,
      photo,
      createdTime,
      userWallLink
    }
  }
}
</script>
