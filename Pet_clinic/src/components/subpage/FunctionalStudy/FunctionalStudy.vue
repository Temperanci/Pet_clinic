<template>
  <!-- （默认）选择学习模块: 角色扮演 病例学习 在线测试 -->
  <Test v-if="content==='StudyType'" @page="(n:string)=>content=n"/> 
  <!-- <template v-if="content==='StudyType'">
  </template> -->
  <!-- 选择测试类型: 套题 单题 -->
  <TestType v-if="content==='TestType'" @page="(n:string)=>content=n"/>
  <!-- 套题 -->
  <ProblemSet v-if="content==='ProblemSet'" @page="(n:string)=>content=n"/>
  <!-- 单题 -->
  <SingleProblem v-if="content==='SingleProblem'" @page="(n:string)=>content=n"/>
  <!-- 测试页面 -->
  <Test v-if="content==='Test'" @page="(n:string)=>content=n"/>
  
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'
import StudyType from './StudyType.vue'
import TestType from './testpage/TestType.vue';
import ProblemSet from './testpage/ProblemSet.vue';
import SingleProblem from './testpage/SingleProblem.vue';
import Test from "./testpage/Test.vue";

defineComponent({
  name: "FunctionalStudy",
  components:{
    StudyType,
    TestType
  }
})

const content=ref('StudyType')

const url = ''
</script>

<style scoped lang="scss"></style>
