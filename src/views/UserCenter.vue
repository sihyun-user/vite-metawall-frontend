<template>
  <the-header></the-header>
  <section class="content">
    <div class="container">
      <main>
        <button
          class="baseYellowBtn" 
          style="margin-bottom:20px"
          @click="onSubmit"
        >
          送出 socket
        </button>
        <p>{{ wsRes }}</p>
        <router-view></router-view>
      </main>
      <aside>
        <story-list></story-list>
      </aside>
    </div>
  </section>
  <story-statusBar></story-statusBar>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import TheHeader from '../components/layout/TheHeader.vue'
import StoryList from '../components/StoryList.vue'
import StoryStatusBar from '../components/StoryStatusBar.vue'
import { connectSocket, sendSocketMessage } from '../service/ws'
export default {
  components: {
    TheHeader, 
    StoryList, 
    StoryStatusBar
  },
  setup() {
    const store = useStore()
    const wsRes = computed(() => store.getters['ws/getters'])

    connectSocket()

    const onSubmit = () => {
      sendSocketMessage({ msg: '測試' })
    }

    return {
      onSubmit,
      wsRes
    }
  }
}
</script>
