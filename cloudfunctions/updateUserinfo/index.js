// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'dev-7guaxwhaeba52343',
})

const users = cloud.database().collection('users')
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { baseInfo } = event
  return new Promise(async (resolve, reject) => {
	users.doc(OPENID).update({
		data: {
			baseInfo
		},
		success(res) {
			console.log('res_dddd', res)
			resolve({
				data: res,
				msg: 'ok'
			})
		},
		fail(err) {
			reject({
				data: err,
				msg: 'update_fail'
			})
		}
	})
	  
  })
}