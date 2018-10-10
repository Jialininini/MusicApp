const getters = {
    getSinger(state){
        return state.singer;
    },
    //分别设置getters
    playing(state){
        return state.playing;
    },
    fullScreen(state){
        return state.fullScreen;
    },
    playList(state){
        return state.playList;
    },
    orderList(state){
        return state.orderList;
    },
    currentIndex(state){
        return state.currentIndex;
    },
    mode(state){
        return state.mode;
    },
    //设置当前播放的歌曲
    currentSong(state){
        return state.playList[state.currentIndex]||{};
    },
    getDiscItem(state){
        return state.discItem
    },
    getTopList(state){
        return state.topList
    }

}
export default getters;