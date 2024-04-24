<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="50%">
                <el-header>
                    <h4>{{ selectedProblem?.title }}</h4>
                </el-header>
                <el-main>
                    <div class="problem-content">
                        <pre style="font-size: larger;">{{ selectedProblem?.content }}</pre>
                        <el-radio-group v-if="selectedProblem?.type === 'objective'" v-model="answer[selectedIndex]">
                            <el-radio v-for="(choice, index) in choices" :key="index" :label="choice">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <el-input v-else-if="selectedProblem?.type === 'subjective'" type="textarea" style="width:600px"
                            placeholder="在此输入答案，点击下方可查看参考答案" v-model="answer[selectedIndex]" />
                    </div>
                    <div class="problem-answer">
                        <el-button type="success" @click="changeShowOrHide();">{{ showOrHide }}</el-button>
                        <p v-if="showAnswer">{{ selectedProblem?.answer }}</p>
                    </div>
                </el-main>
                <el-footer>
                    <div class="testButton">
                        <el-button @click="priorProblem()" :disabled="selectedIndex === 0">上一题</el-button>
                        <el-button @click="nextProblem()"
                            :disabled="selectedIndex === problemResultList.length - 1">下一题</el-button>
                    </div>

                </el-footer>
            </el-container>
            <el-aside width="30%">
                <!-- <h4>搜索结果 <el-button @click="randomProblem()">随机选题</el-button></h4> -->
                <el-main>
                    <div class="result-content">
                        <el-table :data="loadCurrentList()" :row-class-name="rowClassName" v-loading="problemLoading">
                            <el-table-column fixed prop="title" label="题目" width="120px" />
                            <el-table-column prop="subjectName" label="知识点" width="100px" />
                            <el-table-column prop="typeName" label="题型" width="60px" />
                            <el-table-column label="" width="80px">
                                <template #default="scope">
                                    <el-button size="small" type="primary"
                                        @click="selectProblemWithId(scope.row.problemId)">选择</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-main>
                <el-footer>
                    <div class="problemset-pagination">
                        <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                            :current-page="current" :page-size="size" :total=problemResultList.length
                            layout="prev, pager, next" />
                    </div>
                </el-footer>
            </el-aside>
            <el-aside width="">
                <div class="problerm-search">
                    <h4 style="text-align: center">筛选题目</h4>
                    <el-input type="textarea" placeholder="在此输入题目标题" v-model="searchTitle" />
                    <p>题目类型</p>
                    <el-select v-model="chosenType" placeholder="">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <p>病种知识点</p>
                    <el-select v-model="chosenSubject" placeholder="">
                        <el-option v-for="item in subjectOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <div class="button">
                        <el-button style="background-color: antiquewhite; width:100px;"
                            @click="clearConditions()">清空筛选条件</el-button>
                        <el-button style="background-color: paleturquoise; width:100px;"
                            @click="searchProblems()">查找相关题目</el-button>
                    </div>

                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue'
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { pageQuery as diseaseQuery } from '@/apis/disease/disease';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { DiseasePageRequest, DiseasePageResponse, DiseaseUpdateRequest } from '@/apis/disease/disease-interface';
import type { ProblemBO, DiseaseBO } from '@/apis/schemas';


defineComponent({
    name: "SingleProblem",
})
const choices = ref(['A', 'B', 'C', 'D']);
const answer = ref<string[]>([]); //暂存答案
const showAnswer = ref(false);
const showOrHide = ref('显示答案');
function changeShowOrHide() {
    if (showAnswer.value == true) {
        showAnswer.value = false;
        showOrHide.value = '显示答案';
    } else {
        showAnswer.value = true;
        showOrHide.value = '隐藏答案';
    }
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
let typeOptions = ref([{ //题型选项
    value: 'objective',
    label: '单选题'
}, {
    value: 'subjective',
    label: '简答题'
}]);
let subjectOptions = ref([{ //病种知识点选项
    value: '',
    label: ''
}]);
const selectedProblem = ref<ProblemBO>();
const selectedIndex = ref();
const problemList = ref<ProblemBO[]>([]);
const diseaseList = ref<DiseaseBO[]>([]);

const searchTitle = ref('');
const chosenType = ref('');
const chosenSubject = ref('');
const problemResultList = ref<ProblemInfo[]>([]); //筛选并处理显示格式后的题目列表

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
                console.error('没有题目数据！');
            }
        }
    } catch (error) {
        console.error('获取题目数据失败！', error);
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
                console.error('没有病种数据！');
            }
        }
        setTimeout(() => {
            subjectOptions.value = diseaseList.value.map(disease => {
                return {
                    value: disease.diseaseId,
                    label: disease.name
                };
            })
            // console.log('病种选项:', subjectOptions.value);
        }, 50);
    } catch (error) {
        console.error('获取病种数据失败！', error);
    }
}
onMounted(async () => {
    await fetchDiseases();
    await fetchProblems();
    setTimeout(() => {
        problemResultList.value = JSON.parse(JSON.stringify(problemList.value));
        // console.log('problemResultList:',problemResultList.value);
        searchProblems();
        problemLoading.value = false;
    }, 500);
})
function searchProblems() {
    problemResultList.value.splice(0, problemResultList.value.length);

    for (var i in problemList.value) {
        var temp = problemList.value[i];
        if ((chosenType.value === '' || temp.type === chosenType.value) && (chosenSubject.value === '' || temp.subjectId === chosenSubject.value) && (searchTitle.value === '' || temp.title?.includes(searchTitle.value))) {
            problemResultList.value.push(temp);
        }
    }
    for (var res of problemResultList.value) {
        res.subjectName = diseaseList.value.find(dis => dis.diseaseId === res.subjectId)?.name;
        if (res.type === 'subjective') {
            res.typeName = '简答';
        } else if (res.type === 'objective') {
            res.typeName = '单选';
        }
    }
    if (problemResultList.value[0]) { //默认选中首题
        selectedProblem.value = problemResultList.value[0];
        selectedIndex.value = 0;
    } else {
        selectedProblem.value = undefined;
        selectedIndex.value = undefined;
    }
    // console.log("problemResultList:", problemResultList.value);
}

// function searchProblems() {
//     resultList.value.splice(0, resultList.value.length);
//     for (var i in problemList.value) {
//         var pro = problemList.value[i];
//         if (pro.type == chosenType.value[0] && pro.subjectId == chosenSubject.value[0] || pro.type == chosenType.value[0] && !chosenSubject.value[0] || !chosenType.value[0] && pro.subjectId == chosenSubject.value[0] || !chosenType.value[0] && !chosenSubject.value[0]) {
//             resultList.value.push(problemList.value[i]);
//         }
//     }
//     for (var res of resultList.value) {
//         res.subjectName = diseaseList.value.find(dis => dis.diseaseId === res.subjectId)?.name;
//         if (res.type === 'subjective') {
//             res.typeName = '简答';
//         } else if (res.type === 'objective') {
//             res.typeName = '单选';
//         }
//     }
//     if (resultList.value[0]) {
//         selectedProblem.value = resultList.value[0];
//         selectedIndex.value = 0;
//     }
// }
function clearConditions() { //情空题目筛选条件
    searchTitle.value = '';
    chosenType.value = '';
    chosenSubject.value = '';
    searchProblems();
}
function selectProblemWithId(id: string) {
    var temp = problemResultList.value.find(pro => pro.problemId === id);
    if (temp != null) {
        selectedProblem.value = temp;
        selectedIndex.value = problemResultList.value.indexOf(temp);
    }
}

//题目跳转
function jumpProblem(i: number) {

    var pro = problemResultList.value[i];
    if (pro != null) {
        selectedProblem.value = pro;
        selectedIndex.value = i;
    } else {
        console.log('跳转失败，题目不存在！');
    }
}
function nextProblem() {
    jumpProblem(selectedIndex.value + 1);
}
function priorProblem() {
    jumpProblem(selectedIndex.value - 1);
}
// function randomProblem() {
//     var rand = Math.floor(Math.random() * problemResultList.value.length);
//     jumpProblem(rand);
// }



//题目列表行样式
const rowClassName = ({ rowIndex }: { rowIndex: number }) => {
    var currentList = loadCurrentList();
    if (selectedProblem.value?.problemId === currentList[rowIndex].problemId) {
        return 'current-row';
    }
};
//加载动画
const problemLoading = ref(true);
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
function loadCurrentList() {
    var currentList: ProblemInfo[] = [];
    for (var i in problemResultList.value) {
        var index = problemResultList.value.indexOf(problemResultList.value[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            currentList.push(problemResultList.value[i]);
        }
    }
    return currentList;
}
</script>

<style scoped lang="scss">
.onlineTestLayout {
    margin-left: 5%;
    margin-right: 5%;
}

.problem-content {
    padding: 0 10px;
    margin: 30px 0;
}

.problem-answer {
    margin-top: 10px;
    padding: 0 10px;
}

.problerm-search {
    display: flex;
    flex-direction: column;

    margin: 50px 20px;
    padding: 20px 10px;
    border: solid 1px rgb(215, 215, 215);
    border-radius: 10px;
}

.problerm-search .button {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.testButton {
    display: flex;
    justify-content: center;
}

.result-content {
    // padding: 50px 0;
    min-height: 500px;
    max-height: 500px;
}

.problemset-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
}
</style>
<style lang="scss">
.current-row {
    font-weight: bold;
    background-color: #5c259766 !important;
}
</style>
