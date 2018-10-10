import { playMode } from '../api/config'
//设置state状态
const state = {
    singer:{},//歌手个人信息Fid/Fname/Profile
    playing:false,//播放/暂停
    fullScreen:false,//全屏/mini
    playList:[],//播放列表
    orderList:[],//播放顺序列表
    currentIndex:-1, //当前播放索引
    mode: playMode.order, //播放模式
    discItem: {},
    topList:{}
}

export default state;