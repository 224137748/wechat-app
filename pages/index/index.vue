<template>
	<view class="content">
		<view class="banner">
			<image  src="/static/banner.jpg"></image>
			<view class="tit">
				<view class="tit-left">你好啊，李银河</view>
				<view class="tit-right">--王小波</view>
			</view>
			<view class="talk">
				<text>今日晨语:不积硅步，无以至千里</text>
			</view>
		</view>
		
		<view class="sign">
			<view class="unsign" v-if="!hasSigned">签到</view>
			<view class="signed" v-else>
				<view class="sign-text">已签到</view>
				<view class="sign-desc">学习的路上，和同学一起会更棒哦~！</view>
				<button class="share-btn">去分享</button>
				<view class="singed-list">
					<view class="signed-avatars">
						<image v-for="index in 5" src="/static/logo.png" :key="index"></image>
					</view>
					<view class="rank-text">进入打卡第42名，比95%的小伙伴更努力</view>
				</view>
			</view>
			
		</view>
		
		<view class="nav">
			<button class="nav-item" @click="goToPage('../english/english?type=cet4')">英语</button>
			<button class="nav-item" @click="goToPage('../computer/computer')">计算机</button>
			<button class="nav-item" @click="goToPage('../sixiu/sixiu')">思修</button>
			<button class="nav-item border-top" @click="goToPage('../english/english')">英语</button>
			<button class="nav-item border-top" @click="goToPage('../maogai/maogai')">毛概</button>
			<button class="nav-item border-top" @click="goToPage('../sixiu/sixiu')">思修</button>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				sum: 0,
				hasSigned: true
			}
		},
		onLoad() {

		},
		methods: {
			handleSum() {
				
				wx.cloud.callFunction({
					name: 'sum',
					data: {
						a: 15,
						b: 20
					}
				}).then(res => {
					console.log(res)
				})
			},
			goToPage(path) {
				wx.navigateTo({
					url:path
				})
			}
		}
	}
</script>

<style>
	.content {
		min-height: 100vh;
		background-color: #f1f1f1;
	}
	.banner {
		position: relative;
		margin-bottom: 12rpx;
	}
	.banner .tit {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		color: #fff;
		margin: auto;
		width: 300rpx;
		height: 200rpx;
		font-size: 30rpx;
	}
	.banner .tit-left {
		text-align: center;
		margin-bottom: 10rpx;
	}
	.banner .tit-right {
		text-align: center;
		letter-spacing: 4rpx;
	}
	.banner image {
		display: block;
		width: 100%;
		height: 100%;
		height: 310rpx;
	}
	.banner .talk {
		font-size: 28rpx;
		padding: 0 18rpx;
		line-height: 84rpx;
		height: 84rpx;
		background-color: #fff;
		color: #6c8df1;
	}
	
	/* 签到 */
	.sign {
		margin-bottom: 12rpx;
	}
	.signed {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 22rpx 50rpx 16rpx;
		box-sizing: border-box;
		min-height: 270rpx;
		background-color: #fff;
	}
	.sign-text {
		color: #b3c9f8;
		margin-bottom: 20rpx;
	}
	.sign-desc {
		font-size: 26rpx;
		color: #adadad;
		margin-bottom: 24rpx;
	}
	.share-btn {
		width: 210rpx;
		height: 64rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		border: 2rpx solid #6b8cf1;
		color: #6b8cf1;
		font-size: 24rpx;
		margin-bottom: 14rpx;
	}
	.singed-list {
		display: flex;
		align-items: center;
	}
	.signed-avatars {
		display: flex;
		margin-right: 18rpx;
	}
	.signed-avatars image {
		position: relative;
		display: block;
		width: 52rpx;
		height: 52rpx;
		margin-left: -24rpx;
		border-radius: 50%;
	}
	.rank-text {
		font-size: 28rpx;
		color: #9a9999;
	}
	
	/* 菜单栏 */
	.nav {
		display: flex;
		flex-wrap: wrap;
	}
	.nav-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 250rpx;
		height: 250rpx;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 0;
		outline: none;
		color: #6a6a6a;
		transition: background-color 0.5s ease;
		padding-left: 0;
		padding-right: 0;
	}
	.nav-item.button-hover {
		background-color: #f1f1f1;
	}
	.nav-item:not(:nth-child(3n)) {
		border-right: 1rpx solid #e5e5e5;
	}
	.border-top {
		border-top: 1rpx solid #E5E5E5;
	}
	button::after {
		display: none;
		border: none;
	}
</style>
