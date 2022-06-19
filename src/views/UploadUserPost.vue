<template>
  <section v-if="!isLoading" class="upload-userPost">
    <base-caption>張貼動態</base-caption>
    <base-card class="post">
      <upload-post @handle-create="createPost">
      </upload-post>
    </base-card>
  </section>
  <base-spinner v-else></base-spinner>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import BaseCaption from '../components/ui/BaseCaption.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import UploadPost from '../components/UploadPost.vue'
export default {
  components: {
    BaseCaption, 
    BaseCard,
    UploadPost
  },
  setup() {
    const store = useStore()
    const isLoading = computed(() => store.getters.isLoading)

    // 新增一則貼文
    async function createPost (data) {
      // 沒有圖片
      if (!data.image) {
        data.image = ''

        const result = await store.dispatch('createPost', data)
        if (!result) return
      } else {
        // 有圖片，上傳圖片
        const imageUrl = await store.dispatch('uploadImage', data.image)
        if (!imageUrl) return

        data.image = imageUrl
        const result = await store.dispatch('createPost', data)
        if (!result) return
      }
    }

    return {
      isLoading,
      createPost
    }
  }
}
</script>