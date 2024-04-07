<template>
  <div class="container" >
    <el-aside style="margin-left: 5vw; width: 30%;">
      <el-select v-model="value" placeholder="Select" style="margin-top: 3vw;">
        <el-option v-for="dep in departments" :key="dep.departmentId" :label="dep.name" :value="dep.name"
         @click="selectDepartment(dep.departmentId)"/>
      </el-select>
      <el-table :data="loadBedList()" style="margin-top: 3vw;">
        <el-table-column prop="bedId" label="床位号"/>
        <el-table-column prop="location" label="位置"/>
        <el-table-column prop="availability" label="使用状况"/>
      </el-table>
    </el-aside>
    <el-main style="margin-left: 5vw;">
      <h3 style="color:grey; text-align:center; font-size:20px">{{ currentDepartmentRef.name }} 床位图</h3>
      <div class="bed-image" style="display: flex; justify-content:center;">
          <el-image style="width: 60%; height: 60%;" :src="url"/>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
  name: "BedInquiry"
})

// 选择科室
function selectDepartment(id: string) {
  var temp = departments.find(dep => dep.departmentId === id);
  if (temp != null) currentDepartmentRef.value = temp;
  console.log(currentDepartmentRef.value.name);
}

// 返回所选科室的床位列表
function loadBedList(){
  var currentBedList:{bedId:string;departmentId:string;location:string;availability:boolean}[]=[];
  for(var index in bedList){
    if(bedList[index].departmentId==currentDepartmentRef.value.departmentId){
      currentBedList.push(bedList[index]);
    }
  }
  return currentBedList;
}

// 返回所选科室的床位图
function loadBedMap(){
  return url;
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
var currentDepartment = departments[0];
var currentDepartmentRef = ref(currentDepartment);

var bedList = [
  {
    bedId: '001001',
    departmentId: '001',
    location: '001A',
    availability: true

  },
  {
    bedId: '001002',
    departmentId: '001',
    location: '001B',
    availability: true
  },
  {
    bedId: '001003',
    departmentId: '001',
    location: '001C',
    availability: false
  },
  {
    bedId: '001004',
    departmentId: '001',
    location: '001D',
    availability: false
  },
  {
    bedId: '001005',
    departmentId: '001',
    location: '001E',
    availability: false
  },
  {
    bedId: '002001',
    departmentId: '002',
    location: '002A',
    availability: true

  }

]

const fits = ['fill']
const url =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
</script>

<style scoped lang="scss">
.container{
  height: 65vh;
  width: 100%;
  border:solid lightgrey 2px;
  border-radius: 30px;
  display: flex;
}
</style>
