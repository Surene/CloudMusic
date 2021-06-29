import request from './request'

export function getBanner(){
    return request({
        url:'banner'
    })
}

export function getRecommand(){
    let user = wx.getStorageSync("user")
    let cookie = user.cookie
    return request({
        url:'recommend/resource',
        data:{
            cookie
        }
    })
}

export function getRecommandMv(limit = 30){
    return request({
        url:'mv/exclusive/rcmd',
        data:{
            limit
        }
    })
}