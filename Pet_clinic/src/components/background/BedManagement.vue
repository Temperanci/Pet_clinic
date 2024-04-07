<template>
  <!-- <p>
    {{ component.name }}
  </p> -->
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;">
      <el-table class="table" :data="tableData.tab">
        <el-table-column v-for="column in columnMap" :prop="column[0]" :label="column[1]"/>
    </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination"  layout="prev, pager, next" :total="getPagination(queryData)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref ,getCurrentInstance} from 'vue'
//分页
import {updateTab,selectPage,Table,getPagination} from './paginate.ts'
import {bedData} from './data.ts'
import { TableCell } from "element-plus/es/components/table-v2/src/components/index.mjs";
var tableData:Table = new Table([]);
var queryData = bedData;
var currentPage = 1;
const {ctx} = getCurrentInstance() as any;
selectPage(currentPage-1,tableData,queryData)
function pagination(val:number){
  currentPage = val
  updateTab(currentPage,tableData,queryData,ctx)
}
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
.pagination-block{
  margin: auto;
}
.table {
  width: 98%;
  height:auto;
  margin-top:1%;
  margin-left:1%;
  margin-right:1;
  margin-bottom:1%;
  overflow:hidden;
}
</style>
