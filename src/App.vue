<template>
  <router-view></router-view>
</template>

<script>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from './store/pinia'
export default {
  setup() {
    const route = useRoute()
    const store = useStore()

    watch(() => route.path, () => store.$patch({ errorMsg: '' }))
  }
}
</script>
