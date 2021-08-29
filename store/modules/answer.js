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
	activeIndex: 0,
	
	// 展示答题卡
	showAnswerSheetFlag: false
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
		}) => questionList[activeIndex],
		showAnswerSheetFlag: state => state.showAnswerSheetFlag
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

		setAnserResult(state, {
			index,
			answerResult
		}) {
			const question = cloneDeep(state.questionList)
			question[index] = {
				...question[index],
				record: answerResult
			}
			state.questionList = question
		},
		
		// 下一题
		nextQuestion(state) {
			const {activeIndex, questionList} = state
			const length = questionList.length
			if (length === 0) return
			if (activeIndex < length -1) {
				state.activeIndex++
				state.checkedList = []
			}
		},
		
		// 上一题
		prevQuestion(state) {
			const {activeIndex, questionList} = state
			const length = questionList.length
			if (length === 0) return
			if (activeIndex>0) {
				state.activeIndex--
				state.checkedList = []
			}
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
			getters,

		}) {
			wx.showLoading({
				title: '加载中...',
				mask: true
			})
			const {
				checkedList,
				currentQuestion,
				activeIndex
			} = getters
			const {
				keys
			} = currentQuestion
			const status = keys.length === checkedList.length && keys.every(key => checkedList.includes(key))
			wx.cloud.callFunction({
					name: 'checkAnswer',
					data: {
						question_id: currentQuestion.question_id,
						status: status ? 1 : 0,
						answer: checkedList
					}
				})
				.then(res => {
					console.log('checkAnswer_res', res)
					commit('setAnserResult', {
						index: activeIndex,
						answerResult: {
							answer: checkedList,
							status: status ? 1 : 0
						}
					})
					commit('setAnswerState', [
						{key: 'checkedList', value: []}
					])
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
