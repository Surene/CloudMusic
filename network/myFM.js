import request from './request'

export function getMyFm(){
    let user = wx.getStorageSync("user")
    let cookie = user.cookie
    let timestamp = Date.parse(new Date())
    return request({
        url:'personal_fm',
        data:{
            cookie,
            timestamp
        }
    })
}

export function getMusicDetail(ids){
    return request({
        url:'song/detail',
        data:{
            ids
        }
    })
}

export function getMusicLyrics(id){
    return request({
        url:'lyric',
        data:{
            id
        }
    })
}

export function getMusicUrl(id){
    return request({
        url:'song/url',
        data:{
            id
        }
    })
}

export function checkMusic(id){
    return request({
        url:'check/music',
        data:{
            id
        }
    })
}

export function addToLikelist(id,like){
    let user = wx.getStorageSync("user")
    let cookie = user.cookie
    let timestamp = Date.parse(new Date())
    return request({
        url:'like',
        data:{
            id,
            cookie,
            like,
            timestamp
        }
    })
}