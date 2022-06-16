<template>
  <section v-if="!isLoading" class="upload-userPost">
    <base-caption>張貼動態</base-caption>
    <base-card class="post">
      <div class="post__text">
        <h1>貼文內容</h1>
        <textarea v-model="content" placeholder="輸入您的貼文內容"></textarea>
      </div>
      <div class="post__photo">
        <div class="post__photo--btns">
          <button class="imageBtn imageBtn--black">
            <label for="upload">
              上傳圖片
              <input id="upload" name="image" type="file" accept="image/*" @change="handlePreviewImage">
            </label>
          </button>
          <button v-show="imageFile" class="imageBtn imageBtn--gray" @click="clearImage">
            清除圖片
          </button>
        </div>
        <div v-if="blobImage" class="post__photo--img">
          <img :src="blobImage">
        </div>
      </div>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <div class="post__sunbmitBtn">
        <button class="baseGrayBtn" @click="handleSubmit">送出貼文</button>
      </div>
    </base-card>
  </section>
  <base-spinner v-else></base-spinner>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import BaseCaption from '../components/ui/BaseCaption.vue'
import BaseCard from '../components/ui/BaseCard.vue'
export default {
  components: {
    BaseCaption, BaseCard
  },
  setup() {
    const store = useStore()
    const imageFile = ref(null)
    const blobImage = ref(null)
    const content = ref('')
  
    const errorMsg = computed(() => store.getters.errorMsg)
    const isLoading = computed(() => store.getters.isLoading)

    // 預覽圖檔
    function handlePreviewImage (e) {
      imageFile.value = e.target.files[0]
      if (!imageFile.value) return

      blobImage.value = URL.createObjectURL(imageFile.value)
    }

    // 清除圖片
    function clearImage () {
      imageFile.value = null
      blobImage.value = null
      store.commit('setErrorMag', null)
    }

    // 檢查送出貼文格式
    function checkedPost () {
      if (content.value==='') {
        const errorTxt = '貼文內容不得為空'
        store.commit('setErrorMag', errorTxt)
        return false
      } else if (imageFile.value !== null) {
        const fileSize = Math.ceil(imageFile.value.size/1024) // KB

        if (fileSize > 200) {
          const errorTxt = '圖片檔案過大，僅限 2mb 以下檔案'
          store.commit('setErrorMag', errorTxt)
          return false
        }
      }
      return true
    }

    async function handleSubmit () {
      // 1) 檢查送出貼文格式
      const checkOk = checkedPost()
      if (!checkOk) return

      // 2) 上傳貼文圖片 & 創建貼文
      if (!imageFile.value) {
        store.dispatch('createPost', {
          content: content.value,
          image: ''
        })
      } else {
        const imageUrl = await store.dispatch('uploadImage', imageFile.value)
        if (!imageUrl) return

        store.dispatch('createPost', {
          content: content.value,
          image: imageUrl
        })
      }
    }

    return {
      content,
      imageFile,
      blobImage,
      errorMsg,
      isLoading,
      handlePreviewImage,
      clearImage,
      handleSubmit
    }
  }
}
</script>