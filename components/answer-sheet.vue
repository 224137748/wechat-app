<template>
	<view class="answer-sheet">
		<view class="answer-sheet-guide">
			<view class="answer-status">
				<text class="color-icon"></text>
				<text>答对</text>
			</view>
			<view class="answer-status">
				<text class="color-icon"></text>
				<text>答错</text>
			</view>
			<view class="answer-status">
				<text class="color-icon"></text>
				<text>未答</text>
			</view>

			<button>清空重做</button>
		</view>
		<view class="answer-sheet-list">
			<view @click="handleCheckQuestion(index)" class="answer-sheet-item" :class="[getStatusCls(item)]" v-for="(item, index) in questionList" :key="item.question_id">
				{{index + 1}}
			</view>
		</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		props: {
			questionList: {
				type: Array,
				default: () => ([])
			}
		},
		name: "answer-sheet",
		data() {
			return {

			};
		},
		methods: {
			getStatusCls(item) {
				if (item.record) {
					return item.record.status === 0 ? 'error' : 'correct'
				}
				return ''
			},
			handleCheckQuestion(index) {
				uni.$emit('hide-modal')
				this.setAnswerState([
					{key: 'activeIndex', value: index}
				])
			},
			...mapMutations('answer', ['setAnswerState'])
		}
	}
</script>

<style lang="scss" scoped>
	.answer-sheet {
		&-guide {
			display: flex;
			align-items: center;

			.answer-status {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #4c4c4c;
				margin-right: 40rpx;

				.color-icon {
					display: inline-block;
					width: 12rpx;
					height: 12rpx;
					border-radius: 50%;
					margin-right: 12rpx;
				}

				&:first-child .color-icon {
					background-color: $uni-correct-color;
				}

				&:nth-child(2) .color-icon {
					background-color: $uni-error-color;
				}

				&:nth-child(3) .color-icon {
					background-color: #d9d9d9;
				}

			}

			button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 156rpx;
				height: 54rpx;
				margin-left: auto;
				margin-right: 0;
				background-color: transparent;
				box-sizing: border-box;
				color: $uni-correct-color;
				font-size: 30rpx;
				border-radius: 25rpx;
				border: 2rpx solid $uni-correct-color;
				outline: none;
				padding: 0;
			}
		}
		
		&-list {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			margin-top: 40rpx;
		}
		&-item {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 70rpx;
			height: 70rpx;
			font-size: 32rpx;
			margin-bottom: 40rpx;
			border-radius: 50%;
			box-sizing: border-box;
			border: 2rpx solid #d9d9d9;
			&:not(:nth-child(5n+5)) {
				margin-right: 84rpx;
			}
			&.correct {
				background-color: $uni-correct-color;
				color: #fff;
				border: none;
			}
			&.error {
				background-color: $uni-error-color;
				color: #fff;
				border: none;
			}
		}
		
	}
</style>
