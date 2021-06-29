import request from "./request";

export function search(keywords,limit=10){
    return request({
        url:'search',
        data:{
            // 每次搜索获取10首单曲
            keywords,
            limit,
            type:1
        }
    })
}

export function search_suggest(keywords){
    return request({
        url:'search/suggest',
        data:{
            keywords,
            type:'mobile'
        }
    })
}

export function hot_search(){
    return request({
        url:'search/hot/detail'
    })
}