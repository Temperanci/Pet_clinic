<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="80%">
                <el-header>
                    <h3>{{ currentProblemRef.title }}</h3>
                </el-header>
                <el-main>
                    <div class="problemContent">
                        <p>{{ currentProblemRef.content }}</p>
                        <el-radio-group v-if="currentProblemRef.type === '单选'" v-model="chosenAnswer">
                            <el-radio v-for="(choice, index) in currentProblemRef.choices" :key="index"
                                :label="index + 1">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-else-if="currentProblemRef.type === '多选'" v-model="chosenAnswers">
                            <el-checkbox v-for="(choice, index) in currentProblemRef.choices" :key="index"
                                :label="index + 1">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-input v-else-if="currentProblemRef.type === '简答'" type="textarea" placeholder="在此输入答案"
                            v-model="inputAnswer" />
                    </div>
                </el-main>
                <el-footer>
                    <div class="testButton">
                        <el-button @click="priorProblem()">上一题</el-button>
                        <el-button @click="nextProblem()">下一题</el-button>
                        <!-- <el-button @click="">提交</el-button> -->
                    </div>

                </el-footer>
            </el-container>
            <el-aside>
                <div class="searchResultList">
                    <h4>搜索结果</h4>
                    <el-table :data="ProblemList" style="">
                        <el-table-column prop="title" label="题目" />
                        <el-table-column prop="subjectId" label="知识点" />
                        <el-table-column prop="type" label="题型" />
                        <el-table-column label="" width="100px">
                            <template #default="scope">
                                <el-button size="small"
                                    @click="chooseSingleProblem(scope.row.problemId)">选择</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination background layout="prev, pager, next" :total="50" />
                </div>
            </el-aside>

            <el-aside>
                <div class="searchSingleProblerm">
                    <h4>筛选题目</h4>
                    <el-input type="textarea" placeholder="在此输入题目标题" v-model="searchTitle" />
                    <p>题目类型</p>
                    <el-cascader placeholder="题目类型" :options="typeOptions" filterable />
                    <p>病种知识点</p>
                    <el-cascader placeholder="病种知识点" :options="subjectOptions" filterable />

                    <el-button style="margin-top: 50px;">查找相关题目</el-button>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
    name: "SingleProblem",
})

function chooseSingleProblem(id: number) {
    var temp = ProblemList.find(pro => pro.problemId === id);
    if (temp != null) currentProblemRef.value = temp;
    console.log("选择题目: ",currentProblemRef.value.problemId);
}

function jumpProblem(n: number) {
    var temp = ProblemList.find(pro => pro.problemId === n);
    if (temp != null) {
        currentProblemRef.value = temp;
        console.log('跳转至题', currentProblemRef.value.problemId, currentProblemRef.value.title);
    } else {
        console.log('跳转失败');
    }
}
function nextProblem() {
    jumpProblem(currentProblemRef.value.problemId + 1)
    console.log('下一题');
}
function priorProblem() {
    jumpProblem(currentProblemRef.value.problemId - 1)
    console.log('上一题');
}

const ProblemList = [{
    problemId: 1,
    type: '单选',
    subjectId: '病种一',
    title: '这是一道单选题',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
},
{
    problemId: 2,
    type: '多选',
    subjectId: '无病种一',
    title: '这是一道多选题',
    content: '请选择多个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
},
{
    problemId: 3,
    type: '简答',
    subjectId: '病种三',
    title: '这是一道简答题',
    content: '请在以下输入框内答题 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: []
},
{
    problemId: 4,
    type: '单选',
    subjectId: '无',
    title: '题3',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
},
{
    problemId: 5,
    type: '单选',
    subjectId: '病种二',
    title: '题5',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
},
{
    problemId: 6,
    type: '单选',
    subjectId: '无',
    title: '题6',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
},
{
    problemId: 7,
    type: '单选',
    subjectId: '病种七',
    title: '题7',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
},
{
    problemId: 8,
    type: '单选',
    subjectId: '无',
    title: '题8',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
},
{
    problemId: 9,
    type: '单选',
    subjectId: '无',
    title: '题9',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1', '选项2', '选项3', '选项4']
}
]

const typeOptions = [
    {
        value: '单选题',
        label: '单选题'
    },
    {
        value: '多选题',
        label: '多选题'
    },
    {
        value: '简答题',
        label: '简答题'
    }
];

const subjectOptions = [
    {
        value: '01',
        label: '大类一',
        children: [
            {
                value: '0101',
                label: '病种一'
            },
            {
                value: '0102',
                label: '病种二'
            },
            {
                value: '0103',
                label: '病种三'
            }
        ]
    },
    {
        value: '02',
        label: '大类二',
        children: [
            {
                value: '0201',
                label: '病种四'
            }
        ]
    },
    {
        value: '03',
        label: '大类三',
        children: [
            {
                value: '',
                label: ''
            }
        ]
    }
]

var currentProblem = ProblemList[0];
var currentProblemRef = ref(currentProblem);
var inputAnswer = ref('');
var chosenAnswer = ref(0);
var chosenAnswers = ref([0]);
var searchTitle = ref('');

const url = ''
</script>

<style scoped lang="scss">
.onlineTestLayout {
    margin-left: 5%;
    margin-right: 5%;
}

;

.problemContent {
    padding: 0 6vw;
}

;

.searchSingleProblerm {
    display: flex;
    flex-direction: column;
    padding: 2vw;
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