<template>
  <router-view></router-view>
</template>

<script>
import { watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const store = useStore()

    watch(() => route.path, () => store.commit('setErrorMag',''));

    store.dispatch('tryLogin')
  }
}
</script>
