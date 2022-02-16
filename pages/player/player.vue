<template>
	<view class="player-page">
		<view class="background"><img :src="currentSong.image" alt="" width="100%" height="100%" /></view>

		<view class="top" :style="{ marginTop: `${statusBarHeight}px` }">
			<view class="back  " @click="handleBack"><view class="iconfont  icon-fanhui"></view></view>
			<view class="title">{{ currentSong.name }}</view>
			<view class="subtitle">{{ currentSong.singer }}</view>
		</view>

		<view class="middle" id="middle">
			<view class="middle-l" :class="{ show: !showLyricFlag }" v-if="!showLyricFlag">
				<view class="cd-wrapper" @click="showLyricFlag = true">
					<div class="cd" :class="[playing ? 'play' : 'pause']"><img class="image" :src="currentSong.image" alt="" /></div>
				</view>
				<view class="playing-lyric-wrapper">
					<view class="playing-lyric">{{ playingLyric }}</view>
				</view>
			</view>
			<view class="middle-r" :class="{ show: showLyricFlag }" v-else>
				<scroll-view
					:scroll-y="true"
					style="height: 100%"
					enhanced
					:show-scrollbar="false"
					:scroll-into-view="scrollIntoView"
					:scroll-with-animation="true"
					@scroll="handleScroll"
					@click="showLyricFlag = false"
				>
					<view class="lyric-wrapper">
						<view v-if="currentLyric">
							<view class="text" :id="`lyric-${index}`" :class="{ current: currentLineNum === index }" v-for="(line, index) in currentLyric.lines" :key="index">
								{{ line.txt }}
							</view>
						</view>
						<view class="text" v-else>努力加载歌词...</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 操作栏 -->
		<view class="buttom">
			<!-- 进度条 -->
			<view class="progress-wrapper">
				<view class="time time-l">{{ format(currentTime) }}</view>
				<div class="progress-bar" id="progressBar" @click="progressClick">
					<div class="bar-inner">
						<div class="progress" :style="{ width: `${offsetWidth}px` }"></div>
						<div
							class="progress-btn-wrapper"
							:style="{ transform: `translate3d(${offsetWidth}px, 0 ,0 )` }"
							@touchstart.prevent="progressTouchStart"
							@touchmove.prevent="progressTouchMove"
							@touchend="progressTouchEnd"
						>
							<div class="progress-btn"></div>
						</div>
					</div>
				</div>
				<view class="time time-r">{{ format(currentSong.duration) || 0 }}</view>
			</view>

			<!-- 操作栏 -->
			<view class="operators">
				<view class="icon i-left" @click="changeMode"><text class="iconfont" :class="iconMode"></text></view>
				<view class="icon i-left" :class="disableCls"><text class="iconfont icon-prev" @click="prev"></text></view>
				<view class="icon i-center" :class="disableCls"><text class="iconfont" :class="palyIcon" @click="togglePlaying"></text></view>
				<view class="icon i-right" :class="disableCls"><text class="iconfont icon-next" @click="next"></text></view>
				<view class="icon i-right"><text class="iconfont" :class="getFavoriteIcon"></text></view>
			</view>
		</view>
	</view>
</template>

<script>
import Lyric from '../../utils/lyric.js';
const PROGRESSBTNWIDTH = 16;
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { CLOUD_ENV, playMode } from '../../config/index.js';
import { shuffle } from '../../utils/index.js';
export default {
	data() {
		return {
			showLyricFlag: false,
			currentLyric: null,
			currentLineNum: 0,
			playingLyric: '',
			scrollIntoView: '',
			// 进度条按钮 offsetWidth
			offsetWidth: 0,
		};
	},
	computed: {
		iconMode() {
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
		},
		palyIcon() {
			return this.playing ? 'icon-pause' : 'icon-play';
		},

		percent() {
			return (this.currentTime / this.currentSong.duration) * 100;
		},
		disableCls() {
			return this.songReady ? '' : 'disable';
		},
		getFavoriteIcon() {
			if (this.isFavorite) {
				return 'icon-favorite';
			} else {
				return 'icon-not-favorite';
			}
		},
		isFavorite() {
			const { name } = this.currentSong;
			let index = this.favoriteList.findIndex(item => {
				return item.name === name;
			});
			return index > -1;
		},
		...mapGetters(['currentSong', 'playing', 'currentIndex', 'statusBarHeight', 'audio', 'mode', 'favoriteList', 'sequenceList', 'playList', 'songReady', 'isHide', 'currentTime'])
	},
	created() {
		this.touch = {};
	},
	mounted() {
		this.getProgressRect();
	},
	destroyed() {
		if (this.audio.oncanplay) {
			this.audio.onCanplay(() => {});
		}
	},
	methods: {
		// 获取进度条的尺寸
		getProgressRect() {
			const that = this;
			const query = wx.createSelectorQuery();
			query.select(`#progressBar`).boundingClientRect();
			query.selectViewport().scrollOffset();
			query.exec(function(res) {
				// res[0].top       // #the-id节点的上边界坐标
				// res[1].scrollTop // 显示区域的竖直滚动位置
				// console.log(res)
				const { left, width } = res[0];
				that.progressRect = {
					width,
					left
				};
			});
		},
		handleBack() {
			wx.navigateBack();
		},
		_pad(num, n = 2) {
			let len = num.toString().length;
			while (len < n) {
				num = '0' + num;
				len++;
			}
			return num;
		},
		format(interval) {
			interval = interval | 0;
			const minute = (interval / 60) | 0;
			const second = this._pad(interval % 60);
			return `${minute}:${second}`;
		},
		handleScroll() {
			this.lyricScrolling = true;
			this.lyricTimer && clearTimeout(this.lyricTimer);
			this.lyricTimer = setTimeout(() => {
				this.lyricScrolling = false;
			}, 100);
		},
		// 处理歌词
		handleLyric(lyric) {
			// console.log('lyric ==>', lyric);
			let lineNum = lyric.lineNum;
			this.currentLineNum = lineNum;
			this.playingLyric = lyric.txt;
			if (lineNum > 3 && this.showLyricFlag && !this.lyricScrolling) {
				this.scrollIntoView = `lyric-${lineNum - 3}`;
			}
		},

		/* ========================= 音频播放逻辑 ============================================ */
		// 改变播放模式
		changeMode() {
			const mode = (this.mode + 1) % 3;
			this.setPlayMode(mode);
			let list = null;
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList);
			} else {
				list = this.sequenceList;
			}
			this.restCurrentIndex(list);
			this.setPlayList(list);
		},
		restCurrentIndex(list) {
			let index = list.findIndex(item => {
				return item.id === this.currentSong.id;
			});
			this.setCurrentIndex(index);
		},
		loop() {
			if (this.currentLyric) {
				this.currentLyric.seek(0);
			}
		},
		prev() {
			if (!this.songReady) {
				return;
			}
			this.dispatchPrev().then(res => {
				// 单曲循环的时候不清除歌词
				if (res === 'loop') {
					this.loop()
				}else {
					this.currentLyric = null
				}
			})
		},

		togglePlaying() {
			if (!this.songReady) {
				return;
			}
			this.dispatchTogglePlay()
			if (this.currentLyric) {
				this.currentLyric.togglePlay();
			}
		},
		next() {
			if (!this.songReady) {
				return;
			}
			this.dispatchNext().then(res => {
				if (res === 'loop') {
					this.loop()
				} else {
					this.currentLyric = null
				}
			})
		},
		
		// 重置歌词
		resetLyric() {
			const song = this.currentSong
			this.currentLyric = new Lyric(song.lyric.lrc, song.lyric.tlyric, this.handleLyric);
			this.currentLyric.seek(this.currentTime * 1000)
			if (this.playing) {
				this.currentLyric.play()
			}
		},
		/* ====================== progress-bar 逻辑 ============================= */
		progressClick(e) {
			const { x } = e.mp.detail;
			const offsetWidth = Math.ceil(x - this.progressRect.left);
			this.offsetWidth = offsetWidth;
			this._triggerPercent();
		},
		_triggerPercent() {
			const barWidth = this.progressRect.width - PROGRESSBTNWIDTH;
			const percent = this.offsetWidth / barWidth;

			let currentTime = percent * this.currentSong.duration;
			this.audio.seek(currentTime);
			if (!this.playing) {
				this.togglePlaying();
			}
			if (this.currentLyric) {
				this.currentLyric.seek(currentTime * 1000);
			}
		},
		// 拖拽操作栏
		progressTouchStart(e) {
			this.touch.initiated = true;
			this.touch.startX = e.mp.touches[0].pageX;
			this.touch.left = this.offsetWidth;
		},

		progressTouchMove(e) {
			if (!this.touch.initiated) {
				return;
			}
			const deltaX = e.touches[0].pageX - this.touch.startX;
			const offsetWidth = Math.min(this.progressRect.width - PROGRESSBTNWIDTH, Math.max(0, this.touch.left + deltaX));
			this.offsetWidth = Math.ceil(offsetWidth);
		},
		progressTouchEnd(e) {
			this.touch.initiated = false;
			this._triggerPercent();
		},
		...mapMutations({
			setPlayingState: 'SET_PLAYING_STATE',
			setPlayMode: 'SET_MODE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayList: 'SET_PALYLIST'
		}),
		...mapActions(['dispatchLoop', 'dispatchTogglePlay', 'dispatchNext',  'dispatchPrev'])
	},
	watch: {
		currentSong: {
			immediate: true,
			deep:true,
			async handler(newSong, oldSong) {
				console.log('newSong', newSong)
				if (!newSong.lyric) return;
				// 处理歌词
				this.currentLyric = new Lyric(newSong.lyric.lrc, newSong.lyric.tlyric, this.handleLyric);
				// 滚动到第一条歌词
				this.$nextTick(() =>{
					this.scrollIntoView = 'lyric-0'
				})
				
			}
		},
		// 监听播放器播放
		playing(newVal) {
			console.log('play_state_change', newVal);
			if (!this.currentLyric) return
			if (newVal) {
				// 播放歌词
				this.currentLyric.play();
			} else {
				// 暂停歌词
				this.currentLyric.stop();
			}
		},
		percent(newPencent) {
			if (!this.progressRect) return;
			if (newPencent > 0 && !this.touch.initiated) {
				const barWidth = this.progressRect.width - PROGRESSBTNWIDTH;
				const offsetWidth = (newPencent / 100) * barWidth;
				this.offsetWidth = offsetWidth;
			}
		},
		// 重置歌词
		isHide(newVal) {
			if (!newVal) {
				this.resetLyric()
			}
		},
		// 单曲循环，后重置audio currentTime, 修改歌词
		currentTime(newVal, oldVal) {
			if (newVal === 0 && newVal !== oldVal && this.currentLyric) {
				this.currentLyric.seek(0)
				this.scrollIntoView = 'lyric-0'
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
	top: 6rpx;
	left: 12rpx;
	z-index: 50;
}
.top .icon-fanhui {
	display: block;
	width: 30rpx;
	height: 30rpx;
	padding: 9px;
	color: #fff;
	font-size: 32rpx;
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
.middle-l.show,
.middle-r.show {
	animation: fade 0.5s ease 0s 1 both;
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
	max-height: 72rpx;
	line-height: 36rpx;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.7);
	white-space: pre-wrap;
	word-wrap: break-word;
	word-break: normal;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.middle-r {
	position: relative;
	width: 100%;
	height: 100%;
}
.middle-r view {
	font-size: 28rpx;
}
.lyric-wrapper {
	width: 80%;
	margin: 0 auto;
	overflow: hidden;
	text-align: center;
}
.lyric-wrapper .text {
	color: rgba(255, 255, 255, 0.5);
	/* line-height: 64rpx; */
	font-size: 28rpx;
	white-space: pre-wrap;
	word-wrap: break-word;
	word-break: normal;
	transition: all 0.3s ease-in-out;
	margin: 24rpx 0;
}
.lyric-wrapper .text.current {
	color: #fff;
	font-size: 32rpx;
}

/* 进度条 */
.buttom {
	position: absolute;
	bottom: 100rpx;
	width: 100%;
}
.progress-wrapper {
	display: flex;
	align-items: center;
	width: 80%;
	margin: 0 auto;
	padding: 20rpx 0;
}
.progress-wrapper .time {
	flex: 0 0 60rpx;
	color: #ffffff;
	font-size: 24rpx;
	width: 60rpx;
	line-height: 60rpx;
}
.progress-wrapper .time-l {
	text-align: left;
}
.progress-wrapper .time-r {
	text-align: right;
}
.progress-component {
	flex: 1;
}
.progress-bar {
	flex: 1;
	display: flex;
	align-items: center;
	height: 60rpx;
}
.bar-inner {
	position: relative;
	width: 100%;
	height: 8rpx;
	border-radius: 4rpx;
	background-color: rgba(0, 0, 0, 0.3);
}
.bar-inner .progress {
	position: absolute;
	height: 100%;
	background: #ffffff;
	border-radius: 4rpx;
}
.progress-btn-wrapper {
	position: absolute;
	left: -16rpx;
	top: -26rpx;
	width: 60rpx;
	height: 60rpx;
}
.progress-btn {
	position: relative;
	top: 14rpx;
	left: 14rpx;
	box-sizing: border-box;
	width: 16px;
	height: 16px;
	border: 3px solid rgba(0, 0, 0, 0.4);
	border-radius: 50%;
	background: #ffffff;
}

/* 操控栏 */
.operators {
	display: flex;
	align-items: center;
}
.operators .icon {
	flex: 1;
	color: #ffffff;
}
.operators .icon.disable {
	color: rgba(255, 255, 255, 0.5);
}
.operators .icon text {
	font-size: 60rpx;
}
.operators .i-left {
	text-align: right;
}
.operators .i-right {
	text-align: left;
}
.operators .i-center {
	padding: 0 40rpx;
	text-align: center;
}
@keyframes rotate {
	0% {
		transform: rotate(0);
	}
	100% {
		transform: rotate(360deg);
	}
}

@keyframes fade {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
