<template>
  <div class='singer-detail'>
    <music-list :songs='songList' :title='getSinger.Fname' :bgImg='getSinger.Profile'></music-list>
  </div>
</template>

<script>
import {getSingerDetails} from '../../../api/singer.js'
import {ERR_OK} from '../../../api/config.js';
import {mapGetters} from 'vuex'
import {createSong} from '../../../common/js/songs.js'
import musicList from '../../music-list/music-list.vue'
  export default {
    data(){
      return {
        songList:[]
      }
    },
    components:{
      musicList
    },
    computed:{
      ...mapGetters(['getSinger'])
    },
    methods:{
      _getDetails(){
        //判断有没有Fid,没有就返回上一级
        if(!this.getSinger.Fid){
          this.$router.push('/singer');
          return ;
        }
        getSingerDetails(this.getSinger.Fid).then((res)=>{
          if(res.code == ERR_OK){
            // console.log(res.data.list)
            this.songList = this.setSongs(res.data.list);
            // console.log(111)
            // console.log(this.songList)
          }
        })
      },
      setSongs(list){ //接收完全没处理的数据 list,遍历,拿到每个对象item,解构到musicData中,调用createSong,取出需要的8个数据. 
        let ret = [];
        list.forEach((item)=>{
          //解构赋值
          let { musicData } = item;
          // console.log(musicData)
         ret.push(createSong(musicData))
        })
        // console.log(222)
        // console.log(ret)
        return ret;
      }
    },
    created(){
      // console.log(this.getSinger);
      this._getDetails()
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
</style>