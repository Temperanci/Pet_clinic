<template>
    <el-row :gutter="60">
      <el-col :span="12">
        <el-result title="套题" sub-title="选择试卷参加测试">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary" @click="selectTestType('ProblemSet')">进入</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :span="12">
        <el-result title="单题" sub-title="按知识点筛选相关题目">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary"  @click="selectTestType('SingleProblem')">进入</el-button>
          </template>
        </el-result>
      </el-col>
    </el-row>
  </template>
  
  <script setup lang="ts">
  import { defineComponent } from "vue";
  
  defineComponent({
    name: "TestType"
  })
  const emit = defineEmits(['page'])
  function selectTestType(n:string){
    emit('page',n)
  }


  const url =''
  </script>
  
  <style scoped lang="scss"></style>
  