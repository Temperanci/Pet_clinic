<!-- eslint-disable vue/require-v-for-key -->
<template>
  <!-- <p>
      {{ component.name }}
    </p> -->
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="loadResult()" v-loading="testRecordLoading" height="100%" empty-text="来到了没有数据的荒原...">
        <el-table-column prop="testRecordId" label="记录编号">
          <template #default="scope">
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].testRecordId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled
              v-model="edited[scope.$index].testRecordId"></el-input>
            <span v-else>{{ scope.row.testRecordId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="problemSetId" label="试卷">
          <template #header>
            <el-input v-model="searchProblemSet" placeholder="试卷"></el-input>
          </template>

          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].problemSetId"></el-input>
            <span v-else>{{ problemsetMap.get(scope.row.problemSetId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="candidateId" label="考生">
          <template #header>
            <el-input v-model="searchCandidate" placeholder="考生"></el-input>
          </template>

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
            <!-- <el-option v-for="(value, key) in personnelMap" :key="key" :label="value" :value="key" /> -->
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

          <template #header>
            <el-button type="info" size="small" @click=";">搜索</el-button>
          </template>
          <template #default="scope">
            <el-button type="warning"
              @click="testRecordDetail(scope.row.candidateId, scope.row.problemSetId, scope.row.testRecordId);">查看详情</el-button>
          </template>
        </el-table-column>
        <!-- <tableOption :clear=clearPara :num=tabLength :back=back :type=true
          @edit-confirm="(index) => { CRUDhandler.editRow(edited, index); }"
          @edit="(index) => { CRUDhandler.updateMsg(edited, queryData, index); isSelected[index] = !isSelected[index]; clearPara = false; }"
          @cancel="(index) => { isSelected[index] = !isSelected[index]; clearPara = false; unwritableBar[0] = false; searchBar[0] = false; }"
          @delete="(index) => { CRUDhandler.updateMsg(edited, queryData, index); clearPara = false; }"
          @delete-confirm="(index) => { CRUDhandler.deleteRow(edited, index); }"
          @create="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; unwritableBar[0] = true; }"
          @create-confirm="(index) => { CRUDhandler.createRow(edited[index]); unwritableBar[0] = false; }"
          @search="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; searchBar[0] = true; }"
          @search-confirm="(index) => { CRUDhandler.search(edited[index]); searchBar[0] = false; back = true; }"
          @back="fetchTestRecords(); back = false;" /> -->
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination" layout="prev, pager, next"
        :total="getPagination(entryNum, tabLength)" />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="测试记录详情" width="1450" style="text-align: left" draggable overflow
    :close-on-click-modal="false" :close-on-press-escape="false">

    <div class="testrecord-layout">
      <el-container>
        <el-container width="80%">
          <el-main>
            <el-header style="display: flex; justify-content: center;">
              <h3>{{ problemSet?.title }}</h3>
            </el-header>
            <div class="probleminfo-content">
              <el-table :data="loadCurrentList()" v-loading="problemInfoLoading" border height="450px"
                style="overflow: auto;">
                <el-table-column prop="problem.title" label="题目" width="90px" />
                <el-table-column prop="problem.content" label="内容" width="" />
                <el-table-column prop="subjectName" label="知识点" width="100px" />
                <!-- <el-table-column prop="typeName" label="题型" width="" /> -->
                <el-table-column prop="problem.answer" label="参考答案" width="200px" />
                <el-table-column prop="userAnswer" label="考生答案" width="200px" />
                <el-table-column prop="ratio" label="得分" width="90px" />
                <el-table-column prop="reason" label="评分理由" width="300px" />
              </el-table>
            </div>
          </el-main>
          <el-footer>
            <div class="probleminfo-pagination">
              <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :current-page="current" :page-size="size" :total=problemInfoList.length layout="prev, pager, next" />
            </div>
          </el-footer>
        </el-container>
        <el-aside width="20%">
          <div class="testrecord-info">
            <el-card>
              <h4>考试结果</h4>
              <p :style="{ color: testRecordInfo.userScore / testRecordInfo.totalScore < 0.6 ? 'red' : 'black' }">
                分数：{{
        testRecordInfo.userScore }} / {{ testRecordInfo.totalScore }}</p>
              <p>客观题正确数：{{ testRecordInfo.objCorrectNum }} / {{ testRecordInfo.objNum }}</p>
              <p>主观题得分率：{{ testRecordInfo.subUserScore }} / {{ testRecordInfo.subTotalScore }}</p>
              <h5>知识点掌握情况</h5>
              <div class="disease-score">
                <ul>
                  <li v-for="(score, name) in testRecordInfo.diseaseTotalScore" :key="name">
                    <p>{{ name }}：{{ testRecordInfo.diseaseUserScore[name] }} / {{ score }}</p>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
          <div class="testrecord-edit">
            <el-button type="danger" size="large" @click="confirmDelete = true;">删除</el-button>
          </div>
        </el-aside>
      </el-container>
    </div>

  </el-dialog>

  <el-dialog v-model="confirmDelete" title="确认删除测试记录？" width="400px" style="text-align: left" overflow
    :close-on-click-modal="false" :close-on-press-escape="false">
    <span>该操作无法撤销，删除后考生可重新进入测试答题</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="confirmDelete = false">取消</el-button>
        <el-button type="danger" @click="submitDelete(userTestRecord?.testRecordId ??'');">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<script setup lang="ts">
import { defineComponent } from "vue";
//分页
import { ref, watch } from 'vue'
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

import { throwMessage } from "@/scripts/display";
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
  setTimeout(() => { testRecordLoading.value = false; }, 500);

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
//搜索
const searchProblemSet = ref('');
const searchCandidate = ref('');
const searchStatus = ref('all');
function loadResult(){

  return queryData.value;
}


const userTestRecordList: Ref<TestRecordBO[]> = ref([]);
const userTestRecord: Ref<TestRecordBO | null> = ref(null);
async function fetchUserTestRecord(testRecordId: string) { //获取当前用户的测试记录
  try {
    const request: TestRecordPageRequest = {
      // candidateId: candidateId,
      // problemSetId: problemSetId
      testRecordId: testRecordId
    }
    const response = await pageQuery(request);
    if (response && response.data && response.data.datas) {
      userTestRecordList.value = response.data.datas;
      userTestRecord.value = userTestRecordList.value[0];
      // console.log('获取用户测试记录:', userTestRecord.value);
    } else {
      console.log('用户没有该测试记录！');
    }

  } catch (error) {
    console.error('获取用户测试记录失败！', error);
  }
}
const problemSet: Ref<ProblemSetBO | null> = ref(null);
async function fetchProblemSet(problemSetId: string) { //获取试卷
  try {
    const request: ProblemSetPageRequest = {
      problemSetId: problemSetId
    }
    const response = await problemSetQuery(request);
    if (response && response.data && response.data.datas) {
      problemSet.value = response.data.datas[0];
      // console.log('获取试卷:', problemSet.value);
    } else {
      console.log('试卷不存在！');
    }

  } catch (error) {
    console.error('获取试卷失败！', error);
  }
}
const testRecordInfo = ref({
  totalScore: 0, //试卷总分
  userScore: 0, //考生分数
  rank: 0, //排名
  diseaseTotalScore: {} as Record<string, number>, //病种知识点-->总分
  diseaseUserScore: {} as Record<string, number>, //病种知识点-->得分
  diseaseRatio: {} as Record<string, number>, //病种知识点-->得分率
  objNum: 0, //客观题数量
  objCorrectNum: 0, //客观题正确数
  subNum: 0, //主观题数量
  subTotalScore: 0, //主观题总分
  subUserScore: 0, //主观题得分
  subCorrectRatio: 0 //主观题得分率

})
function clearInfo() {
  problemInfoLoading.value = true;
  problemInfoList.value = [];
  testRecordInfo.value = {
    totalScore: 0,
    userScore: 0,
    rank: 0,
    diseaseTotalScore: {} as Record<string, number>,
    diseaseUserScore: {} as Record<string, number>,
    diseaseRatio: {} as Record<string, number>,
    objNum: 0,
    objCorrectNum: 0,
    subNum: 0,
    subTotalScore: 0,
    subUserScore: 0,
    subCorrectRatio: 0
  };
}
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
  ratio?: string;
  reason?: string //主观题批分理由
}
const problemInfoList = ref<ProblemInfo[]>([]);
async function fetchProblemInfo() { //获取试卷题目及答题情况
  try {
    const idList = problemSet.value?.problemIdList;
    const scoreMap = problemSet.value?.problemScoreMap;
    const answerMap = userTestRecord.value?.answerMap;
    const gradeMap = userTestRecord.value?.gradeMap;
    idList?.forEach(async (id: string) => {
      const problemRequest: ProblemPageRequest = { problemId: id };
      const problemResponse = await problemQuery(problemRequest);
      const temp = problemResponse.data.datas[0];
      const info: ProblemInfo = {
        problem: temp,
      };
      temp.content = (temp.content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1'); //单选题选项换行
      info.problem = temp;
      info.score = scoreMap?.[temp.problemId];
      info.userAnswer = answerMap?.[temp.problemId];
      info.grade = gradeMap?.[temp.problemId].scores ?? 0;
      if (info.score) {
        info.ratio = (info.grade ?? 0) + ' / ' + info.score;
      }
      // info.grade = Math.floor((gradeMap?.[temp.problemId].scores ?? 0) * (info.score ?? 0) / 10);
      info.reason = gradeMap?.[temp.problemId].reason;

      //统计题型得分情况
      if (temp.type === 'subjective') {
        info.typeName = '简答'
        // testRecordInfo.value.subNum++;
        testRecordInfo.value.subTotalScore += info.score ?? 0;
        testRecordInfo.value.subUserScore += info.grade ?? 0;
      } else {
        info.typeName = '单选'
        testRecordInfo.value.objNum++;
        if (info.userAnswer === info.problem?.answer) {
          testRecordInfo.value.objCorrectNum++;
        }
      }

      //统计病种得分情况
      info.subjectName = diseaseList.value.find(dis => dis.diseaseId === info.problem?.subjectId)?.name;
      if (info.subjectName && testRecordInfo.value.diseaseTotalScore[info.subjectName]) {
        testRecordInfo.value.diseaseTotalScore[info.subjectName] += info.score ?? 0;
      } else if (info.subjectName) {
        testRecordInfo.value.diseaseTotalScore[info.subjectName] = info.score ?? 0;
      }
      if (info.subjectName && testRecordInfo.value.diseaseUserScore[info.subjectName]) {
        testRecordInfo.value.diseaseUserScore[info.subjectName] += info.grade ?? 0;
      } else if (info.subjectName) {
        testRecordInfo.value.diseaseUserScore[info.subjectName] = info.grade ?? 0;
      }

      testRecordInfo.value.totalScore += info.score ?? 0; //计算试卷总分
      testRecordInfo.value.userScore += info.grade ?? 0; //计算用户得分

      // console.log('答题信息:', info);
      problemInfoList.value.push(info);
    })

    // setTimeout(() => {
    //   console.log('考试情况:', testRecordInfo.value);
    // }, 5000);
  } catch (error) {
    console.error('获取答题信息失败！', error);
  }
}
const diseaseList = ref<DiseaseBO[]>([]);
async function fetchDiseases() { //获取病种
  try {
    const request: DiseasePageRequest = { currPageNo: 1 };
    const response = await diseaseQuery(request);
    const pages = Math.ceil(response.data.total / response.data.limit); //总页数
    for (var i = 1; i <= pages; i++) {
      request.currPageNo = i;
      const response = await diseaseQuery(request);
      if (response && response.data && response.data.datas) {
        diseaseList.value = diseaseList.value.concat(response.data.datas);
      } else {
        console.error('没有病种数据！');
      }
    }

  } catch (error) {
    console.error('获取病种数据失败！', error);
  }
}


const dialogVisible = ref(false);
watch(dialogVisible, () => {
  clearInfo();
});
async function testRecordDetail(candidateId: string, problemSetId: string, testRecordId: string) { //查看测试记录详情
  clearInfo();
  dialogVisible.value = true;
  await fetchProblemSet(problemSetId);
  await fetchUserTestRecord(testRecordId);
  await fetchDiseases();
  setTimeout(() => {
    fetchProblemInfo();
    problemInfoLoading.value = false;
  }, 3000)
}

const confirmDelete = ref(false);
async function submitDelete(id: string) { //删除测试记录
  try {
    const request: TestRecordUpdateRequest = {
      testRecord: {
        testRecordId: id,
      },
      delete: true
    }
    var response = await update(request);
    if (response) {//更改成功
      throwMessage('delete fail');
    }
    else {
      throwMessage('delete success');
      console.log('删除测试记录成功:', response);
      setTimeout(() => { backToHome(); confirmDelete.value = false; dialogVisible.value = false; }, 100);
    }
  } catch (error) {
    console.error('Error deleting testRecord:', error);
  }
}



//加载动画
const testRecordLoading = ref(true);
const problemInfoLoading = ref(true);
// 前端分页处理
var current = ref(1);
var size = ref(10);
function handleCurrentChange(n: number) {
  current.value = n;
}
function handleSizeChange(n: number) {
  size.value = n;
}
function loadCurrentList() {
  var currentList: any[] = [];
  for (var i in problemInfoList.value) {
    var index = problemInfoList.value.indexOf(problemInfoList.value[i])
    if (index >= current.value * 10 - 10 && index < current.value * 10) {
      currentList.push(problemInfoList.value[i]);
    }
  }
  return currentList;
}
</script>

<style scoped lang="scss">
.testrecord-layout {}

.probleminfo-content {
  min-height: 400px;
  max-height: 400px;
  // padding: 10px;
  // margin: 10px 0;
}

.probleminfo-pagination {
  text-align: center;
  display: flex;
  justify-content: center;
}

.testrecord-info {
  display: flex;
  margin: 20px 10px;
  // padding: 10px 5px;
  min-height: 450px;
  max-height: 450px;
  text-align: left;
}

.testrecord-info .disease-score {
  overflow: scroll;
  min-height: 200px;
  max-height: 200px;
}

.testrecord-edit {
  display: flex;
  float: right;
  position: relative;
}
</style>
../../scripts/data.js../../scripts/paginate.js