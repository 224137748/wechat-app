import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import {CLOUD_ENV} from 'config/index.js'
Vue.config.productionTip = false

App.mpType = 'app'
wx.cloud.init({
	env: CLOUD_ENV,
	traceUser: true,
})

const app = new Vue({
    ...App,
	store
})
app.$mount()
