<template>
<p>
  {{ component.name }}
</p>
<!-- <el-table class="table" :data="tableData" style="width: 100%">
        <el-table-column v-for="column in columnMap" :prop="column[0]" :label="column[1]" />
  </el-table> -->
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

const component = defineComponent({
  name: "CreateTest"
})
const tableData = ref('')
const columnMap = new Map([
  ['instanceId','病例编号'],
  ['diseaseId','病种编号'],
  ['time','时间'],
  ['pictureUrlList','图片列表'],
  ['fileUrlList','文件列表']
])
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
