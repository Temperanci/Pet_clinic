<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="40%">
                <el-header>
                    <h3>{{ currentProblemRef.title }}</h3>
                </el-header>
                <el-main>
                    <div class="problemContent">
                        <p>{{ currentProblemRef.content }}</p>
                        <el-radio-group v-if="currentProblemRef.type === '单选'" v-model="chosenAnswer">
                            <el-radio v-for="(choice, index) in currentProblemRef.choices" :key="index"
                                :label="index + 1">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <!-- <el-checkbox-group v-else-if="currentProblemRef.type === '多选'" v-model="chosenAnswers">
                            <el-checkbox v-for="(choice, index) in currentProblemRef.choices" :key="index"
                                :label="index + 1">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group> -->
                        <el-input v-else-if="currentProblemRef.type === '简答'" type="textarea" placeholder="在此输入答案"
                            v-model="inputAnswer" />
                    </div>
                </el-main>
                <el-footer>
                    <div class="testButton">
                        <el-button @click="priorProblem()">上一题</el-button>
                        <el-button @click="nextProblem()">下一题</el-button>
                        <!-- <el-button @click="">提交</el-button> -->
                    </div>

                </el-footer>
            </el-container>
            <el-aside width="30%">
                    <h4>搜索结果</h4>
                    <el-main>
                      <div class="result-content">
                        <el-table :data="loadCurrentList()" style="">
                            <el-table-column prop="title" label="题目" />
                            <el-table-column prop="subjectId" label="知识点" />
                            <el-table-column prop="type" label="题型" />
                            <el-table-column label="" width="100px">
                                <template #default="scope">
                                    <el-button size="small"
                                        @click="chooseSingleProblem(scope.row.problemId)">选择</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>  
                    </el-main>
                    <el-footer>
                       <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :current-page="current" :page-size="size" :total=50 layout="prev, pager, next" /> 
                    </el-footer>
            </el-aside>
            <el-aside>
                <div class="searchSingleProblerm">
                    <h4>筛选题目</h4>
                    <el-input type="textarea" placeholder="在此输入题目标题" v-model="searchTitle" />
                    <p>题目类型</p>
                    <el-cascader placeholder="题目类型" :options="typeOptions" filterable v-model="chosenType"/>
                    <p>病种知识点</p>
                    <el-cascader placeholder="病种知识点" :options="subjectOptions" filterable v-model="chosenSubject"/>

                    <el-button style="margin-top: 50px;" @click="searchProblem()">查找相关题目</el-button>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
    name: "SingleProblem",
})

function chooseSingleProblem(id: number) {
    var temp = ProblemList.find(pro => pro.problemId === id);
    if (temp != null) currentProblemRef.value = temp;
    console.log("选择题目: ", currentProblemRef.value.problemId);
}

function jumpProblem(n: number) {
    var temp = ProblemList.find(pro => pro.problemId === n);
    if (temp != null) {
        currentProblemRef.value = temp;
        console.log('跳转至题', currentProblemRef.value.problemId, currentProblemRef.value.title);
    } else {
        console.log('跳转失败');
    }
}
function nextProblem() {
    jumpProblem(currentProblemRef.value.problemId + 1)
    console.log('下一题');
}
function priorProblem() {
    jumpProblem(currentProblemRef.value.problemId - 1)
    console.log('上一题');
}


const ProblemList = [{
    problemId: 1,
    type: '单选',
    subjectId: '宠物疾病',
    title: '题1',
    content: '犬细小病毒感染通常通过以下哪种途径传播？',
    choices: ['A. 空气飞沫传播', 'B. 食物或饮水传播', 'C. 虫媒传播', 'D. 直接接触传播']
},
{
    problemId: 2,
    type: '多选',
    subjectId: '宠物疾病',
    title: '题2',
    content: '以下哪些症状可能表明猫患上了猫白血病病毒感染？',
    choices: ['A. 慢性呕吐', 'B. 鼻血', 'C. 脱毛', 'D. 昏睡不醒']
},
{
    problemId: 3,
    type: '简答',
    subjectId: '宠物疾病',
    title: '题3',
    content: '请简要介绍一种常见的猫传染性疾病。'
},
{
    problemId: 4,
    type: '单选',
    subjectId: '宠物疾病',
    title: '题4',
    content: '犬瘟热是由以下哪种病毒引起的？',
    choices: ['A. 犬瘟热病毒', 'B. 犬细小病毒', 'C. 猫白血病病毒', 'D. 犬冠状病毒']
},
{
    problemId: 5,
    type: '多选',
    subjectId: '宠物疾病',
    title: '题5',
    content: '以下哪些疾病对猫咪的生命威胁较大？',
    choices: ['A. 猫白血病', 'B. 猫感冒', 'C. 猫瘟热', 'D. 猫糖尿病']
},
{
    problemId: 6,
    type: '简答',
    subjectId: '宠物疾病',
    title: '题6',
    content: '请简要介绍一种常见的犬传染性疾病。'
},
{
    problemId: 7,
    type: '单选',
    subjectId: '宠物疾病',
    title: '题7',
    content: '猫糖尿病是由以下哪种因素引起的？',
    choices: ['A. 遗传因素', 'B. 高糖饮食', 'C. 肥胖', 'D. 环境因素']
},
{
    problemId: 8,
    type: '多选',
    subjectId: '宠物疾病',
    title: '题8',
    content: '以下哪些症状可能表明犬患上了心丝虫病？',
    choices: ['A. 呼吸困难', 'B. 咳嗽', 'C. 腹胀', 'D. 无食欲']
},
{
    problemId: 9,
    type: '简答',
    subjectId: '宠物疾病',
    title: '题9',
    content: '请简要介绍一种常见的犬皮肤疾病。'
},
{
    problemId: 10,
    type: '单选',
    subjectId: '宠物疾病',
    title: '题10',
    content: '以下哪种疾病会导致狗出现间歇性发作的癫痫样抽搐？',
    choices: ['A. 犬瘟热', 'B. 犬癫痫病', 'C. 犬肺炎', 'D. 犬传染性肝炎']
},
{
    problemId: 11,
    type: '多选',
    subjectId: '宠物疾病',
    title: '题11',
    content: '以下哪些疾病可以通过犬与犬之间的直接接触传播？',
    choices: ['A. 犬细小病毒感染', 'B. 犬瘟热', 'C. 犬冠状病毒感染', 'D. 犬传染性肝炎']
},
{
    problemId: 12,
    type: '简答',
    subjectId: '宠物疾病',
    title: '题12',
    content: '请简要介绍一种常见的猫肠道疾病。'
},
{
    problemId: 13,
    type: '单选',
    subjectId: '宠物疾病',
    title: '题13',
    content: '以下哪种疾病会导致猫出现呼吸道感染症状？',
    choices: ['A. 猫白血病病毒感染', 'B. 猫冠状病毒感染', 'C. 猫感冒', 'D. 猫糖尿病']
},
{
    problemId: 14,
    type: '多选',
    subjectId: '宠物疾病',
    title: '题14',
    content: '以下哪些因素可能引起犬皮肤过敏？',
    choices: ['A. 食物过敏', 'B. 花粉过敏', 'C. 虫媒传播', 'D. 药物过敏']
},
{
    problemId: 15,
    type: '简答',
    subjectId: '宠物疾病',
    title: '题15',
    content: '请简要介绍一种常见的犬抱歉，我之前的回答中只提供了题目的信息，没有给出选项和答案。以下是题目、选项和答案的完整信息'
}
]
function loadCurrentList() {
    var currentList: { problemId: number; type: string; subjectId: string; title: string; content: string; choices: string[] }[] = [];
    for (var i in ProblemList) {
        var index = ProblemList.indexOf(ProblemList[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            currentList.push(ProblemList[i]);
        }
    }
    console.log(currentList.length);
    return currentList;
}

const typeOptions = [
    {
        value: '单选',
        label: '单选题'
    },
    {
        value: '多选',
        label: '多选题'
    },
    {
        value: '简答',
        label: '简答题'
    }
];

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

var currentProblem = ProblemList[0];
var currentProblemRef = ref(currentProblem);
var inputAnswer = ref('');
var chosenAnswer = ref(0);
var chosenAnswers = ref([0]);

var searchTitle = ref('');
var chosenType = ref('');
var chosenSubject = ref('');

var resultList: { problemId: number; type: string; subjectId: string; title: string; content: string; choices: string[] }[] = [];
function searchProblem(){
    resultList.splice(0, resultList.length);
    for (var i in ProblemList) {
        var item = ProblemList[i];
        console.log("ProblemList.type:",item.type, "chosenType:",chosenType.value[0], "compare:",item.type==chosenType.value[0]);
        if (item.type==chosenType.value[0]) {
            resultList.push(ProblemList[i]);
        }
    }
    console.log(resultList.length);
}

var current = ref(1);
var size = ref(10);
function handleCurrentChange(n: number) {
    current.value = n;
    console.log('当前页号: ', n);
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

;

.problemContent {
    padding: 0 6vw;
}

;

.searchSingleProblerm {
    display: flex;
    flex-direction: column;
    padding: 2vw;
}

;

.problemNumber {
    display: inline-block;
    text-align: center;
}

;

.testButton {
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.result-content {
    min-height: 300px;
    max-height: 300px;
}
</style>
