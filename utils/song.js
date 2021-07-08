export default class Song {
	constructor({id, mid, singer, name, album, duration, image, url}) {
	    this.id = id
		this.mid = mid
		this.singer = singer
		this.name = name
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url
	}
	getLyric() {
	    if (this.lyric) {
	      return Promise.resolve(this.lyric)
	    }
	    return new Promise((resolve, reject) => {
			console.log('获取歌词')
			resolve('获取歌词中')
	      // getLyric(this.mid).then((res) => {
	      //   if (res.retcode === ERR_OK) {
	      //     this.lyric = Base64.decode(res.lyric)
	      //     resolve(this.lyric)
	      //   } else {
	      //     reject('no lyric')
	      //   }
	      // })
	    })
	  }
}


export function createSong (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.ar[0].id || '',  // 歌手id
    singer: musicData.ar[0].name || '',
    name: musicData.name,
    album: musicData.al.name,
    duration: parseInt(musicData.dt / 1000),
    image: musicData.al.picUrl,
    url: '',
  })
}