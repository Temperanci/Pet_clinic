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
        console.log("total=", response.data.total, " limit=", response.data.limit);
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
    console.log('进入测试:', id)
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
                var hour = Math.floor(problemSetList.value[i].duration/(1000*60*60));
                var min = Math.floor(problemSetList.value[i].duration/(1000*60) - hour*60);
                temp.duration = hour+"h"+min+"min";
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

</script>

<style scoped lang="scss">
.problemset-content {
    min-height: 500px;
    max-height: 500px;
}
</style>