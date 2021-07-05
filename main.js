import Vue from 'vue'
import App from './App'
import store from './store/index.js'
Vue.config.productionTip = false

App.mpType = 'app'
wx.cloud.init({
	env: 'dev-2g6vkydrb65a226e',
	traceUser: true,
})

const app = new Vue({
    ...App,
	store
})
app.$mount()
