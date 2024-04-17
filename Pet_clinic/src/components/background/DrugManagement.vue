<template>
<div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
        <el-table-column prop="drugId" label="药品编号">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].drugId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].drugId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].drugId"></el-input>
            <span v-else>{{ scope.row.drugId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="药品名称">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].name"></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="药品类型">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].type"></el-input>
            <span v-else>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].desc"></el-input>
            <span v-else>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="diseaseIdList" label="适用疾病">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].diseaseIdList"></el-input> -->
            <el-select v-if="isSelected[scope.$index] === true"
      v-model="edited[scope.$index].diseaseIdList"
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="Select"
      style="width: 100%"
    >
      <el-option
        v-for="item in diseaseOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
            <span v-else>{{ tool.listToString(tool.batchMap(diseaseMap, scope.row.diseaseIdList)) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentId" label="科室">
          <template #default="scope">
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].departmentId" placeholder="Select" style="width: 100%">
    <el-option
      v-for="item in deptOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
            <span v-else>{{ deptMap.get(scope.row.departmentId) }}</span>
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
import { defineComponent } from "vue";
import { ref } from 'vue'
import { getPagination, LENGTH } from '../../scripts/paginate'
import '@/assets/table.css'
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen,clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery as drugPageQuery,update} from "../../apis/drug/drug"
import type { DrugPageRequest, DrugPageResponse,DrugUpdateRequest } from "@/apis/drug/drug-interface.ts"
import { BOTools, Drug } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'
const DrugPage = ref<DrugPageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
//handler
var tool:BOTools=new BOTools();
class drugRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as Drug).drugId = data[index].drugId;
    (Msg[index] as Drug).name = data[index].name;
    (Msg[index] as Drug).departmentId = data[index].departmentId;
    (Msg[index] as Drug).desc = data[index].desc;
    (Msg[index] as Drug).type = data[index].type;
    (Msg[index] as Drug).diseaseIdList = data[index].diseaseIdList;
    console.log('editedDrug',Msg);
  }//更新buffer
  deleteRow(Msg: Object[],index:number): void {
    var request:DrugUpdateRequest = {
      drug:{
        drugId:(Msg[index] as Drug).drugId,
        name:'', 
        departmentId:'',
        type:'',
        desc:'',
        diseaseIdList:[]
      },
    delete:true}
    console.log('delete request',request);
    var response= update(request);
    setTimeout(()=>{backToHome()},500);
    console.log('delete response',response); 
  }//删除
  editRow(Msg: Object[],index:number): void {
    var request:DrugUpdateRequest = {
      drug:{
        drugId:(Msg[index] as Drug).drugId,
        name:(Msg[index] as Drug).name, 
        departmentId:(Msg[index] as Drug).departmentId,
        type:(Msg[index] as Drug).type, 
        desc:(Msg[index] as Drug).desc, 
        diseaseIdList:((Msg[index] as Drug).diseaseIdList===null)?[]:(Msg[index] as Drug).diseaseIdList  
      },
    delete:false}
    console.log('update request',request);
    var response= update(request);
    setTimeout(()=>{backToHome();},500);
    console.log('update response',response);
  }//修改
  clear(edited:Drug){
    edited.drugId='';
    edited.departmentId='';
    edited.name='';
    edited.type='';
    edited.desc='';
    edited.diseaseIdList=[];
  }
  createRow(msg:Object):void{
    var request:DrugUpdateRequest = {
      drug:{
        name:(msg as Drug).name, 
        departmentId:(msg as Drug).departmentId,
        type:(msg as Drug).type, 
        desc:(msg as Drug).desc, 
        diseaseIdList:((msg as Drug).diseaseIdList===null)?[]:(msg as Drug).diseaseIdList,  
      },
    delete:false}
    console.log('create request',request);
    var response= update(request);
    setTimeout(()=>{backToHome();},500);
    console.log('create response',response); 
  }//创建
  search(msg:Object):void{
    console.log('msg',msg)
    fetchDrugs(undefined,999,msg,true);
  }//查询
  constructor(){

  }
}
var CRUDhandler = new drugRowCRUD();
async function fetchDrugs(pageNum?:number,pageLimit?:number,msg?:Object,search?:boolean) {
  var temp = msg||{
    drugId:'',
    name:'',
    departmentId:'',
    type:'',
    desc:'',
    diseaseId:''
  }
  var request:DrugPageRequest= {
    drugId:((temp as Drug).drugId==='')?undefined:(temp as Drug).drugId,
    name:((temp as Drug).name==='')?undefined:(temp as Drug).name, 
    type:((temp as Drug).type==='')?undefined:(temp as Drug).type,
    desc:((temp as Drug).desc==='')?undefined:(temp as Drug).desc,
    departmentId:((temp as Drug).departmentId==='')?undefined:(temp as Drug).departmentId,
    currPageNo:pageNum||1,
    limit:pageLimit||20
  }
  console.log('request',request);
  try {
    const response = await drugPageQuery(request||undefined);
    if (response && response.data && response.data.datas) {
      DrugPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = DrugPage.value.datas;
      if(search||false){
        tabLength.value = DrugPage.value.total;
      }
      else{tabLength.value = DrugPage.value.limit;}//保证搜索只有一页
      entryNum.value = DrugPage.value.total;
      isSelected=isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Drug()) as Drug[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched drugs:', DrugPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching drugs:', error);
  }
}
onMounted(() => {
  getDeptInfo();
  getDiseaseInfo();
  fetchDrugs(currentPage,defaultNum);
});
//paginate
var defaultNum = 10;//默认条件下进行查询返回的条目数
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected:Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Drug[]> = ref<Drug[]>([]);
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
  fetchDrugs(currentPage,defaultNum);
}
//filter && view
import { pageQuery as deptPageQuery } from "@/apis/department/department";
import { type DepartmentPageRequest } from '@/apis/department/department-interface';
import { pageQuery as diseasePageQuery } from "@/apis/disease/disease";
import { type DiseasePageRequest } from '@/apis/disease/disease-interface';
const deptOptions: Ref<any[]> = ref<any[]>([])
const deptMap:Ref<Map<any,any>> = ref<Map<any,any>>(new Map());
const diseaseMap:Ref<Map<any,any>> = ref<Map<any,any>>(new Map());
const diseaseOptions: Ref<any[]> = ref<any[]>([])
async function getDiseaseInfo() {
  var request: DiseasePageRequest = {
    limit: 999
  }
  try {
    var diseaseResponse = await diseasePageQuery(request);
    if (diseaseResponse && diseaseResponse.data && diseaseResponse.data.datas) {
      console.log('Fetched diseases:', diseaseResponse.data.datas);
      for (var i = 0; i < diseaseResponse.data.datas.length; i++) {
        diseaseOptions.value.push({
          value: diseaseResponse.data.datas[i].diseaseId,
          label: diseaseResponse.data.datas[i].name
        })
        diseaseMap.value.set(diseaseResponse.data.datas[i].diseaseId, diseaseResponse.data.datas[i].name);
      }
      console.log('diseaseMap', diseaseMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching departments:', error);
  }
}
async function getDeptInfo() {
  var request: DepartmentPageRequest = {
    limit: 999
  }
  try {
    var deptResponse = await deptPageQuery(request);
    if (deptResponse && deptResponse.data && deptResponse.data.datas) {
      console.log('Fetched departments:', deptResponse.data.datas);
      for (var i = 0; i < deptResponse.data.datas.length; i++) {
        deptOptions.value.push({
          value: deptResponse.data.datas[i].departmentId,
          label: deptResponse.data.datas[i].name
        });
        deptMap.value.set(deptResponse.data.datas[i].departmentId, deptResponse.data.datas[i].name);
      }
      console.log('deptMap', deptMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching departments:', error);
  }
}
const component = defineComponent({
  name: "DrugManagement"
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
