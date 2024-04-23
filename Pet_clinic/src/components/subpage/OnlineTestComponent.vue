<template>
  <div class="online-test-component">
    <el-button class="back-button" @click="returnUpper" v-if="content !== 'Menu'">返回上一级</el-button>
    <!-- 在这里添加在线测试相关的内容 -->
    <div class="test-content">
      <template v-if="content === 'Menu'">
        <div class="test-module">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-card shadow="hover">
                <el-result title="套题考试" sub-title="选择试卷参加测试，ai自动批卷及时反馈">
                  <template #icon>
                    <el-icon size="50">
                      <Edit />
                    </el-icon>
                  </template>
                  <template #extra>
                    <el-button type="warning" size="large" @click="changeContent('ProblemSet')">进入</el-button>
                  </template>
                </el-result>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <el-result title="单题练习" sub-title="按病种知识点筛选题目，自主练习巩固弱项">
                  <template #icon>
                    <el-icon size="50">
                      <Reading/>
                    </el-icon>
                  </template>
                  <template #extra>
                    <el-button type="success" size="large" @click="changeContent('SingleProblem')">进入</el-button>
                  </template>
                </el-result>
              </el-card>
            </el-col>

          </el-row>
        </div>
      </template>
      <SingleProblem v-if="content === 'SingleProblem'" @content="(c: string) => content = c" />
      <ProblemSet v-if="content === 'ProblemSet'" @content="(c: string) => content = c"
        @id="(id: string) => testId = id" @time="(time: Date) => enterTime = time" />
      <Test v-if="content === 'Test'" @content="(c: string) => content = c" :testId="testId" :enterTime="enterTime" />
      <TestRecord v-if="content === 'TestRecord'" @content="(c: string) => content = c" :testId="testId" />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="警告" width="400px" draggable overflow :close-on-click-modal="false" :close-on-press-escape="false">
    <span>考试中途离开后无法再次进入，确定要退出吗？</span>
    <template #footer>
            <div class="dialog-footer">
                <el-button type="info" @click="dialogVisible = false">取消</el-button>
                <el-button type="danger" @click="dialogVisible = false;changeContent('ProblemSet');">
                    退出
                </el-button>
            </div>
        </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import ProblemSet from '../testpage/ProblemSet.vue';
import SingleProblem from '../testpage/SingleProblem.vue';
import Test from "../testpage/Test.vue";
import TestRecord from "../testpage/TestRecord.vue";

defineComponent({
  name: "OnlineTestComponent",
  components: {
    SingleProblem,
    ProblemSet,
    Test,
    TestRecord
  }
})
const dialogVisible = ref(false);
const testId = ref(''); //所选测试id
const enterTime = ref(new Date()); //进入测试时间

const content = ref('Menu');
function changeContent(c: string) { //改变测试页面内容
  content.value = c;
  console.log('测试页面内容:', content.value)
}
function returnUpper() { //返回测试页面上一级
  switch (content.value) {
    case 'TestRecord':
      changeContent('ProblemSet');
      break;
    case 'SingleProblem':
      changeContent('Menu');
      break;
    case 'ProblemSet':
      changeContent('Menu');
      break;
    case 'Test':
      dialogVisible.value = true;
      // changeContent('ProblemSet');
      break;
    default:
      changeContent('Menu');
  }
}

const close = defineEmits(['close'])
</script>

<style scoped>
.online-test-component {
  position: relative;
  /* 这里添加您自己的样式 */
}

.test-module {
  margin-top: 100px;
  margin-left: 200px;
  margin-right: 200px;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
}

.test-content {
  position: relative;
  top: 50px;
}
</style>
