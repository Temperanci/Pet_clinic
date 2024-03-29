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
            <el-button @click="Switch(0)">后台页面</el-button>
            <el-text>后台管理</el-text>
            <el-divider />
            <el-text>注销</el-text>
          </div>
        </div>
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
import FunctionalStudy from './subpage/FunctionalStudy.vue'

defineComponent({
  name: "PetClinicLayout"
})
const emit = defineEmits(['switch'])
function Switch(n:number){
    emit('switch',n)
}
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
  height: 100vh;
  width: 100vw;
  background-color: #fcf7f4;
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
.el-main{
  height: 87vh;
  width: 100%;
  display: grid;
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
    height: 70vh;
    display: flex;
    justify-content: center;
    overflow: auto;
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


</style>
