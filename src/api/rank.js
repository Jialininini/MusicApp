import jsonp from '../common/js/jsonp';
import { commonParams,options } from './config';

const getRankList = (topid)=>{
    const url = `https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg`;
    const data = Object.assign({},commonParams,{
        topid: topid,//接受传入的参数
        needNewCode: 1,
        uin:0,
        tpl:3,
        page:'detail',
        type:'top',
        platform:'h5'   
    });
    return jsonp(url,data,options)
}

const getMusicList = (topid)=>{
    const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg`;
    const data = Object.assign({},commonParams,{
        topid: topid,//接受传入的参数
        needNewCode: 1,
        g_tk:5381,
        uin:0,
        tpl:3,
        notice:0,
        page:'detail',
        type:'top',
        platform:'h5' 
    })
    return jsonp(url,data,options)
}

export {getRankList,getMusicList}