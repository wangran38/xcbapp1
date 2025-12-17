
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 混入分享js
import Share from '@/utils/Share.js'
import { createPinia } from 'pinia'




Vue.config.productionTip = false

const pinia = createPinia()

Vue.mixin(Share)

App.mpType = 'app'

const app = new Vue({
    ...App
})

app.use(pinia)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import Share from '@/utils/Share.js'
import { createPinia } from 'pinia'
const pinia = createPinia()
export function createApp() {
  const app = createSSRApp(App)
  app.mixin(Share)
  app.use(pinia) 
  return {
    app
  }
}
// #endif