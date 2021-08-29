<template>
	<view v-if="question" class="choice-component">
		<view class="question-detail">
			<view class="question-title">
				<text>{{question.question}}</text>
			</view>

			<view class="answer-list" v-if="!question.record">
				<label class="label" :class="isChecked(item.value) ? 'active': ''" v-for="(item) in question.answers"
					:key="item.value" @click="handleSelect(item.value)">
					<view class="label-hd">{{item.value}}.</view>
					<view class="label-bd">{{item.label}}</view>
				</label>
			</view>
			<view class="answer-list" v-else>
				<label class="label" :class="[isCorrect(item.value)]" v-for="(item) in question.answers"
					:key="item.value" >
					<view v-if="!isCorrect(item.value)" class="label-hd">{{item.value}}.</view>
					<view v-if="isCorrect(item.value)=== 'correct'" class="label-hd iconfont icon-answer-correct"></view>
					<view v-if="isCorrect(item.value)=== 'error'" class="label-hd iconfont icon-answer-error"></view>
					<view class="label-bd">{{item.label}}</view>
				</label>
			</view>
			
		</view>
		
		<view v-if="!question.record" class="note-btn" @click="handleShowNoteModal">
			<text class="iconfont icon-note"></text>
			<text >查看提示</text>
		</view>
		
	</view>
</template>

<script>
	import {answerMixin} from '../common/js/mixin.js'
	export default {
		name: "choice",
		mixins:[answerMixin]
	}
</script>

<style scoped lang="scss">
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
		&.correct {
			background-color: #eaf9f1;
			color: #59be73;
		}
		&.error {
			color: #f64d4d;
			background-color: #fceded;
		}
	}

	.label:not(:last-child) {
		margin-bottom: 24rpx;
	}

	.label.active {
		background-color: #f7f9fb;
		border: 2rpx solid $uni-text-theme-color;
		color: $uni-text-theme-color;
	}

	.label-hd {
		margin-right: 18rpx;
	}
	
	.note-btn{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		color: $uni-text-theme-color;
		margin-top: 40rpx;
	}
</style>
