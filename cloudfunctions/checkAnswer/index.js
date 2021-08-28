// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	// API 调用都保持和云函数当前所在环境一致
	env: 'dev-7guaxwhaeba52343',
})
const db = cloud.database()
const _ = db.command
const dbQuestion = db.collection('computer_question')
const dbusers = db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
	const {OPENID} = cloud.getWXContext()
	const {id,status} = event
	
	try {
		const res = await dbQuestion.where({
			answer_status: {openId: OPENID}
		})
		return {
			data: res.data,
			errno: 0,
			msg: 'success'
		}
	} catch(err => {
		return {
			error: err,
			errno: 500,
			msg: err
		}
	})


	return {
		data: {},
		errno: 0,
		msg: 'success'
	}
}
