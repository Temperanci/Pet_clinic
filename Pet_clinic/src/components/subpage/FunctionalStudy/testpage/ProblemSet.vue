<template>
    <el-container>
        <el-main>
            <el-table :data="ProblemSetList" border width="100%">
                <el-table-column prop="title" label="名称" width=""/>
                <el-table-column prop="desc" label="描述" width=""/>
                <el-table-column prop="startTime" label="开始时间" width=""/>
                <el-table-column prop="endTime" label="结束时间" width=""/>
                <el-table-column prop="duration" label="时长限制" width=""/>
                <el-table-column label="" width="100vw">
                    <template #default="scope">
                        <el-button size="small" @click="enterTest(scope.$index, scope.row)">进入测试</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-main>
        <el-footer>
            <el-pagination background layout="prev, pager, next" :total="100" />
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
    name: "ProblemSet",
})

const enterTest = (index: number, row: number) => {
  console.log(index, row)
}


const ProblemSetList = [{
    problemSetId: '001',
    title: '测试1',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '002',
    title: '测试2',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '003',
    title: '测试3',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '002',
    title: '测试2',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '003',
    title: '测试3',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '002',
    title: '测试2',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}, {
    problemSetId: '003',
    title: '测试3',
    desc: '略',
    startTime: '',
    endTime: '',
    duration: '',
    whiteList: '',
    problemIdList: []
}
]

const url = ''
</script>

<style scoped lang="scss"></style>