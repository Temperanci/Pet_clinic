<template>
  <div class="background">
    <div style="height: 10%;">
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
    </div>

    <div class="mainPage">
      <div class="aside" v-if="aside">
        <div class="console">
          <div class="consoleBtn" v-for="guidance in guidanceMap" :key="guidance[0]" @click="handleSelect(guidance[0])">
            <p>{{ guidance[1] }}</p>
          </div>
          <!-- <div class="studyCollapse">
            <p style="width: 100%;">学习管理</p>
            <div style="align-items:center;display: flex;height:0%">
              <span style="align-items: center;height: 100%;widows: 100%;">
                <el-icon v-if="!aside">
                  <ArrowRight />
                </el-icon>
                <el-icon v-else>
                  <ArrowDown />
                </el-icon>
              </span>

            </div>
          </div> -->

          <div class="consoleBtn" v-for="study in studyMap" :key="study[0]" @click="handleSelect(study[0])">
            <p>{{ study[1] }}</p>
          </div>


        </div>
      </div>
      <div style="align-items:center;display: flex;width:0%">
        <span class="asideBtn" @click="() => aside = !aside">
          <el-icon v-if="!aside">
            <ArrowRight />
          </el-icon>
          <el-icon v-else>
            <ArrowLeft />
          </el-icon>
        </span>
      </div>

      <div class="main">
        <component :is="currentComponent">

        </component>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import type { DefineComponent } from 'vue'
import BedManagement from './background/BedManagement.vue'
import CaseManagement from './background/CaseManagement.vue'
import ChargeManagement from './background/ChargeManagement.vue'
import DepartmentManagement from './background/DepartmentManagement.vue'
import DrugManagement from './background/DrugManagement.vue'
import StaffManagement from './background/StaffManagement.vue'
import StudyManagement from './background/StudyManagement.vue'
import CreateTest from './background/CreateTest.vue'
import QuestionBank from './background/QuestionBank.vue'
import FinishedTest from './background/FinishedTest.vue'
defineComponent({
  name: "BackgroundLayout"
})

const aside = ref(true);//控制侧栏的可见性
const emit = defineEmits(['switch'])
function Switch(n: number) {
  emit('switch', n)
}//发送消息到APP.vue

interface ComponentsMap {
  [key: string]: DefineComponent<{}, {}, any>;
}
const componentsMap: ComponentsMap = {
  '1': BedManagement,
  '2': CaseManagement,
  '3': ChargeManagement,
  '4': DepartmentManagement,
  '5': DrugManagement,
  '6': StaffManagement,
  '7': StudyManagement,
  '8': QuestionBank,
  '9': CreateTest,
  '10': FinishedTest
};
const guidanceMap = new Map([
  ['1', '住院管理'],
  ['2', '病例管理'],
  ['3', '收费管理'],
  ['4', '科室管理'],
  ['5', '药品管理'],
  ['6', '人员管理']
])//导航名称
const studyMap = new Map([
  ['8', '题库管理'],
  ['9', '创建测试'],
  ['10', '已完成测试']
])
function handleSelect(n: string) {
  activeIndex.value = n;
  currentComponent.value = componentsMap[activeIndex.value];
}
const activeIndex = ref('1')
const currentComponent = ref(componentsMap['1']);
</script>
<style scoped lang="scss">
.collapseTitle {
  width: 100%;
  height: 100%;
}

.studyCollapse {
  display: flex;
  height: 8%;
  width: 100%;
  border-color: #DCDFE6;
  border-style: solid;
  border-width: 1px;
}

.background {
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
  align-items: center;
  display: flex;
  z-index: 1;
}

.mainPage {
  margin-top: 3%;
  margin-bottom: 3%;
  margin-left: 1%;
  margin-right: 1%;
  width: 98%;
  height: 80%;
  display: flex;
  border-style: solid;
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

  .h1 {
    width: 90%;
    font-size: xx-large;
  }

  .el-card {
    width: 15vw;
    height: 10vh;
    background-color: #f6efef;
    margin-top: 2vh;

    .card-container {
      display: flex;
      justify-content: space-between;
      /* 根据需要选择 space-between 或其他 */
      align-items: center;
      /* 垂直居中 */
      margin-top: -1.5vh;

      .card-left {
        display: flex;
        justify-content: center;
        padding: 1vw 1vw 1vw 0;
        border-right: #DCDFE6 solid 2px;

        .el-avatar {
          margin-right: 0.5vw;
          margin-left: -0.5vw;
        }
      }

      .card-right {
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

.asideBar {
  display: flex;
  width: auto;
  height: 100%;

  .div {
    width: 100%;
    height: 3%;
  }
}

.main {
  height: 100%;
  width: 100%;
  text-align: center;
  background: rgb(244, 244, 245);
  overflow: hidden;
}

.el-footer {
  height: 3vh;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
  background-color: #ece2e2;
  color: #909399;
}

.consoleBtn {
  height: 8%;
  width: 100%;
  border-color: #DCDFE6;
  border-style: solid;
  border-width: 1px;

}

.console {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>