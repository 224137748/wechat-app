import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
wx.cloud.init({
	env: 'dev-2g6vkydrb65a226e',
	traceUser: true,
})
const app = new Vue({
    ...App
})
app.$mount()
