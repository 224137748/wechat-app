import * as types from './mutation-types.js';

const mututations = {
	[types.SET_STATUS_BAR_HEIGHT](state, height) {
		state.statusBarHeight = height
	},
	[types.SET_SHEET_DATA](state, sheetData) {
		state.sheetData = sheetData
	},
	[types.SET_PLAYING_STATE](state, falg) {
		state.playing = falg
	},
	[types.SET_PALYLIST](state, list) {
		state.playList = list
	},
	[types.SET_CURRENT_INDEX](state, index) {
		state.currentIndex = index
	},
	[types.SET_FAVORITE_LIST](state, list) {
		state.favoriteList = list
	}
}


export default mututations