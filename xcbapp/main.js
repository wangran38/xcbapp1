
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store';
// 混入分享js
import Share from '@/utils/Share.js'




Vue.config.productionTip = false

Vue.mixin(Share)

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import Share from '@/utils/Share.js'
// import store from './store'
export function createApp() {
  const app = createSSRApp(App)
  app.mixin(Share)
  // app.use(store) 
  return {
    app
  }
}
// #endif