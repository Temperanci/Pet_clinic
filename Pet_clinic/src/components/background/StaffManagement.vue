<template>
<p>
  {{ component.name }}
</p>
<el-table class="table" :data="tableData">
        <el-table-column v-for="column in columnMap" :prop="column[0]" :label="column[1]" />
  </el-table>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

const component = defineComponent({
  name: "StaffManagement"
})
const tableData = ref('')
const columnMap = new Map([
  ['personnelId','个人编号'],
  ['status','职位'],
  ['role','角色'],
  ['phoneNumber','电话'],
  ['departmentId','科室编号']
])
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
.table {
  width: 98%;
  margin: auto;
}
</style>
