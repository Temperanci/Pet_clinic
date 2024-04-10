<template>
  <div class="container" >
    <el-aside style="margin-left: 5vw; width: 30%;">
      <el-select v-model="currentDepartment.name" placeholder="Select" style="margin-top: 3vw;">
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
          <el-image style="width: 60%; height: 60%;" :src="'./01.png'"/>
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
  loadBedMap();
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
  var bedMapURL = '../../assets/img/bedMap/'+currentDepartmentRef.value.departmentId+'.png';
  console.log('床位图地址: ',bedMapURL);
  currentBedMap.value = bedMapURL;
}

var departments = [
{
    departmentId: '',
    name: '',
    desc: ''
  },
  {
    departmentId: '01',
    name: '门诊室',
    desc: '略'
  },
  {
    departmentId: '02',
    name: '治疗室',
    desc: '略'
  },
  {
    departmentId: '03',
    name: '手术准备室',
    desc: '略'
  },
  {
    departmentId: '04',
    name: '手术室',
    desc: '略'
  },
  {
    departmentId: '05',
    name: '住院部',
    desc: '略'
  }
]

var currentDepartment = departments[0];
var currentDepartmentRef = ref(currentDepartment);
var currentBedMap = ref('');

var bedList = [
  {
    bedId: '0101',
    departmentId: '01',
    location: '01A',
    availability: '不可用'

  },
  {
    bedId: '0102',
    departmentId: '01',
    location: '01B',
    availability: '可用'
  },
  {
    bedId: '0103',
    departmentId: '01',
    location: '01C',
    availability: '可用'
  },
  {
    bedId: '0104',
    departmentId: '01',
    location: '01D',
    availability: '不可用'
  },
  {
    bedId: '0105',
    departmentId: '01',
    location: '01E',
    availability: '不可用'
  },
  {
    bedId: '0201',
    departmentId: '02',
    location: '02A',
    availability: '可用'

  }

]


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
