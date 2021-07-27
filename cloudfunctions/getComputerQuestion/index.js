// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	// API 调用都保持和云函数当前所在环境一致
	env: 'dev-2g6vkydrb65a226e',
})

const db = cloud.database()

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
	// 先取出集合记录总数
	const countResult = await db.collection('computer_question').count()
	const total = countResult.total
	// 计算需分几次取
	const batchTimes = Math.ceil(total / MAX_LIMIT)
	// 承载所有读操作的 promise 的数组
	const tasks = []
	for (let i = 0; i < batchTimes; i++) {
		const promise = db.collection('computer_question').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
		tasks.push(promise)
	}
	// 等待所有
	return (await Promise.all(tasks)).reduce((acc, cur) => {
		return {
			data: acc.data.concat(cur.data),
			errMsg: acc.errMsg,
		}
	})
}
