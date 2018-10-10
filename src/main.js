// 第一个引入
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入index.styl 
import './common/stylus/index.styl'
import fastclick from 'fastclick';
//引入vue-lazyload
import vueLazyLoad from 'vue-lazyload'
//注册插件
Vue.use(vueLazyLoad,{
  loading:require('./assets/logo.jpg')
})
//引入vuex
import store from './store';
Vue.config.productionTip = false
// 整个body下点击没有延迟300ms
fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
