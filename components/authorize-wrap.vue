<template>
	<view class="authorize-wrap">
		<slot></slot>
		<button v-if="!hasBaseInfo" class="authorize-btn" open-type="getUserInfo" @tap="getUserProfile"></button>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	export default {
		name: "authorize-wrap",
		data() {
			return {

			};
		},
		computed: {
			hasBaseInfo() {
				if (this.userInfo) {
					return !!this.userInfo.baseInfo
				}
				return false
			},
			...mapGetters(['userInfo'])
		},
		methods: {
			getUserProfile(e) {
				const that = this
				wx.getUserProfile({
					desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						that.dispatchUpdateUserInfo({baseInfo: res.userInfo})
					}
				})
			},
			...mapActions(['dispatchUpdateUserInfo'])
		}
	}
</script>

<style scoped>
	.authorize-wrap {
		display: inline-block;
		position: relative;
	}

	.authorize-btn {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		/* background-color: rgba(255,0,0,.5); */
		z-index: 999;
		opacity: 0;
	}
</style>
