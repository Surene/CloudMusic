// components/tab_control/tab_control.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles:{
      type:Array,
      default:[]
    },
    getIndex:{
      type:Number,
      value:0
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 当前下标
    currentIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemClick(e){
      // console.log(e)
      // 
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
      // 自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项
      // 事件选项：
      // 1.bubbles	Boolean	否	false	事件是否冒泡
      // 2.composed	Boolean	否	false	事件是否可以穿越组件边界，为false时，
      // 事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
      // 3.capturePhase	Boolean	否	false	事件是否拥有捕获阶段

      // 在暂时不需要发出和接收
      const data = {index:this.data.currentIndex}
      this.triggerEvent('tabClick',data,{})
    },
  },
  observers: {
    'getIndex':function(){
      // console.log(this.properties.getIndex);
      this.setData({
        currentIndex:this.properties.getIndex
      })
    }
  }
})
