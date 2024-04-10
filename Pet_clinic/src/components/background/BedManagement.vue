<template>
  <!-- <p>
    {{ component.name }}
  </p> -->
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="tableData.tab">
        <el-table-column  prop="bedId" label="床位编号" width="350">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index]===true" v-model="scope.row.bedId"></el-input>
            <span v-else>{{ scope.row.bedId }}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="departmentId" label="科室编号" width="350">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index]===true" v-model="scope.row.departmentId"></el-input>
            <span v-else>{{ scope.row.departmentId }}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="location" label="位置" width="350">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index]===true" v-model="scope.row.location"></el-input>
            <span v-else>{{ scope.row.location }}</span>
          </template>
        </el-table-column>
        <tableOption :num=tabLength @select="(index)=>{isSelected[index]=!isSelected[index];}"/>
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination" layout="prev, pager, next" :total="getPagination(queryData)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
//分页
import { ref, getCurrentInstance } from 'vue'
import { updateTab, selectPage, Table, getPagination,LENGTH } from '../../scripts/paginate.ts'
import { bedData } from '../../scripts/data.ts'
import '@/assets/table.css'
import tableOption from "../subComponents/tableOption.vue";
import {isSelectGen} from "../subComponents/tableOption.vue";
//request
import { onMounted } from "vue";
import {pageQuery} from "../../apis/bed/bed.ts"
import type { BedPageResponse } from "@/apis/bed/bed-interface.ts"
import type {BedBO} from "@/apis/schemas";
const BedPage = ref<BedPageResponse>({ datas: [], total: 0, limit: 0 });
async function fetchBeds() {
  try {
    const response = await pageQuery();
    if (response && response.data && response.data.datas) {
      BedPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = BedPage.value.datas;
      selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched beds:', BedPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching beds:', error);
  }
}
onMounted(() => {
  fetchBeds();  
});
//request
// import {addSelect,chageSelected} from '../../scripts/table.ts'
var tableData: Table = new Table([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
var tabLength = LENGTH;//每页展示的条目数
const { ctx } = getCurrentInstance() as any;
selectPage(currentPage - 1, tableData, queryData);
function pagination(val: number) {
  currentPage = val
  updateTab(currentPage, tableData, queryData, ctx)
  // TODO:clear isSelected
}

//分页
const columnMap = new Map([
  ['bedId', '床位编号'],
  ['departmentId', '科室编号'],
  ['location', '位置']
])
var isSelected = isSelectGen(length);
const component = defineComponent({
  name: "BedManagement"
})

</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>
../../scripts/data.js../../scripts/paginate.js