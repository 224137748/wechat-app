<template>
	<view class="computer-page">
		<view class="top-wrap">

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
				<view class="type-item" :class="{active:activeType==='collection'}"
					@click="handleCheckTypes('collection')">
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
		</view>


		<!-- 题目类型 -->
		<scroll class="section-wrap">
			<view class="section-list" v-if="sectionList.length">
				<view class="section-item" v-for="(item,index) in sectionList" :key="index">
					<view class="section-info">
						<view class="section-title">{{item.title}}</view>
						<view class="section-desc">
							<view class="rate-info">正确率{{item.correctRate || '0%'}}</view>
							<view class="statis-info">
								做题数
								<text class="correct-status">{{item.correctCount ||0}}</text>/
								<text class="error-status">{{item.errorCount}}</text>/
								<text class="total-count">{{item.list.length|| 0}}</text>
							</view>
						</view>
					</view>
					<view class="section-arrow">&gt;</view>
				</view>
			</view>

		</scroll>
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
					if (!section.id) {
						section.list = [item]
						section.title = sectionTitle
						section.id = section_type
					} else {
						section.list.push(item)
					}
					sectionMap.set(section_type, section)
				})
				return [...sectionMap.entries()].sort((a, b) => a[0] - b[0]).map(item => {




					// 正确数
					let correctCount = 0
					let errorCount = 0
					// 答题总数
					let totalAnswerCount = 0

					item[1].list.forEach(question => {
						(question.answer_status || []).forEach(ans => {
							if (ans.status === 1) {
								correctCount++
							} else {
								errorCount
							}
							totalAnswerCount++
						})
					})

					// 计算正确率
					const correctRate = !!totalAnswerCount ? Number(correctCount / totalAnswerCount * 10).toFixed(
						1) : 0

					const data = {
						correctCount,
						errorCount,
						correctRate,
						...item[1]
					}

					return data
				})
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
		background-color: #f5f7f8;
	}

	.top-wrap {
		overflow: hidden;
		background: linear-gradient(#fff,#f5f7f8);
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
		border-bottom: 1rpx solid #ebebeb;
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

	.summary-wrap {
		display: flex;
		align-items: center;
		padding-left: 12rpx;
		width: 690rpx;
		margin: 40rpx auto 48rpx;
		border-left: 5rpx solid #6c8df1;
		box-sizing: border-box;
	}

	.summary-wrap .dot {
		width: 4rpx;
		height: 4rpx;
		border-radius: 50%;
		background-color: #000000;
		margin: 0 20rpx;
	}

	.section-wrap {
		position: absolute;
		left: 0;
		right: 0;
		top: 436rpx;
		bottom: 0;
		background-color: #f5f7f8;
		overflow: auto;
	}

	.section-list {
		width: 690rpx;
		margin: auto;
	}
	.section-item {
		display: flex;
		align-items: center;
		margin-bottom: 18rpx;
		padding: 30rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}
	.section-info {
		flex: 1;
	}
	.section-title {
		font-size: 28rpx;
		line-height: 48rpx;
		font-weight: bold;
		color: #000;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-bottom: 6rpx;
	}
	.section-desc {
		display: flex;
		font-size: 24rpx;
		line-height: 1.5;
		color: #959595;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.rate-info {
		margin-right: 10rpx;
	}
	.correct-status {
		color: #71c1a0;
	}
	.error-status {
		color: #d95c51;
	}
	
</style>
