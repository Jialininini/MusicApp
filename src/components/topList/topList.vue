<template>
  <transition name="slide">
    <music-list :title='getTitle' :bgImg='getBgImg' :songs='songs'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from '../music-list/music-list'
import { getMusicList } from '../../api/rank.js'
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
      this._getMusicList()
    },
    computed:{
      ...mapGetters(['getTopList']),
      getTitle(){
          return this.getTopList.topTitle
      },
      getBgImg(){
          return this.getTopList.picUrl;
      }
    },
    methods:{
     _getMusicList(){
         //发起一个请求
         if(!this.getTopList.id){
             this.$router.push('/rank')
         }
         getMusicList(this.getTopList.id).then((res)=>{
             if(res.code==0){
                 console.log(res)
                 this.songs = this.setTopList(res.songlist)
             }
         })
     },
     setTopList(list){
         let ret =[0];
         list.forEach(item=>{
             if(item.data.songid&&item.data.albummid){
                 ret.push(createSong(item.data))
             }
         })
         return ret;
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