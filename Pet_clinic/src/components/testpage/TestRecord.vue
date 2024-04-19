<template>
    <div>
        用户id:{{ userId }}
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref, onMounted } from 'vue';
import {accout} from '@/scripts/data'
import {store} from '@/main'
import {StorageToken} from '@/scripts/storage'
import { Personnel } from '@/apis/class';
import { pageQuery as testRecordQuery } from '@/apis/testRecord/testRecord';
import { pageQuery as problemSetQuery } from '@/apis/problem/problem';
import { pageQuery as problemQuery } from '@/apis/problem/problem';
import { pageQuery as diseaseQuery } from '@/apis/disease/disease';
import type { TestRecordPageRequest, TestRecordPageResponse } from '@/apis/testRecord/testRecord-interface';
import type { ProblemSetPageRequest, ProblemSetPageResponse } from '@/apis/problemSet/problemSet-interface';
import type { ProblemPageRequest, ProblemPageResponse } from '@/apis/problem/problem-interface';
import type { DiseasePageRequest, DiseasePageResponse } from '@/apis/disease/disease-interface';
import type { TestRecordBO, ProblemSetBO, ProblemBO, DiseaseBO } from '@/apis/schemas';
import { TestRecord, ProblemSet, Problem, Disease } from "@/apis/class";

defineComponent({
    name: "TestRecord",
})

// const userId = ref(store.state.token.id);
const problemList = ref<ProblemBO[]>([]);
const diseaseList = ref<DiseaseBO[]>([]);
async function fetchProblems() {
    try {
        const request: ProblemPageRequest = { currPageNo: 1 };
        const response = await problemQuery(request);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            request.currPageNo = i;
            const response = await problemQuery(request);
            if (response && response.data && response.data.datas) {
                for (var j in response.data.datas) { //单选题内容换行
                    response.data.datas[j].content = (response.data.datas[j].content ?? '').replace(/(A\.|B\.|C\.|D\.)/g, '\n$1');
                }
                problemList.value = problemList.value.concat(response.data.datas);
            } else {
                console.error('No data returned from the API');
            }
        }
        console.log("获取problemList:", problemList.value);
        setTimeout(() => {
            resultList.value = JSON.parse(JSON.stringify(problemList.value));
            for (var pro of resultList.value) {
                pro.subjectName = diseaseList.value.find(dis => dis.diseaseId === pro.subjectId)?.name;
                if (pro.type === 'subjective') {
                    pro.typeName = '简答';
                } else if (pro.type === 'objective') {
                    pro.typeName = '单选';
                }
            }
        }, 50);

    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}
async function fetchDiseases() {
    try {
        const request: DiseasePageRequest = { currPageNo: 1 };
        const response = await diseaseQuery(request);
        const pages = Math.ceil(response.data.total / response.data.limit); //总页数
        console.log("total=", response.data.total, " limit=", response.data.limit);
        for (var i = 1; i <= pages; i++) {
            request.currPageNo = i;
            const response = await diseaseQuery(request);
            if (response && response.data && response.data.datas) {
                diseaseList.value = diseaseList.value.concat(response.data.datas);
            } else {
                console.error('No data returned from the API');
            }
        }

    } catch (error) {
        console.error('Error fetching diseases:', error);
    }
}



</script>

<style scoped lang="scss">

</style>