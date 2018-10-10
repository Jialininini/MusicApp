import jsonp from '../common/js/jsonp';
import { commonParams,options } from './config';
import axios from 'axios';
const getSingerList = ()=>{
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
    const data = Object.assign({},commonParams,{
        channel:"singer",
        page:'list',
        key:"all_all_all",
        pagesize:100,
        pagenum:1,
        hostUin:0,
        needNewCode:0,
        platform:'yqq',
        g_tk:5381
    });
    return jsonp(url,data,options)
}

//定义歌手歌曲列表方法
const getSingerDetails=(singermid)=>{
    const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg`;
    const data = Object.assign({},commonParams,{
        singermid:singermid,
        hostUin:0,
        needNewCode:0,
        platform:'yqq',
        order:'listen',
        begin:0,
        num:100,
        songstatus:1
    });
    return jsonp(url,data,options)
}

//定义获取 vkey的方法
const getVkey=(mid)=>{
    const url = '/api/getVkey';
    const data = Object.assign({},commonParams,{
        g_tk:5381,
        hostUin:0,
        format:'json',
        notice:0,
        platform:'yqq',
        needNewCode:0,
        cid:205361747,
        uin:0,
        songmid:mid,
        filename: `C400${mid}.m4a`,
        guid:9933550749
    });
    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export{
    getSingerList,
    getSingerDetails,
    getVkey
}

