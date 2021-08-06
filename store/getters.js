export const statusBarHeight = state => state.statusBarHeight

export const navBarHeight = state => (state.statusBarHeight + 46)

export const isHide = state => state.isHide

export const sheetData = state => state.sheetData

export const songReady = state => state.songReady

export const playing = state => state.playing

export const mode = state => state.mode

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const favoriteList = state => state.favoriteList

export const currentIndex = state => state.currentIndex

export const audio = state => state.audio

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const currentTime = state => state.currentTime

export const userInfo = state => state.userInfo