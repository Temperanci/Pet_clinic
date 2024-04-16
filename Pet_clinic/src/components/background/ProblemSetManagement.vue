<template>
    <!-- <p>
        {{ component.name }}
      </p> -->
    <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
            <el-table :data="queryData" height="100%">
                <el-table-column prop="problemSetId" label="题目编号">
                    <template #default="scope">
                        <el-input v-if="searchBar[scope.$index]" v-model="edited[0].problemSetId"></el-input>
                        <el-input v-else-if="unwritableBar[scope.$index]" disabled
                            v-model="edited[scope.$index].problemSetId"></el-input>
                        <span v-else>{{ scope.row.problemSetId }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="departmentId" label="题目名称">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].title"></el-input>
                        <span v-else>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="题目类型">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].type"></el-input>
                        <span v-else>{{ scope.row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="题目内容">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].content"></el-input>
                        <span v-else>{{ scope.row.content }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="答案">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].answer"></el-input>
                        <span v-else>{{ scope.row.answer }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="得分点">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].gradingPoints"></el-input>
                        <span v-else>{{ scope.row.gradingPoints }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="病种知识点">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].subjectId"></el-input>
                        <span v-else>{{ scope.row.subjectId }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="出题背景">
                    <template #default="scope">
                        <el-input v-if="isSelected[scope.$index] === true"
                            v-model="edited[scope.$index].background"></el-input>
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
                    @back="fetchProblemSets(); back = false;" />
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
import { getPagination, LENGTH } from '../../scripts/paginate.ts'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery, update } from "../../apis/problemSet/problemSet.ts"
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from "@/apis/problemSet/problemSet-interface.ts"
import { ProblemSet } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt.ts'
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
        (Msg[index] as ProblemSet).whiteList = data[index].whiteList;

        console.log('editedProblemSet', Msg);
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
                whiteList: []
            },
            delete: true
        }
        console.log('delete request', request);
        var response = update(request);
        setTimeout(() => { fetchProblemSets(); }, 500);
        console.log('delete response', response);
    }//删除
    editRow(Msg: Object[], index: number): void {
        var request: ProblemSetUpdateRequest = {
            problemSet: {
                problemSetId: (Msg[index] as ProblemSet).problemSetId,
                title: (Msg[index] as ProblemSet).title,
                type: (Msg[index] as ProblemSet).type,
                content: (Msg[index] as ProblemSet).content,
                answer: (Msg[index] as ProblemSet).answer,
                gradingPoints: (Msg[index] as ProblemSet).gradingPoints,
                subjectId: (Msg[index] as ProblemSet).subjectId,
                background: (Msg[index] as ProblemSet).background
            },
            delete: false
        }
        console.log('update request', request);
        var response = update(request);
        setTimeout(() => { fetchProblemSets(); }, 500);
        console.log('update response', response);
    }//修改
    clear(edited: ProblemSet) {
        edited.problemSetId = '';
        edited.title = '';
        edited.type = '';
        edited.content = '';
        edited.answer = '';
        edited.gradingPoints = '';
        edited.subjectId = '';
        edited.background = '';
    }
    createRow(msg: Object): void {
        var request: ProblemSetUpdateRequest = {
            problemSet: {
                title: (msg as ProblemSet).title,
                type: (msg as ProblemSet).type,
                content: (msg as ProblemSet).content,
                answer: (msg as ProblemSet).answer,
                gradingPoints: (msg as ProblemSet).gradingPoints,
                subjectId: (msg as ProblemSet).subjectId,
                background: (msg as ProblemSet).background
            },
            delete: false
        }
        console.log('create request', request);
        var response = update(request);
        setTimeout(() => { fetchProblemSets(); }, 500);
        console.log('create response', response);
    }//创建
    search(msg: Object): void {
        console.log('msg', msg)
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
        type: '',
        content: '',
        answer: '',
        gradingPoints: '',
        subjectId: '',
        background: ''
    }
    var request: ProblemSetPageRequest = {
        problemSetId: ((temp as ProblemSet).problemSetId === '') ? undefined : (temp as ProblemSet).problemSetId,
        title: ((temp as ProblemSet).title === '') ? undefined : (temp as ProblemSet).title,
        type: ((temp as ProblemSet).type === '') ? undefined : (temp as ProblemSet).type,
        content: ((temp as ProblemSet).content === '') ? undefined : (temp as ProblemSet).content,
        answer: ((temp as ProblemSet).answer === '') ? undefined : (temp as ProblemSet).answer,
        gradingPoints: ((temp as ProblemSet).gradingPoints === '') ? undefined : (temp as ProblemSet).gradingPoints,
        subjectId: ((temp as ProblemSet).subjectId === '') ? undefined : (temp as ProblemSet).subjectId,
        background: ((temp as ProblemSet).background === '') ? undefined : (temp as ProblemSet).background,
        currPageNo: pageNum || 1,
        limit: pageLimit || 20
    }
    console.log('request', request);
    try {
        const response = await pageQuery(request || undefined);
        if (response && response.data && response.data.datas) {
            ProblemSetPage.value = response.data; // 假设响应中有data属性，且包含datas数组
            queryData.value = ProblemSetPage.value.datas;
            if (search || false) {
                tabLength.value = ProblemSetPage.value.total;
            }
            else { tabLength.value = ProblemSetPage.value.limit; }//保证搜索只有一页
            entryNum.value = ProblemSetPage.value.total;
            isSelected = isSelectGen(tabLength.value);
            edited.value = EditedGen(tabLength.value, new ProblemSet()) as ProblemSet[];
            // selectPage(currentPage - 1, tableData, queryData);
            console.log('Fetched problemSets:', ProblemSetPage.value.datas);
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
    isSelected = clearIsSelected(isSelected);
    clearPara.value = true;
    searchBar.value[0] = false;
    unwritableBar.value[0] = false;
}
//分页
const component = defineComponent({
    name: "ProblemSetManagement"
})
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }</style>
../../scripts/data.js../../scripts/paginate.js