<template>
  <div class="study-panel">
    <el-menu
        class="el-menu-vertical-demo"
    >
      <!-- 遍历疾病列表，为每个疾病创建菜单项 -->
      <el-menu-item
          v-for="disease in diseasePage.datas"
          :key="disease.diseaseId"
          :index="disease.diseaseId"
          @click="showCaseDetails(disease)"
      >
        {{ disease.name }}
      </el-menu-item>
    </el-menu>
    <div class="case-details" v-if="selectedCase">
      <h1>{{ selectedCase.name }}</h1>
      <p>{{ selectedCase.desc }}</p>
      <el-divider />
      <p>病例列表：</p>
      <el-menu>
        <el-menu-item
            v-for="instance in selectedCaseInstance"
            :key="instance.instanceId"
            :index="instance.instanceId"
            class="instance-item"
        >
          <h2>{{ instance.desc }}</h2>
          <p>{{ instance.instanceId }}</p>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import { ElMenu, ElMenuItem } from 'element-plus';
import { pageQuery as DiseasePageQuery } from "@/apis/disease/disease";
import type { DiseaseBO } from "@/apis/schemas";
import type { DiseasePageResponse } from "@/apis/disease/disease-interface";
import type {DiseaseInstancePageResponse} from "@/apis/diseaseInstance/diseaseInstance-interface";
import { pageQuery } from "@/apis/diseaseInstance/diseaseInstance";

// 声明组件名称
defineComponent({
  name: "CaseStudyComponent"
})

// 定义疾病页面的响应式数据
const diseasePage = ref<DiseasePageResponse>({ datas: [], total: 0, limit: 0 });
// 定义选中的疾病详情
const selectedCase = ref<DiseaseBO | null>(null);

// 定义获取疾病列表的函数
async function fetchDisease() {
  try {
    const response = await DiseasePageQuery();
    diseasePage.value = response.data;
  } catch (error) {
    console.error('Failed to fetch disease:', error);
  }
}
const diseaseInstance = ref<DiseaseInstancePageResponse>({ datas: [], total: 0, limit: 0 });
const selectedCaseInstance = ref<DiseaseInstanceBO[] | null>(null);
async function fetchDiseaseInstance() {
  try {
    const response = await pageQuery();
    console.log('response:', response)
    diseaseInstance.value = response.data;
  } catch (error) {
    console.error('Failed to fetch diseaseInstance:', error);
  }
}

// 定义展示疾病详情的函数
function showCaseDetails(disease: DiseaseBO) {
  selectedCase.value = disease;
  selectedCaseInstance.value = diseaseInstance.value.datas.filter(item => item.diseaseId === disease.diseaseId);
  console.log('selectedCaseInstance:', selectedCaseInstance.value)
}

// 组件挂载后获取疾病数据

onMounted(() => {
  fetchDisease();
  fetchDiseaseInstance();
});
</script>


<style scoped lang="scss">
.study-panel {
  display: flex;
  justify-content: center; // 垂直居中
  width: 100vw; // 视口宽度
  height: 100vh; // 视口高度
}

.el-menu-vertical-demo {
  background-color: #fff; // 菜单背景色
  width: 20%; // 根据需要调整宽度
  max-height: 85vh; // 最大高度占视口的80%
  overflow-y: auto; // 内容超出时垂直滚动
  border-radius: 20px;
  border: #3d3a3a 1px solid;
}

.case-details {
  background-color: #fff; // 详情背景色
  margin-left: 10px; // 与菜单的间隔
  padding: 20px; // 内边距
  width: 60%; // 根据需要调整宽度
  max-height: 80vh; // 最大高度占视口的80%
  border-radius: 20px;
  border: #2a1f1f 1px solid;
}
.instance-item{
  justify-content: space-around;
  background-color: #f4eded;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  border: #2a1f1f 1px solid;
}
</style>

