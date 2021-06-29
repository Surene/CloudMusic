// pages/login/login.js
import {baseurl} from '../../utils/network'

let app =  getApp()

// 由于缓存机制、两分钟只能登陆一次
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 电话号码
    phone:"",
    // 登陆密码
    password:"",
    // 从哪种类型页面跳转到登陆页，同时跳回该页面 1为navgitorback , 2为redirect ,3为switchTab
    linktype:1,
    // 跳转前的url
    url:"",
    // 用户头像
    avatar:"",
    // 用户昵称
    nickname:"",
    // 登陆返回的信息
    loginMessage:"",
    // 登陆状态码
    code:0,
    // 用户id
    uid:0,
    // 用户等级
    level:0,
    // 歌单 包括我喜欢的音乐 我创建的音乐 我收藏的音乐
    playlist:[]
    
  },
  onLoad(options){
    // 设置跳转类型和地址
    // console.log(options);
    this.setData({
      // 地址默认为我的
      linktype: options.t || 3,
      url:options.url || "../mine/mine"
    })
  },
  // 获取用户输入 
  // ** 输入账号密码是否考虑防抖？个人感觉不需要 密码验证还是要严格一点 不能因小失大
  textinput(e){
    // console.log(e)
    let type = e.currentTarget.dataset.type
    if (type ==1 ) {
      // 获取账号
      this.setData({
        phone:e.detail.value
      })
    }else{
      // 获取密码
      this.setData({
        password:e.detail.value
      })
    }
  },
  // 验证登陆
  login(){
    // 正则验证手机号
    let url = /^1[3456789]\d{9}$/.test(this.data.phone) ? "login/cellphone" : 0
    if (url == 0) {
      wx.showModal({
        title: '提示',
        content: '手机格式不正确',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#C20C0C',
      });
      return
    }
    // 验证是否输入密码
    let hasPassword = this.data.password ? this.data.password :""
    if (!hasPassword) {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#C20C0C',
      });
      return
    }
    // 开始登陆动画
    wx.showToast({
      title: '登陆中',
      icon: 'loading',
      // duration: 1500
    });
    // 发起登陆请求
    wx.request({
      url: baseurl + url,
      // /login/cellphone?phone=xxx&password=yyy
      data: {
        phone:this.data.phone,
        password:this.data.password,
        timestamp:Date.parse(new Date())
      },
      complete: (res)=>{
        // console.log(res);
        // 登陆完成结束动画
        wx.hideToast();
        // 获取登陆状态码
        let code = res.data.code
        // 登陆验证 可能返回不同的错误类型 502密码错误 509带宽限制
        if (code == 502) {
          wx.showToast({
            title: '密码错误',
            icon: 'error',
            duration: 1500,
          });
        }else if (code == 509) {
          wx.showToast({
            title: '繁忙请稍后再试',
            icon: 'error',
            duration: 1500,
          });
        }else if(code != 200){
          wx.showToast({
            title: '登陆失败',
            icon: 'error',
            duration: 1500,
          });
        }else{
          // 登陆成功
          app.globalData.isLogin = true
          // 保存个人信息
          app.globalData.user = res.data
          wx.setStorageSync('user',res.data)
          
          this.setData({
            uid:res.data.profile.userId
          })
          
          wx.setStorageSync("uid", this.data.uid);
          
          // 请求更多用户数据 有时间差问题
          // this._getPlaylist(this.data.uid);
          // this._getUserDetail(this.data.uid)
          // console.log(app.globalData.playlist)

          // 跳转页面
          if (this.data.linktype == 1) {
            wx.navigateBack({
              delta: 1
            });  
          }else if(this.data.linktype == 2){
            wx.redirectTo({
              url: this.data.url,
            });
          }else{
            wx.switchTab({
              url: '../mine/mine',
            });
          }
        }
        
        
      }
    });
  },
  navTo(){
    wx.switchTab({
      url: '../../pages/index/index'
    });
      
  }
})