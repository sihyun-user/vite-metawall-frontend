<template>
  <img v-if="userPhoto !== ''" class="userPhoto" :src="userPhoto">
  <img v-else class="userPhoto" src="/src/assets/img/user_default.jpg">
</template>

<script>
export default {
  props: {
    userPhoto: {
      type: String
    }
  }
}
</script>
