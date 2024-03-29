<template>
  <div class="container">
    <el-card shadow="hover" class="card-content">
      <div class="content-wrapper">
        <img src="/avatar/receptionist.png" alt="" class="img"/>
        <el-text>前台</el-text>
        <el-text>RECEPTIONIST</el-text>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-content">
      <div class="content-wrapper">
        <img src="/avatar/technician.png" alt="" class="img"/>
        <el-text>医助</el-text>
        <el-text>TECHNICIAN</el-text>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-content">
      <div class="content-wrapper">
        <img src="/avatar/veterinarian.png" alt="" class="img"/>
        <el-text>医师</el-text>
        <el-text>VETERINARIAN</el-text>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {defineComponent} from "vue";

defineComponent({
  name: "RolePlayComponent"
})

// const close = defineEmits(['close'])
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 5vh;
}
.card-content {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%; /* 调整宽度以符合设计 */
  .img{
    width: 270px;
    height: 270px;
  }
  .el-text{
    font-size: 24px;
    font-weight: bold;
    margin-top: 5px;
  }
}
.content-wrapper img {
  width: 100%; /* 图片宽度占满容器宽度 */
}
</style>
