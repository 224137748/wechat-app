import {
	cloneDeep
} from 'lodash-es'

// 初始化的值
const initState = {
	titleType: '',
	questionList: [],

	// 当前题目，用户的选择项
	checkedList: [],

	// 展示提示弹窗
	showNoteFlag: false,

	// 当前题目在列表中的序号
	activeIndex: 0
}

const answer = {
	namespaced: true,
	state: cloneDeep(initState),
	getters: {
		titleType: state => state.titleType,
		questionList: state => state.questionList,
		checkedList: state => state.checkedList,
		showNoteFlag: state => state.showNoteFlag,
		activeIndex: state => state.activeIndex,
		currentQuestion: ({
			questionList,
			activeIndex
		}) => questionList[activeIndex]
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
		}) {
			wx.showLoading({
				title: '加载中...',
				mask: true
			})
			const {currentQuestion, checkedList} = state
			
			wx.cloud.callFunction()({
				name: 'checkAnswer',
				data: {
					id: currentQuestion._id,
					answer: checkedList
				}
			})
			.then(res => {
				console.log('checkAnswer_res', res)
			})
			.catch(err => {
				console.log('checkAnswer_err', err)
			})
			.finally(() => {
				wx.hideLoading()
			})



		}
	},
}

export default answer;
