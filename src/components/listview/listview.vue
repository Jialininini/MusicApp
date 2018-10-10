<template>


<scroll :data='singerData' class='listview' ref='listview'>
  <ul>
    <li v-for="group in singerData" class="list-group" ref='listGroup'>
      <h2 class='list-group-title'>{{group.title}}</h2>
      <ul>
        <li class='list-group-item' v-for='item in group.items' @click='selectItem(item)'>
          <img v-lazy="item.Profile" alt="" class='avatar'>
          <span class='name'>{{item.Fname}}</span>
        </li>
      </ul>
    </li>
  </ul>
  <div class="list-shortcut">
       <ul>
           <li class="item" v-for='(item,index) in titleList' @touchstart='selIndex' :data-index='index'>{{item}}</li>
       </ul>
  </div>
  <div class="loading-container">
     <loading v-show='!singerData.length'></loading>
  </div>
</scroll>
</template>
<script>
  //引入scroll组件
  import scroll from '../../base/scroll/scroll.vue'
  import { getAttr } from '../../common/js/dom.js';
  import loading from '../../base/loading/loading.vue'
  import {mapMutations} from 'vuex'
  export default {
    data(){
          return {
              
          }
      },
    methods:{
        selIndex(e){
            let index = getAttr(e.target,'index')
            // console.log(index)
            //调用子组件scroll组件的方法: 给scroll添加ref listview,得到组件内部的方法
            console.log(this.$refs.listview)//得到组件实例
            this.$refs.listview.scrollElement(this.$refs.listGroup[index])
        },
        selectItem(item){//向父组件派发事件
            this.$emit('select',item);
            //再此提交mutations   传给singerID
            this.setSinger(item)
        },
        ...mapMutations({
          //对mutations中方法的一种映射
          setSinger:'SET_SINGER'
        })
    },
    props:{
      singerData:{
        type:Array,
        default:[]
      }
    },
    components:{
        scroll,
        loading
    },   
    computed:{
        titleList(){
            return this.singerData.map((group)=>{
                return group.title.slice(0,1);
            })
        }
    }, 
    created(){
        // console.log(this.titleList)
    }
  }
  
</script>
<style scoped lang="stylus">
  @import "../../common/stylus/variable"




  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
