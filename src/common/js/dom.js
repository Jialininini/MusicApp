//获取 data-(index) 属性的方法
//val:要给data-最终设置的值;ele:dom元素;dataName: data-dataName
const getAttr = (ele,dataName,val)=>{
    let dataAttr = 'data-';
    dataName = dataAttr + dataName;
    if(val){
        return ele.setAttribute(dataName,val);
    }else{
        return ele.getAttribute(dataName)
    }
}
export {
    getAttr
}