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
      localStorage.removeItem('tokenExpiration')
      
      context.commit('clearInfo')
      router.replace('/auth')
    },
    tryLogin(context) {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const tokenExpiration = localStorage.getItem('tokenExpiration')
      
      const expiresIn = +tokenExpiration - new Date().getTime()
    
      if (expiresIn < 0) {
        return context.commit('isLogin', false)
      }

      if (token && userId) {
        context.commit('isLogin', true)
        context.commit('setUser', {
          token: token,
          userId: userId,
        })
      }
    },
    handleAuth(context, payload) {
      // const expiresIn = 1000 * 60 * 1 // 分鐘
      const expiresIn = 1000 * 3600 * 24 * 7 // 7day
      const expirationDate = new Date().getTime() + expiresIn
      const { token, userId } = payload

      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      localStorage.setItem('tokenExpiration', expirationDate)

      context.commit('setUser', { token, userId })
    },
    // 登入
    async login(context, payload) {
      try {
        context.commit('setIsLoading', true)
        
        const api = `${import.meta.env.VITE_APP_API}/api/user/login`
        const { email, password } = payload
        
        const res = await axios.post(api, { email, password })
        const data = res.data.data

        context.dispatch('handleAuth', {
          token: data.token,
          userId: data.user._id
        })
        context.dispatch('getUserInfo')
        
        context.commit('isLogin', true)
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
    // 註冊
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
    // 更新密碼 
    async updatePassword(context, payload) {
      try {
        context.commit('setIsLoading', true)
        const api = `${import.meta.env.VITE_APP_API}/api/user/updatePassword`
        const paramData = {
          password: payload.password,
          confirmPassword: payload.confirmPassword
        }
  
        const res = await axios.post(api, paramData, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        context.commit('setIsLoading', false)
        checkConsole('更新密碼成功', res.data)
        alert('更新密碼成功')
        return true
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `更新密碼失敗，${message}`)
        checkConsole('更新密碼失敗', err.response)
      }
    },
    // 取得會員資料
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
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('取得會員資料失敗', err.response)
      }
    },
    // 編輯會員資料
    async updateUserInfo(context, payload) {
      try {
        context.commit('setIsLoading', true)
        const api = `${import.meta.env.VITE_APP_API}/api/user/profile`
        const paramData = {
          name: payload.name,
          sex: payload.sex,
          photo: payload.photo,
        }

        const res = await axios.patch(api, paramData, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        context.commit('setIsLoading', false)
        context.commit('setUserInfo', res.data.data.user)
        checkConsole('編輯會員資料成功', res.data)
        alert('編輯會員資料成功')
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `編輯會員資料失敗，${message}`)
        checkConsole('編輯會員資料失敗', err.response)
      }
    },
    // 取得個人動態牆
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
    // 取得個人留言名單
    async getCommentPostList(context) {
      try {
        context.commit('setIsLoading', true)

        const api = `${import.meta.env.VITE_APP_API}/api/user/comments`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        context.commit('setIsLoading', false)
        checkConsole('取得個人留言名單成功', res.data)
        return res.data.data
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('取得個人留言名單失敗', err.response)
        alert('系統忙碌中,請稍後在試')
      }
    },
    // 取得個人按讚名單
    async getLikePostList(context) {
      try {
        context.commit('setIsLoading', true)

        const api = `${import.meta.env.VITE_APP_API}/api/user/likes`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        context.commit('setIsLoading', false)
        checkConsole('取得個人按讚名單成功', res.data)
        return res.data.data
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('取得個人按讚名單失敗', err.response)
        alert('系統忙碌中,請稍後在試')
      }
    },
    // 取得個人追蹤名單
    async getFollowUserList(context) {
      try {
        context.commit('setIsLoading', true)

        const api = `${import.meta.env.VITE_APP_API}/api/user/follows`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        context.commit('setIsLoading', false)
        checkConsole('取得個人追蹤名單成功', res.data)
        return res.data.data
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('取得個人追蹤名單失敗', err.response)
        alert('系統忙碌中,請稍後在試')
      }
    },
    // 追蹤朋友
    async followUser(context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/user/${payload.user_id}/follow`
        const res = await axios.post(api, {}, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('追蹤朋友成功', res.data)
        alert('追蹤成功')
      } catch (err) {
        checkConsole('追蹤朋友失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 取消追蹤朋友
    async unfollowUser(context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/user/${payload.user_id}/follow`
        const res = await axios.delete(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('取消追蹤朋友成功', res.data)
        alert('取消追蹤成功')
      } catch (err) {
        checkConsole('取消追蹤朋友失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 編輯一則個人留言
    async updatePostComment(context, payload) {
      try {
        context.commit('setIsLoading', true)

        const api = `${import.meta.env.VITE_APP_API}/api/user/comment/${payload.commentId}`
        const paramData = {
          comment: payload.comment
        }

        const res = await axios.patch(api, paramData, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('編輯一則留言成功', res.data)
        return true
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('編輯一則留言失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 刪除一則個人留言
    async canclePostComment(context, payload) {
      try {
        context.commit('setIsLoading', true)

        const api = `${import.meta.env.VITE_APP_API}/api/user/comment/${payload.commentId}`
        let check = confirm('是否要刪除此則留言')
        if (!check) return

        const res = await axios.delete(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('刪除一則留言成功', res.data)
        return true
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('刪除一則留言失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 取得貼文列表
    async getPosts(context, payload) {
      try {
        context.commit('setIsLoading', true)
        let { timeSort, content, userId } = payload
        if (!userId) userId = ''

        const query = `timeSort=${timeSort}&q=${content}&userId=${userId}`
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
    // 取得一則貼文
    async getOnePost(context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/post/${payload.postId}`
        const res = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })

        checkConsole('取得一則貼文成功', res.data)
        return res.data.data
      } catch (err) {
        checkConsole('取得一則貼文失敗', err.response)
      }
    },
    // 新增一則貼文
    async createPost(context, payload) {
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
        router.push('posts-wall')
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `新增貼文失敗，${message}`)
        checkConsole('新增貼文失敗', err.response)
      }
    },
    // 編輯一則貼文
    async updatePost(context, payload) {
      try {
        context.commit('setIsLoading', true)
        const api = `${import.meta.env.VITE_APP_API}/api/post/${payload.postId}`
        const paramData = {
          content: payload.content,
          image: payload.image
        }

        const res = await axios.patch(api, paramData, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        context.commit('setIsLoading', false)
        checkConsole('編輯一則貼文成功', res.data)
        return true
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('編輯一則貼文失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 刪除一則貼文
    async deleteOnePost(context, payload) {
      try {
        context.commit('setIsLoading', true)
        const api = `${import.meta.env.VITE_APP_API}/api/post/${payload.postId}`
        let check = confirm('是否要刪除此則貼文')
        if (!check) return

        const res = await axios.delete(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        context.commit('setIsLoading', false)
        checkConsole('刪除一則貼文成功', res.data)
        return true
      } catch (err) {
        context.commit('setIsLoading', false)
        checkConsole('刪除一則貼文失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 新增一則貼文的留言
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
    // 新增一則貼文的讚
    async addPostLike(context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/post/${payload.postId}/like`
        const res = await axios.post(api, {}, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('新增貼文的讚成功', res)
        return true
      } catch (err) {
        checkConsole('新增貼文的讚失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 取消一則貼文的讚
    async canclePostLike(context, payload) {
      try {
        const api = `${import.meta.env.VITE_APP_API}/api/post/${payload.postId}/like`
        const res = await axios.delete(api, {
          headers: {
            Authorization: `Bearer ${context.getters.token}`
          }
        })
        
        checkConsole('取消貼文的讚成功', res)
        return true
      } catch (err) {
        checkConsole('取消貼文的讚失敗', err.response)
        alert('系統忙碌中，請稍後再試')
      }
    },
    // 上傳圖片
    async uploadImage(context, payload) {
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
  
        checkConsole('上傳圖片成功', res.data)
        return imageUrl
      } catch (err) {
        const message = err.response.data.message
        context.commit('setIsLoading', false)
        context.commit('setErrorMag', `上傳圖片失敗，${message}`)
        checkConsole('上傳圖片失敗', err.response)
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
