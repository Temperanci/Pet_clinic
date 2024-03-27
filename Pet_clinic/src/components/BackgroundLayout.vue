<template>
  <div class="main">
    <el-container>
      <el-header>
        <div class="h1">
          <h1 width="100%" hight="100%">Pet Clinic 宠物医院在线导览</h1>
        </div>
        <div class="user">
          <el-button @click="Switch(1)">前台页面</el-button>
          <el-card shadow="hover">
          <template #header>
            <el-text>用户名</el-text>
            <el-avatar :size="30" />
          <el-text>后台管理 管理/注销</el-text>
          </template>
        </el-card>
        </div>
    </el-header>
    <el-container class="el=body">
      <el-aside>
      aside
      </el-aside>
      <el-main>
        main
    </el-main>
    </el-container>
    </el-container>
  </div>
    
      
    

</template>
<script setup lang="ts">
import { defineComponent,ref} from 'vue'
import type {DefineComponent} from 'vue'

defineComponent({
  name: "BackgroundLayout"
})

//const drawer = ref(false);//控制侧栏的可见性
const emit = defineEmits(['switch'])
function Switch(n:number){
    emit('switch',n)
}//发送消息到APP.vue
</script>
<style scoped lang="scss">
.main {
  height: 100%;
  width: 100%;
  min-height: 500px;
  background-color: #fcf7f4;
}
.el-header {
  height: 10vh;
  display: flex;
  font-size: x-large;
  font-weight: bold;
  color: #be9367;
  .h1{
    width: 80%;
    height: 100%;
  }
}
.el-footer{
  height: 3vh;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
  background-color: #ece2e2;
  color: #909399;
}
.el-menu{
  height: 6vh;
  flex-grow: 1;
  justify-content: center;
  background-color: #f6efef;
  --active-color: #be9367
}
.el-menu-item{
  width: 15vw;
  font-size: large;
}
.content-area{
  display: flex;
  justify-content: center;
  min-height: 650px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.el-card{
  margin-top: 10px;
  width: 12vw;
  height: 90px;
  background-color: #f6efef;
  .el-avatar{
    margin-left: 100px;
  }
}
.el-aside {
    text-align: center;
    background: rgb(233, 233, 235);
    border-right-color: #DCDFE6;
    border-right-style: solid;
    border-right-width: 2px;
}
.el-main {
    text-align: center;
    background: rgb(244, 244, 245);
}
.user {
  width: 20%;
}
</style>