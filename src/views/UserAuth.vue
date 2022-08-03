<template>
  <section class="auth">
    <div class="main">
      <div class="img-aside">
        <img src="../assets/img/img.svg">
      </div>
      <div class="user-control">
        <h1>MetaWall</h1>
        <h2>{{ switchModeCaption }}</h2>
        <img class="user-control__img" src="../assets/img/img.svg">
        <section class="user-control__form">
          <!-- 登入 -->
          <div v-if="mode=='login'"  class="user-control__form-login">
            <div class="user-control__form-login--row">
              <input v-model="email" type="email" placeholder="Email">
            </div>
            <div class="user-control__form-login--row">
              <input v-model="password" type="Password" placeholder="Password">
            </div>
            <p v-if="errorMsg" class="errMode">{{ errorMsg }}</p>
            <button class="user-control__form-btn baseBtn" @click="login">登入</button>
          </div>

          <!-- 註冊 -->
          <div v-else class="user-control__form-register">
            <div class="user-control__form-register--row">
              <input v-model="name" type="text" placeholder="暱稱">
            </div>
            <div class="user-control__form-login--row">
              <input v-model="email" type="email" placeholder="Email">
            </div>
            <div class="user-control__form-register--row">
              <input v-model="password" type="Password" placeholder="Password">
            </div>
            <div class="user-control__form-register--row">
              <input v-model="confirmPassword" type="Password" placeholder="confirmPassword">
            </div>
            <p v-if="errorMsg" class="errMode">{{ errorMsg }}</p>
            <button class="user-control__form-btn baseGrayBtn" @click="signup">註冊</button>
          </div>
        </section>
        <button class="user-control__switchBtn"  @click="switchAuthMode">{{ switchModeButtonCaption }}</button>
      </div>
    </div>
  </section>
  <base-spinner v-if="isLoading"></base-spinner>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from '../store/pinia'
// import { storeToRefs } from 'pinia'
export default {
  setup () {
    const store = useStore()
    const mode = ref('login')
    const name = ref('')
    const email = ref('yuri@gmail.com')
    const password = ref('yuri123456')
    const confirmPassword = ref('')

    const isLoading = computed(() => store.isLoading)
    const errorMsg = computed(() => store.errorMsg)

    const switchModeCaption = computed(() => {
      if (mode.value === 'login') {
        return '到元宇宙展開全新社交圈'
      } else {
        return '註冊'
      }
    })

    const switchModeButtonCaption = computed(() => {
      if (mode.value === 'login') {
        return '註冊帳號'
      } else {
        return '登入'
      }
    })

    function switchAuthMode () {
      clearForm()
      mode.value === 'login' ? mode.value = 'signup' : mode.value = 'login'
    }

    // 登入
    function login () {
      store.$patch({ errorMsg: '' })

      if (email.value === '' || !email.value.includes('@')) {
        return store.$patch({ errorMsg: 'E-mail格式錯誤' })
      } else if (password.value.length < 8) {
        return store.$patch({ errorMsg: '密碼字數低於8碼' })
      }

      const payload = {
        email: email.value,
        password: password.value
      }

      store.login(payload)
    }

    // 註冊
    async function signup () {
      store.$patch({ errorMsg: '' })
      
      if (name.value.length < 2) {
        return store.commit('setErrorMag', '暱稱至少 2 個字元以上')
      } else if (email.value === '' || !email.value.includes('@')) {
        return store.$patch({ errorMsg: 'E-mail格式錯誤' })
      } else if (password.value.length < 8) {
        return  store.$patch({ errorMsg: '密碼字數低於8碼' })
      } else if (password.value !== confirmPassword.value) {
        return  store.$patch({ errorMsg: '密碼不一致' })
      }

      const payload = {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      }
    
      const result = await store.signup(payload)
      if (result) {
        clearForm()
        mode.value = 'login'
      }
    }
    
    // 清除表單資料
    function clearForm () {
      name.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      store.$patch({ errorMsg: '' })
    }

    return {
      mode,
      name, email, password, confirmPassword,
      isLoading, errorMsg,
      switchModeCaption, switchModeButtonCaption,
      switchAuthMode, login, signup
    }
  }
}
</script>
