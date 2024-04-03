<template>
    <el-container>
        <el-main>

        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
    name: "SingleProblem",
})



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
}
]

const url = ''
</script>

<style scoped lang="scss"></style>