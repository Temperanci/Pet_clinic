<template>
  <div v-if="modelValue" class="overlay">
    <el-button type="primary" size="large" class="overlay-back" @click="closeOverlay">返回主页</el-button>
    <div class="overlay-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">

const { modelValue } = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const closeOverlay = () => {
  emit('update:modelValue', false) // 当点击返回按钮时，更新 modelValue 为 false
}
</script>

<style scoped lang="scss">
.overlay{
  background-color: #fcf7f4;
}
</style>
