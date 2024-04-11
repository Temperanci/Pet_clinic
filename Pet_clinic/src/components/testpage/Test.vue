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
                        <el-radio-group v-if="selectedProblem.type === 'objective'" v-model="answer[selectedIndex]">
                            <el-radio v-for="(choice, index) in choices" :key="index" :label="choice">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-else-if="selectedProblem.type === '多选题'" v-model="chosenAnswers">
                            <el-checkbox v-for="(choice, index) in choices" :key="index" :label="choices">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-input v-else-if="selectedProblem.type === 'subjective'" type="textarea" placeholder="在此输入答案"
                            v-model="answer[selectedIndex]" />
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
import { ref, onMounted } from 'vue';
import { pageQuery } from '@/apis/problem/problem';
import { update } from '@/apis/testRecord/testRecord';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { TestRecordPageRequest, TestRecordPageResponse, TestRecordUpdateRequest } from '@/apis/testRecord/testRecord-interface';
import type { ProblemBO, TestRecordBO } from '@/apis/schemas';

defineComponent({
    name: "Test",
})

const ProblemPage = ref<ProblemPageResponse>({ datas: [], total: 0, limit: 0 });
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
        const response = await pageQuery(1);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            const response = await pageQuery(i);
            if (response && response.data && response.data.datas) {
                ProblemPage.value = response.data;
                for (var j in ProblemPage.value.datas) { //单选题内容换行
                    ProblemPage.value.datas[j].content = ProblemPage.value.datas[j].content.replace(/(A\.|B\.|C\.|D\.)/g, '\n$1');
                }
                problemList.value = problemList.value.concat(ProblemPage.value.datas);
                selectedProblem.value = problemList.value[selectedIndex.value];
            } else {
                console.error('No data returned from the API');
            }
        }
        console.log("获取problemList:", problemList.value);
    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}
onMounted(async () => {
    await fetchProblems();

});



const props = defineProps({
    testId: String
})
const choices = ref(['A', 'B', 'C', 'D']);
const answer = ref<string[]>([]);
const answerMap = new Map<string, string>();


const chosenAnswer = ref('');
const chosenAnswers = ref([]);
const inputAnswer = ref('');


function jumpProblem(i: number) {
    var pro = problemList.value[i];
    if (pro != null) {
        saveAnswer();
        selectedProblem.value = pro;
        selectedIndex.value = i;
        console.log('跳转至题目:', selectedProblem.value.title);
    } else {
        console.log('跳转失败');
    }
}
function nextProblem() {
    saveAnswer();
    jumpProblem(selectedIndex.value + 1);
}
function priorProblem() {
    saveAnswer();
    jumpProblem(selectedIndex.value - 1);
}
function submit() {
    saveAnswer();
    const testRecord: TestRecordBO = {
        // score: 0,
        // graded: false,
        // gradeMap: {},
        answerMap: {}, //题目id-->考生答案
        startTime: new Date(),
        // submitted: true,
        // answerList: [],
        submitTime: new Date(),
        candidateId: '114514',
        problemSetId: '',

    };
    testRecord.problemSetId = props.testId ?? '';
    testRecord.answerMap = Object.fromEntries(answerMap);
    console.log("提交测试:", testRecord.problemSetId);
    // console.log("测试记录:", testRecord.answerMap);
    const submitContent: TestRecordUpdateRequest = {
        testRecord: testRecord,
        // delete: false,
        submitted: true
    };
    const temp=update(submitContent);
}
function saveAnswer() { //切换题目时自动保存答案
    var pro = selectedProblem.value;
    var temp = answer.value[selectedIndex.value];
    if (temp != null) {
        if (pro.type == 'objective') {
            console.log("单选:", temp);
            answerMap.set(pro.problemId, temp);
        } else if (pro.type == '多选题') {
            console.log("多选:", temp);
            answerMap.set(pro.problemId, temp);
        } else if (pro.type == 'subjective') {
            console.log("简答:", temp);
            answerMap.set(pro.problemId, temp);
        }
    }
}


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
}
</style>