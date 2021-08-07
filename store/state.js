import {playMode} from '../config/index.js'
import {loadFavorite} from '../config/cache.js'

const state = {
	
	// 顶部statusBarHeight
	statusBarHeight: 0,
	
	// 是否隐藏小程序
	isHide: false,
	
	// 歌单详情,缓存每一个歌单的信息
	sheetData: [],
	
	// 音频是否canPlay
	songReady: false,
	
	// 播放状态
	playing: false,
	
	// 播放列表
	playList: [],
	
	// 播放模式
	mode: playMode.sequence,
	
	//  随机播放，顺序播放，小窗显示列表
	sequenceList: [],
	
	// 当前播放歌曲的索引
	currentIndex: -1,
	
	// 收藏列表
	favoriteList: loadFavorite(),
	
	// 播放器
	audio: wx.getBackgroundAudioManager(),
	
	// 播放时间
	currentTime: 0,
	
	// userInfo
	userInfo: null
}

export default state