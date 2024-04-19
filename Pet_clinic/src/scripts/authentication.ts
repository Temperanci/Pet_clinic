import {store} from '@/main'
import {Personnel} from '@/apis/class'
export function Verify():boolean{
    return true;
}
export function getToken(){
    if(store.state.token.phoneNumber){
        return store.state.token;//返回的Personnel对象
    }
    return null;//token为空
}