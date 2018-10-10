/*
每首歌曲需要的信息:
    id:歌手id
    mid:拼接头像片段
    singer:歌手名字
    name:歌曲名称
    album:专辑名称
    duration:歌曲时长
    url:播放歌曲的源
*/
import { getLyric } from '../../api/lyric'
import { Base64 } from 'js-base64'
class Song{
    constructor({id,mid,singer,name,album,duration,image,url}){
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        // this.url = url;
        this.image = image;
    };
    //在Song类中扩展一个_getLyric方法
    _getLyric(){  
        //优化——getLyric方法，封装成promise对象,so可以调用then
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        //否则返回一个promise对象
        return new Promise((resolve,reject)=>{
           getLyric(this.mid).then((res=>{
            // console.log(res)
            // let reg =  /\{(.+?)\}/g;
            // console.log(res.match(reg)[0])
            // res= JSON.parse(res.match(reg)[0]) 先前台处理看看，然后后台处理
                if(res.code === 0){
                    this.lyric = Base64.decode(res.lyric);//base64格式的字符串，需解码
                    console.log(this.lyric)
                    resolve(this.lyric);
                }else{
                    reject('lyric is not defined')
                }
            })).catch((err)=>{
                console.log(err)
            }) 
        })
        
    }
}

//扩展一个工厂方法
const createSong = (musicData)=>{
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer:filterSinger(musicData.singer),
        name:musicData.songname,
        album:musicData.albumname,
        duration: musicData.interval,
        image:`http://y.gtimg.cn/music/photo_new/T002R150x150M000${musicData.albummid}.jpg`,
        // url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=5238239628&vkey=483A51D6792BE8D99D468B588DB101E8634CA979751CFAAF942C254AE6DB158BA44F98A9CED8B829C605E3BF9C99C9A966D26F71F915C5AC&uin=0&fromtag=38`
    })
}

//对singer进行处理(可能出现n个人合唱)
function filterSinger(singer){
    let ret =[];
    if(!singer){
        return '暂无歌手信息'
    };
    singer.forEach((item)=>{
        ret.push(item.name);
    })
    return ret.join(' / ')
}

export {
   createSong,
   filterSinger
}