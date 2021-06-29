// app.js
//app.js
//app.js

App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function() {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    this.globalData.backAudioManager = backgroundAudioManager
    if (!wx.getStorageSync("listenHistory")){
      let listenHistory = []
      wx.setStorageSync("listenHistory",listenHistory)
    }
    
    // 每次打开应用先获取本地数据
    let gb = wx.getStorageSync("globalData")
    // 如果本地数据存在 则赋值给globalData
    gb && (this.globalData = gb)
    // cookie是本地原有的属性
    let cookie = wx.getStorageSync("cookie")
    this.globalData.cookie = cookie
    // 防止调用一些方法时、箭头函数等 this指向丢失
    let that = this 
    /**
     *  例子
     *  var colours = ['red', 'green', 'blue'];
        document.getElementById('element').addEventListener('click', function() {
            // this is a reference to the element clicked on
        var that = this;
        colours.forEach(function() {
        // this is undefined
        // that is a reference to the element clicked on
        });
      });
     */
    
    // 如果没有登陆跳转到登录页
    if (!this.globalData.isLogin) {
      wx.navigateTo({
        url: './pages/login/login',
      })
    }

    
    
  },
  onShow: function(options) {
    
  },
  onHide: function() {
    this.globalData.isHide = true
    // 切后台保存数据到本地
    wx.setStorageSync("globalData", this.globalData);
  },
  onError: function(msg) {

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function(options) {

  },
  // 播放上一首
  lastPlay(){
    let playIndex = this.globalData.playIndex 
    let currentPlay = this.globalData.currentPlay
    let playlist = this.globalData.playlist
    let maxLength = playlist.length
    // 判断索引
    playIndex = playIndex - 1
    if (0 <= playIndex && playIndex < maxLength) {
      currentPlay = playlist[playIndex]
      this.globalData.playIndex = playIndex
      this.globalData.currentPlay = currentPlay
    }else if (playIndex < 0) {
      // 说明已经后退到第一首
      playIndex = maxLength - 1
      currentPlay = playlist[playIndex]
      this.globalData.playIndex = playIndex
      this.globalData.currentPlay = currentPlay
    }
  },
  // 播放下一首
  nextPlay(){
    let playIndex = this.globalData.playIndex 
    let currentPlay = this.globalData.currentPlay
    let playlist = this.globalData.playlist
    let maxLength = playlist.length
    // 判断索引
    playIndex = playIndex + 1
    if (playIndex <= maxLength -1) {
      currentPlay = playlist[playIndex]
      this.globalData.playIndex = playIndex
      this.globalData.currentPlay = currentPlay
    }else if (playIndex > maxLength) {
      // 说明已经播放到最后一首
      playIndex = 0
      currentPlay = playlist[playIndex]
      this.globalData.playIndex = playIndex
      this.globalData.currentPlay = currentPlay
    }
  },
  globalData: {
    // 登陆后的用户数据
    user:{},
    // 用户详情数据(待使用)
    userDetail:{},
    // 本地cookie
    cookie:"",
    // 判断是否登陆
    isLogin:false,
    // 当前页面是否切后台
    isHide:false,

    // 当前播放歌单
    playlist:[],
    // 当前音乐在歌单中的下标 
    playIndex:0,
    // 全局的是否播放
    isPlay:false,
    // 播放类型 1为音乐 2为FM
    playType:1,
    // 当前音乐
    currentPlay:{},
    // 播放模式 1为顺序 2为随机 3为循环
    playMode:1,
    // 音乐播放位置
    currentPosition:0,

    // 背景音频播放器
    backAudioManager:{},
    // 历史听歌
    listenHistory:[]

  }
});
  
/**
 * 组件间的基本通信方式有以下几种。

1.WXML 数据绑定：用于父组件向子组件的指定属性设置数据，仅能设置 JSON 兼容数据
（自基础库版本 2.0.9 开始，还可以在数据中包含函数）。具体在 组件模板和样式 章节中介绍。
2.事件：用于子组件向父组件传递数据，可以传递任意数据。
3.如果以上两种方式不足以满足需要，父组件还可以通过 this.selectComponent 方法获取子组件实例对象，
这样就可以直接访问组件的任意数据和方法
 */
