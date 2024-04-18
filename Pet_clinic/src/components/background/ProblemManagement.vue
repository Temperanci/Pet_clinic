<template>
  <!-- <p>
      {{ component.name }}
    </p> -->
  <div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%">
        <el-table-column prop="problemId" label="题目编号">
          <template #default="scope">
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].problemId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled
              v-model="edited[scope.$index].problemId"></el-input>
            <span v-else>{{ scope.row.problemId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].title"></el-input>
            <span v-else>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="题型">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].type"></el-input>
            <span v-else>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" >
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].content"></el-input>
            <span v-else>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="answer" label="答案" width="200px">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].answer"></el-input>
            <span v-else>{{ scope.row.answer }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gradingPoints" label="得分点">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].gradingPoints"></el-input>
            <span v-else>{{ scope.row.gradingPoints }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subjectId" label="病种知识点">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].subjectId"></el-input>
            <span v-else>{{ scope.row.subjectId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="background" label="出题背景">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].background"></el-input>
            <span v-else>{{ scope.row.background }}</span>
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
          @back="fetchProblems(); back = false;" />
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
//分页
import { ref } from 'vue'
import { getPagination, LENGTH } from '../../scripts/paginate'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery, update } from "../../apis/problem/problem"
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from "@/apis/problem/problem-interface"
import { Problem } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'
const ProblemPage = ref<ProblemPageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
class problemRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as Problem).problemId = data[index].problemId;
    (Msg[index] as Problem).title = data[index].title;
    (Msg[index] as Problem).type = data[index].type;
    (Msg[index] as Problem).content = data[index].content;
    (Msg[index] as Problem).answer = data[index].answer;
    (Msg[index] as Problem).gradingPoints = data[index].gradingPoints;
    (Msg[index] as Problem).subjectId = data[index].subjectId;
    (Msg[index] as Problem).background = data[index].background;
    console.log('editedProblem', Msg);
  }//更新buffer
  deleteRow(Msg: Object[], index: number): void {
    var request: ProblemUpdateRequest = {
      problem: {
        problemId: (Msg[index] as Problem).problemId,
        title: '',
        type: '',
        content: '',
        answer: '',
        gradingPoints: '',
        subjectId: '',
        background: ''
      },
      delete: true
    }
    console.log('delete request', request);
    var response = update(request);
    setTimeout(() => { fetchProblems(); }, 500);
    console.log('delete response', response);
  }//删除
  editRow(Msg: Object[], index: number): void {
    var request: ProblemUpdateRequest = {
      problem: {
        problemId: (Msg[index] as Problem).problemId,
        title: (Msg[index] as Problem).title,
        type: (Msg[index] as Problem).type,
        content: (Msg[index] as Problem).content,
        answer: (Msg[index] as Problem).answer,
        gradingPoints: (Msg[index] as Problem).gradingPoints,
        subjectId: (Msg[index] as Problem).subjectId,
        background: (Msg[index] as Problem).background
      },
      delete: false
    }
    console.log('update request', request);
    var response = update(request);
    setTimeout(() => { fetchProblems(); }, 500);
    console.log('update response', response);
  }//修改
  clear(edited: Problem) {
    edited.problemId = '';
    edited.title = '';
    edited.type = '';
    edited.content = '';
    edited.answer = '';
    edited.gradingPoints = '';
    edited.subjectId = '';
    edited.background = '';
  }
  createRow(msg: Object): void {
    var request: ProblemUpdateRequest = {
      problem: {
        title: (msg as Problem).title,
        type: (msg as Problem).type,
        content: (msg as Problem).content,
        answer: (msg as Problem).answer,
        gradingPoints: (msg as Problem).gradingPoints,
        subjectId: (msg as Problem).subjectId,
        background: (msg as Problem).background
      },
      delete: false
    }
    console.log('create request', request);
    var response = update(request);
    setTimeout(() => { fetchProblems(); }, 500);
    console.log('create response', response);
  }//创建
  search(msg: Object): void {
    console.log('msg', msg)
    fetchProblems(undefined, 999, msg, true);
  }//查询
  constructor() {

  }
}
var CRUDhandler = new problemRowCRUD();
async function fetchProblems(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = msg || {
    problemId: '',
    title: '',
    type: '',
    content: '',
    answer: '',
    gradingPoints: '',
    subjectId: '',
    background: ''
  }
  var request: ProblemPageRequest = {
    problemId: ((temp as Problem).problemId === '') ? undefined : (temp as Problem).problemId,
    title: ((temp as Problem).title === '') ? undefined : (temp as Problem).title,
    type: ((temp as Problem).type === '') ? undefined : (temp as Problem).type,
    content: ((temp as Problem).content === '') ? undefined : (temp as Problem).content,
    answer: ((temp as Problem).answer === '') ? undefined : (temp as Problem).answer,
    gradingPoints: ((temp as Problem).gradingPoints === '') ? undefined : (temp as Problem).gradingPoints,
    subjectId: ((temp as Problem).subjectId === '') ? undefined : (temp as Problem).subjectId,
    background: ((temp as Problem).background === '') ? undefined : (temp as Problem).background,
    currPageNo: pageNum || 1,
    limit: pageLimit || 20
  }
  console.log('request', request);
  try {
    const response = await pageQuery(request || undefined);
    if (response && response.data && response.data.datas) {
      ProblemPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = ProblemPage.value.datas;
      if (search || false) {
        tabLength.value = ProblemPage.value.total;
      }
      else { tabLength.value = ProblemPage.value.limit; }//保证搜索只有一页
      entryNum.value = ProblemPage.value.total;
      // eslint-disable-next-line vue/no-ref-as-operand
      isSelected = isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Problem()) as Problem[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched problems:', ProblemPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching problems:', error);
  }
}
onMounted(() => {
  fetchProblems();
});
//request
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Problem[]> = ref<Problem[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  fetchProblems(currentPage);
  //恢复初始值
  // eslint-disable-next-line vue/no-ref-as-operand
  isSelected = clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0] = false;
  unwritableBar.value[0] = false;
}
//分页
const component = defineComponent({
  name: "ProblemManagement"
})
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>
../../scripts/data.js../../scripts/paginate.js