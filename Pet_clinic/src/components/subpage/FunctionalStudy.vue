<template>
  <!-- 效果测试 -->
  <!-- <Test @page="(n:string)=>content=n"/> -->



  <!-- （默认）选择学习模块: 角色扮演 病例学习 在线测试 -->
  <template v-if="content === 'StudyType'">
    <el-row :gutter="80">
      <el-col :span="8">
        <el-result title="角色扮演" sub-title="前台/医助/医师三种角色">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary" @click="">进入</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :span="8">
        <el-result title="病例学习" sub-title="学习病种和病例知识">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary" @click="">进入</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :span="8">
        <el-result title="在线测试" sub-title="选择套题或单题进行测试">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary" @click="changeContent('TestType')">进入</el-button>
          </template>
        </el-result>
      </el-col>
    </el-row>
  </template>
  <!-- 选择测试类型: 套题 单题 -->
  <TestType v-if="content === 'TestType'" @page="(n: string) => content = n" />
  <!-- 套题 -->
  <ProblemSet v-if="content === 'ProblemSet'" @page="(n: string) => content = n" />
  <!-- 单题 -->
  <SingleProblem v-if="content === 'SingleProblem'" @page="(n: string) => content = n" />
  <!-- 测试页面 -->
  <Test v-if="content === 'Test'" @page="(n: string) => content = n" />

</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'
import TestType from '../testpage/TestType.vue';
import ProblemSet from '../testpage/ProblemSet.vue';
import SingleProblem from '../testpage/SingleProblem.vue';
import Test from "../testpage/Test.vue";

defineComponent({
  name: "FunctionalStudy",
  components: {
    TestType,
    ProblemSet,
    Test
  }
})

var content = ref('StudyType')

function changeContent(n:string){
  content.value=n;
  console.log('changeContent: ',content.value)
}

const url = ''
</script>

<style scoped lang="scss"></style>
