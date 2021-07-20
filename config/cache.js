const FAVORITE_KEY = '_favorite_'


// 获取收藏列表
export function loadFavorite() {
	let data = []
	wx.getStorage({
	  key: FAVORITE_KEY,
	  success (res) {
	    console.log(res.data)
	  }
	})
	return data
}