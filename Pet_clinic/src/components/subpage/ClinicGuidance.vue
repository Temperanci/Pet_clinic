<template>
  <div class="demo-image">
    <div v-for="fit in fits" :key="fit" class="block">
      <el-image :src="url" :fit="fit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineComponent} from "vue";

defineComponent({
  name: "ClinicGuidance"
})
const fits = ['contain']
const url =
    'src/image/clinic-layout.png'
</script>

<style scoped lang="scss">
.el-image{
  width: 700px;
  height: 700px;
}
.demo-image{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
