<template>
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
        <el-table-column prop="instanceId" label="病例编号">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].instanceId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].instanceId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled
              v-model="edited[scope.$index].instanceId"></el-input>
            <span v-else>{{ scope.row.instanceId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="diseaseId" label="病种">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].diseaseId"></el-input> -->
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].diseaseId"
              placeholder="Select" style="width: 100%">
              <el-option v-for="item in diseaseOptions" :key="item.value" :label="item.label" :value="item.value"
                :disabled="item.disabled" />
            </el-select>
            <span v-else>{{ diseaseMap.get(scope.row.diseaseId) }}</span>
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
            <el-input v-if="searchBar[scope.$index]" disabled></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].time"></el-input>
            <span v-else>{{ stringToDate(scope.row.time) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileUrlList" label="文件列表">
          <template #default="scope">
            <el-input v-if="searchBar[scope.$index]" disabled></el-input>
            <el-select v-else-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].fileUrlList" multiple
              collapse-tags collapse-tags-tooltip placeholder="Select" style="width: 100%">
              <el-option v-for="item in edited[scope.$index].fileOptions.value" :key="item.value" :label="item.label"
                :value="item.value" />
              <template #footer>
                <el-upload
              class="upload-demo"
              drag
              multiple
              :on-change="handleFileChange"
              :on-preview="handlePreview"
              :auto-upload="false"
              v-model:file-list="edited[scope.$index].form.videoList"
              list-type="picture">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text"><em>点击上传</em></div>
            </el-upload>
              </template>
            </el-select>
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].fileUrlList"></el-input> -->
            <span v-else>{{ tool.listToString(scope.row.fileUrlList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pictureUrlList" label="图片列表">
          <template #default="scope">
            <el-input v-if="searchBar[scope.$index]" disabled></el-input>
            <el-select v-else-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].pictureUrlList" multiple
              collapse-tags collapse-tags-tooltip placeholder="Select" style="width: 100%">
              <el-option v-for="item in edited[scope.$index].pictureOptions.value" :key="item.value" :label="item.label"
                :value="item.value" />
              <template #footer>
                <el-upload
              class="upload-demo"
              drag
              multiple
              :on-change="handleFileChange"
              :on-preview="handlePreview"
              :auto-upload="false"
              v-model:file-list="edited[scope.$index].form.fileList"
              list-type="picture">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text"><em>点击上传</em></div>
            </el-upload>
          </template>
            </el-select>
            <span v-else>{{ tool.listToString(scope.row.pictureUrlList) }}</span>
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
// TODO:正确展示list字段
import { defineComponent } from "vue";
import { ref } from 'vue'
import { getPagination, } from '../../scripts/paginate'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery, update } from "../../apis/diseaseInstance/diseaseInstance"
import { pageQuery as DiseasePageQuery } from "../../apis/disease/disease"
import type { DiseaseInstancePageRequest, DiseaseInstancePageResponse, DiseaseInstanceUpdateRequest } from "@/apis/diseaseInstance/diseaseInstance-interface.ts"
import { type DiseasePageResponse } from '@/apis/disease/disease-interface'
import { DiseaseInstance, BOTools } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'
import { throwMessage } from "@/scripts/display";
//文件上传
import type { UploadProps, UploadFile } from 'element-plus'
import { ElForm, ElMenu, ElMenuItem, ElDialog, ElMessageBox, ElMessage } from 'element-plus'
import { reactive, watch } from "vue";
import axios from "axios";
import { requestUploadLink } from "@/apis/fileStore/fileStore";
import { type DiseaseBO } from "@/apis/schemas";
//filter && view
import { pageQuery as diseasePageQuery } from "@/apis/disease/disease";
import { type DiseasePageRequest } from '@/apis/disease/disease-interface';
import { stringToDate } from '@/scripts/display'
const DiseaseInstancePage = ref<DiseaseInstancePageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
var tool: BOTools = new BOTools();//用于管理string和list之间的转化
class bedRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as DiseaseInstance).desc = data[index].desc;
    (Msg[index] as DiseaseInstance).time = data[index].time;
    (Msg[index] as DiseaseInstance).diseaseId = data[index].diseaseId;
    (Msg[index] as DiseaseInstance).instanceId = data[index].instanceId;
    (Msg[index] as DiseaseInstance).fileUrlList = data[index].fileUrlList;
    (Msg[index] as DiseaseInstance).pictureUrlList = data[index].pictureUrlList;
    (Msg[index] as DiseaseInstance).pictureOptions.value = [];
    (Msg[index] as DiseaseInstance).fileOptions.value = [];
    if (data[index].fileUrlList.length > 0) {
      for (var file in data[index].fileUrlList) {
        (Msg[index] as DiseaseInstance).fileOptions.value.push({
          label: data[index].fileUrlList[file],
          value: data[index].fileUrlList[file]
        })
      }
    }
    if (data[index].pictureUrlList.length > 0) {
      for (var pic in data[index].pictureUrlList) {
        (Msg[index] as DiseaseInstance).pictureOptions.value.push({
          label: data[index].pictureUrlList[pic],
          value: data[index].pictureUrlList[pic]
        })
      }
    }
    console.log('editedDiseaseInstance', Msg);
  }//更新buffer
  async deleteRow(Msg: Object[], index: number) {
    var request: DiseaseInstanceUpdateRequest = {
      diseaseInstance: {
        instanceId: (Msg[index] as DiseaseInstance).instanceId,
      },
      delete: true
    }
    console.log('delete request', request);
    var caseDelResponse = await update(request);
    if (caseDelResponse) {//更改成功
      throwMessage('delete fail');
    }
    else {
      throwMessage('delete success');
      setTimeout(() => { backToHome(); }, 500);
    }
    console.log('delete response', caseDelResponse);
  }//删除
  async editRow(Msg: Object[], index: number) {
    console.log('msg!!!', Msg)
    //上传文件
    if((Msg[index] as DiseaseInstance).form.fileList.length>0||(Msg[index] as DiseaseInstance).form.videoList.length>0){
      try {
          // 上传图片和视频
          const pictureUrls = await uploadFiles((Msg[index] as DiseaseInstance).form.fileList);
          const videoUrls = await uploadFiles((Msg[index] as DiseaseInstance).form.videoList);
          console.log('上传成功', pictureUrls, videoUrls, selectedCase.value?.diseaseId);
        //构造request
        for(var i=0;i<pictureUrls.length;i++){
          (Msg[index] as DiseaseInstance).pictureUrlList.push(pictureUrls[i]);
        }
        for(var j=0;j<videoUrls.length;j++){
          (Msg[index] as DiseaseInstance).fileUrlList.push(videoUrls[j]);
        }
        } catch (error) {
          console.error('提交数据失败', error);
          ElMessage.error('病例提交失败');
        };
    }   
        var request: DiseaseInstanceUpdateRequest = {
      diseaseInstance: {
        instanceId: (Msg[index] as DiseaseInstance).instanceId,
        diseaseId: (Msg[index] as DiseaseInstance).diseaseId,
        desc: (Msg[index] as DiseaseInstance).desc,
        fileUrlList: (Msg[index] as DiseaseInstance).fileUrlList,
        pictureUrlList: (Msg[index] as DiseaseInstance).pictureUrlList,
        time: Date.now()
      },
      delete: false
    }
    console.log('update request', request);
    var caseUpdateResponse = await update(request);
    if (caseUpdateResponse) {//更改成功
      throwMessage('update success');
      setTimeout(() => { backToHome(); }, 500);
    }
    else {
      throwMessage('update fail');
    }
    console.log('update response', caseUpdateResponse);
    
  }//修改
  clear(edited: DiseaseInstance) {
    edited.desc = '';
    edited.time = 0;
    edited.diseaseId = '';
    edited.instanceId = '';
    edited.fileUrlList = [];
    edited.pictureUrlList = [];
    edited.fileOptions.value = [];
    edited.pictureOptions.value = [];
    edited.form = {
      fileList: [], // 这里假设 fileList 是 File 类型的数组
      videoList: [], // 同上，videoList 是 File 类型的数组
    }
  }
  async createRow(msg: Object) {
    //上传文件
    if((msg as DiseaseInstance).form.fileList.length>0||(msg as DiseaseInstance).form.videoList.length>0){
      try {
          // 上传图片和视频
          const pictureUrls = await uploadFiles((msg as DiseaseInstance).form.fileList);
          const videoUrls = await uploadFiles((msg as DiseaseInstance).form.videoList);
          console.log('上传成功', pictureUrls, videoUrls, selectedCase.value?.diseaseId);
        //构造request
        for(var i=0;i<pictureUrls.length;i++){
          (msg as DiseaseInstance).pictureUrlList.push(pictureUrls[i]);
        }
        for(var j=0;j<videoUrls.length;j++){
          (msg as DiseaseInstance).fileUrlList.push(videoUrls[j]);
        }
        } catch (error) {
          console.error('提交数据失败', error);
          ElMessage.error('病例提交失败');
        };
    }   
    var request: DiseaseInstanceUpdateRequest = {
      diseaseInstance: {
        desc: (msg as DiseaseInstance).desc,
        diseaseId: (msg as DiseaseInstance).diseaseId,
        fileUrlList: (msg as DiseaseInstance).fileUrlList,
        pictureUrlList: (msg as DiseaseInstance).pictureUrlList,
        time: Date.now()
      },
      delete: false
    }
    console.log('create request', request);
    var caseCreateResponse = await update(request);
    if (caseCreateResponse) {//更改成功
      throwMessage('create success');
      setTimeout(() => { backToHome(); }, 500);
    }
    else {
      throwMessage('create fail');
    }
    console.log('create response', caseCreateResponse);
  }//创建
  search(msg: Object): void {
    console.log('msg', msg)
    fetchDiseaseInstances(undefined, 999, msg, true);
  }//查询
  constructor() {

  }
}
//handler
var CRUDhandler = new bedRowCRUD();
async function fetchDiseaseInstances(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = msg || {
    desc: '',
    time: 0,
    diseaseId: '',
    instanceId: '',
    fileUrlList: '',
    pictureUrlList: '',
  }
  var request: DiseaseInstancePageRequest = {
    instanceId: ((temp as DiseaseInstance).instanceId === '') ? undefined : (temp as DiseaseInstance).instanceId,
    time: ((temp as DiseaseInstance).time === 0) ? undefined : (temp as DiseaseInstance).time,
    diseaseId: ((temp as DiseaseInstance).diseaseId === '') ? undefined : (temp as DiseaseInstance).diseaseId,
    desc: undefined,
    fileUrlList: undefined,
    pictureUrlList: undefined,
    currPageNo: pageNum || 1,
    limit: pageLimit || 20
  }
  console.log('request', request);
  try {
    const response = await pageQuery(request || undefined);
    if (response && response.data && response.data.datas) {
      DiseaseInstancePage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = DiseaseInstancePage.value.datas;
      if (search || false) {
        tabLength.value = DiseaseInstancePage.value.total;
      }
      else { tabLength.value = DiseaseInstancePage.value.limit; }//保证搜索只有一页
      entryNum.value = DiseaseInstancePage.value.total;
      isSelected = isSelectGen(tabLength.value);
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
  getDiseaseInfo();
  fetchDiseaseInstances(undefined, defaultNum);
});
//paginate
const defaultNum = 10;
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<DiseaseInstance[]> = ref<DiseaseInstance[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  backToHome();
  //恢复初始值
  isSelected = clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0] = false;
  unwritableBar.value[0] = false;
}
function backToHome() {
  fetchDiseaseInstances(currentPage, defaultNum);
}
//filter && view
var diseaseOptions: Ref<any[]> = ref<any[]>([]);
let diseaseMap: Ref<Map<any, any>> = ref<Map<any, any>>(new Map());
const DiseasePage = ref<DiseasePageResponse>({ datas: [], total: 0, limit: 0 });
async function getDiseaseInfo() {
  var request: DiseasePageRequest = {
    limit: 999
  }
  try {
    var deptResponse = await diseasePageQuery(request);
    if (deptResponse && deptResponse.data && deptResponse.data.datas) {
      console.log('Fetched diseases:', deptResponse.data.datas);
      for (var i = 0; i < deptResponse.data.datas.length; i++) {
        diseaseOptions.value.push({
          value: deptResponse.data.datas[i].diseaseId,
          label: deptResponse.data.datas[i].name
        });
        diseaseMap.value.set(deptResponse.data.datas[i].diseaseId, deptResponse.data.datas[i].name);
      }
      console.log('deptMap', diseaseMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching diseases:', error);
  }
}
//分页
//文件上传
const showDialog = ref(false)
const uploadForm = ref<InstanceType<typeof ElForm>>()
const selectedCase = ref<DiseaseBO | null>(null)

// const form = reactive({
//   fileList: [], // 这里假设 fileList 是 File 类型的数组
//   videoList: [], // 同上，videoList 是 File 类型的数组
// });

// 监控 form 对象中所有属性的变化
// watch(() => form, (newForm) => {
//   console.log('Form changed:', newForm);
// }, {
//   deep: true  // 设置 deep 为 true 来侦听嵌套属性
// });

function handleFileChange(file: any) {
  console.log('File changed:', file)
}

async function uploadFiles(files: UploadFile[]) {
  const urls = [];
  for (const file of files) {
    const extension = file.name.slice(file.name.lastIndexOf(".")); // 获取扩展名，包括点
    console.log('Extension:', extension)
    const { uploadUrl, downloadUrl } = await requestUploadLink({ extension });
    await axios.put(uploadUrl, file.raw, {
      headers: { 'Content-Type': file.raw?.type }
    });
    urls.push(downloadUrl);
  }
  return urls;
}
const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}
const component = defineComponent({
  name: "CaseManagement"
})
</script>
<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>
../../scripts/data.js../../scripts/paginate.js