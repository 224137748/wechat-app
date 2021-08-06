<template>
	<view class="authorize-wrap">
		<slot></slot>
		<button v-if="!userInfo" class="authorize-btn"  open-type="getUserInfo" @getuserinfo="handleGetUserInfo"></button>
	</view>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	export default {
		name:"authorize-wrap",
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			handleGetUserInfo(e) {
				console.log(e.detail.userInfo)
			},
			...mapActions(['dispatchGetUserInfo'])
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
