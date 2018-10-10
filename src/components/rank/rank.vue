<template>
  <div class='rank' ref='rank'>
    <scroll class='toplist' ref='toplist'>
      <ul>
        <li class='item' v-for='item in rankList' :key='item.id' @click='selRank(item)'>
          <div class='icon'>
            <img v-lazy='item.picUrl' width='100' height='100'>
          </div>
          <ul class="songlist">
            <li v-html='item.topTitle' class='toptit'></li>
            <li class="song" v-for='(song,index) in item.songList' :key='song.id'>
              {{index+1}} <span v-html='  song.songname'></span> -
              <span v-html='song.singername'></span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- 引入loading组件 -->
      <div class="loading-container">
        <loading v-show='!rankList.length'></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRankList} from '../../api/rank.js'
  import { ERR_OK} from '../../api/config.js'
  //引入scroll
  import scroll from '../../base/scroll/scroll.vue'
  import loading from '../../base/loading/loading.vue'
  import {mapMutations} from 'vuex'
  export default{
    data(){
      return {
        rankList:[]
      }
    },
    created(){
      this._getRankList();
    },
    methods:{
      ...mapMutations({
        setTopList:'SET_TOPLIST'
      }),
      _getRankList(){
        getRankList().then((res)=>{
          if(res.code == ERR_OK){
            this.rankList = res.data.topList
            console.log(res.data.topList)
          }
        })
      },
      selRank(item){
        if(!item.id){return}
        console.log('777rank',item);
        this.$router.push({
          path:`/rank/${item.id}`
        })
        this.setTopList(item)
      }
    },
    components:{
      scroll,
      loading
    }
  }





</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
            padding: 0 17px
          .toptit
            font-size: 16px
            color: lavender
           
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>