<template>
  <div class="userHeader">
    <div class="userHeader__photo">
      <img :src="photo" v-if="photo !== ''">
      <img src="/src/assets/img/user_default.jpg" v-else>
    </div>
    <div class="userHeader__wrap">
      <h3 class="userHeader__name">
        <router-link to="/">{{ name }}</router-link>
      </h3>
      <span class="userHeader__time">{{ createdTime }}</span>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import moment from 'moment'
export default {
  props: ['user', 'createdAt'],
  setup(props) {
    const { name, photo } = toRefs(props.user);

    const createdTime = computed(() => moment(props.createdAt).format('YYYY/MM/DD HH:mm'))

    return {
      name,
      photo,
      createdTime
    }
  }
}
</script>
