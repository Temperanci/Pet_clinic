<template class="StudyType">
  <el-row :gutter="80">
      <el-col :span="8">
        <el-result title="角色扮演" sub-title="前台/医助/医师三种角色">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary" @click="selectStudyType('')">进入</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :span="8">
        <el-result title="病例学习" sub-title="学习病种和病例知识">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary" @click="selectStudyType('')">进入</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :span="8">
        <el-result title="在线测试" sub-title="选择套题或单题进行测试">
          <template #icon>
            <el-image src="url" />
          </template>
          <template #extra>
            <el-button type="primary" @click="selectStudyType('TestType')">进入</el-button>
          </template>
        </el-result>
      </el-col>
  </el-row>
</template>
  
  <script setup lang="ts">
  import { defineComponent } from "vue";
  
  defineComponent({
    name: "StudyType",
  })
  const emit = defineEmits(['page'])
  function selectStudyType(n:string){
    emit('page',n)
  }

  const url = ''
  </script>
  
  <style scoped lang="scss"></style>
  