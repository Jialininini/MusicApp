import Vue from 'vue'
import Router from 'vue-router'
// 分别引入 rank recommend singer search
import Rank from '../components/rank/rank';
import Recommend from '../components/recommend/recommend';
import Singer from '../components/singer/singer';
import Search from '../components/search/search';
import SingerDetails from '../components/singer/singer-details/singer-details.vue'
import Disc from '../components/disc/disc.vue'
import TopList from '../components/topList/topList.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [{
    // 首屏默认显示 recommend
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend,
    children:[
      {
        path:':id',
        component:Disc
      }
    ]
  }, {
    path: '/rank',
    component: Rank,
    children:[
      {
        path:':id',
        component:TopList
      }
    ]
  }, {
    path: '/singer',
    component: Singer,
    children:[
      {
        path:':id',
        component:SingerDetails
      }
    ]
  }, {
    path: '/search',
    component: Search,
    children:[
      {
        path: ':id',
        component: SingerDetails
      }
    ]
  }, ]
})
