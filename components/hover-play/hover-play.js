Component({
  data: {
    config: {
      canvasSize: {
        width: 200,
        height: 200
      },
      percent: 100,
      barStyle: [{width: 5, fillStyle: '#cccccc'}, {width: 5, animate: true, fillStyle: [{position: 0, color: '#000000'}, {position: 1, color: '#c0e674'}]}],
      needDot: true,
      // dotStyle: [{r: 20, fillStyle: '#ffffff', shadow: 'rgba(0,0,0,.15)'}, {r: 10, fillStyle: '#56B37F'}]
    },
    percentage: 0,
    // 显示的时候肯定为true
    isPlay:true
  },
  properties: {
    cover:{
      type:String,
      value:''
    },
    name:{
      type:String,
      value:''
    },
    ar:{
      type:String,
      value:''
    },
    myid:{
      type:Number,
      value:0
    }
  },
  methods: {
    play(){
      let isPlay = !getApp().globalData.isPlay
      getApp().globalData.isPlay = isPlay
      if (isPlay) {
        getApp().globalData.backAudioManager.play()
      }else{
        getApp().globalData.backAudioManager.pause()
      }
      this.setData({
        isPlay
      })
    },
    navto(){
      if (getApp().globalData.playType == 1) {
        wx.navigateTo({
          url: '../../pages/play/play?id=' + this.data.myid,
        })
      }else if (getApp().globalData.playType == 2) {
        wx.navigateTo({
          url:'../../pages/myFm/myFm'
        })
      }
      
        
    }
  },
  observers:{
    percentage:function(){
      let percentage = getApp().globalData.currentPosition/getApp().globalData.backAudioManager.duration * 100
      console.log(percentage);
      this.setData({
        percentage
      })
    }
  }
})