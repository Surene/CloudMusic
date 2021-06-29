import request from "./request";

// 获取用户详情
export function getUserDetail(uid){
    return request({
        url:'user/detail',
        data:{
            uid
        }
    })
}

// 接口暂时有问题
export function getSubcount(){
    return request({
        url:'user/subcount'
    })
}

// 请求歌单
export function getPlaylist(uid){
    return request({
        url:'user/playlist',
        data:{
            uid
        }
    })
}



