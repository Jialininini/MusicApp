'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

//引入axios HTTP库
const axios = require('axios');

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    
    //在devServer中发请求
    before(app){
      app.get('/api/getHotList',(req,res)=>{
        let url = `https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg`;
        axios.get(url,{
          headers:{
            referer :'https://c.y.qq.com',
            host:'c.y.qq.com'
          },
          params:req.query
        }).then((resolve)=>{
          res.json(resolve.data)
        }).catch((err)=>{
          console.log(err)
        })
      });
      //代理歌词数据
      app.get('/api/lyric',(req,res)=>{
        let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg';
        axios.get(url,{
          headers:{
            referer:'http://c.y.qq.com',
            host:'c.y.qq.com'
          },
          params:req.query
        }).then((response)=>{
          //resolve.data是jsonp的格式，用json处理不了诶
          // 处理jsonp格式的数据
          var ret = response.data;
          if(typeof ret =='string'){
            // let reg =  /\((.+?)\)/g;
            let reg = /\(({[^()]+})\)$/;
            ret = JSON.parse(ret.match(reg)[1])
          }
          res.json(ret)
        })
      });
      //代理热门歌曲列表
      app.get('/api/getHotSongs',(req,res)=>{
        let url = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg`;
        axios.get(url,{
          headers:{
            referer:'https://c.y.qq.com/',
            host:'c.y.qq.com'
          },
          params:req.query
        }).then((response)=>{
          res.json(response.data);
        })
      })
      //代理歌曲url的key
      app.get('/api/getVkey',(req,res)=>{
        var url= `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg`;
        axios.get(url,{
          headers:{ //代理就是让referer与host一致,解决跨域
            referer:'https://c.y.qq.com/',
            host:'c.y.qq.com'
          },
          params:req.query
        }).then(response=>{
          res.json(response.data)
        }).catch(err=>{
          console.log(err)
        })
      })

      app.get('/api/suggest',(req,res)=>{
        var url = `https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp`;
        axios.get(url,{
          headers:{
            referer:'https://c.y.qq.com/',
            host:'c.y.qq.com'
          },
          params:req.query
        }).then(response=>{
          res.json(response.data)
        }).catch(err=>{
          console.log(err)
        })
      })
    },
    
  },
    plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
