<template>
    <el-container>
        <el-main>
            <div class="problemset-content">
                <!-- <el-table v-for="item in loadCurrentList().slice((current-1)*size,current*size)" :key="item.problemSetId">
                </el-table> -->
                <el-table :data="loadCurrentList()" border width="100%">
                    <el-table-column prop="title" label="名称" width="" />
                    <el-table-column prop="desc" label="描述" width="" />
                    <el-table-column prop="startTime" label="开始时间" width="" />
                    <el-table-column prop="endTime" label="结束时间" width="" />
                    <el-table-column prop="duration" label="时长限制" width="" />
                    <el-table-column label="" width="100vw">
                        <template #default="scope">
                            <el-button size="small" @click="enterTest(scope.row.problemSetId)">进入测试</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
        </el-main>
        <el-footer>
            <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :current-page="current" :page-size="size" :total=99 layout="prev, pager, next, jumper" />
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
    name: "ProblemSet"
})


const emit = defineEmits(['page', 'testId'])
const enterTest = (id: string) => {
    emit('page', 3);
    emit('testId', id);
    console.log('进入测试: ', id)
}


const ProblemSetList = [{
    problemSetId: '001',
    title: '医学伦理问题',
    desc: '评估医学学生和医师在伦理方面的知识和决策能力。',
    startTime: '2024-04-10 13:00',
    endTime: '2024-04-10 14:20',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '002',
    title: '传染病病例分析',
    desc: '考察医学学生和医师对传染病病例的诊断和治疗能力。',
    startTime: '2024-04-11 09:30',
    endTime: '2024-04-11 10:50',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '003',
    title: '药理学知识考察',
    desc: '考察医学学生对药物作用机制和药物治疗的了解程度。',
    startTime: '2024-04-12 16:00',
    endTime: '2024-04-12 17:20',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '004',
    title: '医学影像解读',
    desc: '评估医学学生和医师对医学影像的解读和诊断能力。',
    startTime: '2024-04-13 10:30',
    endTime: '2024-04-13 11:50',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '005',
    title: '解剖学知识测试',
    desc: '评估医学学生对人体解剖学知识的掌握程度。',
    startTime: '2024-04-14 14:00',
    endTime: '2024-04-14 15:20',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '006',
    title: '实验室检查解读',
    desc: '考察医学学生和医师对实验室检查结果的解读和分析能力。',
    startTime: '2024-04-10 13:00',
    endTime: '2024-04-10 14:20',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '007',
    title: '临床诊断推理',
    desc: '评估医学学生和医师在临床实践中的诊断推理能力。',
    startTime: '2024-04-14 14:00',
    endTime: '2024-04-14 15:20',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '008',
    title: '医学研究方法',
    desc: '考察医学学生对医学研究设计和统计分析的了解程度。',
    startTime: '2024-04-10 13:00',
    endTime: '2024-04-10 14:20',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '009',
    title: '内科疾病诊治',
    desc: '评估医学学生和医师在内科疾病诊断和治疗方面的能力。',
    startTime: '2024-04-14 14:00',
    endTime: '2024-04-14 15:20',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '010',
    title: '外科手术技能',
    desc: '考察医学学生和医师在外科手术技能方面的掌握程度。',
    startTime: '2024-04-13 10:30',
    endTime: '2024-04-13 11:50',
    duration: '1h20min',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '011',
    title: '测试11',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '012',
    title: '测试12',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '013',
    title: '测试13',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '014',
    title: '测试14',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '015',
    title: '测试15',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '016',
    title: '测试16',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '017',
    title: '测试17',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
},
{
    problemSetId: '018',
    title: '测试18',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}

]
function sizeOfProblemSetList() {
    return ProblemSetList.length;
}
function loadCurrentList() {
    var currentList: { problemSetId: string; title: string; desc: string; startTime: string; endTime: string; duration: string; whiteList: string; problemIdList: never[] }[] = [];
    for (var i in ProblemSetList) {
        var index = ProblemSetList.indexOf(ProblemSetList[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            currentList.push(ProblemSetList[i]);
        }
    }
    console.log(currentList.length);
    return currentList;
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

</script>

<style scoped lang="scss">
.problemset-content {
    min-height: 500px;
    max-height: 500px;
}
</style>