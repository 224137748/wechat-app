import * as types from './mutation-types.js';

const mututations = {
	[types.SET_STATUS_BAR_HEIGHT](state, height) {
		state.statusBarHeight = height
	},
	[types.SET_IS_HIDE](state, flag) {
		state.isHide = flag
	},
	[types.SET_SHEET_DATA](state, sheetData) {
		state.sheetData = sheetData
	},
	[types.SET_SONG_READY](state, flag) {
		state.songReady = flag
	},
	[types.SET_PLAYING_STATE](state, flag) {
		state.playing = flag
	},
	[types.SET_SEQUENCE_LIST](state, list) {
		state.sequenceList = list
	},
	[types.SET_PALYLIST](state, list) {
		state.playList = list
	},
	[types.SET_CURRENT_INDEX](state, index) {
		state.currentIndex = index
	},
	[types.SET_FAVORITE_LIST](state, list) {
		state.favoriteList = list
	},
	[types.SET_SONG_URL](state, {id, url}) {
		const song = state.playList.find(item => item.id === id)
		if (song) {
			song.url = url
		}
	},
	[types.SET_SONG_LYRIC](state, {id, lyric}) {
		const song = state.playList.find(item => item.id === id)
		if (song) {
			song.lyric = lyric
		}
	},
	[types.SET_CURRENT_TIME](state, time) {
		state.currentTime = time
	},
	[types.SET_MODE](state, mode) {
		state.mode = mode
	},
	[types.SET_USERINFO](state, userInfo) {
		state.userInfo = userInfo
	}
}


export default mututations