<template>
    <!-- <div>
        用户名:{{ loadUserInfo().value.name }}<br>
        用户id:{{ loadUserInfo().value.personnelId }}
    </div> -->
    <el-container>
        <el-main>
            <div class="problemset-content">
                <el-table :data="queryData" border>
                    <!-- <el-table-column prop="problemSetId" label="id" width="" /> -->
                    <el-table-column prop="problemSetId" label="考试名" width="" />
                    <el-table-column prop="submitTime" label="提交时间" width="" />
                    <el-table-column prop="graded" label="分数" width="" />
                    <el-table-column label="" width="100px">
                        <template #default="scope">
                            <el-button size="small"
                                @click="console.log()">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
        <el-footer>
            <div class="problemset-pagination">
                <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                    :current-page="current" :page-size="size" :total=queryData.length
                    layout="prev, pager, next, jumper" />
            </div>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue';
import type { Ref } from "vue";
import { pageQuery } from '@/apis/testRecord/testRecord';
import { pageQuery as problemsetPageQuery } from '@/apis/problem/problem';
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { pageQuery as diseaseQuery } from '@/apis/disease/disease';
import type { TestRecordPageRequest, TestRecordPageResponse } from '@/apis/testRecord/testRecord-interface';
import type { ProblemSetPageRequest, ProblemSetPageResponse } from '@/apis/problemSet/problemSet-interface';
import type { ProblemPageRequest, ProblemPageResponse } from '@/apis/problem/problem-interface';
import type { DiseasePageRequest, DiseasePageResponse } from '@/apis/disease/disease-interface';
import type { TestRecordBO, ProblemSetBO, ProblemBO, DiseaseBO } from '@/apis/schemas';
import { Personnel, TestRecord, ProblemSet, Problem, Disease } from "@/apis/class";
import {store} from '@/main'
import {StorageToken} from '@/scripts/storage'

defineComponent({
    name: "TestRecord",
})
const userInfo = ref(store.state.token);

var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
var queryData = ref<any[]>([]);
var currentPage = 1;

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
const TestRecordPage = ref<TestRecordPageResponse>({ datas: [], total: 0, limit: 0 });
async function fetchTestRecords(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = {
    testRecordId: '',
    problemSetId: '',
    candidateId: userInfo.value.personnelId,
    answerMap: {},
    gradeMap: {},
    submitTime: new Date()
  }
  var request: TestRecordPageRequest = {
    testRecordId: ((temp as TestRecord).testRecordId === '') ? undefined : (temp as TestRecord).testRecordId,
    problemSetId: ((temp as TestRecord).problemSetId === '') ? undefined : (temp as TestRecord).problemSetId,
    candidateId: ((temp as TestRecord).candidateId === '') ? undefined : (temp as TestRecord).candidateId,

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
        console.log('提交时间:',rec.submitTime);
        if (rec.submitTime) {
          var time = new Date(rec.submitTime);
          rec.submitTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
        }
        console.log(queryData);
        // if (time) {
        //   time = time.toString().slice(0, 10) + " " + time.toString().slice(11, 16);
        // }
      }
      if (search || false) {
        tabLength.value = TestRecordPage.value.total;
      }
      else { tabLength.value = TestRecordPage.value.limit; }//保证搜索只有一页
      entryNum.value = TestRecordPage.value.total;
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
  getProblemsetInfo();
  fetchTestRecords();
});
function handleTestRecordList(){

}
function loadCurrentList() {
    var currentList: any[] = [];
    for (var i in queryData.value) {
        var index = queryData.value.indexOf(queryData.value[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            currentList.push(queryData.value[i]);
        }
    }
    return currentList;
}




function loadUserInfo(){
    const userInfo = ref(store.state.token);
    console.log(userInfo);
    return userInfo;
}
const problemList = ref<ProblemBO[]>([]);
const diseaseList = ref<DiseaseBO[]>([]);
// async function fetchProblems() {
//     try {
//         const request: ProblemPageRequest = { currPageNo: 1 };
//         const response = await problemQuery(request);
//         const pages = Math.ceil(response.data.total / response.data.limit); //总页数
//         console.log("total=", response.data.total, " limit=", response.data.limit);
//         for (var i = 1; i <= pages; i++) {
//             request.currPageNo = i;
//             const response = await problemQuery(request);
//             if (response && response.data && response.data.datas) {
//                 for (var j in response.data.datas) { //单选题内容换行
//                     response.data.datas[j].content = (response.data.datas[j].content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1');
//                 }
//                 problemList.value = problemList.value.concat(response.data.datas);
//             } else {
//                 console.error('No data returned from the API');
//             }
//         }
//         console.log("获取problemList:", problemList.value);
//         setTimeout(() => {
//             // resultList.value = JSON.parse(JSON.stringify(problemList.value));
//             // for (var pro of resultList.value) {
//             //     pro.subjectName = diseaseList.value.find(dis => dis.diseaseId === pro.subjectId)?.name;
//             //     if (pro.type === 'subjective') {
//             //         pro.typeName = '简答';
//             //     } else if (pro.type === 'objective') {
//             //         pro.typeName = '单选';
//             //     }
//             // }
//         }, 50);

//     } catch (error) {
//         console.error('Error fetching problems:', error);
//     }
// }
// async function fetchDiseases() {
//     try {
//         const request: DiseasePageRequest = { currPageNo: 1 };
//         const response = await diseaseQuery(request);
//         const pages = Math.ceil(response.data.total / response.data.limit); //总页数
//         console.log("total=", response.data.total, " limit=", response.data.limit);
//         for (var i = 1; i <= pages; i++) {
//             request.currPageNo = i;
//             const response = await diseaseQuery(request);
//             if (response && response.data && response.data.datas) {
//                 diseaseList.value = diseaseList.value.concat(response.data.datas);
//             } else {
//                 console.error('No data returned from the API');
//             }
//         }

//     } catch (error) {
//         console.error('Error fetching diseases:', error);
//     }
// }



// 前端分页处理
var current = ref(1);
var size = ref(10);
function handleCurrentChange(n: number) {
    current.value = n;
}
function handleSizeChange(n: number) {
    size.value = n;
}

</script>

<style scoped lang="scss">

</style>