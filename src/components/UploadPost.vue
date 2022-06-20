<template>
  <div class="upload-post">
    <div class="post__text">
      <h1>貼文內容</h1>
      <textarea v-model="contentModel" placeholder="輸入您的貼文內容"></textarea>
    </div>
    <div class="post__photo">
      <div class="post__photo--btns">
        <button class="imageBtn imageBtn--black">
          <label for="upload">
            上傳圖片
            <input id="upload" name="image" type="file" accept="image/*" @change="handlePreviewImage">
          </label>
        </button>
        <button v-show="imageModel" class="imageBtn imageBtn--gray" @click="clearImage">
          清除圖片
        </button>
      </div>
      <div v-if="imageModel" class="post__photo--img">
        <img :src="imageModel">
      </div>
    </div>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <div class="post__sunbmitBtn">
      <button v-if="action=='update'" class="baseGrayBtn" @click="handleSubmitEdit">確定編輯</button>
      <button v-else class="baseGrayBtn" @click="handleSubmitCreate">送出貼文</button>
    </div>
  </div>
</template>
<script>
import { ref, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    action: {
      type: String
    },
    postId: {
      type: String
    },
    postContent: {
      type: String,
      default: ''
    },
    postImage: {
      type: String,
      default: ''
    }
  },
  emits: ['handleCreate', 'handleUpdate'],
  setup(props, context) {
    const store = useStore()
    const imageFile = ref(null)
    const contentModel = ref(props.postContent)
    const imageModel = ref(props.postImage)
    
    const { postId } = toRefs(props)
  
    const errorMsg = computed(() => store.getters.errorMsg)

    // 預覽圖檔
    function handlePreviewImage (e) {
      imageFile.value = e.target.files[0]
      if (!imageFile.value) return

      imageModel.value = URL.createObjectURL(imageFile.value)
    }

    // 清除圖片
    function clearImage () {
      imageFile.value = null
      imageModel.value = ''
      store.commit('setErrorMag', null)
    }

    // 檢查送出貼文格式
    function checkedPost () {
      if (contentModel.value==='') {
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

    // 送出編輯貼文
    async function handleSubmitEdit () {
      // 檢查送出貼文格式
      const checkOk = checkedPost()
      if (!checkOk) return

      context.emit('handleUpdate', {
        postId: postId.value,
        content: contentModel.value,
        image: imageFile.value
      })
    }

    // 送出建立貼文
    async function handleSubmitCreate () {
      // 1) 檢查送出貼文格式
      const checkOk = checkedPost()
      if (!checkOk) return

      context.emit('handleCreate', {
        content: contentModel.value,
        image: imageFile.value
      })
    }

    return {
      imageFile,
      contentModel,
      imageModel,
      errorMsg,
      handlePreviewImage,
      clearImage,
      handleSubmitEdit,
      handleSubmitCreate,
    }
  }
}
</script>