import {store} from '@/main'
import {Personnel} from '@/apis/class'
export function userVerify():boolean{
    if(store.state.token.phoneNumber!=''){
        return true;
    }
    return false;
}
export function adminVerify():boolean{
    if(store.state.token.role==="管理员"){
        return true;
    }
    return false;
}
export function getToken(){
    if(store.state.token.phoneNumber){
        return store.state.token;//返回的Personnel对象
    }
    return null;//token为空
}