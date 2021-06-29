Component({
  data: {
    // 歌曲数量
    amount:0,
  },
  properties: {
    // 歌单
    songlist:{
      type:Array,
      default:[]
    },
    isDaliy:{
      type:Boolean,
      value:false
    }
  },
  methods: {
    setCurrentPlay(e){
      getApp().globalData.currentPlay = e.currentTarget.dataset.currentplay
      // 添加进入历史记录
      // let listenHistory = wx.getStorageSync("listenHistory");
        
      // let currentplay = e.currentTarget.dataset.currentplay
      // // 判断搜索词是否在搜索历史中 在就先删除原来的
      // if (currentplay != false) {
      //   // 找到并删除
      //   listenHistory.forEach(element => {
      //     if (element.id == currentplay.id) {
      //       listenHistory = listenHistory.filter(word => word.id != currentplay.id)
      //     }
      //   })
      //   // 头插法添加
      //   listenHistory.unshift(currentplay) 
      //   wx.setStorageSync("listenHistory", listenHistory)
      // }
      wx.navigateTo({
        url: '../../pages/play/play?id='+e.currentTarget.dataset.currentplay.id,
      });
    }
  }
})