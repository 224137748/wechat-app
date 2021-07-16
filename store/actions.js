import * as types from './mutation-types.js'
import {
	createSong
} from '../utils/song.js';
import {
	CLOUD_ENV
} from '../config/index.js'
import axios from 'axios';

const request = axios.create({
	baseURL: 'http://findream.vip/api/music',
	timeout: 100000
})

function findIndex(list, song) {
	return list.findIndex((item) => {
		// 由于qq和网易云音频资源不一样，没有用id作为歌曲的标识
		// return item.id === song.id
		return item.name === song.name
	})
}

export const getStatusBarHeight = function({
	commit
}) {
	wx.getSystemInfo({
		success(res) {
			const {
				statusBarHeight
			} = res
			commit(types.SET_STATUS_BAR_HEIGHT, statusBarHeight)
		},
	})
}

// 获取歌单详情
export const getSheetData = function({
	commit,
	state
}, {
	type
}) {
	const {
		sheetData
	} = state
	// 如果有缓存，这不发送请求
	if (sheetData.length && sheetData.find(item => item.type === type)) return

	wx.showLoading({
		title: '加载中...'
	});
	const db = wx.cloud.database({
		env: CLOUD_ENV
	})
	wx.cloud
		.callFunction({
			name: 'getSheet'
		})
		.then(res => {
			// console.log('=====', res)
			// const songIds = res.result.data.playlist.trackIds.map(item => item.id).toString()
			// console.log(songIds)
			// request.get('/song/detail', {params: {ids: songIds}}).then(response => {
			// 	console.log(response)
			// })

			// let data = res.result.data;
			let data = res.result.data.playlist.tracks;
			
			console.log('data', data);
			
			data = data.filter(item => !!item.id).map(item => createSong(item))
			// const saveSongs = data.slice(47,59)
			// saveSongs.forEach(item => {
			// 	item.type = 'cet4'
			// 	db.collection('songs').add({
			// 		data: item
			// 	})
			// }) 
			data.type = type;
			commit(types.SET_SHEET_DATA, [...sheetData, data]);
		})
		.finally(() => {
			wx.hideLoading()
		});
}

export const selectPlay = function({
	commit,
	state
}, {
	list,
	index
}) {
	commit(types.SET_SEQUENCE_LIST, list)
	if (state.mode === playMode.random) {
		let randomList = shuffle(list)
		commit(types.SET_PALYLIST, randomList)
		index = findIndex(randomList, list[index])
	} else {
		commit(types.SET_PALYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}


// 插入歌曲
export const insertSong = function({
	commit,
	state
}, song) {
	let playList = state.playList.slice()
	// let sequenceList = state.sequenceList.slice()
	let currentIndex

	// 当前播放列表中没有歌曲
	if (!playList.length) {
		playList.push(song)
		currentIndex = 0
	} else {
		currentIndex = state.currentIndex
		// 记录当前歌曲
		let currentSong = playList[currentIndex]
		// 查找当前列表中是否有待插入的歌曲，并返回其索引
		let fpIndex = findIndex(playList, song)
		// 因为是插入歌曲，所以索引+1
		currentIndex++
		// 插入这首歌到当前索引位置
		playList.splice(currentIndex, 0, song)
		// 如果已经包含了这首歌
		if (fpIndex > -1) {
			// 如果当前插入的序号，大于列表中的序号
			if (currentIndex > fpIndex) {
				playList.splice(fpIndex, 1)
				currentIndex--
			} else {
				playList.splice(fpIndex + 1, 1)
			}
		}
	}


	commit(types.SET_PALYLIST, playList)
	// commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	// commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}
