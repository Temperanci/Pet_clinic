<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="60%">
                <el-header>
                    <h3>{{ selectedProblem.title }}</h3>
                </el-header>
                <el-main>
                    <div class="problemContent">
                        <pre style="font-size: larger;">{{ selectedProblem.content }}</pre>
                        <el-radio-group v-if="selectedProblem.type === '单选题'" v-model="chosenAnswer">
                            <el-radio v-for="(choice, index) in choices" :key="index" :label="choice">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-else-if="selectedProblem.type === '多选题'" v-model="chosenAnswers">
                            <el-checkbox v-for="(choice, index) in choices" :key="index" :label="choices">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-input v-else-if="selectedProblem.type === '简答题'" type="textarea" placeholder="在此输入答案"
                            v-model="inputAnswer" />
                    </div>
                </el-main>
                <el-footer>
                    <div class="testButton">
                        <el-button @click="priorProblem()">上一题</el-button>
                        <el-button @click="nextProblem()">下一题</el-button>
                        <el-button @click="submit()">提交</el-button>
                    </div>

                </el-footer>
            </el-container>
            <el-aside>
                <div class="problemTable">
                    <div class="problemNumber" v-for="(pro, index) in problemList">
                        <el-button style="width: 45px" @click="jumpProblem(index)"
                            :style="{ background: pro.problemId === selectedProblem.problemId ? 'aquamarine' : '' }">{{
                        index + 1 }}</el-button>
                    </div>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted, nextTick, watch } from 'vue';
import { pageQuery } from '@/apis/problem/problem';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { ProblemBO } from '@/apis/schemas';

defineComponent({
    name: "Test",
})

const ProblemPage = ref<ProblemPageResponse>({ datas: [], total: 50, limit: 100 });
const selectedProblem = ref<ProblemBO>({
    type: '',
    title: '',
    answer: '',
    content: '',
    problemId: '',
    subjectId: '',
    background: '',
    gradingPoints: ''
})
var problemList = ref(ProblemPage.value?.datas);
var selectedIndex = ref(0);

async function fetchProblems() {
    try {
        const response = await pageQuery();
        if (response && response.data && response.data.datas) {
            ProblemPage.value = response.data;
            problemList.value = ProblemPage.value.datas;
            console.log("数据量: ", problemList.value.length);
            console.log("获取数据: ", problemList);
            selectedProblem.value = problemList.value[selectedIndex.value];
            // if (ProblemPage.value.datas.length > 0) {
            //     selectedProblem.value = ProblemPage.value.datas[0];
            // }
        } else {
            console.error('No data returned from the API');
        }
    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}
onMounted(async () => {
    await fetchProblems();
    await nextTick();

});



const props = defineProps({
    testId: String
})

function jumpProblem(i: number) {
    saveAnswer();
    // var temp = ProblemList.find(pro => pro.problemId === n);
    var temp = problemList.value[i];
    if (temp != null) {
        selectedProblem.value = temp;
        selectedIndex.value = i;
        console.log('跳转至题', selectedProblem.value.title);
    } else {
        console.log('跳转失败');
    }
}
function nextProblem() {
    saveAnswer();
    jumpProblem(selectedIndex.value + 1)
    console.log('下一题');
}
function priorProblem() {
    saveAnswer();
    jumpProblem(selectedIndex.value - 1)
    console.log('上一题');
}
function saveAnswer() { //切换题目时自动保存答案
    var temp = selectedProblem.value;
    if (temp.type == '单选题') {
        console.log("单选:", chosenAnswer.value);
        answerMap.set(temp.problemId, chosenAnswer.value);
    } else if (temp.type == '多选题') {
        console.log("多选:", chosenAnswers.value);
        answerMap.set(temp.problemId, chosenAnswers.value[0]);
    } else if (temp.type == '简答题') {
        console.log("简答:", inputAnswer.value);
        answerMap.set(temp.problemId, inputAnswer.value);
    }
}


function submit() {

    console.log('提交测试');
    console.log(answerMap);
}


const ProblemList = [{
    problemId: 1,
    type: '单选',
    subjectId: '',
    title: '犬细小病毒',
    content: '犬细小病毒感染通常通过以下哪种途径传播？\nA. 空气飞沫传播\nB. 食物或饮水传播\nC. 虫媒传播\nD. 直接接触传播',
},
{
    problemId: 2,
    type: '多选',
    subjectId: '宠物疾病',
    title: '题2',
    content: '以下哪些症状可能表明猫患上了猫白血病病毒感染？以下哪些症状可能表明猫患上了猫白血病病毒感染？\nA. 慢性呕吐\nB. 鼻血\nC. 脱毛\nD. 昏睡不醒'
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
    content: '请简要介绍一种常见的犬抱歉'
}
]

// const currentProblem = ref(ProblemList[0]);

const choices = ref(['A', 'B', 'C', 'D']);
const chosenAnswer = ref('');
const chosenAnswers = ref([]);
const inputAnswer = ref('');

const answerMap = new Map();

</script>

<style scoped lang="scss">
.onlineTestLayout {
    margin-left: 10%;
    margin-right: 10%;
}

;

.problemContent {
    padding: 0 6vw;
}

;

.problemTable {
    display: flex;
    flex-wrap: wrap;
    padding: 3vw;
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
    justify-content: center;
}
</style>