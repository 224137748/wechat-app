<template>
	<view class="player-page">
		<view class="background"><img :src="currentSong.image" alt="" width="100%" height="100%" /></view>

		<view class="top" :style="{ marginTop: `${statusBarHeight}px` }">
			<view class="back" @click="handleBack"><view class="icon-back"></view></view>
			<view class="title">{{ currentSong.name }}</view>
			<view class="subtitle">{{ currentSong.singer }}</view>
		</view>

		<view class="middle">
			<transition>
				<view class="middle-l" v-if="!showLyricFlag">
					<view class="cd-wrapper">
						<div class="cd"><img class="image" :src="currentSong.image" alt="" /></div>
					</view>
					<view class="playing-lyric-wrapper">
						<view class="playing-lyric">{{ playingLyric
						 
						 
						 
						 
						        }}</view>
					</view>
				</view>
				<view v-else class="middle-r">
					<scroll-view scroll-y style="height: 100%" :scroll-top="scrollTop" @touchstart="handleDragStatus" @scroll="handleDrag">
						<view class="lyric-wrapper">
							<view v-if="currentLyric">
								<view class="text" :class="{ current: currentLineNum === index }" v-for="(line, index) in currentLyric.lines" :key="index">
									<view :style="{ visibility: currentLineNum === index ? 'hidden' : 'visible' }">{{ line.txt }}</view>
									<view v-if="currentLineNum === index" class="text-item">{{ line.txt }}</view>
									<view v-if="currentLineNum === index" :style="{ width: `${currentWidth}px`, transition: `all ease ${line.duration}ms` }" class="text-item">
										{{ line.txt }}
									</view>
								</view>
							</view>
							<view class="text" v-else>抱歉，暂未搜索到歌词~！</view>
						</view>
					</scroll-view>
				</view>
			</transition>
		</view>
	</view>
</template>

<script>
import Lyric from '../../utils/lyric.js'
import { mapGetters } from 'vuex';
import {CLOUD_ENV} from '../../config/index.js'
export default {
	data() {
		return {
			showLyricFlag: false,
			currentLyric: null,
			currentLineNum: 0,
			playingLyric: ''
			
		};
	},
	computed: {
		...mapGetters(['currentSong', 'playing', 'currentIndex', 'statusBarHeight', 'audio'])
	},
	mounted() {},
	methods: {
		handleBack() {
			wx.navigateBack();
		},
		getLyric() {
			this.currentSong.getLyric();
		},
		// 处理歌词
		handleLyric(lyric) {
			console.log('lyric ==>', lyric)
			let lineNum = lyric.lineNum
			this.currentLineNum = lineNum
			this.playingLyric = lyric.txt
			if (lineNum > 5) {
				
			}
			
		}
	},
	watch: {
		currentSong: {
			immediate: true,
			async handler(newSong, oldSong) {
				console.log('newSong', newSong);
				console.log(this.audio)
				if (!newSong?.id) return 
				if (newSong?.id === oldSong?.id) return 
				
				// 获取音频、歌词
				const [playUrl, lyric] = await Promise.allSettled([newSong.getUrl(), newSong.getLyric()])
				console.log('lyric ===>',playUrl, lyric)
				// 处理歌词
				if (lyric.status === 'fulfilled') {
					this.currentLyric = new Lyric(lyric.value.lrc, lyric.value.tlyric, this.handleLyric)
				}
				const {} = newSong
			}
		}
	}
};
</script>

<style scoped>
.player-page {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
.background {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	opacity: 0.6;
	filter: blur(20px);
}
.background img {
	width: 100%;
	height: 100%;
}
.top {
	position: relative;
	margin-bottom: 50rpx;
}
.top .back {
	position: absolute;
	top: ;
	left: 12rpx;
	z-index: 50;
}
.top .icon-back {
	display: block;
	width: 30rpx;
	height: 30rpx;
	background-color: #fff;
	padding: 9px;
	color: #fff;
	transform: rotate(-90deg);
}
.top .title {
	width: 50%;
	margin: 0 auto;
	line-height: 80rpx;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 36rpx;
	color: #fff;
}
.top .subtitle {
	font-size: 28rpx;
	line-height: 40rpx;
	text-align: center;
	color: #fff;
}

/* 歌词部分 */
.middle {
	position: fixed;
	width: 100%;
	top: 210rpx;
	bottom: 340rpx;
	white-space: nowrap;
	font-size: 0;
}
.middle-l {
	position: relative;
	width: 100%;
	height: 0;
	padding-top: 80%;
}
.cd-wrapper {
	position: absolute;
	left: 10%;
	top: 0;
	width: 80%;
	height: 100%;
}
.cd {
	position: relative;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border: 10px solid rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}
.cd.play {
	animation: rotate 20s linear infinite;
}
.cd.pause {
	animation-play-state: paused;
}

.image {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.playing-lyric-wrapper {
	width: 80%;
	margin: 60rpx auto 0 auto;
	overflow: hidden;
	text-align: center;
}
.playing-lyric {
	height: 40rpx;
	line-height: 40rpx;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.7);
}
</style>
