import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "leaflet/dist/leaflet.css";
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Vuex from 'vuex'
import {StorageToken} from './scripts/storage'
import {Personnel} from '@/apis/class'
export const store = new Vuex.Store({
  state: {
    token:{
      id:'',
      pwd:''
    }  //初始化token
  },
  mutations: {
    //存储token方法
    //设置token等于外部传递进来的值
    setToken(state:any, token:Personnel) {
        state.token = token
        StorageToken.set('token',token); //同步存储token至localStorage
      },
    clearToken(state:any){
      state.token=new Personnel();
      StorageToken.set('token',new Personnel());
    }
  },
 getters : {
  //获取token方法
  //判断是否有token,如果没有重新赋值，返回给state的token
  getToken(state:any) {
    if (!state.token) {
      if(StorageToken.get('token')!==null && StorageToken.get('token')!==undefined){
        state.token = StorageToken.get('token')
      }
    }
    return state.token
    }
  },
  actions: {
 
  }
})
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store);
app.use(router)
app.use(ElementPlus)
app.mount('#app')
