<template>
  <div class="online-test-component">
    <el-button class="back-button" @click="close">返回</el-button>
    <!-- 在这里添加在线测试相关的内容 -->
  </div>
</template>

<script setup lang="ts">
import {defineComponent} from "vue";

defineComponent({
  name: "OnlineTestComponent"
})

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
</style>
