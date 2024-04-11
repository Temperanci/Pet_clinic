<template>
  <!-- <p>
    {{ component.name }}
  </p> -->
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%">
        <el-table-column prop="bedId" label="床位编号">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].bedId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].bedId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[0].bedId"></el-input>
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
          :back = back
          @edit-confirm="(index)=>{CRUDhandler.editRow(edited,index);}"
          @edit="(index) => { CRUDhandler.updateMsg(edited,queryData,index);isSelected[index] = !isSelected[index]; clearPara=false;}" 
          @cancel="(index) =>{isSelected[index] = !isSelected[index]; clearPara=false;unwritableBar[0]=false;searchBar[0]=false;}"
          @delete="(index) =>{CRUDhandler.updateMsg(edited,queryData,index);clearPara=false;}"
          @delete-confirm="(index)=>{CRUDhandler.deleteRow(edited,index);}"
          @create="(index)=>{CRUDhandler.clear(edited[index]);isSelected[index] = true;clearPara=false;unwritableBar[0]=true;}"
          @create-confirm="(index)=>{CRUDhandler.createRow(edited[index]);unwritableBar[0]=false;}"
          @search="(index)=>{CRUDhandler.clear(edited[index]);isSelected[index] = true;clearPara=false;searchBar[0]=true;}"
          @search-confirm="(index)=>{CRUDhandler.search(edited[index]);searchBar[0]=false;back=true;}"
          @back="fetchBeds();back=false;"
          />
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination" layout="prev, pager, next" :total="getPagination(entryNum,tabLength)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
//分页
import { ref } from 'vue'
import { getPagination, LENGTH } from '../../scripts/paginate.ts'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen,clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery ,update} from "../../apis/bed/bed.ts"
import type { BedPageRequest, BedPageResponse,BedUpdateRequest } from "@/apis/bed/bed-interface.ts"
import { Bed } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt.ts'
const BedPage = ref<BedPageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
class bedRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as Bed).bedId = data[index].bedId;
    (Msg[index] as Bed).location = data[index].location;
    (Msg[index] as Bed).departmentId = data[index].departmentId;
    console.log('editedBed',Msg);
  }//更新buffer
  deleteRow(Msg: Object[],index:number): void {
    var request:BedUpdateRequest = {
      bed:{
        bedId:(Msg[index] as Bed).bedId,
        location:'', 
        departmentId:''  
      },
    delete:true}
    console.log('delete request',request);
    var response= update(request);
    setTimeout(()=>{fetchBeds();},500);
    console.log('delete response',response); 
  }//删除
  editRow(Msg: Object[],index:number): void {
    var request:BedUpdateRequest = {
      bed:{
        bedId:(Msg[index] as Bed).bedId,
        location:(Msg[index] as Bed).location, 
        departmentId:(Msg[index] as Bed).departmentId 
      },
    delete:false}
    console.log('update request',request);
    var response= update(request);
    setTimeout(()=>{fetchBeds();},500);
    console.log('update response',response);
  }//修改
  clear(edited:Bed){
    edited.bedId='';
    edited.departmentId='';
    edited.location='';
  }
  createRow(msg:Object):void{
    var request:BedUpdateRequest = {
      bed:{
        location:(msg as Bed).location, 
        departmentId:(msg as Bed).departmentId 
      },
    delete:false}
    console.log('create request',request);
    var response= update(request);
    setTimeout(()=>{fetchBeds();},500);
    console.log('create response',response); 
  }//创建
  search(msg:Object):void{
    console.log('msg',msg)
    fetchBeds(undefined,999,msg,true);
  }//查询
  constructor(){

  }
}
var CRUDhandler = new bedRowCRUD();
async function fetchBeds(pageNum?:number,pageLimit?:number,msg?:Object,search?:boolean) {
  var temp = msg||{
    bedId:'',
    location:'',
    departmentId:''
  }
  var request:BedPageRequest= {
    bedId:((temp as Bed).bedId==='')?undefined:(temp as Bed).bedId,
    location:((temp as Bed).location==='')?undefined:(temp as Bed).location, 
    departmentId:((temp as Bed).departmentId==='')?undefined:(temp as Bed).departmentId,
    currPageNo:pageNum||1,
    limit:pageLimit||20
  }
  console.log('request',request);
  try {
    const response = await pageQuery(request||undefined);
    if (response && response.data && response.data.datas) {
      BedPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = BedPage.value.datas;
      if(search||false){
        tabLength.value = BedPage.value.total;
      }
      else{tabLength.value = BedPage.value.limit;}//保证搜索只有一页
      entryNum.value = BedPage.value.total;
      isSelected=isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Bed()) as Bed[];
      // selectPage(currentPage - 1, tableData, queryData);
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
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected:Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Bed[]> = ref<Bed[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  fetchBeds(currentPage);
  //恢复初始值
  isSelected=clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0]=false;
  unwritableBar.value[0]=false;
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