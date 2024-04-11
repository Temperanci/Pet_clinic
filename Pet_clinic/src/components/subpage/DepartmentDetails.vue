<template>
  <el-row :gutter="10">
    <el-col :span="4">
      <div class="grid-content ep-bg-purple" >
        <el-dropdown>
          <span>
              <el-button type="primary" color="#f4eded"  class="full-width-button">
                所有科室<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu
                default-active="1"
            >
              <el-dropdown-item
                  v-for="d in DepartmentPage.datas"
                  :key="d.departmentId"
                  :index="d.departmentId"
                  @click="handleSelect(d)"
              >
                {{ d.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-text class="departmentTitle"><h1>{{ selectedDepartment.name }}</h1></el-text>
        <el-text class="content">{{ selectedDepartment.desc }}</el-text>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="grid-content ep-bg-purple-light" >
        <div id="viewer" style="width: 100%; height: 100%;"></div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple">
        <el-text class="title">科室人员:</el-text>
        <el-divider />
        <div class="personnel-area">
          <div
              v-for="person in personnelList"
              :key="person.personnelId"
              class="personnel-card"
          >
            <el-popover
                placement="right"
                width="200"
                trigger="click"
            >
              <el-avatar size="large"></el-avatar>
              <p>{{ person.name }}</p>
              <p>{{ person.role }}</p>
              <p>{{ person.phoneNumber }}</p>
              <template #reference>
                <el-card shadow="hover">
                  <el-row :gutter="20" align="middle">
                    <el-col :span="2">
                      <el-avatar size="large" />
                    </el-col>
                    <el-col :span="2">
                      <div>
                        <p class="person-name">{{ person.name }}</p>
                        <p class="person-role">{{ person.role }}</p>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {onMounted, defineComponent, nextTick} from "vue";
import { ref, watch } from 'vue';
import 'element-plus/dist/index.css';
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import { ArrowDown } from '@element-plus/icons-vue'
import { pageQuery } from "@/apis/department/department";
import { PersonnelPageQuery } from "@/apis/personnel/personnel";
import type { DepartmentPageResponse } from "@/apis/department/department-interface"
import type { DepartmentBO, PersonnelBO } from "@/apis/schemas";

defineComponent({
  name: "DepartmentDetails"
})

let viewer: Viewer | null;
const props = defineProps({
  name: String,
});

// 处理菜单选项被选中的事件
const handleSelect = (department: DepartmentBO) => {
  selectedDepartment.value = department;
  // 如果需要更新全景图，确保DepartmentBO中有对应的字段
  // 更新全景图，如果department对象包含panorama字段的话
  if (viewer && department.picture) {
    viewer.setPanorama(department.picture)
        .catch(error => console.error("Failed to set panorama: ", error));
  }
};
// Reactive state variable for departments
const DepartmentPage = ref<DepartmentPageResponse>({ datas: [], total: 0, limit: 0 });
const selectedDepartment = ref<DepartmentBO>({
  desc: '',
  name: '',
  picture: '',
  location: '',
  departmentId: ''
})
const personnelList = ref<PersonnelBO[]>([]);
// Function to fetch departments
// 从后端获取departments数据并更新DepartmentPage
async function fetchDepartments() {
  try {
    const response = await pageQuery();
    // console.log('response:', response)
    if (response && response.data && response.data.datas) {
      DepartmentPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      // 如果需要，可以在这里设置默认选中的部门
      if (DepartmentPage.value.datas.length > 0) {
        selectedDepartment.value = DepartmentPage.value.datas[0];
        // 初始化全景图查看器
        viewer = new Viewer({
          container: "viewer",
          //全景图路径，全景图放置在public路径下的写法；放置在src路径下需要改写为require("路径")
          panorama: selectedDepartment.value.picture,
          navbar: undefined,
          plugins: [],
        });
      }
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
}
async function fetchPersonnel() {
  try {
    const result = await PersonnelPageQuery();
    if (result.success) {
      // 过滤出匹配的科室人员
      personnelList.value = result.data.datas.filter((personnel: PersonnelBO) =>
          personnel.departmentId === selectedDepartment.value.departmentId
      );
      console.log('personnelList:', personnelList.value)
    }
  } catch (error) {
    console.error('Error fetching personnel:', error);
  }
}
onMounted(async () => {
  await fetchDepartments();
  // 使用 nextTick 确保 DOM 更新完成后再访问它
  await nextTick();
  // 现在可以安全地访问更新后的 DOM，此时数据已经加载
  watch(() => props.name, (newName) => {
    // console.log('newName:', newName);
    // console.log('Department names:', DepartmentPage.value.datas.map(dep => dep.name));
    const matchedDepartment = DepartmentPage.value.datas.find(department => department.name === newName);
    // console.log('matchedDepartment:', matchedDepartment);
    if (matchedDepartment) {
      selectedDepartment.value = matchedDepartment;
      if (viewer && matchedDepartment.picture) {
        viewer.setPanorama(matchedDepartment.picture).catch(error => {
          console.error("Failed to set panorama: ", error);
        });
      }
    }
  }, { immediate: true });
  watch(() => selectedDepartment.value.departmentId, async (newDepartmentId) => {
    if (newDepartmentId) {
      await fetchPersonnel();
    } else {
      personnelList.value = []; // 如果没有departmentId，清空人员列表
    }
  }, { immediate: true });
});
</script>

<style scoped lang="scss">
.el-row{
  width: 90vw;
}
.el-col {
  border-radius: 4px;
}
.el-dropdown{
  width: 100%;
  justify-content: center;
}
.full-width-button{
  width: 15vw;
}
.grid-content {
  border-radius: 4px;
  height: 70vh;
}
.ep-bg-purple{
  background: #bd9266;
}
.ep-bg-purple-light{
  background: #f4eded;
}
.departmentTitle{
  font-size: 1.5em;
  color: #2a1f1f;
  text-align: center;
}
.title{
  font-size: 2em;
  font-weight: bold;
  color: #2a1f1f;
  margin-left: 7vw;
}
.content{
  font-size: 1.2em;
  color: #2a1f1f;
  margin-top: 10px;
  margin-left: 10px;
}

.personnel-area{
  justify-content: center;
  margin-top: 1rem;
  overflow: scroll;
  height: 59vh;
}

.personnel-card {
  cursor: pointer;
  margin-bottom: 1rem;
  width: 90%;
  transition: box-shadow 0.3s ease;
  margin-left: 5%;
  background-color: #f4eded;
}

.personnel-card .card-hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: large;
}

.person-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.5em; /* 根据实际需要调整 */
}

.person-role {
  font-size: 1em;
  color: #666; /* 根据实际需要调整 */
}
</style>
