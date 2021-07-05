<script>
	import {mapActions} from 'vuex'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.getStatusBarHeight()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapActions(['getStatusBarHeight'])
		}
	}
</script>

<style>
/*每个页面公共css */
.no-wrap {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.skeleton {
  background-image: linear-gradient(
	90deg,
	#f0f0f0 25%,
	#e3e3e3 37%,
	#f0f0f0 63%
  );
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
</style>
