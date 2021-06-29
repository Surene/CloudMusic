import request  from "./request";

export function getToplist(){
    return request({
        url:'toplist/detail'
    })
}