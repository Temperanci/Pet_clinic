<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="60%">
                <el-header>
                    <h3>题{{ selectedIndex + 1 }}:{{ selectedProblem.problem.title }}</h3>
                </el-header>
                <el-main>
                    <div class="problem-content">
                        <pre style="font-size: larger;">{{ selectedProblem.problem.content }}</pre>
                        <el-radio-group v-if="selectedProblem.problem.type === 'objective'" v-model="answer[selectedIndex]">
                            <el-radio v-for="(choice, index) in choices" :key="index" :label="choice">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <!-- <el-checkbox-group v-else-if="selectedProblem.type === '多选题'" v-model="chosenAnswers">
                            <el-checkbox v-for="(choice, index) in choices" :key="index" :label="choices">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group> -->
                        <el-input v-else-if="selectedProblem.problem.type === 'subjective'" type="textarea" placeholder="在此输入答案"
                            v-model="answer[selectedIndex]" />
                    </div>
                </el-main>
                <el-footer>
                    <div class="test-button">
                        <el-button @click="priorProblem()">上一题</el-button>
                        <el-button @click="nextProblem()">下一题</el-button>
                        <!-- <el-button @click="submitDialog = true">提交</el-button> -->
                    </div>
                </el-footer>
            </el-container>
            <el-aside>
                <div class="problem-table">
                    <div class="problem-number" v-for="(pro, index) in problemList">
                        <el-button style="width: 45px" @click="jumpProblem(index)" :style="{
                        background: index === selectedIndex ? 'aqua' : (answer[index] !== undefined && answer[index] !== '' ? 'aquamarine' : '')
                    }">
                            {{ index + 1 }}
                        </el-button>
                    </div>
                </div>
                <div class="test-button">
                    <el-button @click="submitDialog = true">提交</el-button>
                </div>
            </el-aside>
        </el-container>
    </div>

    <el-dialog v-model="submitDialog" title="" width="400">
        <span>确认提交试卷？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="submitDialog = false">取消</el-button>
                <el-button type="primary" @click="submitDialog = false; submit()">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue';
import { pageQuery as problemSetQuery } from '@/apis/problemSet/problemSet';
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { update } from '@/apis/testRecord/testRecord';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { TestRecordPageRequest, TestRecordPageResponse, TestRecordUpdateRequest } from '@/apis/testRecord/testRecord-interface';
import type { ProblemBO, ProblemSetBO, TestRecordBO } from '@/apis/schemas';

defineComponent({
    name: "Test",
})

const emit = defineEmits(['content']);
const props = defineProps({
    testId: String,
    enterTime: Date
});

const choices = ref(['A', 'B', 'C', 'D']);
const answer = ref<string[]>([]); //暂存答案
const answerMap = new Map<string, string>(); //题号id-->考生答案

var selectedIndex = ref(0);
const selectedProblem = ref<{ problem: ProblemBO, score: number }>({
    problem: {
        type: '',
        title: '',
        answer: '',
        content: '',
        problemId: '',
        subjectId: '',
        background: '',
        gradingPoints: ''
    },
    score: 0
})

// const ProblemPage = ref<ProblemPageResponse>({ datas: [], total: 0, limit: 0 });
const problemList = ref<{ problem: ProblemBO, score: number }[]>([]);
async function fetchProblems() {
    try {
        const problemSetRequest: ProblemSetPageRequest = { problemSetId: props.testId };
        const problemSetResponse = await problemSetQuery(problemSetRequest);
        const idList = problemSetResponse.data.datas[0].problemIdList;
        const scoreList = problemSetResponse.data.datas[0].problemScoreMap;
        console.log('获取测试:',problemSetResponse.data.datas[0]);
        idList.forEach(async (id:string) => {
            const problemRequest: ProblemPageRequest = {problemId: id};
            const problemResponse = await problemQuery(problemRequest);
            var temp = {
                problem:problemResponse.data.datas[0],
                score:scoreList[id]
            };
            temp.problem.content = (temp.problem.content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1'); //单选题选项换行
            console.log('获取题目:',temp);
            problemList.value.push(temp);
        })
        console.log("获取problemList:", problemList.value);
    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}
// async function fetchProblems() {
//     try {
//         const response = await problemQuery(1);
//         const pages = Math.ceil(response.data.total / response.data.limit); //总页数
//         console.log("total=", response.data.total, " limit=", response.data.limit);
//         for (var i = 1; i <= pages; i++) {
//             const response = await problemQuery(i);
//             if (response && response.data && response.data.datas) {
//                 ProblemPage.value = response.data;
//                 for (var j in ProblemPage.value.datas) { //单选题内容换行
//                     ProblemPage.value.datas[j].content = (ProblemPage.value.datas[j].content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1');
//                 }
//                 problemList.value = problemList.value.concat(ProblemPage.value.datas);
//                 selectedProblem.value = problemList.value[selectedIndex.value];
//             } else {
//                 console.error('No data returned from the API');
//             }
//         }
//         console.log("获取problemList:", problemList.value);
//     } catch (error) {
//         console.error('Error fetching problems:', error);
//     }
// }
onMounted(async () => {
    await fetchProblems();
})

//题目跳转
function jumpProblem(i: number) {
    var pro = problemList.value[i];
    if (pro != null) {
        saveAnswer();
        console.log(answer.value[i]);
        selectedProblem.value = pro;
        selectedIndex.value = i;
        console.log('跳转至题', i + 1, ':', selectedProblem.value.problem.title);
    } else {
        console.log('跳转失败，题目不存在！');
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

//切换题目时自动保存答案
function saveAnswer() {
    var pro = selectedProblem.value;
    var temp = answer.value[selectedIndex.value];
    if (pro.problem.type == 'objective') {
        console.log("单选:", temp);
        answerMap.set(pro.problem.problemId ?? '', temp);
    } else if (pro.problem.type == 'subjective') {
        console.log("简答:", temp);
        answerMap.set(pro.problem.problemId ?? '', temp);
    }
}

//提交试卷
function submit() {
    saveAnswer();
    // answer.value.forEach(ans => {
    //     console.log(ans);
    // });
    // if (answer.value.some(ans => ans === undefined || ans === '')) {
    //     console.log('Array answer contains undefined or empty strings');
    // }
    const testRecord: TestRecordBO = {
        problemSetId: '',
        candidateId: '',
        startTime: new Date(),
        answerMap: {}
        // graded: false,
        // gradeMap: {},
    };
    testRecord.problemSetId = props.testId;
    testRecord.candidateId = 'testUser'; //考生id
    testRecord.startTime = props.enterTime; //进入测试时间
    testRecord.answerMap = Object.fromEntries(answerMap); //题目id-->考生答案
    const submitContent: TestRecordUpdateRequest = {
        testRecord: testRecord,
        submitted: false
    };
    // var temp = update(submitContent);
    // console.log("提交测试记录:", temp);
    emit('content', 'ProblemSet'); //返回试卷列表
}
const submitDialog = ref(false)

</script>

<style scoped lang="scss">
.onlineTestLayout {
    margin-left: 10%;
    margin-right: 10%;
}

.problem-content {
    padding: 0 6vw;
}

.problem-table {
    display: flex;
    flex-wrap: wrap;
    padding: 3vw;
}

.problem-number {
    display: inline-block;
    text-align: center;
}

.test-button {
    display: flex;
    justify-content: center;
}
</style>