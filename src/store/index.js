import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    currentActive: []
  },
  mutations: {
    setCurActive(state, val) {
      // 数据处理，存储store
      state.currentActive = val.split(''); 
    }
  },
  actions: {
    getData({ commit }, payload) {
      payload && setTimeout(() => {
        // 异步获取数据
        commit("setCurActive", payload);
      }, 1000);
    }
  }
})

export default store;