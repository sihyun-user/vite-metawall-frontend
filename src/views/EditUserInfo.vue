<template>
  <section class="edit-userinfo">
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
            <img src="../assets/img/user_default.jpg">
          </div>
          <button class="profile-info__photo--btn">上傳大頭照</button>
        </div>
        <div class="profile-info__name input-text">
          <h3>暱稱</h3>
          <input type="text" placeholder="輸入暱稱">
        </div>
        <div class="profile-info__sex">
          <h3>性別</h3>
          <div class="profile-info__sex--wrap">
            <label class="radio_label radioMode">
              <div class="radioMode_wrap">
                <input type="radio" name="sex" value="1">
                <span class="checkmark"></span>
              </div>
              男性
            </label>
            <label class="radio_label radioMode">
              <div class="radioMode_wrap">
                <input type="radio" name="sex" value="2">
                <span class="checkmark"></span>
              </div>
              女性
            </label>
          </div>
        </div>
        <p class="error">
          1.圖片寬高比必需為 1:1，請重新輸入<br>
          2. 解析度寬度至少 300像素以上，請重新輸入
        </p>
        <button class="profile-info__submitBtn baseYellowBtn">送出更新</button>
      </div>
      <div class="password-info" v-else>
        <div class="password-info__new input-text">
          <h3>輸入新密碼</h3>
          <input type="text" placeholder="輸入新密碼">
        </div>
        <div class="password-info__secondNew input-text">
          <h3>再次輸入</h3>
          <input type="text" placeholder="再次輸入新密碼">
        </div>
        <p class="error">兩次密碼不一樣，請重新輸入</p>
        <button class="password-info__submitBtn baseGrayBtn">重設密碼</button>
      </div>
    </section>
  </section>
</template>
<script>
import { ref } from 'vue'
import BaseCaption from '../components/ui/BaseCaption.vue'
export default {
  components: {
    BaseCaption
  },
  setup () {
    const mode = ref('personal')

    function switchModeCaption (val) {
      mode.value = val
    }

    return {
      mode,
      switchModeCaption
    }
  }
}
</script>
