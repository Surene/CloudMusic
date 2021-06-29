// pages/playlist/playlist.js
var app =  getApp();

import {getPlayListDetail} from '../../network/playlist'
import {getMusicDetail} from '../../network/myFM'
import {debounce} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前歌单全部信息
    playlist:{},
    // 所有歌曲ID
    trackIds:[],
    // 当前用于展示的歌曲
    musics:[],
    // 全部歌曲
    moreMusics:[],
    // 第几次下拉
    index:0,
    // 当前歌单背景
    playlistCover:'',
    currentPlay:{},
    ar:[],
    isPlay:false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id = options.id
    await this._getPlayListDetail(id)
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
  _getPlayListDetail(id){
    getPlayListDetail(id).then(res => {
      // console.log(res.playlist)
      let playlist = res.playlist
      let musics = playlist.tracks
      let playlistCover = playlist.coverImgUrl
      let trackIds = []
      let count = parseInt(res.playlist.trackIds.length / 100)
      if (count == 0 || count == 1) {
        trackIds = res.playlist.trackIds
        trackIds 
        this.setData({
          playlist,
          trackIds,
          musics,
          playlistCover
        })
      }else{
        for (let index = 0; index < res.playlist.trackIds.length; index++) {
          const element = res.playlist.trackIds[index];
          trackIds = trackIds.concat(element)
          this.setData({
            playlist,
            trackIds,
            musics,
            playlistCover
          })
        }
      }
      this._getMusicDetail(trackIds)
      app.globalData.playlist = musics
    })
  },
  _getMusicDetail(trackIds){
    let moreMusics = []
    // 高频触发 进行防抖处理
    debounce(trackIds.forEach(element => {
      getMusicDetail(element.id).then(res => {
        moreMusics.push(res.songs[0])
      })
    }),200)
    
    this.setData({
      moreMusics
    })
  
  },
  onReachBottom: function(){
    let length = this.data.moreMusics.length / 20
    let index = this.data.index
    let musics = this.data.musics
    if (index <= length + 1) {
      index = index + 1
      let temp = this.data.moreMusics.slice(index * 20,(index * 20+20))  
      musics = musics.concat(temp)
      this.setData({
        index,
        musics
      })
      app.globalData.playlist = musics
    }
    
  }

  
})