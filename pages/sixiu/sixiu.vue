<template>
	<view class="sixiu-page">
		<view class="sixiu-video-wrap">
			<video class="sixiu-video" src="https://cdn-ali-web.ludashi.com/web/lds_pro/portal/video/enterprise.mp4"></video>
		</view>
		
		<button @tap="handleExit">退出小程序</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			handleExit() {
				wx.exitMiniProgram({
					success() {
						console.log('closed')
					}
				})
			}
		}
	}
</script>

<style>
.sixiu-video-wrap {
	position: relative; 
	height: 0;
	width: 100%;
	padding-top: 56.25%;
}
.sixiu-video {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}
</style>
