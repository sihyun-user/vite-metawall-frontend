import { defineStore } from 'pinia'
import router from '../router/index'
import axios from 'axios'
import { checkConsole } from '../service/helpers'

export const useStore = defineStore('piniaStore', {
  state: () => ({
    token: null,
    userId: null,
    userInfo: {},
    isLogin: false,
    isLoading: false,
    errorMsg: '',
    counter: 1,
  }),
  getters: {
    hasUserInfo(state) {
      return state.userInfo._id
    }
  },
  actions: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('tokenExpiration')
      
      this.$reset()
      router.replace('/auth')
    },
    handleAuth(payload) {
      // const expiresIn = 1000 * 60 * 1 // 分鐘
      const expiresIn = 1000 * 3600 * 24 * 7 // 7day
      const expirationDate = new Date().getTime() + expiresIn
      const { token, userId } = payload

      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      localStorage.setItem('tokenExpiration', expirationDate)
      
      this.$patch({ token, userId })
    },
    // 登入
    async login(_, payload) {
      try {
        this.$patch({ isLoading: true })

        console.log(_)
        
        const api = `${import.meta.env.VITE_APP_API}/api/user/login`
        const { email, password } = payload
        
        const res = await axios.post(api, { email, password })
        const data = res.data.data

        this.handleAuth({ token: data.token, userId: data.user._id })

        this.getUserInfo()
        this.$patch({ isLoading: false, isLogin: true })
        checkConsole('登入成功', res.data)
        router.push('posts-wall')
        alert('登入成功')
      } catch (err) {
        const message = err.response.data.message
        this.$patch({ isLoading: false, errorMsg: `登入失敗，${message}` })
        checkConsole('登入失敗', err.response)
      }
    },
    // 取得會員資料
    async getUserInfo() {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/user/profile`
        
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        this.$patch({ userInfo: res.data.data.user })
        checkConsole('取得會員資料成功', res.data)
        return res.data.data
      } catch (err) {
        checkConsole('取得會員資料失敗', err.response)
      }
    },
  },
  persist: true
})