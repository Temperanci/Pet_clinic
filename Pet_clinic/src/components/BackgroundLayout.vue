<template>
  <el-container>
  <el-header>
      <div class="h1">
        Pet Clinic 宠物医院在线导览
      </div>
      <el-card shadow="hover">
        <div class="card-container">
          <div class="card-left">
            <el-avatar :size="40" />
            <el-text>用户名用户名</el-text>
          </div>
          <div class="card-right">
            <el-button @click="Switch(1)">前台页面</el-button>
            <el-text>后台管理</el-text>
            <el-divider />
            <el-text>注销</el-text>
          </div>
        </div>
      </el-card>
    </el-header>
  <el-container class="mainPage">
    <div class="aside" v-if="aside">
      <div class="console">
        <div style="width: 100%;">
        aside
      </div>
      </div>
    </div>
      <div style="align-items:center;display: flex;width:0%">
          <span class="asideBtn" @click="()=>aside=!aside">
            <el-icon v-if="!aside"><ArrowRight /></el-icon>
            <el-icon v-else><ArrowLeft /></el-icon>
      </span>
      </div>
    <div class="main"></div>

  </el-container>
  
  </el-container>
</template>
<script setup lang="ts">
import { defineComponent,ref} from 'vue'
import type {DefineComponent} from 'vue'

defineComponent({
  name: "BackgroundLayout"
})

const aside = ref(false);//控制侧栏的可见性
const emit = defineEmits(['switch'])
function Switch(n:number){
    emit('switch',n)
}//发送消息到APP.vue
</script>
<style scoped lang="scss">
.el-container {
  height: 100vh;
  width: 100vw;
  background-color: #fcf7f4;
}
.asideBtn {
  height: 5%;
  border-color: #DCDFE6;
  border-style: solid;
  border-width: 2px;
  border-left-style: hidden;
  align-items:center;display: flex;
}
.mainPage {
  margin-top: 3%;
  margin-bottom:3% ;
  margin-left:1%;
  margin-right:1%;
  width : 98%;
  border-style:solid;
  border-radius: 10px;
  border-color: #DCDFE6;
}
.el-header {
  height: 10vh;
  display: flex;
  font-size: x-large;
  font-weight: bold;
  color: #be9367;
  align-items: center;
  .h1{
    width: 90%;
    font-size: xx-large;
  }
  .el-card{
    width: 15vw;
    height: 10vh;
    background-color: #f6efef;
    margin-top: 2vh;
    .card-container {
      display: flex;
      justify-content: space-between; /* 根据需要选择 space-between 或其他 */
      align-items: center; /* 垂直居中 */
      margin-top: -1.5vh;
      .card-left{
        display: flex;
        justify-content: center;
        padding: 1vw 1vw 1vw 0 ;
        border-right: #DCDFE6 solid 2px;
        .el-avatar{
          margin-right: 0.5vw;
          margin-left: -0.5vw;
        }
      }
      .card-right{
        display: flex;
        flex-direction: column;
        line-height: 0;
      }
    }
  }
}
.aside {
    text-align: center;
    background: rgb(233, 233, 235);
    border-right-color: #DCDFE6;
    border-right-style: solid;
    border-right-width: 2px;
    width: 20%;
}
.main {
    text-align: center;
    background: rgb(244, 244, 245);
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
.console {
  height: 100%;
  width: 100%;
  display: flex;
}

</style>