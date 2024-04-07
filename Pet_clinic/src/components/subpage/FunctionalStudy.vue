<template>

  <div class="container">
    <el-row :gutter="80">
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
    <el-button plain @click="dialogOverflowVisible = true">
      智能医生
    </el-button>


    <el-dialog v-model="dialogOverflowVisible" title="智能医生" width="600" draggable overflow>
      <div class="dialog-content">
        <el-container>
          <el-header>
            对话内容
          </el-header>
          <el-main>
            <div v-for="(message, index) in dialog">
              <div v-if="index % 2 == 0" class="user-message">
                <div class="message-wrapper-right">{{ message }}</div>
              </div>
              <div v-else class="ai-message">
                <div class="message-wrapper-left">{{ message }}</div>
              </div>
            </div>
          </el-main>
          <el-footer>
          </el-footer>
        </el-container>
      </div>
      <el-input type="textarea" placeholder="在此输入" v-model="input" />
      <el-button size="small" @click="sendMessage">
        Send
      </el-button>
    </el-dialog>


  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import { Checked, Memo, UserFilled } from "@element-plus/icons-vue";
import OverlayComponent from './OverlayComponent.vue';
import RolePlayComponent from './RolePlayComponent.vue';
import CaseStudyComponent from './CaseStudyComponent.vue';
import OnlineTestComponent from './OnlineTestComponent.vue';


defineComponent({
  name: "FunctionalStudy",
  components: {
  }
})


const showOverlay = ref(false);
const activeComponent = ref(''); // 这里你可以根据逻辑设置为相应的组件名

const dialogOverflowVisible = ref(false);
const input = ref('');
const dialog = ref(['Hi', 'Hello, can I help you?', 'How to solve the question?', 'The answer is...']);

function sendMessage() {
  dialog.value.push(input.value);
  console.log('用户输入: ', input.value);
}

// 你还需要定义打开覆盖层时设置 activeComponent 的逻辑
function openOverlayWithComponent(componentName: string) {
  activeComponent.value = componentName;
  showOverlay.value = true;
}

</script>

<style scoped lang="scss">
.dialog-content {
  min-height: 400px;
  max-height: 400px;
  overflow: auto;
}

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
  max-width: 230px;
  word-wrap: break-word;
  background-color: powderblue;
  border-radius: 12px 0px 12px 12px;
}

.message-wrapper-left {
  max-width: 230px;
  word-wrap: break-word;
  background-color: lightslategray;
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
</style>
