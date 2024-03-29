<template>
<p>
  {{ component.name }}
</p>
  
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

const component = defineComponent({
  name: "StudyManagement"
})

</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
