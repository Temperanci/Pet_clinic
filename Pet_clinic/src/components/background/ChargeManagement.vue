<template>
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
import {updateTab,selectPage,Table,getPagination} from '../../scripts/paginate.ts'
import {chargeData} from '../../scripts/data.ts'
import { TableCell } from "element-plus/es/components/table-v2/src/components/index.mjs";
import '@/assets/table.css'
var tableData:Table = new Table([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
const {ctx} = getCurrentInstance() as any;
selectPage(currentPage-1,tableData,queryData)
function pagination(val:number){
  currentPage = val
  updateTab(currentPage,tableData,queryData,ctx)
}

const component = defineComponent({
  name: "ChargeManagement"
})
const columnMap = new Map([
  ['priceId','收费编号'],
  ['type','类型'],
  ['serviceId','服务编号'],
  ['title','标题'],
  ['price','价格'],
  ['departmentId','科室编号']
])
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
../../scripts/data.js../../scripts/paginate.js