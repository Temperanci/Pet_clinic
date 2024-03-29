<template>
  <el-container>
    <el-header>
      <div class="h1">
        <h1>Pet Clinic 宠物医院在线导览</h1>
      </div>
      <el-card shadow="hover">
        <template #header>
          <el-text>用户名</el-text>
          <el-avatar :size="30" />
        </template>
        <el-text>后台管理 管理/注销</el-text>
      </el-card>
    </el-header>
    <el-main>
      <el-menu mode="horizontal"
               :default-active="activeIndex"
               @select="handleSelect"
      >
        <el-menu-item index="1">医院导览</el-menu-item>
        <el-menu-item index="2">科室详情</el-menu-item>
        <el-menu-item index="3">药品资源</el-menu-item>
        <el-menu-item index="4">服务收费</el-menu-item>
        <el-menu-item index="5">床位查询</el-menu-item>
        <el-menu-item index="6">职能学习</el-menu-item>
      </el-menu>
      <div class="content-area">
        <!-- 动态组件会在这里渲染 -->
<!--        <component :is="currentComponent" />-->
        <ClinicGuidance v-if="activeIndex === '1'" @marker-clicked="markerClicked" />
        <DepartmentDetails v-if="activeIndex === '2'" :selected-id="selectedDepartmentId" />
        <DrugResource v-if="activeIndex === '3'" />
        <ServiceCharge v-if="activeIndex === '4'" />
        <BedInquiry v-if="activeIndex === '5'" />
        <FunctionalStudy v-if="activeIndex === '6'" />
      </div>
    </el-main>
    <el-footer>
      <el-text>© 2024 Pet Clinic Online   All right reserved</el-text>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import type { DefineComponent } from 'vue';
import { ref } from 'vue'
import ClinicGuidance from './subpage/ClinicGuidance.vue'
import ServiceCharge from './subpage/ServiceCharge.vue'
import DepartmentDetails from './subpage/DepartmentDetails.vue'
import DrugResource from './subpage/DrugResource.vue'
import BedInquiry from './subpage/BedInquiry.vue'
import FunctionalStudy from './subpage/FunctionalStudy/FunctionalStudy.vue'

defineComponent({
  name: "PetClinicLayout"
})

interface ComponentsMap {
  [key: string]: DefineComponent<{}, {}, any>;
}
const componentsMap: ComponentsMap = {
  '1': ClinicGuidance,
  '2': DepartmentDetails,
  '3': DrugResource,
  '4': ServiceCharge,
  '5': BedInquiry,
  '6': FunctionalStudy
  // 对应的其他组件...
}

const activeIndex = ref('1')
const currentComponent = ref(componentsMap[activeIndex.value])
const selectedDepartmentId = ref(1);

const handleSelect = (index: string) => {
  activeIndex.value = index
  currentComponent.value = componentsMap[index]
}
// 当 marker 被点击时调用
const markerClicked = (id: number) => {
  // 切换到科室详情页面
  activeIndex.value = '2';
  // 设置选中的科室 ID
  selectedDepartmentId.value = id;
};

</script>


<style scoped lang="scss">
.el-container {
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
    width: 90%;
  }
}
.el-main{
  height: 87vh;
  width: 100%;
  display: grid;
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
</style>
