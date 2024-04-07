<template>
<div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;">
      <el-table class="table" :data="tableData.tab">
        <el-table-column v-for="column in columnMap" :prop="column[0]" :label="column[1]"/>
    </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination style="margin-top: 5%;" @current-change="pagination"  layout="prev, pager, next" :total="getPagination(queryData)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
//分页
import { ref ,getCurrentInstance} from 'vue'
import {updateTab,selectPage,Table,getPagination} from '../../scripts/paginate.ts'
import {caseData} from '../../scripts/data.ts'
import { TableCell } from "element-plus/es/components/table-v2/src/components/index.mjs";
import '@/assets/table.css'
var tableData:Table = new Table([]);
var queryData = caseData;
var currentPage = 1;
const {ctx} = getCurrentInstance() as any;
selectPage(currentPage-1,tableData,queryData)
function pagination(val:number){
  currentPage = val
  updateTab(currentPage,tableData,queryData,ctx)
}
//分页
const columnMap = new Map([
  ['instanceId','病例编号'],
  ['diseaseId','病种编号'],
  ['time','时间'],
  ['pictureUrlList','图片列表'],
  ['fileUrlList','文件列表']
])
const component = defineComponent({
  name: "CaseManagement"
})

</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
../../scripts/data.js../../scripts/paginate.js