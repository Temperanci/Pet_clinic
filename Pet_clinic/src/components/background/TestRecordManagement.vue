<!-- eslint-disable vue/require-v-for-key -->
<template>
  <!-- <p>
      {{ component.name }}
    </p> -->
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
        <el-table-column prop="testRecordId" label="记录编号">
          <template #default="scope">
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].testRecordId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled
              v-model="edited[scope.$index].testRecordId"></el-input>
            <span v-else>{{ scope.row.testRecordId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="problemSetId" label="试卷">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].problemSetId"></el-input>
            <span v-else>{{ problemsetMap.get(scope.row.problemSetId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="candidateId" label="考生">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].candidateId"></el-input>
            <span v-else>{{ personnelMap.get(scope.row.candidateId) }}</span> -->
            <el-input v-if="searchBar[scope.$index]"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled
              v-model="edited[scope.$index].candidateId"></el-input>
            <span v-else>{{ personnelMap.get(scope.row.candidateId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="graded" label="批卷情况">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].graded"></el-input> -->
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].graded"
              placeholder="Select" style="width: 100%">
              <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ gradeMap.get(scope.row.graded) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="submitTime" label="提交时间">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].submitTime"></el-input>
            <span v-else>{{ scope.row.submitTime }}</span> -->
            <el-input v-if="searchBar[scope.$index]" disabled></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled
              v-model="edited[scope.$index].submitTime"></el-input>
            <span v-else>{{ scope.row.submitTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="" label="" width="150px">
          <!-- <template #header>
            <el-button type="" @click=";">搜索</el-button>
          </template> -->
          <template #default="scope">
            <el-button type="warning" @click="recordDetail(scope.row.testRecordId);">查看详情</el-button>
          </template>
        </el-table-column>

        <tableOption :clear=clearPara :num=tabLength :back=back :type=true
          @edit-confirm="(index) => { CRUDhandler.editRow(edited, index); }"
          @edit="(index) => { CRUDhandler.updateMsg(edited, queryData, index); isSelected[index] = !isSelected[index]; clearPara = false; }"
          @cancel="(index) => { isSelected[index] = !isSelected[index]; clearPara = false; unwritableBar[0] = false; searchBar[0] = false; }"
          @delete="(index) => { CRUDhandler.updateMsg(edited, queryData, index); clearPara = false; }"
          @delete-confirm="(index) => { CRUDhandler.deleteRow(edited, index); }"
          @create="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; unwritableBar[0] = true; }"
          @create-confirm="(index) => { CRUDhandler.createRow(edited[index]); unwritableBar[0] = false; }"
          @search="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; searchBar[0] = true; }"
          @search-confirm="(index) => { CRUDhandler.search(edited[index]); searchBar[0] = false; back = true; }"
          @back="fetchTestRecords(); back = false;" />
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination" layout="prev, pager, next"
        :total="getPagination(entryNum, tabLength)" />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="测试记录详情" width="900" draggable overflow :close-on-click-modal="false"
    :close-on-press-escape="false">
    
  </el-dialog>


</template>

<script setup lang="ts">
import { defineComponent } from "vue";
//分页
import { ref } from 'vue'
import { getPagination, LENGTH } from '../../scripts/paginate'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery, update } from "../../apis/testRecord/testRecord"
import { pageQuery as problemSetQuery } from '@/apis/problemSet/problemSet';
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { pageQuery as diseaseQuery } from '@/apis/disease/disease';
import type { TestRecordPageRequest, TestRecordPageResponse, TestRecordUpdateRequest } from '@/apis/testRecord/testRecord-interface';
import type { ProblemSetPageRequest, ProblemSetPageResponse } from '@/apis/problemSet/problemSet-interface';
import type { ProblemPageRequest, ProblemPageResponse } from '@/apis/problem/problem-interface';
import type { DiseasePageRequest, DiseasePageResponse } from '@/apis/disease/disease-interface';
import type { TestRecordBO, ProblemSetBO, ProblemBO, DiseaseBO } from '@/apis/schemas';
import { Personnel, TestRecord, ProblemSet, Problem, Disease } from "@/apis/class";

import { type rowCRUD } from '../../scripts/tableOpt'
import type { PersonnelPageRequest } from "@/apis/personnel/personnel-interface";
const TestRecordPage = ref<TestRecordPageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
class testRecordRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as TestRecord).testRecordId = data[index].testRecordId;
    (Msg[index] as TestRecord).problemSetId = data[index].problemSetId;
    (Msg[index] as TestRecord).candidateId = data[index].candidateId;
    (Msg[index] as TestRecord).answerMap = data[index].answerMap;
    (Msg[index] as TestRecord).gradeMap = data[index].gradeMap;
    // (Msg[index] as TestRecord).startTime = data[index].startTime;
    (Msg[index] as TestRecord).submitTime = data[index].submitTime;
    (Msg[index] as TestRecord).graded = data[index].graded;
    // console.log('editedTestRecord', Msg);
  }//更新buffer
  deleteRow(Msg: Object[], index: number): void {
    var request: TestRecordUpdateRequest = {
      testRecord: {
        testRecordId: (Msg[index] as TestRecord).testRecordId,
        problemSetId: '',
        candidateId: '',
        answerMap: {},
        gradeMap: {},
        // startTime: new Date(),
        submitTime: new Date(),
        graded: false
      },
      delete: true
    }
    // console.log('delete request', request);
    var response = update(request);
    setTimeout(() => { fetchTestRecords(); }, 500);
    // console.log('delete response', response);
  }//删除
  editRow(Msg: Object[], index: number): void {
    var request: TestRecordUpdateRequest = {
      testRecord: {
        testRecordId: (Msg[index] as TestRecord).testRecordId,
        problemSetId: (Msg[index] as TestRecord).problemSetId,
        candidateId: (Msg[index] as TestRecord).candidateId,
        answerMap: (Msg[index] as TestRecord).answerMap,
        gradeMap: (Msg[index] as TestRecord).gradeMap,
        // startTime: (Msg[index] as TestRecord).startTime,
        submitTime: (Msg[index] as TestRecord).submitTime,
        graded: (Msg[index] as TestRecord).graded
      },
      delete: false
    }
    // console.log('update request', request);
    var response = update(request);
    setTimeout(() => { fetchTestRecords(); }, 500);
    // console.log('update response', response);
  }//修改
  clear(edited: TestRecord) {
    edited.testRecordId = '';
    edited.problemSetId = '';
    edited.candidateId = '';
    edited.answerMap = {};
    edited.gradeMap = {};
    // edited.startTime = new Date();
    edited.submitTime = new Date();
    edited.graded = false
  }
  createRow(msg: Object): void {
    var request: TestRecordUpdateRequest = {
      testRecord: {
        problemSetId: (msg as TestRecord).problemSetId,
        candidateId: (msg as TestRecord).candidateId,
        answerMap: (msg as TestRecord).answerMap,
        gradeMap: (msg as TestRecord).gradeMap,
        // startTime: (msg as TestRecord).startTime,
        submitTime: (msg as TestRecord).submitTime,
        graded: (msg as TestRecord).graded
      },
      delete: false
    }
    // console.log('create request', request);
    var response = update(request);
    setTimeout(() => { fetchTestRecords(); }, 500);
    // console.log('create response', response);
  }//创建
  search(msg: Object): void {
    // console.log('msg', msg)
    fetchTestRecords(undefined, 999, msg, true);
  }//查询
  constructor() {

  }
}
var CRUDhandler = new testRecordRowCRUD();
async function fetchTestRecords(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = msg || {
    testRecordId: '',
    problemSetId: '',
    candidateId: '',
    answerMap: {},
    gradeMap: {},
    // startTime: new Date(),
    submitTime: new Date()
  }
  var request: TestRecordPageRequest = {
    testRecordId: ((temp as TestRecord).testRecordId === '') ? undefined : (temp as TestRecord).testRecordId,
    problemSetId: ((temp as TestRecord).problemSetId === '') ? undefined : (temp as TestRecord).problemSetId,
    candidateId: ((temp as TestRecord).candidateId === '') ? undefined : (temp as TestRecord).candidateId,
    // graded: ((temp as TestRecord).graded) ? undefined : (temp as TestRecord).graded

    currPageNo: pageNum || 1,
    limit: pageLimit || 20
  }
  console.log('request', request);
  try {
    const response = await pageQuery(request || undefined);
    if (response && response.data && response.data.datas) {
      TestRecordPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = TestRecordPage.value.datas;

      for (var rec of queryData.value) { //处理时间显示格式
        console.log('提交时间:', rec.submitTime);
        if (rec.submitTime) {
          var time = new Date(rec.submitTime);
          rec.submitTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
        }

        // if (time) {
        //   time = time.toString().slice(0, 10) + " " + time.toString().slice(11, 16);
        // }
      }

      if (search || false) {
        tabLength.value = TestRecordPage.value.total;
      }
      else { tabLength.value = TestRecordPage.value.limit; }//保证搜索只有一页
      entryNum.value = TestRecordPage.value.total;
      // eslint-disable-next-line vue/no-ref-as-operand
      isSelected = isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new TestRecord()) as TestRecord[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched testRecords:', TestRecordPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching testRecords:', error);
  }
}
onMounted(() => {
  getPersonnelInfo();
  getProblemsetInfo();
  fetchTestRecords();
});
//request
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<TestRecord[]> = ref<TestRecord[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function backToHome() {
  fetchTestRecords(currentPage);
}
function pagination(val: number) {
  currentPage = val
  backToHome();
  //恢复初始值
  // eslint-disable-next-line vue/no-ref-as-operand
  isSelected = clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0] = false;
  unwritableBar.value[0] = false;
}
//分页
//filter && view
import { pageQuery as personnelPageQuery } from "@/apis/personnel/personnel";
import { pageQuery as problemsetPageQuery } from "@/apis/problemSet/problemSet";
// import type { ProblemSetPageRequest } from "@/apis/problemSet/problemSet-interface";
const problemsetMap: Ref<Map<any, any>> = ref<Map<any, any>>(new Map());
async function getProblemsetInfo() {
  var request: ProblemSetPageRequest = {
    limit: 999
  }
  try {
    var problemsetResponse = await problemsetPageQuery(request);
    if (problemsetResponse && problemsetResponse.data && problemsetResponse.data.datas) {
      console.log('Fetched personnels:', problemsetResponse.data.datas);
      for (var i = 0; i < problemsetResponse.data.datas.length; i++) {
        problemsetMap.value.set(problemsetResponse.data.datas[i].problemSetId, problemsetResponse.data.datas[i].title);
      }
      console.log('problemsetMap', problemsetMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching problemsets:', error);
  }
}
const personnelMap: Ref<Map<any, any>> = ref<Map<any, any>>(new Map());
async function getPersonnelInfo() {
  var request: PersonnelPageRequest = {
    limit: 999
  }
  try {
    var personnelResponse = await personnelPageQuery(request);
    if (personnelResponse && personnelResponse.data && personnelResponse.data.datas) {
      console.log('Fetched personnels:', personnelResponse.data.datas);
      for (var i = 0; i < personnelResponse.data.datas.length; i++) {
        personnelMap.value.set(personnelResponse.data.datas[i].personnelId, personnelResponse.data.datas[i].name);
      }
      console.log('personnelMap', personnelMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching personnels:', error);
  }
}
const gradeOptions = [
  {
    label: "已完成",
    value: true
  },
  {
    label: "未完成",
    value: false
  }
]
const gradeMap = new Map([
  [false, '未完成'],
  [true, "已完成"]
])
const component = defineComponent({
  name: "TestRecordManagement"
})
interface ProblemInfo {
  problem?: ProblemBO;
  // problemId?: string;
  // title?: string;
  // type?: string;
  // subjectId?: string; 
  // content?: string;
  // answer?: string; //参考答案
  // background?: string;
  // gradingPoints?: string;
  typeName?: string; //题型
  subjectName?: string; //病种知识点
  score?: number //题目分值
  userAnswer?: string; //考生答案
  grade?: number; //考生得分
  reason?: string //主观题批分理由
}

const currentRecordId = ref('');
const dialogVisible = ref(false);
function recordDetail(id: string) {

  dialogVisible.value = true;
}



</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>
../../scripts/data.js../../scripts/paginate.js