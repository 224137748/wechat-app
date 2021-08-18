// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	// API 调用都保持和云函数当前所在环境一致
	env: 'dev-2g6vkydrb65a226e',
})
const db = cloud.database()
const _ = db.command
const dbQuestion = db.collection('computer_question')
const dbusers = db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
	const {
		OPENID
	} = cloud.getWXContext()
	const {
		id,
		answer
	} = event
	const {data: {keys,answer_status = []}} = await dbQuestion.doc(id).get()

	// 判断是否回答正确
	const status = keys.length === answer.length && keys.every(key => answer.includes(key))

	// 查看是否有答题记录
	const index = answer_status.findIndex(item => item.openId === OPENID)
	try {
		if (index !== -1) {
			// 插入一条记录
			await dbQuestion.doc(id).update({
				data: {
					answer_status: _.push({
						openId: OPENID,
						status
					})
				}
			})
			
			// 如果答题错误，用户记录一条错误数据
			if (!status) {
				const {data: {error_question}} = await dbusers.doc(OPENID).get()
				
				await dbusers.doc(OPENID).update({
					data: {
						
					}
				})
				
			}
		} else {
			
		}
		
	} catch(error) {
		
	}

	return {
		id,
		answer
	}
}
