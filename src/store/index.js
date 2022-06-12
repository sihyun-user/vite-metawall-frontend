import { createStore } from 'vuex'
import router from '../router/index'
import axios from 'axios'
import { checkConsole } from '../service/helpers'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  plugins: [createPersistedState()],
  state: {
    token: null,
    userId: null,
    userInfo: {},
    isLogin: false,
    isLoading: false,
    errorMsg: ''
  },
  mutations: {
    isLogin(state, payload) {
      state.isLogin = payload
    },
    setUser(state, payload){
      state.token = payload.token
      state.userId = payload.userId
      // state.didAutoLogout = false
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    setIsLoading(state, payload) {
      return state.isLoading = payload
    },
    setErrorMag(state, payload) {
      return state.errorMsg = payload
    },
    clearInfo(state) {
      state.isLogin = false
      state.token = false
      state.userId = false
      state.userInfo = {}
    }
  },
  actions: {
    logout(context) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      
      context.commit('clearInfo')
      router.replace('/auth')
    },
    tryLogin(context) {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      if(token && userId){
        context.commit('isLogin', true)
        context.commit('setUser', {
          token: token,
          userId: userId,
        })
      }
    },
    async login(context, payload) {
      try {
        context.commit('setIsLoading', true)
        
        const api = `${import.meta.env.VITE_APP_API}/api/user/login`
        const { email, password } = payload
        
        const res = await axios.post(api, { email, password })
        
        const data = res.data.data
        context.commit('isLogin', true)
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user._id)
        context.commit('setUser', {
          token: data.token,
          userId: data.user._id,
        })

        context.commit('setIsLoading', false)
        checkConsole('登入成功', res.data)
        router.push('posts-wall')
        alert('登入成功')
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `登入失敗，${message}`)
        checkConsole('登入失敗', err.response)
      }
    },
    async signup(context, payload) {
      try {
        context.commit('setIsLoading', true)

        const api = `${import.meta.env.VITE_APP_API}/api/user/signup`
        const { name, email, password, confirmPassword } = payload
        
        const res = await axios.post(api, { 
          name, email, password, confirmPassword
        })

        context.commit('setIsLoading', false)
        checkConsole('註冊成功', res.data)
        alert('註冊成功,請重新登入')
        return true
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `註冊失敗，${message}`)
        checkConsole('註冊失敗', err.response)
      }
    },
    async getUserInfo(context) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/user/profile`
        
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        context.commit('setUserInfo', res.data.data.user)
        checkConsole('取得會員資料成功', res.data)
        return res.data.data
      } catch (error) {
        context.commit('setIsLoading', false)
        checkConsole('取得會員資料失敗', res.data)
      }
    },
    //todo: 即時留言更新
    async addPostComment(context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/post/${payload.postId}/comment`

        const paramData = {
          comment: payload.comment
        }

        const res = await axios.post(api, paramData, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        checkConsole('新增貼文的留言成功', res.data)
      } catch (err) {
        checkConsole('新增貼文的留言失敗', err.response)
      }
    },
    async getUserWall(context, payload) {
      try {
        context.commit('setIsLoading', true)

        const api = `${import.meta.env.VITE_APP_API}/api/user/profileWall/${payload.user_id}`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        context.commit('setIsLoading', false)
        checkConsole('取得個人動態牆成功', res.data)
        return res.data.data
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('取得個人動態牆失敗', err.response)
        router.replace('posts-wall')
        alert('目前無法查看此內容，查無使用者或系統忙碌中')
      }
    },
    async followUser (context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/user/${payload.user_id}/follow`
        const res = await axios.post(api, {}, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('追蹤朋友成功', res.data)
      } catch (err) {
        checkConsole('追蹤朋友失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    async unfollowUser (context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/user/${payload.user_id}/follow`
        const res = await axios.delete(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('取消追蹤朋友成功', res.data)
      } catch (err) {
        checkConsole('取消追蹤朋友失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    async getPosts(context, payload) {
      try {
        context.commit('setIsLoading', true)

        const query = `timeSort=${payload.timeSort}&q=${payload.content}`
        const api = `${import.meta.env.VITE_APP_API}/api/posts?${query}`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        checkConsole('取得貼文列表成功', res.data)
        context.commit('setIsLoading', false)
        return res.data.data
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('取得貼文列表失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    async createPost (context, payload) {
      try {
        context.commit('setIsLoading', true)
        const api = `${import.meta.env.VITE_APP_API}/api/post`
        const paramData = {
          content: payload.content,
          image: payload.image
        }

        const res = await axios.post(api, paramData, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        context.commit('setIsLoading', false)
        checkConsole('新增貼文成功', res.data)
        router.push('/posts-wall')
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `新增貼文失敗，${message}`)
        checkConsole('新增貼文失敗', err.response)
      }
    },
    async uploadImage (context, payload) {
      try {
        context.commit('setIsLoading', true)
        const api = `${import.meta.env.VITE_APP_API}/api/upload`
        const formData = new FormData()
        formData.append('image', payload)

        const res = await axios.post(api, formData, {
          headers: {
            'Authorization': `Bearer ${context.getters.token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        const imageUrl = res.data.data.url
  
        checkConsole('上傳貼文圖片成功', res.data)
        return imageUrl
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `新增貼文失敗，${message}`)
        checkConsole('上傳貼文圖片失敗', err.response)
      }
    }
  },
  getters: {
    userId(state) {
      return state.userId
    },
    token(state) {
      return state.token
    },
    hasUserInfo(state) {
      return state.userInfo._id
    },
    userInfo(state) {
      return state.userInfo
    },
    isLogin(state) {
      return state.isLogin
    },
    isLoading(state) {
      return state.isLoading
    },
    errorMsg(state) {
      return state.errorMsg
    }
  },
})
