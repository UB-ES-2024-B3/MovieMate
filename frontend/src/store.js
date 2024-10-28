import { createStore } from 'vuex';

export default createStore({
  state: {
    userData: null
  },
  mutations: {
    setUserData(state, data) {
      state.userData = data;
    },
    clearUserData(state) {
      state.userData = null;
    }
  },
  actions: {
    setUserData({ commit }, data) {
      commit('setUserData', data);
    },
    clearUserData({ commit }) {
      commit('clearUserData');
    }
  }
});