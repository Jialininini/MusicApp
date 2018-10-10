// 引入jsonp.js 
import jsonp from '../common/js/jsonp';
// 引入公共参数 config.js
import { commonParams,options } from './config';
import axios from 'axios';
// 定义请求轮播图接口方法 
const getRecommend = ()=>{
  // 配置 url
  const url = `https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg`;
  //设置 data 读取公共参数
  const data = Object.assign({},commonParams,{
    platform: 'h5',
    uin:0,
    needNewCode: 1
  });
  // 返回一个 promise 对象
  return jsonp(url,data,options);
};

//定义请求热门列表数据接口 getHotList
const getHotList = ()=>{
  const url = `/api/getHotList`;
  const data = Object.assign({},commonParams,{
    platform:'yqq',
    hostUin: 0,
    sin:0,
    ein:29,
    sortId:5,
    needNewCode:0,
    categoryId:10000000,
    rnd:Math.random(),
    // 请求数据格式
    format:"json"
  });
  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
};

//定义热门歌曲推荐接口
const getHotSongs = (dissid)=>{
  const url = `/api/getHotSongs`;
  const data = Object.assign({},commonParams,{
    disstid: dissid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    format:'json'
  });
  return axios.get(url,{
    params: data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}

// 导出接口
export {
  getRecommend,
  getHotList,
  getHotSongs
}