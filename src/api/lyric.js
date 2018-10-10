import { commonParams } from './config';
import axios from 'axios';

//定义一个getLyric方法  
export function getLyric(mid){ //动态获取  函数内部
    const url = '/api/lyric'; //后端代理地址
    const data = Object.assign({},commonParams,{
        songmid:mid,
        platform: 'yqq',
        hostUin:0,
        needNewCode:0,
        format:'json',
        g_tk:5381,
        pcachetime: + new Date()
    });
    //axios发起Ajax请求  Axios：http库，浏览器端可以发ajax，node端可以发http请求，返回一个promise对象
    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    }).catch((err)=>{
        return Promise.reject(err)
    })
}

// export default getLyric;
