<!-- eslint-disable vue/require-v-for-key -->
<template>
    <!-- <p>
        {{ component.name }}
      </p> -->
    <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
            <el-table :data="handleProblemSetList()" height="100%" empty-text="来到了没有数据的荒原...">
                <el-table-column prop="problemSetId" label="试卷编号">
                    <template #default="scope">
                        <!-- <el-input v-if="searchBar[scope.$index]" v-model="edited[0].problemSetId"></el-input>
                        <el-input v-else-if="unwritableBar[scope.$index]" disabled
                            v-model="edited[scope.$index].problemSetId"></el-input>
                        <span v-else>{{ scope.row.problemSetId }}</span> -->
                        <span>{{ scope.row.problemSetId }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="名称">
                    <template #default="scope">
                        <!-- <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].title"></el-input>
                        <span v-else>{{ scope.row.title }}</span> -->
                        <span>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="desc" label="描述" width="200px">
                    <template #default="scope">
                        <!-- <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].desc"></el-input>
                        <span v-else>{{ scope.row.desc }}</span> -->
                        <span>{{ scope.row.desc }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTimeStr" label="开始时间">
                    <template #default="scope">
                        <!-- 
                        <span v-else>{{ scope.row.startTime }}</span> -->
                        <!-- <el-input v-if="searchBar[scope.$index]" disabled></el-input> -->
                        <!-- <el-input v-else-if="unwritableBar[scope.$index]" disabled
                            v-model="edited[scope.$index].startTime"></el-input> -->
                        <!-- <el-input v-else-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].startTime"></el-input>
                        <span v-else>{{ scope.row.startTimeStr }}</span> -->
                        <span>{{ scope.row.startTimeStr }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="endTimeStr" label="截止时间">
                    <template #default="scope">
                        <!-- <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].endTime"></el-input>
                        <span v-else>{{ scope.row.endTime }}</span> -->
                        <!-- <el-input v-if="searchBar[scope.$index]" disabled></el-input>
                        <el-input v-else-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].endTime"></el-input>
                        <span v-else>{{ scope.row.endTimeStr }}</span> -->
                        <span>{{ scope.row.endTimeStr }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="durationStr" label="限时">
                    <template #default="scope">
                        <!-- <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].duration"></el-input>
                        <span v-else>{{ scope.row.durationStr }}</span> -->
                        <span>{{ scope.row.durationStr }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="" width="150px">
                    <template #header>
                        <el-button type="success" @click="createProblemSet();">创建试卷</el-button>
                    </template>
                    <template #default="scope">
                        <el-button type="primary" @click="editProblemSet(scope.row.problemSetId);">编辑试卷</el-button>
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
                    @back="backToHome(); back = false;" /> -->
            </el-table>
        </div>
        <div class="pagination-block">
            <el-pagination @current-change="pagination" layout="prev, pager, next"
                :total="getPagination(entryNum, tabLength)" />
        </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="createNew ? '创建试卷' : '编辑试卷'" width="1100" draggable overflow
        :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="edit-content">
            <el-container>
                <el-aside width="30%">
                    <div class="problemset-info">
                        <div class="name">
                            <span><b>名称：</b></span>
                            <el-input type="input" placeholder="" v-model="editTitle" :rows="1" style="width:60%;" />
                        </div>
                        <div class="desc">
                            <span><b>描述：</b></span>
                            <el-input type="textarea" placeholder="" v-model="editDesc" :rows="5" style="width: 80%;" />
                        </div>
                        <div class="duration">
                            <b>限时：</b>
                            <el-input type="input" placeholder="" v-model="editHour" :rows="1" style="width: 40px;" />
                            <span> 时 </span>
                            <el-input type="input" placeholder="" v-model="editMin" :rows="1" style="width: 40px;" />
                            <span> 分 </span>
                        </div>
                    </div>

                    <div class="datetime-picker">
                        <div class="block">
                            <span class="demonstration"><b>开始时间：</b></span>
                            <el-date-picker v-model="editStartTime" type="datetime" placeholder=""
                                style="width: 200px;" />
                        </div>
                        <div class="block">
                            <span class="demonstration"><b>截止时间：</b></span>
                            <el-date-picker v-model="editEndTime" type="datetime" placeholder=""
                                style="width: 200px;" />
                        </div>
                    </div>

                </el-aside>
                <el-container width="40%">
                    <!-- <el-header>
                    </el-header> -->
                    <div class="problem-content">
                        <pre style="white-space:pre;white-space:pre-wrap;">{{ selectedProblem.content }}</pre>
                    </div>
                    <el-main>
                        <div class="problemlist-content">
                            <el-table :data="loadCurrentProblemList()" :row-class-name="rowClassName" height=290px>
                                <el-table-column fixed prop="title" label="题目" width="120px" />
                                <el-table-column prop="subjectName" label="知识点" width="100px" />
                                <el-table-column prop="typeName" label="题型" width="60px" />
                                <el-table-column prop="" label="分值" width="60px" />
                                <el-table-column label="" width="60px">
                                    <template #default="scope">
                                        <el-button size="small"
                                            @click="selectProblemWithId(scope.row.problemId)">选择</el-button>
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
                <el-aside width="25%">
                    <div class="problerm-search">
                        <el-input type="textarea" placeholder="在此输入题目标题" v-model="searchTitle" />
                        <p>题目类型</p>
                        <el-select v-model="chosenType" placeholder="">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <!-- <el-cascader placeholder="题目类型" :options="typeOptions" filterable v-model="chosenType" /> -->
                        <p>病种知识点</p>
                        <el-select v-model="chosenSubject" placeholder="">
                            <el-option v-for="item in subjectOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <!-- <el-cascader placeholder="病种知识点" :options="subjectOptions" filterable v-model="chosenSubject" /> -->
                        <div class="button">
                            <el-button size="" style="background-color: antiquewhite; width:100px;"
                                @click="clearConditions()">清空</el-button>
                            <el-button size="" style="background-color: paleturquoise; width:100px;"
                                @click="searchProblems()">查找</el-button>
                        </div>

                    </div>
                    <div class="selected">
                        <span>只显示已选题目 </span>
                        <el-switch v-model="selected" />
                    </div>

                    <div class="edit-confirm">
                        <el-button v-if="!createNew" type="danger" size="large" @click="confirmDelete=true;">
                            删除
                        </el-button>
                        <el-button :type="createNew ? 'success' : 'primary'" size="large"
                            @click="if (createNew) { submitCreate(); } else { submitEdit(); }; clearEdit(); dialogVisible = false;">
                            {{ createNew ? '新建' : '确认' }}
                        </el-button>
                        <!-- <el-button type="info" size="large" @click="clearEdit(); dialogVisible = false;">
                            取消
                        </el-button> -->
                    </div>
                </el-aside>
            </el-container>
        </div>
    </el-dialog>

    <el-dialog v-model="confirmDelete" title="确认删除试卷？该操作无法撤销" width="400px" overflow :close-on-click-modal="false" :close-on-press-escape="false">
        <template #footer>
            <div class="dialog-footer">
                <el-button type="info" @click="confirmDelete = false">取消</el-button>
                <el-button type="danger" @click="submitDelete();">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
//分页
import { ref,watch } from 'vue'
import { getPagination, LENGTH } from '../../scripts/paginate'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery as problemSetQuery, update as updateProblemSet } from "../../apis/problemSet/problemSet"
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { pageQuery as diseaseQuery } from '@/apis/disease/disease';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from "@/apis/problemSet/problemSet-interface"
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from "@/apis/problem/problem-interface"
import type { DiseasePageRequest, DiseasePageResponse, DiseaseUpdateRequest } from '@/apis/disease/disease-interface';
import type { ProblemBO, DiseaseBO } from '@/apis/schemas';
import { ProblemSet, Problem } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'
import { throwMessage } from "@/scripts/display";

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
    async deleteRow(Msg: Object[], index: number) {
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
        var ProSetDelresponse = await updateProblemSet(request);
        if (ProSetDelresponse) {//更改成功
            throwMessage('delete fail');
        }
        else {
            throwMessage('delete success');
            setTimeout(() => { backToHome(); }, 500);
        }
        // console.log('delete response', response);
    }//删除
    async editRow(Msg: Object[], index: number) {
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
        var ProSetUpdateResponse = await updateProblemSet(request);
        if (ProSetUpdateResponse) {//更改成功
            throwMessage('update success');
            setTimeout(() => { backToHome(); }, 500);
        }
        else {
            throwMessage('update fail');
        }
        // console.log('update response', response);
    }//修改
    clear(edited: ProblemSet) {
        edited.problemSetId = '';
        edited.title = '';

    }
    async createRow(msg: Object) {
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
        var ProSetCreateResponse = await updateProblemSet(request);
        if (ProSetCreateResponse) {//更改成功
            throwMessage('create success');
            setTimeout(() => { backToHome(); }, 500);
        }
        else {
            throwMessage('create fail');
        }
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
    // console.log('request', request);
    try {
        const response = await problemSetQuery(request || undefined);
        if (response && response.data && response.data.datas) {
            ProblemSetPage.value = response.data; // 假设响应中有data属性，且包含datas数组
            queryData.value = ProblemSetPage.value.datas;

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
function backToHome() {
    fetchProblemSets(currentPage);
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
const component = defineComponent({
    name: "ProblemSetManagement"
})

interface ProblemSetInfo {
    problemSetId?: string;
    title?: string;
    desc?: string;
    startTimeStr?: string;
    startTime?: Date;
    endTimeStr?: string;
    endTime?: Date;
    durationStr?: string;
    duration?: number
}

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
const createNew = ref(false);
const editId = ref('');
const dialogVisible = ref(false);
const confirmDelete = ref(false);


const editTitle = ref('');
const editDesc = ref('');
const editHour = ref();
const editMin = ref();
const editStartTime = ref();
const editEndTime = ref();
const selectedProblemIdList = ref<string[]>([]); //已选题目
const selectedProblemScoreMap = ref<Record<string, number>>({}); //已选题目分值

const selectedIndex = ref(0);
const selectedProblem = ref<ProblemBO>({});
// const showAnswer = ref(false);
// const showOrHide = ref('显示答案');
const problemList = ref<ProblemBO[]>([]);
const diseaseList = ref<DiseaseBO[]>([]);

const searchTitle = ref('');
const chosenType = ref('');
const chosenSubject = ref('');
const selected = ref(false); //是否只展示已选题目
const resultList = ref<ProblemInfo[]>([]); //筛选并处理显示格式后的题目列表

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
const rowClassName = ({ rowIndex }: { rowIndex: number }) => { //题目的行样式随选择情况更改
    var currentList = loadCurrentProblemList();
    // console.log('行编号:',rowIndex,'题目id:',currentList[rowIndex].problemId);
    if (selectedProblemIdList.value && currentList[rowIndex] && selectedProblemIdList.value.includes(currentList[rowIndex].problemId ?? '')) {
        return 'selected-row';
    } else {
        return 'unselected-row';
    }
};
function createProblemSet() { //创建新试卷
    clearEdit();
    createNew.value = true;
    dialogVisible.value = true;
}
function editProblemSet(id: string) { //修改试卷
    clearEdit();
    createNew.value = false;
    const currentSet = queryData.value.find(set => set.problemSetId === id);
    // console.log("编辑试卷:", currentSet);
    if (currentSet) {
        editId.value = id;
        editTitle.value = currentSet.title ?? '';
        editDesc.value = currentSet.desc ?? '';
        if (currentSet.duration) {
            const hour = Math.floor(currentSet.duration / (1000 * 60 * 60));
            const min = Math.floor(currentSet.duration / (1000 * 60) - hour * 60);
            editHour.value = hour;
            editMin.value = min;
        }
        if (currentSet.startTime) {
            editStartTime.value = currentSet.startTime;
        }
        if (currentSet.endTime) {
            editEndTime.value = currentSet.endTime;
        }
        selectedProblemIdList.value = currentSet.problemIdList ?? [];
        selectedProblemScoreMap.value = currentSet.problemScoreMap ?? {};
    }
    dialogVisible.value = true;
}
function clearEdit() { //清除修改项数据
    editId.value = '';
    editTitle.value = '';
    editDesc.value = '';
    editHour.value = undefined;
    editMin.value = undefined;
    editStartTime.value = '';
    editEndTime.value = '';
    selectedProblemIdList.value = [];
    selectedProblemScoreMap.value = {};
    searchTitle.value = '';
    chosenType.value = '';
    chosenSubject.value = '';
    selected.value = false;
    searchProblems();
}
async function submitCreate() { //提交创建
    try {
        const request: ProblemSetUpdateRequest = {
            problemSet: {
                title: editTitle.value,
                desc: editDesc.value,
                startTime: editStartTime.value,
                endTime: editEndTime.value,
                duration: ((editHour.value ?? 0) * 60 + (editMin.value ?? 0)) * 60 * 1000,
                problemIdList: selectedProblemIdList.value,
                problemScoreMap: selectedProblemScoreMap.value
            },
            delete: false
        }
        var response = await updateProblemSet(request);
        if (response) {//更改成功
            throwMessage('create success');
            console.log('创建试卷成功:', response);
            setTimeout(() => { backToHome(); }, 500);
        }
        else {
            throwMessage('create fail');
        }
    } catch (error) {
        console.error('Error creating problemSet:', error);
    }
}
async function submitEdit() { //提交修改
    try {
        const request: ProblemSetUpdateRequest = {
            problemSet: {
                problemSetId: editId.value,
                title: editTitle.value,
                desc: editDesc.value,
                startTime: editStartTime.value,
                endTime: editEndTime.value,
                duration: ((editHour.value ?? 0) * 60 + (editMin.value ?? 0)) * 60 * 1000,
                problemIdList: selectedProblemIdList.value,
                problemScoreMap: selectedProblemScoreMap.value
            },
            delete: false
        }
        var response = await updateProblemSet(request);
        if (response) {//更改成功
            throwMessage('update success');
            console.log('修改试卷成功:', response);
            setTimeout(() => { backToHome(); }, 500);
        }
        else {
            throwMessage('update fail');
        }
    } catch (error) {
        console.error('Error updating problemSet:', error);
    }
}
async function submitDelete(){ //删除试卷
    try {
        const request: ProblemSetUpdateRequest = {
            problemSet: {
                problemSetId: editId.value,
            },
            delete: true
        }
        var response = await updateProblemSet(request);
        if (response) {//更改成功
            throwMessage('delete fail');
        }
        else {
            throwMessage('delete success');
            console.log('删除试卷成功:', response);
            setTimeout(() => { backToHome();confirmDelete.value=false;dialogVisible.value=false; }, 500);
        }
    } catch (error) {
        console.error('Error deleting problemSet:', error);
    }
}

async function fetchProblems() {
    try {
        const request: ProblemPageRequest = { currPageNo: 1 };
        const response = await problemQuery(request);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        // console.log("total=", response.data.total, " limit=", response.data.limit);
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
        setTimeout(() => {
            resultList.value = JSON.parse(JSON.stringify(problemList.value));
            searchProblems();
            selectedProblem.value = resultList.value[0];
            selectedIndex.value = 0;
        }, 100);

    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}
async function fetchDiseases() {
    try {
        const request: DiseasePageRequest = { currPageNo: 1 };
        const response = await diseaseQuery(request);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        // console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            request.currPageNo = i;
            const response = await diseaseQuery(request);
            if (response && response.data && response.data.datas) {
                diseaseList.value = diseaseList.value.concat(response.data.datas);
            } else {
                console.error('No data returned from the API');
            }
        }
        setTimeout(() => {
            subjectOptions.value = diseaseList.value.map(disease => {
                return {
                    value: disease.diseaseId,
                    label: disease.name
                };
            })
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
    // console.log("当前试卷选题:",selectedProblemIdList);
    for (var i in problemList.value) {
        var pro = problemList.value[i];
        if (pro.type == chosenType.value && pro.subjectId == chosenSubject.value || pro.type == chosenType.value && !chosenSubject.value || !chosenType.value && pro.subjectId == chosenSubject.value || !chosenType.value && !chosenSubject.value) {
            if (!selected.value || selectedProblemIdList.value && pro.problemId && selectedProblemIdList.value && selectedProblemIdList.value.includes(pro.problemId)) {
                resultList.value.push(problemList.value[i]);
            }
        }
    }
    // console.log("resultList:", resultList.value);
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
}

watch(selected, () => {
    searchProblems();
});


function clearConditions() {
    searchTitle.value = '';
    chosenType.value = '';
    chosenSubject.value = '';
    searchProblems();
}
function handleProblemSetList() { //处理起止时间和时限的显示格式
    const problemList: ProblemSetInfo[] = [];
    for (let i in queryData.value) {
        const temp: ProblemSetInfo = {
            problemSetId: "",
            title: "",
            desc: "",
            startTimeStr: "",
            startTime: new Date(0),
            endTimeStr: "",
            endTime: new Date('9999-12-31T23:59:59'),
            durationStr: "",
            duration: 0
        };
        temp.problemSetId = queryData.value[i].problemSetId ?? "";
        temp.title = queryData.value[i].title ?? "";
        temp.desc = queryData.value[i].desc ?? "";
        if (queryData.value[i].startTime) {
            temp.startTime = new Date(queryData.value[i].startTime);
            temp.startTimeStr = temp.startTime.getFullYear() + '-' + (temp.startTime.getMonth() + 1) + '-' + temp.startTime.getDate() + ' ' + temp.startTime.getHours().toString().padStart(2, '0') + ':' + temp.startTime.getMinutes().toString().padStart(2, '0');
            // temp.startTimeStr = temp.startTime .toString().slice(0, 10) + ' ' + temp.startTime .startTime?.toString().slice(11, 16);
        }
        if (queryData.value[i].endTime) {
            temp.endTime = new Date(queryData.value[i].endTime);
            temp.endTimeStr = temp.endTime.getFullYear() + '-' + (temp.endTime.getMonth() + 1) + '-' + temp.endTime.getDate() + ' ' + temp.endTime.getHours().toString().padStart(2, '0') + ':' + temp.endTime.getMinutes().toString().padStart(2, '0');
            // temp.endTimeStr = queryData.value[i].endTime?.toString().slice(0, 10) + ' ' + queryData.value[i].endTime?.toString().slice(11, 16);
        }
        if (queryData.value[i].duration) {
            var hour = Math.floor((queryData.value[i].duration ?? 0) / (1000 * 60 * 60));
            var min = Math.floor((queryData.value[i].duration ?? 0) / (1000 * 60) - hour * 60);
            temp.durationStr = hour + "h" + min + "min";
            if (hour > 0) {
                temp.durationStr = hour + "h" + min + "min";
            } else if (min > 0) {
                temp.durationStr = min + "min";
            } else {
                temp.durationStr = "";
            }
            temp.duration = queryData.value[i].duration ?? 0;
        }
        problemList.push(temp);

    }

    return problemList;
}
function loadCurrentProblemList() {
    var currentList: ProblemInfo[] = [];
    for (var i in resultList.value) {
        var index = resultList.value.indexOf(resultList.value[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            currentList.push(resultList.value[i]);
        }
    }
    return currentList;
}

function selectProblemWithId(id: string) {
    var temp = resultList.value.find(pro => pro.problemId === id);
    if (temp != null) {
        selectedProblem.value = temp;
        selectedIndex.value = resultList.value.indexOf(temp);
    }

    if (!selectedProblemIdList.value.includes(id)) { //添加题目
        selectedProblemIdList.value.push(id);
    } else {
        selectedProblemIdList.value = selectedProblemIdList.value.filter(item => item !== id); //移除题目
    }

}
// function changeShowOrHide() {
//     if (showAnswer.value == true) {
//         showAnswer.value = false;
//         showOrHide.value = '显示答案';
//     } else {
//         showAnswer.value = true;
//         showOrHide.value = '隐藏答案';
//     }
// }

//前端分页处理
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
.edit-content {
    min-height: 510px;
    max-height: 510px;
    overflow: auto;
}

.problemset-info {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    padding: 15px 20px;
    border: solid 1px rgb(215, 215, 215);
    border-radius: 10px;
}

.problemset-info .name {
    height: 30px;
    display: flex;
    margin-bottom: 10px;
}

.problemset-info .desc {
    display: flex;
    margin-bottom: 10px;
}

.problemset-info .duration {
    height: 30px;
    display: flex;
}

.datetime-picker {
    display: flex;
    position: relative;
    top: 10px;
    padding: 5px 0;
    margin-top: 20px;
    flex-wrap: wrap;
    border: solid 1px rgb(215, 215, 215);
    border-radius: 10px;
}

.datetime-picker .block {
    padding: 10px 5px;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.datetime-picker .demonstration {
    font-size: 14px;
}

.problem-content {
    min-height: 100px;
    max-height: 100px;
    background-color: rgb(240, 240, 240);
    border-radius: 20px;
    margin: 10px 30px;
    padding: 1px 15px;
    font-size: small;
    text-align: left;
    white-space: normal;
    // overflow-wrap: break-word;
    // margin-top:-50px;
}

.problemlist-content {
    padding: 0 5px;
    max-height: 280px;
    min-height: 280px;
}

// .selected-row{
//     background-color: rgba(173, 216, 230, 0.3) !important;
// }
// .unselected-row{

// }
.problemlist-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
}

.problerm-search {
    display: block;
    margin: 20px 10px;
    padding: 10px 15px;
    border: solid 1px rgb(215, 215, 215);
    border-radius: 10px;
}

.problerm-search .button {
    display: flex;
    margin-top: 30px;
}

.selected {
    margin-top: 10px;
}

.edit-confirm {
    display: flex;
    float: right;
    position: relative;
    bottom: -90px;
}
</style>

<style lang="scss">
.selected-row {
    background-color: rgba(173, 216, 230, 0.3) !important;
}

.unselected-row {}
</style>

../../scripts/data.js../../scripts/paginate.js