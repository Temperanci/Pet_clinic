<template>
  <div class="testrecord-layout">
    <el-container>
      <el-container width="80%">
        <el-header style="display: flex; justify-content: center;">
          <h3>{{ problemSet?.title }}</h3>
          <!-- {{ new Date(userTestRecord?.submitTime??0) }} -->
        </el-header>
        <el-main>
          <div class="probleminfo-content">
            <el-table :data="loadCurrentList()" border height="490px" style="overflow: auto;">
              <el-table-column prop="problem.title" label="题目" width="90px" />
              <el-table-column prop="problem.content" label="内容" width="" />
              <el-table-column prop="subjectName" label="知识点" width="100px" />
              <!-- <el-table-column prop="typeName" label="题型" width="" /> -->
              <el-table-column prop="problem.answer" label="参考答案" width="200px" />
              <el-table-column prop="userAnswer" label="考生答案" width="200px" />
              <el-table-column prop="ratio" label="得分" width="90px" />
              <el-table-column prop="reason" label="评分理由" width="300px" />

              <!-- <el-table-column label="" width="100px">
            <template #default="scope">
              <el-button size="small" @click="console.log()">查看详情</el-button>
            </template>
</el-table-column> -->
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
            <p :style="{ color: testRecordDetails.userScore / testRecordDetails.totalScore < 0.6 ? 'red' : 'black' }">
              分数：{{
            testRecordDetails.userScore }} / {{ testRecordDetails.totalScore }}</p>
            <p>客观题正确数：{{ testRecordDetails.objCorrectNum }} / {{ testRecordDetails.objNum }}</p>
            <p>主观题得分率：{{ testRecordDetails.subUserScore }} / {{ testRecordDetails.subTotalScore }}</p>
            <h5>知识点掌握情况</h5>
            <div class="disease-score">
              <ul>
                <li v-for="(score, name) in testRecordDetails.diseaseTotalScore" :key="name">
                  <p>{{ name }}：{{ testRecordDetails.diseaseUserScore[name] }} / {{ score }}</p>
                </li>
              </ul>
            </div>
          </el-card>
        </div>
      </el-aside>
    </el-container>
  </div>

</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue';
import type { Ref } from "vue";
import { pageQuery as testRecordQuery } from '@/apis/testRecord/testRecord';
import { pageQuery as problemSetQuery } from '@/apis/problemSet/problemSet';
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { pageQuery as diseaseQuery } from '@/apis/disease/disease';
import type { TestRecordPageRequest, TestRecordPageResponse } from '@/apis/testRecord/testRecord-interface';
import type { ProblemSetPageRequest, ProblemSetPageResponse } from '@/apis/problemSet/problemSet-interface';
import type { ProblemPageRequest, ProblemPageResponse } from '@/apis/problem/problem-interface';
import type { DiseasePageRequest, DiseasePageResponse } from '@/apis/disease/disease-interface';
import type { TestRecordBO, ProblemSetBO, ProblemBO, DiseaseBO } from '@/apis/schemas';
import { Personnel, TestRecord, ProblemSet, Problem, Disease } from "@/apis/class";
import { store } from '@/main'
import { StorageToken } from '@/scripts/storage'

defineComponent({
  name: "TestRecord",
})
const emit = defineEmits(['content']);
const props = defineProps({
  testId: String
});
const userInfo = ref(store.state.token);
const userTestRecordList: Ref<TestRecordBO[]> = ref([]);
const userTestRecord: Ref<TestRecordBO | null> = ref(null);
async function fetchUserTestRecord() { //获取当前用户的测试记录
  try {
    const request: TestRecordPageRequest = {
      candidateId: userInfo.value.personnelId,
      problemSetId: props.testId
    }
    const response = await testRecordQuery(request);
    if (response && response.data && response.data.datas) {
      userTestRecordList.value = response.data.datas;
      userTestRecord.value = userTestRecordList.value[0];
      console.log('获取用户测试记录:', userTestRecord.value);
    } else {
      console.log('用户没有该测试记录！');
    }

  } catch (error) {
    console.error('获取用户测试记录失败！', error);
  }
}
const problemSet: Ref<ProblemSetBO | null> = ref(null);
async function fetchProblemSet() { //获取试卷
  try {
    const request: ProblemSetPageRequest = {
      problemSetId: props.testId
    }
    const response = await problemSetQuery(request);
    if (response && response.data && response.data.datas) {
      problemSet.value = response.data.datas[0];
      console.log('获取试卷:', problemSet.value);
    } else {
      console.log('试卷不存在！');
    }

  } catch (error) {
    console.error('获取试卷失败！', error);
  }
}

const testRecordDetails = ref({
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
      // info.grade = gradeMap?.[temp.problemId].scores ?? 0;
      info.grade = Math.floor((gradeMap?.[temp.problemId].scores ?? 0) * (info.score ?? 0) / 10); //分数换算
      info.reason = gradeMap?.[temp.problemId].reason;
      if (info.score) {
        info.ratio = (info.grade ?? 0) + ' / ' + info.score;
      }

      //统计题型得分情况
      if (temp.type === 'subjective') {
        info.typeName = '简答'
        testRecordDetails.value.subNum++;
        testRecordDetails.value.subTotalScore += info.score ?? 0;
        testRecordDetails.value.subUserScore += info.grade ?? 0;
      } else {
        info.typeName = '单选'
        testRecordDetails.value.objNum++;
        if (info.userAnswer === info.problem?.answer) {
          testRecordDetails.value.objCorrectNum++;
        }
      }

      //统计病种得分情况
      info.subjectName = diseaseList.value.find(dis => dis.diseaseId === info.problem?.subjectId)?.name;
      if (info.subjectName && testRecordDetails.value.diseaseTotalScore[info.subjectName]) {
        testRecordDetails.value.diseaseTotalScore[info.subjectName] += info.score ?? 0;
      } else if (info.subjectName) {
        testRecordDetails.value.diseaseTotalScore[info.subjectName] = info.score ?? 0;
      }
      if (info.subjectName && testRecordDetails.value.diseaseUserScore[info.subjectName]) {
        testRecordDetails.value.diseaseUserScore[info.subjectName] += info.grade ?? 0;
      } else if (info.subjectName) {
        testRecordDetails.value.diseaseUserScore[info.subjectName] = info.grade ?? 0;
      }

      testRecordDetails.value.totalScore += info.score ?? 0; //计算试卷总分
      testRecordDetails.value.userScore += info.grade ?? 0; //计算用户得分

      // console.log('答题信息:', info);
      problemInfoList.value.push(info);
    })

    // setTimeout(() => {
    //   console.log('考试情况:', testRecordDetails.value);
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
onMounted(async () => {
  await fetchProblemSet();
  await fetchUserTestRecord();
  await fetchDiseases();
  setTimeout(() => {
    fetchProblemInfo();
  }, 200)
});





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
  min-height: 500px;
  max-height: 500px;
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
  margin: 50px 10px;
  // padding: 10px 5px;
  min-height: 450px;
  max-height: 450px;
}

.testrecord-info .disease-score {
  overflow: scroll;
  min-height: 200px;
  max-height: 200px;
}
</style>