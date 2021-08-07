<template>
	<view class="top-bar" :style="{ marginTop: `${statusBarHeight}px` }">
		<view class="back  " @click="handleBack">
			<view class="iconfont  icon-fanhui"></view>
		</view>
		<view class="title">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name:"top-bar",
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters(['statusBarHeight'])
		},
		methods: {
			handleBack() {
				wx.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.top-bar {
		position: relative;
	}

	.top-bar .back {
		position: absolute;
		top: 6rpx;
		left: 12rpx;
		z-index: 50;
	}

	.top-bar .icon-fanhui {
		display: block;
		width: 30rpx;
		height: 30rpx;
		padding: 9px;
		font-size: 32rpx;
		color: #000;
	}

	.top-bar .title {
		width: 50%;
		margin: 0 auto;
		line-height: 80rpx;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 36rpx;
	}
</style>
