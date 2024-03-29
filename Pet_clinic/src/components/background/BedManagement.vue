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
const tableData = ref('')
const columnMap = new Map([
  ['bedId','床位编号'],
  ['departmentId','科室编号'],
  ['location','位置']
])

const component = defineComponent({
  name: "BedManagement"
})

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
