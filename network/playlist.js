import request from './request'

export function getPlaylist(cat,offset = 30){
    return request({
        url:'top/playlist',
        data:{
            limit:30,
            cat,
            offset
        }
    })
}

export function getPlaylistCategory(){
    return request({
        url:'playlist/catlist'
    })
}

export function getHotCategory(){
    return request({
        url:'playlist/hot'
    })
}

export function getPlayListDetail(id){
    let user = wx.getStorageSync("user")
    let cookie = user.cookie
    return request({
        url:'playlist/detail',
        data:{
            id,
            cookie
        }
    })
}

export function getLikelist(){
    let uid = wx.getStorageSync("uid")
    let user = wx.getStorageSync("user")
    let cookie = user.cookie
    return request({
        url:'likelist',
        data:{
            uid,
            cookie
        }
    })
}


