// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	// API 调用都保持和云函数当前所在环境一致
	env: cloud.DYNAMIC_CURRENT_ENV,
})

const users = cloud.database().collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
	const {
		OPENID
	} = cloud.getWXContext()
	const {
		baseInfo = {}
	} = event

	return new Promise(async (resolve, reject) => {
		try {
			const res = await users.doc(OPENID).get()
			resolve({
				data: res.data
			})
		} catch (err) {
			if (err.errCode !== -1) {
				resolve({
					data: null
				})
				return 
			}
			
			// 未查找到该用户，添加新用户
			// console.log('未找到该用户')
			const user = {
				_id: OPENID, // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
				baseInfo,
				collect_question: [],
				error_question: [],
				sigin_list: [],
				school: '',
				major: ''
			}
			try {
				const addRes = await users.add({
					data: user
				})
				resolve({
					data: user
				})
			} catch (error2) {
				reject({
					error: error2
				})
			}
		}

	})




}
