const state = {
	// 顶部statusBarHeight
	statusBarHeight: 0,
	
	// 歌单详情,缓存每一个歌单的信息
	sheetData: [],
	
	// 播放状态
	playing: false,
	
	// 播放列表
	playList: [],
	
	// 当前播放歌曲的索引
	currentIndex: -1,
	
	// 收藏列表
	favoriteList: []
}

export default state