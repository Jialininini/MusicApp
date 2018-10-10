//引入 mutation-type
import * as types from './mutation-type'

// const setSinger = (state,singerID)=>{
//     state.singer = singerID
// }
//mutation的方法名就是mutation-type.JS中定义的常量
const mutations = {
    //参数1.state,2.提交mutations时传入的实参
    [types.SET_SINGER](state,singerID){
        state.singer = singerID;   },
    [types.SET_PLAYING](state,flag){
        state.playing = flag;   },
    [types.SET_FULL_SCREEN](state,flag){
        state.fullScreen = flag;   },
    [types.SET_PLAY_LIST](state,list){
        state.playList = list;   },
    [types.SET_ORDER_LIST](state,list){
        state.orderList = list;   },
    [types.SET_MODE](state,mode){
        state.mode = mode;   },
    [types.SET_CURRENT_INDEX](state,index){
        state.currentIndex = index;   },
    [types.SET_DISC_ITEM](state,item){
        state.discItem = item;   },
    [types.SET_URL](state,url){
        state.playList[state.currentIndex].url = url;   },
    [types.SET_TOPLIST](state,list){
        state.topList = list;   }
}
export default mutations