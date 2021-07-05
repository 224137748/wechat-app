import * as types from './mutation-types.js'

export const getStatusBarHeight = function ({commit}) {
	wx.getSystemInfo({
		success(res) {
			const {statusBarHeight} = res
			commit(types.SET_STATUS_BAR_HEIGHT, statusBarHeight)
		},
	})
}

// 获取歌单详情
export const getSheetData = function({commit, state}, {type}) {
	const { sheetData } = state
	// 如果有缓存，这不发送请求
	if (sheetData.length && sheetData.find(item => item.type === type)) return
	
	wx.showLoading({
		title:'加载中...'
	});
	
	wx.cloud
		.callFunction({
			name: 'getSheet'
		})
		.then(res => {
			const data = res.result.data.playlist;
			// console.log('data', data);
			data.type = type;
			commit(types.SET_SHEET_DATA, [...sheetData, data]);
		})
		.finally(() => {
			wx.hideLoading()
		});
}