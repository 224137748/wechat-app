// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const instance = axios.create({
	baseURL: 'http://findream.vip/api/music',
	timeout: 100000
})

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'dev-2g6vkydrb65a226e',
})



// 云函数入口函数
exports.main = async (event, context) => {
	try {
		const res = await instance.get('/playlist/detail?id=72751590')
		return {
			data: res.data
		}	
	} catch(err) {
		return {
			err
		}
	}
}