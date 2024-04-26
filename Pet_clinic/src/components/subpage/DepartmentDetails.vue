<template>
  <el-row :gutter="10">
    <el-col :span="4">
      <div class="grid-content ep-bg-purple">
        <el-dropdown>
          <span>
            <el-button type="primary" class="full-width-button">
              所有科室<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu default-active="1">
              <el-dropdown-item v-for="d in DepartmentPage.datas" :key="d.departmentId" :index="d.departmentId"
                @click="handleSelect(d)">
                {{ d.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-text class="departmentTitle">
          <h1>{{ selectedDepartment.name }}</h1>
        </el-text>
        <el-text class="content">{{ selectedDepartment.desc }}</el-text>
        <el-divider />
        <div class="personnel-area">
          <div v-for="tool in toolList" :key="tool.name" class="personnel-card">
            <!-- <el-popover
                trigger="hover"
                :width="400"
                :height="225"
                >
                <template #reference>
                  <span style="float: right">{{  }}</span>
                </template>
                <video
              src="http://smartcomerce-1306415420.cos.ap-chengdu.myqcloud.com/0dbe0541-1267-41e9-87e0-e3fb9c6becc1.mp4"
              controls
              class="case-video"
            ></video>
                </el-popover> -->
            <!-- <el-popover trigger="hover" :width="400" :height="225">
              <template #reference>
            <el-card shadow="hover">
                  <el-row :gutter="20" align="middle">
                    <el-col :span="1.2">
                      <el-avatar size="large" :src=tool.url />
                    </el-col>
                    <el-col :span="2" style="width: 100%;">
                      <div>
                        <p class="tool-name">{{ tool.name }}</p>

                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </template>
              <video
                src="http://smartcomerce-1306415420.cos.ap-chengdu.myqcloud.com/0dbe0541-1267-41e9-87e0-e3fb9c6becc1.mp4"
                controls class="case-video"></video>
            </el-popover> -->
            <el-popover placement="right" width="200" trigger="click">
              <p>{{ tool.name }}</p>
              <p>{{ tool.desc }}</p>
              <p>{{ tool.operation }}</p>
              <el-popover trigger="click" :width="400" :height="225">
              <template #reference>
            <el-button type="primary">视频</el-button>
              </template>
              <video
                :src=tool.video
                controls class="case-video"></video>
            </el-popover>
              
              
              <template #reference>
                <el-card shadow="hover">
                  <el-row :gutter="20" align="middle">
                    <el-col :span="1.2">
                      <el-avatar size="large" :src=tool.url />
                    </el-col>
                    <el-col :span="2" style="width: 100%;">
                      <div>
                        <p class="tool-name">{{ tool.name }}</p>

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
    <el-col :span="14">
      <div class="grid-content ep-bg-purple-light">
        <div id="viewer" style="width: 100%; height: 100%;"></div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple">
        <el-text class="title">科室人员:</el-text>
        <el-divider />
        <div class="personnel-area">
          <div v-for="person in personnelList" :key="person.personnelId" class="personnel-card">
            <el-popover placement="right" width="200" trigger="click">
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
import { onMounted, defineComponent, nextTick, type Ref } from "vue";
import { ref, watch } from 'vue';
import 'element-plus/dist/index.css';
import * as PSV from "@photo-sphere-viewer/core";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import { ArrowDown, List, Operation } from '@element-plus/icons-vue'
import { pageQuery } from "@/apis/department/department";
import { pageQuery as PersonnelPageQuery } from "@/apis/personnel/personnel";
import type { DepartmentPageResponse } from "@/apis/department/department-interface"
import type { DepartmentBO, PersonnelBO } from "@/apis/schemas";
import { Department } from "@/apis/class";

defineComponent({
  name: "DepartmentDetails"
})

let viewer: PSV.Viewer | null;
const props = defineProps({
  name: String,
});

class tool {
  name: string;
  desc: string;
  operation: string;
  url: string;
  video:string;
  constructor() {
    this.name = '';
    this.desc = '';
    this.operation = '';
    this.url = '';
    this.video=''
  }
}


// TODO_content_fill
const toolList: Ref<tool[]> = ref([
  // ({
  //   name: "1",
  //   desc: "2",
  //   operation: "3"
  // } as tool)
])



// 处理菜单选项被选中的事件
const handleSelect = (department: DepartmentBO) => {
  selectedDepartment.value = department;
  // 如果需要更新全景图，确保DepartmentBO中有对应的字段
  // 更新全景图，如果department对象包含panorama字段的话
  if (viewer && department.picture) {
    viewer.setPanorama(department.picture)
      .catch(error => console.error("Failed to set panorama: ", error));
  }
  // hardcode
  toolList.value = [];
  if (department.name === "影像学检查室") {
    toolList.value.push(({
      name: "X射线机",
      desc: "X射线机是一种医学成像设备，利用X射线穿透人体组织，形成影像以帮助医生诊断疾病。X射线是一种电磁辐射，能量高于可见光，能穿透大多数软组织，但被骨骼或金属吸收。",
      operation: "X射线机的操作流程首先开始于患者的接待与准备，其中患者在抵达放射科后需在前台登记并更换为专用的病号服，同时需卸下所有金属物品。接下来，技术员会核实患者信息并介绍拍摄过程及注意事项。定位阶段，技术员根据需拍摄的部位指导患者调整姿势，并调整X射线机的角度和位置以确保正确覆盖检查区域。曝光时，技术员将进入防护操作室使用遥控设备进行操作，此时患者需保持静止以避免影像模糊。曝光完成后，所得影像将被传送至计算机系统供放射科医师评估。如图像不清晰可能需重拍。检查结束后，患者可以更换衣物并离开，而诊断报告将被送至主治医生以便后续处理。整个过程中，确保操作安全和影像质量是至关重要的，需要操作人员具备专业训练与资格认证。",
      url: "/avatar/X-ray.png",
      video:"http://smartcomerce-1306415420.cos.ap-chengdu.myqcloud.com/b1fce811-bd52-4baa-b047-7a785b5bde21.mp4"
    } as tool));
  }
  if (department.name === "输液室") {
    toolList.value.push(({
      name: "输液支架",
      desc: "输液支架是医疗设备中常用的一种，主要用于悬挂输液瓶或输液袋，以便通过静脉途径向患者输送药物或营养液体。输液支架通常由金属或塑料制成，具有伸缩调节功能，以适应不同环境和患者需求。",
      operation: "使用输液支架的流程首先是进行设备的安装与检查，确保所有部件固定牢靠，尤其是基座和立杆的连接部分。接着，根据需要调整立杆的高度，使输液瓶或袋位于患者心脏高度以上以利用重力促进输液。将输液袋或瓶悬挂于挂钩上，并确保输液管路正确连接无泄漏。然后，将支架稳妥地放置在床旁或所需位置，并检查支架的稳定性以防在输液过程中被意外撞倒。在输液过程中，需持续监控输液速度和患者的反应，确保一切正常。输液完成后，将空的输液瓶或袋取下，并对支架的相关部分进行清理和消毒，以备下次使用。这一整套操作流程需要严格遵守，以确保患者安全和治疗的有效性。",
      url: "/avatar/zhijia.png",
      video:"http://smartcomerce-1306415420.cos.ap-chengdu.myqcloud.com/d1634013-0511-4006-bc9c-356af0bd2739.mp4"
    } as tool));
  }
  if (department.name === "化验室") {
    toolList.value.push(({
      name: "显微镜",
      desc: "显微镜是一种放大仪器，用于观察那些肉眼无法直接看到的微小物体或细节。它在科学研究、医学诊断、工业检测等多个领域中都有广泛的应用。常见的显微镜类型包括光学显微镜、电子显微镜和扫描探针显微镜等。",
      operation: "使用显微镜时，首先需准备并固定好载玻片样本在载物台上。开启显微镜的光源，并根据需要观察的细节选择合适的物镜，通常从低倍物镜开始。使用粗准焦旋钮初步调整焦距，使样本大致进入焦点范围，然后通过细准焦旋钮缓慢调整直至图像清晰。此外，可以调整光照强度和凹透镜的位置来优化图像的对比度和明暗。在观察过程中，可移动载物台来系统地查看样本的不同部分，如需要更高倍率观察，可更换高倍物镜并重新调整焦距。许多现代显微镜配备有相机或接口，允许用户记录或拍摄观察到的图像。在操作时应保持工作台面的清洁和稳定，避免物镜碰撞载玻片以防损坏。",
      url: "/avatar/microscope.png",
      video:"http://smartcomerce-1306415420.cos.ap-chengdu.myqcloud.com/23387b3e-2e58-44f0-97d1-7aafe7100bb1.mp4"
    } as tool));
  }
  if (department.name === "手术室") {
    toolList.value.push(({
      name: "手术台",
      desc: "手术台是医疗设施中用于手术过程中放置病人的专用设备，设计以确保在手术期间患者的安全和舒适，同时为医生提供便捷的操作条件。手术台通常可调节高度、倾斜和旋转，以适应不同的手术需求和医生的操作习惯。它们通常由易于清洁和消毒的材料制成，以保持无菌环境。",
      operation: "使用手术台的方法包括：首先确保手术台已经彻底清洁和消毒。在手术开始前，根据手术类型和医生的需求调整手术台的高度和位置，确保患者舒适并且手术区域易于医生访问。患者被安全地固定在手术台上，使用适当的固定装置如带子或支架，以防在手术过程中移动。手术过程中，根据需要调整手术台的倾斜和旋转角度，以便于进行不同的手术操作。手术完成后，应将手术台恢复到初始位置，并进行彻底的清洁和消毒，为下一次手术做好准备。整个过程中，操作人员应持续监测患者的生理状态和舒适度，确保手术的顺利进行。",
      url: "/avatar/operationboard.png",
      video:"http://smartcomerce-1306415420.cos.ap-chengdu.myqcloud.com/39be8e43-dcf6-4962-af0e-8071fa23c549.mp4"
    } as tool));
    toolList.value.push(({
      name: "氧气罐",
      desc: "氧气罐是一种装有高压氧气的储存容器，广泛用于医疗、工业和消防等领域，以提供额外的氧气。在医疗中，氧气罐主要用于治疗呼吸问题、提供生命支持和进行手术期间的麻醉。这些罐子通常由钢或铝制成，设计能承受高压，确保氧气安全存储和输送。",
      operation: "使用氧气罐的方法涉及几个关键步骤：首先，检查氧气罐以确保没有损坏或泄漏，并确认压力表显示有足够的氧气。然后，连接适当的输氧设备，如面罩或鼻管，确保所有连接处都牢固无漏。打开氧气罐上的阀门，根据医生的指示或治疗需要调整流量计至所需的流量。在使用氧气时，监控患者的反应和氧气的流量，确保患者能够舒适地呼吸。使用完毕后，关闭阀门，并断开所有连接设备，存放氧气罐时应保持其在通风良好且温度适宜的环境中。始终遵循安全指南和操作规程，以确保使用氧气罐时的安全和效果。",
      url: "/avatar/yangqiguan.png",
      video:"http://smartcomerce-1306415420.cos.ap-chengdu.myqcloud.com/da356419-22eb-48cb-ac99-883551dddb7c.mp4"
    } as tool));
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
    const response = await pageQuery({
      limit: 999
    });
    console.log('response:', response)
    if (response && response.data && response.data.datas) {
      DepartmentPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      // 如果需要，可以在这里设置默认选中的部门
      if (DepartmentPage.value.datas.length > 0) {
        selectedDepartment.value = DepartmentPage.value.datas[0];
        // 初始化全景图查看器
        viewer = new PSV.Viewer({
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
    const result = await PersonnelPageQuery({
      limit: 999
    });
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
.el-row {
  width: 90vw;
}

.el-col {
  border-radius: 4px;
}

.el-dropdown {
  width: 100%;
  justify-content: center;
}

.full-width-button {
  width: 15vw;
  background-color: #888888;
  color: #ffffff;
}

.grid-content {
  border-radius: 4px;
  height: 70vh;
  overflow: hidden;
}

.ep-bg-purple {
  background: #bd9266;
}

.ep-bg-purple-light {
  background: #f4eded;
}

.departmentTitle {
  font-size: 1.5em;
  color: #2a1f1f;
  text-align: center;
}

.title {
  font-size: 2em;
  font-weight: bold;
  color: #2a1f1f;
  margin-left: 7vw;
}

.content {
  font-size: 1.2em;
  color: #2a1f1f;
  margin-top: 10px;
  margin-left: 10px;
}

.personnel-area {
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
  margin-bottom: 0.5em;
  /* 根据实际需要调整 */
}

.tool-name {
  font-size: 1.0em;
  font-weight: bold;
  margin-bottom: 0.5em;
  /* 根据实际需要调整 */
}

.person-role {
  font-size: 1em;
  color: #666;
  /* 根据实际需要调整 */
}
</style>
