<template>
  <base-card class="post">
    <base-userHeader :user="user" :createdAt="createdAt"></base-userHeader>
    <div class="post__content">
      <p class="post__content-text">
        {{ content }}
      </p>
      <div class="post__content-img" v-if="postImage">
        <img :src="postImage">
      </div>
    </div>
    <div class="post__state">
      <div class="post__state-like">
        <i class="fa-regular fa-thumbs-up"></i>
        <!-- <i class="fa-solid fa-thumbs-up"></i> -->
        <span>{{ likes.length }}</span>
      </div>
      <div class="post__state-msg" @click="switchMsgMode">
        <i class="fa-regular fa-comment"></i>
        <span>留言</span>
      </div>
    </div>
    <section class="post__commentWall" v-if="msgMode">
      <div class="post__writeComment">
        <div class="post__writeComment-photo">
          <!-- <img src=""> -->
        </div>
        <div class="post__writeComment-wrap">
          <input type="text" placeholder="留言...">
          <button>留言</button>
        </div>
      </div>
      <div class="post__comments">
        <div class="post__commentItem">
          <div class="post__commentItem-photo">
            <!-- <img src=""> -->
          </div>
          <div class="post__commentItem-row">
            <div class="post__commentItem-info">
              <h3 class="post__commentItem-name">工程師皮卡</h3>
              <span class="post__commentItem-time">2022/1/10 12:00</span>
            </div>
            <p class="post__commentItem-text">
              真的～我已經準備冬眠了
            </p>
          </div>
        </div>
        <div class="post__commentItem">
          <div class="post__commentItem-photo">
            <!-- <img src=""> -->
          </div>
          <div class="post__commentItem-row">
            <div class="post__commentItem-info">
              <h3 class="post__commentItem-name">工程師皮卡</h3>
              <span class="post__commentItem-time">2022/1/10 12:00</span>
            </div>
            <p class="post__commentItem-text">
              真的～我已經準備冬眠了
            </p>
          </div>
        </div>
      </div>
    </section>
  </base-card>
</template>

<script>
import { ref } from 'vue'
import BaseCard from './ui/BaseCard.vue'
import BaseUserHeader from './ui/BaseUserHeader.vue'
export default {
  components: {
    BaseCard,
    BaseUserHeader
  },
  props: ['user', 'likes', 'content', 'postImage', 'createdAt'],
  setup () {
    const msgMode = ref(false)

    function switchMsgMode () {
      msgMode.value = !msgMode.value
    }

    return {
      msgMode,
      switchMsgMode
    }
  }
}
</script>
