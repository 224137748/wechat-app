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
	watch: {
		checkedList(newVal) {
			if (newVal.length && !this.isEmited) {
				this.isEmited = true
				this.$emit('selected')
				console.log('emit_selected')
			}
			if (!newVal.length) {
				this.isEmited = false
				this.$emit('unSelected')
				console.log('emit_unSelected')
			}
		}
	}
}
