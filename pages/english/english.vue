<template>
	<view>
		英语播放列表页
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: ''
			}
		},
		onLoad(options) {
			console.log('onload')
			this.type = options.type || ''
			
		},
		created() {
			console.log('created')
		},
		mounted() {
			this.getSheetList()
			console.log('mounted')
		},
		methods: {
			getSheetList() {
				wx.showLoading('加载中...')
				wx.cloud.callFunction({
					name: 'getSheet',
				}).then((res) => {
					console.log('res ==>>', res)
				})
			}
		}
	}
</script>

<style>

</style>
