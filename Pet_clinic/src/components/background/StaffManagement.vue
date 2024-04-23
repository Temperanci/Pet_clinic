<template>
 <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
        <el-table-column prop="personnelId" label="人事ID">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].personnelId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].personnelId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].personnelId"></el-input>
            <span v-else>{{ scope.row.personnelId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].name"></el-input>
            <span v-else>{{ scope.row.name }}</span>
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
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].role" placeholder="Select" style="width: 100%">
    <el-option
      v-for="item in roleOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].role"></el-input> -->
            <span v-else>{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].status" placeholder="Select" style="width: 100%">
    <el-option
      v-for="item in statuOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].status"></el-input> -->
            <span v-else>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="密码">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].password"></el-input>
            <span v-else>{{ scope.row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="电话号码">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].phoneNumber"></el-input>
            <span v-else>{{ scope.row.phoneNumber }}</span>
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
import { pageQuery ,update} from "../../apis/personnel/personnel"
import type { PersonnelPageRequest, PersonnelPageResponse,PersonnelUpdateRequest } from "@/apis/personnel/personnel-interface.ts"
import { Personnel } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'
import { throwMessage } from "@/scripts/display";
const PersonnelPage = ref<PersonnelPageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
class personnelRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as Personnel).personnelId = data[index].personnelId;
    (Msg[index] as Personnel).role = data[index].role;
    (Msg[index] as Personnel).name = data[index].name;
    (Msg[index] as Personnel).status = data[index].status;
    (Msg[index] as Personnel).password = data[index].password;
    (Msg[index] as Personnel).phoneNumber = data[index].phoneNumber;
    (Msg[index] as Personnel).departmentId = data[index].departmentId;
    console.log('editedPersonnel',Msg);
  }//更新buffer
async  deleteRow(Msg: Object[],index:number) {
    var request:PersonnelUpdateRequest = {
      personnel:{
        personnelId:(Msg[index] as Personnel).personnelId,
        role:'', 
        departmentId:'' ,
        name:'',
        status:'',
        password:'',
        phoneNumber:'', 
      },
    delete:true}
    console.log('delete request',request);
    var personnelDelResponse=await update(request);
    if(personnelDelResponse){//更改成功
      throwMessage('delete fail');
    }
    else{
      throwMessage('delete success');
      setTimeout(()=>{backToHome();},500);
    }
    console.log('delete response',personnelDelResponse); 
  }//删除
  async editRow(Msg: Object[],index:number) {
    var request:PersonnelUpdateRequest = {
      personnel:{
        personnelId:(Msg[index] as Personnel).personnelId,
        role:(Msg[index] as Personnel).role, 
        departmentId:(Msg[index] as Personnel).departmentId,
        name:(Msg[index] as Personnel).name,
        phoneNumber:(Msg[index] as Personnel).phoneNumber,
        password:(Msg[index] as Personnel).password,
        status:(Msg[index] as Personnel).status, 
      },
    delete:false}
    console.log('update request',request);
    var personnelUpdateResponse=await update(request);
    if(personnelUpdateResponse){//更改成功
      throwMessage('update success');
      setTimeout(()=>{backToHome();},500);
    }
    else{
      throwMessage('update fail');
    }
    console.log('update response',personnelUpdateResponse);
  }//修改
  clear(edited:Personnel){
    edited.personnelId='';
    edited.departmentId='';
    edited.role='';
    edited.name='';
    edited.password='';
    edited.phoneNumber='';
    edited.status='';
  }
 async createRow(msg:Object){
    var request:PersonnelUpdateRequest = {
      personnel:{
        role:(msg as Personnel).role, 
        departmentId:(msg as Personnel).departmentId,
        status:(msg as Personnel).status, 
        name:(msg as Personnel).name, 
        password:(msg as Personnel).password, 
        phoneNumber:(msg as Personnel).phoneNumber,  
      },
    delete:false}
    console.log('create request',request);
    var personnelCreateResponse=await update(request);
    if(personnelCreateResponse){//更改成功
      throwMessage('create success');
      setTimeout(()=>{backToHome();},500);
    }
    else{
      throwMessage('create fail');
    }
    console.log('create response',personnelCreateResponse); 
  }//创建
  search(msg:Object):void{
    console.log('msg',msg)
    fetchPersonnels(undefined,999,msg,true);
  }//查询
  constructor(){

  }
}
var CRUDhandler = new personnelRowCRUD();
async function fetchPersonnels(pageNum?:number,pageLimit?:number,msg?:Object,search?:boolean) {
  var temp = msg||{
    personnelId:'',
    role:'',
    departmentId:'',
    name:'',
    password:'',
    phoneNumber:'',
    status:''
  }
  var request:PersonnelPageRequest= {
    personnelId:((temp as Personnel).personnelId==='')?undefined:(temp as Personnel).personnelId,
    role:((temp as Personnel).role==='')?undefined:(temp as Personnel).role, 
    departmentId:((temp as Personnel).departmentId==='')?undefined:(temp as Personnel).departmentId,
    name:((temp as Personnel).name==='')?undefined:(temp as Personnel).name,
    status:((temp as Personnel).status==='')?undefined:(temp as Personnel).status,
    password:((temp as Personnel).password==='')?undefined:(temp as Personnel).password,
    phoneNumber:((temp as Personnel).phoneNumber==='')?undefined:(temp as Personnel).phoneNumber,
    currPageNo:pageNum||1,
    limit:pageLimit||20
  }
  console.log('request',request);
  try {
    const response = await pageQuery(request||undefined);
    if (response && response.data && response.data.datas) {
      PersonnelPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = PersonnelPage.value.datas;
      if(search||false){
        tabLength.value = PersonnelPage.value.total;
      }
      else{tabLength.value = PersonnelPage.value.limit;}//保证搜索只有一页
      entryNum.value = PersonnelPage.value.total;
      isSelected=isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Personnel()) as Personnel[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched personnels:', PersonnelPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching personnels:', error);
  }
}
onMounted(() => {
  getDeptInfo();
  fetchPersonnels(undefined,defaultNum);
});
//paginate
const defaultNum =10;
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected:Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Personnel[]> = ref<Personnel[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  if(!back.value){
    backToHome();
  }
  //恢复初始值
  isSelected=clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0]=false;
  unwritableBar.value[0]=false;
}
function backToHome(){
  fetchPersonnels(currentPage,defaultNum);
}
//filter && view
import { pageQuery as deptPageQuery } from "@/apis/department/department";
import { type DepartmentPageRequest } from '@/apis/department/department-interface';
const deptOptions: Ref<any[]> = ref<any[]>([])
  const deptMap:Ref<Map<any,any>> = ref<Map<any,any>>(new Map());
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
const roleOptions = [
  {
    label:'医助',
    value:'医助'
  },
  {
    label:'管理员',
    value:'管理员'
  },
  {
    label:'前台',
    value:'前台'
  },
  {
    label:'医师',
    value:'医师'
  },
  {
    label:'游客',
    value:'游客'
  },
]
const statuOptions = [
  {
    label:'banned',
    value:'banned'
  },
  {
    label:'normal',
    value:'normal'
  }
]
const component = defineComponent({
  name: "StaffManagement"
})

</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
