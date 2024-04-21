<template >
  <div v-if="adminVerify()" class="background">
    <div style="height: 10%;">
      <el-header>
        <div class="h1">
          Pet Clinic 宠物医院在线导览
        </div>
        <el-card shadow="hover">
          <div class="card-container">
            <div class="card-left">
              <el-avatar :size="45" />
              <el-text>{{ userName }}</el-text>

            </div>
            <div class="card-right">
              <el-button type="primary" link size="large" @click="router.push('home')">前台页面</el-button>
              <el-divider />
              <el-button type="danger" link size="large" @click="Logout()">注销</el-button>
            </div>
          </div>
        </el-card>
      </el-header>
    </div>

    <div class="mainPage">
      <div class="aside" v-if="aside">
        <div class="console">
          <el-menu style="height: 100%;background: rgb(233, 233, 235);">
            <div class="consoleBtn" v-for="guidance in guidanceMap" :key="guidance[0]" @click="handleSelect(guidance[0])">
            <!-- <p></p>
            <span>{{ guidance[1] }}</span> -->
            <el-menu-item :index=guidance[0] style="height: 100%;display: flex;">
          <span style="margin: auto;">{{ guidance[1] }}</span>
        </el-menu-item>
          </div>
          </el-menu>
          
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

          <!-- <div class="consoleBtn" v-for="study in studyMap" :key="study[0]" @click="handleSelect(study[0])">
            <p>{{ study[1] }}</p>
          </div> -->


        </div>
      </div>
      <div style="align-items:center;display: flex;width:0%;">
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
  <div v-else style="display: flex;">
    <p style="margin: auto;">NMSL</p>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { DefineComponent } from 'vue'
import BedManagement from './background/BedManagement.vue'
import CaseManagement from './background/CaseManagement.vue'
import ChargeManagement from './background/ChargeManagement.vue'
import DepartmentManagement from './background/DepartmentManagement.vue'
import DrugManagement from './background/DrugManagement.vue'
import StaffManagement from './background/StaffManagement.vue'
import StudyManagement from './background/StudyManagement.vue'
import ProblemManagement from './background/ProblemManagement.vue'
import ProblemSetManagement from './background/ProblemSetManagement.vue'
import TestRecordManagement from './background/TestRecordManagement.vue'
import CreateTest from './background/CreateTest.vue'
import QuestionBank from './background/QuestionBank.vue'
import FinishedTest from './background/FinishedTest.vue'
import { store } from '@/main'
//路由
import { useRouter } from 'vue-router';
const router = useRouter();
//认证
import {adminVerify} from '../scripts/authentication'
//登录
const userName = ref('');
defineComponent({
  name: "BackgroundLayout"
})
function Logout(){
  userName.value='';
  store.commit('clearToken');
  router.push('login');
}
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
  '8': ProblemManagement,
  '9': ProblemSetManagement,
  '10': TestRecordManagement
};
const guidanceMap = new Map([
  ['1', '住院管理'],
  ['2', '病例管理'],
  ['3', '收费管理'],
  ['4', '科室管理'],
  ['5', '药品管理'],
  ['6', '人员管理'],
  ['8', '题库管理'],
  ['9', '试卷管理'],
  ['10', '测试记录']
])//导航名称
// const studyMap = new Map([
//   ['8', '题库管理'],
//   ['9', '套题管理'],
//   ['10', '测试记录']
// ])
function handleSelect(n: string) {
  activeIndex.value = n;
  currentComponent.value = componentsMap[activeIndex.value];
}
const activeIndex = ref('1')
const currentComponent = ref(componentsMap['1']);
onMounted(() => {
  if (store.state.token.name !== '') {
    userName.value = store.state.token.name;
  }
})
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
  z-index: 3;
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
  }

  .card-container {
    display: flex;
    justify-content: space-between;
    /* 根据需要选择 space-between 或其他 */
    align-items: center;
    /* 垂直居中 */
    margin-top: -1.5vh;
    height: 8vh;
  }

  .card-left {
    display: flex;
    //justify-content: space-between;
    padding: 1vw 1vw 1vw 0;
    border-right: #DCDFE6 solid 2px;
    width: 40%;
    height: 5vh;

    .el-avatar {
      margin-right: 0.5vw;
      margin-left: -0.5vw;
    }

    .el-text {
      font-size: medium;
    }
  }

  .el-avatar {
    margin-right: 0.5vw;
    margin-left: -0.5vw;
  }

  .card-right {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* 如果你想要垂直居中里面的元素 */
    align-items: center;

    /* 水平居中 */
    .el-divider {
      margin: 0.5vh 0;
    }

    .el-button {
      width: 5vw;
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
