<template>
  <div class="study-panel">
    <el-menu
        :default-openeds="['1']"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
    >
      <el-sub-menu v-for="category in categories" :index="category.id" :key="category.id">
        <template #title>
          <span>{{ category.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
              v-for="caseType in category.caseTypes"
              :index="caseType.id"
              :key="caseType.id"
              @click="showCaseDetails(caseType)"
          >
            {{ caseType.name }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <div class="case-details" v-if="selectedCase">
      <h2>{{ selectedCase.name }}</h2>
      <p>{{ selectedCase.details }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMenu, ElMenuItem, ElMenuItemGroup } from 'element-plus';

import {defineComponent} from "vue";

defineComponent({
  name: "CaseStudyComponent"
})

const categories = ref([
  {
    id: '1',
    name: '大类A',
    caseTypes: [
      { id: '1-1', name: '病例A1', details: '病例A1详细信息...' },
      { id: '1-2', name: '病例A2', details: '病例A2详细信息...' },
      // ...更多病例
    ],
  },
  {
    id: '2',
    name: '大类B',
    caseTypes: [
      { id: '2-1', name: '病例B1', details: '病例B1详细信息...' },
      { id: '2-2', name: '病例B2', details: '病例B2详细信息...' },
      // ...更多病例
    ],
  },
  {
    id: '3',
    name: '大类C',
    caseTypes: [
      { id: '3-1', name: '病例C1', details: '病例C1详细信息...' },
      { id: '3-2', name: '病例C2', details: '病例C2详细信息...' },
      // ...其他病例C
    ],
  },
  {
    id: '4',
    name: '大类C',
    caseTypes: [
      { id: '3-1', name: '病例C1', details: '病例C1详细信息...' },
      { id: '3-2', name: '病例C2', details: '病例C2详细信息...' },
      // ...其他病例C
    ],
  },
  {
    id: '5',
    name: '大类C',
    caseTypes: [
      { id: '3-1', name: '病例C1', details: '病例C1详细信息...' },
      { id: '3-2', name: '病例C2', details: '病例C2详细信息...' },
      // ...其他病例C
    ],
  }
  // ...更多大类
]);

const selectedCase = ref(null);

const showCaseDetails = (caseType) => {
  selectedCase.value = caseType;
};

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
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
</style>

