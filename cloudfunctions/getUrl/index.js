// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const instance = axios.create({
	baseURL: 'http://findream.vip/api/music',
	timeout: 100000
})

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'dev-7guaxwhaeba52343',
})



// 云函数入口函数
exports.main = async (event, context) => {
	const {id} = event
	try {
		const res = await instance.get('/song/url', {params: {
			id
		}})
		return {
			data: res.data
		}	
	} catch(err) {
		return {
			code: 500,
			err
		}
	}
}