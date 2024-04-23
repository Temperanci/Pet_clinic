<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container">
    <el-row :gutter="80" justify="end">
      <el-col :span="8">
        <el-card shadow="hover">
          <el-result title="角色扮演" sub-title="可选前台、医助、医师三种角色">
            <template #icon>
              <el-icon size="50">
                <UserFilled />
              </el-icon>
            </template>
            <template #extra>
              <el-button type="primary" @click="openOverlayWithComponent('RolePlayComponent')">进入</el-button>
            </template>
          </el-result>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-result title="病例学习" sub-title="目录查找学习病种、病理知识进行学习">
            <template #icon>
              <el-icon size="50">
                <Memo />
              </el-icon>
            </template>
            <template #extra>
              <el-button type="primary" @click="openOverlayWithComponent('CaseStudyComponent')">进入</el-button>
            </template>
          </el-result>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-result title="在线测试" sub-title="选择套题或单题进行测试">
            <template #icon>
              <el-icon size="50">
                <Checked />
              </el-icon>
            </template>
            <template #extra>
              <el-button type="primary" @click="openOverlayWithComponent('OnlineTestComponent')">进入</el-button>
            </template>
          </el-result>
        </el-card>
      </el-col>

      <div class="aitutor-entry">
        <el-button type="warning" size="large" plain @click="openDialog();">
          智能医生🧐
        </el-button>
      </div>

      <!-- 假设有一个返回按钮的 Slot -->
      <slot name="back-button"></slot>

      <!-- 模态覆盖层，使用 v-model 绑定 -->
      <OverlayComponent class="overlay" v-model="showOverlay">
        <!-- 这里插入你的内容，根据 activeComponent 来显示相应的组件 -->
        <RolePlayComponent v-if="activeComponent === 'RolePlayComponent'" @close="showOverlay = false" />
        <CaseStudyComponent v-if="activeComponent === 'CaseStudyComponent'" @close="showOverlay = false" />
        <OnlineTestComponent v-if="activeComponent === 'OnlineTestComponent'" @close="showOverlay = false" />
      </OverlayComponent>

    </el-row>

    <el-dialog v-model="dialogVisible" title="智能医生 Ai-Tutor 👨‍⚕️💉🐈💊👩‍⚕️" width="800px" draggable overflow :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="aitutor-content">
        <el-container>
          <el-main>
            <div class="dialog">
              <div v-for="(msg, index) in userDialogRecords">
                <div class="user-message" v-if="userDialogRecords[index]">
                  <div class="message-wrapper-right">
                    {{ userDialogRecords[index] }}
                  </div>
                </div>
                <div class="ai-message">
                  <!-- <div v-if="responceLoading && currentResponceIndex===index" v-loading="responceLoading" >
                  </div> -->
                  <div class="message-wrapper-left" v-loading="responceLoading && currentResponceIndex === index" element-loading-text="智能医生思考中...">
                    {{ aiDialogRecords[index] }}
                  </div>
                </div>

              </div>
            </div>
          </el-main>
        </el-container>
      </div>
      <div class="aitutor-tool">
        <el-input type="textarea" placeholder="在此输入你的问题" v-model="userQuestion" style="width:90%;" />
        <el-button type="primary" size="" @click="sendMessage" style="margin:0 20px;" :disabled="responceLoading">
          
          发送
        </el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch } from "vue";
import { Checked, Memo, UserFilled } from "@element-plus/icons-vue";
import OverlayComponent from './OverlayComponent.vue';
import RolePlayComponent from './RolePlayComponent.vue';
import CaseStudyComponent from './CaseStudyComponent.vue';
import OnlineTestComponent from './OnlineTestComponent.vue';
import { answerQuestion } from '@/apis/aiTutor/aiTutor';
import type { AiTutorQuestionRequest } from '@/apis/aiTutor/aiTutor-interface';
import type { AiTutorBO } from '@/apis/schemas';
import { BOTools } from "@/apis/class";


defineComponent({
  name: "FunctionalStudy",
  components: {
  }
})
const showOverlay = ref(false);
const activeComponent = ref(''); // 这里你可以根据逻辑设置为相应的组件名
// 你还需要定义打开覆盖层时设置 activeComponent 的逻辑
function openOverlayWithComponent(componentName: string) {
  activeComponent.value = componentName;
  showOverlay.value = true;
}



//智能医生对话
const dialogVisible = ref(false);
const userQuestion = ref('');
//从本地读取对话历史记录
const userDialogRecords = ref(['']);
const aiDialogRecords = ref(['你好，我是这个虚拟宠物医院的智能医生，有关病例的问题可以向我提问~']);

const currentResponceIndex = ref(aiDialogRecords.value.length);
const responceLoading = ref(false);

async function sendMessage() {
  if (userQuestion.value !== '') {
    userDialogRecords.value.push(userQuestion.value);
  }

  const request: AiTutorQuestionRequest = { question: userQuestion.value };
  userQuestion.value = '';
  responceLoading.value = true;
  const response = await answerQuestion(request);
  console.log('用户发送问题:', request.question);
  console.log('智能助教回复:', response.data);
  if (response.data) {
    aiDialogRecords.value.push(response.data);
  }
  currentResponceIndex.value++;
  responceLoading.value = false;
}
function openDialog(){ //打开对话窗口
  // userDialogRecords.value = localStorage.getItem('userDialogRecords');
  // aiDialogRecords.value = localStorage.getItem('aiDialogRecords');
  // userDialogRecords.value = [''];
  // aiDialogRecords.value = ['你好，我是这个虚拟宠物医院的智能医生，有关病例的问题可以向我提问~'];
  dialogVisible.value = true;
}
function resetDialog() { //重置对话记录
  //重置对话记录 userDialogRecords 和 aiDialogRecords 为以下内容：
  userDialogRecords.value = [''];
  aiDialogRecords.value = ['你好，我是这个虚拟宠物医院的智能医生，有关病例的问题可以向我提问~'];
}
function saveDialog() { //保存对话记录
  //保存对话记录 userDialogRecords 和 aiDialogRecords 
  localStorage.setItem('userDialogRecords',JSON.stringify(userDialogRecords.value));
  localStorage.setItem('aiDialogRecords',JSON.stringify(aiDialogRecords.value));
  console.log('saveDialog.localStorage',localStorage.getItem('userDialogRecords'));
}
function clearDialog(){//清除对话记录
  localStorage.removeItem('userDialogRecords');
  localStorage.removeItem('aiDialogRecords');
}
watch(dialogVisible, () => {
  saveDialog();
  userQuestion.value = '';
});




</script>

<style scoped lang="scss">
.aitutor-content {
  min-height: 400px;
  max-height: 400px;
  overflow: auto;
}

.aitutor-tool {
  display: flex;
  padding: 10px 0;
}

.dialog {}

.user-message {
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}

.ai-message {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.message-wrapper-right {
  padding: 10px 20px;
  min-height: 20px;
  max-height: 1000px;
  max-width: 300px;
  // padding: 0 2px;
  word-wrap: break-word;
  background-color: rgba(176, 224, 230, 0.492);
  border-radius: 12px 0px 12px 12px;
}

.message-wrapper-left {
  padding: 10px 20px;
  min-height: 20px;
  max-height: 1000px;
  max-width: 300px;
  min-width: 200px; //等待ai回复时展示"智能医生思考中"
  // padding: 0 2px;
  word-wrap: break-word;
  background-color: rgba(119, 136, 153, 0.219);
  border-radius: 0px 12px 12px 12px;
}

.container {
  height: 70vh;
  align-items: center;
}

.el-row {
  height: 70vh;
}

.el-card {
  height: 50vh;
}

.overlay {
  position: fixed;
  /* 或 absolute，视具体情况而定 */
  top: 0;
  left: 0;
  width: 100vw;
  /* 视口宽度 */
  height: 100vh;
  /* 视口高度 */
  z-index: 1000;
  /* 确保它位于其他内容之上 */
}

.aitutor-entry {
  text-align: right;
  display: inline-flex;
}
</style>
