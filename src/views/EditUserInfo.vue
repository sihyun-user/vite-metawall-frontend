<template>
  <section class="edit-userinfo" v-if="!isLoading">
    <base-caption>修改個人資料</base-caption>
    <div class="category">
      <button :class="{'active':mode=='profile'}"  @click="switchModeCaption('profile')">
        暱稱修改
      </button>
      <button :class="{'active':mode=='password'}"  @click="switchModeCaption('password')">
        重設密碼
      </button>
    </div>
    <section class="info-wrap">
      <div class="profile-info" v-if="mode=='profile'">
        <div class="profile-info__photo">
          <div class="profile-info__photo--img">
            <base-userPhoto v-if="!blobImage" :user-photo="profile.photo"></base-userPhoto>
            <base-userPhoto v-else :user-photo="blobImage"></base-userPhoto>
          </div>
          <button class="imageBtn imageBtn--black">
            <label for="upload">
              上傳圖片
              <input name="image" id="upload" type="file" accept="image/*" @change="handlePreviewImage">
            </label>
          </button>
        </div>
        <div class="profile-info__name input-text">
          <h3>暱稱</h3>
          <input type="text" placeholder="輸入暱稱" v-model="profile.name">
        </div>
        <div class="profile-info__sex">
          <h3>性別</h3>
          <div class="profile-info__sex--wrap">
            <label class="radio_label radioMode">
              <div class="radioMode_wrap">
                <input type="radio" name="sex" value="male" v-model="profile.sex">
                <span class="checkmark"></span>
              </div>
              男性
            </label>
            <label class="radio_label radioMode">
              <div class="radioMode_wrap">
                <input type="radio" name="sex" value="female" v-model="profile.sex">
                <span class="checkmark"></span>
              </div>
              女性
            </label>
          </div>
        </div>
        <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
        <button class="profile-info__submitBtn baseYellowBtn" @click="updateUserInfo">送出更新</button>
      </div>
      <div class="password-info" v-else>
        <div class="password-info__new input-text">
          <h3>輸入新密碼</h3>
          <input type="Password" placeholder="輸入新密碼" v-model="pwd.password">
        </div>
        <div class="password-info__secondNew input-text">
          <h3>再次輸入</h3>
          <input type="Password" placeholder="再次輸入新密碼" v-model="pwd.confirmPassword">
        </div>
        <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
        <button class="password-info__submitBtn baseGrayBtn" @click="updatePassword">重設密碼</button>
      </div>
    </section>
  </section>
  <base-spinner v-else></base-spinner>
</template>
<script>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import BaseCaption from '../components/ui/BaseCaption.vue'
import BaseUserPhoto from '../components/ui/BaseUserPhoto.vue'
export default {
  components: {
    BaseCaption,
    BaseUserPhoto
  },
  setup () {
    const store = useStore()
    const mode = ref('profile')
    const imageFile = ref(null)
    const blobImage = ref(null)
    const profile = reactive({
      name: '',
      sex: '',
      photo: ''
    })
    const pwd = reactive({
      password: '',
      confirmPassword: ''
    })

    const userInfo = computed(() => store.getters.userInfo)
    const errorMsg = computed(() => store.getters.errorMsg)
    const isLoading = computed(() => store.getters.isLoading)

    function switchModeCaption (val) {
      mode.value = val
      store.commit('setErrorMag', '')
    }

    // 預覽圖檔
    function handlePreviewImage (e) {
      imageFile.value = e.target.files[0]
      if (!imageFile.value) return

      blobImage.value = URL.createObjectURL(imageFile.value)
    }

    // 編輯會員資料
    async function updateUserInfo () {
      store.commit('setErrorMag', '')
      if (profile.name.length < 2) {
        return store.commit('setErrorMag', '暱稱字數低於2碼')
      }

      // 上傳圖片 & 更新會員資料
      if (!imageFile.value) {
        await store.dispatch('updateUserInfo', profile)
      } else {
        const imageUrl = await store.dispatch('uploadImage', imageFile.value)
        if (!imageUrl) return

        profile.photo = imageUrl
        await store.dispatch('updateUserInfo', profile)
      }
      
      setUsetInfo()
    }

    // 更新密碼
    async function updatePassword() {
      store.commit('setErrorMag', '')
      if (pwd.password !== pwd.confirmPassword) {
        return store.commit('setErrorMag', '密碼不一致')
      }
      if (pwd.password.length < 8) {
        return store.commit('setErrorMag', '密碼字數低於8碼')
      }
      const result = await store.dispatch('updatePassword', pwd)
      if (result) switchModeCaption('profile')
    }

    // 設置會員資料
    function setUsetInfo () {
      profile.name = userInfo.value.name
      profile.sex = userInfo.value.sex
      profile.photo = userInfo.value.photo
    }

    setUsetInfo()

    return {
      mode, blobImage, 
      profile, pwd,
      errorMsg, isLoading, 
      switchModeCaption, 
      handlePreviewImage,
      updateUserInfo,
      updatePassword
    }
  }
}
</script>
