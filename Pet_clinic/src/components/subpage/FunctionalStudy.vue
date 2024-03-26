<template>
  <el-row :gutter="80">
    <el-col :span="8">
      <el-result title="角色扮演" sub-title="可选前台、医助、医师三种角色">
        <template #icon>
          <el-image src="url" />
        </template>
        <template #extra>
          <el-button type="primary">进入</el-button>
        </template>
      </el-result>
    </el-col>
    <el-col :span="8">
      <el-result title="病例学习" sub-title="目录查找学习病种知识">
        <template #icon>
          <el-image src="url" />
        </template>
        <template #extra>
          <el-button type="primary">进入</el-button>
        </template>
      </el-result>
    </el-col>
    <el-col :span="8">
      <el-result title="在线测试" sub-title="选择套题或单题进行测试">
        <template #icon>
          <el-image src="url" />
        </template>
        <template #extra>
          <el-button type="primary">进入</el-button>
        </template>
      </el-result>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";

defineComponent({
  name: "FunctionalStudy"
})
const fits = ['fill']
const url =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
</script>

<style scoped lang="scss"></style>
