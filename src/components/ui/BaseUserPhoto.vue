<template>
  <img class="userPhoto" :src="userPhoto" v-if="userPhoto !== ''">
  <img class="userPhoto" src="/src/assets/img/user_default.jpg" v-else>
</template>

<script>
export default {
  props: ['userPhoto']
}
</script>
