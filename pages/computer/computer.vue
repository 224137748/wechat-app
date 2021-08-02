<template>
	<view class="computer-page">
		<view class="header" :style="{ marginTop: `${statusBarHeight}px` }">
			<view class="back  " @click="handleBack">
				<view class="iconfont  icon-fanhui"></view>
			</view>
			<view class="title">章节列表</view>
		</view>

		<!-- 题目类型 -->
		<view class="type-list">
			<view class="type-item" :class="{active:activeType === 'all'}" @click="handleCheckTypes('all')">
				<view class="type-item-icon iconfont icon-keben"></view>
				<view class="type-item-txt">全部</view>
			</view>
			<view class="type-item" :class="{active:activeType==='error'}" @click="handleCheckTypes('error')">
				<view class="type-item-icon iconfont icon-record"></view>
				<view class="type-item-txt">错题</view>
			</view>
			<view class="type-item" :class="{active:activeType==='collection'}" @click="handleCheckTypes('collection')">
				<view class="type-item-icon iconfont icon-collection"></view>
				<view class="type-item-txt">收藏</view>
			</view>
		</view>
		
		<!-- 概览 -->
		<view class="summary-wrap">
			<view class="sub-tit">全部题目</view>
			<view class="dot"></view>
			<view>共 {{questionList.length || 0}} 题</view>
		</view>
		
		
		计算机
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		COMPUTER_SECTION_TYPES
	} from '../../config/index.js'
	export default {
		name: 'computer-page',
		data() {
			return {
				questionList: [],
				activeType: 'all'
			}
		},
		created() {
			this.getData()
		},
		computed: {
			sectionList() {
				console.log('===', this.questionList)
				if (!this.questionList.length) return []
				const sectionMap = new Map()
				this.questionList.forEach(item => {
					const {
						section_type
					} = item
					const sectionTitle = COMPUTER_SECTION_TYPES[section_type] || '其他'
					const section = sectionMap.get(section_type) || {}
					if (!!section) {
						section.list = [item]
						section.title = sectionTitle
						section.id = section_type
					} else {
						section.list.push(item)
					}
					sectionMap.set(section_type, section)
				})
				return [...sectionMap.entries()].sort((a, b) => a[0] - b[0]).map(item => item[1])
			},
			...mapGetters(['statusBarHeight'])
		},
		methods: {
			async getData() {
				wx.showLoading({
					title: '加载中...'
				})
				const res = await wx.cloud.callFunction({
					name: 'getComputerQuestion'
				})
				wx.hideLoading()
				const {
					result: {
						data
					}
				} = res
				this.questionList = data || []
				setTimeout(() => {
					console.log(this.sectionList)
				}, 1000)
			},
			handleBack() {
				wx.navigateBack();
			},
			handleCheckTypes(type) {
				this.activeType = type
			}
		}
	}
</script>

<style scoped>
	.computer-page {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.header {
		position: relative;
	}

	.header .back {
		position: absolute;
		top: 6rpx;
		left: 12rpx;
		z-index: 50;
	}

	.header .icon-fanhui {
		display: block;
		width: 30rpx;
		height: 30rpx;
		padding: 9px;
		font-size: 32rpx;
		color: #000;
	}

	.header .title {
		width: 50%;
		margin: 0 auto;
		line-height: 80rpx;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 36rpx;
	}

	.type-list {
		display: flex;
		align-items: center;
		padding: 36rpx 65rpx;
		border-bottom: 1rpx solid #6A6A6A;
	}

	.type-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 40rpx;
		color: #6a6a6a;
	}

	.type-item.active {
		color: #6c8df1;
	}

	.type-item-icon {
		font-size: 46rpx;
		margin-bottom: 20rpx;
	}

	.type-item-txt {
		font-size: 32rpx;
	}
	
	.summary-wrap{
		display: flex;
		align-items: center;
		padding-left: 12rpx;
		width: 690rpx;
		margin: 40rpx auto 48rpx;
		border-left: 5rpx solid #6c8df1;
	}
	.summary-wrap .dot {
		width: 4rpx;
		height: 4rpx;
		border-radius: 50%;
		background-color: #000000;
		margin: 0 20rpx;
	}
</style>
