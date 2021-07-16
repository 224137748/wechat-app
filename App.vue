<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
	onLaunch: function() {
		console.log('App Launch');
		this.getStatusBarHeight();
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	computed: {
		...mapGetters(['audio'])
	},
	mounted() {
		console.log('audio__mounted', this.audio);
		this.audio.onPlay(() => {
			this.setPlayingState(true);
		});
		this.audio.onPause(() => {
			this.setPlayingState(false);
		});
		this.audio.onTimeUpdate(() => {
			// props.setPlaying.call(this, { currentTime: audioDom.currentTime })
			// console.log('current_time', this.audio.currentTime);
		});
		this.audio.onError((error) => {
			console.log('音频捕获到错误:', error)
		})
		
		this.audio.onEnded(() => {
			console.log('player end')
		})
		this.audio.onStop(() => {
			this.setPlayingState(false);
			console.log('player stop')
		})
		this.audio.onNext(() => {
			console.log('player next')
		})
		this.audio.onPrev(() => {
			console.log('player prev')
		})
	},
	methods: {
		...mapMutations({
			setPlayingState: 'SET_PLAYING_STATE'
		}),
		...mapActions(['getStatusBarHeight'])
	}
};
</script>

<style>
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
