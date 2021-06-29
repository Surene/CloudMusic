// pages/rank/rank.js
import {getToplist} from '../../network/rank'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toplist:[],
    official:[],
    Featured:[],
    Genre:[],
    global:[],
    Feature:[],
    titles:['官方','精选','曲风','全球','特色'],
    currentIndex:0,
    currentPlay:{},
    ar:[],
    isPlay:false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getToplist()
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
  _getToplist(){
    getToplist().then(res => {
      let toplist = res.list 
      let official = []
      let Featured = []
      let Genre = []
      let global =[]
      let Feature = []
      toplist.forEach(element => {
        // console.log(element.name);s
        if (element.name == '飙升榜' || element.name == '新歌榜' || element.name =='热歌榜' || element.name == '人气榜' ||element.name =='原创榜' ||element.name == '畅销榜') {
          official.push(element)
        }else if (element.name == '黑胶VIP爱听榜' ||element.name == '云音乐达人榜' ||element.name == '网络热歌榜') {
          Featured.push(element)
        }else if (element.name == '云音乐电音榜' || element.name =='云音乐ACG榜' || element.name =='云音乐说唱榜' ||element.name == '云音乐摇滚榜' ||element.name == '云音乐民谣榜' || element.name =='云音乐国电榜' || element.name =='云音乐古典榜' || element.name == '云音乐古风榜') {
          Genre.push(element)
        }else if(element.name == '美国Billboard榜' || element.name =='UK排行榜周榜' || element.name =='日本Oricon榜' || element.name =='法国 NRJ Vos Hits 周榜' || element.name =='云音乐欧美新歌榜' || element.name =='云音乐欧美热歌榜' || element.name =='云音乐日语榜' || element.name =='云音乐韩语榜' || element.name =='俄语榜' || element.name == '越南语榜'){
          global.push(element)
        }else{
          Feature.push(element)
        }
      })
      this.setData({
        toplist,
        official,
        Featured,
        Genre,
        global,
        Feature
      })
    })
  },
  tabClick(e){
    let currentIndex = e.detail.index
    if (currentIndex == 0) {
      wx.pageScrollTo({
        duration: 300,
        selector:'.official'
      })

    }else if (currentIndex == 1) {
      wx.pageScrollTo({
        duration: 300,
        selector:'.Featured'
      })
    }else if (currentIndex == 2) {
      wx.pageScrollTo({
        duration: 300,
        selector:'.Genre'
      })
    }else if (currentIndex == 3) {
      wx.pageScrollTo({
        duration: 300,
        selector:'.global'
      })
    }else if (currentIndex == 4) {
      wx.pageScrollTo({
        duration: 300,
        selector:'.Feature'
      })
    }
  },
  onPageScroll: function(e){
    let currentIndex = 0
    if (0 < e.scrollTop && e.scrollTop < 790) {
      currentIndex = 0
      this.setData({
        currentIndex
      })
    }else if (790 < e.scrollTop && e.scrollTop < 1031 ) {
      currentIndex = 1
      this.setData({
        currentIndex
      })
    }else if (1031 < e.scrollTop && e.scrollTop < 1616 ) {
      currentIndex = 2
      this.setData({
        currentIndex
      })
    }
    else if (1616 < e.scrollTop && e.scrollTop < 2372 ) {
      currentIndex =3
      this.setData({
        currentIndex
      })
    }
    else if (2372 < e.scrollTop ) {
      currentIndex = 4
      this.setData({
        currentIndex
      })
    }
    // 2148 1358 1117 532 223
    // 0 790 1031 1616 2372
  }
})