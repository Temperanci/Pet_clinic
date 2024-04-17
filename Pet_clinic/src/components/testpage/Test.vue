<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="60%">
                <el-header>
                    <h3>题{{ selectedIndex + 1 }}:（{{ selectedProblem.score }}分）</h3>
                    <h4>{{ selectedProblem.problem.title }}</h4>
                </el-header>
                <el-main>
                    <div class="problem-content">
                        <pre style="font-size: larger;">{{ selectedProblem.problem.content }}</pre>
                        <el-radio-group v-if="selectedProblem.problem.type === 'objective'"
                            v-model="answer[selectedIndex]">
                            <el-radio v-for="(choice, index) in choices" :key="index" :label="choice">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <!-- <el-checkbox-group v-else-if="selectedProblem.type === '多选题'" v-model="chosenAnswers">
                            <el-checkbox v-for="(choice, index) in choices" :key="index" :label="choices">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group> -->
                        <el-input v-else-if="selectedProblem.problem.type === 'subjective'" type="textarea"
                            placeholder="在此输入答案" v-model="answer[selectedIndex]" />
                    </div>
                </el-main>
                <el-footer>
                    <div class="test-button">
                        <el-button @click="priorProblem()">上一题</el-button>
                        <el-button @click="nextProblem()">下一题</el-button>
                    </div>
                </el-footer>
            </el-container>
            <el-aside>

                <div class="countdown">
                    剩余时间：
                    {{ Math.floor(clock / 3600000) }}h {{ Math.floor((clock % 3600000) / 60000) }}min {{
                        Math.floor((clock % 60000) / 1000) }}s
                </div>

                <div class="problem-table">
                    // eslint-disable-next-line vue/require-v-for-key
                    <div class="problem-number" v-for="(pro, index) in problemList">
                        <el-button style="width: 45px" @click="jumpProblem(index)" :style="{
                        background: index === selectedIndex ? 'aqua' : (answer[index] !== undefined && answer[index] !== '' ? 'aquamarine' : '')
                    }">
                            {{ index + 1 }}
                        </el-button>
                    </div>
                </div>
                <div class="test-button">
                    <el-button @click="submitDialog = true; checkAnswerMap();">提交</el-button>
                </div>
            </el-aside>
        </el-container>
    </div>

    <el-dialog v-model="submitDialog" title="" width="400">
        <span>{{ warningMsg }}</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="clock !== 0" @click="submitDialog = false">取消</el-button>
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

const warningMsg = ref('确认提交试卷？');
const choices = ref(['A', 'B', 'C', 'D']);
const clock = ref(999999);
const answer = ref<string[]>([]); //暂存答案
const answerMap = new Map<string, string>(); //题号id-->考生答案


const selectedIndex = ref(0);
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
        clock.value = problemSetResponse.data.datas[0].duration;
        // clock.value = 2000;
        console.log('获取测试:', problemSetResponse.data.datas[0]);
        idList.forEach(async (id: string) => {
            const problemRequest: ProblemPageRequest = { problemId: id };
            const problemResponse = await problemQuery(problemRequest);
            var temp = {
                problem: problemResponse.data.datas[0],
                score: scoreList[id]
            };
            temp.problem.content = (temp.problem.content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1'); //单选题选项换行
            console.log('获取题目:', temp);
            problemList.value.push(temp);
        })
        console.log("获取problemList:", problemList.value);
        setTimeout(() => { jumpProblem(selectedIndex.value); }, 100);

    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}

onMounted(async () => {
    await fetchProblems();
})

//考试倒计时
const count = setInterval(() => {
    if (clock.value >= 1000) {
        clock.value -= 1000;
    } else if (clock.value == 0) {
        clearInterval(count);
        warningMsg.value='考试时间已结束！';
        submitDialog.value = true;
    }
}, 1000);

//题目跳转
function jumpProblem(i: number) {
    var pro = problemList.value[i];
    if (pro != null) {
        saveAnswer();
        console.log(answer.value[i]);
        selectedProblem.value = pro;
        selectedIndex.value = i;
        // console.log('跳转至题', i + 1, ':', selectedProblem.value.problem.title);
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

//切换题目时自动保存答案
function saveAnswer() {
    var pro = selectedProblem.value;
    var temp = answer.value[selectedIndex.value];
    if (pro.problem.type == 'objective') {
        // console.log("单选:", temp);
        answerMap.set(pro.problem.problemId ?? '', temp);
    } else if (pro.problem.type == 'subjective') {
        // console.log("简答:", temp);
        answerMap.set(pro.problem.problemId ?? '', temp);
    }
}

//检查是否已完成全部题目
function checkAnswerMap() {
    saveAnswer();
    problemList.value.forEach(pro => {
        if (pro.problem.problemId && !answerMap.has(pro.problem.problemId)) {
            console.log('未答题:', problemList.value.indexOf(pro));
            warningMsg.value = '有题目未作答，确认提交？';
        }
    })
}

//提交试卷
function submit() {
    saveAnswer();
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
    var temp = update(submitContent);
    console.log("提交测试记录:", temp);
    emit('content', 'ProblemSet'); //返回试卷列表
}
var submitDialog = ref(false)

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
.countdown{
    color: crimson;
}
</style>