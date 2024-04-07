<template>
  <div class="online-test-component">
    <el-button class="back-button" @click="returnUpper" v-if="content !== 0">返回上一级</el-button>
    <!-- 在这里添加在线测试相关的内容 -->
    <div class="test-content">
      <template v-if="content === 0">
        <div class="testType">
          <el-row :gutter="80">
            <el-col :span="12">
              <el-result title="套题" sub-title="选择试卷参加测试">
                <template #icon>
                  <el-image src="url" />
                </template>
                <template #extra>
                  <el-button type="primary" @click="changeContent(2)">进入</el-button>
                </template>
              </el-result>
            </el-col>
            <el-col :span="12">
              <el-result title="单题" sub-title="按知识点筛选相关题目">
                <template #icon>
                  <el-image src="url" />
                </template>
                <template #extra>
                  <el-button type="primary" @click="changeContent(1)">进入</el-button>
                </template>
              </el-result>
            </el-col>
          </el-row>
        </div>
      </template>
      <SingleProblem v-if="content === 1" @page="(n: number) => content = n" />
      <ProblemSet v-if="content === 2" @page="(n: number) => content = n" />
      <Test v-if="content === 3" @page="(n: number) => content = n" />
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
var content = ref(0)

function changeContent(n: number) { //改变测试页面内容
  content.value = n;
  console.log('changeContent: ', content.value)
}
function returnUpper() {
  switch (content.value) {
    case 1:
      changeContent(0);
      break;
    case 2:
      changeContent(0);
      break;
    case 3:
      changeContent(2);
      break;
    default:
      changeContent(0);
  }
}

const close = defineEmits(['close'])
</script>

<style scoped>
.online-test-component {
  position: relative;
  /* 这里添加您自己的样式 */
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
}
.test-content{
  position: relative;
  top:50px;
}
</style>
