<template>
<div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%">
        <el-table-column prop="instanceId" label="病例编号" empty-text="来到了没有数据的荒原...">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].instanceId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].instanceId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].instanceId"></el-input>
            <span v-else>{{ scope.row.instanceId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="diseaseId" label="病种">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].diseaseId"></el-input> -->
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].diseaseId" placeholder="Select" style="width: 100%">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
            <span v-else>{{ options.filter((t)=>{if(t.value===scope.row.diseaseId) return t})[0].label }}</span>
            <!-- 通过病种id显示病种 -->
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].desc"></el-input>
            <span v-else>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].time"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].time"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].time"></el-input>
            <span v-else>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileUrlList" label="文件列表">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].fileUrlList"></el-input>
            <span v-else>{{ tool.listToString(scope.row.fileUrlList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pictureUrlList" label="图片列表">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].pictureUrlList"></el-input>
            <span v-else>{{ tool.listToString(scope.row.pictureUrlList) }}</span>
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
          @back="backToHome();back=false;"
          />
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination" layout="prev, pager, next" :total="getPagination(entryNum,tabLength)" />
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO:正确展示list字段
import { defineComponent } from "vue";
import { ref } from 'vue'
import { getPagination,} from '../../scripts/paginate.ts'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen,clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery ,update} from "../../apis/diseaseInstance/diseaseInstance.ts"
import {pageQuery as DiseasePageQuery} from "../../apis/disease/disease.ts"
import type { DiseaseInstancePageRequest, DiseaseInstancePageResponse,DiseaseInstanceUpdateRequest } from "@/apis/diseaseInstance/diseaseInstance-interface.ts"
import {type DiseasePageResponse} from '@/apis/disease/disease-interface'
import { DiseaseInstance,BOTools } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt.ts'
const DiseaseInstancePage = ref<DiseaseInstancePageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
var tool:BOTools = new BOTools();//用于管理string和list之间的转化
class bedRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as DiseaseInstance).desc = data[index].desc;
    (Msg[index] as DiseaseInstance).time = data[index].time;
    (Msg[index] as DiseaseInstance).diseaseId = data[index].diseaseId;
    (Msg[index] as DiseaseInstance).instanceId = data[index].instanceId;
    (Msg[index] as DiseaseInstance).fileUrlList = tool.listToString(data[index].fileUrlList);
    (Msg[index] as DiseaseInstance).pictureUrlList = tool.listToString(data[index].pictureUrlList);
    console.log('editedDiseaseInstance',Msg);
  }//更新buffer
  deleteRow(Msg: Object[],index:number): void {
    var request:DiseaseInstanceUpdateRequest = {
      diseaseInstance:{
        instanceId:(Msg[index] as DiseaseInstance).instanceId,  
      },
    delete:true}
    console.log('delete request',request);
    var response= update(request);
    setTimeout(()=>{backToHome();},500);
    console.log('delete response',response); 
  }//删除
  editRow(Msg: Object[],index:number): void {
    console.log('msg!!!',Msg)
    var request:DiseaseInstanceUpdateRequest = {
      diseaseInstance:{
        instanceId:(Msg[index] as DiseaseInstance).instanceId, 
        diseaseId:(Msg[index] as DiseaseInstance).diseaseId,
        desc: (Msg[index] as DiseaseInstance).desc,
        fileUrlList: tool.stringToList((Msg[index] as DiseaseInstance).fileUrlList),
        pictureUrlList:tool.stringToList((Msg[index] as DiseaseInstance).pictureUrlList),
        time:Date.now()
      },
    delete:false}
    console.log('update request',request);
    var response= update(request);
    setTimeout(()=>{backToHome();},500);
    console.log('update response',response);
  }//修改
  clear(edited:DiseaseInstance){
    edited.desc='';
    edited.time=0;
    edited.diseaseId='';
    edited.instanceId='';
    edited.fileUrlList='';
    edited.pictureUrlList='';
  }
  createRow(msg:Object):void{
    var request:DiseaseInstanceUpdateRequest = {
      diseaseInstance:{
        desc:(msg as DiseaseInstance).desc, 
        diseaseId:(msg as DiseaseInstance).diseaseId,
        fileUrlList:tool.stringToList((msg as DiseaseInstance).fileUrlList),
        pictureUrlList:tool.stringToList((msg as DiseaseInstance).pictureUrlList),
        time:Date.now() 
      },
    delete:false}
    console.log('create request',request);
    var response= update(request);
    setTimeout(()=>{backToHome();},500);
    console.log('create response',response); 
  }//创建
  search(msg:Object):void{
    console.log('msg',msg)
    fetchDiseaseInstances(undefined,999,msg,true);
  }//查询
  constructor(){

  }
}
//handler
var CRUDhandler = new bedRowCRUD();
async function fetchDiseaseInstances(pageNum?:number,pageLimit?:number,msg?:Object,search?:boolean) {
  var temp = msg||{
    desc:'',
    time:0,
    diseaseId:'',
    instanceId:'',
    fileUrlList:'',
    pictureUrlList:'',
  }
  var request:DiseaseInstancePageRequest= {
    instanceId:((temp as DiseaseInstance).instanceId==='')?undefined:(temp as DiseaseInstance).instanceId,
    time:((temp as DiseaseInstance).time===0)?undefined:(temp as DiseaseInstance).time, 
    diseaseId:((temp as DiseaseInstance).diseaseId==='')?undefined:(temp as DiseaseInstance).diseaseId,
    desc:undefined,
    fileUrlList:undefined,
    pictureUrlList:undefined,
    currPageNo:pageNum||1,
    limit:pageLimit||20
  }
  console.log('request',request);
  try {
    const response = await pageQuery(request||undefined);
    if (response && response.data && response.data.datas) {
      DiseaseInstancePage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = DiseaseInstancePage.value.datas;
      if(search||false){
        tabLength.value = DiseaseInstancePage.value.total;
      }
      else{tabLength.value = DiseaseInstancePage.value.limit;}//保证搜索只有一页
      entryNum.value = DiseaseInstancePage.value.total;
      isSelected=isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new DiseaseInstance()) as DiseaseInstance[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched beds:', DiseaseInstancePage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching beds:', error);
  }
}
onMounted(() => {
  getSelection();
  fetchDiseaseInstances(undefined,defaultNum);
});
//paginate
const defaultNum = 10;
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected:Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<DiseaseInstance[]> = ref<DiseaseInstance[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  backToHome();
  //恢复初始值
  isSelected=clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0]=false;
  unwritableBar.value[0]=false;
}
function backToHome(){
  fetchDiseaseInstances(currentPage,defaultNum);
}
//分页
const component = defineComponent({
  name: "CaseManagement"
})
async function getSelection(){
  try {
    const response =  await DiseasePageQuery();
    if (response && response.data && response.data.datas) {
      DiseasePage.value = response.data; // 假设响应中有data属性，且包含datas数组
      console.log('Fetched beds:', DiseasePage.value.datas);
      for(var i =0;i<DiseasePage.value.datas.length;i++){
        options.value.push({value:DiseasePage.value.datas[i].diseaseId,
          label:DiseasePage.value.datas[i].name});
      }
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching beds:', error);
  }
}

</script>
<script lang="ts">
var options:Ref<any[]> = ref<any[]>([]);
const DiseasePage = ref<DiseasePageResponse>({ datas: [], total: 0, limit: 0 });
</script>
<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
../../scripts/data.js../../scripts/paginate.js