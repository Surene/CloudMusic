import request from "./request";

export function getDailyRecommendationSongs(){
    let user = wx.getStorageSync("user")
    let cookie = user.cookie
    return request({
        url:'recommend/songs',
        data:{
            cookie
        }
    })
}
