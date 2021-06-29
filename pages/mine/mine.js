// pages/mine/mine.js
let app =  getApp()
import {getUserDetail,getPlaylist} from '../../network/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 登陆状态
      isLogin:false,
      // 头像
      avatar:"",
      // 昵称
      nickname:"",
      // 用户等级
      level:0,
      // 歌单
      playlist:[],
      // 喜欢的音乐
      love_music:[],
      love_music_count:0,
      love_music_cover:"",
      // 创建的歌单
      create_list:[],
      create_list_count:0,
      // 收藏的歌单
      collect_list:[],
      collect_list_count:0,

      titles:['创建歌单','收藏歌单'],
      currentPlay:{},
    ar:[],
    isPlay:false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.isLogin) {
      let that = this
      let uid = wx.getStorageSync("uid");
      that._getPlaylist(uid) 
    }
  },
  onShow: function() {
    if (app.globalData.isLogin) {
      let that = this
      let uid = wx.getStorageSync("uid");
      that._getPlaylist(uid) 
    }
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
  lgout(){
    wx.showModal({
      title: '提示',
      content: '确定退出当前账号吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#C20C0C',
      confirmText: '确定',
      confirmColor: '#C20C0C',
      success: (result) => {
        if (result.confirm) {
          // 取消登陆状态
          this.setData({
            isLogin:false,
            // 头像
            avatar:"",
            // 昵称
            nickname:"",
            // 用户等级
            level:0,
            // 歌单
            playlist:[],
            // 喜欢的音乐
            love_music:[],
            love_music_count:0,
            love_music_cover:"",
            // 创建的歌单
            create_list:[],
            create_list_count:0,
            // 收藏的歌单
            collect_list:[],
            collect_list_count:0,
          })
          // 清除用户数据
          app.globalData.isLogin = false
          app.globalData.user = {}
          app.globalData.userDetail = {}
          app.globalData.playlist = []

        }
      }
    });
      
    
  },
  _getPlaylist(uid){
    getPlaylist(uid).then(res => {
      app.globalData.playlist = res.playlist
      let playlist = app.globalData.playlist
      // console.log(playlist);
      this.setData({
        playlist
      })
      
      
      // 我喜欢的音乐
      // bug --在数据还没请求完成之前就调用了 
      const love_music = playlist.shift()
      let love_music_count = love_music?love_music.trackCount:0
      let love_music_cover = love_music?love_music.coverImgUrl:0
      // 找到我创建的音乐
      const create_list = playlist.filter(function(value){
        return value.userId == uid
      })
      let create_list_count = create_list.length
      // 找到我收藏的音乐
      const collect_list = playlist.filter(function(value){
        return value.userId != uid
      })

      let collect_list_count = collect_list.length
      let user = wx.getStorageSync("user")

      this.setData({
        // 改变登陆状态
        isLogin:app.globalData.isLogin,
        // 保存头像
        avatar:user.profile.avatarUrl,
        // 保存昵称
        nickname:user.profile.nickname,
        // 保存等级
        // level:app.globalData.userDetail.level,
        // 喜欢的音乐
        love_music,
        love_music_count,
        love_music_cover,
        create_list,
        collect_list,
        create_list_count,
        collect_list_count
      })
      // wx.setStorageSync("playlist", app.globalData.playlist);
    })
    // let playlist = wx.getStorageSync("playlist")

  },
  _getUserDetail(uid){
    getUserDetail(uid).then(res => {
      console.log(res);
      app.globalData.userDetail = res})
  },
  navtoRecent(){
    wx.navigateTo({
      url: '../recentplay/recentplay',

    });
      
  }
})