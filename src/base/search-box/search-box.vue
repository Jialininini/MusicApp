<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box" :placeholder="text" v-model='query'/>
    <i class="icon-dismiss" v-show='query' @click="clearQuery"></i>
  </div>
</template>

<script >
export default {
  data(){
    return {
      text:'请输入歌手或歌曲',
      query:''
    }
  },
  methods:{
    clearQuery(){//清除关键词
      this.query=''
    },
    setQuery(query){
      this.query = query
    }
  },
  created(){
    //调用实例上的$watch()
    this.$watch('query',(newQuery)=>{//监听query的变化,派发一个事件告诉父组件query发送变化
     this.$emit('queryChange',newQuery)

    })
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-background;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: none;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>