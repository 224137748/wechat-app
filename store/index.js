import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions.js'
import * as getters from './getters.js'
import state from './state.js'
import mutations from './mutations.js'
import creatLogger from 'vuex/dist/logger'
import answer from './modules/answer.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
	modules: {
		answer
	},
	actions,
	getters,
	state,
	mutations,
	strict: debug,
	plugins: debug ? [creatLogger()] : []
})
