//vuex的主文件
import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutation';
import getters from './getters';
import actions from './action';
//输出日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    //打印vuex的状态
    plugins: [createLogger()]
})