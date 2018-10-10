<template>
 <div class='singer'>
   <list-view :singer-data='singerList' @select='selectChange'></list-view>
   <transition name='slide'>
    <router-view/>
   </transition>
 </div>
</template>


<script>
  import {getSingerList} from '../../api/singer.js'
  import {ERR_OK} from '../../api/config.js'
  import listView from '../listview/listview.vue'


  export default {
    components:{
      listView,
    },
    data(){
      return {
        singerList:[]
      }
    },
    created(){
      this._getSingerList()
    },
    methods:{
      _getSingerList(){
        getSingerList().then((res)=>{
          if(res.code == ERR_OK){
            // console.log(res.data.list)
            this.singerList = this.setSingerList(res.data.list) 
          }
        })
      },
      setSingerList(list){
        //创建一个对象,包含hot和字母对应的歌手
        let map = {
          hot:{
            title:'热门',
            items:[]
          }
        };
        //处理热门数据,遍历list数组,取前10个
        list.forEach((obj,index)=>{
          if(index<10){
            map.hot.items.push({
              Fid:obj.Fsinger_mid,
              Fname:obj.Fsinger_name,
              Profile:`http://y.gtimg.cn/music/photo_new/T001R150x150M000${obj.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          //设置检索字母对应的数据
          let key = obj.Findex;
          if(!map[key]){
            map[key] = {
              title:key,
              items:[]
            }
          }
          map[key].items.push({
            Fid:obj.Fsinger_mid,
            Fname:obj.Fsinger_name,
            Profile:`http://y.gtimg.cn/music/photo_new/T001R150x150M000${obj.Fsinger_mid}.jpg?max_age=2592000`
          })
        })
        // console.log(map)
       // 得到一个无序对象map,需要把它转化成有序数组
        let hot =[];//存放热门歌手
        let ret = [];//存放A~Z所有的
        for(var key in map){
          let val = map[key];
          if(val.title.match(/[A-Za-z]/)){
            ret.push(val);
          }else if(val.title == '热门'){
            hot.push(val)
          }
        }
        //处理ret数组,给其按照A-Z排序
        ret.sort((a,b)=>{
          //把字母字符转化为unicode号去排序
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        //两个数组拼接并返回
        return hot.concat(ret)
      },
      selectChange(item){
        console.log('111singer.vue-item',item);
        this.$router.push({
          path:`/singer/${item.Fid}`
        })
      }
    }
  }
</script>


<style scoped lang="stylus" >


  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
  .slide-enter,.slide-leave-to{
    transform : translate3d(100%,0,0);
  }
  .slide-enter-active,.slide-leave-active{
    transition : all 0.3s
  }
</style>
