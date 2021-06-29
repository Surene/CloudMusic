// index.js
// 获取应用实例

import {getBanner,getRecommand,getRecommandMv} from '../../network/index'

//Page Object
Page({
  data: {
    // 轮播图数据
    banners:[],
    // 轮播图图标颜色
    indicatorColor:"rgba(221, 215, 215,.3)",
    // 主菜单信息
    main:[{
      image:'../../assets/image/index/recomm.png',
      info:'每日推荐',
      url:'../daliyRec/daliyRec'
    },
    {
      image:'../../assets/image/index/myFM.png',
      info:'私人FM',
      url:'../myFm/myFm'
    },
    {
      image:'../../assets/image/index/playlist.png',
      info:'歌单',
      url:'../playlistTab/playlistTab'
    },
    {
      image:'../../assets/image/index/rank.png',
      info:'排行榜',
      url:'../rank/rank'
    }  ],
    // 推荐数据
    recommend:[],
    // 最新MV
    newMV:[],

    currentPlay:{},
    ar:[],
    isPlay:false,
    id:0

  },
  //options(Object)
  // 网络请求
  onLoad: function(options){
    this._getBanner()
    this._getRecommand()
    this._getRecommandMv()
  },
  onShow: function(){
    let currentPlay = getApp().globalData.currentPlay
    let ar = []
    let id = getApp().globalData.currentPlay.id
    let isPlay = getApp().globalData.isPlay
    for (const key in currentPlay.ar) {
      ar.push(currentPlay.ar[key])
    }
    this.setData({
      currentPlay,
      ar,
      isPlay,
      id
    })
  },
  _getBanner(){
    getBanner().then(res => {
      let banners = res.banners
      this.setData({
        banners
      })
    })
  },
  _getRecommand(){
    getRecommand().then(res => {
      // console.log(res)
      // 每次随机展示六个推荐歌单
      let recommend = res.recommend
      const getRandomArray = (arr, count = 6) => {
        let shuffled = arr.slice(0),
            i = arr.length, 
            min = i - count, 
            temp, 
            index;
        while (i-- > min) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
        }
        return shuffled.slice(min);
      }
      recommend = getRandomArray(recommend)
      // console.log(recommend);
      this.setData({
        recommend
      })
    })
  },
  _getRecommandMv(){
    getRecommandMv().then(res => {
      // console.log(res);
      let newMV = res.data
      const getRandomArray = (arr, count = 6) => {
        let shuffled = arr.slice(0),
            i = arr.length, 
            min = i - count, 
            temp, 
            index;
        while (i-- > min) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
        }
        return shuffled.slice(min);
      }
      newMV = getRandomArray(newMV)
      // console.log(newMV);
      this.setData({
        newMV
      })
    })
  }
  

});
