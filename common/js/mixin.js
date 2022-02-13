import {
	mapGetters,
	mapMutations
} from 'vuex'

export const answerMixin = {
	props: {
		index: {
			type: Number,
			default: 0
		},
		question: {
			type: Object,
			default: () => (null)
		}
	},
	data() {
		return {
			showNoteFlag: true
		}
	},
	computed: {
		...mapGetters('answer', ['checkedList'])
	},
	methods: {
		isChecked(val) {
			return this.checkedList.includes(val)
		},
		isCorrect(val) {
			if (this.question.record) {
				const keys = this.question.keys
				const answer = this.question.record.answer
				if (answer.includes(val)) {
					if (keys.includes(val)) {
						return 'correct'
					} else {
						return 'error'
					}
				}
				if (keys.includes(val)) return 'correct'
			}
		},
		handleSelect(value) {
			const index = this.checkedList.indexOf(value)
			switch (String(this.question.question_type)) {
				case '1': // 选择题
					if (index !== -1) {
						this.setCheckedList([])
					} else {
						this.setCheckedList([value])
					}
					break;

				case '2': // 多选题
					if (index !== -1) {
						// 浅拷贝
						const currentCheckedList = this.checkedList.slice()
						currentCheckedList.splice(index, 1)
						this.setCheckedList(currentCheckedList)
					} else {
						this.setCheckedList([...this.checkedList, value])
					}
					break;

				case '3': // 填空题
					break;

				case '4': // 判断题
					break;
			}


		},

		handleShowNoteModal() {
			this.setShowNoteFlag(true)
		},
		...mapMutations('answer', ['setCheckedList', 'setShowNoteFlag'])
	},
}
