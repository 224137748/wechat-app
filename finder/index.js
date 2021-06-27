const axios = require('axios')
const path = require('path')
const fs = require('fs')
const download = require('download')
const keywords = '英语听力'
const songSheetList = [
	{
		id: 72751590,
		name: '【CET-4】大学四级英语听力训练',
		coverImgUrl: 'https://p1.music.126.net/bGZRUQFioXbQ5djw4g3vJQ==/7842816441727310.jpg'
	},
	{
		id: 2187628778,
		"name": "六级英语听力",
		"coverImgUrl": "https://p1.music.126.net/qcserglI00X_qKn_MBRZ3g==/6037418348550574.jpg"
	},
	{
		id: 3095899474,
		"name": "CET6必过！｜六级英语听力",
		"coverImgUrl": "https://p1.music.126.net/Z4PztBOEGsMShYkc-ro9hw==/5846103325012997.jpg"
	},
	{
		"id": 323785938,
		"name": "大学英语听力四级（失眠专用）",
		"coverImgUrl": "https://p1.music.126.net/qcserglI00X_qKn_MBRZ3g==/6037418348550574.jpg"
	},
	{
		"id": 2136075588,
		"name": "六级英语听力 刷分目标580 ",
		"coverImgUrl": "https://p2.music.126.net/Z4PztBOEGsMShYkc-ro9hw==/5846103325012997.jpg"
	}
]

// 云函数入口文件
const cloud = require('wx-server-sdk')

const instance = axios.create({
	baseURL: 'http://findream.vip/api/music',
	timeout: 100000
})

// 搜索
const getSearchRes = async (keywords) => {
	try{
		const {data: res} = await instance.get('/search', {
			params: {
				keywords,
				type: 1000
			}
		})
		if (res.code === 200) {
			// return res.result
			console.log(res.result.playlists)
		}
	}catch(e){
		console.error(e)
	}
}

// 搜索歌单
const getSongSheet = async () => {
	// 查看歌单详情
	const getSheetDetail = songSheetList.map(sheet => {
		return new Promise((resolve,reject) => {
			instance.get('/playlist/detail', {
				params: {
					id: sheet.id
				}
			}).then(res => {
				if (res.data.code === 200) {
					resolve(res.data.playlist || [])
				}
			}).catch(err => {
				reject(err)
			})
		})
	})
	
	try {
		const sheetList = await Promise.all(getSheetDetail)
		// fs.writeFileSync(path.resolve(__dirname, './sheet_data.json'), JSON.stringify({data: sheetList}))
		
		const songList = sheetList.reduce((acc, cur) => {
			return acc.concat(cur.tracks)
		}, [])
		.filter(item => item.name.includes('真题'))
		
		// fs.writeFileSync(path.resolve(__dirname, './song_data.json'), JSON.stringify({data: songList}))
		
		// 获取歌曲详情
		const getSongDetail = songList.map(song => {
			return new Promise(async (resolve, reject) => {
				const [url, lyric] = await Promise.all([
					instance.get('/song/url', {
						params: {
							id: song.id
						}
					}),
					instance.get('/lyric', {
						params: {
							id: song.id
						}
					})
					
				])
				
				// 下载资源
				const extname = path.extname(url.data.data[0].url)
				download(url.data.data[0].url).pipe(fs.createWriteStream(path.join(__dirname, `dist/${song.id}${extname}`)));
				
				const songData = {
					id: song.id,
					_id: song.id,
					name: song.name || '',
					dt: song.dt || '',
					size: song.l.size || '',
					lrc: {
						lyric: lyric.data.lrc.lyric || '',
						tlyric: lyric.data.tlyric.lyric || ''
					},
				}
				resolve(JSON.stringify(songData))
			})
		})
		
		const songDetailList = await Promise.all(getSongDetail)
		const songDataStr = songDetailList.reduce((acc, cur) => {
			return acc+=cur
		}, '')
		fs.writeFileSync(path.resolve(__dirname, './song_detail_data.json'), songDataStr)
		console.log('============ success ============')
		process.exit()
		
	} catch(e) {
		console.log(e)
	}
}
//  查询歌单
// getSearchRes(keywords)

//  搜索歌单详情
getSongSheet()


// cloud.init()

// 云函数入口函数
// exports.main = async (event, context) => {
//   // const wxContext = cloud.getWXContext()
//   // const {a, b} = event
//   // const sum = a * b

//   // return {
//   //   sum
//   // }
// }