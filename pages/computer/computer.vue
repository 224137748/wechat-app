<template>
	<view>
		计算机
	</view>
</template>

<script>
	export default {
		name: 'computer-page',
		data() {
			return {

			}
		},
		created() {
			this.getData()
		},
		methods: {
			async getData() {
				wx.showLoading({
					title:'加载中...'
				})
				const res = await wx.cloud.callFunction({name: 'getComputerQuestion'})
				wx.hideLoading()
				console.log('res', res)
				
			}
		}
	}
</script>

<style>

</style>
