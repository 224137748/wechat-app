<template>
	<view v-if="question" class="choice-component">
		<view class="question-detail">
			<view class="question-title">
				<text>{{question.question}}</text>
			</view>

			<view class="answer-list">
				<label class="label" v-for="(item) in question.answers" :key="item.value">
					<view class="label-hd">{{item.value}}.</view>
					<view class="label-bd">{{item.label}}</view>
				</label>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "choice",
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
				checkedList: []
			};
		},
		methods: {
			checkboxChange(e) {
				console.log(e)
			},
			isChecked(val) {
				console.log('val ', val)
				return this.checkedList.includes(val)
			}
		}
	}
</script>

<style scoped>
	.choice-component {
		width: 680rpx;
		margin: 20rpx auto;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		box-sizing: border-box;
		padding: 32rpx;
		color: #000000;
		font-size: 30rpx;
	}

	.question-title {
		margin-bottom: 20px;
	}
	.label {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100rpx;
		box-sizing: border-box;
		border-radius: 10rpx;
		border: 2rpx solid #f1f2f4;
		background-color: #fafbfc;
		padding: 0 46rpx;
		font-size: 32rpx;
		color: #3c4955;
		transition: opacity .3s ease;
	}
	.label:not(:last-child) {
		margin-bottom: 24rpx;
	}
	.label:active {
		background-color: #f7f9fb;
	}
	.label-hd {
		margin-right: 18rpx;
	}
</style>
