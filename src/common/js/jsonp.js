// 引入 jsonp(url,opts,fn) 依赖
import codeJsonp from 'jsonp';
// 创建jsonp接口并导出
export default (url,data,option)=>{
  // jsonp 发送 get 请求
  url+= "?" + param(data);
  // 返回一个 promise 对象
  return new Promise((res,rej)=>{
    // 调用 codeJsonp 
    codeJsonp(url,option,(err,data)=>{
      if(!err){
        res(data);
      }else{
        rej(err);
      }
    });
  }); 
};

// 解析 data 对象的方法
function param(data){
  let urlData = '';
  for(var key in data){
    let value = data[key]!=undefined?data[key]:'';
    urlData += `&${key}=${value}`; 
  }
  return urlData ? urlData.slice(1): '';
}