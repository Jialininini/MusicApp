<template>
  <scroll ref="suggest" class="suggest" :data='result'>
    <ul class="suggest-list">
      <li class="suggest-item" v-for='(item,index) in result' @click='selectItem(item,index)'>
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html='getDisplayName(item)'></p>
        </div>
      </li>
    </ul>
    <div class="no-result-wrapper" display='none'>
      <!-- <no-result title="抱歉，暂无搜索结果"></no-result> -->
    </div>
  <router-view></router-view>
  </scroll>
</template>
<script type="text/ecmascript-6">
import { getSearch } from '../../api/search.js';
import { filterSinger} from '../../common/js/songs.js'
import scroll from '../../base/scroll/scroll'
import { mapMutations, mapActions }  from 'vuex';
import { createSong } from '../../common/js/songs.js';
export default{
  data(){
    return {
      page: 1,
      result: [],
      songs: [] 
    }
  },
  components:{
    scroll
  },
  props:{
    query:{//搜索关键字,通过外部传进来
      type:String,
      default:''
      },
    },
  watch:{
    query(){
      this._search();
    }
  },
  methods:{
     ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['setPlaying']),
    _search(){
      //发起请求数据,获取数据 定义在api中 search.js中
      // console.log(11111111)
      getSearch(this.query,this.page).then(res=>{
        // console.log(res.data)
        this.result = this.setResult(res.data)
      })
    },
    //处理suggest请求数据
    setResult(data){
      let ret=[];
      //判断有没有zhida和zhida歌手id
      if(data.zhida && data.zhida.singerid){
        ret.push({...data.zhida,...{type:'singer'}})
      }
      if(data.song){
        //有song就直接拼接
        ret = ret.concat(data.song.list)
      }
      return ret;
    },
    getIconClass(item){//是否显示歌手样式
      if(item.type=='singer'){
        return 'icon-mine';
      }else{
        return 'icon-music';
      }
    },
    getDisplayName(item){
      //判断有没有
      // console.log('11111',item)
      if(item.type == 'singer'){
        return item.singername;
      }else{
        return `${item.songname} / ${filterSinger(item.singer)}`
      }
    },
   selectItem(item,index){
      if(item.type === 'singer'){
        this.setSinger({
          Fid:item.singermid,
          Fname:item.singername,
          Profile:`http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.jpg?max_age=2592000`
        });
        // 设置路由跳转
        this.$router.push({
          path: `/search/${item.singermid}`
        });
      }else{
        this.songs = this.setSongs(this.result);
        if(this.result[0].type == 'singer'){
          index = index - 1;
        }
        this.setPlaying({
          list: this.songs,
          index
        });
      }
    },
     setSongs(list){
      let ret = [];
      list.forEach((item)=>{
        if(item.type !== 'singer'){
          let  musicData  = item;  
          ret.push(createSong(musicData)); 
        }
      });
      return ret;
    },
  
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>