// pages/playlist/playlist.js
import {getPlaylistCategory} from '../../network/playlist'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 全部歌单分类
    categories:[
      {
        type:'',
        data:[]
      },
      {
        type:'',
        data:[]
      },
      {
        type:'',
        data:[]
      },
      {
        type:'',
        data:[]
      },
      {
        type:'',
        data:[]
      },
    ],
    defaultTab:['推荐','官方','视频歌单','精选','电子','轻音乐']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylistCategory()
  },
  _getPlaylistCategory(){
    getPlaylistCategory().then(res => {
      // console.log(res);
      let categories = this.data.categories
      let sub = res.sub
      categories.map((element,index) => {
        element.type = res.categories[index]
        element.data.push(sub.filter(x => x.category == index))
      })
      // console.log(categories);
      this.setData({
        categories
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
  },

})