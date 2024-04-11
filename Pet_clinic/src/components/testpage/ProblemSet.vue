<template>
    <el-container>
        <el-main>
            <div class="problemset-content">
                <!-- <el-table v-for="item in loadCurrentList().slice((current-1)*size,current*size)" :key="item.problemSetId">
                </el-table> -->
                <el-table :data="loadCurrentList()" border width="">
                    <!-- <el-table-column prop="problemSetId" label="id" width="" /> -->
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
                :current-page="current" :page-size="size" :total=49 layout="prev, pager, next, jumper" />
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue'
import { pageQuery } from '@/apis/problemSet/problemSet';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';
import type { ProblemSetBO } from '@/apis/schemas';

defineComponent({
    name: "ProblemSet"
})

const ProblemSetPage = ref<ProblemSetPageResponse>({ datas: [], total: 0, limit: 0 });
var problemSetList = ref(ProblemSetPage.value?.datas);
async function fetchProblemSets() {
    try {
        const response = await pageQuery(1);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            const response = await pageQuery(i);
            if (response && response.data && response.data.datas) {
                ProblemSetPage.value = response.data;
                problemSetList.value = problemSetList.value.concat(ProblemSetPage.value.datas);
            }
            else {
                console.error('No data returned from the API');
            }
        }
        console.log("获取problemSetList:", problemSetList.value);
    } catch (error) {
        console.error('Error fetching problemSets:', error);
    }
}
onMounted(async () => {
    await fetchProblemSets();

});


const emit = defineEmits(['page', 'id'])
const enterTest = (id: string) => {
    emit('page', 3);
    emit('id', id);
    emit('id', id);
    console.log('进入测试: ', id)
}

function loadCurrentList() {
    const currentList: { problemSetId: string, title: string, desc: string, startTime: string, endTime: string, duration: string }[] = [];
    for (var i in problemSetList.value) {
        var index = problemSetList.value.indexOf(problemSetList.value[i])
        if (index >= current.value * 10 - 10 && index < current.value * 10) {
            const temp: { problemSetId: string, title: string, desc: string, startTime: string, endTime: string, duration: string } = {
                problemSetId: "",
                title: "",
                desc: "",
                startTime: "",
                endTime: "",
                duration: ""
            };
            temp.problemSetId = problemSetList.value[i].problemSetId;
            temp.title = problemSetList.value[i].title;
            temp.desc = problemSetList.value[i].desc;
            if (problemSetList.value[i].startTime != null) {
                temp.startTime = problemSetList.value[i].startTime?.toString()?.slice(0, 10) + ' ' + problemSetList.value[i].startTime?.toString()?.slice(11, 16);
            }
            if (problemSetList.value[i].endTime != null) {
                temp.endTime = problemSetList.value[i].endTime?.toString()?.slice(0, 10) + ' ' + problemSetList.value[i].endTime?.toString()?.slice(11, 16);;
            }
            if (problemSetList.value[i].duration != null) {
                temp.duration = problemSetList.value[i].duration?.toString();
            }
            currentList.push(temp);
        }
    }
    console.log("当前分页数据:", currentList);
    return currentList;
}

var current = ref(1);
var size = ref(10);
function handleCurrentChange(n: number) {
    current.value = n;
    console.log('当前页号:', n);
}
function handleSizeChange(n: number) {
    size.value = n;
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
</script>

<style scoped lang="scss">
.problemset-content {
    min-height: 500px;
    max-height: 500px;
}
</style>