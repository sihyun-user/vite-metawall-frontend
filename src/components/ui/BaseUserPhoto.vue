<template>
  <img :src="userPhoto" v-if="userPhoto !== ''">
  <img src="/src/assets/img/user_default.jpg" v-else>
</template>

<script>
export default {
  props: ['userPhoto']
}
</script>