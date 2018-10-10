<template>
<div class="search">
   <!-- 搜索框 -->
  <div class="search-box-wrapper">
    <search-box ref='searchBox' @queryChange='selectQuery'></search-box>
  </div>
  <!-- 搜索列表 -->
  <div class="shortcut-wrapper" v-show='!query'>
    <div class="shortcut">
      <div class="hot-key">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li class="item" v-for='item in hotkey' @click='addQuery(item)'>
            <span>{{item.k}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- 下拉菜单 -->
  <div class="search-result" v-show='query'>
    <suggest :query='query'></suggest>
  </div>
</div>
</template>

<script>
  import searchBox from '../../base/search-box/search-box'
  import {getHotKey} from '../../api/search.js'
  import suggest from '../suggest/suggest.vue'
  export default{
    data(){
      return {
        hotkey:[],
        query:''
      }
    },
    components:{
      searchBox,
      suggest
    },
    created() {
      this._getHotKey();
    },
    methods:{
      _getHotKey(){
        getHotKey().then(res=>{
          if(res.code==0){
            this.hotkey = res.data.hotkey.slice(0,10)
            // console.log(res.data.hotkey.slice(0,10))
          }
        })
      },
      addQuery(item){
        // console.log(item);能打印
        this.$refs.searchBox.setQuery(item.k);
      },
      selectQuery(newQuery){
        this.query = newQuery
      }
    }
  }
</script>

<style lang="stylus" >
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>