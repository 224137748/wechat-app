
const answer = {
	namespaced: true,
	state: {
		titleType: '',
		questionList: [],
	},
	getters: {
		titleType: state => state.titleType,
		questionList: state => state.questionList
	},
	mutations: {
		// 设置state公共方法
		setDataHelper(state, dataArray) {
			if (Array.isArray(dataArray)) {
				dataArray.forEach(({key, value}) => {
					if (Reflect.has(state,key)) {
						Reflect.set(state, key, value)
					}
				})
			}
		}
	},
	actions: {},
}

export default answer;