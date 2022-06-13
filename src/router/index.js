import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index'

import UserAuth from '../views/UserAuth.vue'
import PostsWall from '../views/PostsWall.vue'
import UserWall from '../views/UserWall.vue'
import UserFollows from '../views/UserFollows.vue'
import UserComments from '../views/UserComments.vue'
import UserFavoritePosts from '../views/UserFavoritePosts.vue'
import EditUserInfo from '../views/EditUserInfo.vue'
import UploadUserPost from '../views/UploadUserPost.vue'
import UserCenter from '../views/UserCenter.vue'

const routes = [
  { path: '/', redirect: '/posts-wall' },
  { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
  {
    path: '/posts-wall',
    redirect: '/posts-wall',
    component: UserCenter,
    children: [
      { path: '/posts-wall', component: PostsWall, meta: { requiresAuth: true }},
      { path: '/user-wall', component: UserWall },
      { path: '/user-follow', component: UserFollows },
      { path: '/user-comment', component: UserComments },
      { path: '/user-favorite', component: UserFavoritePosts },
      { path: '/edit-userinfo', component: EditUserInfo },
      { path: '/upload-userpost', component: UploadUserPost },
      { path: '/:notFound(.*)', redirect: '/auth' }
    ]
  },
  { path: '/:notFound(.*)', redirect: '/auth' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  }
})

router.beforeEach(function(to, _, next){
  const isLiginCall = store.getters.isLogin
  if (to.meta.requiresAuth && !isLiginCall) {
    alert('尚未登入')
    next('/auth')
  } else if (to.meta.requiresUnauth && isLiginCall) {
    next('/posts-wall')
  } else {
    next()
  }
})

export default router
