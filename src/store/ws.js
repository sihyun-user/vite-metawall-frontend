export default {
  namespaced: true,
  state: {
    wsRes: {},
  },
  mutations: {
    setWsRes(state, payload) {
      state.wsRes = payload;
    }
  },
  actions: {

  },
  getters: {
    wsRes(state) {
      return state.wsRes
    }
  }
}