<template>
  <div class="recommend">
    <scroll class='recommend-content'>
      <div>
      <!-- 轮播图 -->
        <div class='slider-wrapper'>
          <slider :show-slider='slideList'></slider>
        
        <!--<vanSlider :show-slider='slideList'></vanSlider>-->
        </div>  
        <!-- 热门歌曲列表 --> 
        <div class='recommend-list'>
          <h1 class='list-title'>热门歌曲推荐</h1>
          <ul>
            <li class="item" v-for="item in hotList" :key='item.id' @click='selectItem(item)'>
              <div class="icon">
                  <img v-lazy="item.imgurl" alt="" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html='item.dissname'></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
        <loading v-show='!hotList.length'></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRecommend,getHotList} from '../../api/recommend';
  import {ERR_OK} from '../../api/config';
  // import vanSlider from '../slider/vanSlide';
  import Slider from '../slider/slider';
  //引入scroll
  import scroll from '../../base/scroll/scroll.vue'
  import loading from '../../base/loading/loading.vue'
  import { mapMutations,mapGetters } from 'vuex';
  export default {
    data() {
      return {
        //轮播图数据
        slideList: [],
        hotList:[]
      }
    },
    created() {
      this._getRecommend();
      this._getHotList();
    },
    methods: {
      //调用轮播数据请求
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code == ERR_OK) {
            this.slideList = res.data.slider
          }
        }).catch((err) => {})
      },
      //调用热门歌曲列表数据请求
      _getHotList(){
        getHotList().then((res)=>{
          if(res.code == ERR_OK){
            // console.log(res)
           this.hotList = res.data.list
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      ...mapMutations({
        setDiscItem:"SET_DISC_ITEM"
      }),
      selectItem(item){
        //设置路由的跳转
        this.$router.push({
          path:`/recommend/${item.dissid}`
        });;
        // console.log('1111',item)
        this.setDiscItem(item)
      }
    },
    components:{
      Slider,
      scroll,
      loading
    }
  }
</script>

<style scoped lang="stylus">
 @import "../../common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

</style>
