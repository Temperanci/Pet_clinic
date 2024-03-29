<template>
    <div class="onlineTestLayout">
        <el-container>
            <el-container width="60%" >
                <el-header><h3>{{currentProblemRef.title}}</h3></el-header>
                <el-main>
                    <div class="problemContent">
                        <p>{{ currentProblemRef.content }}</p>
                        <el-radio-group v-if="currentProblemRef.type==='单选'">
                            <el-radio v-for="(choice,index) in currentProblemRef.choices" :key="index" :label="1" v-model="chosenAnswer">
                                {{ choice }}
                            </el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-else-if="currentProblemRef.type==='多选'">
                            <el-checkbox v-for="(choice,index) in currentProblemRef.choices" :key="index">
                                {{ choice }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-input v-else-if="currentProblemRef.type==='简答'" type="textarea" placeholder="在此输入答案" v-model="inputAnswer"/>
                    </div>
                </el-main>
                <el-footer>
                    <el-button @click="priorProblem()">上一题</el-button>
                    <el-button @click="nextProblem()">下一题</el-button>
                    <el-button @click="submit()">提交</el-button>
                </el-footer>
            </el-container>
            <el-aside>
                <div class="problemTable">
                    <div class="probleNumber" v-for="(problem,index) in ProblemList">
                        <el-button @click="jumpProblem(problem.problemId)">{{ index+1 }}</el-button>
                        
                    </div>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
    name: "Test",
})

function jumpProblem(n:string){
  var temp = ProblemList.find(pro => pro.problemId === n);
  if (temp != null){
    currentProblemRef.value = temp;
    console.log('跳转至题',currentProblem.problemId,currentProblem.title);
  }
}
function nextProblem(){
    console.log('下一题'); 
}
function priorProblem(){
    console.log('上一题'); 
}
function submit(){
    console.log('提交测试'); 
}



const ProblemList = [{
    problemId: '001',
    type: '单选',
    subjectId: '无',
    title: '这是一道单选题',
    content: '请选择一个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1','选项2','选项3','选项4']
},
{
    problemId: '002',
    type: '多选',
    subjectId: '无',
    title: '这是一道多选题',
    content: '请选择多个选项 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: ['选项1','选项2','选项3','选项4']
},
{
    problemId: '003',
    type: '简答',
    subjectId: '无',
    title: '这是一道简答题',
    content: '请在以下输入框内答题 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti magnam nam dolorem quidem earum ipsa perferendis possimus asperiores consequuntur at fuga aliquid neque laudantium libero, itaque ratione, nihil aut a!',
    choices: []
}
]

var currentProblem = ProblemList[0];
var currentProblemRef = ref(currentProblem);
var inputAnswer=ref('');
var chosenAnswer=ref(0);

const url = ''
</script>

<style scoped lang="scss">
    .onlineTestLayout{
        margin-left:10%; 
        margin-right:10%;
    };
    .problemTable{
        display: flex;
        flex-wrap: wrap;
    };
    .probleNumber{
        display: inline-block;
        text-align: center;
    }
</style>