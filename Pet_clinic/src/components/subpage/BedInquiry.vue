<template>
  <el-container style="margin-top: 2vw;">
    <el-aside style="margin-left: 5vw; z-index: 99;">
      <el-select v-model="value" placeholder="Select" style="margin-top: 3vw;">
        <el-option v-for="dep in departments" :key="dep.departmentId" :label="dep.name" :value="dep.name" 
         @click="selectDepartment(dep.departmentId)"/>
      </el-select>
      <el-table :data="bedList" style="width:100%; margin-top: 3vw;">
        <el-table-column prop="bedId" label="床位号" width="50%" />
        <el-table-column prop="location" label="位置" width="50%" />
      </el-table>
    </el-aside>
    <el-main style="margin-left: 10vw; margin-top: 2vw;">
      <div class="bed-image">
          <el-image style="width: 45vw; height: 25vw;" :src="url"/>
      </div>
    </el-main>
  </el-container>



</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
  name: "BedInquiry"
})

function selectDepartment(id: string) {
  var temp = departments.find(dep => dep.departmentId === id);
  if (temp != null) currentDepartment = temp;
  console.log(currentDepartment.departmentId);
}

const value = ref('')
var departments = [
  {
    departmentId: '001',
    name: '部门1',
    desc: '略'
  },
  {
    departmentId: '002',
    name: '部门2',
    desc: '略'
  },
  {
    departmentId: '003',
    name: '部门3',
    desc: '略'
  }
]
var currentDepartment = {
  departmentId: '001',
  name: '部门1',
  desc: '略'
}
var bedList = [
  {
    bedId: '001001',
    departmentId: '001',
    location: '001A'
  },
  {
    bedId: '001002',
    departmentId: '001',
    location: '001B'
  },
  {
    bedId: '001003',
    departmentId: '001',
    location: '001C'
  }
]

const fits = ['fill']
const url =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
