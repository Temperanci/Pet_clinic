<template>
  <div class="online-test-component">
    <el-button class="back-button" @click="returnUpper" v-if="content !== 'Menu'">返回上一级</el-button>
    <!-- 在这里添加在线测试相关的内容 -->
    <div class="test-content">
      <template v-if="content === 'Menu'">
        <div class="test-module">
          <el-row :gutter="40">
            <el-col :span="8">
              <el-card shadow="hover">
                <el-result title="套题" sub-title="选择试卷参加测试">
                  <template #icon>
                    <el-icon size="50">
                      <Checked />
                    </el-icon>
                  </template>
                  <template #extra>
                    <el-button type="primary" size="large" @click="changeContent('ProblemSet')">进入</el-button>
                  </template>
                </el-result>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <el-result title="单题" sub-title="按知识点筛选题目练习">
                  <template #icon>
                    <el-icon size="50">
                      <Checked />
                    </el-icon>
                  </template>
                  <template #extra>
                    <el-button type="primary" size="large" @click="changeContent('SingleProblem')">进入</el-button>
                  </template>
                </el-result>
              </el-card>

            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <el-result title="测试记录" sub-title="查看套题的答题记录和分数">
                  <template #icon>
                    <el-icon size="50">
                      <Checked />
                    </el-icon>
                  </template>
                  <template #extra>
                    <el-button type="primary" size="large" @click="changeContent('TestRecord')">进入</el-button>
                  </template>
                </el-result>
              </el-card>

            </el-col>
          </el-row>
        </div>
      </template>
      <SingleProblem v-if="content === 'SingleProblem'" @content="(c: string) => content = c" />
      <ProblemSet v-if="content === 'ProblemSet'" @content="(c: string) => content = c"
        @id="(id: string) => testId = id" />
      <Test v-if="content === 'Test'" @content="(c: string) => content = c" :testId="testId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import ProblemSet from '../testpage/ProblemSet.vue';
import SingleProblem from '../testpage/SingleProblem.vue';
import Test from "../testpage/Test.vue";

defineComponent({
  name: "OnlineTestComponent",
  components: {
    SingleProblem,
    ProblemSet,
    Test
  }
})

const testId = ref('')
const content = ref('Menu')
function changeContent(c: string) { //改变测试页面内容
  content.value = c;
  console.log('测试页面内容:', content.value)
}
function returnUpper() { //返回测试页面上一级
  switch (content.value) {
    case 'TestRecord':
      changeContent('Menu');
      break;
    case 'SingleProblem':
      changeContent('Menu');
      break;
    case 'ProblemSet':
      changeContent('Menu');
      break;
    case 'Test':
      changeContent('ProblemSet');
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

.test-module{
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
