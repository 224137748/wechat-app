<template>
	<view class="answer-page">
		<top-bar>{{pageTitle}}</top-bar>


		<view class="question-type-wrap">
			<view class="question-type">{{questionType | getTypeText}}</view>
			<view class="question-section-title">{{sectionInfo}}</view>
			<view class="question-order">
				<text class="current-index">{{activeIndex + 1}}</text>/
				<text class="toutal-count">{{questionList.length}}</text>
			</view>
		</view>

		<view class="question-container-wrap" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
			@touchend="handleTouchEnd">
			<view class="question-container">
				<keep-alive>
					<choice :index="activeIndex + 1" :question="currentQuestion"  />
				</keep-alive>
				<answer-result v-if="currentQuestion.record" :question="currentQuestion" :answer="checkedList"></answer-result>
			</view>
		</view>

		<view class="submit-btn" :class="submitBtnCls" @click="handleSubmit">
			<button>
				提交
			</button>
		</view>

		<!-- 提示弹窗 -->
		<modal-wrap v-if="showNoteFlag" title="提示" @close="handleHideNoteModal">
			<rich-text :nodes="noteText"></rich-text>
		</modal-wrap>
		
		<!-- 答题卡 -->
		<modal-wrap v-if="showAnswerSheetFlag" title="答题卡" @close="handleCloseSheetModal">
			<answer-sheet :questionList="questionList" ></answer-sheet>
		</modal-wrap>

		<view class="footer-bar">
			<view class="ac-item " :class="{'disable': activeIndex===0}" @click="prevQuestion">
				<view class="iconfont icon-left"></view>
				<view class="ac-text">上一题</view>
			</view>
			<view class="ac-item">
				<view class="iconfont icon-warning"></view>
				<view class="ac-text">纠错</view>
			</view>
			<view class="ac-item" >
				<view class="iconfont icon-not-favorite"></view>
				<view class="ac-text">收藏</view>
			</view>
			<view class="ac-item" @click="handleOpenSheetModal">
				<view class="iconfont icon-card"></view>
				<view class="ac-text">答题卡</view>
			</view>
			<view class="ac-item " :class="{'disable': questionList.length-1===activeIndex}" @click="nextQuestion">
				<view class="iconfont icon-right"></view>
				<view class="ac-text">下一题</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	import {
		ANSWER_TITLE_TYPES,
		QUESTION_TYPES,
		SUBJECT_TYPES
	} from '../../config/index.js'
	import TopBar from '../../components/top-bar.vue'
	import Choice from '../../components/choice.vue'
	import AnswerResult from '../../components/answer-result.vue'
	import AnswerSheet from '../../components/answer-sheet.vue'
	import ModalWrap from '../../components/modal-wrap.vue'
	export default {
		name: 'answer',
		data() {
			return {
				type: 'Choice',
				touch: {
					isActive: false,
					x: 0
				}
			}
		},

		components: {
			TopBar,
			Choice,
			ModalWrap,
			AnswerResult,
			AnswerSheet
		},
		filters: {
			getTypeText(value) {
				switch (value) {
					case 'Choice':
						return '【单选题】'
					case 'MultipleChoice':
						return '【多选题】'
					case 'FillIn':
						return '【填空题】'
					case 'Judgment':
						return '【判断题】'
					default:
						return ''
				}
			}
		},
		computed: {
			pageTitle() {
				if (Reflect.has(ANSWER_TITLE_TYPES, this.titleType)) {
					return Reflect.get(ANSWER_TITLE_TYPES, this.titleType)
				}
				return '答题'
			},



			// 题目类型
			questionType() {
				if (this.currentQuestion) {
					const type = this.currentQuestion.question_type || ''
					if (Reflect.has(QUESTION_TYPES, type)) {
						return Reflect.get(QUESTION_TYPES, type)
					}
				}
			},

			// 科目类型-章节
			sectionInfo() {
				if (this.currentQuestion) {
					if (Reflect.has(SUBJECT_TYPES, String(this.currentQuestion.subject_type))) {
						const info = Reflect.get(SUBJECT_TYPES, String(this.currentQuestion.subject_type))
						const sectionTitle = Reflect.get(info.sectionTypes || {}, String(this.currentQuestion
							.section_type));
						return sectionTitle
					}
				}
				return ''
			},

			// 展示提交按钮
			submitBtnCls() {
				return this.checkedList.length ? 'show': 'hide'
			},

			// 提示文案
			noteText() {
				if (this.currentQuestion) {
					const {
						answers,
						keys,
						question
					} = this.currentQuestion
					const ansArr = keys.map(key => {
						const ans = answers.find(item => item.value === key)
						return ans ? `<span class="ans-item" style="color: #dd524d;">${ans.label}</span>` : ''
					}).filter(item => !!item)
					return question.replace(/\_*/g, (match) => {
						if (match) {
							return ansArr.join('、')
						}
						return ''
					})
				}
			},
			...mapGetters('answer', ['titleType', 'questionList', 'checkedList', 'showNoteFlag', 'activeIndex',
				'currentQuestion', 'showAnswerSheetFlag'
			])
		},
		created() {},
		mounted() {
			console.log(this.questionList)
		},
		onUnload() {
			this.setDefaultState()
		},
		methods: {
			handleTouchStart(event) {
				if (!this.touch.isActive) {
					this.touch = {
						isActive: true,
						x: event.touches[0].pageX
					}
				}
			},
			handleTouchMove() {

			},
			handleTouchEnd() {
				if (this.touch.isActive) {
					this.touch.isActive = false
				}
			},

			// 提交答案
			handleSubmit() {
				if (!this.checkedList.length) return
				this.dispatchCheckAnswer()
			},

			// 关闭提示弹窗
			handleHideNoteModal() {
				this.setShowNoteFlag(false)
			},
			
			// 展开答题卡modal
			handleOpenSheetModal() {
				this.setAnswerState([{key: 'showAnswerSheetFlag', value: true}])
			},
			
			// 关闭答题卡modal
			handleCloseSheetModal() {
				this.setAnswerState([{key: 'showAnswerSheetFlag', value: false}])
			},
			...mapMutations('answer', ['setShowNoteFlag', 'setDefaultState', 'nextQuestion', 'prevQuestion','setAnswerState']),
			...mapActions('answer', ['dispatchCheckAnswer'])
		}
	}
</script>

<style scoped lang="scss">
	.answer-page {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: #f5f7f8;
	}

	.question-type-wrap {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 20rpx 40rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		color: #000000;
	}

	.question-type {
		margin-right: 22rpx;
	}

	.question-section-title {
		flex: 1;
		max-width: 400rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.question-order {
		margin-left: auto;
	}

	.current-index {
		color: #e75b00;
		margin-right: 12rpx;
	}

	.total-count {
		margin-left: 12rpx;
	}

	.question-container-wrap {
		position: absolute;
		top: 204rpx;
		left: 0;
		right: 0;
		bottom: 100rpx;
		background-color: #f6f6f6;
		overflow: auto;
	}


	.footer-bar {
		display: flex;
		justify-content: space-around;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
	}

	.ac-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		&.disable {
			pointer-events: none;
			color: #666;
		}
	}

	.ac-item .iconfont {
		display: inline-block;
		font-size: 40rpx;
		height: 42rpx;
		margin-top: 12rpx;
	}

	.ac-item .ac-text {
		font-size: 28rpx;
	}

	/* 提交按钮 */
	.submit-btn {
		position: fixed;
		right: -36px;
		bottom: 180rpx;
		animation-duration: 1s;
		animation-fill-mode: both;
		transform-origin: center bottom;
		transform: translate3d(100%, 0, 0);

		&.show {
			animation-name: bounceInRight;
		}

		&.hide {
			animation-name: bounceOutRight;
		}
	}

	.submit-btn button {
		background-color: $uni-text-theme-color;
		color: #FFFFFF;
		font-size: 32rpx;
		height: 56rpx;
		line-height: 56rpx;
		border-top-left-radius: 28rpx;
		border-bottom-left-radius: 28rpx;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		padding-right: 50px;

		&.button-hover {
			opacity: 0.8;
		}
	}

	rich-text .ans-item {
		color: $uni-color-error;
	}

	@keyframes bounceInRight {

		0%,
		60%,
		75%,
		90%,
		to {
			-webkit-animation-timing-function: cubic-bezier(.215, .61, .355, 1);
			animation-timing-function: cubic-bezier(.215, .61, .355, 1)
		}

		0% {
			opacity: 0;
			-webkit-transform: translate3d(3000px, 0, 0) scaleX(3);
			transform: translate3d(1000px, 0, 0) scaleX(3)
		}

		60% {
			opacity: 1;
			-webkit-transform: translate3d(-25px, 0, 0) scaleX(1);
			transform: translate3d(-25px, 0, 0) scaleX(1)
		}

		75% {
			-webkit-transform: translate3d(10px, 0, 0) scaleX(.98);
			transform: translate3d(10px, 0, 0) scaleX(.98)
		}

		90% {
			-webkit-transform: translate3d(-5px, 0, 0) scaleX(.995);
			transform: translate3d(-5px, 0, 0) scaleX(.995)
		}

		to {
			-webkit-transform: translateZ(0);
			transform: translateZ(0)
		}
	}

	@keyframes bounceOutRight {
		0% {
			opacity: 1;
			transform: translate3d(0px, 0, 0);
		}

		to {
			opacity: 0;
			transform: translate3d(400rpx, 0, 0);
		}
	}
</style>
