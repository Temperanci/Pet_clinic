<template>
    <el-container>
      <el-header>
        <div class="h1">
          <h1>Pet Clinic 宠物医院在线导览</h1>
        </div>
        <el-card shadow="hover">
          <template #header>
            <el-text>用户名</el-text>
            <el-avatar :size="30" />
          </template>
          <el-button @click="Switch(1)">前台页面</el-button>
          <el-text>后台管理 管理/注销</el-text>
        </el-card>
      </el-header>
    </el-container>
</template>
<script setup lang="ts">
import { defineComponent,ref} from 'vue'
import type {DefineComponent} from 'vue'
defineComponent({
  name: "Background"
})
const emit = defineEmits(['switch'])
function Switch(n:number){
    emit('switch',n)
}
</script>