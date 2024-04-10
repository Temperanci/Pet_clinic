<template>
  <el-row>
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
      <div class="grid-content ep-bg-purple" >
        <el-text class="title">科室人员:</el-text>
        <el-divider />
        <el-text class="content">{{ selectedDepartment.departmentId }}</el-text>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {onMounted, defineComponent } from "vue";
import { ref } from 'vue';
import 'element-plus/dist/index.css';
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import { ArrowDown } from '@element-plus/icons-vue'
import { pageQuery } from "@/apis/department/department";
import type { DepartmentPageResponse } from "@/apis/department/department-interface"
import type {DepartmentBO} from "@/apis/schemas";

defineComponent({
  name: "DepartmentDetails"
})


// const consultations = ref([
//   // 咨询数据...
//   { id: 1, name: '药房', description: '提供各类药品，支持医院内外的药品需求。', staff: 'Dr.李,护士张,药剂师王', panorama: '/departments/pharmacy.jpg' },
//   { id: 2, name: '门诊室', description: '进行日常的健康咨询、疾病诊断与治疗。', staff: 'Dr.赵,护士钱,医助孙', panorama: '/departments/outpatient-room.jpg'  },
//   { id: 3, name: '治疗室', description: '提供各种非手术治疗，如理疗、针灸等。', staff: 'Dr.周,护士吴,理疗师郑', panorama: '/departments/operating-room-two.jpg'  },
//   { id: 4, name: '手术准备室', description: '为手术提供准备工作，包括消毒、麻醉前评估等。', staff: '麻醉师钱,护士刘,技师黄', panorama: '/departments/operating-room-one.jpg'  },
//   { id: 5, name: '手术室', description: '配备先进设备进行各种手术操作。', staff: '外科Dr.孙,麻醉师李,护士周', panorama: '/departments/operating-room-two.jpg'  },
//   { id: 6, name: '住院部', description: '为患者提供住院服务，包括日常护理和医疗监测。', staff: '主任吴,护士长钱,营养师赵', panorama: '/departments/pharmacy-front.jpg'  },
//   { id: 7, name: '档案室', description: '负责管理患者医疗档案和历史记录。', staff: '档案管理员李,数据分析师王', panorama: '/departments/records-dept.jpg'  },
//   { id: 8, name: '影像学检查室', description: '提供X光、CT、MRI等影像学检查服务。', staff: '放射科Dr.赵,技师钱,护士孙', panorama: '/departments/radiology-room.jpg'  },
//   { id: 9, name: '输液室', description: '为需要静脉输液的患者提供服务。', staff: '护士李,护士王,医助钱', panorama: '/departments/infusion-room.jpg'  },
//   { id: 10, name: '病理剖析室', description: '进行病理样本的剖析和分析。', staff: '病理师孙,技师周,助理吴', panorama: '/departments/autopsy-room.jpg'  },
//   { id: 11, name: '免疫室', description: '负责免疫相关的检测和治疗。', staff: '免疫科Dr.郑,护士王,技师冯', panorama: '/departments/pre-isolation-room.jpg'  },
//   { id: 12, name: '化验室', description: '提供血液、尿液等生物样本的化验服务。', staff: '化验师陈,助理蒋,护士沈', panorama: '/departments/laboratory.jpg'  },
//   { id: 13, name: '前台区', description: '为来访者提供咨询和指引服务。', staff: '接待员吴,信息员钱,安保李', panorama: '/departments/reception.jpg'  },
// ]);
//
//
// // 当前选中科室的状态
// const selectedConsultation = ref({
//   id: 0,
//   name: '',
//   description: '',
//   staff: '',
//   panorama: ''
// });
//
// // 处理菜单选项被选中的事件
// const handleSelect = (id: string) => {
//   const consultation = consultations.value.find(consultation => consultation.id.toString() === id);
//   if (consultation) {
//     selectedConsultation.value = consultation;
//   }
// };
// 定义视图容器
let viewer: Viewer | null;

// onMounted(() => {
//   const consultation = consultations.value.find(c => c.id === props.selectedId);
//   if (consultation) {
//     selectedConsultation.value = consultation;
//     viewer = new Viewer({
//       container: "viewer",
//       //全景图路径，全景图放置在public路径下的写法；放置在src路径下需要改写为require("路径")
//       panorama: selectedConsultation.value.panorama,
//       navbar: undefined,
//       plugins: [],
//     });
//   }
// });
//
// // 使用watch侦听selectedConsultation的变化，并相应地更新全景图
// watch(selectedConsultation, (newValue, oldValue) => {
//   if (viewer && newValue.panorama !== oldValue.panorama) {
//     viewer.setPanorama(newValue.panorama)
//         .catch(error => console.error("Failed to set panorama: ", error));
//   }
// }, { deep: true }); // 使用deep选项来确保响应式对象内部属性的变化也能被侦听到

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
// Function to fetch departments
// 从后端获取departments数据并更新DepartmentPage
async function fetchDepartments() {
  try {
    const response = await pageQuery();
    if (response && response.data && response.data.datas) {
      DepartmentPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      console.log('Fetched departments:', DepartmentPage.value.datas);
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
        if (viewer && selectedDepartment.value.picture) {
          viewer.setPanorama(selectedDepartment.value.picture);
        }
      }
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
}

onMounted(() => {
  fetchDepartments();
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
  font-size: 1.3em;
  color: #2a1f1f;
  text-align: center;
}
.title{
  font-size: 1.8em;
  color: #2a1f1f;
}
.content{
  font-size: 1em;
  color: #2a1f1f;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
