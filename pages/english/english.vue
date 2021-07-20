<template>
	<view class="sheet-page">
		<view class="sheet-type-list" >
			<scroll-view class="scroll" scroll-x="true" >
				<view class="scroll-container">
					<view @click="handleTypeChange(item.id)":id="item.id"  class="type-item" :class="{active: currentType === item.id}" v-for="(item, index) in typeArray" :key="item.id">
						{{item.title}}
					</view>
				</view>
			</scroll-view>
		</view>
		
		<scroll-view class="sheet-scroll-wrap" scroll-y="true">
			<view>
				<view class="sheet-play-wrap">
					<text class="iconfont icon-ziyuan" @click="handleAddPlayList"></text>
					<text class="tit">
						<text>播放全部</text>
						<text class="count">（{{currentSheetData.length || 0}}）</text>
					</text>
					
				</view>
				<view class="sheet-detail-list" v-if="currentSheetData">
					<view :class="{active: currentSong.id === item.id}" v-for="(item,index) in currentSheetData" :key="item.id" class="song-item" @click="selectSong(item)">
						<view class="rank-wrap">
							<text>{{index+1}}</text>
						</view>
						<view class="song-info">
							<view class="song-name no-wrap">{{item.name}}</view>
							<view class="song-desc no-wrap">{{item.singer || '英语听力'}}-{{item.album || '听力天天练'}}</view>
						</view>
					</view>
				</view>
				<view v-else>
					
				</view>
			</view>
			
		</scroll-view>
		
		
	</view>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
const IMAGE_HEIGHT = 260
export default {
	data() {
		return {
			typeArray: [
				{id: 'cet4', title: '四级'},
				{id: 'type2', title: '六级'},
				{id: 'type3', title: '雅思'},
				{id: 'type4', title: '托福'},
				{id: 'type5', title: '八级'},
			],
			currentType: '',
			scrollTop:0,
			imageHeight: IMAGE_HEIGHT
		};
	},
	onLoad(options) {
		console.log('onload');
		const type = options.type || 'cet4';
		this.currentType = type
		this.getSheetData({type})
	},
	created() {
		console.log('created');
	},
	mounted() {
	},
	
	computed:{
		...mapGetters(['statusBarHeight', 'navBarHeight', 'sheetData', 'currentSong']),
		currentSheetData() {
			if (this.currentType && this.sheetData.length) {
				const {sheetData, currentType} = this;
				const data = sheetData.find(item => item.type === currentType);
				console.log('currentSheetData', data)
				return data || null;
			}
			return null
		},
	},
	methods: {
		handleBack() {
			wx.navigateBack()
		},
		handleTypeChange(type) {
			this.currentType = type
		},
		handleScroll(event) {
			const {scrollTop} = event.detail
			this.scrollTop = -scrollTop
		},
		
		selectSong(song) {
			// console.log(song)
			this.insertSong(song)
			wx.navigateTo({
				url: '../player/player'
			})
		},
		
		// 添加到播放列表
		handleAddPlayList() {
			this.addPlayList({
				list: this.currentSheetData
			}).then(() => {
				wx.navigateTo({
					url: '../player/player'
				})
			})
		},
		...mapActions(['getSheetData', 'insertSong', 'addPlayList'])
	},
	watch:{
		currentSheetData: {
			handler: function(newVal) {
				if (!newVal) {
					wx.showLoading({
						title:'加载中....'
					})
				} else {
					wx.hideLoading()
				}
			},
			immediate:true  
		}
	}
};
</script>

<style scoped>
.sheet-page {
	background-color: #f7fbf7;
	min-height: 100vh;
}
.sheet-page
.sheet-type-list {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	background-color: #fff;
	box-shadow: 0 0 4rpx 1rpx rgb(0 0 0 / 20%);
}
.scroll {
	width: 100%;
}
.scroll-container {
	display: flex;
	height: 100rpx;
}
.type-item {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	min-width: 100rpx;
}
.type-item::after {
	display: block;
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	width: 0;
	margin: auto;
	height: 2rpx ;
	background-color: #6B8CF1;
	transition: width 0.5s ease-in-out;
}
.type-item.active {
	color: #6b8cf1;
}
.type-item.active::after {
	width: 100%;
}
.sheet-scroll-wrap {
	position: fixed;
	top: 100rpx;
	width: 100%;
	bottom: 0;
}
.sheet-play-wrap {
	display: flex;
	align-items: center;
	margin: 44rpx 20rpx 50rpx;
}
.sheet-play-wrap .icon-ziyuan{
	margin-right: 20rpx;
	color: #6b8cf1;
}
.sheet-play-wrap .tit{
	font-size: 30rpx;
	font-weight: bold;
	color: #2d2d2d;
}
.sheet-play-wrap .count {
	font-size: 20rpx;
	color: #898989;
	margin-left: 14rpx;
}

/* 歌曲列表 */
.sheet-detail-list {
	padding: 0 20rpx;
}
.song-item {
	display: flex;
	align-items: center;
	margin: 22rpx 0;
}
.song-item.active .rank-wrap,
.song-item.active .song-desc{
	color: #6b8cf194;
}
.song-item.active .song-name {
	color: #6b8cf1;
}
.rank-wrap {
	min-width: 36rpx;
	margin-right: 20rpx;
	text-align: center;
	color: #898989;
}
.song-name {
	font-size: 28rpx;
	color: #2D2D2D;
	margin-bottom: 12rpx;
}
.song-desc {
	font-size: 20rpx;
	color: #898989;
}
</style>
