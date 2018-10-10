<template>
  <div class="slider">
    <swipe class="slider-group" :autoplay='3000'>
      <swipe-item class='slider-item' v-for='item in showSlider' :key='item.id'>
        <img :src='item.picUrl'>
      </swipe-item> 
      
    </swipe>
    
    
  </div>
</template>

<script type="text/ecmascript-6">
import {Swipe, SwipeItem} from 'vant';
import 'vant/lib/vant-css/swipe.css'
export default {
  props:{
    showSlider:{
      type:Array,
      default:[]
    }
  },
  methods:{
  
  },
  data(){
    return{
    
    }
  },
  components:{
    Swipe,
    SwipeItem
  },
  created() {
    // console.log(this.showSlider)
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