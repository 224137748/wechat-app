<template>
	<view class="modal-wrap"  @click.self="handleCloseModal">
		
		<view class="container" @click.stop :class="contentCls" @animationend="handleAnimated">
			<view class="header">
				<view class="title">{{title}}</view>
				<text class="close-btn iconfont icon-close" @click="handleCloseModal"></text>
			</view>
			<view class="content">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"modal-wrap",
		props: {
			title: {
				type: String,
				default:'弹窗'
			},
			
		},
		data() {
			return {
				hideFlag: false
			};
		},
		computed: {
			contentCls() {
				return this.hideFlag ? 'hide' :  'show'
			}
		},
		methods: {
			handleCloseModal() {
				this.hideFlag = true
			},
			handleAnimated() {
				if (!this.hideFlag) return
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
.modal-wrap {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	background-color: rgba(0,0,0,.8);
	
	.container {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 64%;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		background-color: #fff;
		&.show {
			animation: slideInUp ease 0.5s 1 both;
		}
		&.hide {
			animation: slideInDown ease 0.5s 1 both;
		}
	}
	.header {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 110rpx;
		border-bottom: 2rpx solid #eee;
		.title {
			color: #000;
			font-weight: bold;
		}
	}
	
	.content {
		height: calc(100% - 110rpx);
		overflow-y: scroll;
		padding: 30rpx ;
	}
	
	.close-btn {
		position: absolute;
		right: 30rpx;
		top: 39rpx;
	}
}
@keyframes slideInUp {
	0% {
		transform: translate3d(0, 100%, 0);
	}
	100% {
		transform: translate3d(0,0,0);
	}
}
@keyframes slideInDown {
	0% {
		transform: translate3d(0,0,0);
	}
	100% {
		transform: translate3d(0, 100%, 0);
	}
}
</style>
