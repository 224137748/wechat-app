const state = {
	// 顶部statusBarHeight
	statusBarHeight: 0,
	
	// 歌单详情,缓存每一个歌单的信息
	sheetData: [],
	
	// 播放状态
	playing: false,
	
	// 播放列表
	playList: [],
	
	//  随机播放，顺序播放，小窗显示列表
	sequenceList: [],
	
	// 当前播放歌曲的索引
	currentIndex: -1,
	
	// 收藏列表
	favoriteList: [],
	
	// 播放器
	audio: wx.getBackgroundAudioManager()
}

export default state