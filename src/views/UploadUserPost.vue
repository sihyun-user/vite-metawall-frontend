<template>
  <section class="upload-userPost" v-if="!isLoading">
    <base-caption>張貼動態</base-caption>
    <base-card class="post">
      <div class="post__text">
        <h1>貼文內容</h1>
        <textarea placeholder="輸入您的貼文內容" v-model="content"></textarea>
      </div>
      <div class="post__photo">
        <button class="post__photo--btn">
          <label for="upload">
            上傳圖片
            <input name="image" id="upload" type="file" accept="image/*" @change="handlePreviewImage">
          </label>
        </button>
        <div class="post__photo--img" v-if="blobImage">
          <img :src="blobImage">
        </div>
      </div>
      <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
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
import { useRouter } from 'vue-router'
import { checkConsole } from '../service/helpers'
import axios from 'axios'
import BaseCaption from '../components/ui/BaseCaption.vue'
import BaseCard from '../components/ui/BaseCard.vue'
export default {
  components: {
    BaseCaption, BaseCard
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const imageFile = ref(null)
    const blobImage = ref(null)
    const content = ref('')
    const imageLink = ref('')

    const errorMsg = computed(() => store.getters.errorMsg)
    const isLoading = computed(() => store.getters.isLoading)

    // 預覽圖檔
    function handlePreviewImage (e) {
      imageFile.value = e.target.files[0];
      blobImage.value = URL.createObjectURL(imageFile.value)
    }

    // 檢查送出貼文格式
    function checkedPost () {
      if (content.value==='') {
        const errorTxt = '貼文內容不得為空'
        store.commit('setErrorMag', errorTxt)
        return false
      } else if (imageFile.value !== null) {
        const fileSize = Math.ceil(imageFile.value.size/1024) // KB

        if (fileSize > 100) {
          const errorTxt = '圖片檔案過大，僅限 1mb 以下檔案'
          store.commit('setErrorMag', errorTxt)
          return false
        }
      }
      return true
    }

    // 上傳貼文圖片
    async function uploadImage () {
      try {
        const formData = new FormData()
        formData.append('image', imageFile.value)

        const api = `${import.meta.env.VITE_APP_API}/api/uploads`
        const response = await axios.post(api, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (!response.status) throw Error

        imageLink.value = response.data.data.url
        checkConsole('上傳貼文圖片成功', response.data)

        return 'ok'
      } catch (error) {
        alert('系統忙碌中，請稍後再試')
        store.commit('setIsLoading', false)
      }
    }

    // 創建貼文
    async function craetPost () {
      try {
        const paramData = {
          content: content.value,
          user: import.meta.env.VITE_APP_USER_ID,
          image: imageLink.value
        }

        const api = `${import.meta.env.VITE_APP_API}/api/posts`
        const response = await axios.post(api, paramData)
        store.commit('setIsLoading', false)

        if (!response.status) throw Error

        alert('貼文創建成功')
        router.push('/posts-wall')
        checkConsole('創建貼文成功', response.data)
      } catch (error) {
        alert('系統忙碌中，請稍後再試')
        store.commit('setIsLoading', false)
      }
    }

    async function handleSubmit () {
      // 1) 檢查送出貼文格式
      const checkOk = checkedPost()
      if (!checkOk) return

      // 2) 上傳貼文圖片 & 創建貼文
      store.commit('setIsLoading', true)

      if (!imageFile.value) {
        craetPost()
      } else {
        const uploadResult = await uploadImage()
        if (uploadResult == 'ok') craetPost()
      }
    }

    return {
      content,
      blobImage,
      errorMsg,
      isLoading,
      handlePreviewImage,
      handleSubmit
    }
  }
}
</script>