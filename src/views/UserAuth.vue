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
          <div class="user-control__form-login"  v-if="mode=='login'">
            <div class="user-control__form-login--row">
              <input type="email" placeholder="Email" v-model="email">
            </div>
            <div class="user-control__form-login--row">
              <input type="Password" placeholder="Password" v-model="password">
            </div>
            <p class="errMode" v-if="errorMsg">{{ errorMsg }}</p>
            <button class="user-control__form-btn baseBtn" @click="login">登入</button>
          </div>

          <!-- 註冊 -->
          <div class="user-control__form-register" v-else>
            <div class="user-control__form-register--row">
              <input type="text" placeholder="暱稱" v-model="name">
            </div>
            <div class="user-control__form-login--row">
              <input type="email" placeholder="Email" v-model="email">
            </div>
            <div class="user-control__form-register--row">
              <input type="Password" placeholder="Password" v-model="password">
            </div>
            <div class="user-control__form-register--row">
              <input type="Password" placeholder="confirmPassword" v-model="confirmPassword">
            </div>
            <p class="errMode" v-if="errorMsg">{{ errorMsg }}</p>
            <button class="user-control__form-btn baseGrayBtn" @click="signup">註冊</button>
          </div>
        </section>
        <button class="user-control__switchBtn"  @click="switchAuthMode">{{ switchModeButtonCaption }}</button>
      </div>
    </div>
    <base-spinner v-if="isLoading"></base-spinner>
  </section>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  setup () {
    const store = useStore()
    const mode = ref('login')
    const name = ref('red')
    const email = ref('red@gmail.com')
    const password = ref('red123456')
    const confirmPassword = ref('red123456')

    const isLoading = computed(() => store.getters.isLoading)
    const errorMsg = computed(() => store.getters.errorMsg)

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
      store.commit('setErrorMag', '')
      mode.value === 'login' ? mode.value = 'signup' : mode.value = 'login'
    }

    // 登入
    function login () {
      store.commit('setErrorMag', '')

      if (email.value === '' || !email.value.includes('@')) {
        store.commit('setErrorMag', 'E-mail格式錯誤')
        return
      } else if (password.value.length < 8) {
        store.commit('setErrorMag', '密碼字數低於8碼')
        return
      }

      const payload = {
        email: email.value,
        password: password.value
      }

      store.dispatch('login', payload)
    }

    // 註冊
    async function signup () {
      store.commit('setErrorMag', '')
      
      if (name.value.length < 2) {
        return store.commit('setErrorMag', '暱稱至少 2 個字元以上')
      } else if (email.value === '' || !email.value.includes('@')) {
        return store.commit('setErrorMag', 'E-mail格式錯誤')
      } else if (password.value.length < 8) {
        return store.commit('setErrorMag', '密碼字數低於8碼')
      } else if (password.value !== confirmPassword.value) {
        return store.commit('setErrorMag', '密碼不一致')
      }

      const payload = {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      }
    
      const result = await store.dispatch('signup', payload)
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
      store.commit('setErrorMag', '')
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
