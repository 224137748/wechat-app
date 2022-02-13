// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const instance = axios.create({
	baseURL: 'http://findream.vip/api/music',
	timeout: 100000
})

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
})



// 云函数入口函数
exports.main = async (event, context) => {
	try {
		const res = await instance.get('/playlist/detail?id=72751590')
		const songIds = res.data.playlist.trackIds.map(item => item.id).toString()
		const songRes = await instance.get('/song/detail', { params : {ids: songIds}})
		// console.log('songRes', songRes)
		const songData = songRes.data.songs || []
		return {
			data: songData
		}	
	} catch(err) {
		return {
			err,
			code: 500
		}
	}
}