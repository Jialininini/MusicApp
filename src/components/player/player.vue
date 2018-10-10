<template>
  <div class='player' v-show='playList.length>0'>
    <!-- 全屏播放页面 -->
    <transition name='normal'>
      <div class='normal-player' v-show='fullScreen'>
        <div class='background'>
          <img width='100%' height='100%'>
        </div>
        <!-- 返回按钮和歌曲信息 -->
        <div class='top'>
          <div class='back'>
            <i class='icon-back' @click='mini'></i>
          </div>
          <h1 class='title' v-html='currentSong.name'></h1>
          <h2 class='subtitle' v-html='currentSong.singer'></h2>
        </div>
        <!-- 中间播放的CD -->
        <div class='middle' @touchstart.prevent='startCD' @touchmove.prevent='moveCD' @touchend='endCD'>
          <div class='middle-l' ref='middleL'>
            <div class='cd-wrapper'>
              <div class='cd' :class="rotateCD">
                <img class='image' :src="currentSong.image" alt="">
              </div>
            </div>
            <div class='playing-lyric-wrapper'>
              <div class='playing-lyric'>
                {{playLyric}}
              </div>
            </div>
          </div>
          <!-- 滚动歌词部分 -->
          <scroll class='middle-r' ref='lyricList'> 
            <div class='lyric-wrapper'>
              <div v-if='currentLyric'>
                <p ref='lyricLine' class='text' v-for='(items,index) in currentLyric.lines' :class='{"current":currentLine==index}'>{{items.txt}}</p>
              </div>
            </div>
          </scroll>
          
        </div>
        <!-- 底部的按钮 -->
        <div class='bottom'> 
          <!-- CDlyric切换 -->
          <div class='dot-wrapper'> 
            <span class='dot' :class='{"active":currentShow=="CD"}'></span>
            <span class='dot' :class='{"active":currentShow=="lyric"}'></span>
          </div>
          <!-- 播放进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">
              {{setCtime(currentTime)}}
            </span>
            <div class="progress-bar-wrapper">
              <!-- 进度条 -->
              <progress-bar :percent='percent' @percentChange='timeChange'></progress-bar>
            </div>
            <!-- 总时长 -->
            <span class="time time-r">
               {{setCtime(currentSong.duration)}}
            </span>
          </div>
          <div class='operators'>
            <div class='icon i-left'>
              <i :class='modeIcon' @click='changeMode'></i>
            </div>
            <div class='icon i-left'>
              <i class='icon-prev' @click="prevSong"></i>
            </div>
            <div class='icon i-center' >
              <i @click='togglePlay' :class='playIcon'></i>
            </div>
            <div class='icon i-right'>
              <i class='icon-next' @click="nextSong"></i>
            </div>
            <div class='icon i-right'>
              <i class='icon-not-favorite'></i>
            </div>
          </div>
        </div>
      </div>
     </transition>
    <!-- mini播放页面 -->
    <transition name='mini'>
      <div class='mini-player' v-show='!fullScreen' @click="full">
          <div class='icon'>
            <img width='40' height='40' :src='currentSong.image' :class="rotateCD">
          </div>
          <div class='text' @click="full">
            <h2 class='name' v-html='currentSong.name'></h2>
            <p class='desc' v-html='currentSong.singer'></p>
          </div>
        
        <div class='control'>
          <i @click.stop='togglePlay' :class='miniIcon'></i></div>
        <div class='control'>
          <i class='icon-playlist'></i>
        </div>
      </div>  
    </transition>
    <!-- 音频播放器 canplay的时候才play() -->
    <audio :src="currentSong.url" ref='audio' @canplay='canplay' @error="error" @timeupdate="timeupdate" @ended='ended'></audio>
  </div> 
</template>

<script type="text/ecmascript-6">
//通过提交mutation来修改fullScreen的值
import { mapMutations,mapGetters } from 'vuex';
import progressBar from '../../base/progress-bar/progress-bar.vue';
import {playMode} from '../../api/config.js'
import LyricParser from 'lyric-parser'
import Scroll from '../../base/scroll/scroll'
import {getVkey} from '../../api/singer.js'
export default {
  data(){
    return {
      songReady: false,//表示歌曲已准备好,加载完成
      currentTime: 0, //当前播放事件
      currentLyric:null, //当前歌词
      currentLine:null,
      currentShow:"CD",
      playLyric:''
    }
  },
  components:{
    progressBar,
    Scroll
  },
  created() {
    // this.fullScreen(true)
    // console.log(this.currentSong)
    this.touch={}; //存放关联3个touch事件的状态
  },
  computed:{
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      "playing",
      "currentIndex",
      "mode",
      "orderList"
    ]),
    playIcon(){
      return this.playing ? "icon-pause" : "icon-play";
    },
   miniIcon(){
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    rotateCD(){
      return this.playing? "play" : "play pause"
    },
    //计算播放速度
    percent(){
      return this.currentTime/this.currentSong.duration;
    },
    modeIcon(){
      return this.mode===playMode.order?"icon-sequence":this.mode===playMode.loop?"icon-loop":"icon-random"
    }
  },
  
  methods:{
    // ...mapMutations({
    //   fullScreen: 'SET_FULL_SCREEN'
    // })
    ...mapMutations({
    setScreen:"SET_FULL_SCREEN",
    setPlay:"SET_PLAYING",
    setCurrentIndex:"SET_CURRENT_INDEX",
    setMode:"SET_MODE",
    setPlayList:"SET_PLAY_LIST",
    setUrl:'SET_URL'
    }),
    mini(){
      this.setScreen(false);//通过提交mutation设置参数,改变播放页面的显示
    },
    full(){
      this.setScreen(true);
    },
    //设置playing状态的改变
    togglePlay(){
      if(this.currentLyric){
        this.currentLyric.togglePlay()
      }
      this.setPlay(!this.playing)
    },
    //切换歌曲方法
    prevSong(){
      //先判断歌曲有没有就绪
      if(!this.songReady){return}
      //先获取currentIndex--mapgetters中声明
      let index = this.currentIndex - 1;
      if(index==-1){
        index = this.playList.length-1;
      }
      this.setCurrentIndex(index);
      if(!this.playing){  //判断点击切换歌曲时playing的状态,如果是暂停,切换之后自动播放
        this.togglePlay()
      };
      this.songReady = false;
    },
    nextSong(){
      //先判断歌曲有没有就绪
      if(!this.songReady){return}
      let index = this.currentIndex+1;
      if(index===this.playList.length){
        index=0;
      }
      this.setCurrentIndex(index);
      if(!this.playing){
        this.togglePlay()
      };
       this.songReady = false;
    },
    canplay(){//此方法触发表示歌曲以就绪可以播放了
      this.songReady = true;
    },
    error(e){
      console.log(e);
    },
    timeupdate(e){//本事件可以获取当前播放时间 currentTime,本宝宝是audio的一个属性
      // console.log(e)
      // console.log(e.target.currentTime)
      this.currentTime = e.target.currentTime;
    },
    //处理currentTime 格式化为 00:20 的形式 返回mm:ss;
    setCtime(time){
      time = Math.floor(time);
      let m = Math.floor(time/60);
      let s = time % 60;
      s = s.toString().length<2 ? ("0" + s ) : s;
      m = m.toString().length<2 ? ("0" + m ) : m;
      return `${m}:${s}`;
    },
    timeChange(percent){
      // console.log("p",p)
      //根据percent来改变当前播放时间
      this.$refs.audio.currentTime = percent*this.currentSong.duration

      //拖动播放进度=>歌词进度改变
       const currentTime = this.currentSong.duration*percent;
       if(this.currentLyric){
        this.currentLyric.seek(currentTime*1000);
      }
    },
    //点击改变播放模式,之前要把mode的状态,store state中,mapmutation中添加映射方法
    //实现随机模式的播放功能
    changeMode(){
      let mode = (this.mode+1)%3;//0 1 2 之间切换
      this.setMode(mode);
      //定义一个随机播放列表
      let list = null;
      //乱序orderList   mapgetters中引入
      // console.log(this.orderList);
      if(mode == playMode.random){
        list = this.randomOrderList(this.orderList);
      }else{
        list = this.orderList
      }
      this.resetCurrentIndex(list)
      //提交mutation 
      this.setPlayList(list)
    },
    randomOrderList(list){//播放列表洗牌
      let _arr = list.slice(); //拷贝一份
      for(let i=0;i<_arr.length;i++){
        //在0-i之间生成一个随机整数,
        let int = Math.floor(Math.random()*(i+1));
        let index = _arr[i];
        _arr[i] = _arr[int];
        _arr[int] = index;
      }
      return _arr;
    },
    resetCurrentIndex(list){
      let index = list.findIndex((item)=>{//找到数组中某一个元素对应的下标,此api只返回下标
        return item.id == this.currentSong.id
      });
      //提交mutation来改变currentIndex
      this.setCurrentIndex(index)
    },
    ended(){
      //判断当前模式是不是循环模式
      if(this.mode== playMode.loop){
        this.loop()
      }else{//否则切换下一首
        this.nextSong()
      }
    },
    loop(){//循环播放方法
      this.$refs.audio.currentTime==0;
      this.$refs.audio.play();
      if(this.currentLyric){
        this.currentLyric.seek();
      }
    },
    //处理歌词数据结构
    getLyricParser(){
      this.currentSong._getLyric().then((lyric)=>{
        //LyricParser有2个参数：lyric和回调
        //回调有1参数对象：{lineNum当前播放行,txt播放行内容}
        this.currentLyric = new LyricParser(lyric,({lineNum,txt})=>{
          this.currentLine = lineNum;
          //当前播放的歌词
          this.playLyric = txt;
          //判断当前currentLine>5,就让整个歌词进行滚动
          if(lineNum > 5){
            let elem = this.$refs.lyricLine[lineNum - 5]
            //调用scroll组件上的方法 scrollToElement()
            this.$refs.lyricList.scrollElement(elem,1000)
          }else{
            this.$refs.lyricList.scrollTo(0,0,1000)
          }
        })
          // console.log(this.currentLyric)

          if(this.playing){
            this.currentLyric.play()
          }
      }).catch((err)=>{
        //如果歌词获取失败,重置这些参数
        this.currentLyric = null;
        this.playLyric = '';
        this.currentLine = 0;
      })
    },
    //CD/lyric背景之间切换的touch事件
    startCD(e){//标识start进来了
      this.touch.isStart = true;
       this.touch.isMove = false;
      let touch = e.touches[0]; //记录起始X Y 轴坐标
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    moveCD(e){
      if(!this.touch.isStart){
        return
      }      
      if(!this.touch.isMove){
        this.touch.isMove = true;
      }
      //记录滑动距离 X Y 
      let distanceX = e.touches[0].pageX - this.touch.startX;
      let distanceY = e.touches[0].pageY - this.touch.startY;
      if(Math.abs(distanceX) < Math.abs(distanceY)){return;}//纵轴滑动距离大于横轴就不滑动
      //歌词背景是在CD背景的最右边滑动的最大距离是整个屏幕的宽度 -window.clientWidth~0
      let left = this.currentShow == "CD"?0:-window.innerWidth;
      //计算宽度
      let offsetWidth = Math.min(0,Math.max(-window.innerWidth, left+distanceX))
      //设置transform
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
      this.$refs.middleL.style.opacity = 1-this.touch.percent
    },
    endCD(e){
      if(!this.touch.isMove){
       return;
     }
      //两种情况 左滑/右滑
      let offsetWidth;
      let opacity;
      if(this.currentShow == 'CD'){
        if(this.touch.percent > 0.2){
          offsetWidth = -window.innerWidth;
          this.currentShow = 'lyric';
           opacity = 0.3;
        }else{//滑动距离不超过20%
          offsetWidth = 0;
          opacity=1;
        }
      }else{//右滑
        if(this.percent < 0.8){
          offsetWidth = 0;
          this.currentShow = "CD";
          opacity=1
        }else{
          offsetWidth = -window.innerWidth;
          opacity = 0.3;
        }
      }
      //设置宽度 滑动位移
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      //设置过渡
       this.$refs.lyricList.$el.style.transition = `all 0.3s`;
       //设置透明度
       this.$refs.middleL.style.opacity = opacity;
       this.touch.isStart = false
    },
    //获取vkey
    _getVkey(){
      //封装 promise 异步方法
      return new Promise((resolve,reject)=>{
        getVkey(this.currentSong.mid).then(res=>{ //异步-慢.play要url准备好才能调用
          // console.log(res.data.items[0].vkey)//取出vkey,拼接到url
          this.urlkey = `http://dl.stream.qqmusic.qq.com/C400${this.currentSong.mid}.m4a?guid=9933550749&&uin=0&fromtag=38&vkey=${res.data.items[0].vkey}`
          if(res.data.items.length){
            resolve(this.urlkey)
          }

          //执行mutation 的提交.给currentSong添加url
          // console.log('4aaa')
          // this.setUrl(this.urlKey)
          // console.log('5bbb')
        })
      })
      
    }

  },
    //观察监听当前播放歌曲的变化
  watch:{ //不适合写大量的逻辑和业务处理 
    currentSong(newSong,oldSong){
      //调用audio标签的play
      if(newSong.id == oldSong.id){//新的歌和旧的如果一样,说明当前歌曲没变,此方法就不执行,不监听
        return;
      }
      //判断歌曲换了之后歌词要停
      if(this.currentLyric){
        this.currentLyric.stop();//currentSong发生变化的时候,如果有歌词,要从头开始
      }
      this._getVkey().then((res)=>{
        //执行mutations的提交,给currentSong添加url
        this.setUrl(this.urlkey)
         this.$nextTick(() => { //将回调延迟到下次DOM更新循环之后执行,修改之后立即使用
        setTimeout(()=>{
          this.$refs.audio.play();  //用audio 中的play方法来播放
        },500)
        //  console.log('3eeeeeee')
        //测试lyric
        // this.currentSong._getLyric()
          this.getLyricParser();
        })
      });
    },
    playing(bool){
      const audio = this.$refs.audio;
      this.$nextTick(()=>{
        bool?audio.play():audio.pause();//toggltplay控制
      })
    }
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          margin: 0 6px
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>