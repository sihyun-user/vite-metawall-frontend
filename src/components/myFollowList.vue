<template>
  <p v-if="follows.length == 0">{{ msg }}</p>
  <ul v-else class="myFollow">
    <li v-for="follow in follows" :key="follow.user._id" class="myFollow__user">
      <div class="myFollow__user--photo">
        <base-userPhoto :user-photo="follow.user.photo"></base-userPhoto>
      </div>
      <router-link :to="{ path: '/user-wall', query: { userId: follow.user._id }}">
        {{ follow.user.name }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { computed, toRefs } from 'vue'
import BaseUserPhoto from './ui/BaseUserPhoto.vue'
export default {
  components: {
    BaseUserPhoto
  },
  props: ['follows', 'select'],
  setup(props) {
    const { select } = toRefs(props)

    const msg = computed(() => {
      if (select.value == 'followers') {
        return '目前暫無任何粉絲追蹤'
      }
      return '目前暫無追蹤任何人'
    })

    return {
      msg
    }
  }
}
</script>