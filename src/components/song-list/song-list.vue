<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for='(song,index) in subSongs' @click='selectSong(song,index)'>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer}} / {{song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
 props:{
   subSongs:{
     type:Array,
     default:[]
   }
 },
 methods:{
   selectSong(song,index){
     //向父组件musicList派发自定义事件
     this.$emit('select',song,index)
   }
 }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    // .rank {
    //   flex: 0 0 25px;
    //   width: 25px;
    //   margin-right: 30px;
    //   text-align: center;

    //   .icon {
    //     display: inline-block;
    //     width: 25px;
    //     height: 24px;
    //     background-size: 25px 24px;

    //     &.icon0 {
    //       bg-image('first');
    //     }

    //     &.icon1 {
    //       bg-image('second');
    //     }

    //     &.icon2 {
    //       bg-image('third');
    //     }
    //   }

    //   .text {
    //     color: $color-theme;
    //     font-size: $font-size-large;
    //   }
    // }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      padding-left:20px;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>