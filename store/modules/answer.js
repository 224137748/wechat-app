import { cloneDeep } from 'lodash-es'

// 初始化的值
const initState = {
	titleType: '',
	questionList: [],
	
	// 当前题目，用户的选择项
	checkedList: [],

	// 展示提示弹窗
	showNoteFlag: true
}

const answer = {
	namespaced: true,
	state: cloneDeep(initState),
	getters: {
		titleType: state => state.titleType,
		questionList: state => state.questionList,
		checkedList: state => state.checkedList,
		showNoteFlag: state => state.showNoteFlag
	},
	mutations: {
		// 设置state公共方法
		setAnswerState(state, dataArray) {
			if (Array.isArray(dataArray)) {
				dataArray.forEach(({
					key,
					value
				}) => {
					if (Reflect.has(state, key)) {
						Reflect.set(state, key, value)
					}
				})
			}
		},
		setCheckedList(state, checkedList) {
			state.checkedList = checkedList
		},

		setShowNoteFlag(state, flag) {
			state.showNoteFlag = flag
		},
		
		// 恢复默认的状态
		setDefaultState(state) {
			Object.keys(initState).forEach(key => {
				Reflect.set(state, key, initState[key])
			})
		}
	},
	actions: {
		dispatchCheckAnswer({
			commit,
			state
		}, ) {

		}
	},
}

export default answer;
