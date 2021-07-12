import store from '../store/index.js';

export default class Song {
	constructor({
		id,
		mid,
		singer,
		name,
		album,
		duration,
		image,
		url
	}) {
		this._id = id
		this.id = id
		this.mid = mid
		this.singer = singer
		this.name = name
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url
		this.lyric = ''
	}
	getLyric() {
		if (this.lyric) {
			return Promise.resolve(this.lyric)
		}
		const id = this.id
		const that = this
		return new Promise((resolve, reject) => {

			wx.cloud.callFunction({
				name: 'getLyric',
				data: {
					id
				}
			}).then(res => {
				const {
					code,
					lrc,
					tlyric
				} = res.result.data
				if (code === 200) {
					const lyric = {
						lrc: lrc.lyric,
						tlyric: tlyric.lyric
					}
					store.commit('SET_SONG_LYRIC', {
						id,
						lyric
					})
					resolve(lyric)
				} else {
					reject(res)
				}

			}).catch(err => {
				reject(err)
			})
		})
	}

	getUrl() {
		if (this.url) {
			return Promise.resolve(this.url)
		}
		const id = this.id
		const that = this
		return new Promise(async (resolve, reject) => {
			wx.cloud.callFunction({
				name: 'getUrl',
				data: {
					id
				}
			}).then(res => {
				const {
					code,
					data
				} = res.result.data
				if (code === 200) {
					const url = data[0].url
					// 缓存url
					store.commit('SET_SONG_URL', {
						id,
						url
					})
					resolve(url)
				} else {
					reject(res)
				}
			}).catch(err => {
				reject(err)
			})
		})
	}
}


export function createSong(musicData) {
	return new Song({
		id: musicData.id,
		mid: musicData.ar[0].id || '', // 歌手id
		singer: musicData.ar[0].name || '',
		name: musicData.name,
		album: musicData.al.name,
		duration: parseInt(musicData.dt / 1000),
		image: musicData.al.picUrl,
		url: '',
	})
}
