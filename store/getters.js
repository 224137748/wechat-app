export const statusBarHeight = state => state.statusBarHeight

export const navBarHeight = state => (state.statusBarHeight + 46)

export const sheetData = state => state.sheetData

export const playing = state => state.playing

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const favoriteList = state => state.favoriteList

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}