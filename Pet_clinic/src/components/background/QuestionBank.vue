<template>
<p>
  {{ component.name }}
</p>
  
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'


const textColumnMap = new Map([
  ['departmentId', '科室编号'],
  ['name', '科室名'],
  ['location', '位置'],
])
const component = defineComponent({
  name: "QuestionBank"
})

</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
