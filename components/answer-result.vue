<!-- 答题结果 -->
<template>
	<view class="answer-result">
		<view class="answer-result-title">回答{{question.record.status === 0 ? '错误': '正确'}}</view>
		<view class="answer-result-value">
			<text>正确答案 {{question.keys.join('')}}</text> 
			 <text>/</text>
			 <text>你的答案 {{question.record.answer.join('')}}</text>
		</view>
		<view class="answer-result-title">答案解析</view>
		<view class="answer-result-detail">
			<rich-text :nodes="noteText"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "answer-result",
		props: {
			question: {
				type: Object,
				default: () => ({})
			},
			answer: {
				type: Array,
				default: () => ([])
			}
		},
		data() {
			return {

			};
		},
		computed: {
			// 提示文案
			noteText() {
				const {
					answers,
					keys,
					question
				} = this.question
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.answer-result {
		width: 680rpx;
		margin: auto;
		border-radius: 16rpx;
		box-sizing: border-box;
		padding: 32rpx;
		color: #000000;
		font-size: 30rpx;
		background-color: #fff;
		

		&-title {
			border-left: 6rpx solid $uni-color-primary;
			padding-left: 10rpx;
			height: 32rpx;
			line-height: 32rpx;
			margin: 10rpx auto;
			font-size: 30rpx;
		}
		&-value {
			margin-bottom: 20rpx;
			text {
				margin: 0 6rpx;
			}
		}
		&-detail {
			// background-color: #ebf6ed;
		}
	}
</style>
