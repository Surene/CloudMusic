// pages/myFm/myFm.js
import {getMyFm,getMusicDetail,getMusicLyrics,getMusicUrl,checkMusic,addToLikelist} from '../../network/myFM'
import {parseLrc,formatNumber,artistsName} from '../../utils/util'
let innerAudioContext = getApp().globalData.backAudioManager
let app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 展示封面还是歌词
    showCover:true,
    showLyrics:false,
    // 是否正在播放
    isPlay:false,
    // 喜欢当前音乐
    isLike:false,
    // fm歌单 每次请求两到三首
    musics:[],
    // 当前音乐
    currentMusic:{},
    // 当前音乐详情
    // currentMusicDetail:{},
    // 当前音乐歌词
    currentMusicLyrics:'',
    // 每次请求三个音乐 currentIndex 的作用就是 到了3再请求一次
    currentIndex:0,
    // 当前音乐url:
    currentMusicUrl:'',
    // 当前播放时间
    currentPlayTime:'00:00',
    // 总播放时间
    currentMusicDuration:'00:00',
    // 步长1s
    slideStep:0,
    // 当前值
    slideValue:0,
    // 音量 最大15 默认为10
    soundLevel:10,
    // 发生滚动
    isScroll:false,
    // 当前滚动歌词
    cureentLyrics:'',
    // 当前滚动歌词时间段
    currentLrcsec:'',
    artists:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // 暂停背景音乐
    getApp().globalData.backAudioManager.pause()
    getApp().globalData.playType = 2
    this._getMyFm()
  },
  onShow: function(){
    this._onPlay()
  },
  onHide: function(){
    
  },
  onUnload: function(){
    innerAudioContext.pause()
    getApp().globalData.isPlay = false 
  },
  lyricsScroll(){
    let isScroll = true
    this.setData(
      {
        isScroll
      }
    )
  },

  async _getMyFm(){
    let musics = []
    let currentMusic = {}
    let id = 0
    await getMyFm().then(res => {
      musics = res.data
      // console.log(musics);
      // for (const music of fmmusics) {
      //   musics.push(that._getMusicDetail(music.id))
      // }
      currentMusic = musics[this.data.currentIndex]

      id = currentMusic.id
      let artists = []
      for (const key in currentMusic.currentMusic) {
        artists.push(currentMusic.currentMusic[key])
      }
      // 设置 全局音乐 
      getApp().globalData.currentPlay = currentMusic

      let currentMusicDuration = new Date(currentMusic.duration)
      let slideStep = parseInt(formatNumber(currentMusicDuration.getMinutes()) * 60)  + parseInt( formatNumber(currentMusicDuration.getSeconds()))
      currentMusicDuration = formatNumber(currentMusicDuration.getMinutes()) + ":" + formatNumber(currentMusicDuration.getSeconds())
      // console.log(slideStep);
      currentMusicDuration = currentMusicDuration.toString()
      this.setData({
        musics,
        currentMusic,
        currentMusicDuration,
        slideStep,
        artists
      })
      // 获取当前音乐详情和歌词
      // this._getMusicDetail(currentMusic.id)

    })
    await this._getMusicLyrics(currentMusic.id)
    await this._getMusicUrl(currentMusic.id)
  },
  _getMusicDetail(ids){
    getMusicDetail(ids).then(res => {
      console.log(res);
    })
  },
  _getMusicLyrics(id){
    getMusicLyrics(id).then(res => {
      let currentMusicLyrics = ''
      if (res.lrc && res.lrc.lyric) {
        currentMusicLyrics =  res.lrc.lyric 
      }
      currentMusicLyrics = parseLrc(currentMusicLyrics).now_lrc
      // console.log(currentMusicLyrics);
      let cureentLyrics = currentMusicLyrics[0].lrc
      let currentLrcsec =  new Date(currentMusicLyrics[0].lrc_sec * 1000)
      currentLrcsec = formatNumber(currentLrcsec.getMinutes()) + ":" + formatNumber(currentLrcsec.getSeconds())
      this.setData({
        currentMusicLyrics,
        cureentLyrics,
        currentLrcsec
      })
    })
  },
  _getMusicUrl(id){
    let currentMusic = this.data.currentMusic
    if (checkMusic(id)) {
      getMusicUrl(id).then(res => {
        let currentMusicUrl = res.data[0].url
        innerAudioContext.src  = currentMusicUrl
        // innerAudioContext.autoPlay = true
        innerAudioContext.title = currentMusic.name
        innerAudioContext.epname = currentMusic.album.name
        innerAudioContext.coverImgUrl = currentMusic.album.picUrl
        innerAudioContext.startTime = 0  
        innerAudioContext.singer = artistsName(currentMusic.artists)
        // 开始播放 
        // setTimeout(() => {
        //   innerAudioContext.play()  
        // }, 1000)
        getApp().globalData.isPlay = true 

        let listenHistory = wx.getStorageSync("listenHistory");
        
        let currentplay = currentMusic
        // 判断搜索词是否在搜索历史中 在就先删除原来的
        if (currentplay != false) {
          // 找到并删除
          listenHistory.forEach(element => {
            if (element.id == currentplay.id) {
              listenHistory = listenHistory.filter(word => word.id != currentplay.id)
            }
          })
          // 头插法添加
          listenHistory.unshift(currentplay)
          wx.setStorageSync("listenHistory", listenHistory)
        }

        // 第一次监听
        let currentPlayTime = 0
        let slideValue = 0
        currentPlayTime = innerAudioContext.currentTime
        currentPlayTime = new Date(currentPlayTime *1000)
        slideValue = parseInt(formatNumber(currentPlayTime.getMinutes()) * 60)  + parseInt( formatNumber(currentPlayTime.getSeconds()))
        currentPlayTime = formatNumber(currentPlayTime.getMinutes()) + ":" + formatNumber(currentPlayTime.getSeconds())
        
        let isPlay = true
        this.setData({
          currentMusicUrl,
          isPlay,
          currentPlayTime,
          slideValue
        })
      })
    }else{
      this.setData({
        currentMusicUrl:''
      })
    }
  },
  _onPlay(){
    let that = this 
    let currentPlayTime = 0
    let slideValue = 0 
    let duration = 0

    innerAudioContext.onTimeUpdate(() => {
      setTimeout(() => {
        currentPlayTime = innerAudioContext.currentTime
        currentPlayTime = new Date(currentPlayTime * 1000)
        slideValue = parseInt(formatNumber(currentPlayTime.getMinutes()) * 60)  + parseInt( formatNumber(currentPlayTime.getSeconds()))
        currentPlayTime = formatNumber(currentPlayTime.getMinutes()) + ":" + formatNumber(currentPlayTime.getSeconds())
        if (currentPlayTime == that.data.currentMusicDuration) {
          that.nextPlay()
        }
        that.setData({
          currentPlayTime,
          slideValue
        })
        app.globalData.currentPosition = slideValue
        duration = 1000
        if (slideValue <= this.data.slideStep) {
          setTimeout(this._onPlay,duration)
        }  
      }, duration)
    })
    // 有延迟
    innerAudioContext.onEnded(() => {
      
    })
  },
  _onFMPlay(){
    let that = this 
    let currentPlayTime = 0
    let slideValue = 0 
    let duration = 0

    setTimeout(() => {
      currentPlayTime = innerAudioContext.currentTime

      currentPlayTime = new Date(currentPlayTime * 1000)
      slideValue = parseInt(formatNumber(currentPlayTime.getMinutes()) * 60)  + parseInt( formatNumber(currentPlayTime.getSeconds()))
      currentPlayTime = formatNumber(currentPlayTime.getMinutes()) + ":" + formatNumber(currentPlayTime.getSeconds())
      if (currentPlayTime == that.data.currentMusicDuration) {
        that.nextFm()
      }
      that.setData({
        currentPlayTime,
        slideValue
      })
      duration = 1000
      if (slideValue <=this.data.slideStep) {
        setTimeout(this._onPlay,duration)
      }  
    }, duration)
    // 有延迟
    innerAudioContext.onEnded(() => {
      that.nextFm()
    })
  },
  switchLyricsAndCover(){
    let showCover = !this.data.showCover
    let showLyrics = !this.data.showLyrics
    this.setData({
      showCover,
      showLyrics
    })
  },
  nextFm(){
    let currentIndex = this.data.currentIndex
    let currentMusic = {}
    let musics = this.data.musics
    let maxIndex = musics.length
    let isLike = false
    currentIndex = currentIndex + 1
    if (currentIndex <= maxIndex-1) {
      currentMusic = musics[currentIndex]
      let currentMusicDuration = new Date(currentMusic.duration)
      currentMusicDuration = formatNumber(currentMusicDuration.getMinutes()) + ":" + formatNumber(currentMusicDuration.getSeconds())
      this.setData({
        currentIndex,
        currentMusic,
        currentMusicDuration,
        isLike
      })
      this._getMusicLyrics(currentMusic.id)
      this._getMusicUrl(currentMusic.id)
    }else{
      this.setData({
        currentIndex:0
      })
      this._getMyFm()
    }
  },
  changePlay(){
    let isPlay = ! this.data.isPlay
    if (isPlay) {
      innerAudioContext.play()
      getApp().globalData.isPlay = true 
    }else{
      innerAudioContext.pause()
      getApp().globalData.isPlay = false 
    }
    this.setData({
      isPlay
    })
  },
  valueChange(e){
    innerAudioContext.seek(e.detail.value)
  },
  changeSound(e){
    innerAudioContext.volume = (1 / 15) * e.detail.value
    let soundLevel = e.detail.value
    this.setData({
      soundLevel
    })
  },
  likeMusic(e){
    if (getApp().globalData.isLogin) {
      let isLike = !this.data.siLike
      this.setData({
        isLike
      })
      let id = this.data.currentMusic.id
      console.log(isLike);
      addToLikelist(id,isLike).then(res => {
        console.log(res);
      }) 
    }else{
      wx.navigateTo({
        url: '../login/login?t=1',
      })
    }
  },
  backBefore(e){
    wx.navigateBack({
      delta: 1
    })
  },

})