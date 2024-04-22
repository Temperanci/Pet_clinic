<template>
    <el-container>
        <el-main>
            <div class="problemset-content">
                <el-table :data="loadCurrentList()" border>
                    <!-- <el-table-column prop="problemSetId" label="id" width="" /> -->
                    <el-table-column prop="title" label="名称" width="300px" />
                    <el-table-column prop="desc" label="描述" width="" />
                    <el-table-column prop="startTimeStr" label="开始时间" width="200px" />
                    <el-table-column prop="endTimeStr" label="截止时间" width="200px" />
                    <el-table-column prop="durationStr" label="时长限制" width="100px" />
                    <el-table-column label="" width="100px">
                        <template #default="scope">
                            <el-button v-if="!scope.row.submitted" size="small"
                                @click="handleEnterTest(scope.row.problemSetId, scope.row.title, scope.row.startTime, scope.row.endTime, scope.row.duration)">进入测试</el-button>
                            <el-button v-else-if="scope.row.status === 'judging'" size="small"
                                type="warning" @click="watingDialog=true;">批卷中…</el-button>
                            <el-button v-else size="small" type="danger" @click="enterTestRecord(scope.row.problemSetId)">查看成绩</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
        <el-footer>
            <div class="problemset-pagination">
                <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                    :current-page="current" :page-size="size" :total=problemSetList.length
                    layout="prev, pager, next, jumper" />
            </div>
        </el-footer>
    </el-container>

    <el-dialog v-model="confirmDialog" title="" width="300">
        <span>是否进入测试？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="confirmDialog = false">取消</el-button>
                <el-button type="primary" @click="confirmDialog = false; enterTest();">
                    进入
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="watingDialog" title="" width="300">
        <span>试卷正在批改，请耐心等待~</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="warning" @click="watingDialog = false;">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="failureDialog" title="" width="300">
        <span>{{ failMsg }}无法参加测试！</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="info" @click="failureDialog = false;">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue'
import type { Ref } from "vue";
import { store } from '@/main'
import { pageNoQuery } from '@/apis/problemSet/problemSet';
import { pageQuery as testRecordQuery } from '@/apis/testRecord/testRecord';
import type { ProblemSetPageRequest, ProblemSetPageResponse } from '@/apis/problemSet/problemSet-interface';
import type { TestRecordPageRequest, TestRecordPageResponse } from '@/apis/testRecord/testRecord-interface';
import type { ProblemSetBO, TestRecordBO } from '@/apis/schemas';

defineComponent({
    name: "ProblemSet"
})
const userInfo = ref(store.state.token);

const problemSetList: Ref<ProblemSetBO[]> = ref([]);
async function fetchProblemSets() {
    try {
        const response = await pageNoQuery(1);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        for (var i = 1; i <= pages; i++) {
            const response = await pageNoQuery(i);
            if (response && response.data && response.data.datas) {
                problemSetList.value = problemSetList.value.concat(response.data.datas);
            }
            else {
                console.log('没有数据！');
            }
        }
        // console.log("获取problemSetList:", problemSetList.value);
    } catch (error) {
        console.error('获取测试失败！', error);
    }
}
const userTestRecordList: Ref<TestRecordBO[]> = ref([]);
async function fetchUserTestRecords() { //加载当前用户的测试记录
    try {
        const request: TestRecordPageRequest = {
            candidateId: userInfo.value.personnelId
        }
        const response = await testRecordQuery(request);
        if (response && response.data && response.data.datas) {
            userTestRecordList.value = response.data.datas;
        }
        // console.log('获取用户测试记录:',userTestRecordList.value);
    } catch (error) {
        console.error('获取用户测试记录失败！', error);
    }
}
onMounted(async () => {
    await fetchProblemSets();
    await fetchUserTestRecords();
    setTimeout(() => {
        handleProblemSetList();
    }, 50)
});

interface problemSetInfo {
    problemSetId?: string;
    title?: string;
    desc?: string;
    startTimeStr?: string;
    startTime?: Date;
    endTimeStr?: string;
    endTime?: Date;
    durationStr?: string;
    duration?: number;
    status?: string;
    submitted?: boolean;
}

// 处理试卷列表
const resultList: Ref<problemSetInfo[]> = ref([]);
function handleProblemSetList() {
    for (var i in problemSetList.value) {
        const temp: problemSetInfo = {
            problemSetId: "",
            title: "",
            desc: "",
            startTimeStr: "",
            startTime: new Date(0),
            endTimeStr: "",
            endTime: new Date('2077-12-31T23:59:59'),
            durationStr: "",
            duration: 0,
            status: "unsubmitted",
            submitted: false
        };
        temp.problemSetId = problemSetList.value[i].problemSetId ?? "";
        temp.title = problemSetList.value[i].title ?? "";
        temp.desc = problemSetList.value[i].desc ?? "";
        if (problemSetList.value[i].startTime) {
            temp.startTime = new Date(problemSetList.value[i].startTime??0);
            temp.startTimeStr = temp.startTime.getFullYear() + '-' + (temp.startTime.getMonth() + 1) + '-' + temp.startTime.getDate() + ' ' + temp.startTime.getHours().toString().padStart(2, '0') + ':' + temp.startTime.getMinutes().toString().padStart(2, '0');
            // temp.startTimeStr = problemSetList.value[i].startTime?.toString().slice(0, 10) + ' ' + problemSetList.value[i].startTime?.toString().slice(11, 16);
        }
        if (problemSetList.value[i].endTime && problemSetList.value[i].endTime < new Date('2077-12-31T23:59:59')) {
            temp.endTime = new Date(problemSetList.value[i].endTime??'2077-12-31T23:59:59');
            temp.endTimeStr = temp.endTime.getFullYear() + '-' + (temp.endTime.getMonth() + 1) + '-' + temp.endTime.getDate() + ' ' + temp.endTime.getHours().toString().padStart(2, '0') + ':' + temp.endTime.getMinutes().toString().padStart(2, '0');
            // temp.endTimeStr = problemSetList.value[i].endTime?.toString().slice(0, 10) + ' ' + problemSetList.value[i].endTime?.toString().slice(11, 16);;
        }
        if (problemSetList.value[i].duration) {
            var hour = Math.floor((problemSetList.value[i].duration ?? 0) / (1000 * 60 * 60));
            var min = Math.floor((problemSetList.value[i].duration ?? 0) / (1000 * 60) - hour * 60);
            if (hour > 0) {
                temp.durationStr = hour + "h" + min + "min";
            } else if (min > 0) {
                temp.durationStr = min + "min";
            } else {
                temp.durationStr = "";
            }
            temp.duration = problemSetList.value[i].duration ?? 0;
        }
        if (userTestRecordList.value.some(record => record.problemSetId === temp.problemSetId)) { //批卷情况
            temp.status = userTestRecordList.value.find(record => record.problemSetId === temp.problemSetId)?.graded ? 'judged' : 'judging';
            temp.submitted = true;
        } else {
            temp.status = 'unsubmitted';
            temp.submitted = false;
        }
        resultList.value.push(temp);
    }
    console.log('resultList:', resultList.value);
}



// 进入测试
const confirmDialog = ref(false);
const watingDialog = ref(false);
const failureDialog = ref(false);
const failMsg = ref('');
const handleEnterTest = (id: string, title: string, startTime: Date, endTime: Date, duration: number) => {
    var current = new Date();
    var start = new Date(startTime);
    var end = new Date(endTime);
    if (current.getTime() < start.getTime()) {
        failMsg.value = '未到测试开始时间,';
        failureDialog.value = true;
    } else if (current.getTime() > end.getTime()) {
        failMsg.value = '已过测试截止时间,';
        failureDialog.value = true;
    } else {
        selectedTest.value.id = id;
        selectedTest.value.title = title;
        selectedTest.value.start = start;
        selectedTest.value.end = end;
        selectedTest.value.duration = duration;
        confirmDialog.value = true;
    }
}
const selectedTest = ref({
    id: "",
    title: "",
    start: new Date(0),
    end: new Date('2077-12-31T23:59:59'),
    duration: 0
});
const emit = defineEmits(['content', 'id', 'time'])
const enterTest = () => {
    emit('id', selectedTest.value.id);
    var enterTime = new Date();
    emit('time', enterTime);
    console.log('进入测试时间:', enterTime);
    emit('content', 'Test');
}
// 查看成绩
function enterTestRecord(problemSetId: string){
    emit('id',problemSetId);
    emit('content', 'TestRecord');
}
// 前端分页处理
var current = ref(1);
var size = ref(10);
function handleCurrentChange(n: number) {
    current.value = n;
}
function handleSizeChange(n: number) {
    size.value = n;
}
function loadCurrentList() {
    const currentList: problemSetInfo[] = [];
    for (var i in resultList.value) {
        var index = resultList.value.indexOf(resultList.value[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            currentList.push(resultList.value[i]);
        }
    }
    return currentList;
}

</script>

<style scoped lang="scss">
.problemset-content {
    min-height: 500px;
    max-height: 500px;
    padding: 10px 50px;
}

.problemset-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
}
</style>