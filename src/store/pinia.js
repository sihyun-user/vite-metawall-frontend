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
    async login(payload) {
      try {
        this.$patch({ isLoading: true })
        
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
    // 註冊
    async signup(payload) {
      try {
        this.$patch({ isLoading: true })

        const api = `${import.meta.env.VITE_APP_API}/api/user/signup`
        const { name, email, password, confirmPassword } = payload
        
        const res = await axios.post(api, { 
          name, email, password, confirmPassword
        })

        this.$patch({ isLoading: false })
        checkConsole('註冊成功', res.data)
        alert('註冊成功,請重新登入')
        return true
      } catch (err) {
        const message = err.response.data.message
        this.$patch({ isLoading: false, errorMsg: `註冊失敗，${message}` })
        checkConsole('註冊失敗', err.response)
      }
    },
    // 更新密碼 
    async updatePassword(payload) {
      try {
        this.$patch({ isLoading: true })
        const api = `${import.meta.env.VITE_APP_API}/api/user/updatePassword`
        const paramData = {
          password: payload.password,
          confirmPassword: payload.confirmPassword
        }
  
        const res = await axios.post(api, paramData, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.$patch({ isLoading: false })
        checkConsole('更新密碼成功', res.data)
        alert('更新密碼成功')
        return true
      } catch (err) {
        const message = err.response.data.message
        this.$patch({ isLoading: false, errorMsg: `更新密碼失敗，${message}` })
        checkConsole('更新密碼失敗', err.response)
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
    // 編輯會員資料
    async updateUserInfo(payload) {
      try {
        this.$patch({ isLoading: true })
        const api = `${import.meta.env.VITE_APP_API}/api/user/profile`
        const paramData = {
          name: payload.name,
          sex: payload.sex,
          photo: payload.photo,
        }

        const res = await axios.patch(api, paramData, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        this.$patch({ isLoading: false, userInfo: res.data.data.user })
        checkConsole('編輯會員資料成功', res.data)
        alert('編輯會員資料成功')
      } catch (err) {
        const message = err.response.data.message
        this.$patch({ isLoading: false, errorMsg: `編輯會員資料失敗，${message}` })
        checkConsole('編輯會員資料失敗', err.response)
      }
    },
    //* 取得個人動態牆
    async getUserWall(payload) {
      try {
        this.$patch({ isLoading: true })

        const api = `${import.meta.env.VITE_APP_API}/api/user/profileWall/${payload.user_id}`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        this.$patch({ isLoading: false })
        checkConsole('取得個人動態牆成功', res.data)
        return res.data.data
      } catch (err) {
        checkConsole('取得個人動態牆失敗', err.response)
        this.$patch({ isLoading: false })
        router.replace('posts-wall')
        alert('目前無法查看此內容，查無使用者或系統忙碌中')
      }
    },
    // 取得貼文列表
    async getPosts(payload) {
      try {
        this.$patch({ isLoading: true })
  
        let { timeSort, content, userId } = payload
        if (!userId) userId = ''

        const query = `timeSort=${timeSort}&q=${content}&userId=${userId}`
        const api = `${import.meta.env.VITE_APP_API}/api/posts?${query}`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        checkConsole('取得貼文列表成功', res.data)
        this.$patch({ isLoading: false })
        return res.data.data
      } catch (err) {
        this.$patch({ isLoading: false })
        checkConsole('取得貼文列表失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 上傳圖片
    async uploadImage(payload) {
      try {
        this.$patch({ isLoading: true })

        const api = `${import.meta.env.VITE_APP_API}/api/upload`
        const formData = new FormData()
        formData.append('image', payload)

        const res = await axios.post(api, formData, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        const imageUrl = res.data.data.url
  
        checkConsole('上傳圖片成功', res.data)
        return imageUrl
      } catch (err) {
        const message = err.response.data.message
        this.$patch({ isLoading: false, errorMsg: `上傳圖片失敗，${message}` })
        checkConsole('上傳圖片失敗', err.response)
      }
    }
  },
  persist: true
})