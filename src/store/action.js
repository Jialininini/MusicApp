//对进入播放页面需要提交多次mutation进行封装
import * as types from './mutation-type'
const actions = {
//进入播放页面 设置播放状态
    setPlaying({commit,state},{list,index}){
        commit(types.SET_PLAY_LIST,list);
        commit(types.SET_ORDER_LIST,list);
        commit(types.SET_PLAYING,true);
        commit(types.SET_FULL_SCREEN,true);
        commit(types.SET_CURRENT_INDEX,index);
    }
}

export default actions;