<template>
  <transition name="slide">
    <music-list :title='getTitle' :bgImg='getBgImg' :songs='songs'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from '../music-list/music-list'
import { getHotSongs } from '../../api/recommend.js'
import { mapGetters } from 'vuex';
import {createSong} from '../../common/js/songs.js'
 export default {
    data(){
      return {
        songs:[]
      }
    },
    components:{
      musicList
    },
    created() {
      this._getHotSongs()
    },
    computed:{
      ...mapGetters(['getDiscItem']),
      getTitle(){
        return this.getDiscItem.dissname
      },
      getBgImg(){
        return this.getDiscItem.imgurl;
      }
    },
    methods:{
      _getHotSongs(){
        if(!this.getDiscItem.dissid){
          this.$router.push({
            path:'/recommend'
            })
          return;
        }
        console.log(this.getDiscItem)
        getHotSongs(this.getDiscItem.dissid).then((res)=>{
          // console.log('22222',res)
          // if(res.code == 0){
            // console.log('11111111111111111111111111111111111',res)//卡住啦啊啊啊啊啊啊
            this.songs=this.setSongList(res.cdlist[0].songlist)
          // }
        })
      },
      setSongList(list){
        let ret = [];
        list.forEach(item=>{
          if(item.songid&&item.albummid){
            ret.push(createSong(item))
          }
        })
        return ret
      }
    },
    

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>