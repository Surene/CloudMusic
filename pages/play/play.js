// pages/play/play.js
import {getMusicDetail,getMusicUrl,checkMusic,getMusicLyrics,addToLikelist} from '../../network/myFM'
import {parseLrc,formatNumber,artistsName} from '../../utils/util'
import {getLikelist} from '../../network/playlist'
let app = getApp()

var backAudioManager = app.globalData.backAudioManager

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    // 当前歌手 名字处理
    ar:[],
    // 当前音乐时长
    currentMusicDuration:'',
    // 展示封面还是歌词
    showCover:true,
    showLyrics:false,
    // 是否正在播放
    isPlay:true,
    // 喜欢当前音乐
    isLike:false,
    // 当前歌单 也是全局歌单
    musics:[],
    // 当前音乐
    song:{},
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
    // 緩冲時間
    buffered:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.playType = 1
    let musics = app.globalData.playlist
    this.setData({
      musics
    })
    let id = options.id
    // let id = 485508366
    this._getMusicDetail(id)
  },
  onShow: function (){
    // 进度条和读秒变化
    this._onPlay()
  },
  onHide: function(){
    this._onPlay()
  },
  // 通过id获取音乐信息
  async _getMusicDetail(id){
    await getMusicDetail(id).then(res => {
      // console.log(res.songs[0])
      let song = res.songs[0]
      let picUrl = res.songs[0].al.picUrl
      let currentMusicDuration = new Date(song.dt)
      let slideStep = parseInt(formatNumber(currentMusicDuration.getMinutes()) * 60)  + parseInt( formatNumber(currentMusicDuration.getSeconds()))
      currentMusicDuration = formatNumber(currentMusicDuration.getMinutes()) + ":" + formatNumber(currentMusicDuration.getSeconds())
      // console.log(slideStep);
      currentMusicDuration = currentMusicDuration.toString()
      // 设置全局播放信息
      app.globalData.currentPlay = song
      // 设置背景播放信息
      
      wx.setNavigationBarTitle({
        title:song.name
      })
      let ar = []
      for (const key in song.ar) {
        ar.push(song.ar[key])
      }
      this.setData({
        picUrl,
        song,
        ar,
        currentMusicDuration,
        slideStep
      })
    })
    await this._getMusicUrl(id)
    await this._getMusicLyrics(id)
    await this._getLikelist()
  },
  _getLikelist(){
    getLikelist().then(res => {
      let ids = res.ids
      let id = this.data.song.id
      let isLike = ids.includes(id)
      this.setData({
        isLike
      })
    })
  },
  // 获取歌词信息
  _getMusicLyrics(id){
    getMusicLyrics(id).then(res => {
      let currentMusicLyrics = ''
      if (res.lrc && res.lrc.lyric) {
        currentMusicLyrics =  res.lrc.lyric 
      }
      currentMusicLyrics = parseLrc(currentMusicLyrics).now_lrc
      if (currentMusicLyrics) {
        let cureentLyrics = currentMusicLyrics[0].lrc
        let currentLrcsec =  new Date(currentMusicLyrics[0].lrc_sec * 1000)
        currentLrcsec = formatNumber(currentLrcsec.getMinutes()) + ":" + formatNumber(currentLrcsec.getSeconds())
        this.setData({
          currentMusicLyrics,
          cureentLyrics,
          currentLrcsec
        })
      }
      
    })
  },
  // 获取因为播放url
  _getMusicUrl(id){
    let song = this.data.song
    getMusicUrl(id).then(res => {
      let url = res.data[0].url
      // 设置背景音乐的信息
      backAudioManager.src = url
      backAudioManager.title = song.name
      backAudioManager.epname = song.al.name
      backAudioManager.coverImgUrl = song.al.picUrl
      backAudioManager.startTime = 0  
      backAudioManager.singer = artistsName(song.ar)

      // 设置
      app.globalData.isPlay = true

      // 添加进入历史记录
      let listenHistory = getApp().globalData.listenHistory
      let currentplay = song
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
    })
  },
  // 监听改变当前值
  _onPlay(){
    let that = this 
    let currentPlayTime = 0
    let slideValue = 0 
    let duration = 0

    backAudioManager.onTimeUpdate(() => {
      setTimeout(() => {
        let buffered = backAudioManager.buffered
        currentPlayTime = backAudioManager.currentTime
        currentPlayTime = new Date(currentPlayTime * 1000)
        slideValue = parseInt(formatNumber(currentPlayTime.getMinutes()) * 60)  + parseInt( formatNumber(currentPlayTime.getSeconds()))
        currentPlayTime = formatNumber(currentPlayTime.getMinutes()) + ":" + formatNumber(currentPlayTime.getSeconds())
        if (currentPlayTime == that.data.currentMusicDuration) {
          that.nextPlay()
        }
        that.setData({
          currentPlayTime,
          slideValue,
          buffered
        })
        app.globalData.currentPosition = slideValue
        duration = 1000
        if (slideValue <= this.data.slideStep) {
          setTimeout(this._onPlay,duration)
        }  
      }, duration)
    })
    // 有延迟
    backAudioManager.onEnded(() => {
      
    })
  },
  // 下一首
  async nextPlay(){
    await app.nextPlay()
    let song = app.globalData.currentPlay
    await this._getMusicDetail(song.id)
  },
  // 上一首
  async lastPlay(){
    await app.lastPlay()
    let song = app.globalData.currentPlay
    await this._getMusicDetail(song.id)
  },
  // 返回按钮点击
  backBefore(e){
    wx.navigateBack({
      delta: 1
    })
  },
  // 歌词与封面切换
  switchLyricsAndCover(){
    let showCover = !this.data.showCover
    let showLyrics = !this.data.showLyrics
    this.setData({
      showCover,
      showLyrics
    })
  },
  // 改变播放状态
  changePlay(){
    let isPlay = ! this.data.isPlay
    if (isPlay) {
      backAudioManager.play()
    }else{
      backAudioManager.pause()
    }
    app.globalData.isPlay = isPlay
    this.setData({
      isPlay
    })
  },
  // 拖动播放条
  valueChange(e){
    backAudioManager.seek(e.detail.value)
  },
  // 背景音乐不能控制声音大小
  changeSound(e){
    innerAudioContext.volume = (1 / 15) * e.detail.value
    let soundLevel = e.detail.value
    this.setData({
      soundLevel
    })
  },
  likeMusic(e){
    if (getApp().globalData.isLogin) {
      let isLike = !this.data.isLike
      this.setData({
        isLike
      })
      let id = this.data.song.id
      addToLikelist(id,isLike).then(res => {
        console.log(res);
      }) 
    }else{
      wx.navigateTo({
        url: '../login/login?t=1',
      })
    }
  },
  lyricsScroll(){
    
  }

})
