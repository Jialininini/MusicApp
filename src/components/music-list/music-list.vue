<template>
  <div class='music-list'>
    <div class='back' @click='back'>
      <i class='icon-back'></i>
    </div>
    <!-- <h1 class='title'>{{getSinger.Fname}}</h1> -->
    <h1 class='title' v-text='title'></h1>
    <div class='bg-image' :style='setBgImg' ref='bgImage'>
      <div class='filter'></div>
    </div>
    <!-- song-list -->
    <scroll class="list" :data='songs' ref='list'>
      <div class="song-list-wrapper">
        <song-list :sub-songs='songs' @select="selectItem"></song-list>
      </div>
      <!-- loading效果 -->
      <div class="loading-container" v-show='!songs.length'>
        <loading></loading>
      </div>
    </scroll>
    
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex';
import songList from '../song-list/song-list'
import scroll from '../../base/scroll/scroll'
import loading from '../../base/loading/loading'
import {mapActions} from 'vuex'
export default {
 props:{
   songs:{
     type:Array,
     default:[]
   },
   title:{
     type:String,
     default:''
   },
   bgImg:{
     type:String,
     default:''
   }
 },
 components:{
   songList,
   scroll,
   loading
 },
 computed:{
   ...mapGetters(['getSinger']),
   setBgImg(){
    //  return `background-image:url(${this.getSinger.Profile})`;
     return `background-image:url(${this.bgImg})`;
   }
 },
 methods:{
   back(){
     //此方法回到上一级
     this.$router.back();
    //  this.$router.push('/singer')
   },
   //调用song-list组件的自定义事件
   selectItem(song,index){
    //  console.log(song,index)
    //执行setPlayer
    this.setPlayer({
      list:this.songs,//歌手的所有歌曲播放列表-->当成播放列表
      index
      });
   },
   ...mapActions({
     setPlayer:"setPlaying"
   })
 },
 mounted(){
   this.$refs.list.$el.style.top=this.$refs.bgImage.clientHeight+'px';
  //  console.log(this.$refs.bgImage.clientHeight)
 }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    overflow:hidden;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>