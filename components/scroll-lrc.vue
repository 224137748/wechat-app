<template>
	<view class="lrc-container">
		<scroll-view
		scroll-y
		style="height: 100%"
		:scroll-top="scrollTop"
		@touchstart="handleDragStatus"
		@scroll="handleDrag"
		></scroll-view>
	</view>
</template>

<script>
	export default {
		name:"scroll-lrc",
		data() {
			return {
				scrollTop: 0,
				dragFlag: false 
			};
		},
		methods:{
			handleDragStatus() {
				this.timer && clearTimeout(this.timer)
				this.dragFlag = true
				this.timmer = setTimeout(() => {
					this.dragFlag = false
				}, 5000)
			},
			handleDrag(e) {
				console.log(e)
			}
		}
	}
</script>

<style>

</style>
