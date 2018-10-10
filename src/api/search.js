import jsonp from '../common/js/jsonp';
import {commonParams,options} from './config';
import axios from 'axios'
 const getHotKey=()=>{
    const url = `https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?`;
    const data = Object.assign({},commonParams,{
        g_tk:5381,
        uin:0,
        notice:0,
        platform:'h5',
        needNewCode:1
    })
    return jsonp(url,data,options);
}

//定义获取suggest组件的数据
const getSearch=(query,page)=>{  //跨域请求不到,so~服务器端代理
    const url='/api/suggest';
    const data = Object.assign({},commonParams,{
        w: query,//关键词
        p: page,//当前页数 
        catZhida: 1,//是否显示歌手
        g_tk: 5381,
        uin: 0,
        format: 'json',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: 20,
        remoteplace: 'txt.mqq.all'
    })
    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export {
    getHotKey,
    getSearch
}