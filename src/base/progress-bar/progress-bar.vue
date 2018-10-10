<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner" @click='progressBarClick'>
      <div class="progress" ref="progress" ></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent='progressStart' @touchmove.prevent='progressMove' @touchend='progressEnd'>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    data(){
      return {}
      changedPercent
    },
   props:{
     percent:{ //播放进度参数
       type:Number,
       default:0
     }
   },
   created(){//数据在created中维护
     this.touch = {}
   },
   methods:{
     progressStart(e){
      //  console.log(111)
       this.touch.isStart = true; //表示当前touch开始
       this.touch.startX = e.touches[0].pageX; //设置触摸时X轴起始坐标
       this.touch.left = this.$refs.progress.clientWidth; //获取当前进度条宽度
     },
     progressMove(e){
       if(!this.touch.isStart){
         return;
       }
       const distanceX = e.touches[0].pageX - this.touch.startX;
       //设置真正相对progressbar的偏移量 0~progressbar宽度
       const offsetWidth = Math.min(this.$refs.progressBar.clientWidth-16, Math.max(0,this.touch.left+distanceX));
       this._offset(offsetWidth);
     },
     progressEnd(e){
       this.touch.isStart = false;
       //touch事件结束,要向父组件派发一个事件,告诉父组件现在播放的当前时间被改变了,改变percent,percent不能直接在子组件中改,需要告诉父组件,然后父组件传回来子组件再改
       this.triggerPercent();
     },
     //改变进度条方法
     _offset(width){
       this.$refs.progressBtn.style.transform = `translate3d(${width}px,0,0)`;//进度按钮就动啦
        this.$refs.progress.style.width = `${width}px`;
     },
     triggerPercent(){
       //获取bar的长度 barWidth
       //重新获取 进度条的宽度/barWidth 得到新的percent
       //派发一个percentChange事件,把percent传给父组件player
          const barWidth = this.$refs.progressBar.clientWidth - 16;
          const percent =   this.$refs.progress.clientWidth/barWidth;
          this.$emit('percentChange',percent);
     },
     progressBarClick(e){
       this._offset(e.offsetX);//先调_offset,再triggerPercent()
       this.triggerPercent();
        }
   },
   watch:{
     //watch percent的变化    touchmove的时候把watch percent停掉
     percent(newP){
       if(newP>0&&!this.touch.isStart){
         const barWidth = this.$refs.progressBar.clientWidth - 16;
        //  console.log(barWidth)
        const offsetWidth = newP * barWidth;
        // this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;//进度按钮就动啦
        // this.$refs.progress.style.width = `${offsetWidth}px`;
        this._offset(offsetWidth)
       }
     }
   }
   
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>