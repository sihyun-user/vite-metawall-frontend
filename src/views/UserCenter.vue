<template>
  <the-header></the-header>
  <section class="content">
    <div class="container">
      <main>
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
import TheHeader from '../components/layout/TheHeader.vue'
import StoryList from '../components/StoryList.vue'
import StoryStatusBar from '../components/StoryStatusBar.vue'
export default {
  components: {
    TheHeader, StoryList, StoryStatusBar
  }
}
</script>
