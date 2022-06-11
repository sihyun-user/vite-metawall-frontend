import { createStore } from 'vuex'
import router from '../router/index'
import axios from 'axios'
import handleService from '../service/helpers'

export default createStore({
  state: {
    token: null,
    userId: null,
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
    setIsLoading(state, payload) {
      return state.isLoading = payload
    },
    setErrorMag(state, payload) {
      return state.errorMsg = payload
    }
  },
  actions: {
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
        handleService.checkConsole('登入成功', res.data)
        router.push('posts-wall')
        alert('登入成功')
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `登入失敗，${message}`)
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
        handleService.checkConsole('註冊成功', res.data)
        alert('註冊成功,請重新登入')
        return true
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `註冊失敗，${message}`)
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
        context.commit('setIsLoading', false)
  
        return res.data.data
      } catch (error) {
        console.log(error)
        context.commit('setIsLoading', false)
        alert('系統忙碌中，請稍後再試')
      }
    },
    logout(context) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      
      context.commit('isLogin', false)
      context.commit('setUser', {
        token: null,
        userId: null
      })

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
    }
  },
  getters: {
    userId(state) {
      return state.userId
    },
    token(state) {
      return state.token
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
