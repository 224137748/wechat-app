<template>
	<view class="user-page">
		<view class="header">
			<view class="avatar-wrap">
				<image class="avatar" v-if="hasBaseInfo" :src="userInfo.baseInfo.avatarUrl" mode=""></image>
				<authorize-wrap v-else>
					<view class="login-btn">登陆</view>
				</authorize-wrap>
			</view>

			<view class="overview">
				<view class="overview-item">
					<view class="overview-val">0</view>
					<view class="overview-text">累计打卡天数</view>
				</view>
				<view class="overview-item">
					<view class="overview-val">0</view>
					<view class="overview-text">收藏题目总数</view>
				</view>
				<view class="overview-item">
					<view class="overview-val">0</view>
					<view class="overview-text">练习题目数目</view>
				</view>
			</view>
		</view>
		
		
		<view class="detail">
			<authorize-wrap>
				<view class="line">
					<view class="iconfont icon-errors"></view>
					<view class="line-tit">错题集</view>
					<view class="right iconfont icon-arrow"></view>
				</view>
				<view class="line">
					<view class="iconfont icon-collection"></view>
					<view class="line-tit">收藏集</view>
					<view class="right iconfont icon-arrow"></view>
				</view>
				<view class="line">
					<view class="iconfont icon-school"></view>
					<view class="line-tit">院校</view>
					<view class="right iconfont icon-arrow"></view>
				</view>
				<view class="line">
					<view class="iconfont icon-major"></view>
					<view class="line-tit">专业</view>
					<view class="right iconfont icon-arrow"></view>
				</view>
				<view class="line" >
					<view class="iconfont icon-fadeback"></view>
					<view class="line-tit">意见反馈</view>
					<view class="right iconfont icon-arrow"></view>
					<button class="feedback-btn" type="default" open-type="feedback">hahha</button>
				</view>
			</authorize-wrap>
		</view>
	</view>
</template>

<script>
	import AuthorizeWrap from '../../components/authorize-wrap.vue'
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'user',
		components: {
			AuthorizeWrap
		},
		data() {
			return {

			}
		},
		created() {

			this.setNavTitle()
		},
		computed: {
			hasBaseInfo() {
				if (this.userInfo ) {
					return this.userInfo.baseInfo != null
				}
				return false
			},
			...mapGetters(['userInfo'])
		},
		methods: {
			setNavTitle() {
				if (this.hasBaseInfo) {
					const nickname = this.userInfo.baseInfo.nickName || 'uni-app'
					wx.setNavigationBarTitle({
						title: nickname
					})
				}
			},
		},
		watch: {
			hasBaseInfo(newVal) {
				if (newVal) {
					wx.setNavigationBarTitle({
						title:this.userInfo.baseInfo.nickName || 'uni-app'
					})
				}
			}
		}
	}
</script>

<style scoped>
	.user-page {
		background-color: #F1F1F1;
		min-height: 100vh;
	}
	.header {
		position: relative;
		padding-top: 24rpx;
		padding-bottom: 50rpx;
		box-shadow: 0 0 4px 1px rgb(0 0 0 / 20%);
		margin-bottom: 25rpx;
		background-color: #fff;
	}

	.avatar-wrap {
		text-align: center;
		margin-bottom: 60rpx;
	}

	.avatar {
		width: 122rpx;
		height: 122rpx;
		border-radius: 50%;
		vertical-align: top;
	}

	.login-btn {
		display: flex;
		align-items: center;
		width: max-content;
		height: 122rpx;
		padding: 0 20rpx;
		font-size: 36rpx;
	}

	.overview {
		display: flex;
		justify-content: space-between;
		width: 706rpx;
		margin: 0 auto;
	}

	.overview-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 200rpx;
	}

	.overview-val {
		font-size: 44rpx;
		color: #000;
		margin: 14rpx auto 20rpx;
	}

	.overview-text {
		font-size: 30rpx;
		color: #7e7e7e;
	}
	
	.detail {
		width: 704rpx;
		margin: auto;
		border-radius: 16rpx;
		background-color: #fff;
		padding-left: 24rpx;
		box-sizing: border-box;
	}
	.line {
		position: relative;
		display: flex;
		align-items: center;
		width: 656rpx;
		height: 100rpx;
		box-sizing: border-box;
		color: #7e7e7e;
	}
	.line:not(:last-child) {
		border-bottom: 2rpx solid #ddd;
	}
	.line .iconfont {
		font-size: 34rpx;
		margin-right: 12rpx;
	}
	.line-tit {
		font-size: 30rpx;
		color: #000000;
		opacity: 0.8;
	}
	.right {
		margin-left: auto;
	}
	.icon-arrow {
		color: #9f9e9e;
	}
	.feedback-btn {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	}
</style>
