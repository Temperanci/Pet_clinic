<template>
  <div class="role-selection">
    <h1>请选择你要扮演的角色：</h1>
  </div>
  <div class="container">
    <el-card
        shadow="hover"
        class="card-content"
        v-for="(role, index) in roles"
        :key="index"
        @click="showDetails(role.nameCN)"
    >
      <div class="content-wrapper">
        <img :src="role.img" alt="" class="img"/>
        <el-text>{{ role.nameCN }}</el-text>
        <el-text>{{ role.nameEN }}</el-text>
      </div>
    </el-card>
    <role-detail v-if="selectedRoleName" :name="selectedRoleName" @close="closeDetails"></role-detail>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RoleDetail from './RoleDetail.vue';



const roles = ref<Role[]>([
  { img: "/avatar/receptionist.png", nameCN: "前台", nameEN: "RECEPTIONIST", content: "这里是前台的职责和介绍..." },
  { img: "/avatar/technician.png", nameCN: "医助", nameEN: "TECHNICIAN", content: "这里是医助的职责和介绍..." },
  { img: "/avatar/veterinarian.png", nameCN: "医师", nameEN: "VETERINARIAN", content: "这里是医师的职责和介绍..." }
  // ... 更多角色
]);

interface Role {
  img: string;
  nameCN: string;
  nameEN: string;
  content: string;
}
// 这里我们用一个字符串代替了整个对象
const selectedRoleName = ref<string | null>(null);

const showDetails = (roleName: string) => {
  selectedRoleName.value = roleName;
};

const closeDetails = () => {
  selectedRoleName.value = null;
};
</script>


<style scoped lang="scss">
.role-selection {
  text-align: center;
  width: 100%; // 确保占满全宽

  h1 {
    font-size: 50px;
    color: #fcf7f4;
    margin-bottom: 10vh; // 根据需要调整
  }
}
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
