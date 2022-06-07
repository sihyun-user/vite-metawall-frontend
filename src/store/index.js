import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    errorMag: ''
  },
  mutations: {
    setIsLoading(state, payload) {
      return state.isLoading = payload
    },
    setErrorMag(state, payload) {
      return state.errorMag = payload
    }
  },
  actions: {
  },
  getters: {
    isLoading(state) {
      return state.isLoading
    },
    errorMag(state) {
      return state.errorMag
    }
  },
})
