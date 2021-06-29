import {baseurl,timeout} from "../utils/network"

// 网络请求封装
export default function request(options) {
    // wx.showLoading({
    //   title: '数据加载中ing',
    // })
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseurl + options.url,
        timeout: timeout,
        data: options.data,
        success: function(res) {
          resolve(res.data)
        },
        fail: function(res) {
          reject(res.data)
        },
        complete: res => {
          // resolve(res.data)
          // wx.hideLoading()
        }
      })
    })
  }
