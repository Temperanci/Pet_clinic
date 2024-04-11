<template>
  <!-- <p>
    {{ component.name }}
  </p> -->
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="tableData.tab">
        <el-table-column prop="bedId" label="床位编号">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].bedId"></el-input>
            <span v-else>{{ scope.row.bedId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentId" label="科室编号">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].departmentId"></el-input>
            <span v-else>{{ scope.row.departmentId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].location"></el-input>
            <span v-else>{{ scope.row.location }}</span>
          </template>
        </el-table-column>
        <tableOption 
          :clear=clearPara
          :num = tabLength
          @edit-confirm="(index)=>{CRUDhandler.editRow(edited,index);}"
          @edit="(index) => { CRUDhandler.updateMsg(edited,tableData.tab,index);isSelected[index] = !isSelected[index]; clearPara=false;}" 
          @cancel="(index) =>{isSelected[index] = !isSelected[index]; clearPara=false;console.log('cancel',edited)}"
          />
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
import { updateTab, selectPage, Table, getPagination, LENGTH } from '../../scripts/paginate.ts'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen,clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery ,update} from "../../apis/bed/bed.ts"
import type { BedPageResponse,BedUpdateRequest } from "@/apis/bed/bed-interface.ts"
import { Bed } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt.ts'
const BedPage = ref<BedPageResponse>({ datas: [], total: 0, limit: 0 });
class bedRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as Bed).bedId = data[index].bedId;
    (Msg[index] as Bed).location = data[index].location;
    (Msg[index] as Bed).departmentId = data[index].departmentId;
    console.log('editedBed',Msg);
  }
  deleteRow(Msg: Object[],index:number): void {
    
  }
  editRow(Msg: Object[],index:number): void {
    var request:BedUpdateRequest = {
      bed:{
        bedId:(Msg[index] as Bed).bedId,
        location:(Msg[index] as Bed).location, 
        departmentId:(Msg[index] as Bed).departmentId,  
      },
    delete:false}
    console.log('update request',request);
    var response= update(request);
    fetchBeds();
    console.log('update response',response);
  }
  constructor(){

  }
}
var CRUDhandler = new bedRowCRUD();
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
var tabLength = LENGTH;//每页展示的条目数
const clearPara = ref(false);
var isSelected = isSelectGen(tabLength);
var edited: Ref<Bed[]> = ref<Bed[]>([]);
edited.value = EditedGen(tabLength, new Bed()) as Bed[];
var tableData: Table = new Table([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
const { ctx } = getCurrentInstance() as any;
selectPage(currentPage - 1, tableData, queryData);
function pagination(val: number) {
  currentPage = val
  updateTab(currentPage, tableData, queryData, ctx)
  isSelected=clearIsSelected(isSelected);
  clearPara.value = true;
  // TODO:clear isSelected
}
//分页
const component = defineComponent({
  name: "BedManagement"
})
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>
../../scripts/data.js../../scripts/paginate.js