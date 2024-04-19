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
                            <el-button size="small"
                                @click="handleEnterTest(scope.row.problemSetId, scope.row.title, scope.row.startTime, scope.row.endTime, scope.row.duration)">进入测试</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
        <el-footer>
            <div class="problemset-pagination">
                <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                    :current-page="current" :page-size="size" :total=problemSetList.length layout="prev, pager, next, jumper" />
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
    <el-dialog v-model="failureDialog" title="" width="300">
        <span>{{ failMsg }}无法参加测试！</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="failureDialog = false;">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue'
import { pageNoQuery } from '@/apis/problemSet/problemSet';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';
import type { ProblemSetBO } from '@/apis/schemas';

defineComponent({
    name: "ProblemSet"
})

const ProblemSetPage = ref<ProblemSetPageResponse>({ datas: [], total: 0, limit: 0 });
var problemSetList = ref(ProblemSetPage.value?.datas);
async function fetchProblemSets() {
    try {
        const response = await pageNoQuery(1);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        // console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            const response = await pageNoQuery(i);
            if (response && response.data && response.data.datas) {
                ProblemSetPage.value = response.data;
                problemSetList.value = problemSetList.value.concat(ProblemSetPage.value.datas);
            }
            else {
                console.error('No data returned from the API');
            }
        }
        // console.log("获取problemSetList:", problemSetList.value);
    } catch (error) {
        console.error('Error fetching problemSets:', error);
    }
}
onMounted(async () => {
    await fetchProblemSets();

});

// 处理试卷列表
function loadCurrentList() {
    const currentList: { problemSetId: string, title: string, desc: string, startTimeStr: string, startTime: Date, endTimeStr: string, endTime: Date, durationStr: string, duration: number }[] = [];
    for (var i in problemSetList.value) {
        var index = problemSetList.value.indexOf(problemSetList.value[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            const temp: { problemSetId: string, title: string, desc: string, startTimeStr: string, startTime: Date, endTimeStr: string, endTime: Date, durationStr: string, duration: number } = {
                problemSetId: "",
                title: "",
                desc: "",
                startTimeStr: "",
                startTime: new Date(0),
                endTimeStr: "",
                endTime: new Date('9999-12-31T23:59:59'),
                durationStr: "",
                duration: 0
            };
            temp.problemSetId = problemSetList.value[i].problemSetId ?? "";
            temp.title = problemSetList.value[i].title ?? "";
            temp.desc = problemSetList.value[i].desc ?? "";
            if (problemSetList.value[i].startTime != null) {
                temp.startTimeStr = problemSetList.value[i].startTime?.toString().slice(0, 10) + ' ' + problemSetList.value[i].startTime?.toString().slice(11, 16);
                temp.startTime = problemSetList.value[i].startTime ?? new Date();
            }
            if (problemSetList.value[i].endTime != null) {
                temp.endTimeStr = problemSetList.value[i].endTime?.toString().slice(0, 10) + ' ' + problemSetList.value[i].endTime?.toString().slice(11, 16);;
                temp.endTime = problemSetList.value[i].endTime ?? new Date();
            }
            if (problemSetList.value[i].duration != null) {
                var hour = Math.floor((problemSetList.value[i].duration ?? 0) / (1000 * 60 * 60));
                var min = Math.floor((problemSetList.value[i].duration ?? 0) / (1000 * 60) - hour * 60);
                temp.durationStr = hour + "h" + min + "min";
                temp.duration = problemSetList.value[i].duration ?? 0;
            }
            currentList.push(temp);
        }
    }
    // console.log("当前分页数据:", currentList);
    return currentList;
}

// 进入测试
const confirmDialog = ref(false);
const failureDialog = ref(false);
const failMsg = ref('');
const handleEnterTest = (id: string, title: string, startTime: Date, endTime: Date, duration: number) => {
    var current = new Date();
    var start = new Date(startTime);
    var end = new Date(endTime);
    // console.log('当前时间:', current, '\n开始时间:', start, '\n截止时间:', end);
    if (current.getTime() < start.getTime()) {
        failMsg.value = '未到测试开始时间,';
        failureDialog.value = true;
    } else if (current.getTime() > end.getTime()) {
        failMsg.value = '已过测试截止时间,';
        failureDialog.value = true;
    } else {
        selectedTest.value.id=id;
        selectedTest.value.title=title;
        selectedTest.value.start=start;
        selectedTest.value.end=end;
        selectedTest.value.duration=duration;
        confirmDialog.value = true;
    }
}
const selectedTest = ref({
    id: "",
    title: "",
    start: new Date(0),
    end: new Date('9999-12-31T23:59:59'),
    duration: 999999999
});
const emit = defineEmits(['content', 'id', 'time'])
const enterTest = () => {
    emit('content', 'Test');
    emit('id', selectedTest.value.id);
    var enterTime = new Date();
    emit('time', enterTime);
    console.log('进入测试时间:', enterTime);
}

// 前端分页处理
var current = ref(1);
var size = ref(10);
function handleCurrentChange(n: number) {
    current.value = n;
    // console.log('当前页号:', n);
}
function handleSizeChange(n: number) {
    size.value = n;
}

</script>

<style scoped lang="scss">
.problemset-content {
    min-height: 500px;
    max-height: 500px;
    padding: 0 50px;
}

.problemset-pagination {
    text-align: center;
    display: flex;
    justify-content: center;
}
</style>