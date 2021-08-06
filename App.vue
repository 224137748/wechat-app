<script>
	import {
		playMode
	} from 'config/index.js';
	import {
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex';
	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.getStatusBarHeight();
		},
		onShow: function() {
			console.log('App Show');
			this.setIsHide(false);
		},
		onHide: function() {
			console.log('App Hide');
			this.setIsHide(true);
		},
		computed: {
			...mapGetters(['audio', 'playing', 'currentSong', 'mode'])
		},
		created() {
			this.dispatchLogin()
		},
		mounted() {
			// console.log('audio__mounted', this.audio);
			this.audio.onPlay(() => {
				this.setPlayingState(true);
			});
			this.audio.onPause(() => {
				this.setPlayingState(false);
			});
			this.audio.onCanplay(() => {
				console.log('audio  canplay -----------------')
				wx.hideLoading()
				this.setSongReady(true);
				this.setPlayingState(true);
				this.audio.play();
			});

			this.audio.onWaiting(() => {
				wx.showLoading({
					title: '加载中...'
				})
				console.log('audio waiting loading  --------------------');
				// 如果网络条件比较差，暂停歌词播放播放，
				this.setPlayingState(false);
			});

			this.audio.onTimeUpdate(() => {

				this.setCurrentTime(this.audio.currentTime);
			});
			this.audio.onError(error => {
				this.setPlayingState(false);
				console.log('音频捕获到错误:', error);
			});

			this.audio.onEnded(() => {
				console.log('player end');
				if (this.mode === playMode.loop) {
					this.dispatchLoop();
				} else {
					this.dispatchNext();
				}
			});
			this.audio.onStop(() => {
				this.setPlayingState(false);
				console.log('player stop');
			});
			this.audio.onNext(() => {
				this.dispatchNext();
				console.log('player next');
			});
			this.audio.onPrev(() => {
				console.log('player prev');
				this.dispatchPrev();
			});
		},
		methods: {
			
			...mapMutations({
				setPlayingState: 'SET_PLAYING_STATE',
				setCurrentTime: 'SET_CURRENT_TIME',
				setSongReady: 'SET_SONG_READY',
				setIsHide: 'SET_IS_HIDE'
			}),
			...mapActions([
				'getStatusBarHeight', 
				'dispatchNext', 
				'dispatchPrev', 
				'dispatchLoop', 
				'dispatchGetUserInfo',
				'dispatchLogin',
				])
		},
		watch: {
			currentSong: {
				immediate: true,
				async handler(newSong, oldSong) {
					// 播放新歌曲之前重置播放状态
					this.setPlayingState(false);
					if (!newSong?.id) return;
					if (newSong?.id === oldSong?.id) return;

					// 获取音频、歌词
					const [playUrl, lyric] = await Promise.allSettled([newSong.getUrl(), newSong.getLyric()]);
					// console.log('lyric ===>', playUrl, lyric);

					const {
						name,
						url,
						image,
						singer,
						duration
					} = newSong;
					this.audio.title = name;
					this.audio.singer = singer;
					this.audio.coverImgUrl = image;
					this.audio.duration = duration;
					this.audio.src = url;
				}
			}
		}
	};
</script>

<style>
	@import url('./font/iconfont.css');

	/*每个页面公共css */
	.no-wrap {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.skeleton {
		background-image: linear-gradient(90deg, #f0f0f0 25%, #e3e3e3 37%, #f0f0f0 63%);
		background-size: 400% 100%;
		animation: loading 1.4s ease infinite;
		-webkit-animation: loading 1.4s ease infinite;
	}

	@-webkit-keyframes loading {
		0% {
			background-position: 100% 50%;
		}

		to {
			background-position: 0 50%;
		}
	}

	@keyframes loading {
		0% {
			background-position: 100% 50%;
		}

		to {
			background-position: 0 50%;
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}

	.fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */
		{
		opacity: 0;
	}
</style>
