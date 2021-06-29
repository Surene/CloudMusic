// pages/search/search.js
import {search,search_suggest,hot_search} from '../../network/search'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 历史记录
    history:[],
    // 热搜榜
    hot_search:[],
    // 当前搜索词
    currentWord:'',
    // 是否正在搜索
    isSearching:false,
    // 搜索推荐列表
    search_suggest:[],
    // 展示搜索结果
    showResult:false,
    // 搜索结果
    search_result:[],
    // 歌曲数量
    limit:10,
    currentPlay:{},
    ar:[],
    isPlay:false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function () {
    // 不能在生命周期onLoad中拿到data中的数据,页面正在加载，加载速度也比网络请求快
    //  网络请求本身是异步的
    // 搜索榜网络请求
    let history = []
    if (wx.getStorageSync("searchHistory")) {
      history = wx.getStorageSync("searchHistory")
    }
    this.setData({
      history
    })
    this._hot_search()
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
  // 热搜网络请求
  _hot_search(){
    let that = this
    hot_search().then(res => {
      that.setData({
        hot_search:res.data
       })
    })
  },

  textInput(e){//e = event
    let that = this
    
    // 获取输入值
    let currentWord = e.detail.value
    // 保存输入词、
    that.setData({
      currentWord,
      isSearching:true,
      showResult:false
    })

    // 没有输入词时 取消搜索 取消搜索结果
    if (currentWord == false) {
      that.setData({
        currentWord,
        isSearching:false,
        showResult:false
      })

    }

    // 触发搜索建议
    search_suggest(currentWord).then(res => {
      let search_suggest = res.result.allMatch
      that.setData({
        search_suggest,
      })
    })

    // 不能在此处添加搜索历史 因为搜索没有完成
    // if (currentWord != false) {
    //   that.data.history.unshift(currentWord)
    //   console.log(that.data.history);
    // }
    
  },
  // 清空搜索词
  cancelClick(){
    this.setData({
      currentWord:'',
      isSearching:false,
      showResult:false
    })
  },
  // 开始搜索
  confirmSearch(e){
    // 添加历史
    let history = this.data.history
    let currentWord = e.currentTarget.dataset.currentword || this.data.currentWord
    // 判断搜索词是否在搜索历史中 在就先删除原来的
    if (currentWord != false) {
      // 找到并删除
      if (history.includes(currentWord)) {
        history = history.filter(word => word != currentWord)
      }
      // 头插法添加
      history.unshift(currentWord)
      wx.setStorageSync("searchHistory", history)
    }
    this.setData({
      history,
      isSearching:false,
      currentWord
    })
    // 清空搜索 跳转页面做法 app使用
    // this.cancelClick()
    // console.log(this.data.history)

    // 获取搜索结果
    search(currentWord).then(res => {
      // console.log(res.result.songs)
      let search_result = res.result.songs
      this.setData({
        showResult:true,
        search_result,
      })
    })

  },
  // 清空历史记录
  clearHistory(){
    this.setData({
      history:[]
    })
    wx.setStorageSync("searchHistory", [])
  },
  // 搜索结果上拉加载更多
  onReachBottom(){
    let limit = this.data.limit
    let currentWord = this.data.currentWord
    
    let length = 0
    if (!this.data.isSearching && this.data.showResult) {
      limit = limit + 10
      search(currentWord,limit).then(res => {
        length = res.result.songs.length+1
        if (length < limit) {
          wx.showToast({
            title: '歌曲已全部加载',
            icon: 'none',
            image: '../../assets/image/search/sad.png',
            duration: 500,
          })
        }else{
          console.log(res.result)
          let search_result = res.result.songs
          this.setData({
            showResult:true,
            search_result,
            limit
        })
        }
      }).catch(res => console.log(res))

    }
  }
})