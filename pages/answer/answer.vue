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

		<scroll class="question-container">
			<keep-alive>
				<choice v-if="questionType === 'Choice'" :index="activeIndex + 1" :question="currentQuestion" />
			</keep-alive>
		</scroll>

		<view class="footer-bar">
			<view class="ac-item">
				<view class="iconfont icon-left"></view>
				<view class="ac-text">上一题</view>
			</view>
			<view class="ac-item">
				<view class="iconfont icon-warning"></view>
				<view class="ac-text">纠错</view>
			</view>
			<view class="ac-item">
				<view class="iconfont icon-not-favorite"></view>
				<view class="ac-text">收藏</view>
			</view>
			<view class="ac-item">
				<view class="iconfont icon-card"></view>
				<view class="ac-text">答题卡</view>
			</view>
			<view class="ac-item">
				<view class="iconfont icon-right"></view>
				<view class="ac-text">下一题</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		ANSWER_TITLE_TYPES,
		QUESTION_TYPES,
		SUBJECT_TYPES
	} from '../../config/index.js'
	import TopBar from '../../components/top-bar.vue'
	import Choice from '../../components/choice.vue'
	export default {
		name: 'answer',
		data() {
			return {
				type: 'Choice',
				activeIndex: 0
			}
		},

		components: {
			TopBar,
			Choice
		},
		filters: {
			getTypeText(value) {
				switch (value) {
					case 'Choice':
						return '【选择题】'
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

			// 当前题目
			currentQuestion() {
				const len = this.questionList.length
				if (len && this.activeIndex < len) {
					return this.questionList[this.activeIndex]
				}
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
			...mapGetters('answer', ['titleType', 'questionList'])
		},
		created() {},
		mounted() {
			console.log(this.questionList)
		},
		methods: {}
	}
</script>

<style scoped>
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

	.question-container {
		position: absolute;
		top: 204rpx;
		left: 0;
		right: 0;
		bottom: 100rpx;
		background-color: pink;
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
	}
	.ac-item .iconfont  {
		display: inline-block;
		font-size: 40rpx;
		height: 42rpx;
		margin-top: 12rpx;
	}
	.ac-item .ac-text {
		font-size: 28rpx;
	}
</style>
