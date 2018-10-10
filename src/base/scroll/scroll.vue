<template>

<div ref='wrapper'>
    <slot></slot>
</div>

</template>

<script>
import BScroll from 'better-scroll'
export default{
    props:{
        probeType:{ //滚动监听事件
            type:Number,
            default:1
        },
        click:{
            type:Boolean,
            default:true
        },
        data:{
            type:Array,
            default:null
        }

    },
    methods:{
        _initScroll(){
            //判断组件是否加载
            if(!this.$refs.wrapper){
                return
            }   
            //实例化一个scroll对象
            this.scroll = new BScroll(this.$refs.wrapper,{
                probeType: this.probeType,
                click:this.click
            })        
        },
        enable(){
            //启动better-Scroll
            this.scroll && this.scroll.enable()
        },
        disable(){
            //禁用better-scroll
            this.scroll && this.scroll.disable()
        },
        refresh(){
            this.scroll && this.scroll.refresh();
        },
        scrollElement(ele){
            //滚动到某个DOM元素
            this.scroll && this.scroll.scrollToElement(ele)
        },
        scrollTo(x,y,ms){
            this.scroll && this.scroll.scrollTo(x,y,ms)
        }
    },
    watch:{
        data(){ //data中内容发生改变时
            setTimeout(()=>{
                this.refresh()
            },20)
        }
    },
    mounted(){ //确保DOM元素被加载完成
        setTimeout(()=>{
            this._initScroll()
        },20)
    }
    
}
</script>

<style scoped>

</style>