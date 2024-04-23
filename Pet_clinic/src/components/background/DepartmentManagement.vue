<template>
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
        <el-table-column prop="departmentId" label="科室编号">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].departmentId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].departmentId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled
              v-model="edited[scope.$index].departmentId"></el-input>
            <span v-else>{{ ColumnDisplay(scope.row.departmentId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="科室名">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].name"></el-input>
            <span v-else>{{ ColumnDisplay(scope.row.name) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].location"></el-input>
            <span v-else>{{ ColumnDisplay(scope.row.location) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].desc"></el-input>
            <span v-else>{{ ColumnDisplay(scope.row.desc) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="picture" label="图片">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].picture"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" disabled></el-input>
            <el-select v-else-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].picture"
              placeholder="Select" style="width: 100%">
              <el-option v-for="item in edited[scope.$index].picOptions.value" :key="item.value" :label="item.label"
                :value="item.value" />
              <template #footer>
                <el-button type="primary" text bg size="small" @click="selectFile">
                  添加图片
                </el-button>
                <input type="file" ref="fileInput" style="display: none;" @change="loadFile(scope.$index);" accept="image/*">
              </template>
            </el-select>
            <span v-else>{{ ColumnDisplay(scope.row.picture) }}</span>
          </template>
        </el-table-column>
        <tableOption :clear=clearPara :num=tabLength :back=back
          @edit-confirm="(index) => { CRUDhandler.editRow(edited, index); }"
          @edit="(index) => { CRUDhandler.updateMsg(edited, queryData, index); isSelected[index] = !isSelected[index]; clearPara = false; }"
          @cancel="(index) => { isSelected[index] = !isSelected[index]; clearPara = false; unwritableBar[0] = false; searchBar[0] = false; }"
          @delete="(index) => { CRUDhandler.updateMsg(edited, queryData, index); clearPara = false; }"
          @delete-confirm="(index) => { CRUDhandler.deleteRow(edited, index); }"
          @create="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; unwritableBar[0] = true; }"
          @create-confirm="(index) => { CRUDhandler.createRow(edited[index]); unwritableBar[0] = false; }"
          @search="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; searchBar[0] = true; }"
          @search-confirm="(index) => { CRUDhandler.search(edited[index]); searchBar[0] = false; back = true; }"
          @back="backToHome(); back = false;" />
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination" layout="prev, pager, next"
        :total="getPagination(entryNum, tabLength)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'
import { getPagination, LENGTH } from '../../scripts/paginate'
import '@/assets/table.css'
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery, update,upload as deptUpload } from "../../apis/department/department"
import type { DepartmentPageRequest, DepartmentPageResponse, DepartmentUpdateRequest, DepartmentUploadRequest } from "@/apis/department/department-interface.ts"
import { Department } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'
import { throwMessage } from "@/scripts/display";
const DepartmentPage = ref<DepartmentPageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
class departmentRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as Department).departmentId = data[index].departmentId;
    (Msg[index] as Department).location = data[index].location;
    (Msg[index] as Department).name = data[index].name;
    (Msg[index] as Department).desc = data[index].desc;
    (Msg[index] as Department).picture = data[index].picture;
    (Msg[index] as Department).picOptions.value = [];
    if (data[index].picture !== '') {
      (Msg[index] as Department).picOptions.value.push({
        label: data[index].picture,
        value: data[index].picture
      });
      (Msg[index] as Department).uploadFile.append(data[index].picture,'');
    }
    (Msg[index] as Department).picOptions.value.push({
      label: "无",
      value: ''
    });
    
    //console.log('updateMsg.Msg', Msg[index])
    //console.log('updateMsg.data', data[index])
    //console.log('editedDepartment', Msg);
  }//更新buffer
  async deleteRow(Msg: Object[], index: number) {
    var request: DepartmentUpdateRequest = {
      department: {
        departmentId: (Msg[index] as Department).departmentId,
        location: '',
        name: '',
        picture: '',
        desc: ''
      },
      delete: true
    }
    //console.log('delete request', request);
    var deptDelResponse =await update(request);
    if(deptDelResponse){//更改成功
      throwMessage('delete fail');
    }
    else{
      throwMessage('delete success');
      setTimeout(()=>{backToHome();},500);
    }
    //console.log('delete response', response);
  }//删除
 async  editRow(Msg: Object[], index: number) {
    var request: DepartmentUpdateRequest = {
      department: {
        departmentId: (Msg[index] as Department).departmentId,
        location: (Msg[index] as Department).location,
        name: (Msg[index] as Department).name,
        desc: (Msg[index] as Department).desc,
        picture: (Msg[index] as Department).picture,
      },
      delete: false
    }
    //console.log('update request', request);
    let deptUpdateResponse =await update(request);
    if(deptUpdateResponse){//更改成功
      throwMessage('update success');
      setTimeout(()=>{backToHome();},500);
    }
    else{
      throwMessage('update fail');
    }
    if((Msg[index] as Department).uploadFile.has((Msg[index] as Department).picture)){
      let uploadResponse = deptUpload({formdata:(Msg[index] as Department).uploadFile});
      console.log('dept.editRow.uploadResponse',uploadResponse);
    }
    //console.log('update response', response);
  }//修改
  clear(edited: Department) {
    edited.departmentId = '';
    edited.name = '';
    edited.location = '';
    edited.picture = '';
    edited.desc = '';
    edited.picOptions.value = []
  }
async  createRow(msg: Object) {
    var request: DepartmentUpdateRequest = {
      department: {
        location: (msg as Department).location,
        name: (msg as Department).name,
        desc: (msg as Department).desc,
        picture: (msg as Department).picture,
      },
      delete: false
    }
    //console.log('create request', request);
    var deptCreateResponse =await update(request);
    if(deptCreateResponse){//更改成功
      throwMessage('create success');
      setTimeout(()=>{backToHome();},500);
    }
    else{
      throwMessage('create fail');
    }
    //console.log('create response', response);
  }//创建
  search(msg: Object): void {
    //console.log('msg', msg)
    fetchDepartments(undefined, 999, msg, true);
  }//查询
  constructor() {

  }
}
var CRUDhandler = new departmentRowCRUD();
async function fetchDepartments(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = msg || {
    departmentId: '',
    location: '',
    name: '',
    desc: '',
    picture: ''
  }
  var request: DepartmentPageRequest = {
    departmentId: ((temp as Department).departmentId === '') ? undefined : (temp as Department).departmentId,
    location: ((temp as Department).location === '') ? undefined : (temp as Department).location,
    name: ((temp as Department).name === '') ? undefined : (temp as Department).name,
    desc: ((temp as Department).desc === '') ? undefined : (temp as Department).desc,
    picture: ((temp as Department).picture === '') ? undefined : (temp as Department).picture,
    currPageNo: pageNum || 1,
    limit: pageLimit || 20
  }
  //console.log('request', request);
  try {
    const response = await pageQuery(request || undefined);
    if (response && response.data && response.data.datas) {
      DepartmentPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = DepartmentPage.value.datas;
      if (search || false) {
        tabLength.value = DepartmentPage.value.total;
      }
      else { tabLength.value = DepartmentPage.value.limit; }//保证搜索只有一页
      entryNum.value = DepartmentPage.value.total;
      isSelected = isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Department()) as Department[];
      // selectPage(currentPage - 1, tableData, queryData);
      //console.log('Fetched departments:', DepartmentPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
}
onMounted(() => {
  backToHome();
});
//paginate
const defaultNum = 10;
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Department[]> = ref<Department[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  if(val!=1){
    backToHome();
  }
  //恢复初始值
  isSelected = clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0] = false;
  unwritableBar.value[0] = false;
}
function backToHome() {
  fetchDepartments(currentPage, defaultNum);
}
//分页
//filter && display
import { ColumnDisplay } from '@/scripts/display'
//upload
const fileInput=ref<any>(null);
function selectFile(){
  fileInput.value.click();
}
const url = '/departments/'
function loadFile(index:any){
  if(validateFileType(fileInput.value.files[0].name)){
    (edited.value[index] as Department).uploadFile.append(fileInput.value.files[0].name,fileInput.value.files[0]);
    // (edited.value[index] as Department).uploadFile.append((edited.value[index] as Department).picOptions.value[0].label,'');  
    (edited.value[index] as Department).picOptions.value=[
      {
        label:url+fileInput.value.files[0].name,
        value:url+fileInput.value.files[0].name
      }
    ]
    console.log('loadFile.uploadFile',(edited.value[index] as Department).uploadFile.get(fileInput.value.files[0].name));
  }
  else{
    // 错误提示
    console.log('loadFile.error',"wrong type");
  }
  console.log('loadFile.file[0].name',fileInput.value.files[0].name)
  console.log('loadFile.file[0]',fileInput.value.files[0]);
}
function validateFileType(name:string) {
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = name.split('.').pop().toLowerCase();
  return allowedExtensions.includes(fileExtension)
}
const component = defineComponent({
  name: "DepartmentManagement"
})
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>