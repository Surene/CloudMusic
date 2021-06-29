// pages/playlistCategory/playlistCategory.js
import {getPlaylist} from '../../network/playlist'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlists:[],
    cat:'',
    offset:30,
    currentPlay:{},
    ar:[],
    isPlay:false,
    id:0,
    currentPlay:{},
    ar:[],
    isPlay:false,
    myid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cat = options.tab
    // if (options.tab) {
    //   cat = options.tab
    // }else{
    //   cat = '流行' //默认为流行
    // }
    this.setData({
      cat
    })
    
    this._getPlaylist(cat)

  },
  onShow: function(){
    let currentPlay = getApp().globalData.currentPlay
    let ar = []
    let myid = getApp().globalData.currentPlay.id
    let isPlay = getApp().globalData.isPlay
    for (const key in currentPlay.ar) {
      ar.push(currentPlay.ar[key])
    }
    this.setData({
      currentPlay,
      ar,
      isPlay,
      myid
    })
  },
  _getPlaylist(cat){
    getPlaylist(cat).then(res => {
      // console.log(res.playlists)
      let playlists = res.playlists
      this.setData({
        playlists
      })
    })
  },
  // 无痛刷新
  onReachBottom(){

    let offset = this.data.offset + 30
    let playlists = this.data.playlists
    getPlaylist(this.data.cat,offset).then(res => {
      // console.log(res.playlists);
      playlists = playlists.concat(res.playlists)
      this.setData({
        offset,
        playlists
      })
    })
    
  },

  
})