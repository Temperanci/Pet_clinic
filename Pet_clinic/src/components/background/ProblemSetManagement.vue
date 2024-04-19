<!-- eslint-disable vue/require-v-for-key -->
<template>
    <!-- <p>
        {{ component.name }}
      </p> -->
    <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
            <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
                <el-table-column prop="problemSetId" label="试卷编号">
                    <template #default="scope">
                        <el-input v-if="searchBar[scope.$index]" v-model="edited[0].problemSetId"></el-input>
                        <el-input v-else-if="unwritableBar[scope.$index]" disabled
                            v-model="edited[scope.$index].problemSetId"></el-input>
                        <span v-else>{{ scope.row.problemSetId }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="名称">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].title"></el-input>
                        <span v-else>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="desc" label="描述" width="200px">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].desc"></el-input>
                        <span v-else>{{ scope.row.desc }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].startTime"></el-input>
                        <span v-else>{{ scope.row.startTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="截止时间">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].endTime"></el-input>
                        <span v-else>{{ scope.row.endTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="duration" label="限时">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].duration"></el-input>
                        <span v-else>{{ scope.row.duration }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="problemIdList" label="" width="150px">
                    <template #default="scope">
                        <el-button type="primary" @click="editProblemSet(scope.row.problemId)">编辑试卷</el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="problemIdList" label="" width="100px">
                    <template #default="scope">
                        <el-button type="danger" @click="">删除</el-button>
                    </template>
                </el-table-column> -->

                <!-- <tableOption :clear=clearPara :num=tabLength :back=back
                    @edit-confirm="(index) => { CRUDhandler.editRow(edited, index); }"
                    @edit="(index) => { CRUDhandler.updateMsg(edited, queryData, index); isSelected[index] = !isSelected[index]; clearPara = false; }"
                    @cancel="(index) => { isSelected[index] = !isSelected[index]; clearPara = false; unwritableBar[0] = false; searchBar[0] = false; }"
                    @delete="(index) => { CRUDhandler.updateMsg(edited, queryData, index); clearPara = false; }"
                    @delete-confirm="(index) => { CRUDhandler.deleteRow(edited, index); }"
                    @create="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; unwritableBar[0] = true; }"
                    @create-confirm="(index) => { CRUDhandler.createRow(edited[index]); unwritableBar[0] = false; }"
                    @search="(index) => { CRUDhandler.clear(edited[index]); isSelected[index] = true; clearPara = false; searchBar[0] = true; }"
                    @search-confirm="(index) => { CRUDhandler.search(edited[index]); searchBar[0] = false; back = true; }"
                    @back="fetchProblemSets(); back = false;" /> -->
            </el-table>
        </div>
        <div class="pagination-block">
            <el-pagination @current-change="pagination" layout="prev, pager, next"
                :total="getPagination(entryNum, tabLength)" />
        </div>
    </div>

    <el-dialog v-model="dialogVisible" title="编辑试卷" width="1000" draggable overflow :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="edit-content">
            <el-container>
                <el-aside width="40%">
                    试卷名称
                    <el-input type="textarea" placeholder="" v-model="editName" />
                    描述
                    <el-input type="textarea" placeholder="" v-model="editDesc" />
                </el-aside>
                <el-container width="40%">
                    <el-header>

                    </el-header>

                    <el-main>
                        选择题目
                        <div class="problemlist-content">
                            <el-table :data="loadCurrentList()" :row-class-name="rowClassName">
                                <el-table-column prop="title" label="题目" width="" />
                                <el-table-column prop="subjectName" label="知识点" width="" />
                                <el-table-column prop="typeName" label="题型" width="" />
                                <el-table-column label="" width="80px">
                                    <template #default="scope">
                                        <el-button size="small" @click="">选择</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-main>
                    <el-footer>
                        <div class="problemlist-pagination">
                            <el-pagination background @current-change="handleCurrentChange"
                                @size-change="handleSizeChange" :current-page="current" :page-size="size"
                                :total=resultList.length layout="prev, pager, next" />
                        </div>
                    </el-footer>
                </el-container>
                <el-aside width="20%">
                    <div class="problerm-search">
                        <h4>筛选题目</h4>
                        <el-input type="textarea" placeholder="在此输入题目标题" v-model="searchTitle" />
                        <p>题目类型</p>
                        <el-cascader placeholder="题目类型" :options="typeOptions" filterable v-model="chosenType" />
                        <p>病种知识点</p>
                        <el-cascader placeholder="病种知识点" :options="subjectOptions" filterable v-model="chosenSubject" />
                        <div class="button" style="margin-top: 50px;">
                            <el-button style="background-color: antiquewhite; width:100px;"
                                @click="clearConditions()">清空筛选条件</el-button>
                            <el-button style="background-color: paleturquoise; width:100px;"
                                @click="searchProblems()">查找相关题目</el-button>
                        </div>

                    </div>
                </el-aside>
            </el-container>
        </div>

        <el-button type="success" size="small" @click="  ; dialogVisible = false;">
            确认
        </el-button>
        <el-button type="info" size="small" @click="dialogVisible = false;">
            取消
        </el-button>
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
import { pageQuery as problemSetQuery, update as problemSetUpdate } from "../../apis/problemSet/problemSet"
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { pageQuery as diseaseQuery } from '@/apis/disease/disease';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from "@/apis/problemSet/problemSet-interface"
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from "@/apis/problem/problem-interface"
import type { DiseasePageRequest, DiseasePageResponse, DiseaseUpdateRequest } from '@/apis/disease/disease-interface';
import type { ProblemBO, DiseaseBO } from '@/apis/schemas';
import { ProblemSet, Problem } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'

const ProblemSetPage = ref<ProblemSetPageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
class problemSetRowCRUD implements rowCRUD {
    updateMsg(Msg: Object[], data: any[], index: number): void {
        (Msg[index] as ProblemSet).problemSetId = data[index].problemSetId;
        (Msg[index] as ProblemSet).title = data[index].title;
        (Msg[index] as ProblemSet).desc = data[index].desc;
        (Msg[index] as ProblemSet).startTime = data[index].startTime;
        (Msg[index] as ProblemSet).endTime = data[index].endTime;
        (Msg[index] as ProblemSet).duration = data[index].duration;
        (Msg[index] as ProblemSet).problemIdList = data[index].problemIdList;
        (Msg[index] as ProblemSet).problemScoreMap = data[index].problemScoreMap;
        // console.log('editedProblemSet', Msg);
    }//更新buffer
    deleteRow(Msg: Object[], index: number): void {
        var request: ProblemSetUpdateRequest = {
            problemSet: {
                problemSetId: (Msg[index] as ProblemSet).problemSetId,
                title: '',
                desc: '',
                startTime: new Date(),
                endTime: new Date(),
                duration: 0,
                problemIdList: [],
                problemScoreMap: {} as Record<string, number>,
            },
            delete: true
        }
        // console.log('delete request', request);
        var response = problemSetUpdate(request);
        setTimeout(() => { fetchProblemSets(); }, 500);
        // console.log('delete response', response);
    }//删除
    editRow(Msg: Object[], index: number): void {
        var request: ProblemSetUpdateRequest = {
            problemSet: {
                problemSetId: (Msg[index] as ProblemSet).problemSetId,
                title: (Msg[index] as ProblemSet).title,
                desc: (Msg[index] as ProblemSet).desc,
                startTime: (Msg[index] as ProblemSet).startTime,
                endTime: (Msg[index] as ProblemSet).endTime,
                duration: (Msg[index] as ProblemSet).duration,
                problemIdList: (Msg[index] as ProblemSet).problemIdList,
                problemScoreMap: (Msg[index] as ProblemSet).problemScoreMap,
            },
            delete: false
        }
        // console.log('update request', request);
        var response = problemSetUpdate(request);
        setTimeout(() => { fetchProblemSets(); }, 500);
        // console.log('update response', response);
    }//修改
    clear(edited: ProblemSet) {
        edited.problemSetId = '';
        edited.title = '';

    }
    createRow(msg: Object): void {
        var request: ProblemSetUpdateRequest = {
            problemSet: {
                title: (msg as ProblemSet).title,
                desc: (msg as ProblemSet).desc,
                startTime: (msg as ProblemSet).startTime,
                endTime: (msg as ProblemSet).endTime,
                duration: (msg as ProblemSet).duration,
                problemIdList: (msg as ProblemSet).problemIdList,
                problemScoreMap: (msg as ProblemSet).problemScoreMap,
            },
            delete: false
        }
        // console.log('create request', request);
        var response = problemSetUpdate(request);
        setTimeout(() => { fetchProblemSets(); }, 500);
        // console.log('create response', response);
    }//创建
    search(msg: Object): void {
        // console.log('msg', msg)
        fetchProblemSets(undefined, 999, msg, true);
    }//查询
    constructor() {

    }
}
var CRUDhandler = new problemSetRowCRUD();
async function fetchProblemSets(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
    var temp = msg || {
        problemSetId: '',
        title: '',
        desc: '',
        startTime: new Date(),
        endTime: new Date(),
        duration: 0,
        problemIdList: [],
        problemScoreMap: {} as Record<string, number>,
    }
    var request: ProblemSetPageRequest = {
        problemSetId: ((temp as ProblemSet).problemSetId === '') ? undefined : (temp as ProblemSet).problemSetId,
        title: ((temp as ProblemSet).title === '') ? undefined : (temp as ProblemSet).title,
        desc: ((temp as ProblemSet).desc === '') ? undefined : (temp as ProblemSet).desc,

        currPageNo: pageNum || 1,
        limit: pageLimit || 20
    }
    console.log('request', request);
    try {
        const response = await problemSetQuery(request || undefined);
        if (response && response.data && response.data.datas) {
            ProblemSetPage.value = response.data; // 假设响应中有data属性，且包含datas数组
            queryData.value = ProblemSetPage.value.datas;

            for (var item of queryData.value) { //处理起止时间和时限的显示格式
                if (item.startTime) {
                    item.startTime = item.startTime.toString().slice(0, 10) + " " + item.startTime.toString().slice(11, 16);
                }
                if (item.endTime) {
                    item.endTime = item.endTime.toString().slice(0, 10) + " " + item.endTime.toString().slice(11, 16);
                }
                if (item.duration) {
                    var hour = Math.floor(item.duration / (1000 * 60 * 60));
                    var min = Math.floor(item.duration / (1000 * 60) - hour * 60);
                    item.duration = hour + "h" + min + "min";
                }
            }

            if (search || false) {
                tabLength.value = ProblemSetPage.value.total;
            }
            else { tabLength.value = ProblemSetPage.value.limit; }//保证搜索只有一页
            entryNum.value = ProblemSetPage.value.total;
            // eslint-disable-next-line vue/no-ref-as-operand
            isSelected = isSelectGen(tabLength.value);
            edited.value = EditedGen(tabLength.value, new ProblemSet()) as ProblemSet[];
            // selectPage(currentPage - 1, tableData, queryData);
            // console.log('Fetched problemSets:', ProblemSetPage.value.datas);
        } else {
            console.error('No data returned from the API');
        }
    } catch (error) {
        console.error('Error fetching problemSets:', error);
    }
}
onMounted(() => {
    fetchProblemSets();
});
//request
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<ProblemSet[]> = ref<ProblemSet[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
    currentPage = val
    fetchProblemSets(currentPage);
    //恢复初始值
    // eslint-disable-next-line vue/no-ref-as-operand
    isSelected = clearIsSelected(isSelected);
    clearPara.value = true;
    searchBar.value[0] = false;
    unwritableBar.value[0] = false;
}
//分页
const component = defineComponent({
    name: "ProblemSetManagement"
})

interface ProblemInfo {
    problemId?: string;
    type?: string;
    typeName?: string;
    subjectId?: string;
    subjectName?: string;
    title?: string;
    content?: string;
    answer?: string;
    background?: string;
    gradingPoints?: string;
}

//编辑试卷题目
const editId = ref('');
const dialogVisible = ref(false);
const input = ref('');
const editName = ref('');
const editDesc = ref('');
const editHour = ref('');
const editMin = ref('');
const selectedIndex = ref(0);
const selectedProblem = ref<ProblemBO>({});
const problemList = ref<ProblemBO[]>([]);
const diseaseList = ref<DiseaseBO[]>([]);
const searchTitle = ref('');
const chosenType = ref('');
const chosenSubject = ref('');
const resultList = ref<ProblemInfo[]>([]);
let typeOptions = ref([{
    value: 'objective',
    label: '单选题'
}, {
    value: 'subjective',
    label: '简答题'
}]);
let subjectOptions = ref([{
    value: '',
    label: ''
}]);
const rowClassName = ({ rowIndex }: { rowIndex: number }) => {
    // if () {
    //     return '';
    // } else {
    //     return '';
    // }
};
function editProblemSet(id: string) {
    editId.value = id;
    dialogVisible.value = true;
}
async function fetchProblems() {
    try {
        const request: ProblemPageRequest = { currPageNo: 1 };
        const response = await problemQuery(request);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            request.currPageNo = i;
            const response = await problemQuery(request);
            if (response && response.data && response.data.datas) {
                for (var j in response.data.datas) { //单选题内容换行
                    response.data.datas[j].content = (response.data.datas[j].content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1');
                }
                problemList.value = problemList.value.concat(response.data.datas);
            } else {
                console.error('No data returned from the API');
            }
        }
        // console.log("获取problemList:", problemList.value);
        setTimeout(() => {
            resultList.value = JSON.parse(JSON.stringify(problemList.value));
            for (var pro of resultList.value) {
                pro.subjectName = diseaseList.value.find(dis => dis.diseaseId === pro.subjectId)?.name;
                if (pro.type === 'subjective') {
                    pro.typeName = '简答';
                } else if (pro.type === 'objective') {
                    pro.typeName = '单选';
                }
            }
            selectedProblem.value = resultList.value[0];
            selectedIndex.value = 0;
        }, 50);

    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}
async function fetchDiseases() {
    try {
        const request: DiseasePageRequest = { currPageNo: 1 };
        const response = await diseaseQuery(request);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            request.currPageNo = i;
            const response = await diseaseQuery(request);
            if (response && response.data && response.data.datas) {
                diseaseList.value = diseaseList.value.concat(response.data.datas);
            } else {
                console.error('No data returned from the API');
            }
        }
        console.log("获取diseaseList:", diseaseList.value);
        setTimeout(() => {
            subjectOptions.value = diseaseList.value.map(disease => {
                return {
                    value: disease.diseaseId,
                    label: disease.name
                };
            })
            console.log('病种选项:', subjectOptions.value);
        }, 50);
    } catch (error) {
        console.error('Error fetching diseases:', error);
    }
}
onMounted(async () => {
    await fetchDiseases();
    await fetchProblems();
})
function searchProblems() {
    resultList.value.splice(0, resultList.value.length);
    for (var i in problemList.value) {
        var pro = problemList.value[i];
        if (pro.type == chosenType.value[0] && pro.subjectId == chosenSubject.value[0] || pro.type == chosenType.value[0] && !chosenSubject.value[0] || !chosenType.value[0] && pro.subjectId == chosenSubject.value[0] || !chosenType.value[0] && !chosenSubject.value[0]) {
            resultList.value.push(problemList.value[i]);
        }
    }
    for (var res of resultList.value) {
        res.subjectName = diseaseList.value.find(dis => dis.diseaseId === res.subjectId)?.name;
        if (res.type === 'subjective') {
            res.typeName = '简答';
        } else if (res.type === 'objective') {
            res.typeName = '单选';
        }
    }
    if (resultList.value[0]) {
        selectedProblem.value = resultList.value[0];
        selectedIndex.value = 0;
    }
    console.log('筛选结果:', resultList.value);
}

function clearConditions() {
    // searchTitle.value='';
    chosenType.value = '';
    chosenSubject.value = '';
    searchProblems();
}
function loadProblemList() {

}
function loadCurrentList() {
    var currentList: ProblemInfo[] = [];
    for (var i in resultList.value) {
        var index = resultList.value.indexOf(resultList.value[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            currentList.push(resultList.value[i]);
        }
    }
    console.log(currentList.length);
    return currentList;
}

//前端分页处理
var current = ref(1);
var size = ref(10);
function handleCurrentChange(n: number) {
    current.value = n;
    console.log('当前页号:', n);
}
function handleSizeChange(n: number) {
    size.value = n;
}
</script>

<style scoped lang="scss">
.edit-content {
    min-height: 500px;
    max-height: 500px;
    overflow: auto;
}
.problemlist-content{
    max-height: 300px;
}
.problemlist-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
}
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>
../../scripts/data.js../../scripts/paginate.js