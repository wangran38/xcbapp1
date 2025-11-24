import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import cart from './modules/cart.js';
import location from './modules/location.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cart,
	location
  },
  plugins: [
    createPersistedState({
      // 指定需要持久化的模块
      paths: ['cart'],
	   storage: {
	        getItem: (key) => uni.getStorageSync(key),
	        setItem: (key, val) => uni.setStorageSync(key, val),
	        removeItem: (key) => uni.removeStorageSync(key)
	    }
    }),
  ],
});
