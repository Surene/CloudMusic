// pages/daliyRec/daliyRec.js
import {getDailyRecommendationSongs} from '../../network/daliyRec'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 每日推荐歌单
    songlist:[],
    currentPlay:{},
    ar:[],
    isPlay:false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getDailyRecommendationSongs()
  },
  _getDailyRecommendationSongs(){
    getDailyRecommendationSongs().then(res => {
      // console.log(res);
      let songlist = res.data.dailySongs
      getApp().globalData.playlist = songlist
      this.setData({
        songlist
      })
    })
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
  }

})