<!-- eslint-disable vue/require-v-for-key -->
<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="60%">
                <el-header>
                    <h3 v-if="selectedProblem.score">题{{ selectedIndex + 1 }}:（{{ selectedProblem.score }}分）</h3>
                    <h3 v-else>题{{ selectedIndex + 1 }}:</h3>
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
                        <el-button @click="priorProblem()" :disabled="selectedIndex === 0">上一题</el-button>
                        <el-button @click="nextProblem()"
                            :disabled="selectedIndex === problemList.length - 1">下一题</el-button>
                    </div>
                </el-footer>
            </el-container>
            <el-aside>

                <div class="countdown" v-if="!noTimeLimit">
                    剩余时间：
                    {{ Math.floor(clock / 3600000) }}h {{ Math.floor((clock % 3600000) / 60000) }}m {{
                        Math.floor((clock % 60000) / 1000) }}s
                </div>

                <div class="problem-table">
                    <div class="problem-number" v-for="(pro, index) in problemList">
                        <el-button style="width: 45px" @click="jumpProblem(index)" :style="{
                        background: index === selectedIndex ? '#b46cf577' : (answer[index] !== undefined && answer[index] !== '' ? '#7fffd466' : '')
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

    <el-dialog v-model="submitDialog" title="" width="400" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <span>{{ warningMsg }}</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="clock !== 0" @click="submitDialog = false">取消</el-button>
                <el-button type="primary" @click="checkAnswerMap(); submit(); submitDialog = false; ">
                    提交
                </el-button>

            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted, watch } from 'vue';
import { store } from '@/main'
import { StorageToken } from '@/scripts/storage'
import { Personnel } from '@/apis/class';
import { pageQuery as problemSetQuery } from '@/apis/problemSet/problemSet';
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { update } from '@/apis/testRecord/testRecord';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { TestRecordPageRequest, TestRecordPageResponse, TestRecordUpdateRequest, TestRecordUpdateResponse } from '@/apis/testRecord/testRecord-interface';
import type { ProblemBO, ProblemSetBO, TestRecordBO } from '@/apis/schemas';

defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Test",
})

const emit = defineEmits(['content']);
const props = defineProps({
    testId: String,
    enterTime: Date,
    autoSubmit: Boolean
});

const warningMsg = ref('确认提交试卷？');
const choices = ref(['A', 'B', 'C', 'D']);
const noTimeLimit = ref(true);
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

const problemList = ref<{ problem: ProblemBO, score: number }[]>([]);
async function fetchProblems() {
    try {
        const problemSetRequest: ProblemSetPageRequest = { problemSetId: props.testId };
        const problemSetResponse = await problemSetQuery(problemSetRequest);
        const idList = problemSetResponse.data.datas[0].problemIdList;
        const scoreList = problemSetResponse.data.datas[0].problemScoreMap;
        clock.value = problemSetResponse.data.datas[0].duration;
        if (problemSetResponse.data.datas[0].duration > 0) {
            noTimeLimit.value = false;
        }
        idList.forEach(async (id: string) => {
            const problemRequest: ProblemPageRequest = { problemId: id };
            const problemResponse = await problemQuery(problemRequest);
            var temp = {
                problem: problemResponse.data.datas[0],
                score: scoreList[id]
            };
            temp.problem.content = (temp.problem.content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1'); //单选题选项换行
            problemList.value.push(temp);
        })
        setTimeout(() => { jumpProblem(selectedIndex.value); }, 1000);

    } catch (error) {
        console.error('获取试卷题目失败！', error);
    }
}
onMounted(async () => {
    await fetchProblems();
    setTimeout(() => {
        problemList.value.forEach((pro) => {
            if(pro.problem.problemId){
                answerMap.set(pro.problem.problemId, '');
            }
        });
    }, 100)

})

//考试倒计时
const count = setInterval(() => {
    if (clock.value >= 1000) {
        clock.value -= 1000;
    } else if (clock.value == 0) {
        clearInterval(count);
        if (!noTimeLimit.value) {
            warningMsg.value = '考试时间已结束！';
            submitDialog.value = true;
        }
    }
}, 1000);

//题目跳转
function jumpProblem(i: number) {
    var pro = problemList.value[i];
    if (pro != null) {
        saveAnswer();
        // console.log(answer.value[i]);
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
    if(pro.problem.problemId){
        answerMap.set(pro.problem.problemId, temp??'');
    }

}

//检查是否已完成全部题目
function checkAnswerMap() {
    saveAnswer();
    warningMsg.value = '确认提交试卷？';
    problemList.value.forEach(pro => {
        if (pro.problem.problemId && (!answerMap.has(pro.problem.problemId) || answerMap.get(pro.problem.problemId ?? '') === '')) {
            warningMsg.value = '有题目未作答，确认提交？';
            answerMap.set(pro.problem.problemId ?? '', '');
        }
    })
    // console.log('answerMap:', answerMap);
}

//提交试卷
var submitDialog = ref(false)
async function submit() {
    saveAnswer();
    const testRecord: TestRecordBO = {
        problemSetId: '',
        candidateId: '',
        startTime: new Date(0),
        submitTime: new Date(),
        answerMap: {}
    };
    testRecord.problemSetId = props.testId;
    const userInfo = ref(store.state.token);
    testRecord.candidateId = userInfo.value.personnelId; //考生id
    testRecord.startTime = props.enterTime; //进入测试时间
    console.log('进入测试时间:', testRecord.startTime);
    testRecord.answerMap = Object.fromEntries(answerMap); //题目id-->考生答案
    const submitContent: TestRecordUpdateRequest = {
        testRecord: testRecord,
        delete: false,
        submitted: false
    };
    try {
        const updateResponse = await update(submitContent);
        if (updateResponse && updateResponse.data) {
            const id = updateResponse.data.testRecordId;
            console.log("更新测试记录:", updateResponse.data);
            const confirmSubmission: TestRecordUpdateRequest = {
                testRecord: {
                    testRecordId: id,
                },
                delete: false,
                submitted: true
            };
            const submitResponse = await update(confirmSubmission);
            console.log("提交测试记录:", submitResponse.data);
            console.log(props.enterTime);
        } else {
            console.log('没有数据！');
        }
        emit('content', 'ProblemSet'); //返回试卷列表
    } catch (error) {
        console.error('更新测试记录失败！', error);
    }

}

watch(() => props.autoSubmit, async (auto) => {
    if (auto) {
        console.log('退出强制提交',props.autoSubmit);
        checkAnswerMap();
        await submit();
    }
});


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

.countdown {
    color: crimson;
}
</style>