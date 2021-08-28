// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	// API 调用都保持和云函数当前所在环境一致
	env: 'dev-7guaxwhaeba52343',
})

const db = cloud.database()
const questions = db.collection('questions')
const _ = db.command
const $ = _.aggregate

const MAX_LIMIT = 100



// 云函数入口函数
exports.main = async (event, context) => {
	let { subject_type } = event
	const { OPENID } = cloud.getWXContext()
	subject_type = parseInt(subject_type)
	try{
		const res = await questions.aggregate()
				.match({
					subject_type: subject_type
				})
				.sort({
					section_type: 1
				})
				.lookup({
					from: 'records',
					let: {
						question_id: '$_id',
						user_id: OPENID
					},
					pipeline: $.pipeline()
						.match(_.expr(
							$.eq(['$question_id', '$$question_id'])
						))
						.project({
							_id: 0,
							question_id: 0,
							user_id: 0
						})
						.done(),
					as: 'record'
				})
				.addFields({
					record: $.cond({
						if: $.isArray('$record'),
						then:$.arrayElemAt(['$record', 0]),
						else: false
					})
				})
				.group({
				    _id: '$section_type',
				    list: $.push({
				      question_id: '$_id',
				      question: '$question',
				      answers: '$answers',
				      question_type: '$question_type',
				      keys: '$keys',
				      record: '$record'
				    })
				  })
				  .sort({
					  _id: 1
				  })
				.end()
				
				return {
					data: res.list || [],
					msg: 'success'
				}
				
	}catch(e){
		//TODO handle the exception
		return {
			data: null,
			error:e
		}
	}
}
