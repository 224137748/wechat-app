// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	// API 调用都保持和云函数当前所在环境一致
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command
const dbQuestion = db.collection('questions')
const errorQuestion = db.collection('error_question')
const records = db.collection('records')

// 云函数入口函数
exports.main = async (event, context) => {
	const {
		OPENID
	} = cloud.getWXContext()
	const {
		question_id,
		status,
		answer
	} = event

	let errorQuestionTask
	let recordTask

	// 存入错题集
	if (status === 0) {
		const hasErrRecord = await errorQuestion.where({
				question_id,
				user_id: OPENID
			})
			.count()
		// console.log('error_questions', hasErrRecord)
		if (hasErrRecord.total === 0) {
			errorQuestionTask = errorQuestion.add({
				data: {
					user_id: OPENID,
					question_id: question_id,
					answer,
					status,
					createTime: db.serverDate(),
					updateTime: db.serverDate()
				}
			})
		} else {
			errorQuestionTask = errorQuestion.where({
				question_id,
				user_id: OPENID
			}).update({
				data: {
					updateTime: db.serverDate()
				}
			})
		}

	}

	// 添加答题记录

	const answerRecord = await records.where({
			question_id: question_id,
			user_id: OPENID
		})
		.count()
		
	// console.log('records___', answerRecord)
	
	if (answerRecord.total === 0) {
		recordTask = records.add({
			data: {
				user_id: OPENID,
				question_id,
				status,
				answer,
				createTime: db.serverDate(),
				updateTime: db.serverDate()
			}
		})
	} else {
		recordTask = records.where({
			question_id,
			user_id: OPENID
		})
		.update({
			data: {
				updateTime: db.serverDate()
			}
		})
	}

	const taskRes = await Promise.all([errorQuestionTask, recordTask].filter(task => !!task))
	// console.log('taskRes  ', taskRes)

	return {
		data: taskRes,
		errno: 0,
		msg: 'success'
	}
}
