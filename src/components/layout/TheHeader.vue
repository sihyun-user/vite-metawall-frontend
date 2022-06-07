<template>
  <header>
    <nav>
      <h1><router-link to="/posts-wall">MetaWall</router-link></h1>
      <div class="user-wrap">
        <div class="user-wrap__photo">
          <img src="">
        </div>
        <div class="user-wrap__name">工程師皮卡</div>
        <div class="user-wrap__listBox">
          <ul class="user-wrap__list">
            <li>
              <router-link to="/user-wall">我的貼文牆</router-link>
            </li>
            <li>
              <router-link to="/edit-userinfo">修改個人資料</router-link>
            </li>
            <li>登出</li>
          </ul>
          <div class="user-wrap__list-bg"></div>
        </div>
      </div>
    </nav>
  </header>
</template>
