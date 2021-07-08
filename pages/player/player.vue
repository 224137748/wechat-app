<template>
	<view class="player-page">
		<view class="background"><img :src="currentSong.image" alt="" width="100%" height="100%" /></view>
		
		<view class="top" :style="{marginTop: `${statusBarHeight}px`}">
			<view class="back">
				<view class="icon-back"></view>
			</view>
			<view class="title">{{currentSong.name}}</view>
			<view class="subtitle">{{currentSong.singer}}</view>
		</view>
		
		<view class="middle">
			
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {
		...mapGetters(['currentSong', 'playing', 'currentIndex', 'statusBarHeight'])
	},
	mounted() {
		console.log(this.currentSong)
	},
	methods: {}
};
</script>

<style scoped>
.player-page {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
.background {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	opacity: 0.6;
	filter: blur(20px);
}
.background img {
	width: 100%;
	height: 100%;
}
.top {
	position: relative;
	margin-bottom: 50rpx;
}
.top .back {
	position: absolute;
	top: ;
	left: 12rpx;
	z-index: 50;
}
.top .icon-back {
	display: block;
	width: 30rpx;
	height: 30rpx;
	background-color: #fff;
	padding: 9px;
	color: #fff;
	transform: rotate(-90deg);
}
.top .title {
	width: 50%;
	margin: 0 auto;
	line-height: 80rpx;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 36rpx;
	color: #fff;
}
.top .subtitle {
	font-size: 28rpx;
	line-height: 40rpx;
	text-align: center;
	color: #fff;
}
</style>
