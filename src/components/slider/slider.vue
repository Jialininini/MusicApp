<template>
  <div class="slider">
    <swiper class="slider-group" :options='swiperOption'>
      <swiper-slide class='slider-item' v-for='item in showSlider' :key='item.id'>
        <img :src='item.picUrl'>
      </swiper-slide> 
      <div class="swiper-pagination" slot='pagination'></div>
    </swiper>
    
    
  </div>
</template>

<script type="text/ecmascript-6">
import {swiper, swiperSlide} from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css'
export default {
  props:{
    showSlider:{
      type:Array,
      default:[]
    }
  },
  data(){
    return{
      swiperOption:{
        //loop 轮播
        loop:true,
        //设置分页样式
        pagination:{
          el:'.swiper-pagination'
        },
        autoplay:{
          delay:3000,
          //操作继续播放
          disableOninteraction:false
        }
      }
    }
  },
  components:{
    swiper,
    swiperSlide
  },
  created() {
    console.log(this.showSlider)
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
 @import '../../common/stylus/variable.styl';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>