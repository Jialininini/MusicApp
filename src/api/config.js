// 这是我们抽取出来的公共参数
const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
};

// 定义options中的param参数 
const options = {
  param: 'jsonpCallback'
};

//定义播放模式
const playMode = {
  order:0,
  loop:1,
  random:2
}

// code 为 0 ,说明请求成功，来判断code 
const ERR_OK = 0;

// 导出接口
export {
  commonParams,
  options,
  ERR_OK,
  playMode
}