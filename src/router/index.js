import { createRouter, createWebHistory } from 'vue-router'
import UserAuth from '../views/UserAuth.vue'
import PostsWall from '../views/PostsWall.vue'
import UserWall from '../views/UserWall.vue'
import UserFollow from '../views/UserFollow.vue'
import UserFavoritePosts from '../views/UserFavoritePosts.vue'
import EditUserInfo from '../views/EditUserInfo.vue'
import UploadUserPost from '../views/UploadUserPost.vue'
import UserCenter from '../views/UserCenter.vue'

const routes = [
  { path: '/', redirect: '/posts-wall' },
  { path: '/auth', component: UserAuth },
  {
    path: '/posts-wall',
    redirect: '/posts-wall',
    component: UserCenter,
    children: [
      { path: '/posts-wall', component: PostsWall },
      { path: '/user-wall', component: UserWall },
      { path: '/user-follow', component: UserFollow },
      { path: '/user-favorite', component: UserFavoritePosts },
      { path: '/edit-userinfo', component: EditUserInfo },
      { path: '/upload-userpost', component: UploadUserPost },
      { path: '/:notFound(.*)', redirect: '/auth' }
      // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    ]
  },
  { path: '/:notFound(.*)', redirect: '/auth' }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  }
})

export default router
