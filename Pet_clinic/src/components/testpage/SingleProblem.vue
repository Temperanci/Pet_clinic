<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="50%">
                <el-header>
                    <h4>{{ selectedProblem.title }}</h4>
                </el-header>
                <el-main>
                    <div class="problem-content">
                        <pre style="font-size: larger;">{{ selectedProblem.content }}</pre>
                        <el-radio-group v-if="selectedProblem.type === 'objective'" v-model="answer[selectedIndex]">
                            <el-radio v-for="(choice, index) in choices" :key="index" :label="choice">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <!-- <el-checkbox-group v-else-if="currentProblemRef.type === '多选'" v-model="chosenAnswers">
                            <el-checkbox v-for="(choice, index) in currentProblemRef.choices" :key="index"
                                :label="index + 1">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group> -->
                        <el-input v-else-if="selectedProblem.type === 'subjective'" type="textarea" placeholder="在此输入答案"
                            v-model="answer[selectedIndex]" />
                    </div>
                    <div class="problem-answer">
                        <el-button type="primary" @click="changeShowOrHide();">{{ showOrHide }}</el-button>
                        <p v-if="showAnswer">{{ selectedProblem.answer }}</p>
                    </div>
                </el-main>
                <el-footer>
                    <div class="testButton">
                        <el-button @click="priorProblem()">上一题</el-button>
                        <el-button @click="nextProblem()">下一题</el-button>
                    </div>

                </el-footer>
            </el-container>
            <el-aside width="30%">
                <h4>搜索结果 <el-button @click="randomProblem()">随机选题</el-button></h4>

                <el-main>
                    <div class="result-content">
                        <el-table :data="loadCurrentList()" :row-class-name="rowClassName">
                            <el-table-column prop="title" label="题目" width="120px" />
                            <el-table-column prop="subjectId" label="知识点" />
                            <el-table-column prop="type" label="题型" />
                            <el-table-column label="" width="80px">
                                <template #default="scope">
                                    <el-button size="small"
                                        @click="selectProblemWithId(scope.row.problemId)">选择</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-main>
                <el-footer>
                    <div class="problemset-pagination">
                        <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                            :current-page="current" :page-size="size" :total=resultList.length
                            layout="prev, pager, next" />
                    </div>
                </el-footer>
            </el-aside>
            <el-aside>
                <div class="problerm-search">
                    <h4>筛选题目</h4>
                    <el-input type="textarea" placeholder="在此输入题目标题" v-model="searchTitle" />
                    <p>题目类型</p>
                    <el-cascader placeholder="题目类型" :options="typeOptions" filterable v-model="chosenType" />
                    <p>病种知识点</p>
                    <el-cascader placeholder="病种知识点" :options="subjectOptions" filterable v-model="chosenSubject" />
                    <el-button style="margin-top: 50px;" @click="searchProblems()">查找相关题目</el-button>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue'
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { ProblemBO } from '@/apis/schemas';


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

const selectedIndex = ref(0);
const selectedProblem = ref<ProblemBO>({});

const problemList = ref<ProblemBO[]>([]);
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
                // selectedProblem.value = problemList.value[selectedIndex.value];
            } else {
                console.error('No data returned from the API');
            }
        }
        setTimeout(() => {
            resultList.value = JSON.parse(JSON.stringify(problemList.value));
            for (var pro of resultList.value) {
                if (pro.type === 'subjective') {
                    pro.typeName = '简答题';
                } else if (pro.type === 'objective') {
                    pro.typeName = '单选题';
                }
                
            }
            selectedProblem.value = resultList.value[0];
            selectedIndex.value = 0;
        }, 100);
        console.log("获取problemList:", problemList.value);
    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}
onMounted(async () => {
    await fetchProblems();
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

//题目筛选
const typeOptions = [{
    value: 'objective',
    label: '单选题'
}, {
    value: 'subjective',
    label: '简答题'
}
]
const subjectOptions = [
    {
        value: '01',
        label: '大类一',
        children: [
            {
                value: '0101',
                label: '病种一'
            },
            {
                value: '0102',
                label: '病种二'
            },
            {
                value: '0103',
                label: '病种三'
            }
        ]
    },
    {
        value: '02',
        label: '大类二',
        children: [
            {
                value: '0201',
                label: '病种四'
            }
        ]
    },
    {
        value: '03',
        label: '大类三',
        children: [
            {
                value: '',
                label: ''
            }
        ]
    }
]
const searchTitle = ref('');
const chosenType = ref('');
const chosenSubject = ref('');
const resultList = ref<ProblemInfo[]>([]);
// const resultList = ref<{ problemId?: string; type?: string; subjectId?: string; title?: string; content?: string; answer?: string; background?: string; gradingPoints?: string; }[]>([]);
function searchProblems() {
    resultList.value.splice(0, resultList.value.length);
    for (var i in problemList.value) {
        var pro = problemList.value[i];
        if (pro.type == chosenType.value[0]) {
            resultList.value.push(problemList.value[i]);
        }
    }
    selectedProblem.value = resultList.value[0];
    selectedIndex.value = 0;
    console.log('筛选结果:', resultList);
}


function selectProblemWithId(id: string) {
    var temp = resultList.value.find(pro => pro.problemId === id);
    if (temp != null) {
        selectedProblem.value = temp;
        selectedIndex.value = resultList.value.indexOf(temp);
    }
    console.log("选择题目:", selectedProblem.value.title);
}

const rowClassName = ({rowIndex}:{rowIndex:number}) => {
    console.log('rowIndex=',rowIndex,' selectedIndex=',selectedIndex.value);
    if (rowIndex === selectedIndex.value) {
        return 'current-row';
    } else {
        return '';
    } 
};


//题目跳转
function jumpProblem(i: number) {
    var pro = resultList.value[i];
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
function randomProblem() {
    var rand = Math.floor(Math.random() * resultList.value.length);
    jumpProblem(rand);
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

const url = ''
</script>

<style scoped lang="scss">
.onlineTestLayout {
    margin-left: 5%;
    margin-right: 5%;
}

.problem-content {
    padding: 0 6vw;
}

.problem-answer {
    margin-top: 3vw;
    padding: 0 5vw;
}

.problerm-search {
    display: flex;
    flex-direction: column;
    padding: 2vw;
}

.testButton {
    display: flex;
    justify-content: center;
}

.result-content {
    min-height: 400px;
    max-height: 400px;
}

.problemset-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
}


.current-row {
    background-color: #f5f7fa !important;
}
</style>
