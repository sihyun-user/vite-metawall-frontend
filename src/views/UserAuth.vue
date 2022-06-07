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
              <input type="email" placeholder="Email">
            </div>
            <div class="user-control__form-login--row">
              <input type="Password" placeholder="Password">
            </div>
            <p class="form-invalid">暱稱至少 2 個字元以上</p>
            <button class="user-control__form-btn baseBtn">登入</button>
          </div>

          <!-- 註冊 -->
          <div class="user-control__form-register" v-else>
            <div class="user-control__form-register--row">
              <input type="text" placeholder="暱稱">
              <p class="form-invalid">暱稱至少 2 個字元以上</p>
            </div>
            <div class="user-control__form-register--row">
              <input type="Password" placeholder="Password">
              <p class="form-invalid">密碼需至少 8 碼以上，並中英混合</p>
            </div>
            <div class="user-control__form-register--row">
              <input type="Password" placeholder="Password">
              <p class="form-invalid">帳號已被註冊，請替換新的 Email！</p>
            </div>

            <button class="user-control__form-btn baseGrayBtn">註冊</button>
          </div>
        </section>
        <button class="user-control__switchBtn"  @click="switchAuthMode">{{ switchModeButtonCaption }}</button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from 'vue'
export default {
  setup () {
    const mode = ref('login')

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
      mode.value === 'login' ? mode.value = 'signup' : mode.value = 'login'
    }

    return {
      mode,
      switchModeCaption,
      switchModeButtonCaption,
      switchAuthMode
    }
  }
}
</script>
